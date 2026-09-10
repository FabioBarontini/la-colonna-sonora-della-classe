import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase non configurato");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codice = String(body?.codice ?? "").trim().toUpperCase();
    if (!codice) return NextResponse.json({ error: "Inserisci il codice personale." }, { status: 400 });
    const supabase = db();
    const { data, error } = await supabase.from("studenti").select("id, nome, classe, attivo").eq("codice_personale", codice).maybeSingle();
    if (error) throw error;
    if (!data || !data.attivo) return NextResponse.json({ error: "Codice non riconosciuto." }, { status: 404 });
    const { data: song, error: songError } = await supabase.from("canzoni").select("id, titolo, artista, youtube_url, motivo").eq("studente_id", data.id).maybeSingle();
    if (songError) throw songError;
    return NextResponse.json({ student: { id: data.id, nome: data.nome, classe: data.classe }, hasSong: Boolean(song), song: song ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore del server." }, { status: 500 });
  }
}
