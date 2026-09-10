import Link from "next/link";
import { Music2, LockKeyhole, Sparkles, Radio, ArrowRight } from "lucide-react";

export default function Home() {
  return <main className="min-h-screen py-8 md:py-12">
    <div className="container">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Music2 size={20}/></div><span className="font-semibold tracking-tight">COLONNA SONORA</span></div>
        <Link href="/docente/login" className="btn-ghost text-sm"><LockKeyhole size={15}/> Area docente</Link>
      </nav>

      <section className="relative mt-20 grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:mt-28">
        <div>
          <div className="eyebrow">Un progetto della classe</div>
          <h1 className="mt-5 text-6xl font-black tracking-[-.065em] md:text-8xl"><span className="gradient-text">La colonna<br/>sonora</span><br/><span className="text-white">della classe.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#b4b6c7]">Dieci canzoni possono raccontare molto più di una playlist. Possono raccontare persone, ricordi, passioni e connessioni.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/partecipa" className="btn-primary">Crea la mia playlist <ArrowRight size={17}/></Link><Link href="#come-funziona" className="btn-ghost">Come funziona?</Link></div>
          <div className="mt-9 flex flex-wrap gap-2"><span className="pill">5–10 brani</span><span className="pill">Una playlist per persona</span><span className="pill">Una storia collettiva</span></div>
        </div>
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-violet-500/10 blur-3xl"/>
          <div className="glass relative p-7 md:p-9 float">
            <div className="flex items-center justify-between"><div><div className="eyebrow">NOW PLAYING</div><div className="mt-2 text-sm text-[#d8d8e4]">La nostra classe</div></div><Radio size={18} className="text-cyan-300"/></div>
            <div className="mt-10 flex items-center gap-5"><div className="cover flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl shadow-2xl"><Music2 size={42} className="relative z-10 text-white/90"/></div><div><div className="text-2xl font-bold">La nostra playlist</div><div className="mt-1 text-sm muted">Brani, ricordi, persone</div></div></div>
            <div className="mt-9"><div className="wave"><span/><span/><span/><span/><span/><span/><span/><span/><span/></div></div>
            <div className="mt-7 grid grid-cols-3 gap-3"><div className="glass-soft p-4"><div className="text-2xl font-bold">10</div><div className="mt-1 text-xs muted">max brani</div></div><div className="glass-soft p-4"><div className="text-2xl font-bold">∞</div><div className="mt-1 text-xs muted">storie</div></div><div className="glass-soft p-4"><div className="text-2xl font-bold">1</div><div className="mt-1 text-xs muted">classe</div></div></div>
          </div>
        </div>
      </section>

      <section id="come-funziona" className="mt-28 grid gap-5 md:grid-cols-3">
        {[["01","Scegli","Inserisci da 5 a 10 canzoni che vuoi lasciare alla tua classe.",Music2],["02","Racconta","Per ogni brano puoi spiegare perché significa qualcosa per te.",Sparkles],["03","Scopri","La playlist diventa una mappa di gusti, incontri e somiglianze.",Radio]].map(([n,t,d,I])=>{const Icon=I as any;return <div key={n} className="glass p-7"><div className="text-xs font-mono text-violet-300">{n}</div><Icon className="mt-8 text-cyan-300" size={22}/><h2 className="mt-5 text-2xl font-bold">{t}</h2><p className="mt-2 leading-7 muted">{d as string}</p></div>})}
      </section>
      <footer className="py-16 text-center text-xs text-[#77798d]">La colonna sonora della classe · progetto didattico</footer>
    </div>
  </main>;
}
