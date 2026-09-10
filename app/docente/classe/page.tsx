import Link from "next/link";
import { ArrowRight, Music2, Settings2 } from "lucide-react";
import Dashboard from "./Dashboard";
import TeacherNav from "../components/TeacherNav";

export default function Page(){return <main className="min-h-screen py-7 md:py-9"><div className="container">
  <TeacherNav/>
  <div className="mt-10 flex flex-wrap items-end justify-between gap-5"><div><div className="eyebrow">Area docente</div><h1 className="mt-2 text-5xl font-black tracking-[-.05em]">La classe, <span className="gradient-text">in musica.</span></h1><p className="mt-3 max-w-2xl muted">La playlist prende forma: dati, storie, connessioni e tutto quello che sta emergendo dalla classe.</p></div><Link href="/docente/classe/gestione" className="btn-primary print-hidden"><Settings2 size={16}/> Gestisci la classe <ArrowRight size={15}/></Link></div>
  <Dashboard/>
  <div className="mt-7 grid gap-5 md:grid-cols-3 print-hidden">
    <Link href="/docente/mappa" className="glass-soft p-5 hover:border-violet-400/30"><Music2 className="text-cyan-300" size={20}/><div className="mt-4 font-bold">Esplora la mappa</div><p className="mt-1 text-sm muted">Scopri chi condivide gusti musicali.</p></Link>
    <Link href="/docente/indovina" className="glass-soft p-5 hover:border-violet-400/30"><span className="text-xl">✦</span><div className="mt-4 font-bold">Gioca con la classe</div><p className="mt-1 text-sm muted">Indovina chi ha scelto il brano.</p></Link>
    <Link href="/docente/classe/gestione" className="glass-soft p-5 hover:border-violet-400/30"><Settings2 className="text-violet-300" size={20}/><div className="mt-4 font-bold">Pannello amministratore</div><p className="mt-1 text-sm muted">Studenti, codici personali e stampa.</p></Link>
  </div>
</div></main>}
