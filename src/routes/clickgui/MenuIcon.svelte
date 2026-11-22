<script lang="ts">
    const ICONS: Record<string, string> = {
        user: "<circle cx=\"12\" cy=\"7.8\" r=\"4\"/><path d=\"M4.5 20c0-3.7 3.4-5.5 7.5-5.5s7.5 1.8 7.5 5.5\"/>",
        dice: "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"4.5\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"15.5\" cy=\"15.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"15.5\" cy=\"8.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"8.5\" cy=\"15.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/>",
        text: "<path d=\"M4 7h16M4 12h10.5M4 17h13.5\"/>",
        keyboard: "<rect x=\"2.5\" y=\"6\" width=\"19\" height=\"12\" rx=\"2.5\"/><path d=\"M6.5 10h1M10.5 10h1M14.5 10h1M18 10h0.5M7.5 14h9\"/>",
        eye: "<path d=\"M2.6 12S6.2 6.2 12 6.2 21.4 12 21.4 12 17.8 17.8 12 17.8 2.6 12 2.6 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/>",
        trash: "<path d=\"M4 7h16M9.5 4h5M6.2 7l1 13h9.6l1-13M10 11v5M14 11v5\"/>",
        signal: "<path d=\"M5 20v-3M10 20v-6.5M15 20v-10M20 20v-15\"/>",
        pulse: "<path d=\"M2.8 12h4.1l2.4-6 3.8 12 2.4-6h4.7\"/>"
    };

    let {name = "user", size = 16} = $props<{ name?: string; size?: number }>();

    const markup = $derived(`<svg viewBox="0 0 24 24">${ICONS[name] ?? ICONS.user}</svg>`);
</script>

<span class="menu-icon" aria-hidden="true" style={`--menu-icon-size: ${size}px`}>
    {@html markup}
</span>

<style lang="scss">
  .menu-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--menu-icon-size, 16px);
    height: var(--menu-icon-size, 16px);
    flex-shrink: 0;
    color: inherit;

    :global(svg) {
      width: 100%;
      height: 100%;
      display: block;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      overflow: visible;
    }
  }
</style>
