<script lang="ts">
    import {listen} from "../../../integration/ws";
    import type {ClientPlayerDataEvent, ClientPlayerEffectEvent} from "../../../integration/events";
    import type {StatusEffect} from "../../../integration/types";
    import {effectTextureUrl} from "../../../integration/rest";

    let effects: StatusEffect[] = [];

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        effects = event.playerData.effects;
    });

    listen("clientPlayerEffect", (event: ClientPlayerEffectEvent) => {
        effects = event.effects;
    });

    function formatTime(duration: number): string {
        if (duration === -1) {
            return "*:*";
        }

        const totalSeconds = Math.floor(duration / 20);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    function formatAmplifier(n: number): string {
        return (n + 1).toString();
    }
</script>

{#if effects.length > 0}
    <div class="effects">
        {#each effects as e}
            <div class="effect">
                <img class="effect-icon" src={effectTextureUrl(e.effect)} alt={e.localizedName}/>
                <span class="name">{e.localizedName}  <span
                        class="amplifier">{formatAmplifier(e.amplifier)}</span></span>
                <span class="duration">{formatTime(e.duration)}</span>
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">

  .effects {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: var(--effects-background-color);
    border-radius: 10px;
    border: solid 1px var(--hud-panel-border-color);
    box-shadow: 0 6px 18px var(--hud-panel-shadow-color);
    backdrop-filter: blur(20px) saturate(150%);
    padding: 6px 8px;
  }

  .effect {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 12.5px;

    .effect-icon {
      width: 16px;
      height: 16px;
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
    }

    .name {
      color: var(--effects-name-color);
    }

    .amplifier {
      color: var(--effects-amplifier-color);
    }

    .duration {
      margin-left: auto;
      font-family: monospace;
      color: var(--effects-duration-color);
      font-size: 11px;
    }
  }
</style>
