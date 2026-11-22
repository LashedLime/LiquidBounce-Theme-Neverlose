<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let value: boolean;
    export let title: string;

    const dispatch = createEventDispatcher();
</script>

<label class="switch-setting">
    <span class="switch">
        <input type="checkbox" bind:checked={value} on:change={() => dispatch("change")}/>
        <span class="slider"></span>
    </span>

    <span class="title">{title}</span>
</label>

<style lang="scss">

  .switch-setting {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .title {
    color: var(--menu-text-color);
    font-size: 12px;
    margin-left: 9px;
    font-weight: 500;
    white-space: nowrap;
  }

  .slider {
    position: absolute;
    inset: 0;
    background-color: var(--menu-switch-track-color);
    transition: ease background-color 0.2s;
    height: 16px;
    border-radius: 8px;

    &::before {
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      top: 2px;
      left: 2px;
      background-color: var(--menu-switch-thumb-color);
      transition: ease transform 0.2s, ease background-color 0.2s;
      border-radius: 50%;
    }
  }

  .switch {
    position: relative;
    display: flex;
    width: 30px;
    height: 16px;
    flex-shrink: 0;
    align-items: center;
    margin: 0 8px;

    input {
      display: none;
    }

    input:checked + .slider {
      background-color: var(--menu-switch-track-active-color);
    }

    input:checked + .slider:before {
      transform: translateX(14px);
      background-color: var(--menu-switch-thumb-active-color);
    }
  }
</style>
