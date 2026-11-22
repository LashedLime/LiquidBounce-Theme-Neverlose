<script lang="ts">
    import {fade, fly} from "svelte/transition";
    import {createEventDispatcher} from "svelte";
    import {portal} from "../../../../integration/util";
    import {escapeLayer} from "../../../../integration/escape";

    export let title: string;
    export let visible: boolean;

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("close");
        visible = false;
    }

    const layer = escapeLayer(handleClick);
    $: layer.setOpen(visible);
</script>

{#if visible}
    <div class="modal-wrapper" transition:fade|global={{duration: 200}} use:portal>
        <div class="modal" in:fly|global={{duration: 300, y: -100}} out:fly|global={{duration: 300, y: -100}}>
            <button class="button-modal-close" on:click={handleClick}>
                <img src="img/menu/icon-close.svg" alt="close">
            </button>

            <div class="title">{title}</div>

            <div class="content">
                <slot />
            </div>
        </div>
    </div>
{/if}

<style lang="scss">

  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--menu-modal-backdrop-color);
    z-index: 999;
  }

  .modal {
    background-color: var(--menu-modal-background-color);
    border: solid 1px var(--menu-panel-border-color);
    min-width: 460px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 28px 30px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 22px 54px var(--menu-modal-shadow-color);
    backdrop-filter: blur(28px) saturate(140%);
    zoom: var(--ui-scale, 1);
  }

  .title {
    color: var(--menu-text-color);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    position: relative;
    width: max-content;
    align-self: center;
    margin-bottom: 24px;

    &::after {
      content: "";
      position: absolute;
      display: block;
      height: 3px;
      width: 34px;
      background-color: var(--menu-modal-title-accent-color);
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 10px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  .button-modal-close {
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: solid 1px var(--menu-modal-close-border-color);
    border-radius: 5px;
    cursor: pointer;
    top: 14px;
    right: 14px;
    position: absolute;
    transition: ease background-color .2s;

    &:hover {
      background-color: var(--menu-modal-close-hover-background-color);
    }
  }

</style>
