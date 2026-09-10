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
    const { data, error } = await db().from("studenti").select("classe").not("classe", "is", null).order("classe");
    if (error) throw error;
    const classes = [...new Set((data ?? []).map(x => String(x.classe).trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b, "it", { numeric: true }));
    return NextResponse.json({ classes });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel caricamento delle classi." }, { status: 500 });
  }
}
