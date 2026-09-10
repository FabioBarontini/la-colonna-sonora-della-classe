import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return NextResponse.json({ error: "Supabase non configurato" }, { status: 500 });
    const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data, error } = await sb
      .from("canzoni")
      .select("id, titolo, artista, youtube_url, motivo, genere, anno, created_at, studenti(id, nome, classe)")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const songs = (data ?? []).map((s: any) => ({
      id: s.id,
      student_id: s.studenti?.id ?? null,
      student_name: s.studenti?.nome ?? "Studente",
      classe: s.studenti?.classe ?? "",
      title: s.titolo,
      artist: s.artista,
      youtube_url: s.youtube_url,
      reason: s.motivo,
      genre: s.genere,
      year: s.anno,
      created_at: s.created_at,
    }));
    return NextResponse.json({ songs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
