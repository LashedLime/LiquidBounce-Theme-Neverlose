<script lang="ts">
    import {onMount, untrack} from "svelte";
    import {getModuleSettings, getPrintableKeyName, setModuleSettings} from "../../integration/rest";
    import type {BindSetting, BooleanSetting, ConfigurableSetting} from "../../integration/types";
    import {bringKeybindPanelToFront, closeKeybindPanel} from "./keybind_panels";
    import {scaleFactor} from "./clickgui_store";
    import {convertToSpacedString, spaceSeperatedNames} from "../../theme/theme_config";
    import {listen} from "../../integration/ws";
    import type {KeyboardKeyEvent, MouseButtonEvent} from "../../integration/events";
    import {isClickGuiScreen, UNKNOWN_KEY} from "../../util/utils";
    import {escapeLayer} from "../../integration/escape";
    import MenuIcon from "./MenuIcon.svelte";

    let {name, x, y, zIndex}: { name: string; x: number; y: number; zIndex: number } = $props();

    let panelElement = $state<HTMLElement | null>(null);
    let posX = $state(untrack(() => x));
    let posY = $state(untrack(() => y));
    let dragging = $state(false);
    let grabX = 0;
    let grabY = 0;

    let configurable = $state<ConfigurableSetting | null>(null);
    let bind = $state<BindSetting | null>(null);
    let hidden = $state<BooleanSetting | null>(null);
    let keyLabel = $state("Unbound");
    let binding = $state(false);
    let bindingSince = 0;

    onMount(async () => {
        try {
            configurable = await getModuleSettings(name);
        } catch {
            configurable = null;
        }

        bind = (configurable?.value.find(setting => setting.name === "Bind") as BindSetting | undefined) ?? null;
        hidden = (configurable?.value.find(setting => setting.name === "Hidden") as BooleanSetting | undefined) ?? null;
        refreshKeyLabel();
    });

    async function refreshKeyLabel() {
        const boundKey = bind?.value.boundKey;

        if (!boundKey || boundKey === UNKNOWN_KEY) {
            keyLabel = "Unbound";
            return;
        }

        try {
            keyLabel = (await getPrintableKeyName(boundKey)).localized;
        } catch {
            keyLabel = boundKey.replace(/^key\.(keyboard|mouse)\./, "").replace(/\./g, " ");
        }
    }

    async function save() {
        if (!configurable) {
            return;
        }

        await setModuleSettings(name, configurable);
    }

    async function setBoundKey(key: string) {
        if (!bind) {
            return;
        }

        bind.value.boundKey = key;
        bind = {...bind};
        binding = false;

        await refreshKeyLabel();
        await save();
    }

    function startBinding() {
        if (binding) {
            binding = false;
            refreshKeyLabel();
            return;
        }

        binding = true;
        bindingSince = Date.now();
    }

    async function toggleHidden() {
        if (!hidden) {
            return;
        }

        hidden.value = !hidden.value;
        hidden = {...hidden};

        await save();
    }

    async function resetBind() {
        await setBoundKey(UNKNOWN_KEY);
    }

    const layer = escapeLayer(() => {
        if (binding) {
            startBinding();
            return;
        }

        closeKeybindPanel();
    });

    $effect(() => layer.setOpen(binding));

    listen("keyboardKey", async (e: KeyboardKeyEvent) => {
        if (!binding || !isClickGuiScreen(e.screen)) {
            return;
        }

        if (e.keyCode === 27 /* SDLK_ESCAPE */) {
            startBinding();
            return;
        }

        await setBoundKey(e.key);
    });

    listen("mouseButton", async (e: MouseButtonEvent) => {
        // The click which started the binding must not become the bind itself
        if (!binding || Date.now() - bindingSince < 250 || !isClickGuiScreen(e.screen)) {
            return;
        }

        await setBoundKey(e.key);
    });

    function startDrag(event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }

        event.stopPropagation();
        bringKeybindPanelToFront();

        const bounds = panelElement?.getBoundingClientRect();
        if (!bounds) {
            return;
        }

        grabX = event.clientX - bounds.left;
        grabY = event.clientY - bounds.top;
        dragging = true;
    }

    function moveDrag(event: MouseEvent) {
        if (!dragging || !panelElement) {
            return;
        }

        const scale = $scaleFactor * 0.5;
        const maxX = Math.max(window.innerWidth / scale - panelElement.offsetWidth, 0);
        const maxY = Math.max(window.innerHeight / scale - panelElement.offsetHeight, 0);

        posX = Math.min(Math.max((event.clientX - grabX) / scale, 0), maxX);
        posY = Math.min(Math.max((event.clientY - grabY) / scale, 0), maxY);
    }

    function endDrag() {
        dragging = false;
    }
</script>

<svelte:window onmousemove={moveDrag} onmouseup={endDrag}/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
        class="keybind-panel"
        bind:this={panelElement}
        style="left: {posX}px; top: {posY}px; z-index: {zIndex};"
        onmousedown={() => bringKeybindPanelToFront()}
>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="panel-head" role="presentation" onmousedown={startDrag}>
        <span class="title">{$spaceSeperatedNames ? convertToSpacedString(name) : name}</span>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="close" onclick={() => closeKeybindPanel()}></button>
    </div>

    <div class="panel-body">
        <button class="row" class:binding type="button" onclick={startBinding}>
            <MenuIcon name="keyboard"/>
            <span class="label">Key</span>
            <span class="value" class:accent={binding}>
                {binding ? "Press any key..." : keyLabel}
            </span>
        </button>

        {#if hidden}
            <button class="row" type="button" onclick={toggleHidden}>
                <MenuIcon name="eye"/>
                <span class="label">Visible</span>
                <span class="switch" class:on={!hidden.value}>
                    <span class="knob"></span>
                </span>
            </button>
        {/if}

        <div class="divider"></div>

        <button class="row danger" type="button" onclick={resetBind}>
            <MenuIcon name="trash"/>
            <span class="label">Reset</span>
        </button>
    </div>
</div>

<style lang="scss">
  .keybind-panel {
    position: absolute;
    width: 232px;
    pointer-events: auto;
    background-color: var(--clickgui-panel-body-background-color);
    backdrop-filter: blur(24px) saturate(150%);
    border: solid 1px var(--border-color);
    border-radius: 14px;
    box-shadow: 0 24px 60px var(--clickgui-panel-shadow-color);
    overflow: hidden;
    user-select: none;
  }

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 10px;
    padding: 11px 11px 9px 14px;
    border-bottom: solid 1px var(--border-color);

    .title {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--clickgui-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .close {
    all: unset;
    width: 14px;
    height: 14px;
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
    opacity: 0.6;
    transition: ease opacity 0.15s;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 9px;
      height: 1.5px;
      border-radius: 2px;
      background-color: var(--clickgui-text-dimmed-color);
    }

    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &:hover {
      opacity: 1;

      &::before,
      &::after {
        background-color: var(--clickgui-text-color);
      }
    }
  }

  .panel-body {
    padding: 6px;
  }

  .row {
    all: unset;
    display: flex;
    align-items: center;
    column-gap: 11px;
    width: 100%;
    box-sizing: border-box;
    padding: 9px 8px;
    border-radius: 9px;
    cursor: pointer;
    color: var(--clickgui-nav-item-color);
    font-family: "Inter", sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    transition: ease background-color 0.14s, ease color 0.14s;

    .label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .value {
      font-size: 11.5px;
      color: var(--clickgui-text-dimmed-color);
      transition: ease color 0.14s;

      &.accent {
        color: var(--accent-color);
      }
    }

    &:hover,
    &.binding {
      background-color: color-mix(in srgb, #ffffff 8%, transparent);
      color: var(--clickgui-text-color);

      .value {
        color: var(--accent-color);
      }
    }

    &.danger:hover {
      color: #ff5f5f;
    }
  }

  .divider {
    height: 1px;
    margin: 6px 8px;
    background-color: var(--clickgui-card-divider-color);
  }

  .switch {
    position: relative;
    flex-shrink: 0;
    width: 34px;
    height: 19px;
    border-radius: 999px;
    background-color: var(--clickgui-switch-track-color);
    transition: ease background-color 0.2s;

    .knob {
      position: absolute;
      top: 50%;
      left: 2.5px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: var(--clickgui-switch-thumb-color);
      transform: translateY(-50%);
      transition: transform 0.2s cubic-bezier(0.3, 0.9, 0.3, 1), ease background-color 0.2s;
    }

    &.on {
      background-color: var(--clickgui-switch-track-active-color);

      .knob {
        transform: translate(15px, -50%);
        background-color: var(--clickgui-switch-thumb-active-color);
      }
    }
  }
</style>
