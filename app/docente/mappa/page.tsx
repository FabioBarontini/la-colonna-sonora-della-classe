"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
type S={id:string;student_id:string|null;student_name:string;title:string;artist:string};
export default function MapPage(){
 const [songs,setSongs]=useState<S[]>([]); const [sel,setSel]=useState<{a:string,b:string,titles:string[]}|null>(null);
 useEffect(()=>{fetch("/api/songs").then(r=>r.json()).then(d=>setSongs(d.songs||[]))},[]);
 const names=[...new Set(songs.map(s=>s.student_name))];
 const pairs=useMemo(()=>{const out:any[]=[];for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++){const a=songs.filter(s=>s.student_name===names[i]).map(s=>s.title.trim().toLowerCase());const b=songs.filter(s=>s.student_name===names[j]).map(s=>s.title.trim().toLowerCase());const common=a.filter(x=>b.includes(x));if(common.length)out.push({a:names[i],b:names[j],n:common.length,titles:common.map(x=>songs.find(s=>s.title.trim().toLowerCase()===x)?.title||x)})}return out},[songs,names]);
 const pos=names.map((n,i)=>({n,x:names.length===1?50:50+40*Math.cos(i/names.length*Math.PI*2),y:names.length===1?50:50+36*Math.sin(i/names.length*Math.PI*2)}));
 return <main className="min-h-screen px-5 py-8"><div className="mx-auto max-w-6xl"><Link href="/docente/classe" className="text-sm text-neutral-500">← Dashboard</Link><h1 className="mt-5 text-4xl font-semibold">🕸️ Mappa musicale</h1><p className="mt-2 text-neutral-500">Una linea unisce due compagni quando hanno scelto lo stesso brano. Il numero indica quante canzoni condividono.</p>
 <div className="card mt-7 overflow-hidden p-3"><svg viewBox="0 0 100 100" className="h-[560px] w-full rounded-2xl bg-neutral-50">{pairs.map((p,i)=>{const A=pos.find(x=>x.n===p.a)!,B=pos.find(x=>x.n===p.b)!;return <g key={i} onClick={()=>setSel(p)} className="cursor-pointer"><line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#999" strokeWidth=".35"/><text x={(A.x+B.x)/2} y={(A.y+B.y)/2-1} fontSize="3" textAnchor="middle" fill="#555">{p.n}</text></g>})}{pos.map(p=><g key={p.n} onClick={()=>setSel({a:p.n,b:"",titles:songs.filter(s=>s.student_name===p.n).map(s=>s.title)})} className="cursor-pointer"><circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#111" strokeWidth=".6"/><text x={p.x} y={p.y+.8} fontSize="2.2" textAnchor="middle">{p.n.split(" ")[0]}</text></g>)}</svg></div>
 {sel&&<div className="card mt-5 p-6"><button onClick={()=>setSel(null)} className="float-right text-neutral-500">Chiudi</button><h2 className="text-xl font-semibold">{sel.b?`${sel.a} ↔ ${sel.b}`:sel.a}</h2><p className="mt-1 text-sm text-neutral-500">{sel.b?`${sel.titles.length} canzoni in comune`:"Canzoni scelte"}</p><ul className="mt-4 space-y-2">{sel.titles.map((t,i)=><li key={i} className="rounded-lg bg-neutral-50 p-3">🎵 {t}</li>)}</ul></div>}</div></main>
}
