import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Inserisci email e password." }, { status: 400 });
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: "Credenziali non valide." }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Errore del server." }, { status: 500 }); }
}
