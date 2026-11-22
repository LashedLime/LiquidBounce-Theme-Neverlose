<script lang="ts">
    export let vertical = false;
</script>

<div class="button-container" class:vertical>
    <slot />
</div>

<style lang="scss">

    .button-container {
      background-color: var(--menu-button-container-background-color);
      border: solid 1px var(--menu-panel-border-color);
      padding: 5px;
      width: max-content;
      border-radius: 8px;
      display: flex;
      column-gap: 2px;
      backdrop-filter: blur(22px) saturate(130%);
      box-shadow: 0 12px 28px var(--menu-panel-shadow-color);

      &.vertical {
        flex-direction: column;
        row-gap: 6px;
        padding: 8px 6px;
      }
    }
</style>
