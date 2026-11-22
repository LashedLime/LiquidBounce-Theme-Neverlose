<script lang="ts">
    import ToolTip from "../ToolTip.svelte";
    import {createEventDispatcher} from "svelte";

    export let title: string;
    export let icon: string;

    const dispatch = createEventDispatcher();
</script>

<button class="button" type="button" on:click={() => dispatch("click")}>
    <ToolTip text={title} color="black"/>
    <img class="icon" src="img/menu/icon-{icon}.svg" alt={icon}>
</button>

<style lang="scss">
  .button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: relative;
    margin-left: 2px;
    padding: 5px;
    border-radius: 7px;
    opacity: 0.62;
    transition: ease opacity .15s, ease background-color .15s;

    &:hover {
      opacity: 1;
      background-color: color-mix(in srgb, #ffffff 8%, transparent);
    }
  }

  .icon {
    height: 17px;
    width: 17px;
    display: block;
  }
</style>