# Neverlose

A Neverlose-style theme for [LiquidBounce](https://liquidbounce.net), built with [Svelte](https://svelte.dev/).

Theme id: `neverlose`

## Features

- **ClickGUI** – Neverlose-style window with icon sidebar, category tabs, module rows, hover descriptions, keybind picker on right-click, and a draggable settings popup per module.
- **Account menu** – player footer with the signed-in account's skin face, a settings popover (Alt Manager, Random Account, Spaced Names) and the client's config controls.
- **HUD** – `NL` watermark info bar with player head, username, ping and FPS; plus the default ArrayList, TabGUI, notifications and other HUD components.
- **Notifications** – compact single-row cards with a FIFO queue.
- **Screens** – title, clickgui, multiplayer, singleplayer, altmanager, proxymanager and customize, styled consistently.

## Requirements

- [Node.js](https://nodejs.org/) (latest LTS or stable)
- LiquidBounce with the theme system (`nextgen`)

## Development

```bash
npm install
npm run dev
```

Start LiquidBounce, then point the client at the dev server so it hot-reloads while you edit:

```
.client theme set localhost:5173/
```

To open a screen in your system browser for inspection:

```
.client integration menu
```

## Building

```bash
npm run build
```

The production build lands in `dist/`. Copy it into your themes folder (`.client theme browse`), name the folder `neverlose`, and apply it:

```
.client theme set neverlose
```

## Marketplace publishing

Revisions are built and uploaded by GitHub Actions, triggered by a GitHub release.

1. Create the theme under [Resources](https://liquidbounce.net/account/resources) and copy its **ID**. Generate an API token on the same page — it is shown only once.
2. In this repository, under Settings → Secrets and variables → Actions, add:
   - **Variable** `MARKETPLACE_ITEM_ID` — the theme's resource ID
   - **Secret** `API_TOKEN` — the API token
3. Bump `version` in `public/metadata.json` and commit it.
4. Push a version tag, for example `git tag v0.1.0 && git push origin v0.1.0` — the workflow creates the GitHub release for it and publishes that release.

`.github/workflows/build.yml` then builds `dist/`, packs it as `neverlose-<version>.zip` with the theme files at the archive root, attaches that archive to the release and posts it as a marketplace revision. Plain pushes to `main` only build and keep the archive as a workflow artifact, so nothing is published until you cut a release.

## Credits and license

Based on the [LiquidBounce default theme](https://github.com/CCBlueX/LiquidBounce-Theme) by [CCBlueX](https://github.com/CCBlueX), as are the theme API, integration layer and HUD components this project builds on.

Licensed under the [GNU General Public License v3.0](LICENSE).
