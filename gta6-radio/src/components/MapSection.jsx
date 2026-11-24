import { useEffect, useState } from "react";

const MAP_URL = "https://enkerewpo.github.io/leonida-online-map/";

export default function MapSection() {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => { const t = setTimeout(() => setSlow(true), 10000); return () => clearTimeout(t); }, []);
  useEffect(() => { document.body.style.overflow = full ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [full]);

  return (
    <section id="map" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-14">
      <h2 className="sticker-title">Explore Leonida</h2>
      <p className="mt-3 text-cream/75 max-w-2xl">The in-game map of Leonida. Drag to move, scroll or pinch to zoom, search places, and filter by category.</p>

      <div className={"mapbox mt-6" + (full ? " full" : "")}>
        <div className={"absolute inset-0 shim grid place-items-center text-cream/70 " + (loaded ? "hidden" : "")}>
          {slow ? "Taking long? Use “Open in new tab”." : "Loading map…"}
        </div>
        <iframe src={MAP_URL} title="Interactive map of Leonida" loading="lazy" allowFullScreen
          onLoad={() => setLoaded(true)} className="absolute inset-0 h-full w-full border-0" />
        <div className="absolute top-3 right-3 flex gap-2">
          <a href={MAP_URL} target="_blank" rel="noreferrer" className="zbtn !w-auto px-3 grid place-items-center text-sm">Open in new tab ↗</a>
          <button className="zbtn" aria-label={full ? "Exit full screen" : "Full screen"} onClick={() => setFull(!full)}>{full ? "✕" : "⛶"}</button>
        </div>
      </div>

      <p className="mt-3 text-sm text-cream/70">
        More maps:{" "}
        <a className="underline text-teal" href="https://map.stateofleonida.net/" target="_blank" rel="noreferrer">State of Leonida</a>{" · "}
        <a className="underline text-teal" href="https://mapgenie.io/grand-theft-auto-6/maps/leonida" target="_blank" rel="noreferrer">MapGenie</a>
      </p>
    </section>
  );
}