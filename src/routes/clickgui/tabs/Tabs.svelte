<script lang="ts">
    import type {Component} from "svelte";
    import {fade, fly} from "svelte/transition";
    import {onMount} from "svelte";
    import {
        activeCategory,
        buildCategorySections,
        groupedModules,
        loadClickGuiData
    } from "../clickgui_data";
    import NavIcon from "../NavIcon.svelte";
    import {getMetadata, getSession} from "../../../integration/rest";
    import {listen} from "../../../integration/ws";
    import type {Metadata, Session} from "../../../integration/types";
    import ScaledClickGuiContent from "../ScaledClickGuiContent.svelte";
    import ModuleSettingsPanel from "../ModuleSettingsPanel.svelte";
    import AccountPanel from "../AccountPanel.svelte";
    import KeybindPanel from "../KeybindPanel.svelte";
    import {closeKeybindPanel, keybindPanel} from "../keybind_panels";
    import {closeAllSettingsPanels, openSettingsPanels} from "../settings_panels";
    import {scaleFactor} from "../clickgui_store";

    type Tab = {
        title: string;
        content: Component;
        icon?: string;
        fullscreen?: boolean;
    };

    let {tabs, activeTab = $bindable(0)} = $props<{
        tabs: Tab[];
        activeTab?: number;
    }>();

    let metadata = $state<Metadata | null>(null);
    let session = $state<Session | null>(null);
    let faceFailed = $state(false);
    const faceUrl = $derived(
        session?.username
            ? `https://mc-api.io/render/FACE/${encodeURIComponent(session.username)}/JAVA?size=100`
            : null
    );
    const initials = $derived((session?.username ?? "").slice(0, 2).toUpperCase() || "NL");
    let userElement = $state<HTMLElement | null>(null);
    let accountOpen = $state(false);
    let windowElement = $state<HTMLElement | null>(null);
    let windowOffset = $state({x: 0, y: 0});
    let draggingWindow = $state(false);
    let dragStart = {pointerX: 0, pointerY: 0, offsetX: 0, offsetY: 0};

    const Active = $derived(tabs[activeTab]?.content);
    const isFullscreen = $derived(tabs[activeTab]?.fullscreen === true);
    const sections = $derived(buildCategorySections(Object.keys($groupedModules)));
    const yearsLeft = $derived.by(() => {
        const year = new Date().getFullYear();
        return Number.isFinite(year) && year > 0 ? Math.max(9999 - year, 0) : 6067;
    });
    const clickGuiTab = $derived(tabs.findIndex((tab: Tab) => tab.title === "ClickGUI"));

    onMount(() => {
        loadClickGuiData().catch(error => console.error("[ClickGUI] Failed to load modules", error));

        getMetadata()
            .then(loaded => metadata = loaded)
            .catch(() => metadata = null);

        getSession()
            .then(loaded => session = loaded)
            .catch(() => session = null);

        return () => closeAllSettingsPanels();
    });

    listen("session", async () => {
        session = await getSession();
        faceFailed = false;
    });

    function selectCategory(category: string) {
        activeCategory.set(category);
        activeTab = clickGuiTab < 0 ? 0 : clickGuiTab;
        closeAllSettingsPanels();
        closeKeybindPanel();
        accountOpen = false;
    }

    function selectTab(index: number) {
        activeTab = index;
        closeAllSettingsPanels();
        closeKeybindPanel();
        accountOpen = false;
    }

    function handleWindowClick(event: MouseEvent) {
        if (accountOpen && userElement && !userElement.contains(event.target as Node)) {
            accountOpen = false;
        }
    }

    function isInteractive(target: HTMLElement): boolean {
        return target.closest(
            "button, input, textarea, a, [contenteditable='true'], .nav-item, .module, " +
            ".search, .results, .dropdown, .choice, .noUi-handle, .clickgui-content, .settings-page"
        ) !== null;
    }

    function startWindowDrag(event: MouseEvent) {
        if (event.button !== 0 || isInteractive(event.target as HTMLElement)) {
            return;
        }

        draggingWindow = true;
        dragStart = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            offsetX: windowOffset.x,
            offsetY: windowOffset.y
        };
    }

    function moveWindow(event: MouseEvent) {
        if (!draggingWindow) {
            return;
        }

        const scale = $scaleFactor * 0.5;
        const maxOffsetX = Math.max((window.innerWidth / scale - (windowElement?.offsetWidth ?? 0)) / 2, 0);
        const maxOffsetY = Math.max((window.innerHeight / scale - (windowElement?.offsetHeight ?? 0)) / 2, 0);

        const nextX = dragStart.offsetX + (event.clientX - dragStart.pointerX) / scale;
        const nextY = dragStart.offsetY + (event.clientY - dragStart.pointerY) / scale;

        windowOffset = {
            x: Math.min(Math.max(nextX, -maxOffsetX), maxOffsetX),
            y: Math.min(Math.max(nextY, -maxOffsetY), maxOffsetY)
        };
    }

    function endWindowDrag() {
        draggingWindow = false;
    }

</script>

<svelte:window onmousemove={moveWindow} onmouseup={endWindowDrag} onclick={handleWindowClick}/>

{#if isFullscreen}
    <div class="fullscreen">
        <div class="floating-tabs" transition:fly={{duration: 200, y: -20}}>
            {#each tabs as tab, index (tab.title)}
                <button
                        class="tab-button"
                        class:active={index === activeTab}
                        onclick={() => (activeTab = index)}
                        type="button"
                >
                    {tab.title}
                </button>
            {/each}
        </div>

        <div class="fullscreen-content">
            {#if Active}
                {@render Active()}
            {/if}
        </div>
    </div>
{:else}
    <ScaledClickGuiContent>
        <div class="shell" transition:fade={{duration: 160}}>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                    class="window"
                    bind:this={windowElement}
                    style="transform: translate({windowOffset.x}px, {windowOffset.y}px);"
                    onmousedown={startWindowDrag}
            >
                <aside class="sidebar">
                    <div class="brand">
                        <div class="logo"><span>NL</span></div>
                        <div class="brand-text">
                            <span class="name">{metadata?.name ?? "Neverlose"}</span>
                            <span class="sub">LiquidBounce</span>
                        </div>
                    </div>

                    <nav class="nav">
                        {#each sections as section (section.title)}
                            <div class="section">
                                <span class="section-title">{section.title}</span>

                                {#each section.categories as category (category)}
                                    <button
                                            class="nav-item"
                                            class:active={$activeCategory === category}
                                            onclick={() => selectCategory(category)}
                                            type="button"
                                    >
                                        <NavIcon name={category}/>
                                        <span>{category}</span>
                                    </button>
                                {/each}
                            </div>
                        {/each}
                    </nav>

                    <div class="footer">
                        <div class="section">
                            <span class="section-title">Menu</span>

                            {#each tabs as tab, index (tab.title)}
                                <button
                                        class="nav-item"
                                        class:active={index === activeTab}
                                        onclick={() => selectTab(index)}
                                        type="button"
                                >
                                    <NavIcon name={tab.icon ?? "client"}/>
                                    <span>{tab.title}</span>
                                </button>
                            {/each}
                        </div>

                        <div class="user-wrap" bind:this={userElement}>
                            <button
                                    class="user"
                                    class:open={accountOpen}
                                    type="button"
                                    onclick={() => (accountOpen = !accountOpen)}
                            >
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
                                <div class="user-text">
                                    <span class="name">{session?.username ?? metadata?.name ?? "Neverlose"}</span>
                                    <span class="sub">{yearsLeft} years left</span>
                                </div>
                                <span class="user-chevron"></span>
                            </button>

                            {#if accountOpen}
                                <AccountPanel {session} onclose={() => (accountOpen = false)}/>
                            {/if}
                        </div>
                    </div>
                </aside>

                <main class="main">
                    <div class="content">
                        {#if Active}
                            {@render Active()}
                        {/if}
                    </div>
                </main>
            </div>

            <div class="panel-layer">
                {#if $keybindPanel}
                    <KeybindPanel
                            name={$keybindPanel.name}
                            x={$keybindPanel.x}
                            y={$keybindPanel.y}
                            zIndex={$keybindPanel.zIndex}
                    />
                {/if}

                {#each $openSettingsPanels as panel (panel.name)}
                    <ModuleSettingsPanel name={panel.name} x={panel.x} y={panel.y} zIndex={panel.zIndex}/>
                {/each}
            </div>
        </div>
    </ScaledClickGuiContent>
{/if}

<style lang="scss">

  .shell {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .window {
    width: min(880px, 92%);
    height: min(660px, 90%);
    display: flex;
    overflow: hidden;
    border-radius: 20px;
    /* The sidebar surface paints the whole shell, so the right panel's rounded
       corner notches show exactly the same surface as the left panel */
    background-color: var(--clickgui-sidebar-background-color);
    /* One glass layer for both panels, so no seam can open up between them */
    backdrop-filter: blur(56px) saturate(150%);
    box-shadow: 0 10px 26px color-mix(in srgb, black 62%, transparent);
    user-select: none;
  }

  .panel-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .sidebar {
    width: clamp(184px, 23%, 230px);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background-color: transparent;
  }

  .brand {
    display: flex;
    align-items: center;
    column-gap: 11px;
    padding: 16px 16px 14px;
    border-bottom: solid 1px var(--border-color);
  }

  .logo {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background-color: #121926;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-shadow: -2px 2px 0 var(--clickgui-logo-shadow-color);

    span {
      display: block;
      /* Half the shadow offset keeps the shadow and letters visually balanced */
      transform: translate(1px, -1px);
    }
  }

  .brand-text {
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
      font-size: 10px;
      font-weight: 500;
      color: var(--clickgui-text-dimmed-color);
      opacity: 0.8;
    }
  }

  .nav {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 12px 10px 6px;

    &::-webkit-scrollbar {
      width: 3px;
    }
  }

  .section + .section {
    margin-top: 16px;
  }

  .section-title {
    display: block;
    padding: 0 8px 8px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: var(--clickgui-section-label-color);
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    column-gap: 12px;
    padding: 9px 10px;
    margin-bottom: 2px;
    border-radius: 10px;
    border: solid 1px transparent;
    background: transparent;
    color: var(--clickgui-nav-item-color);
    font-family: "Inter", sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: ease background-color 0.15s, ease border-color 0.15s, ease color 0.15s;

    :global(.nav-icon) {
      transition: ease color 0.15s;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:hover {
      background-color: var(--clickgui-module-hover-background-color);
      color: var(--clickgui-nav-item-active-text-color);
    }

    &.active {
      background-color: var(--clickgui-nav-item-active-background-color);
      color: var(--clickgui-nav-item-active-text-color);

      :global(.nav-icon) {
        color: var(--clickgui-nav-item-active-icon-color);
      }
    }
  }

  .footer {
    flex-shrink: 0;
    padding: 8px 10px 12px;
    border-top: solid 1px var(--border-color);
  }

  .user-wrap {
    position: relative;
    margin-top: 8px;
  }

  .user {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    column-gap: 10px;
    padding: 8px 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: ease background-color 0.15s;

    &:hover,
    &.open {
      background-color: var(--clickgui-module-hover-background-color);
    }

    .user-chevron {
      width: 6px;
      height: 6px;
      margin-left: auto;
      flex-shrink: 0;
      border-top: 1.5px solid var(--clickgui-text-dimmed-color);
      border-right: 1.5px solid var(--clickgui-text-dimmed-color);
      transform: rotate(45deg);
    }
  }

  .avatar {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    overflow: hidden;
    display: grid;
    place-items: center;
    background-color: #121926;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.6px;

    .face {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user-text {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .name {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--clickgui-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub {
      font-size: 10px;
      color: var(--clickgui-text-dimmed-color);
      opacity: 0.8;
    }
  }

  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--clickgui-main-background-color);
    /* Mirrors the window radius so the right panel reads as its own surface */
    border-radius: 20px 0 0 20px;
    /* Covers the sidebar's fractional edge pixel instead of a gap showing through */
    margin-left: -1px;
  }

  .content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .fullscreen {
    position: absolute;
    inset: 0;
  }

  .fullscreen-content {
    position: absolute;
    inset: 0;
  }

  .floating-tabs {
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2px;
    padding: 4px;
    border-radius: 10px;
    background-color: var(--clickgui-tabs-background-color);
    border: solid 1px var(--border-color);
    box-shadow: 0 12px 32px var(--clickgui-tabs-shadow-color);
    backdrop-filter: blur(14px);
    z-index: 9999999999;
  }

  .tab-button {
    background: transparent;
    color: var(--clickgui-text-dimmed-color);
    padding: 6px 12px;
    font-family: "Inter", sans-serif;
    font-size: 12px;
    font-weight: 500;
    border-radius: 7px;
    cursor: pointer;
    transition: ease background-color 0.15s, ease color 0.15s;
    border: solid 1px transparent;

    &:hover {
      color: var(--clickgui-text-color);
      background-color: var(--clickgui-tab-hover-background-color);
    }

    &.active {
      color: var(--clickgui-text-color);
      background-color: var(--clickgui-tab-active-background-color);
      border: 1px solid var(--clickgui-tab-active-border-color);
    }
  }
</style>
