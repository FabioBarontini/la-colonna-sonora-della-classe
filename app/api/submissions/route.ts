import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase non configurato");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function normalizeTitle(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isYoutubeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

type IncomingSong = { titolo?: unknown; artista?: unknown; youtube_url?: unknown; motivo?: unknown };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codice = String(body?.codice ?? "").trim().toUpperCase();
    const incoming: IncomingSong[] = Array.isArray(body?.songs) ? body.songs : [];

    if (!codice) return NextResponse.json({ error: "Codice personale non riconosciuto." }, { status: 400 });
    if (incoming.length < 1) return NextResponse.json({ error: "Non ci sono nuove canzoni da salvare." }, { status: 400 });

    const songs = incoming.map((song) => ({
      titolo: String(song?.titolo ?? "").trim(),
      artista: String(song?.artista ?? "").trim(),
      youtube_url: String(song?.youtube_url ?? "").trim(),
      motivo: String(song?.motivo ?? "").trim(),
    }));

    for (const song of songs) {
      if (!song.titolo || !song.artista || !song.youtube_url || !song.motivo) return NextResponse.json({ error: "Compila tutti i campi delle canzoni." }, { status: 400 });
      if (!isYoutubeUrl(song.youtube_url)) return NextResponse.json({ error: `Il link di “${song.titolo}” non è un link valido a YouTube.` }, { status: 400 });
      if (song.motivo.length < 10) return NextResponse.json({ error: `Racconta un po' meglio perché hai scelto “${song.titolo}”.` }, { status: 400 });
    }

    const supabase = db();
    const { data: student, error: studentError } = await supabase.from("studenti").select("id, nome, classe, attivo").eq("codice_personale", codice).maybeSingle();
    if (studentError) throw studentError;
    if (!student || !student.attivo) return NextResponse.json({ error: "Codice personale non riconosciuto." }, { status: 404 });

    const { data: existing, error: existingError } = await supabase.from("canzoni").select("id, titolo, artista").eq("studente_id", student.id);
    if (existingError) throw existingError;

    const existingSongs = existing ?? [];
    const finalCount = existingSongs.length + songs.length;
    if (finalCount < 5) return NextResponse.json({ error: `La playlist deve contenere almeno 5 canzoni. Al momento ne hai ${existingSongs.length}.` }, { status: 400 });
    if (finalCount > 10) return NextResponse.json({ error: `La playlist può contenere al massimo 10 canzoni.` }, { status: 400 });

    const keys = new Set(existingSongs.map((s) => `${normalizeTitle(s.titolo)}|${normalizeTitle(s.artista)}`));
    for (const song of songs) {
      const key = `${normalizeTitle(song.titolo)}|${normalizeTitle(song.artista)}`;
      if (keys.has(key)) return NextResponse.json({ error: `La canzone “${song.titolo}” è già presente nella tua playlist.` }, { status: 409 });
      keys.add(key);
    }

    const rows = songs.map((song) => ({
      studente_id: student.id,
      titolo: song.titolo,
      artista: song.artista,
      youtube_url: song.youtube_url,
      motivo: song.motivo,
      titolo_normalizzato: normalizeTitle(song.titolo),
    }));

    const { error } = await supabase.from("canzoni").insert(rows);
    if (error) throw error;

    return NextResponse.json({ ok: true, added: songs.length, total: finalCount, student: { nome: student.nome, classe: student.classe } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Non è stato possibile salvare la playlist." }, { status: 500 });
  }
}
