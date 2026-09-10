"use client";
import { FormEvent, useState } from "react";
import { Music2, Plus, Trash2, Save, Check, ArrowRight, ExternalLink } from "lucide-react";

type Student={id:string;nome:string;classe:string};
type Song={id?:string;titolo:string;artista:string;youtube_url:string;motivo:string};
const emptySong=():Song=>({titolo:"",artista:"",youtube_url:"",motivo:""});

export default function SubmissionForm(){
 const [codice,setCodice]=useState(""); const [student,setStudent]=useState<Student|null>(null); const [songs,setSongs]=useState<Song[]>([]);
 const [lookupLoading,setLookupLoading]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState(""),[done,setDone]=useState(false);
 async function verifyCode(e:FormEvent){e.preventDefault();setError("");setDone(false);setStudent(null);setSongs([]);setLookupLoading(true);try{const r=await fetch("/api/student",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({codice})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Codice non riconosciuto.");const existing:Song[]=d.songs??[];setStudent(d.student);setSongs(existing.length<5?[...existing,...Array.from({length:5-existing.length},emptySong)]:existing);}catch(e){setError(e instanceof Error?e.message:"Codice non riconosciuto.");}finally{setLookupLoading(false)}}
 function update(i:number,f:keyof Song,v:string){setSongs(a=>a.map((s,n)=>n===i?{...s,[f]:v}:s));}
 function add(){if(songs.length<10)setSongs(a=>[...a,emptySong()]);}
 function remove(i:number){if(songs.length<=5){setError("La playlist deve contenere almeno 5 canzoni.");return;}setSongs(a=>a.filter((_,n)=>n!==i));setError("");}
 async function save(e:FormEvent){e.preventDefault();if(!student)return;setError("");const filled=songs.filter(s=>s.titolo.trim()||s.artista.trim()||s.youtube_url.trim()||s.motivo.trim());if(filled.length<5){setError("La tua playlist deve contenere almeno 5 canzoni.");return}if(filled.length>10){setError("Puoi inserire al massimo 10 canzoni.");return}if(filled.some(s=>!s.titolo.trim()||!s.artista.trim()||!s.youtube_url.trim()||!s.motivo.trim())){setError("Completa tutti i campi delle canzoni che hai iniziato a compilare.");return}setSaving(true);try{const r=await fetch("/api/submissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({codice,songs:filled})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Errore durante il salvataggio.");setSongs(d.songs??filled);setDone(true);}catch(e){setError(e instanceof Error?e.message:"Non è stato possibile salvare la playlist.");}finally{setSaving(false)}}
 if(done)return <div className="py-12 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><Check size={38}/></div><div className="eyebrow mt-8">Playlist aggiornata</div><h2 className="mt-3 text-4xl font-black">È dentro. 🎧</h2><p className="mx-auto mt-3 max-w-lg leading-7 muted">La tua selezione è entrata nella colonna sonora della classe. Puoi tornare quando vuoi con lo stesso codice per modificarla.</p><button onClick={()=>setDone(false)} className="btn-ghost mt-7">Modifica ancora</button></div>;
 return <div className="space-y-8">
   <form onSubmit={verifyCode} className="glass-soft p-5 md:p-6"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300"><Music2 size={20}/></div><div className="flex-1"><label className="text-sm font-semibold">Il tuo codice personale</label><input required value={codice} onChange={e=>setCodice(e.target.value.toUpperCase())} placeholder="Es. 5AINT-B4LA" autoComplete="off" className="field mt-3 uppercase tracking-[.22em]"/><button disabled={lookupLoading} className="btn-primary mt-3 w-full">{lookupLoading?"Controllo…":"Continua"}<ArrowRight size={16}/></button></div></div></form>
   {error&&<div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">{error}</div>}
   {student&&<>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Codice riconosciuto</div><h2 className="mt-2 text-3xl font-black">Ciao, {student.nome.split(" ")[0]}.</h2><p className="mt-1 muted">{student.classe} · questa è la tua playlist</p></div><div className="pill"><span className="h-2 w-2 rounded-full bg-emerald-300"/>{songs.filter(s=>s.titolo.trim()).length} / 10 brani</div></div>
    <form onSubmit={save} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-5">{Array.from({length:5}).map((_,i)=><div key={i} className={`h-1.5 rounded-full ${songs[i]?.titolo.trim()?"bg-gradient-to-r from-violet-400 to-cyan-300":"bg-white/10"}`}/>)}</div>
      {songs.map((song,index)=><div key={song.id??`new-${index}`} className="music-card p-5 md:p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 font-mono text-xs text-violet-200">{String(index+1).padStart(2,"0")}</div><div><div className="font-semibold">Canzone {index+1}</div><div className="text-xs muted">{song.id?"Salvata · puoi modificarla":"Nuovo brano"}</div></div></div>{songs.length>5&&<button type="button" onClick={()=>remove(index)} className="rounded-xl p-2 text-[#8e91a6] hover:bg-rose-400/10 hover:text-rose-300"><Trash2 size={17}/></button>}</div>
        <div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Titolo<input required value={song.titolo} onChange={e=>update(index,"titolo",e.target.value)} className="field mt-2"/></label><label className="text-sm font-medium">Artista<input required value={song.artista} onChange={e=>update(index,"artista",e.target.value)} className="field mt-2"/></label></div>
        <label className="mt-4 block text-sm font-medium">Link YouTube<input required type="url" value={song.youtube_url} onChange={e=>update(index,"youtube_url",e.target.value)} placeholder="https://youtube.com/..." className="field mt-2"/></label>
        <label className="mt-4 block text-sm font-medium">Perché l'hai scelta?<textarea required minLength={10} value={song.motivo} onChange={e=>update(index,"motivo",e.target.value)} placeholder="Un ricordo, una persona, un momento…" rows={4} className="field mt-2 resize-none"/></label>
        {song.youtube_url&&<a href={song.youtube_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-white">Apri il link <ExternalLink size={12}/></a>}
      </div>)}
      {songs.length<10&&<button type="button" onClick={add} className="btn-ghost w-full border-dashed"><Plus size={17}/> Aggiungi un'altra canzone <span className="text-xs muted">({songs.length}/10)</span></button>}
      <button disabled={saving} className="btn-primary w-full"><Save size={17}/>{saving?"Salvataggio…":"Salva la playlist"}</button>
      <p className="text-center text-xs muted">Le prime 5 canzoni sono obbligatorie. Puoi arrivare fino a 10 e modificarle in qualsiasi momento.</p>
    </form>
   </>}
 </div>
}
