const cache = new Map();
let n = 0;
const YT_KEY = import.meta.env.VITE_YT_KEY;
const LS = "leonida-yt";
const clean = (s) => s.replace(/[’‘]/g, "'");

// JSONP: walang CORS problem
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = "cb_" + Date.now() + "_" + n++;
    const s = document.createElement("script");
    const done = () => { delete window[cb]; s.remove(); clearTimeout(t); };
    const t = setTimeout(() => { done(); reject(new Error("timeout")); }, 8000);
    window[cb] = (d) => { done(); resolve(d); };
    s.onerror = () => { done(); reject(new Error("network")); };
    s.src = url + (url.includes("?") ? "&" : "?") + "callback=" + cb;
    document.body.appendChild(s);
  });
}

// 30-second previews (iTunes, tapos Deezer)
export async function findPreview(artist, title) {
  const key = artist + "|" + title;
  if (cache.has(key)) return cache.get(key);
  const q = encodeURIComponent(clean(artist + " " + title));
  let res = null;
  try {
    const d = await jsonp(`https://itunes.apple.com/search?term=${q}&media=music&entity=song&limit=5`);
    const h = (d.results || []).find((x) => x.previewUrl);
    if (h) res = { url: h.previewUrl, cover: h.artworkUrl100?.replace("100x100", "400x400"), link: h.trackViewUrl, source: "Apple Music" };
  } catch { /* Deezer na */ }
  if (!res) {
    const d = await jsonp(`https://api.deezer.com/search?q=${q}&limit=5&output=jsonp`);
    const h = (d.data || []).find((x) => x.preview);
    if (h) res = { url: h.preview, cover: h.album?.cover_big, link: h.link, source: "Deezer" };
  }
  if (!res) throw new Error("No preview");
  cache.set(key, res);
  return res;
}

// Full song via YouTube Data API (kailangan ng VITE_YT_KEY)
export async function findYouTube(artist, title) {
  if (!YT_KEY) return null;
  const key = artist + "|" + title;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(LS) || "{}"); } catch { /* ignore */ }
  if (saved[key]) return saved[key];
  const q = encodeURIComponent(clean(`${artist} ${title} official audio`));
  const r = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&videoEmbeddable=true&maxResults=1&q=${q}&key=${YT_KEY}`);
  if (!r.ok) return null;
  const id = (await r.json()).items?.[0]?.id?.videoId || null;
  if (id) { saved[key] = id; try { localStorage.setItem(LS, JSON.stringify(saved)); } catch { /* ignore */ } }
  return id;
}