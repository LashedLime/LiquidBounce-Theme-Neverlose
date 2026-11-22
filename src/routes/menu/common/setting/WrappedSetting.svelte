<script lang="ts">
    import type {BooleanSetting as TBooleanSetting, ModuleSetting,} from "../../../../integration/types";
    import {fade} from "svelte/transition";
    import SwitchSetting from "./SwitchSetting.svelte";
    import GenericSetting from "../../../clickgui/setting/common/GenericSetting.svelte";
    import {quintOut} from "svelte/easing";
    import {convertToSpacedString} from "../../../../theme/theme_config";
    import {escapeLayer} from "../../../../integration/escape";

    interface Props {
        value: NesterSetting,
        path: string
    }

    interface NesterSetting {
        name: string;
        valueType: string;
        value: ModuleSetting[];
    }

    const {value = $bindable(), path}: Props = $props();

    const enabledSetting = value.value[0] as TBooleanSetting;

    let expanded = $state(false);
    let wrappedSettingElement: HTMLElement;
    let headerElement: HTMLElement;

    function handleWrapperClick(e: MouseEvent) {
        if (!expanded) {
            expanded = true;
        } else {
            expanded = !headerElement.contains(e.target as Node);
        }
    }

    function handleWindowClick(e: MouseEvent) {
        if (!wrappedSettingElement) return;

        const node = e.target as HTMLElement;

        if (!wrappedSettingElement.contains(node)
            && !node.classList.contains("option")) { // Don't close when a select option is pressed
            expanded = false;
        }
    }

    const layer = escapeLayer(() => expanded = false);
    $effect(() => layer.setOpen(expanded));
</script>

<svelte:window on:click={handleWindowClick}/>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wrapped-setting" class:expanded class:has-nested-settings={value.value.length > 0}
     onclick={handleWrapperClick} bind:this={wrappedSettingElement}>
    <div class="header" bind:this={headerElement}>
        {#if value.valueType === "TOGGLEABLE"}
            <SwitchSetting title={convertToSpacedString(value.name)} bind:value={enabledSetting.value}/>
        {:else if value.valueType === "CONFIGURABLE"}
            <span class="configurable-title">{convertToSpacedString(value.name)}</span>
        {:else }
            Unsupported value type {value.valueType}
        {/if}
        {#if value.value.length > 0}
            <img src="img/menu/icon-select-arrow.svg" alt="expand">
        {/if}
    </div>

    {#if expanded && value.value.length > 0}
        <div class="nested-settings" transition:fade|global={{ duration: 200, easing: quintOut }}>
            {#each value.value as setting, i (setting.name)}
                <GenericSetting {path} bind:setting={value.value[i]} on:change/>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">

  .configurable-title {
    color: var(--menu-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .wrapped-setting {
    position: relative;
    min-width: 170px;

    &.expanded {
      .header {
        border-radius: 8px 8px 0 0;
      }
    }

    &.has-nested-settings {
      cursor: pointer;

      .header {
        background-color: var(--menu-wrapped-setting-header-background-color);
        padding: 8px 11px;
        display: flex;
        column-gap: 10px;
        align-items: center;
        justify-content: space-between;
        border-radius: 8px;
        transition: ease border-radius .2s, ease background-color .15s;

        &:hover {
          background-color: color-mix(in srgb, var(--accent-color) 12%, transparent);
        }

        img {
          width: 10px;
        }
      }
    }
  }

  .nested-settings {
    position: absolute;
    z-index: 1000;
    top: 100%;
    left: 0;
    border-radius: 0 0 8px 8px;
    border: solid 1px var(--menu-panel-border-color);
    border-top: none;
    background-color: var(--menu-wrapped-setting-content-background-color);
    padding: 8px;
    min-width: 260px;
    max-height: 320px;
    overflow: auto;
    box-shadow: 0 14px 30px var(--menu-panel-shadow-color);
    backdrop-filter: blur(24px) saturate(140%);
  }
</style>

