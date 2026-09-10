import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
export async function POST(req:Request){
 try{
  const b=await req.json();
  for(const k of ["student_name","title","artist","youtube_url","reason"]) if(!String(b[k]??"").trim()) return NextResponse.json({error:"Dati mancanti"},{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return NextResponse.json({error:"Supabase non configurato"},{status:500});
  const sb=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
  const {error}=await sb.from("songs").insert({student_name:String(b.student_name).trim(),title:String(b.title).trim(),artist:String(b.artist).trim(),youtube_url:String(b.youtube_url).trim(),reason:String(b.reason).trim()});
  if(error) throw error; return NextResponse.json({ok:true});
 }catch(e){console.error(e);return NextResponse.json({error:"Errore server"},{status:500})}
}