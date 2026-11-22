<script lang="ts">
    import {onMount} from "svelte";
    import GenericSetting from "./setting/common/GenericSetting.svelte";
    import {getModuleSettings, setModuleSettings} from "../../integration/rest";
    import type {ConfigurableSetting} from "../../integration/types";
    import {bringSettingsPanelToFront, closeSettingsPanel} from "./settings_panels";
    import {scaleFactor} from "./clickgui_store";
    import {convertToSpacedString, spaceSeperatedNames} from "../../theme/theme_config";

    export let name: string;
    export let x: number;
    export let y: number;
    export let zIndex: number;

    const panelPath = `clickgui.${name}`;

    let panelElement: HTMLElement;
    let configurable: ConfigurableSetting | undefined;
    let posX = x;
    let posY = y;
    let dragging = false;
    let grabX = 0;
    let grabY = 0;

    onMount(async () => {
        configurable = await getModuleSettings(name);
    });

    async function updateSettings() {
        if (!configurable) {
            return;
        }

        await setModuleSettings(name, configurable);
    }

    function startDrag(event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }

        event.stopPropagation();
        bringSettingsPanelToFront(name);

        const bounds = panelElement.getBoundingClientRect();
        grabX = event.clientX - bounds.left;
        grabY = event.clientY - bounds.top;
        dragging = true;
    }

    function moveDrag(event: MouseEvent) {
        if (!dragging) {
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

<svelte:window on:mousemove={moveDrag} on:mouseup={endDrag}/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        class="settings-panel"
        bind:this={panelElement}
        style="left: {posX}px; top: {posY}px; z-index: {zIndex};"
        on:mousedown={() => bringSettingsPanelToFront(name)}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="panel-head" on:mousedown={startDrag}>
        <span class="title">{$spaceSeperatedNames ? convertToSpacedString(name) : name}</span>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="close" on:click={() => closeSettingsPanel(name)}></button>
    </div>

    <div class="panel-body">
        {#if configurable}
            {#each configurable.value as setting (setting.name)}
                <GenericSetting path={panelPath} bind:setting on:change={updateSettings}/>
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">

  .settings-panel {
    position: absolute;
    width: 264px;
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
    padding: 12px 12px 10px 15px;
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
    opacity: 0;
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

    &:hover::before,
    &:hover::after {
      background-color: var(--clickgui-text-color);
    }
  }

  .settings-panel:hover .close {
    opacity: 0.6;
  }

  .settings-panel:hover .close:hover {
    opacity: 1;
  }

  .panel-body {
    padding: 4px 15px 12px;
    max-height: 60vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 3px;
    }
  }
</style>
