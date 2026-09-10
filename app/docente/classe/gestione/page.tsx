"use client";
import Link from "next/link";
import { ArrowLeft, KeyRound, Settings2 } from "lucide-react";
import GestioneClasse from "../GestioneClasse";
import TeacherNav from "../../components/TeacherNav";
import { useTeacherClass } from "../../components/TeacherClassContext";

export default function Page(){const { selectedClass } = useTeacherClass(); return <main className="min-h-screen py-7 md:py-9"><div className="container">
  <TeacherNav/>
  <Link href="/docente/classe" className="mt-8 inline-flex items-center gap-2 text-sm muted hover:text-white"><ArrowLeft size={15}/> Torna al dashboard</Link>
  <div className="mt-8 flex flex-wrap items-end justify-between gap-5"><div><div className="eyebrow">Pannello amministratore · {selectedClass || "nuova classe"}</div><h1 className="mt-2 text-5xl font-black tracking-[-.05em]"><span className="gradient-text">Gestione classe</span></h1><p className="mt-3 max-w-2xl muted">Crea gli accessi, assegna i codici personali e controlla lo stato delle playlist.</p></div><div className="admin-badge"><Settings2 size={15}/> Area riservata</div></div>
  <GestioneClasse/>
  <div className="mt-6 glass-soft p-5"><div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><KeyRound size={18}/></div><div><div className="font-semibold">Come funziona il codice?</div><p className="mt-1 text-sm leading-6 muted">Ogni studente riceve un codice personale. Con quel codice può tornare sulla pagina <b className="text-white">Crea la mia playlist</b> per inserire o modificare i propri 5–10 brani.</p></div></div></div>
</div></main>}
