<script lang="ts">
    export let maxHealth: number;
    export let health: number;

    let width = Math.ceil(health / maxHealth * 100);
    $: width = Math.ceil(health / maxHealth * 100);
</script>

<div class="health-progress">
    <div class="thumb" style="width: {width}%;"></div>
</div>

<style lang="scss">

    .health-progress {
        position: relative;
        height: 5px;
        margin: 0 12px 10px;
        border-radius: 999px;
        background-color: color-mix(in srgb, #000000 45%, transparent);
        overflow: hidden;
    }

    .thumb {
        height: 100%;
        border-radius: 999px;
        background-color: var(--targethud-health-progress-color);
        transition: ease width 0.5s;
    }
</style>