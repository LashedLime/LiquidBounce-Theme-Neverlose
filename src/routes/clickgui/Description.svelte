<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {description} from "./clickgui_store";

    // A tooltip left open while the GUI closes must not reappear on the next open
    onMount(() => description.set(null));
    onDestroy(() => description.set(null));

</script>

{#if $description}
    <div class="description-wrapper"
         style="top: {$description.y}px; left: {$description.x}px; max-width: {$description.maxWidth}px;">
        <div class="description" class:right={$description.anchor === "left"}>
            <div class="text">{$description.description}</div>
        </div>
    </div>
{/if}

<style lang="scss">

  .description-wrapper {
    position: absolute;
    z-index: 50;
    transform: translateY(-50%);
    pointer-events: none;
    animation: description-in 120ms ease-out;
  }

  @keyframes description-in {
    from {
      opacity: 0;
      transform: translateY(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%);
    }
  }

  .description {
    position: relative;
    border-radius: 10px;
    background-color: var(--clickgui-description-background-color);
    border: solid 1px var(--border-color);
    backdrop-filter: blur(20px) saturate(140%);
    filter: drop-shadow(0 12px 26px var(--clickgui-description-shadow-color));

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid var(--clickgui-description-arrow-color);
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
    }

    &.right {
      &::before {
        transform: translateY(-50%) rotate(180deg);
        left: unset;
        right: -6px;
      }
    }
  }

  .text {
    font-size: 11px;
    line-height: 1.4;
    padding: 8px 10px;
    color: var(--clickgui-text-color);
  }
</style>