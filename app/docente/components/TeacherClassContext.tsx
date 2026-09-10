"use client";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ClassContextValue = { classes:string[]; selectedClass:string; loading:boolean; selectClass:(classe:string)=>void; refreshClasses:()=>Promise<void> };
const ClassContext=createContext<ClassContextValue|null>(null);
export function useTeacherClass(){const ctx=useContext(ClassContext);if(!ctx)throw new Error("useTeacherClass deve essere usato nell'area docente");return ctx;}
export default function TeacherClassContext({children}:{children:ReactNode}){
 const pathname=usePathname(); const params=useSearchParams(); const router=useRouter(); const queryClass=params.get("classe")||""; const [classes,setClasses]=useState<string[]>([]); const [loading,setLoading]=useState(true); const [stored,setStored]=useState("");
 const refreshClasses=async()=>{try{const r=await fetch("/api/class/classes",{cache:"no-store"});const d=await r.json();if(r.ok)setClasses(d.classes||[])}finally{setLoading(false)}};
 useEffect(()=>{if(pathname==="/docente/login")return;setStored(window.localStorage.getItem("colonna-classe")||"");refreshClasses()},[pathname]);
 useEffect(()=>{if(queryClass){setStored(queryClass);window.localStorage.setItem("colonna-classe",queryClass)}},[queryClass]);
 useEffect(()=>{if(!queryClass&&stored&&pathname!=="/docente/login")router.replace(`${pathname}?classe=${encodeURIComponent(stored)}`)},[queryClass,stored,pathname,router]);
 const selectClass=(classe:string)=>{setStored(classe);window.localStorage.setItem("colonna-classe",classe);router.push(`${pathname}?classe=${encodeURIComponent(classe)}`)};
 const selectedClass=queryClass||stored; const value=useMemo(()=>({classes,selectedClass,loading,selectClass,refreshClasses}),[classes,selectedClass,loading]);
 return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>;
}
