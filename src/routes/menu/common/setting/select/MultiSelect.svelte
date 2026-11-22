<script lang="ts">
    import {slide} from "svelte/transition";
    import {quintOut} from "svelte/easing";
    import {createEventDispatcher} from "svelte";
    import GenericSelect from "./GenericSelect.svelte";

    export let options: string[];
    export let values: string[];
    export let title: string;

    const dispatch = createEventDispatcher<{
        change: { values: string[] }
    }>();

    function handleOptionClick(o: string) {
        if (values.includes(o)) {
            values = values.filter(v => v !== o);
        } else {
            values = [...values, o]
        }
        dispatch("change", {values});
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<GenericSelect closeOnInternalClick={false}>
    <svelte:fragment slot="title">
        {title}
    </svelte:fragment>

    <svelte:fragment slot="options">
        {#each options as o}
            <div on:click={() => handleOptionClick(o)} class="option" class:active={values.includes(o)}
                 transition:slide|global={{ duration: 200, easing: quintOut }}>
                <span>{o}</span>
            </div>
        {/each}
    </svelte:fragment>
</GenericSelect>

<style lang="scss">

  .option {
    font-weight: 500;
    color: var(--menu-text-dimmed-color);
    font-size: 12px;
    padding: 7px 12px;
    white-space: nowrap;
    transition: ease color .15s, ease background-color .15s;

    &:hover {
      color: var(--menu-text-color);
      background-color: color-mix(in srgb, #ffffff 5%, transparent);
    }

    &.active {
      color: var(--accent-color);
    }
  }
</style>
