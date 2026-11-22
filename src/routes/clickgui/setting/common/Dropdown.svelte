<script lang="ts">
    import {createEventDispatcher, tick} from "svelte";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../../theme/theme_config";
    import {escapeLayer} from "../../../../integration/escape";

    export let name: string | null;
    export let options: string[];
    export let value: string;

    const dispatch = createEventDispatcher();

    let expanded = false;
    let dropdownHead: HTMLElement;
    let optionsStyle = "";

    function portal(node: HTMLElement) {
        document.body.appendChild(node);

        return {
            destroy: () => node.remove()
        };
    }

    function windowClickHide(e: MouseEvent) {
        if (!dropdownHead.contains(e.target as Node)) {
            expanded = false;
        }
    }

    function updateValue(v: string) {
        value = v;
        expanded = false;
        dispatch("change");
    }

    async function toggleExpanded() {
        expanded = !expanded;
        if (!expanded) {
            return;
        }

        await tick();
        updateOptionsPosition();
    }

    function updateOptionsPosition() {
        if (!expanded) {
            return;
        }

        const bounds = dropdownHead.getBoundingClientRect();
        const scale = bounds.width / dropdownHead.offsetWidth;
        optionsStyle = [
            `left: ${bounds.left}px`,
            `top: ${bounds.bottom + 4}px`,
            `width: ${dropdownHead.offsetWidth}px`,
            `--dropdown-scale: ${scale}`
        ].join(";");
    }

    function closeDropdown() {
        expanded = false;
    }

    const layer = escapeLayer(closeDropdown);
    $: layer.setOpen(expanded);
</script>

<svelte:window
        on:click={windowClickHide}
        on:resize={updateOptionsPosition}
        on:scroll|capture={closeDropdown}
/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="dropdown" class:expanded>
    <div class="head" bind:this={dropdownHead} on:click={toggleExpanded}>
        {#if name !== null}
            <span class="text">{$spaceSeperatedNames ? convertToSpacedString(name) : name}
                &bull; {$spaceSeperatedNames ? convertToSpacedString(value) : value}</span>
        {:else}
            <span class="text">{$spaceSeperatedNames ? convertToSpacedString(value) : value}</span>
        {/if}
    </div>

    {#if expanded}
        <div class="options" style={optionsStyle} use:portal>
            {#each options as o (o)}
                <div
                        class="option"
                        class:active={o === value}
                        on:click={() => updateValue(o)}
                >
                    {$spaceSeperatedNames ? convertToSpacedString(o) : o}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
  @use "../../icon-settings-expand" as *;

  .dropdown {
    position: relative;
    max-width: 150px;

    &.expanded {
      .text::after {
        transform: translateY(-50%) rotate(0);
        opacity: 1;
      }
    }
  }

  .head {
    background-color: var(--clickgui-dropdown-trigger-background-color);
    border: solid 1px var(--clickgui-dropdown-border-color);
    padding: 5px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 7px;
    transition: ease background-color .15s, ease border-color .15s;

    &:hover {
      background-color: color-mix(in srgb, #ffffff 7%, transparent);
      border-color: var(--border-strong-color);
    }

    .text {
      font-weight: 500;
      color: var(--clickgui-text-color);
      font-size: 11px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 16px;
    }

    .text::after {
      @include icon-settings-expand(9px, 6px);
      opacity: .45;
    }
  }

  .options {
    --dropdown-scale: 1;

    padding: 5px;
    background-color: var(--clickgui-dropdown-background-color);
    border: solid 1px var(--clickgui-dropdown-border-color);
    border-radius: 9px;
    box-shadow: 0 14px 30px color-mix(in srgb, black 55%, transparent);
    z-index: 999999;
    position: fixed;
    box-sizing: border-box;
    transform: scale(var(--dropdown-scale));
    transform-origin: top left;

    .option {
      color: var(--clickgui-dropdown-option-color);
      font-weight: 500;
      font-size: 11px;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      transition: ease color 0.15s, ease background-color 0.15s;

      &:hover {
        color: var(--clickgui-dropdown-option-hover-color);
        background-color: color-mix(in srgb, #ffffff 6%, transparent);
      }

      &.active {
        color: var(--clickgui-dropdown-option-selected-color);
        background-color: var(--accent-subtle-background-color);
      }
    }
  }
</style>
