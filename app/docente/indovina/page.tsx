"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, HelpCircle, Music2, Sparkles, X } from "lucide-react";
import TeacherNav from "../components/TeacherNav";
import ClassGate from "../components/ClassGate";
import { useTeacherClass } from "../components/TeacherClassContext";

type Song = {
  id: string;
  studente_id: string;
  student_name: string;
  classe: string;
  titolo: string;
  artista: string;
  motivo: string;
  youtube_url: string;
};

type Student = { id: string; nome: string; classe: string };

export default function Game() {
  const { selectedClass } = useTeacherClass();
  const [songs, setSongs] = useState<Song[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState<Song | null>(null);
  const [opts, setOpts] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!selectedClass) {
      setSongs([]);
      setStudents([]);
      return;
    }
    fetch(`/api/class/songs?classe=${encodeURIComponent(selectedClass)}`, { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        setSongs(d.songs || []);
        setStudents(d.students || []);
      })
      .catch(() => {
        setSongs([]);
        setStudents([]);
      });
  }, [selectedClass]);

  useEffect(() => {
    setQ(null);
    setAnswer(null);
    setScore(0);
    setRound(0);
  }, [selectedClass]);

  function next() {
    if (!songs.length) return;
    const x = songs[Math.floor(Math.random() * songs.length)];

    const classNames = students.map(s => s.nome?.trim()).filter(Boolean);
    const songNames = songs.map(s => s.student_name?.trim()).filter(Boolean);
    const names = [...new Set(classNames.length ? classNames : songNames)];

    setQ(x);
    setOpts(names.sort(() => Math.random() - 0.5));
    setAnswer(null);
  }

  useEffect(() => {
    if (songs.length && !q) next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs, students, q]);

  function choose(name: string) {
    if (!q || answer) return;
    setAnswer(name);
    setRound(r => r + 1);
    if (name === q.student_name) setScore(s => s + 1);
  }

  return (
    <main className="min-h-screen py-8 md:py-10">
      <div className="container max-w-5xl">
        <TeacherNav />
        <ClassGate />
        <Link href="/docente/classe" className="inline-flex items-center gap-2 text-sm muted hover:text-white">
          <ArrowLeft size={15} /> Dashboard
        </Link>

        <div className="mt-12 text-center">
          <div className="eyebrow">Gioco della classe · {selectedClass || "seleziona una classe"}</div>
          <h1 className="mt-3 text-5xl font-black tracking-[-.05em]">
            Chi ha scelto <span className="gradient-text">questa canzone?</span>
          </h1>
          <p className="mt-4 muted">Ascolta la storia, osserva gli indizi e prova a riconoscere il compagno.</p>
        </div>

        {q ? (
          <div className="glass mt-10 p-6 md:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="pill"><Sparkles size={13} /> Round {round || 1}</span>
              <span className="pill">Punteggio {score} / {round}</span>
            </div>

            <div className="mt-9 grid gap-8 md:grid-cols-[160px_1fr] md:items-center">
              <div className="cover mx-auto flex h-36 w-36 items-center justify-center rounded-[32px] shadow-2xl">
                <Music2 size={48} className="relative z-10" />
              </div>

              <div>
                <div className="eyebrow">Il brano misterioso</div>
                <h2 className="mt-2 text-4xl font-black">{q.titolo || "Titolo non disponibile"}</h2>
                <p className="mt-2 text-lg muted">{q.artista || "Artista non disponibile"}</p>

                <div className="mt-6 rounded-2xl bg-white/[.04] p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-violet-200">
                    <HelpCircle size={14} /> Indizio
                  </div>
                  <p className="mt-3 leading-7 text-[#d7d7e1]">
                    {q.motivo ? `“${q.motivo}”` : "Non è stato inserito un motivo per questo brano."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {opts.map(name => (
                <button
                  key={name}
                  onClick={() => choose(name)}
                  disabled={!!answer}
                  className={`flex min-h-[58px] items-center justify-between rounded-2xl border p-4 text-left transition ${
                    answer
                      ? name === q.student_name
                        ? "border-emerald-400/50 bg-emerald-400/10"
                        : "border-white/7 opacity-50"
                      : "border-white/10 bg-white/[.035] hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-400/5"
                  }`}
                >
                  <span>{name}</span>
                  {answer && name === q.student_name ? <Check size={18} className="text-emerald-300" /> :
                   answer && name === answer ? <X size={18} className="text-rose-300" /> : null}
                </button>
              ))}
            </div>

            {answer && (
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/[.04] p-5">
                <div>
                  <div className="font-semibold">{answer === q.student_name ? "🎉 Hai indovinato!" : "Quasi!"}</div>
                  <div className="mt-1 text-sm muted">La playlist è di <b className="text-white">{q.student_name}</b>.</div>
                </div>
                <button onClick={next} className="btn-primary">Prossima canzone →</button>
              </div>
            )}
          </div>
        ) : (
          <div className="glass mt-10 p-10 text-center muted">
            {selectedClass ? "Servono almeno alcuni brani per iniziare il gioco." : "Seleziona una classe per iniziare."}
          </div>
        )}
      </div>
    </main>
  );
}
