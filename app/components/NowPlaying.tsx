"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Disc3, ExternalLink, Loader2, Pause, Play, Radio, Shuffle } from "lucide-react";

type Song = {
  id: string;
  title: string;
  artist: string;
  youtubeUrl: string;
};

function videoId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "").split("/")[0];
    const v = u.searchParams.get("v");
    if (v) return v;
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
    return i >= 0 ? parts[i + 1] : null;
  } catch { return null; }
}

const CLASS_KEY = "class-soundtrack-player-class";
const SONG_KEY = "class-soundtrack-player-song";
const PAUSED_KEY = "class-soundtrack-player-paused";

export default function NowPlaying() {
  const [classes, setClasses] = useState<string[]>([]);
  const [classe, setClasse] = useState("");
  const [song, setSong] = useState<Song | null>(null);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/classes", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const list = Array.isArray(d.classi) ? d.classi : [];
        setClasses(list);
        const savedClass = localStorage.getItem(CLASS_KEY) || "";
        if (savedClass && list.includes(savedClass)) setClasse(savedClass);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoadingClasses(false));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!classe) {
      setSong(null);
      setStarted(false);
      setPlaying(false);
      return;
    }
    localStorage.setItem(CLASS_KEY, classe);
    const savedClass = localStorage.getItem(CLASS_KEY);
    const savedSong = localStorage.getItem(SONG_KEY);
    const savedPaused = localStorage.getItem(PAUSED_KEY);
    if (savedClass === classe && savedSong) {
      try {
        const parsed = JSON.parse(savedSong) as Song & { classe?: string };
        if (parsed && parsed.classe === classe) {
          setSong(parsed);
          const isPlaying = savedPaused !== "1";
          setPlaying(isPlaying);
          setStarted(isPlaying);
          return;
        }
      } catch {}
    }
    loadRandom(classe, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classe]);

  useEffect(() => {
    if (song) localStorage.setItem(SONG_KEY, JSON.stringify({ ...song, classe }));
  }, [song, classe]);

  useEffect(() => {
    if (started && frameRef.current) {
      frameRef.current.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
    }
  }, [started, song?.id]);

  async function loadRandom(targetClass = classe, start = false) {
    if (!targetClass) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/now-playing?classe=${encodeURIComponent(targetClass)}`, { cache: "no-store" });
      const d = await r.json();
      setSong(d.song ?? null);
      setStarted(start && !!d.song);
      setPlaying(start && !!d.song);
      localStorage.setItem(PAUSED_KEY, start && d.song ? "0" : "1");
    } finally { setLoading(false); }
  }

  function changeClass(value: string) {
    setClasse(value);
    localStorage.setItem(CLASS_KEY, value);
    localStorage.removeItem(SONG_KEY);
    localStorage.setItem(PAUSED_KEY, "1");
  }

  function togglePlay() {
    if (!song) return;
    if (!started) {
      setStarted(true);
      setPlaying(true);
      localStorage.setItem(PAUSED_KEY, "0");
      return;
    }
    const func = playing ? "pauseVideo" : "playVideo";
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
    setPlaying(!playing);
    localStorage.setItem(PAUSED_KEY, playing ? "1" : "0");
  }

  const id = song ? videoId(song.youtubeUrl) : null;

  return (
    <div className="now-playing-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">NOW PLAYING</div>
          <div className="mt-1 text-sm text-[#d8d8e4]">Ascolta un brano scelto casualmente dalla classe</div>
        </div>
        <Radio size={18} className="text-cyan-300" />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[.16em] text-[#85879b]">Scegli la classe</label>
        <div className="relative">
          <select
            value={classe}
            onChange={(e) => changeClass(e.target.value)}
            disabled={loadingClasses || !classes.length}
            className="field w-full appearance-none pr-10"
          >
            <option value="">Seleziona una classe…</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9b9caf]" />
        </div>
      </div>

      {!classe ? (
        <div className="mt-6 now-playing-ready">
          <div className="wave"><span/><span/><span/><span/><span/><span/><span/><span/><span/></div>
          <p className="mt-3 text-sm muted">Scegli una classe per entrare nella sua colonna sonora.</p>
        </div>
      ) : loading ? (
        <div className="now-playing-empty"><Loader2 className="animate-spin"/> Cerco un brano nella playlist…</div>
      ) : !song ? (
        <div className="now-playing-empty"><Disc3/> Questa classe non ha ancora una playlist.</div>
      ) : <>
        <div className="mt-7 grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
          <div className="now-playing-cover"><Disc3 size={54}/><span/></div>
          <div className="min-w-0">
            <div className="eyebrow">BRANO DELLA CLASSE · {classe}</div>
            <h2 className="mt-2 truncate text-2xl font-black md:text-3xl">{song.title}</h2>
            <p className="mt-1 truncate text-base text-[#b7b8c8]">{song.artist}</p>
          </div>
        </div>
        {started && id ? <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black"><iframe ref={frameRef} title={`Ascolta ${song.title}`} className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div> : <div className="mt-6 now-playing-ready"><div className="wave"><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><p className="mt-3 text-sm muted">Premi play per ascoltare il brano.</p></div>}
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={togglePlay} className="btn-primary">{playing ? <Pause size={16}/> : <Play size={16}/>} {playing ? "Pausa" : "Ascolta"}</button>
          <button onClick={() => loadRandom(classe, true)} className="btn-ghost"><Shuffle size={16}/> Cambia brano</button>
          <a href={song.youtubeUrl} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={15}/> YouTube</a>
        </div>
      </>}
    </div>
  );
}
