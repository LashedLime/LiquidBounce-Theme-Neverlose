<script lang="ts">
    import type {BooleanSetting, Session} from "../../integration/types";
    import {
        directLoginToCrackedAccount,
        getModuleSettings,
        openScreen,
        randomUsername,
        setModuleSettings
    } from "../../integration/rest";
    import {spaceSeperatedNames} from "../../theme/theme_config";
    import MenuIcon from "./MenuIcon.svelte";

    let {session, onclose}: { session: Session | null; onclose?: () => void } = $props();

    let faceFailed = $state(false);
    let togglingNames = $state(false);

    const faceUrl = $derived(
        session?.username
            ? `https://mc-api.io/render/FACE/${encodeURIComponent(session.username)}/JAVA?size=100`
            : null
    );
    const initials = $derived((session?.username ?? "").slice(0, 2).toUpperCase() || "NL");

    function openAltManager() {
        close();
        openScreen("altmanager");
    }

    async function randomAccount() {
        close();
        const username = await randomUsername();
        await directLoginToCrackedAccount(username, false);
    }

    async function toggleSpacedNames() {
        if (togglingNames) {
            return;
        }

        togglingNames = true;

        try {
            const settings = await getModuleSettings("HUD");
            const setting = settings.value.find(s => s.name === "SpaceSeperatedNames") as BooleanSetting | undefined;

            if (setting) {
                setting.value = !$spaceSeperatedNames;
                await setModuleSettings("HUD", settings);
                spaceSeperatedNames.set(setting.value);
            }
        } finally {
            togglingNames = false;
        }
    }

    function close() {
        onclose?.();
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="account-panel" onmousedown={(e) => e.stopPropagation()}>
    <div class="head">
        <div class="avatar">
            {#if faceUrl && !faceFailed}
                <img
                        class="face"
                        src={faceUrl}
                        alt={session?.username ?? "Player face"}
                        onerror={() => (faceFailed = true)}
                />
            {:else}
                <span class="initials">{initials}</span>
            {/if}
        </div>

        <div class="head-text">
            <span class="name">{session?.username ?? "Player"}</span>
            <span class="sub">{session?.service ?? "Not signed in"}</span>
        </div>
    </div>

    <div class="rows">
        <button class="row" type="button" onclick={openAltManager}>
            <MenuIcon name="user"/>
            <span class="label">Alt Manager</span>
            <span class="value">Switch</span>
            <span class="chevron"></span>
        </button>

        <button class="row" type="button" onclick={randomAccount}>
            <MenuIcon name="dice"/>
            <span class="label">Random Account</span>
            <span class="chevron"></span>
        </button>

        <button class="row" type="button" onclick={toggleSpacedNames}>
            <MenuIcon name="text"/>
            <span class="label">Spaced Names</span>
            <span class="switch" class:on={$spaceSeperatedNames}>
                <span class="knob"></span>
            </span>
        </button>
    </div>
</div>

<style lang="scss">
  .account-panel {
    position: absolute;
    left: 0;
    bottom: calc(100% + 8px);
    width: 252px;
    z-index: 40;
    padding: 8px;
    border: solid 1px var(--border-color);
    border-radius: 16px;
    background-color: var(--clickgui-panel-body-background-color);
    backdrop-filter: blur(28px) saturate(150%);
    box-shadow: 0 24px 60px var(--clickgui-panel-shadow-color);
    user-select: none;
  }

  .head {
    display: flex;
    align-items: center;
    column-gap: 11px;
    padding: 8px 8px 12px;
    border-bottom: solid 1px var(--border-color);
  }

  .avatar {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
    display: grid;
    place-items: center;
    background-color: #121926;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.6px;

    .face {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .head-text {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .name {
      font-size: 13px;
      font-weight: 600;
      color: var(--clickgui-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub {
      font-size: 11px;
      font-weight: 500;
      color: var(--clickgui-text-dimmed-color);
    }
  }

  .rows {
    display: flex;
    flex-direction: column;
    padding: 6px 0 2px;
  }

  .row {
    all: unset;
    display: flex;
    align-items: center;
    column-gap: 11px;
    padding: 9px 8px;
    border-radius: 9px;
    cursor: pointer;
    color: var(--clickgui-nav-item-color);
    font-family: "Inter", sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    transition: ease background-color 0.14s, ease color 0.14s;

    .label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .value {
      font-size: 11.5px;
      color: var(--clickgui-text-dimmed-color);
      transition: ease color 0.14s;
    }

    .chevron {
      width: 6px;
      height: 6px;
      flex-shrink: 0;
      border-top: 1.5px solid currentColor;
      border-right: 1.5px solid currentColor;
      transform: rotate(45deg);
      opacity: 0.55;
      transition: ease opacity 0.14s;
    }

    &:hover {
      background-color: color-mix(in srgb, #ffffff 8%, transparent);
      color: var(--clickgui-text-color);

      .value {
        color: var(--accent-color);
      }

      .chevron {
        opacity: 1;
      }
    }
  }

  .switch {
    position: relative;
    flex-shrink: 0;
    width: 34px;
    height: 19px;
    border-radius: 999px;
    background-color: var(--clickgui-switch-track-color);
    transition: ease background-color 0.2s;

    .knob {
      position: absolute;
      top: 50%;
      left: 2.5px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: var(--clickgui-switch-thumb-color);
      transform: translateY(-50%);
      transition: transform 0.2s cubic-bezier(0.3, 0.9, 0.3, 1), ease background-color 0.2s;
    }

    &.on {
      background-color: var(--clickgui-switch-track-active-color);

      .knob {
        transform: translate(15px, -50%);
        background-color: var(--clickgui-switch-thumb-active-color);
      }
    }
  }
</style>
