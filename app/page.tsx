import Link from "next/link";
import { ArrowRight, LockKeyhole, Music2, Sparkles, Radio, Route, UsersRound } from "lucide-react";
import NowPlaying from "./components/NowPlaying";

const steps = [
  { n: "01", icon: Music2, title: "Scegli", text: "Inserisci da 5 a 10 canzoni che vuoi lasciare alla tua classe." },
  { n: "02", icon: Sparkles, title: "Racconta", text: "Per ogni brano racconta il ricordo, la persona o il motivo che lo rende importante." },
  { n: "03", icon: Route, title: "Scopri", text: "Le playlist diventano una mappa di gusti, incontri e somiglianze." },
];

export default function Home() {
  return <main className="min-h-screen py-6 md:py-8">
    <div className="container">
      <nav className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Music2 size={20}/></div>
          <span className="hidden font-semibold tracking-tight sm:block">COLONNA SONORA</span>
        </Link>
        <Link href="/docente/login" className="btn-ghost text-sm"><LockKeyhole size={15}/> Pannello docente</Link>
      </nav>

      <section className="relative mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
        <div>
          <div className="eyebrow">Un progetto della classe</div>
          <h1 className="mt-5 text-6xl font-black tracking-[-.065em] md:text-8xl"><span className="gradient-text">La colonna<br/>sonora</span><br/><span className="text-white">della classe.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#b4b6c7]">Dieci canzoni possono raccontare molto più di una playlist. Possono raccontare persone, ricordi, passioni e connessioni.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/partecipa" className="btn-primary">Crea la mia playlist <ArrowRight size={17}/></Link>
            <a href="#come-funziona" className="btn-ghost">Come funziona? <ArrowRight size={15}/></a>
          </div>
          <div className="mt-9 flex flex-wrap gap-2"><span className="pill">5–10 brani</span><span className="pill">Una playlist per persona</span><span className="pill">Una storia collettiva</span></div>
        </div>
        <NowPlaying />
      </section>

      <section id="come-funziona" className="scroll-mt-10 mt-28">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><div className="eyebrow">Come funziona</div><h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Tre passi. <span className="gradient-text">Una storia.</span></h2></div>
          <p className="max-w-md text-sm leading-6 muted">Non devi costruire una playlist perfetta. Devi lasciare una traccia di te attraverso la musica.</p>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {steps.map(({n,icon:Icon,title,text}) => <article key={n} className="glass step-card p-7">
            <div className="flex items-start justify-between"><span className="text-xs font-mono text-violet-300">{n}</span><div className="step-icon"><Icon size={20}/></div></div>
            <h3 className="mt-8 text-2xl font-black">{title}</h3><p className="mt-2 leading-7 muted">{text}</p>
          </article>)}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="glass-soft p-6"><UsersRound className="text-violet-300" size={22}/><h3 className="mt-4 text-xl font-bold">Una playlist, non una gara</h3><p className="mt-2 leading-7 muted">Ogni studente può tornare con il proprio codice e modificare la selezione quando vuole.</p></div>
        <div className="glass-soft p-6"><Radio className="text-cyan-300" size={22}/><h3 className="mt-4 text-xl font-bold">La classe suona davvero</h3><p className="mt-2 leading-7 muted">Il player della home pesca casualmente un brano dal database e ogni browser può ascoltarlo o metterlo in pausa.</p></div>
      </section>
      <footer className="py-16 text-center text-xs text-[#77798d]">La colonna sonora della classe · progetto didattico</footer>
    </div>
  </main>;
}
