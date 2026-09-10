"use client";
import { Layers3, Music2 } from "lucide-react";
import { useTeacherClass } from "../components/TeacherClassContext";

export default function ClassGate({ title="Scegli la classe con cui vuoi lavorare" }: { title?: string }) {
  const { classes, selectedClass, selectClass, loading } = useTeacherClass();
  if (selectedClass) return null;
  return <section className="glass mt-8 p-7 md:p-9">
    <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300"><Layers3 size={20}/></div><div><div className="eyebrow">Contesto di lavoro</div><h2 className="mt-1 text-2xl font-bold">{title}</h2></div></div>
    {loading ? <p className="mt-6 muted">Caricamento delle classi…</p> : classes.length ? <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{classes.map(c => <button key={c} onClick={()=>selectClass(c)} className="music-card group p-5 text-left"><div className="flex items-center justify-between"><span className="pill">Classe</span><Music2 size={18} className="text-cyan-300 transition group-hover:scale-110"/></div><div className="mt-5 text-2xl font-black">{c}</div><p className="mt-1 text-sm muted">Apri dashboard e strumenti</p></button>)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-5 text-sm muted">Non ci sono ancora classi. Vai in <b className="text-white">Gestione classe</b> per creare il primo elenco di studenti.</div>}
  </section>;
}
