<script lang="ts">
    import {onMount, tick} from "svelte";
    import type {Module} from "../../../integration/types";
    import {getModules} from "../../../integration/rest";
    import {listen} from "../../../integration/ws";
    import {getTextWidth} from "../../../integration/text_measurement";
    import {flip} from "svelte/animate";
    import {fly} from "svelte/transition";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import type {HudArrayListSettings} from "../components";

    export let settings: { [name: string]: any };

    let cSettings = settings as HudArrayListSettings;

    let enabledModules: Module[] = [];

    async function updateEnabledModules() {
        const modules = await getModules();
        const visibleModules = modules.filter(m => m.enabled && !m.hidden);

        const modulesWithWidths = visibleModules.map(module => {
            const formattedName = $spaceSeperatedNames ? convertToSpacedString(module.name) : module.name;
            const fullName = module.tag == null || !cSettings.showTags
                ? formattedName
                : formattedName + " " + module.tag;

            return {
                ...module,
                width: getTextWidth(fullName, "500 14px Inter")
            };
        });

        modulesWithWidths.sort((a, b) => cSettings.order === "Ascending" ? a.width - b.width : b.width - a.width);

        enabledModules = modulesWithWidths;
        await tick();
    }

    $: if (cSettings !== settings) {
        cSettings = settings as HudArrayListSettings;
        updateEnabledModules();
    }

    spaceSeperatedNames.subscribe(async () => {
        await updateEnabledModules();
    });

    onMount(async () => {
        await updateEnabledModules();
    });

    listen("moduleToggle", async () => {
        await updateEnabledModules();
    });

    listen("refreshArrayList", async () => {
        await updateEnabledModules();
    });
</script>

<div class="arraylist" class:left={cSettings.itemAlignment === "Left"}>
    {#each enabledModules as {name, tag} (name)}
        <div
                class="module"
                animate:flip={{ duration: 200 }}
                transition:fly={{ x: 50, duration: 200 }}
        >
            {$spaceSeperatedNames ? convertToSpacedString(name) : name}
            {#if tag && cSettings.showTags}
                <span class="tag">{tag}</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">

  .arraylist {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    row-gap: 1px;

    &.left {
      align-items: flex-start;

      .module {
        border-radius: 0 4px 4px 0;
        border-left: none;
        border-right: solid 2px var(--arraylist-border-color);
        flex-direction: row-reverse;
      }
    }
  }

  .module {
    display: flex;
    align-items: baseline;
    column-gap: 5px;
    background-color: var(--arraylist-background-color);
    background-image: linear-gradient(
                    90deg,
                    color-mix(in srgb, var(--accent-color) 16%, transparent),
                    transparent 60%
    );
    color: var(--arraylist-text-color);
    font-family: "Inter", sans-serif;
    font-size: 12.5px;
    line-height: 1.3;
    border-radius: 4px 0 0 4px;
    padding: 4px 9px 4px 7px;
    border-left: solid 2px var(--arraylist-border-color);
    box-shadow: 0 3px 10px var(--arraylist-row-shadow-color);
    width: max-content;
    font-weight: 500;
  }

  .tag {
    color: var(--arraylist-tag-color);
    font-size: 10px;
    font-weight: 500;
  }
</style>
