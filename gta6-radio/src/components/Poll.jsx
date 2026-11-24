import { useState } from "react";

const KEY = "leonida-poll-v1";
const OPTS = ["Chapter 1", "Chapter 2", "Chapter 3"];
const EMPTY = { v: null, c: [0, 0, 0] };

export default function Poll() {
  const [d, setD] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || EMPTY; } catch { return EMPTY; } });
  const total = d.c.reduce((a, b) => a + b, 0);

  const vote = (i) => {
    if (d.v === i) return;
    const c = [...d.c];
    if (d.v !== null) c[d.v]--;
    c[i]++;
    const n = { v: i, c };
    setD(n);
    try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* ignore */ }
  };

  return (
    <section id="poll" className="max-w-3xl mx-auto px-4 py-16 scroll-mt-14">
      <h2 className="sticker-title">Quick Poll</h2>
      <div className="card mt-6">
        <p className="text-xl font-extrabold">Which chapter has the best missions?</p>
        <div className="mt-4 space-y-3">
          {OPTS.map((o, i) => {
            const pct = total ? Math.round((d.c[i] / total) * 100) : 0;
            return (
              <button key={o} onClick={() => vote(i)} aria-pressed={d.v === i}
                className={"relative w-full overflow-hidden rounded-xl border-2 px-4 py-3 text-left font-bold transition " + (d.v === i ? "border-gold" : "border-cream/25 hover:border-pink")}>
                {d.v !== null && <span className="absolute inset-y-0 left-0 opacity-40 pollbar" style={{ width: pct + "%" }} />}
                <span className="relative flex justify-between"><span>{o}</span>{d.v !== null && <span>{pct}%</span>}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-cream/60">{d.v === null ? "Tap a chapter to vote and see the results." : "Thanks for voting! You can change your vote anytime."} Votes are saved on this device only.</p>
      </div>
    </section>
  );
}