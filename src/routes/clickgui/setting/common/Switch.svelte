<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let value: boolean;
    export let name: string;

    const dispatch = createEventDispatcher();
</script>

<label class="switch-container">
    <span class="name">{name}</span>

    <span class="switch">
        <input type="checkbox" bind:checked={value} on:change={() => dispatch("change")}/>
        <span class="slider"></span>
    </span>
</label>

<style lang="scss">

  .switch-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    cursor: pointer;
  }

  .name {
    font-weight: 500;
    color: var(--clickgui-text-color);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .switch {
    position: relative;
    flex-shrink: 0;
    width: 42px;
    height: 24px;

    input {
      display: none;
    }
  }

  .slider {
    position: absolute;
    inset: 0;
    background-color: var(--clickgui-switch-track-color);
    border-radius: 999px;
    transition: background-color 0.22s ease;

    &::before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      top: 3px;
      left: 3px;
      background-color: var(--clickgui-switch-thumb-color);
      border-radius: 50%;
      box-shadow: 0 1px 3px color-mix(in srgb, black 30%, transparent);
      transition: transform 0.22s cubic-bezier(0.3, 0.9, 0.3, 1),
      background-color 0.22s ease;
    }
  }

  .switch-container:hover .slider::before {
    transform: scale(1.06);
  }

  input:checked + .slider {
    background-color: var(--clickgui-switch-track-active-color);
  }

  input:checked + .slider::before {
    transform: translateX(18px);
    background-color: var(--clickgui-switch-thumb-active-color);
  }

  .switch-container:hover input:checked + .slider::before {
    transform: translateX(18px) scale(1.06);
  }
</style>
