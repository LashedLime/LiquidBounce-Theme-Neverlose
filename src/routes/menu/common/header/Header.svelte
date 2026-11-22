<script lang="ts">
    import Account from "./account/Account.svelte";
    import Notifications from "./Notifications.svelte";
    import {listen} from "../../../../integration/ws";
    import {location} from "svelte-spa-router";
    import {openScreen} from "../../../../integration/rest";
    import type {
        AccountManagerAdditionEvent,
        AccountManagerLoginEvent,
        AccountManagerMessageEvent
    } from "../../../../integration/events";
    import {notification} from "./notification_store";

    const navigation = [
        {title: "Home", route: "/title", screen: "title"},
        {title: "Singleplayer", route: "/singleplayer", screen: "singleplayer"},
        {title: "Multiplayer", route: "/multiplayer", screen: "multiplayer"},
        {title: "Accounts", route: "/altmanager", screen: "altmanager"},
        {title: "Proxies", route: "/proxymanager", screen: "proxymanager"}
    ];

    listen("accountManagerAddition", (e: AccountManagerAdditionEvent) => {
        if (!e.error) {
            notification.set({
                title: "AltManager",
                message: `Successfully added account ${e.username}`,
                error: false
            });
        } else {
            notification.set({
                title: "AltManager",
                message: e.error,
                error: true
            });
        }
    });

    listen("accountManagerMessage", (e: AccountManagerMessageEvent) => {
        notification.set({
            title: "AltManager",
            message: e.message,
            error: false
        });
    });

    listen("accountManagerLogin", (e: AccountManagerLoginEvent) => {
        if (!e.error) {
            notification.set({
                title: "AltManager",
                message: `Successfully logged in to account ${e.username}`,
                error: false
            });
        } else {
            notification.set({
                title: "AltManager",
                message: e.error,
                error: true
            });
        }
    });
</script>

<div class="header">
    <div class="brand">
        <div class="logo"><span>NL</span></div>
        <div class="brand-text">
            <span class="name">Neverlose</span>
            <span class="sub">LiquidBounce</span>
        </div>
    </div>

    <nav class="navigation">
        {#each navigation as entry (entry.route)}
            <button
                    class="nav-item"
                    class:active={$location === entry.route}
                    type="button"
                    onclick={() => openScreen(entry.screen)}
            >
                {entry.title}
            </button>
        {/each}
    </nav>

    <div class="notifications">
        <Notifications/>
    </div>

    <Account/>
</div>

<style lang="scss">
  .header {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 16px;
    margin-bottom: 20px;
    padding: 8px 12px;
    border-radius: 8px;
    border: solid 1px var(--menu-panel-border-color);
    background-color: var(--menu-button-container-background-color);
    box-shadow: 0 14px 34px var(--menu-panel-shadow-color);
    backdrop-filter: blur(24px) saturate(130%);

    &::after {
      content: "";
      position: absolute;
      left: 14px;
      right: 14px;
      bottom: -1px;
      height: 1px;
      background: linear-gradient(90deg,
              transparent,
              color-mix(in srgb, var(--accent-color) 55%, transparent),
              transparent);
    }
  }

  .brand {
    display: flex;
    align-items: center;
    column-gap: 10px;
    flex-shrink: 0;
  }

  .logo {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 6px;
    background-color: #121926;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-shadow: -2px 2px 0 var(--clickgui-logo-shadow-color);

    span {
      display: block;
      transform: translate(1px, -1px);
    }
  }

  .brand-text {
    display: flex;
    flex-direction: column;

    .name {
      font-size: 13px;
      font-weight: 600;
      color: var(--menu-text-color);
      line-height: 1.2;
    }

    .sub {
      font-size: 10px;
      color: var(--menu-text-dimmed-color);
    }
  }

  .navigation {
    display: flex;
    align-items: center;
    column-gap: 0;
    flex: 1;
    justify-content: center;
  }

  .nav-item {
    position: relative;
    padding: 9px 18px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--menu-text-dimmed-color);
    font-family: "Inter", sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: ease background-color 0.15s, ease color 0.15s;

    &:not(:last-child)::before {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 12px;
      background-color: color-mix(in srgb, #ffffff 11%, transparent);
    }

    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 1px;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      border-radius: 2px;
      background-color: var(--accent-color);
      opacity: 0;
      transition: ease opacity 0.15s, ease width 0.15s;
    }

    &:hover {
      color: var(--menu-text-color);
      background-color: color-mix(in srgb, #ffffff 5%, transparent);
    }

    &.active {
      color: #ffffff;
      background-color: color-mix(in srgb, #ffffff 5%, transparent);

      &::after {
        opacity: 1;
        width: 24px;
      }
    }
  }

  .notifications {
    position: fixed;
    top: 78px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1001;
  }
</style>
