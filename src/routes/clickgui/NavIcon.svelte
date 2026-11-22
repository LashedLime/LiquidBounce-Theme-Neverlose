<script lang="ts">
    import client from "../../assets/nav/icon-client.svg?raw";
    import combat from "../../assets/nav/icon-combat.svg?raw";
    import drag from "../../assets/nav/icon-drag.svg?raw";
    import exploit from "../../assets/nav/icon-exploit.svg?raw";
    import fun from "../../assets/nav/icon-fun.svg?raw";
    import misc from "../../assets/nav/icon-misc.svg?raw";
    import movement from "../../assets/nav/icon-movement.svg?raw";
    import player from "../../assets/nav/icon-player.svg?raw";
    import render from "../../assets/nav/icon-render.svg?raw";
    import reset from "../../assets/nav/icon-reset.svg?raw";
    import world from "../../assets/nav/icon-world.svg?raw";

    const ICONS: Record<string, string> = {
        client,
        combat,
        drag,
        exploit,
        fun,
        misc,
        movement,
        player,
        render,
        reset,
        world
    };

    let {name = "client", size = 14} = $props<{ name?: string; size?: number }>();

    const key = $derived(name.toLowerCase().replace(/^icon-/, ""));
    const markup = $derived(ICONS[key] ?? ICONS.client);
</script>

<!--
    The icons are inlined instead of being used as a CSS mask: the in-game renderer
    does not paint masked elements reliably, which left the sidebar without icons.
    Tiny's clip path ids ("a") repeat in every icon, so they are made unique.
-->
<span class="nav-icon" aria-hidden="true" style={`--nav-icon-size: ${size}px`}>
    {@html markup.replace(/id="a"/g, `id="nav-${key}"`).replaceAll("#a", `#nav-${key}`)}
</span>

<style lang="scss">
  .nav-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--nav-icon-size, 14px);
    height: var(--nav-icon-size, 14px);
    flex-shrink: 0;
    color: inherit;

    :global(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Presentation attributes lose against CSS rules, so this tints every path */
    :global(svg [fill]) {
      fill: currentColor;
    }
  }
</style>
