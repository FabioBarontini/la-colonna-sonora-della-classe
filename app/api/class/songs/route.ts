import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase non configurato");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(req: Request) {
  try {
    const classe = new URL(req.url).searchParams.get("classe")?.trim();
    if (!classe) return NextResponse.json({ error: "Classe non specificata." }, { status: 400 });
    const supabase = db();
    const { data: students, error: se } = await supabase.from("studenti").select("id, nome, classe").eq("classe", classe).eq("attivo", true).order("nome");
    if (se) throw se;
    const ids = (students ?? []).map(s => s.id);
    if (!ids.length) return NextResponse.json({ songs: [], students: [] });
    const { data: songs, error: ce } = await supabase.from("canzoni").select("id, studente_id, titolo, artista, youtube_url, motivo, genere, anno, created_at").in("studente_id", ids).order("created_at", { ascending: false });
    if (ce) throw ce;
    const names = new Map((students ?? []).map(s => [s.id, s.nome]));
    const result = (songs ?? []).map(s => ({ ...s, student_name: names.get(s.studente_id) ?? "", classe }));
    return NextResponse.json({ songs: result, students: students ?? [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento dei brani." }, { status: 500 });
  }
}
