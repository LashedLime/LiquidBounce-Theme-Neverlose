<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {escapeLayer} from "../../../integration/escape";

    let value = "";

    const dispatch = createEventDispatcher<{
        search: { query: string }
    }>();

    const layer = escapeLayer(() => {
        value = "";
        dispatch("search", {query: value});
    });
    $: layer.setOpen(value !== "");
</script>

<input class="search" type="text" placeholder="Search..." bind:value={value}
       on:input={() => dispatch("search", {query: value})} spellcheck="false">

<style lang="scss">

  .search {
    background-color: var(--menu-search-background-color);
    border: solid 1px var(--menu-search-border-color);
    color: var(--menu-text-color);
    font-family: "Inter", sans-serif;
    font-size: 12px;
    border-radius: 5px;
    background-image: url("/img/menu/icon-search.svg");
    background-repeat: no-repeat;
    background-position: 12px center;
    background-size: 14px 14px;
    padding: 8px 10px 8px 32px;
    flex: 1;
    outline: none;
    transition: ease border-color 0.15s, ease background-color 0.15s;

    &::placeholder {
      color: var(--menu-text-dimmed-color);
    }

    &:focus {
      border-color: color-mix(in srgb, var(--accent-color) 45%, transparent);
      background-color: color-mix(in srgb, #ffffff 6%, transparent);
    }
  }
</style>