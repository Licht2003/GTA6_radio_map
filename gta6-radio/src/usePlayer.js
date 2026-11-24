import { useEffect, useRef, useState } from "react";
import { STATIONS } from "./data";
import { findPreview, findYouTube } from "./api";

const CAP = 90; // 1:30 bawat kanta
let ytLoading;
const loadYT = () => (ytLoading ||= new Promise((res) => {
  if (window.YT?.Player) return res();
  window.onYouTubeIframeAPIReady = res;
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);
}));

export function usePlayer() {
  const audio = useRef(null), yt = useRef(null), mode = useRef("pv");
  const token = useRef(0), fails = useRef(0), busy = useRef(false), volRef = useRef(0.5), act = useRef({});
  const [sel, setSel] = useState({ s: 0, t: 0 }); // V-Rock → Love Is a Long Road
  const [st, setSt] = useState({ playing: false, status: "", cover: "", link: "", source: "", cur: 0, dur: CAP });
  const [vol, setVolState] = useState(0.5);
  const patch = (o) => setSt((p) => ({ ...p, ...o }));

  useEffect(() => {
    const a = (audio.current = new Audio());
    a.volume = 0.5;
    a.onplay = () => mode.current === "pv" && patch({ playing: true });
    a.onpause = () => mode.current === "pv" && patch({ playing: false });
    a.onended = () => act.current.next();
    a.ontimeupdate = () => mode.current === "pv" && patch({ cur: a.currentTime, dur: a.duration || 30 });
    const tick = setInterval(() => {
      const p = yt.current;
      if (mode.current !== "yt" || !p?.getCurrentTime || busy.current) return;
      const cur = p.getCurrentTime();
      patch({ cur, dur: Math.min(p.getDuration() || CAP, CAP) });
      if (cur >= CAP) act.current.next();
    }, 500);
    return () => { clearInterval(tick); a.pause(); };
  }, []);

  const startYT = async (vid, id) => {
    await loadYT();
    if (!yt.current) {
      const box = document.createElement("div");
      box.style.cssText = "position:fixed;left:-9999px;top:0;width:200px;height:200px";
      document.body.appendChild(box);
      await new Promise((res) => {
        yt.current = new window.YT.Player(box, {
          width: 200, height: 200, playerVars: { playsinline: 1, controls: 0 },
          events: {
            onReady: res,
            onStateChange: (e) => {
              if (mode.current !== "yt") return;
              if (e.data === 1) { busy.current = false; patch({ playing: true, status: "" }); }
              if (e.data === 2) patch({ playing: false });
              if (e.data === 0) act.current.next();
            },
            onError: () => mode.current === "yt" && act.current.ytErr(),
          },
        });
      });
    }
    if (id !== token.current) return;
    mode.current = "yt";
    yt.current.setVolume(volRef.current * 100);
    yt.current.loadVideoById(vid);
    patch({ cover: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`, link: `https://www.youtube.com/watch?v=${vid}`, source: "YouTube", dur: CAP });
  };

  const play = async (s, t, noYT = false) => {
    const id = ++token.current, [artist, title] = STATIONS[s].tracks[t];
    busy.current = true;
    setSel({ s, t });
    audio.current.pause();
    yt.current?.stopVideo?.();
    patch({ status: "Loading…", cover: "", link: "", source: "", cur: 0, playing: false });
    try {
      const vid = noYT ? null : await findYouTube(artist, title).catch(() => null);
      if (id !== token.current) return;
      if (vid) { await startYT(vid, id); fails.current = 0; return; }
      const m = await findPreview(artist, title);
      if (id !== token.current) return;
      mode.current = "pv"; fails.current = 0;
      audio.current.src = m.url;
      patch({ cover: m.cover || "", link: m.link, source: m.source, status: "", dur: 30 });
      await audio.current.play();
      busy.current = false;
    } catch (e) {
      if (id !== token.current) return;
      busy.current = false;
      if (e?.name === "NotAllowedError") return patch({ status: "Tap play to start" });
      fails.current++;
      if (fails.current < STATIONS[s].tracks.length) {
        patch({ status: "Skipping…" });
        setTimeout(() => id === token.current && act.current.next(), 900);
      } else patch({ status: "Couldn’t load songs. Check your internet." });
    }
  };

  const next = () => play(sel.s, (sel.t + 1) % STATIONS[sel.s].tracks.length);
  const prev = () => play(sel.s, (sel.t - 1 + STATIONS[sel.s].tracks.length) % STATIONS[sel.s].tracks.length);
  act.current.next = next;
  act.current.ytErr = () => play(sel.s, sel.t, true); // embed blocked → preview

  const toggle = () => {
    if (mode.current === "yt" && yt.current) return st.playing ? yt.current.pauseVideo() : yt.current.playVideo();
    const a = audio.current;
    if (!a.getAttribute("src")) return play(sel.s, sel.t);
    a.paused ? a.play().catch(() => patch({ status: "Tap play again" })) : a.pause();
  };
  const seek = (f) => {
    if (mode.current === "yt") yt.current?.seekTo(f * st.dur, true);
    else if (audio.current.duration) audio.current.currentTime = f * audio.current.duration;
  };
  const setVol = (v) => { volRef.current = v; setVolState(v); audio.current.volume = v; yt.current?.setVolume?.(v * 100); };

  return { sel, ...st, vol, play, next, prev, toggle, seek, setVol };
}