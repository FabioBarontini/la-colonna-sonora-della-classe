import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase non configurato");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET() {
  try {
    const sb = db();
    const { count, error: countError } = await sb
      .from("canzoni")
      .select("id", { count: "exact", head: true });
    if (countError) throw countError;
    if (!count) return NextResponse.json({ song: null });

    const offset = Math.floor(Math.random() * count);
    const { data, error } = await sb
      .from("canzoni")
      .select("id, titolo, artista, youtube_url, motivo, studenti(nome, classe)")
      .order("created_at", { ascending: true })
      .range(offset, offset);
    if (error) throw error;

    const s: any = data?.[0];
    if (!s) return NextResponse.json({ song: null });

    return NextResponse.json({
      song: {
        id: s.id,
        title: s.titolo,
        artist: s.artista,
        youtubeUrl: s.youtube_url,
        reason: s.motivo,
        studentName: s.studenti?.nome ?? "",
        classe: s.studenti?.classe ?? "",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Non è stato possibile caricare la musica." }, { status: 500 });
  }
}
