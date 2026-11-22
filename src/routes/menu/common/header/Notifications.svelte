<script lang="ts">
    import {fly} from "svelte/transition";
    import {onMount} from "svelte";
    import {notification, type TNotification} from "./notification_store";

    let current = $state<TNotification | null>(null);
    let visible = $state(false);

    const queue: TNotification[] = [];
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;
    let nextTimeout: ReturnType<typeof setTimeout> | undefined;

    function showNext() {
        if (visible || current) {
            return;
        }

        const next = queue.shift();
        if (!next) {
            return;
        }

        current = next;
        visible = true;
        hideTimeout = setTimeout(hide, (next.delay ?? 3) * 1000);
    }

    function hide() {
        clearTimeout(hideTimeout);
        hideTimeout = undefined;

        if (!visible) {
            return;
        }

        visible = false;

        // Wait for the fly-out to finish before swapping in the next notification
        clearTimeout(nextTimeout);
        nextTimeout = setTimeout(() => {
            current = null;
            showNext();
        }, 240);
    }

    function enqueue(value: TNotification) {
        queue.push({...value});

        if (!visible && !current) {
            showNext();
        }
    }

    onMount(() => {
        const unsubscribe = notification.subscribe(value => {
            if (!value) {
                return;
            }

            enqueue(value);
            notification.set(null);
        });

        return () => {
            unsubscribe();
            clearTimeout(hideTimeout);
            clearTimeout(nextTimeout);
        };
    });
</script>

<div class="notifications">
    {#if visible && current}
        <div
                class="notification"
                class:error={current.error}
                transition:fly|global={{duration: 220, y: -14}}
        >
            <div class="icon">
                <img
                        src={current.error ? "img/hud/notification/icon-error.svg" : "img/hud/notification/icon-info.svg"}
                        alt=""
                />
            </div>

            <div class="text">
                <span class="title">{current.title}</span>
                <span class="message">{current.message}</span>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
  .notifications {
    display: flex;
    justify-content: center;
    width: max-content;
    max-width: min(360px, 90vw);
  }

  .notification {
    display: flex;
    align-items: center;
    column-gap: 11px;
    width: 100%;
    box-sizing: border-box;
    padding: 9px 14px 9px 9px;
    border-radius: 12px;
    border: solid 1px var(--menu-panel-border-color);
    background-color: var(--menu-header-notification-background-color);
    backdrop-filter: blur(24px) saturate(150%);
    box-shadow: 0 14px 34px var(--menu-panel-shadow-color);
    overflow: hidden;

    .icon {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background-color: var(--menu-header-notification-icon-background-color);

      img {
        width: 15px;
        height: 15px;
        display: block;
      }
    }

    &.error .icon {
      background-color: var(--menu-header-notification-icon-error-background-color);
    }

    .text {
      display: flex;
      flex-direction: column;
      row-gap: 2px;
      min-width: 0;
    }

    .title {
      font-size: 12.5px;
      font-weight: 600;
      line-height: 1.25;
      color: var(--menu-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .message {
      font-size: 11.5px;
      font-weight: 500;
      line-height: 1.25;
      color: var(--menu-text-dimmed-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
