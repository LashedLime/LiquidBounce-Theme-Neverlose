import {derived, writable} from "svelte/store";
import type {GroupedModules, Module, ModuleCategory} from "../../integration/types";
import {getCategories, getModules} from "../../integration/rest";
import {groupByCategory} from "../../integration/util";

export const modules = writable<Module[]>([]);
export const groupedModules = derived(modules, modules => groupByCategory(modules));
export const categoryIcons = writable<Record<string, string>>({});
export const activeCategory = writable<string | null>(null);

const CATEGORY_SECTIONS: { title: string; categories: string[] }[] = [
    {title: "Aimbot", categories: ["Combat"]},
    {title: "Common", categories: ["Movement", "Player", "Render", "World"]},
    {title: "Miscellaneous", categories: ["Misc", "Exploit", "Fun"]},
];

export interface CategorySection {
    title: string;
    categories: string[];
}

/**
 * Groups the categories reported by the client into the sections shown in the sidebar.
 * Categories the client adds later end up in the last section instead of disappearing.
 */
export function buildCategorySections(categories: string[]): CategorySection[] {
    const remaining = new Set(categories);
    const sections: CategorySection[] = [];

    for (const section of CATEGORY_SECTIONS) {
        const present = section.categories.filter(category => remaining.has(category));
        present.forEach(category => remaining.delete(category));

        if (present.length > 0) {
            sections.push({title: section.title, categories: present});
        }
    }

    if (remaining.size > 0) {
        const leftover = [...remaining];
        const lastSection = sections[sections.length - 1];

        if (lastSection) {
            lastSection.categories.push(...leftover);
        } else {
            sections.push({title: "Categories", categories: leftover});
        }
    }

    return sections;
}

let pending: Promise<void> | null = null;

/**
 * Fetches the module tree once and shares it between the sidebar and the ClickGUI.
 */
export function loadClickGuiData(): Promise<void> {
    if (pending) {
        return pending;
    }

    pending = (async () => {
        const [loadedModules, categories] = await Promise.all([getModules(), getCategories()]);

        modules.set(loadedModules);
        categoryIcons.set(
            Object.fromEntries(
                categories
                    .filter((category: ModuleCategory) => category.icon)
                    .map((category: ModuleCategory) => [category.name, category.icon!])
            )
        );

        activeCategory.update(current => current ?? loadedModules[0]?.category ?? null);
    })().catch((error) => {
        pending = null;
        throw error;
    });

    return pending;
}
