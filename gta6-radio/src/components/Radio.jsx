import { STATIONS } from "../data";

const fmt = (s) => (isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00");
const COLORS = ["#ff3d81", "#ffb703", "#e0484f", "#2aa8ff", "#a45cf0", "#00c9a7", "#d98b2b", "#ff7ab6"];
const MONO = ["VR", "FL", "CH", "CO", "DS", "AB", "BC", "HN"];

export default function Radio({ pl }) {
  const st = STATIONS[pl.sel.s];
  const [artist, title] = st.tracks[pl.sel.t];

  return (
    <section id="radio" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-14">
      <h2 className="sticker-title">The Radio</h2>
      <p className="mt-3 text-cream/75 max-w-xl">Pick a station on the wheel, then pick a song. Each track plays up to 1:30, then the next one starts.</p>

      <div className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
        <div className="rw" role="tablist" aria-label="Radio stations">
          <button className="rw-core" onClick={pl.toggle} aria-label={pl.playing ? "Pause" : "Play"}>
            <span>
              <span className={"eq" + (pl.playing ? " on" : "")} aria-hidden="true"><span /><span /><span /><span /><span /></span>
              <span className="block font-display text-lg sm:text-2xl leading-tight">{st.name}</span>
              <span className="block text-sm text-gold mt-1">{st.sub}</span>
              <span className="block text-xs text-cream/70 mt-1">{pl.playing ? "Tap to pause" : "Tap to play"}</span>
            </span>
          </button>
          {STATIONS.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={i === pl.sel.s} aria-label={s.name} title={s.name}
              className={"rw-st" + (i === pl.sel.s ? " on" : "")}
              style={{ "--a": i * 45 + "deg", "--c": COLORS[i] }} onClick={() => pl.play(i, 0)}>
              {MONO[i]}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <div className="card">
            <div className="flex gap-4 items-center">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl shrink-0 overflow-hidden shim">
                {pl.cover && <img src={pl.cover} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-teal font-semibold truncate">{st.name} · {st.host}</p>
                <p className="text-2xl sm:text-3xl font-extrabold truncate mt-1">{title}</p>
                <p className="text-cream/75 truncate">{artist}</p>
              </div>
            </div>
            <p className="text-sm text-sun min-h-5 mt-3" role="status" aria-live="polite">{pl.status}</p>
            <input type="range" min="0" max="100" step="0.1" value={pl.dur ? (pl.cur / pl.dur) * 100 : 0}
              onChange={(e) => pl.seek(e.target.value / 100)} className="w-full mt-1" aria-label="Seek" />
            <div className="flex justify-between text-xs text-cream/60"><span>{fmt(pl.cur)}</span><span>{fmt(pl.dur)}</span></div>
            <div className="mt-3 flex items-center gap-3">
              <button className="round" aria-label="Previous" onClick={pl.prev}>⏮</button>
              <button className="round big" aria-label={pl.playing ? "Pause" : "Play"} onClick={pl.toggle}>{pl.playing ? "⏸" : "▶"}</button>
              <button className="round" aria-label="Next" onClick={pl.next}>⏭</button>
              <label className="ml-auto flex items-center gap-2 text-sm">Vol
                <input type="range" min="0" max="100" value={pl.vol * 100} onChange={(e) => pl.setVol(e.target.value / 100)} className="w-24" />
              </label>
            </div>
            {pl.link && <a href={pl.link} target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm underline text-teal hover:text-gold">Full song on {pl.source}</a>}
          </div>

          <div className="card">
            <h3 className="font-display text-lg">Tracklist</h3>
            <ul className="mt-3 space-y-1">
              {st.tracks.map((t, i) => (
                <li key={t[1]}>
                  <button className={"trk" + (i === pl.sel.t ? " on" : "")} onClick={() => pl.play(pl.sel.s, i)}>
                    <span className="w-5 text-cream/50 text-sm">{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold truncate">{t[1]}</span>
                      <span className="block text-sm text-cream/70 truncate">{t[0]}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}