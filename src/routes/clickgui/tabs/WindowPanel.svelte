<script lang="ts">
    import type {Snippet} from "svelte";

    let { title, icon, children } = $props<{
        title: string;
        icon?: string;
        children: Snippet;
    }>();
</script>

<div class="window">
    <div class="title">
        {#if icon}
            <img
                    class="icon"
                    src="img/clickgui/icon-{icon}.svg"
                    alt="icon"
            />
        {/if}
        <span class="title-text">{title}</span>
    </div>
    <div class="content">
        {@render children()}
    </div>
</div>

<style lang="scss">

  .window {
    width: 100%;
    border-radius: 12px;
    background-color: var(--clickgui-window-background-color);
    border: solid 1px var(--border-color);
    overflow: hidden;
    user-select: none;
  }

  .title {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    column-gap: 10px;
    background-color: var(--clickgui-window-header-background-color);
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 600;
    color: var(--clickgui-text-color);
    border-bottom: 1px solid var(--clickgui-window-header-border-color);

    .icon {
      width: 14px;
      height: 14px;
      opacity: 0.55;
    }
  }

  .title-text {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    color: var(--clickgui-section-label-color);
  }

  .content {
    padding: 12px 16px 16px;
  }
</style>
