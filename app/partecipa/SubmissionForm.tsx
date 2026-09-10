"use client";

import { FormEvent, useState } from "react";

type Student = { id: string; nome: string; classe: string };
type Song = { id?: string; titolo: string; artista: string; youtube_url: string; motivo: string };

const emptySong = (): Song => ({ titolo: "", artista: "", youtube_url: "", motivo: "" });

export default function SubmissionForm() {
  const [codice, setCodice] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStudent(null);
    setSongs([]);
    setLookupLoading(true);

    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codice }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Codice non riconosciuto.");

      const existing: Song[] = data.songs ?? [];
      setStudent(data.student);
      setSongs(existing.length < 5 ? [...existing, ...Array.from({ length: 5 - existing.length }, emptySong)] : existing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Codice non riconosciuto.");
    } finally {
      setLookupLoading(false);
    }
  }

  function updateSong(index: number, field: keyof Song, value: string) {
    setSongs((current) => current.map((song, i) => i === index ? { ...song, [field]: value } : song));
  }

  function addSong() {
    if (songs.length < 10) setSongs((current) => [...current, emptySong()]);
  }

  function removeSong(index: number) {
    // Le prime 5 posizioni restano disponibili/obbligatorie.
    if (index < 5) return;
    setSongs((current) => current.filter((_, i) => i !== index));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!student) return;
    setError("");

    const filled = songs.filter((song) => song.titolo.trim() || song.artista.trim() || song.youtube_url.trim() || song.motivo.trim());
    if (filled.length < 5) {
      setError("Devi inserire almeno 5 canzoni.");
      return;
    }
    if (filled.length > 10) {
      setError("Puoi inserire al massimo 10 canzoni.");
      return;
    }
    if (filled.some((song) => !song.titolo.trim() || !song.artista.trim() || !song.youtube_url.trim() || !song.motivo.trim())) {
      setError("Completa tutti i campi delle canzoni che hai iniziato a compilare.");
      return;
    }

    setSaving(true);
    try {
      const existingCount = songs.filter((song) => song.id).length;
      const newSongs = filled.filter((song) => !song.id);

      if (newSongs.length === 0 && existingCount >= 5) {
        setError("La tua playlist è già completa.");
        return;
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codice, songs: newSongs }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore durante il salvataggio.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Non è stato possibile salvare la playlist.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="py-10 text-center">
        <div className="text-5xl">✓</div>
        <h2 className="mt-5 text-2xl font-semibold">Playlist registrata!</h2>
        <p className="mt-2 text-neutral-500">Le tue canzoni sono entrate nella colonna sonora della classe.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <form onSubmit={verifyCode} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Il tuo codice personale</span>
          <input required value={codice} onChange={(e) => setCodice(e.target.value.toUpperCase())} placeholder="Es. 5A-7K2" autoComplete="off" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 uppercase tracking-widest outline-none focus:border-black" />
        </label>
        <button disabled={lookupLoading} className="w-full rounded-xl border border-neutral-300 px-5 py-3 font-medium transition hover:bg-neutral-50 disabled:opacity-50">
          {lookupLoading ? "Controllo…" : "Continua"}
        </button>
      </form>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {student && (
        <>
          <div className="rounded-xl bg-neutral-50 px-4 py-4">
            <p className="text-sm text-neutral-500">Codice riconosciuto</p>
            <p className="mt-1 text-lg font-semibold">{student.nome}</p>
            <p className="text-sm text-neutral-500">{student.classe}</p>
          </div>

          <form onSubmit={submit} className="space-y-6 border-t border-neutral-100 pt-7">
            <div>
              <h2 className="text-xl font-semibold">La tua playlist</h2>
              <p className="mt-1 text-sm text-neutral-500">Scegli da 5 a 10 canzoni. Le prime 5 sono obbligatorie.</p>
            </div>

            {songs.map((song, index) => (
              <div key={song.id ?? `new-${index}`} className="rounded-2xl border border-neutral-200 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Canzone {index + 1}</h3>
                  {index >= 5 && <button type="button" onClick={() => removeSong(index)} className="text-sm text-neutral-500 hover:text-red-600">Rimuovi</button>}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block"><span className="text-sm font-medium">Titolo</span><input required={!song.id} value={song.titolo} onChange={(e) => updateSong(index, "titolo", e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
                  <label className="block"><span className="text-sm font-medium">Artista</span><input required={!song.id} value={song.artista} onChange={(e) => updateSong(index, "artista", e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
                </div>
                <label className="mt-5 block"><span className="text-sm font-medium">Link YouTube</span><input required={!song.id} type="url" value={song.youtube_url} onChange={(e) => updateSong(index, "youtube_url", e.target.value)} placeholder="https://youtube.com/..." className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
                <label className="mt-5 block"><span className="text-sm font-medium">Perché hai scelto questa canzone?</span><textarea required={!song.id} minLength={10} value={song.motivo} onChange={(e) => updateSong(index, "motivo", e.target.value)} placeholder="Raccontaci cosa significa per te…" rows={4} className="mt-2 w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
              </div>
            ))}

            {songs.length < 10 && (
              <button type="button" onClick={addSong} className="w-full rounded-xl border border-dashed border-neutral-300 px-5 py-3 font-medium hover:bg-neutral-50">+ Aggiungi un'altra canzone</button>
            )}

            <button disabled={saving} className="w-full rounded-xl bg-black px-5 py-3.5 font-medium text-white disabled:opacity-50">
              {saving ? "Salvataggio…" : "Inserisci la mia playlist"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
