<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {ModuleSetting, MultiChooseSetting,} from "../../../integration/types";
    import {slide} from "svelte/transition";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import ExpandArrow from "./common/ExpandArrow.svelte";
    import {setItem} from "../../../integration/persistent_storage";

    export let setting: ModuleSetting;
    export let path: string;

    const cSetting = setting as MultiChooseSetting;
    const thisPath = `${path}.${cSetting.name}`;

    let errorValue: string | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const dispatch = createEventDispatcher();

    function handleChange(v: string) {
        if (cSetting.value.includes(v)) {
            const filtered = cSetting.value.filter(item => item !== v);

            if (filtered.length === 0 && !cSetting.canBeNone) {
                // Doesn't remove the element because in this case the value will be empty
                // And indicate the value
                errorValue = v
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => errorValue = null, 300);

                return;
            }

            cSetting.value = filtered;
        } else {
            cSetting.value = [...cSetting.value, v]
        }

        setting = {...cSetting};
        dispatch("change");
    }

    let expanded = localStorage.getItem(thisPath) === "true";

    $: setItem(thisPath, expanded.toString());

    function toggleExpanded() {
        expanded = !expanded;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="setting">
    <div class="head" class:expanded on:contextmenu|preventDefault={toggleExpanded}>
        <div class="title">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</div>
        <div class="amount">{cSetting.value.length}/{cSetting.choices.length}</div>
        <ExpandArrow bind:expanded/>
    </div>

    {#if expanded}
        <div class="choices" transition:slide|global={{duration: 200, axis: "y"}}>
            {#each cSetting.choices as choice (choice)}
                <div
                        class="choice"
                        class:active={cSetting.value.includes(choice)}
                        class:error={errorValue === choice}
                        on:click={() => {
                            handleChange(choice)
                        }}
                >
                    {$spaceSeperatedNames ? convertToSpacedString(choice) : choice}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">

  .setting {
    padding: 6px 0;
    color: var(--clickgui-text-color);
  }

  .title {
    color: var(--clickgui-text-color);
    font-size: 12px;
    font-weight: 500;
  }

  .choice {
    color: var(--clickgui-selection-chip-color);
    background-color: var(--clickgui-selection-chip-background-color);
    border: solid 1px var(--border-color);
    border-radius: 6px;
    padding: 3px 7px;
    cursor: pointer;
    font-weight: 500;
    font-size: 11px;
    line-height: 1.5;
    transition: ease color 0.15s, ease background-color 0.15s, ease border-color 0.15s;
    overflow-wrap: anywhere;

    &:hover {
      color: var(--clickgui-text-color);
      border-color: var(--border-strong-color);
    }

    &.error {
      background-color: var(--clickgui-selection-chip-remove-background-color) !important;
      color: var(--clickgui-selection-chip-remove-color) !important;
    }

    &.active {
      background-color: var(--clickgui-selection-chip-selected-background-color);
      border-color: color-mix(in srgb, var(--accent-color) 55%, transparent);
      color: var(--clickgui-selection-chip-selected-color);
    }
  }

  .amount {
    letter-spacing: 1px;
    font-weight: 500;
    font-size: 11px;
    font-family: monospace;
    color: var(--clickgui-text-dimmed-color);
  }

  .head {
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    transition: ease margin-bottom .2s;
    align-items: center;

    &.expanded {
      margin-bottom: 7px;
    }
  }

  .choices {
    color: var(--clickgui-text-color);
    padding: 2px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    font-size: 11px;
  }
</style>
