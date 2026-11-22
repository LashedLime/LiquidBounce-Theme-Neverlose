<script lang="ts">
    import Header from "./header/Header.svelte";
    import {onMount} from "svelte";

    const transitionDuration = 700;
    // The in-game browser is much wider than the 1600px the layout is designed for,
    // so the whole menu is scaled with the viewport instead of rendering at 1:1 there.
    const DESIGN_WIDTH = 1800;

    let ready = false;
    let uiScale = 1;

    function updateScale() {
        uiScale = Math.min(Math.max(window.innerWidth / DESIGN_WIDTH, 1), 2.4);
        document.documentElement.style.setProperty("--ui-scale", String(uiScale));
    }

    onMount(() => {
        updateScale();
        window.addEventListener("resize", updateScale);

        const timeout = window.setTimeout(() => {
            ready = true;
        }, transitionDuration);

        return () => {
            window.removeEventListener("resize", updateScale);
            window.clearTimeout(timeout);
        };
    });
</script>

<div class="menu" style={`zoom: ${uiScale};`}>
    {#if ready}
        <div>
            <Header/>
        </div>
    {/if}

    <div class="menu-wrapper">
        <slot/>
    </div>
</div>

<style lang="scss">
  .menu {
    padding: 30px;
    display: flex;
    flex-direction: column;
    font-family: "Inter", sans-serif;
    position: fixed;
    inset: 0;
    // Intentionally transparent: the client renders the vanilla panorama behind the theme.
    // These gradients only darken the scene so the panels stay readable on bright spots.
    background-image: linear-gradient(
            180deg,
            color-mix(in srgb, #04060a 52%, transparent) 0%,
            color-mix(in srgb, #04060a 16%, transparent) 26%,
            color-mix(in srgb, #04060a 14%, transparent) 62%,
            color-mix(in srgb, #04060a 50%, transparent) 100%
    ),
    radial-gradient(
            120% 120% at 50% 45%,
            transparent 42%,
            color-mix(in srgb, #04060a 34%, transparent) 100%
    );
  }

  .menu-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    will-change: transform;
  }
</style>
