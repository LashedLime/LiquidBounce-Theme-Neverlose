<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let title: string;
    export let icon: string;
    export let disabled = false;

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button class="icon-text-button" on:click={() => dispatch("click")} {disabled}>
    <div class="icon">
        <img src="img/menu/{icon}" alt={title}>
    </div>
    <div class="title">{title}</div>
</button>

<style lang="scss">

    .icon-text-button {
      display: flex;
      border: none;
      background-color: var(--menu-icon-text-button-background-color);
      border-radius: 5px;
      align-items: center;
      overflow: hidden;
      transition: ease background-color .15s, ease opacity .2s;

      &:not([disabled]) {
        cursor: pointer;

        &:hover {
          background-color: color-mix(in srgb, var(--accent-color) 16%, transparent);

          .icon {
            color: var(--menu-text-color);
          }
        }
      }

      &[disabled] {
        opacity: .45;
      }
    }

    .icon {
      height: 28px;
      width: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--menu-text-dimmed-color);
      transition: ease color .15s;

      img {
        width: 14px;
        height: 14px;
      }
    }

    .title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.9px;
      text-transform: uppercase;
      color: var(--menu-text-color);
      padding: 0 12px 0 2px;
    }
</style>