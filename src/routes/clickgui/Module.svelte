<script lang="ts">
    import {onMount} from "svelte";
    import {
        getModuleSettings,
        setModuleEnabled,
    } from "../../integration/rest";
    import {description as descriptionStore, highlightModuleName} from "./clickgui_store";
    import {convertToSpacedString, spaceSeperatedNames} from "../../theme/theme_config";
    import {scaleFactor} from "./clickgui_store";
    import {openSettingsPanels, toggleSettingsPanel} from "./settings_panels";
    import {openKeybindPanel} from "./keybind_panels";

    export let name: string;
    export let enabled: boolean;
    export let description: string;
    export let aliases: string[];

    let moduleNameElement: HTMLElement;
    let moduleElement: HTMLElement;
    let hasSettings = false;

    onMount(async () => {
        const configurable = await getModuleSettings(name);
        hasSettings = configurable.value.filter(v => v.name !== "Bind" && v.name !== "Hidden").length > 0;
    });

    highlightModuleName.subscribe((m) => {
        if (name !== m) {
            return;
        }

        setTimeout(() => {
            if (!moduleNameElement) {
                return;
            }
            moduleNameElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 1000);
    });

    async function toggleModule() {
        await setModuleEnabled(name, !enabled);
    }

    function toggleSettings(event: MouseEvent) {
        event.stopPropagation();

        const bounds = moduleElement.getBoundingClientRect();
        const scale = $scaleFactor * 0.5;
        const panelWidth = 264;
        const screenWidth = window.innerWidth / scale;

        let panelX = bounds.right / scale + 10;
        let panelY = bounds.top / scale;

        if (panelX + panelWidth > screenWidth - 12) {
            panelX = bounds.left / scale - panelWidth - 10;
        }

        toggleSettingsPanel(name, Math.max(panelX, 12), Math.max(panelY, 12));
    }

    function openKeybind(event: MouseEvent) {
        event.stopPropagation();

        const bounds = moduleElement.getBoundingClientRect();
        const scale = $scaleFactor * 0.5;
        const panelWidth = 232;
        const screenWidth = window.innerWidth / scale;

        let panelX = bounds.right / scale + 10;
        let panelY = bounds.top / scale;

        if (panelX + panelWidth > screenWidth - 12) {
            panelX = bounds.left / scale - panelWidth - 10;
        }

        openKeybindPanel(name, Math.max(panelX, 12), Math.max(panelY, 12));
    }

    function setDescription() {
        if (!moduleNameElement) return;

        const container = moduleNameElement.closest(".clickgui") as HTMLElement | null;
        if (!container) return;

        const containerBounds = container.getBoundingClientRect();
        const bounds = moduleNameElement.getBoundingClientRect();
        const scale = containerBounds.width / (container.offsetWidth || 1);

        let moduleDescription = description;
        if (aliases.length > 0) {
            moduleDescription += ` (aka ${aliases.map(name => $spaceSeperatedNames ? convertToSpacedString(name) : name).join(", ")})`;
        }

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const rowLeft = (bounds.left - containerBounds.left) / scale;
        const rowRight = (bounds.right - containerBounds.left) / scale;
        const rowCenterY = (bounds.top + bounds.height / 2 - containerBounds.top) / scale;

        const gap = 10;
        const edge = 8;
        const maxTooltipWidth = 220;
        const minTooltipWidth = 140;
        const spaceRight = containerWidth - rowRight - gap - edge;
        const spaceLeft = rowLeft - gap - edge;

        // Only show the tooltip when it can sit beside the row instead of covering it
        if (spaceRight < minTooltipWidth && spaceLeft < minTooltipWidth) {
            descriptionStore.set(null);
            return;
        }

        const openRight = spaceRight >= minTooltipWidth;
        const maxWidth = Math.min(maxTooltipWidth, openRight ? spaceRight : spaceLeft);

        descriptionStore.set({
            x: openRight ? rowRight + gap : rowLeft - gap - maxWidth,
            y: Math.min(Math.max(rowCenterY, 26), Math.max(containerHeight - 26, 26)),
            anchor: openRight ? "right" : "left",
            maxWidth,
            description: moduleDescription
        });
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        class="module"
        class:enabled
        bind:this={moduleElement}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
            class="name"
            on:contextmenu|preventDefault={openKeybind}
            on:click={toggleModule}
            on:mouseenter={setDescription}
            on:mouseleave={() => descriptionStore.set(null)}
            bind:this={moduleNameElement}
            class:highlight={name === $highlightModuleName}
    >
        <span class="label">{$spaceSeperatedNames ? convertToSpacedString(name) : name}</span>

        <div class="controls">
            {#if hasSettings}
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                        class="settings-dots"
                        class:open={$openSettingsPanels.some(panel => panel.name === name)}
                        aria-label="Module settings"
                        on:click={toggleSettings}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            {/if}

            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button
                    class="module-toggle"
                    class:on={enabled}
                    aria-pressed={enabled}
                    on:click|stopPropagation={toggleModule}
            >
                <span class="knob"></span>
            </button>
        </div>
    </div>
</div>

<style lang="scss">
  .module {
    position: relative;
    transition: ease background-color 0.15s;

    .name {
      cursor: pointer;
      transition: ease background-color 0.15s,
      ease color 0.15s;

      color: var(--clickgui-text-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      column-gap: 8px;
      font-size: 12.5px;
      font-weight: 500;
      position: relative;
      padding: 12px 14px;
      border-radius: 0;

      .label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &.highlight {
        background-color: var(--accent-subtle-background-color);
        box-shadow: inset 0 0 0 1px var(--clickgui-module-highlight-color);
        color: var(--clickgui-text-color);
      }

      &:hover {
        background-color: var(--clickgui-module-hover-background-color);
        color: var(--clickgui-text-color);
      }
    }

    &.enabled .name {
      color: var(--clickgui-text-color);
    }

    .controls {
      display: flex;
      align-items: center;
      column-gap: 9px;
      flex-shrink: 0;
    }

    .settings-dots {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 2px;
      width: 16px;
      height: 14px;
      cursor: pointer;

      span {
        display: block;
        width: 2.5px;
        height: 2.5px;
        border-radius: 50%;
        background-color: var(--clickgui-module-settings-color);
        transition: ease background-color 0.15s;
      }

      &:hover span {
        background-color: #ffffff;
      }

      &.open span {
        background-color: var(--accent-color);
      }
    }

    .module-toggle {
      all: unset;
      position: relative;
      flex-shrink: 0;
      width: 42px;
      height: 24px;
      border-radius: 999px;
      background-color: var(--clickgui-switch-track-color);
      cursor: pointer;
      transition: background-color 0.22s ease;

      .knob {
        position: absolute;
        top: 50%;
        left: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: var(--clickgui-switch-thumb-color);
        transform: translateY(-50%);
        transition: transform 0.22s cubic-bezier(0.3, 0.9, 0.3, 1), ease background-color 0.22s;
      }

      &.on {
        background-color: var(--clickgui-switch-track-active-color);

        .knob {
          transform: translate(18px, -50%);
          background-color: var(--clickgui-switch-thumb-active-color);
        }
      }

      &:hover .knob {
        box-shadow: 0 0 0 3px color-mix(in srgb, #ffffff 12%, transparent);
      }
    }
  }
</style>
