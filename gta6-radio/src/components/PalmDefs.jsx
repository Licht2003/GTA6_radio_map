const CX = 120, CY = 96; // gitna ng mga dahon

// [anggulo, haba, laylay]
const FRONDS = [
  [-172, 110, 70], [-148, 105, 55], [-122, 85, 40], [-90, 62, 30], [-58, 85, 40],
  [-32, 105, 55], [-8, 110, 70], [165, 95, 85], [15, 95, 85],
];
const TRUNK = "M112 320Q104 200 116 100L126 100Q120 200 130 320Z";

function build() {
  let leaves = "", rachis = "";
  for (const [deg, L, droop] of FRONDS) {
    const a = (deg * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a);
    const p0 = [CX, CY];
    const p1 = [CX + dx * L * 0.5, CY + dy * L * 0.5 - L * 0.22];
    const p2 = [CX + dx * L, CY + dy * L + droop];
    rachis += `M${p0[0]},${p0[1]}Q${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    const N = 20;
    for (let i = 1; i <= N; i++) {
      const t = i / N, u = 1 - t;
      const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
      const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
      let tx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
      let ty = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
      const m = Math.hypot(tx, ty) || 1;
      tx /= m; ty /= m;
      const len = 22 * (1 - t * 0.8) * Math.min(1, t * 6);
      for (const s of [-1, 1]) {
        const nx = -ty * s, ny = tx * s;
        const ex = x + nx * len + tx * len * 0.7;
        const ey = y + ny * len + ty * len * 0.7 + len * 0.45;
        leaves += `M${(x - tx * 1.8).toFixed(1)},${(y - ty * 1.8).toFixed(1)}L${ex.toFixed(1)},${ey.toFixed(1)}L${(x + tx * 1.8).toFixed(1)},${(y + ty * 1.8).toFixed(1)}Z`;
      }
    }
  }
  return { leaves, rachis };
}
const { leaves, rachis } = build();

export default function PalmDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <symbol id="palm" viewBox="0 0 240 320">
        <g fill="currentColor">
          <path d={TRUNK} />
          <path d={leaves} />
          <circle cx="114" cy="104" r="5" /><circle cx="127" cy="106" r="5" /><circle cx="120" cy="112" r="5" />
        </g>
        <path d={rachis} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </symbol>
    </svg>
  );
}