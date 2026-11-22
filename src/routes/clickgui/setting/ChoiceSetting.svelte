<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {ChoiceSetting, ModuleSetting,} from "../../../integration/types";
    import ExpandArrow from "./common/ExpandArrow.svelte";
    import GenericSetting from "./common/GenericSetting.svelte";
    import {setItem} from "../../../integration/persistent_storage";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import Dropdown from "./common/Dropdown.svelte";

    export let setting: ModuleSetting;
    export let path: string;

    const cSetting = setting as ChoiceSetting;
    const thisPath = `${path}.${cSetting.name}`;

    const dispatch = createEventDispatcher();
    const options = Object.keys(cSetting.choices);
    let expanded = localStorage.getItem(thisPath) === "true";

    let nestedSettings = cSetting.choices[cSetting.active]
        .value as ModuleSetting[];
    $: nestedSettings = cSetting.choices[cSetting.active]
        .value as ModuleSetting[];

    $: setItem(thisPath, expanded.toString());

    function handleChange() {
        setting = { ...cSetting };
        dispatch("change");
    }

    function toggleExpanded() {
        expanded = !expanded;
    }
</script>

<div class="setting">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="head" class:expand={nestedSettings.length > 0} class:expanded
         on:contextmenu|preventDefault={toggleExpanded}>
        <span class="label">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</span>

        <div class="controls">
            <Dropdown
                bind:value={cSetting.active}
                {options}
                name={null}
                on:change={handleChange}
            />
            {#if nestedSettings.length > 0}
                <ExpandArrow bind:expanded />
            {/if}
        </div>
    </div>

    {#if expanded && nestedSettings.length > 0}
        <div class="nested-settings">
            {#each nestedSettings as setting (`${cSetting.active}.${setting.name}`)}
                <GenericSetting path={thisPath} bind:setting on:change={handleChange} />
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">

    .setting {
        padding: 4px 0;

        .head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          column-gap: 8px;
          padding: 4px 0;
          transition: ease margin-bottom .2s;

          &.expanded {
              margin-bottom: 6px;
          }
        }
    }

    .label {
        font-size: 12px;
        font-weight: 500;
        color: var(--clickgui-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .controls {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    .nested-settings {
        border-left: solid 1px var(--clickgui-setting-group-border-color);
        padding-left: 10px;
    }
</style>
