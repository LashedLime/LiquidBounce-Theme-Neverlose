<script lang="ts">
    import ConfettiBackground from "./ConfettiBackground.svelte";
    import ButtonContainer from "../common/buttons/ButtonContainer.svelte";
    import IconTextButton from "../common/buttons/IconTextButton.svelte";
    import IconButton from "../common/buttons/IconButton.svelte";
    import {
        openLink,
        exitClient,
        getClientUpdate,
        openScreen
    } from "../../../integration/rest";
    import {onMount} from "svelte";
    import {notification} from "../common/header/notification_store";
    import {isAnniversary} from "../../../util/utils";

    const entries = [
        {title: "Singleplayer", screen: "singleplayer"},
        {title: "Multiplayer", screen: "multiplayer"},
        {title: "Alt Manager", screen: "altmanager"},
        {title: "Proxy Manager", screen: "proxymanager"},
        {title: "Click GUI", screen: "clickgui"}
    ];

    onMount(() => {
        setTimeout(async () => {
            const clientUpdate = await getClientUpdate();

            if (clientUpdate.update) {
                notification.set({
                    title: `LiquidBounce ${clientUpdate.update.clientVersion} has been released!`,
                    message: `Download it from liquidbounce.net!`,
                    error: false,
                    delay: 99999999
                });
            }
        }, 2000);
    });
</script>

<div class="title-screen">
    {#if isAnniversary()}
        <ConfettiBackground/>
    {/if}

    <div class="content">
        <div class="navigation">
            <span class="navigation-label">Navigation</span>

            {#each entries as entry, index (entry.screen)}
                <button
                        class="menu-row"
                        type="button"
                        onclick={() => openScreen(entry.screen)}
                >
                    <span class="index">{String(index + 1).padStart(2, "0")}</span>
                    <span class="label">{entry.title}</span>
                    <span class="chevron">›</span>
                </button>
            {/each}
        </div>

        <div class="brand">
            <div class="mark"><span>NL</span></div>
            <div class="brand-text">
                <span class="brand-name">Neverlose</span>
                <span class="brand-sub">LiquidBounce theme</span>
            </div>
        </div>

        <div class="additional-buttons">
            <ButtonContainer>
                <IconTextButton icon="icon-exit.svg" title="Exit" on:click={exitClient}/>
            </ButtonContainer>
        </div>

        <div class="social-buttons">
            <ButtonContainer>
                <IconButton title="Forum" icon="nodebb" on:click={() => openLink("MAINTAINER_FORUM")}/>
                <IconButton title="GitHub" icon="github" on:click={() => openLink("MAINTAINER_GITHUB")}/>
                <IconButton title="Discord" icon="discord" on:click={() => openLink("MAINTAINER_DISCORD")}/>
                <IconButton title="Twitter" icon="twitter" on:click={() => openLink("MAINTAINER_TWITTER")}/>
                <IconButton title="YouTube" icon="youtube" on:click={() => openLink("MAINTAINER_YOUTUBE")}/>
                <IconTextButton title="liquidbounce.net" icon="icon-liquidbounce.net.svg"
                                on:click={() => openLink("CLIENT_WEBSITE")}/>
            </ButtonContainer>
        </div>
    </div>
</div>

<style lang="scss">
  .title-screen {
    position: relative;
    isolation: isolate;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .content {
    flex: 1;
    display: grid;
    grid-template-areas:
        "nav brand"
        "actions social";
    grid-template-columns: minmax(440px, 560px) 1fr;
    grid-template-rows: 1fr max-content;
    column-gap: 72px;
    row-gap: 34px;
    padding-top: 40px;
  }

  .navigation {
    grid-area: nav;
    align-self: center;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }

  .navigation-label {
    padding: 0 6px 10px;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 1.7px;
    text-transform: uppercase;
    color: var(--clickgui-section-label-color);
  }

  .menu-row {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 16px;
    height: 70px;
    padding: 0 18px;
    border-radius: 6px;
    border: solid 1px var(--menu-panel-border-color);
    background-color: var(--menu-list-item-background-color);
    color: var(--menu-text-color);
    font-family: "Inter", sans-serif;
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    transition: ease background-color 0.15s, ease border-color 0.15s;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      border-radius: 0 2px 2px 0;
      background-color: var(--accent-color);
      transition: ease height 0.15s;
    }

    .index {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.2px;
      color: var(--clickgui-section-label-color);
      transition: ease color 0.15s;
    }

    .label {
      flex: 1;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 1.3px;
      text-transform: uppercase;
    }

    .chevron {
      font-size: 19px;
      line-height: 1;
      color: var(--clickgui-section-label-color);
      transition: ease color 0.15s, ease transform 0.15s;
    }

    &:hover {
      background-color: var(--menu-list-item-hover-background-color);
      border-color: color-mix(in srgb, var(--accent-color) 40%, transparent);

      &::before {
        height: 26px;
      }

      .index {
        color: var(--accent-color);
      }

      .chevron {
        color: var(--accent-color);
        transform: translateX(2px);
      }
    }
  }

  .brand {
    grid-area: brand;
    align-self: end;
    justify-self: end;
    display: flex;
    align-items: center;
    column-gap: 22px;
  }

  .mark {
    width: 118px;
    height: 118px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background-color: #121926;
    color: #ffffff;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 2px;
    text-shadow: -6px 6px 0 var(--clickgui-logo-shadow-color);
    box-shadow: 0 22px 48px color-mix(in srgb, black 48%, transparent);

    span {
      display: block;
      transform: translate(3px, -3px);
    }
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .brand-name {
      font-size: 32px;
      font-weight: 600;
      letter-spacing: 2.6px;
      text-transform: uppercase;
      color: var(--menu-text-color);
    }

    .brand-sub {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      color: var(--menu-text-dimmed-color);
    }
  }

  .additional-buttons {
    grid-area: actions;
    align-self: end;
  }

  .social-buttons {
    grid-area: social;
    align-self: end;
    justify-self: end;
  }
</style>
