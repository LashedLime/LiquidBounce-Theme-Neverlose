<script lang="ts">
    export let text: string;
</script>

<div class="tag">
    {text}
</div>

<style lang="scss">

  .tag {
    background-color: var(--menu-list-tag-background-color);
    color: var(--menu-text-dimmed-color);
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: 6px;
    white-space: nowrap;
    transition: ease color .2s, ease background-color .2s;
  }
</style>
