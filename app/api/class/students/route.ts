import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function makeCode(index:number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i=0;i<4;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}
async function requireTeacher() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  if (!await requireTeacher()) return NextResponse.json({ error:"Non autorizzato" }, {status:401});
  const db=createSupabaseAdmin();
  const {data,error}=await db.from("studenti").select("id,nome,codice_personale,classe,attivo,created_at,canzoni(id,titolo)").order("nome");
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({students:data||[]});
}

export async function POST(req:Request) {
  if (!await requireTeacher()) return NextResponse.json({ error:"Non autorizzato" }, {status:401});
  const body=await req.json();
  const classe=String(body?.classe||"").trim();
  const raw=String(body?.nomi||"");
  const names=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if(!classe || !names.length) return NextResponse.json({error:"Inserisci classe ed elenco studenti."},{status:400});
  const db=createSupabaseAdmin();
  const rows=[] as {nome:string;codice_personale:string;classe:string}[];
  const used=new Set<string>();
  for(const nome of names){
    let code="";
    do { code=`${classe.replace(/\s+/g,"").toUpperCase()}-${makeCode(rows.length)}`; } while(used.has(code));
    used.add(code); rows.push({nome,codice_personale:code,classe});
  }
  const {data,error}=await db.from("studenti").insert(rows).select("id,nome,codice_personale,classe,attivo,created_at");
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({students:data||[]});
}
