import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase non configurato");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET(request: NextRequest) {
  try {
    const classe = request.nextUrl.searchParams.get("classe")?.trim();
    if (!classe) return NextResponse.json({ song: null });

    const sb = db();
    const { data: students, error: studentsError } = await sb
      .from("studenti")
      .select("id")
      .eq("classe", classe)
      .eq("attivo", true);
    if (studentsError) throw studentsError;

    const studentIds = (students ?? []).map((s: { id: string }) => s.id);
    if (!studentIds.length) return NextResponse.json({ song: null });

    const { count, error: countError } = await sb
      .from("canzoni")
      .select("id", { count: "exact", head: true })
      .in("studente_id", studentIds);
    if (countError) throw countError;
    if (!count) return NextResponse.json({ song: null });

    const offset = Math.floor(Math.random() * count);
    const { data, error } = await sb
      .from("canzoni")
      .select("id, titolo, artista, youtube_url")
      .in("studente_id", studentIds)
      .order("created_at", { ascending: true })
      .range(offset, offset);
    if (error) throw error;

    const s = data?.[0];
    if (!s) return NextResponse.json({ song: null });

    return NextResponse.json({
      song: {
        id: s.id,
        title: s.titolo,
        artist: s.artista,
        youtubeUrl: s.youtube_url,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Non è stato possibile caricare la musica." }, { status: 500 });
  }
}
