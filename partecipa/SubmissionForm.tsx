"use client";
import { FormEvent, useState } from "react";

type Student = { id: string; nome: string; classe: string };
type Song = { id: string; titolo: string; artista: string; youtube_url: string; motivo: string };
type DraftSong = { titolo: string; artista: string; youtube_url: string; motivo: string };

const emptySong = (): DraftSong => ({ titolo: "", artista: "", youtube_url: "", motivo: "" });

export default function SubmissionForm() {
  const [codice, setCodice] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [existingSongs, setExistingSongs] = useState<Song[]>([]);
  const [songs, setSongs] = useState<DraftSong[]>(Array.from({ length: 5 }, emptySong));
  const [lookupLoading, setLookupLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setError("");
    setExistingSongs([]);
    setStudent(null);
    setSongs(Array.from({ length: 5 }, emptySong));
    setLookupLoading(true);

    try {
      const response = await fetch("/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codice }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Codice non riconosciuto.");
      setStudent(data.student);
      setExistingSongs(data.songs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Codice non riconosciuto.");
    } finally {
      setLookupLoading(false);
    }
  }

  function updateSong(index: number, field: keyof DraftSong, value: string) {
    setSongs(current => current.map((song, i) => i === index ? { ...song, [field]: value } : song));
  }

  function addSong() {
    if (songs.length < 10) setSongs(current => [...current, emptySong()]);
  }

  function removeSong(index: number) {
    if (songs.length <= 5) return;
    setSongs(current => current.filter((_, i) => i !== index));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!student) return;
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codice, canzoni: songs }),
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

  if (done) return (
    <div className="py-10 text-center">
      <div className="text-5xl">✓</div>
      <h2 className="mt-5 text-2xl font-semibold">Playlist registrata!</h2>
      <p className="mt-2 text-neutral-500">Le tue {songs.length} canzoni sono entrate nella colonna sonora della classe.</p>
    </div>
  );

  return <div className="space-y-7">
    <form onSubmit={verifyCode} className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium">Il tuo codice personale</span>
        <input required value={codice} onChange={e => setCodice(e.target.value.toUpperCase())} placeholder="Es. 5AINT-7K2" autoComplete="off" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 uppercase tracking-widest outline-none focus:border-black" />
      </label>
      <button disabled={lookupLoading} className="w-full rounded-xl border border-neutral-300 px-5 py-3 font-medium transition hover:bg-neutral-50 disabled:opacity-50">
        {lookupLoading ? "Controllo…" : "Continua"}
      </button>
    </form>

    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

    {student && existingSongs.length === 0 && <>
      <div className="rounded-xl bg-neutral-50 px-4 py-4">
        <p className="text-sm text-neutral-500">Codice riconosciuto</p>
        <p className="mt-1 text-lg font-semibold">{student.nome}</p>
        <p className="text-sm text-neutral-500">{student.classe}</p>
      </div>

      <form onSubmit={submit} className="space-y-6 border-t border-neutral-100 pt-7">
        <div>
          <h2 className="text-xl font-semibold">La tua playlist</h2>
          <p className="mt-1 text-sm text-neutral-500">Scegli da 5 a 10 canzoni. Per ogni brano inserisci il link YouTube e raccontaci perché lo hai scelto.</p>
        </div>

        <div className="space-y-5">
          {songs.map((song, index) => <div key={index} className="rounded-2xl border border-neutral-200 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold">Canzone {index + 1}</h3>
              {songs.length > 5 && <button type="button" onClick={() => removeSong(index)} className="text-sm text-neutral-500 underline">Rimuovi</button>}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block"><span className="text-sm font-medium">Titolo</span><input required value={song.titolo} onChange={e => updateSong(index, "titolo", e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
              <label className="block"><span className="text-sm font-medium">Artista</span><input required value={song.artista} onChange={e => updateSong(index, "artista", e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
            </div>

            <label className="mt-5 block"><span className="text-sm font-medium">Link YouTube</span><input required type="url" value={song.youtube_url} onChange={e => updateSong(index, "youtube_url", e.target.value)} placeholder="https://youtube.com/..." className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
            <label className="mt-5 block"><span className="text-sm font-medium">Perché hai scelto questa canzone?</span><textarea required minLength={10} rows={4} value={song.motivo} onChange={e => updateSong(index, "motivo", e.target.value)} placeholder="Raccontaci cosa significa per te…" className="mt-2 w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
          </div>)}
        </div>

        {songs.length < 10 && <button type="button" onClick={addSong} className="w-full rounded-xl border border-neutral-300 px-5 py-3 font-medium transition hover:bg-neutral-50">+ Aggiungi un'altra canzone</button>}

        <div className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">Playlist: <strong>{songs.length} canzoni</strong> · minimo 5 · massimo 10</div>
        <button disabled={saving} className="w-full rounded-xl bg-black px-5 py-3.5 font-medium text-white disabled:opacity-50">{saving ? "Salvataggio…" : `Inserisci la playlist (${songs.length} canzoni)`}</button>
      </form>
    </>}

    {student && existingSongs.length > 0 && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <p className="font-semibold">Hai già inserito la tua playlist.</p>
      <div className="mt-4 space-y-2">
        {existingSongs.map((song, index) => <div key={song.id} className="rounded-xl bg-white/70 p-3 text-sm"><strong>{index + 1}. {song.titolo}</strong> — {song.artista}</div>)}
      </div>
      <p className="mt-4 text-sm text-neutral-600">Se devi correggerla, chiedi al docente di intervenire.</p>
    </div>}
  </div>;
}
