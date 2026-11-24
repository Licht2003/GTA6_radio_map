import { useEffect, useRef, useState } from "react";
import { usePlayer } from "./usePlayer";
import Loader from "./components/Loader";
import Radio from "./components/Radio";
import MapSection from "./components/MapSection";
import Poll from "./components/Poll";
import Pin from "./components/Pin";
import PalmDefs from "./components/PalmDefs";
import { CREW, STATIONS } from "./data";

const LINKS = [["Radio", "#radio"], ["Map", "#map"], ["Crew", "#crew"], ["Poll", "#poll"], ["Support", "#support"]];
const TITLE = (s) => { const t = STATIONS[s.s].tracks[s.t]; return t[1] + " · " + t[0]; };

const Palm = () => <svg viewBox="0 0 240 320" aria-hidden="true"><use href="#palm" /></svg>;

export default function App() {
  const pl = usePlayer();
  const [gone, setGone] = useState(false);
  const [menu, setMenu] = useState(false);
  const armed = useRef(false);
  const kick = useRef(true);

  const enter = () => {
    armed.current = true;
    pl.play(0, 0); // Love Is a Long Road
    setTimeout(() => setGone(true), 950);
  };

  useEffect(() => { if (pl.playing) kick.current = false; }, [pl.playing]);

  // Kung hinarang ng browser ang autoplay, magsisimula sa unang click/tap/key
  useEffect(() => {
    const evs = ["pointerdown", "pointerup", "keydown", "touchend"];
    const off = () => evs.forEach((e) => window.removeEventListener(e, h));
    const h = () => {
      if (!armed.current) return;
      if (kick.current) { kick.current = false; pl.play(0, 0); }
      off();
    };
    evs.forEach((e) => window.addEventListener(e, h));
    return off;
  }, []); // eslint-disable-line

  useEffect(() => { document.body.style.overflow = gone ? "" : "hidden"; }, [gone]);

  return (
    <>
      <PalmDefs />

      <div className="bg-vc" aria-hidden="true">
        <div className="bgp p1"><Palm /></div>
        <div className="bgp p2"><Palm /></div>
        <div className="bgp p3"><Palm /></div>
        <div className="bgp p4"><Palm /></div>
      </div>

      {!gone && <Loader onEnter={enter} />}

      <header className="fixed top-0 inset-x-0 z-50 bg-night/75 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display text-lg">
            <Pin className="h-6 w-6 text-pink" />LEONIDA<span className="text-pink">FM</span>
          </a>
          <nav className="hidden md:flex gap-7 font-semibold">
            {LINKS.map(([n, h]) => <a key={n} href={h} className="hover:text-gold">{n}</a>)}
          </nav>
          <button className="md:hidden p-2 text-2xl" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? "✕" : "☰"}
          </button>
        </div>
        {menu && (
          <nav className="md:hidden px-4 pb-3 flex flex-col font-semibold">
            {LINKS.map(([n, h]) => <a key={n} href={h} className="py-2" onClick={() => setMenu(false)}>{n}</a>)}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero">
          <div className="sun" />
          <svg className="skyline" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,120V80h30V50h25V90h20V30h28V100h30V60h22V110h35V40h26V95h30V70h24V120Z" />
          </svg>
          <div className="palm left"><Palm /></div>
          <div className="palm right"><Palm /></div>
          <div className="relative z-10 text-center px-4 pt-28 pb-44">
            <p className="font-semibold tracking-wide text-gold">State of Leonida · Fan-made</p>
            <h1 className="chrome font-display text-6xl sm:text-8xl lg:text-9xl leading-none mt-3">LEONIDA<br />FM</h1>
            <p className="mt-5 max-w-lg mx-auto text-lg text-cream/90">Cruise the radio. Explore the map. Meet the crew.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a href="#radio" className="btn-main">Open the radio</a>
              <a href="#map" className="btn-ghost">Explore the map</a>
            </div>
          </div>
        </section>

        <Radio pl={pl} />
        <MapSection />

        <section id="crew" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-14">
          <h2 className="sticker-title">Only in Leonida</h2>
          <p className="mt-3 text-cream/75 max-w-xl">Spoiler-free. Only what Rockstar shows in the character intros.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREW.map(([n, d, f]) => (
              <article key={n} className="card hover:-translate-y-1 transition flex flex-col">
                <h3 className="font-display text-lg text-gold">{n}</h3>
                <p className="mt-2 text-sm text-cream/80">{d}</p>
                <p className="fact mt-auto"><b>Fun Fact!</b> {f}</p>
              </article>
            ))}
          </div>
        </section>

        <Poll />
      </main>

      <footer id="support" className="foot scroll-mt-14">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-10 text-center">
          <h2 className="chrome font-display text-5xl sm:text-7xl">SUPPORT ME?</h2>
          <p className="mt-3 text-cream/90">You can support me by sending a small donation through GCash. Any amount would be greatly appreciated! Thank you so much for your support!
            <br />
<b> NOTE:</b> Donations are completely voluntary. There's absolutely no pressure or obligation to donate.</p>
          <div className="mt-8 inline-block bg-cream rounded-3xl p-4 shadow-2xl">
            <img src="/gcash-qr.png" alt="GCash QR code" className="w-52 h-52 sm:w-60 sm:h-60 object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "grid"; }} />
            <div style={{ display: "none" }} className="w-52 h-52 sm:w-60 sm:h-60 place-items-center text-night text-sm font-semibold border-2 border-dashed border-night/40 rounded-xl p-4">
              <img src="QR.png"></img>
            </div>
          </div>

          <div className="mt-14 mx-auto max-w-3xl text-left text-xs sm:text-sm text-cream/80 space-y-2 border-t border-cream/25 pt-6">
            <p className="font-bold text-cream">Disclaimer & credits</p>
            <p>Unofficial fan project. Not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. Grand Theft Auto and related names and art belong to their owners.</p>
            <p>
              <b>Map:</b>{" "}
              <a className="underline" href="https://enkerewpo.github.io/leonida-online-map/" target="_blank" rel="noreferrer">Leonida Online Map</a>{" "}
              by wheatfox and contributors, using GTA VI Map Tiles and Landmarks Data (CC BY 4.0) from{" "}
              <a className="underline" href="https://map.gtadb.org" target="_blank" rel="noreferrer">gtadb.org</a>.
            </p>
            <p>
              <b>Info:</b> radio stations and tracklists from{" "}
              <a className="underline" href="https://gta.wiki" target="_blank" rel="noreferrer">GTA Wiki</a>{" "}
              (CC BY-NC-SA 3.0); characters summarized from Rockstar’s “Only in Leonida”.
            </p>
            <p><b>Music APIs:</b> iTunes Search API, Deezer API, YouTube IFrame Player and Data API. Songs belong to their artists and labels.</p>
          </div>
        </div>
      </footer>

      {gone && (
        <a href="#radio" className="fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-full bg-night/90 border-2 border-pink pl-3 pr-4 py-2 max-w-[75vw] shadow-[4px_4px_0_#12062b]">
          <button className="round !h-9 !w-9 !border-0 bg-pink text-night" aria-label={pl.playing ? "Pause" : "Play"}
            onClick={(e) => { e.preventDefault(); pl.toggle(); }}>
            {pl.playing ? "⏸" : "▶"}
          </button>
          <span className="truncate text-sm font-semibold">{TITLE(pl.sel)}</span>
        </a>
      )}
    </>
  );
}