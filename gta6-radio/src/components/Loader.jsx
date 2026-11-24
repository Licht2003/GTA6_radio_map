import { useEffect, useState } from "react";
import Pin from "./Pin";

const TIPS = ["Warming up the radio…", "Painting the neon signs…", "Loading Vice City…", "Gassing up the jet skis…", "Tuning in to Leonida…"];

export default function Loader({ onEnter }) {
  const [p, setP] = useState(0);
  const [out, setOut] = useState(false);
  const ready = p >= 100;

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + 1.5 + Math.random() * 5);
      setP(v);
      if (v >= 100) clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, []);

  // pag 100% na, rekta pasok na
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => { setOut(true); onEnter(); }, 450);
    return () => clearTimeout(t);
  }, [ready]); // eslint-disable-line

  return (
    <div className={"loader" + (out ? " out" : "")} role="dialog" aria-label="Loading Leonida FM">
      <div className="w-full max-w-md text-center">
        <Pin className="h-16 w-16 mx-auto text-cream drop-shadow-[4px_4px_0_#12062b]" />
        <h1 className="font-display text-5xl sm:text-6xl mt-3 text-cream drop-shadow-[4px_4px_0_#ff3d81]">LEONIDA FM</h1>
        <div className="lbar mt-10"><i style={{ width: p + "%" }} /></div>
        <div className="mt-3 flex justify-between text-sm font-semibold text-cream">
          <span>{TIPS[Math.min(TIPS.length - 1, Math.floor(p / 20))]}</span>
          <span>{Math.floor(p)}%</span>
        </div>
      </div>
    </div>
  );
}