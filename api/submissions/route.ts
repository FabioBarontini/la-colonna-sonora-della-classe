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

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function isYoutubeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

type SongInput = {
  titolo: string;
  artista: string;
  youtube_url: string;
  motivo: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codice = String(body?.codice ?? "").trim().toUpperCase();
    const rawSongs = Array.isArray(body?.canzoni) ? body.canzoni : [];

    if (!codice) return NextResponse.json({ error: "Codice personale non valido." }, { status: 400 });
    if (rawSongs.length < 5 || rawSongs.length > 10) {
      return NextResponse.json({ error: "La playlist deve contenere da 5 a 10 canzoni." }, { status: 400 });
    }

    const canzoni: SongInput[] = rawSongs.map((song: any) => ({
      titolo: String(song?.titolo ?? "").trim(),
      artista: String(song?.artista ?? "").trim(),
      youtube_url: String(song?.youtube_url ?? "").trim(),
      motivo: String(song?.motivo ?? "").trim(),
    }));

    for (let i = 0; i < canzoni.length; i++) {
      const song = canzoni[i];
      if (!song.titolo || !song.artista || !song.youtube_url || !song.motivo) {
        return NextResponse.json({ error: `Completa tutti i campi della canzone ${i + 1}.` }, { status: 400 });
      }
      if (!isYoutubeUrl(song.youtube_url)) {
        return NextResponse.json({ error: `Il link YouTube della canzone ${i + 1} non è valido.` }, { status: 400 });
      }
      if (song.motivo.length < 10) {
        return NextResponse.json({ error: `Racconta almeno un po' meglio perché hai scelto la canzone ${i + 1}.` }, { status: 400 });
      }
    }

    const keys = canzoni.map(song => `${normalizeTitle(song.titolo)}|${normalizeText(song.artista)}`);
    if (new Set(keys).size !== keys.length) {
      return NextResponse.json({ error: "Nella playlist ci sono due volte la stessa canzone dello stesso artista." }, { status: 400 });
    }

    const supabase = db();
    const { data: student, error: studentError } = await supabase
      .from("studenti")
      .select("id, nome, classe, attivo")
      .eq("codice_personale", codice)
      .maybeSingle();

    if (studentError) throw studentError;
    if (!student || !student.attivo) return NextResponse.json({ error: "Codice personale non riconosciuto." }, { status: 404 });

    const { count, error: existingError } = await supabase
      .from("canzoni")
      .select("id", { count: "exact", head: true })
      .eq("studente_id", student.id);

    if (existingError) throw existingError;
    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: `Per ${student.nome} è già stata registrata una playlist.` }, { status: 409 });
    }

    const rows = canzoni.map(song => ({
      studente_id: student.id,
      titolo: song.titolo,
      artista: song.artista,
      youtube_url: song.youtube_url,
      motivo: song.motivo,
      titolo_normalizzato: normalizeTitle(song.titolo),
    }));

    const { error } = await supabase.from("canzoni").insert(rows);
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      count: canzoni.length,
      student: { nome: student.nome, classe: student.classe },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Non è stato possibile salvare la playlist." }, { status: 500 });
  }
}
