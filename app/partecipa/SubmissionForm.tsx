 "use client";
import {useState} from "react";
export default function SubmissionForm(){
 const [done,setDone]=useState(false); const [loading,setLoading]=useState(false);
 if(done) return <div className="py-10 text-center"><div className="text-5xl">✓</div><h2 className="mt-5 text-2xl font-semibold">Scelta registrata!</h2><p className="mt-2 text-neutral-500">La tua canzone è entrata nella colonna sonora della classe.</p></div>;
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);const f=new FormData(e.currentTarget);const r=await fetch("/api/submissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(f))});setLoading(false);if(r.ok)setDone(true);else alert("Non è stato possibile salvare la scheda.");}
 return <form onSubmit={submit} className="space-y-5">
   <label className="block"><span className="text-sm font-medium">Nome e cognome</span><input required name="student_name" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-black" /></label>
   <div className="grid gap-5 md:grid-cols-2"><label className="block"><span className="text-sm font-medium">Titolo</span><input required name="title" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3" /></label><label className="block"><span className="text-sm font-medium">Artista</span><input required name="artist" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3" /></label></div>
   <label className="block"><span className="text-sm font-medium">Link YouTube</span><input required type="url" name="youtube_url" placeholder="https://youtube.com/..." className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3" /></label>
   <label className="block"><span className="text-sm font-medium">Perché hai scelto questa canzone?</span><textarea required name="reason" rows={5} className="mt-2 w-full resize-none rounded-xl border border-neutral-200 px-4 py-3" /></label>
   <button disabled={loading} className="w-full rounded-xl bg-black px-5 py-3.5 font-medium text-white disabled:opacity-50">{loading?"Invio…":"Inserisci la mia canzone"}</button>
 </form>
}