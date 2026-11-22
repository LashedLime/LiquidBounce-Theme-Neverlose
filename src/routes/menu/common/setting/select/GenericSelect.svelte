<script lang="ts">
    import {quintOut} from "svelte/easing";
    import {fade} from "svelte/transition";
    import {escapeLayer} from "../../../../../integration/escape";

    export let closeOnInternalClick: boolean;

    let expanded = false;
    let selectElement: HTMLElement;
    let headerElement: HTMLElement;

    function handleWindowClick(e: MouseEvent) {
        if (!selectElement.contains(e.target as Node)) {
            expanded = false;
        }
    }

    function handleSelectClick(e:MouseEvent) {
        if (closeOnInternalClick) {
            expanded = !expanded;
        } else {
            if (!expanded) {
                expanded = true;
            } else {
                expanded = !headerElement.contains(e.target as Node);
            }
        }
    }

    const layer = escapeLayer(() => expanded = false);
    $: layer.setOpen(expanded);
</script>

<svelte:window on:click={handleWindowClick}/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="select" class:expanded bind:this={selectElement} on:click={handleSelectClick}>
    <div class="header" bind:this={headerElement}>
        <span class="title">
            <slot name="title"/>
        </span>
        <img src="img/menu/icon-select-arrow.svg" alt="expand">
    </div>
    {#if expanded}
        <div class="options" transition:fade|global={{ duration: 200, easing: quintOut }}>
            <slot name="options"></slot>
        </div>
    {/if}
</div>

<style lang="scss">

  .select {
    cursor: pointer;
    min-width: 170px;
    position: relative;

    &.expanded {
      .header {
        border-radius: 8px 8px 0 0;
      }
    }
  }

  .header {
    background-color: var(--menu-select-header-background-color);
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

    .title {
      color: var(--menu-text-color);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  .options {
    position: absolute;
    z-index: 1000;
    top: 100%;
    left: 0;
    min-width: 100%;
    width: max-content;
    border-radius: 0 0 8px 8px;
    border: solid 1px var(--menu-panel-border-color);
    border-top: none;
    max-height: 220px;
    overflow: auto;
    background-color: var(--menu-select-options-background-color);
    box-shadow: 0 14px 30px var(--menu-panel-shadow-color);
    backdrop-filter: blur(24px) saturate(140%);
  }
</style>