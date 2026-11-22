import {writable} from "svelte/store";

export interface KeybindPanelState {
    name: string;
    x: number;
    y: number;
    zIndex: number;
}

export const keybindPanel = writable<KeybindPanelState | null>(null);

let zIndexCounter = 60;

export function openKeybindPanel(name: string, x: number, y: number) {
    keybindPanel.update(current => current?.name === name ? null : {name, x, y, zIndex: ++zIndexCounter});
}

export function closeKeybindPanel() {
    keybindPanel.set(null);
}

export function bringKeybindPanelToFront() {
    keybindPanel.update(current => current ? {...current, zIndex: ++zIndexCounter} : current);
}
