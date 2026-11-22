<script lang="ts">
    import type {Module as TModule} from "../../integration/types";
    import Module from "./Module.svelte";
    import Search from "./Search.svelte";
    import Description from "./Description.svelte";
    import {onMount} from "svelte";
    import {activeCategory, groupedModules, loadClickGuiData, modules} from "./clickgui_data";
    import {listen} from "../../integration/ws";
    import type {ModuleToggleEvent} from "../../integration/events";
    import {description as descriptionStore, highlightModuleName} from "./clickgui_store";

    let categoryModules: TModule[] = [];
    let highlightedModule: TModule | undefined;

    $: categoryModules = ($activeCategory && $groupedModules[$activeCategory]) || [];
    $: highlightedModule = $modules.find(module => module.name === $highlightModuleName);
    $: if (highlightedModule) {
        activeCategory.set(highlightedModule.category);
    }

    $: columns = splitIntoColumns(categoryModules);

    function splitIntoColumns(modules: TModule[]) {
        const split = Math.ceil(modules.length / 2);

        return [
            {title: "Main", modules: modules.slice(0, split)},
            {title: "Other", modules: modules.slice(split)}
        ].filter(column => column.modules.length > 0);
    }

    onMount(() => {
        loadClickGuiData().catch(error => console.error("[ClickGUI] Failed to load modules", error));
    });

    listen("moduleToggle", (e: ModuleToggleEvent) => {
        modules.update(list =>
            list.map(module => module.name === e.moduleName ? {...module, enabled: e.enabled} : module)
        );
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="clickgui" on:mouseleave={() => descriptionStore.set(null)}>
    <div class="topbar">
        <div class="topbar-title">
            <span class="section-label">{($activeCategory ?? "Modules").toUpperCase()}</span>
            <span class="module-count">{categoryModules.length}</span>
        </div>

        <div class="search-slot">
            <Search modules={structuredClone($modules)}/>
        </div>
    </div>

    <div class="content clickgui-content">
        {#if categoryModules.length > 0}
            <div class="section-grid">
                {#each columns as column (column.title)}
                    <section class="module-group">
                        <span class="section-label">{column.title}</span>

                        <div class="group-card">
                            {#each column.modules as module (module.name)}
                                <Module
                                        name={module.name}
                                        enabled={module.enabled}
                                        description={module.description}
                                        aliases={module.aliases}
                                />
                            {/each}
                        </div>
                    </section>
                {/each}
            </div>
        {:else}
            <div class="empty">No modules in this category</div>
        {/if}
    </div>

    <Description/>
</div>

<style lang="scss">
  .clickgui {
    position: relative;
    height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    display: flex;
    align-items: center;
    column-gap: 12px;
    min-width: 0;
    padding: 15px 18px;
    border-bottom: solid 1px var(--border-color);
  }

  .topbar-title {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    color: var(--clickgui-section-label-color);
  }

  .module-count {
    font-size: 10px;
    font-weight: 500;
    color: var(--clickgui-text-dimmed-color);
    opacity: 0.7;
  }

  .search-slot {
    margin-left: auto;
    width: clamp(110px, 32%, 200px);
    flex-shrink: 1;
    min-width: 0;
  }

  .content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 14px 18px 18px;
    /* Keeps the module cards clear of the panel's bottom edge, even while scrolling */
    margin-bottom: 18px;
    container-type: inline-size;

    &::-webkit-scrollbar {
      width: 4px;
    }
  }

  .section-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    column-gap: 18px;
    row-gap: 22px;
  }

  .module-group {
    min-width: 0;

    .section-label {
      display: block;
      padding: 0 2px 8px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.9px;
      text-transform: uppercase;
      color: var(--clickgui-section-label-color);
    }
  }

  .group-card {
    overflow: hidden;
    border-radius: 14px;
    background-color: var(--clickgui-card-background-color);
    border: solid 1px var(--clickgui-card-border-color);

    :global(.module + .module) {
      border-top: none;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 14px;
        right: 14px;
        height: 1px;
        background-color: var(--clickgui-card-divider-color);
      }
    }
  }

  @container (max-width: 520px) {
    .section-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .empty {
    padding: 32px 0;
    text-align: center;
    font-size: 12px;
    color: var(--clickgui-text-dimmed-color);
  }
</style>
