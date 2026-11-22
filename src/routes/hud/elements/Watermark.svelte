<script lang="ts">
    import {onMount} from "svelte";
    import {getClientInfo, getPlayerData, getSession} from "../../../integration/rest";
    import {listen} from "../../../integration/ws";
    import type {ClientPlayerDataEvent, FpsChangeEvent} from "../../../integration/events";
    import type {Session} from "../../../integration/types";
    import MenuIcon from "../../clickgui/MenuIcon.svelte";

    let session = $state<Session | null>(null);
    let faceFailed = $state(false);
    let ping = $state<number | null>(null);
    let fps = $state<number | null>(null);

    const username = $derived(session?.username ?? "Player");
    const faceUrl = $derived(
        session?.username
            ? `https://mc-api.io/render/FACE/${encodeURIComponent(session.username)}/JAVA?size=64`
            : null
    );

    onMount(() => {
        getSession()
            .then(loaded => session = loaded)
            .catch(() => session = null);

        getPlayerData()
            .then(data => ping = typeof data.ping === "number" ? data.ping : ping)
            .catch(() => undefined);

        getClientInfo()
            .then(info => fps = info.fps)
            .catch(() => undefined);
    });

    listen("session", async () => {
        session = await getSession();
        faceFailed = false;
    });

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        const value = event.playerData?.ping;

        if (typeof value === "number") {
            ping = value;
        }
    });

    listen("fps", (event: FpsChangeEvent) => {
        fps = event.fps;
    });
</script>

<div class="watermark">
    <div class="mark">NL</div>

    {#if faceUrl && !faceFailed}
        <img
                class="face"
                src={faceUrl}
                alt=""
                onerror={() => (faceFailed = true)}
        />
    {/if}

    <span class="username">{username}</span>

    <span class="sep"></span>

    <span class="stat">
        <MenuIcon name="signal" size={13}/>
        <span class="label">Ping:</span>
        <span class="value">{ping === null ? "--" : `${ping}ms`}</span>
    </span>

    <span class="sep"></span>

    <span class="stat">
        <MenuIcon name="pulse" size={13}/>
        <span class="label">FPS:</span>
        <span class="value">{fps ?? "--"}</span>
    </span>
</div>

<style lang="scss">
  .watermark {
    display: flex;
    align-items: center;
    column-gap: 8px;
    width: max-content;
    padding: 4px 11px 4px 4px;
    border-radius: 10px;
    background-color: var(--watermark-background-color);
    border: solid 1px var(--watermark-border-color);
    box-shadow: 0 6px 18px var(--watermark-shadow-color);
    backdrop-filter: blur(24px) saturate(150%);
    font-family: "Inter", sans-serif;
    user-select: none;
  }

  .mark {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 6px;
    background-color: #121926;
    color: #ffffff;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: -1px 1px 0 #2a417d;
  }

  .face {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    background-color: #121926;
  }

  .username {
    font-size: 12px;
    font-weight: 600;
    color: var(--watermark-text-color);
    white-space: nowrap;
  }

  .sep {
    width: 1px;
    height: 13px;
    flex-shrink: 0;
    background-color: var(--watermark-border-color);
  }

  .stat {
    display: flex;
    align-items: center;
    column-gap: 5px;
    color: var(--watermark-subtitle-color);
    white-space: nowrap;

    .label {
      font-size: 11px;
      font-weight: 500;
    }

    .value {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--watermark-text-color);
      font-variant-numeric: tabular-nums;
    }
  }
</style>
