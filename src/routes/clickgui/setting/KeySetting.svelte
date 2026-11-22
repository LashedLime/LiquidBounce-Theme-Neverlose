<script lang="ts">
    import type {KeySetting, ModuleSetting} from "../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import {getPrintableKeyName} from "../../../integration/rest";
    import {createEventDispatcher} from "svelte";
    import {listen} from "../../../integration/ws";
    import type {KeyboardKeyEvent, MouseButtonEvent} from "../../../integration/events";
    import {isClickGuiScreen, UNKNOWN_KEY} from "../../../util/utils";
    import {escapeLayer} from "../../../integration/escape";

    export let setting: ModuleSetting;

    const cSetting = setting as KeySetting;

    const dispatch = createEventDispatcher();

    let isHovered = false;
    let binding = false;
    let printableKeyName = "";

    $: {
        if (cSetting.value !== UNKNOWN_KEY) {
            getPrintableKeyName(cSetting.value)
                .then(printableKey => {
                    printableKeyName = printableKey.localized;
                });
        }
    }

    async function toggleBinding() {
        if (binding) {
            cSetting.value = UNKNOWN_KEY;
        }

        binding = !binding;

        setting = {...cSetting};

        dispatch("change");
    }

    const layer = escapeLayer(toggleBinding);
    $: layer.setOpen(binding);

    listen("keyboardKey", async (e: KeyboardKeyEvent) => {
        if (!isClickGuiScreen(e.screen)) {
            return;
        }

        if (!binding) {
            return;
        }

        binding = false;

        if (e.keyCode !== 27 /* SDLK_ESCAPE */) {
            cSetting.value = e.key;
        } else {
            cSetting.value = UNKNOWN_KEY;
        }

        setting = {...cSetting};

        dispatch("change");
    });

    listen("mouseButton", async (e: MouseButtonEvent) => {
        if (!isClickGuiScreen(e.screen)) {
            return;
        }

        if (!binding || (e.button === 1 /* SDL_BUTTON_LEFT */ && isHovered)) {
            return;
        }

        binding = false;

        cSetting.value = e.key;

        setting = {...cSetting};

        dispatch("change");
    })
</script>

<div class="setting">
    <button
            class="change-bind"
            class:binding
            on:click={toggleBinding}
            on:mouseenter={() => isHovered = true}
            on:mouseleave={() => isHovered = false}
    >
        {#if !binding}
            <div class="name">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</div>

            {#if cSetting.value === UNKNOWN_KEY}
                <span class="none">None</span>
            {:else}
                <span class="key">{printableKeyName}</span>
            {/if}
        {:else}
            <span class="binding-text">Press any key</span>
        {/if}
    </button>
</div>

<style lang="scss">

  .setting {
    padding: 6px 0;
  }

  .change-bind {
    background-color: color-mix(in srgb, #ffffff 3%, transparent);
    border: solid 1px var(--border-color);
    border-radius: 7px;
    cursor: pointer;
    padding: 6px 8px;
    font-weight: 500;
    color: var(--clickgui-text-color);
    font-size: 11.5px;
    font-family: "Inter", sans-serif;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 5px;
    transition: ease border-color .15s, ease background-color .15s;

    &:hover {
      border-color: var(--border-strong-color);
      background-color: color-mix(in srgb, #ffffff 5%, transparent);
    }

    &.binding {
      border-color: var(--accent-color);
      color: var(--accent-color);
      justify-content: center;
    }

    .name {
      font-weight: 500;
    }

    .key {
      color: var(--clickgui-text-dimmed-color);
      font-size: 11px;
    }

    .none {
      color: var(--clickgui-text-dimmed-color);
      font-size: 11px;
    }
  }
</style>
