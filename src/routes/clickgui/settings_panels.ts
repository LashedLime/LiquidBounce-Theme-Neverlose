import {writable} from "svelte/store";

export interface SettingsPanelState {
    name: string;
    x: number;
    y: number;
    zIndex: number;
}

export const openSettingsPanels = writable<SettingsPanelState[]>([]);

let zIndexCounter = 10;

export function isSettingsPanelOpen(name: string): boolean {
    let open = false;
    openSettingsPanels.update(panels => {
        open = panels.some(panel => panel.name === name);
        return panels;
    });

    return open;
}

export function toggleSettingsPanel(name: string, x: number, y: number) {
    openSettingsPanels.update(panels => {
        if (panels.some(panel => panel.name === name)) {
            return panels.filter(panel => panel.name !== name);
        }

        return [...panels, {name, x, y, zIndex: ++zIndexCounter}];
    });
}

export function closeSettingsPanel(name: string) {
    openSettingsPanels.update(panels => panels.filter(panel => panel.name !== name));
}

export function bringSettingsPanelToFront(name: string) {
    openSettingsPanels.update(panels =>
        panels.map(panel => panel.name === name ? {...panel, zIndex: ++zIndexCounter} : panel)
    );
}

export function closeAllSettingsPanels() {
    openSettingsPanels.set([]);
}
