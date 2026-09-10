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
    const { data, error } = await sb.from("studenti").select("classe").eq("attivo", true);
    if (error) throw error;
    const classi = Array.from(new Set((data ?? []).map((row: { classe: string | null }) => row.classe?.trim()).filter(Boolean)))
      .sort((a, b) => a!.localeCompare(b!, "it")) as string[];
    return NextResponse.json({ classi });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Non è stato possibile caricare le classi." }, { status: 500 });
  }
}
