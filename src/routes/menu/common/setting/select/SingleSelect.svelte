<script lang="ts">
    import {slide} from "svelte/transition";
    import {quintOut} from "svelte/easing";
    import {createEventDispatcher} from "svelte";
    import GenericSelect from "./GenericSelect.svelte";

    export let options: string[];
    export let value: string;
    export let title: string;

    const dispatch = createEventDispatcher<{
        change: { value: string }
    }>();

    function handleOptionClick(o: string) {
        value = o;
        dispatch("change", {value: o});
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<GenericSelect closeOnInternalClick={true}>
    <span slot="title"><span class="title">{title}</span> {value}</span>

    <svelte:fragment slot="options">
        {#each options as o}
            <div on:click={() => handleOptionClick(o)} class="option" class:active={o === value}
                 transition:slide|global={{ duration: 200, easing: quintOut }}>{o}</div>
        {/each}
    </svelte:fragment>
</GenericSelect>

<style lang="scss">

  .title {
    font-weight: 600;
  }

  .option {
    font-weight: 500;
    color: var(--menu-text-dimmed-color);
    font-size: 12px;
    padding: 7px 12px;
    white-space: nowrap;
    transition: ease color .15s, ease background-color .15s;

    &:hover {
      background-color: color-mix(in srgb, #ffffff 5%, transparent);
    }

    &:hover {
      color: var(--menu-text-color);
    }

    &.active {
      color: var(--accent-color);
    }
  }
</style>
