"use client";
import { useEffect, useRef, useState } from "react";
import { Disc3, ExternalLink, Loader2, Pause, Play, Radio, Shuffle } from "lucide-react";

type Song = {
  id: string;
  title: string;
  artist: string;
  youtubeUrl: string;
  reason?: string;
  studentName?: string;
  classe?: string;
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

export default function NowPlaying() {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  async function loadRandom(start = false) {
    setLoading(true);
    try {
      const r = await fetch("/api/now-playing", { cache: "no-store" });
      const d = await r.json();
      setSong(d.song ?? null);
      setStarted(start);
      setPlaying(start);
      if (start) localStorage.setItem("class-soundtrack-player-paused", "0");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    const savedPaused = localStorage.getItem("class-soundtrack-player-paused");
    const savedSong = localStorage.getItem("class-soundtrack-player-song");
    if (savedSong) {
      try { setSong(JSON.parse(savedSong)); setLoading(false); setPlaying(savedPaused !== "1"); setStarted(savedPaused !== "1"); return; } catch {}
    }
    loadRandom(false);
  }, []);

  useEffect(() => {
    if (song) localStorage.setItem("class-soundtrack-player-song", JSON.stringify(song));
  }, [song]);

  useEffect(() => {
    if (started && frameRef.current) {
      frameRef.current.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
    }
  }, [started, song?.id]);

  function togglePlay() {
    if (!song) return;
    if (!started) {
      setStarted(true);
      setPlaying(true);
      localStorage.setItem("class-soundtrack-player-paused", "0");
      return;
    }
    const func = playing ? "pauseVideo" : "playVideo";
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
    setPlaying(!playing);
    localStorage.setItem("class-soundtrack-player-paused", playing ? "1" : "0");
  }

  const id = song ? videoId(song.youtubeUrl) : null;

  return (
    <div className="now-playing-card">
      <div className="flex items-center justify-between gap-4">
        <div><div className="eyebrow">NOW PLAYING</div><div className="mt-1 text-sm text-[#d8d8e4]">Una canzone scelta a caso dalla classe</div></div>
        <Radio size={18} className="text-cyan-300" />
      </div>
      {loading ? <div className="now-playing-empty"><Loader2 className="animate-spin"/> Caricamento della playlist…</div> : !song ? <div className="now-playing-empty"><Disc3/> La playlist è ancora vuota.</div> : <>
        <div className="mt-7 grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
          <div className="now-playing-cover"><Disc3 size={54}/><span/></div>
          <div className="min-w-0">
            <div className="eyebrow">BRANO DELLA CLASSE</div>
            <h2 className="mt-2 truncate text-2xl font-black md:text-3xl">{song.title}</h2>
            <p className="mt-1 truncate text-base text-[#b7b8c8]">{song.artist}</p>
            {song.studentName && <p className="mt-3 text-xs text-violet-200">Scelto da {song.studentName}</p>}
          </div>
        </div>
        {started && id ? <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black"><iframe ref={frameRef} title={`Ascolta ${song.title}`} className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div> : <div className="mt-6 now-playing-ready"><div className="wave"><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><p className="mt-3 text-sm muted">Premi play per ascoltare. Il brano viene scelto casualmente.</p></div>}
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={togglePlay} className="btn-primary">{playing ? <Pause size={16}/> : <Play size={16}/>} {playing ? "Pausa" : "Ascolta"}</button>
          <button onClick={() => loadRandom(true)} className="btn-ghost"><Shuffle size={16}/> Cambia brano</button>
          <a href={song.youtubeUrl} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={15}/> YouTube</a>
        </div>
      </>}
    </div>
  );
}
