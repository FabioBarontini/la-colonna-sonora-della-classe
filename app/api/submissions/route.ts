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
  try { const url = new URL(value); return ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(url.hostname.toLowerCase()); }
  catch { return false; }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codice = String(body?.codice ?? "").trim().toUpperCase();
    const titolo = String(body?.titolo ?? "").trim();
    const artista = String(body?.artista ?? "").trim();
    const youtubeUrl = String(body?.youtube_url ?? "").trim();
    const motivo = String(body?.motivo ?? "").trim();
    if (!codice || !titolo || !artista || !youtubeUrl || !motivo) return NextResponse.json({ error: "Compila tutti i campi obbligatori." }, { status: 400 });
    if (!isYoutubeUrl(youtubeUrl)) return NextResponse.json({ error: "Inserisci un link valido a YouTube." }, { status: 400 });
    if (motivo.length < 10) return NextResponse.json({ error: "Racconta un po' meglio perché hai scelto questa canzone." }, { status: 400 });
    const supabase = db();
    const { data: student, error: studentError } = await supabase.from("studenti").select("id, nome, classe, attivo").eq("codice_personale", codice).maybeSingle();
    if (studentError) throw studentError;
    if (!student || !student.attivo) return NextResponse.json({ error: "Codice personale non riconosciuto." }, { status: 404 });
    const { data: existing, error: existingError } = await supabase.from("canzoni").select("id, titolo, artista").eq("studente_id", student.id).maybeSingle();
    if (existingError) throw existingError;
    if (existing) return NextResponse.json({ error: `Per ${student.nome} è già stata registrata una canzone: “${existing.titolo}”.` }, { status: 409 });
    const { error } = await supabase.from("canzoni").insert({ studente_id: student.id, titolo, artista, youtube_url: youtubeUrl, motivo, titolo_normalizzato: normalizeTitle(titolo) });
    if (error) throw error;
    return NextResponse.json({ ok: true, student: { nome: student.nome, classe: student.classe } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Non è stato possibile salvare la scheda." }, { status: 500 });
  }
}
