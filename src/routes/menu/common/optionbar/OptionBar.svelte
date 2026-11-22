<div class="option-bar">
    <slot />
</div>

<style lang="scss">

    .option-bar {
      position: relative;
      z-index: 30;
      background-color: var(--menu-option-bar-background-color);
      border: solid 1px var(--menu-panel-border-color);
      padding: 7px 9px;
      display: flex;
      border-radius: 8px;
      align-items: center;
      column-gap: 10px;
      margin-bottom: 10px;
      backdrop-filter: blur(22px) saturate(130%);
      box-shadow: 0 12px 28px var(--menu-panel-shadow-color);
    }
</style>