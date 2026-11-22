<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {ModuleSetting, TextSetting,} from "../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";

    export let setting: ModuleSetting;

    const cSetting = setting as TextSetting;

    const dispatch = createEventDispatcher();

    function handleChange() {
        setting = {...cSetting};
        dispatch("change");
    }
</script>

<div class="setting">
    <div class="name">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</div>
    <input type="text" class="value" spellcheck="false"
           placeholder={$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}
           bind:value={cSetting.value}
           on:input={handleChange}
    >
</div>

<style lang="scss">

  .setting {
    padding: 6px 0;
  }

  .name {
    font-weight: 500;
    color: var(--clickgui-text-color);
    font-size: 12px;
    margin-bottom: 6px;
  }

  .value {
    width: 100%;
    background-color: var(--clickgui-input-background-color);
    font-family: "Inter", monospace;
    font-size: 11px;
    color: var(--clickgui-text-color);
    border: solid 1px var(--clickgui-input-border-color);
    padding: 6px 8px;
    border-radius: 7px;
    transition: ease border-color .15s, ease background-color .15s;

    &::placeholder {
      color: var(--clickgui-text-dimmed-color);
      opacity: .6;
    }

    &:focus {
      border-color: var(--accent-color);
      background-color: color-mix(in srgb, #ffffff 6%, transparent);
    }

    &::-webkit-scrollbar {
      background-color: transparent;
    }
  }
</style>
