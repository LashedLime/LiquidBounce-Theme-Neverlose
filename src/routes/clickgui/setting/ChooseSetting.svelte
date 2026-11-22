<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {ChooseSetting, ModuleSetting,} from "../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import Dropdown from "./common/Dropdown.svelte";

    export let setting: ModuleSetting;

    const cSetting = setting as ChooseSetting;

    const dispatch = createEventDispatcher();

    function handleChange() {
        setting = { ...cSetting };
        dispatch("change");
    }
</script>

<div class="setting">
    <span class="label">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</span>

    <Dropdown
        on:change={handleChange}
        bind:value={cSetting.value}
        options={cSetting.choices}
        name={null}
    />
</div>

<style lang="scss">
    .setting {
        padding: 8px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        column-gap: 8px;
    }

    .label {
        font-size: 12px;
        font-weight: 500;
        color: var(--clickgui-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
