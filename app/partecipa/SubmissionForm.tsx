"use client";
import { FormEvent, useState } from "react";
type Student = { id: string; nome: string; classe: string };
type ExistingSong = { titolo: string; artista: string; youtube_url: string; motivo: string };
export default function SubmissionForm() {
  const [codice, setCodice] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [existingSong, setExistingSong] = useState<ExistingSong | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  async function verifyCode(e: FormEvent) {
    e.preventDefault(); setError(""); setExistingSong(null); setStudent(null); setLookupLoading(true);
    try {
      const response = await fetch("/api/student", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codice }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Codice non riconosciuto.");
      setStudent(data.student); setExistingSong(data.song);
    } catch (err) { setError(err instanceof Error ? err.message : "Codice non riconosciuto."); }
    finally { setLookupLoading(false); }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!student) return; setError(""); setSaving(true); const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codice, titolo: form.get("titolo"), artista: form.get("artista"), youtube_url: form.get("youtube_url"), motivo: form.get("motivo") }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Errore durante il salvataggio."); setDone(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Non è stato possibile salvare la scheda."); }
    finally { setSaving(false); }
  }
  if (done) return <div className="py-10 text-center"><div className="text-5xl">✓</div><h2 className="mt-5 text-2xl font-semibold">Scelta registrata!</h2><p className="mt-2 text-neutral-500">La tua canzone è entrata nella colonna sonora della classe.</p></div>;
  return <div className="space-y-7">
    <form onSubmit={verifyCode} className="space-y-3">
      <label className="block"><span className="text-sm font-medium">Il tuo codice personale</span><input required value={codice} onChange={e => setCodice(e.target.value.toUpperCase())} placeholder="Es. 5A-7K2" autoComplete="off" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 uppercase tracking-widest outline-none focus:border-black" /></label>
      <button disabled={lookupLoading} className="w-full rounded-xl border border-neutral-300 px-5 py-3 font-medium transition hover:bg-neutral-50 disabled:opacity-50">{lookupLoading ? "Controllo…" : "Continua"}</button>
    </form>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    {student && !existingSong && <>
      <div className="rounded-xl bg-neutral-50 px-4 py-4"><p className="text-sm text-neutral-500">Codice riconosciuto</p><p className="mt-1 text-lg font-semibold">{student.nome}</p><p className="text-sm text-neutral-500">{student.classe}</p></div>
      <form onSubmit={submit} className="space-y-5 border-t border-neutral-100 pt-7">
        <div className="grid gap-5 md:grid-cols-2"><label className="block"><span className="text-sm font-medium">Titolo</span><input required name="titolo" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label><label className="block"><span className="text-sm font-medium">Artista</span><input required name="artista" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label></div>
        <label className="block"><span className="text-sm font-medium">Link YouTube</span><input required type="url" name="youtube_url" placeholder="https://youtube.com/..." className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
        <label className="block"><span className="text-sm font-medium">Perché hai scelto questa canzone?</span><textarea required name="motivo" minLength={10} rows={5} placeholder="Raccontaci cosa significa per te…" className="mt-2 w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
        <button disabled={saving} className="w-full rounded-xl bg-black px-5 py-3.5 font-medium text-white disabled:opacity-50">{saving ? "Salvataggio…" : "Inserisci la mia canzone"}</button>
      </form>
    </>}
    {student && existingSong && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="font-semibold">Hai già inserito la tua canzone.</p><p className="mt-2 text-sm text-neutral-700">{existingSong.titolo} — {existingSong.artista}</p><p className="mt-2 text-sm text-neutral-600">Se devi correggerla, chiedi al docente di intervenire.</p></div>}
  </div>;
}
