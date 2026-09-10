"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ListMusic, LogOut, Map, Settings2, Sparkles } from "lucide-react";
import ClassSelector from "./ClassSelector";
import { useTeacherClass } from "../components/TeacherClassContext";

const links = [
  { href: "/docente/classe", label: "Dashboard", icon: BarChart3 },
  { href: "/docente/mappa", label: "Mappa musicale", icon: Map },
  { href: "/docente/classe/playlist", label: "Playlist studenti", icon: ListMusic },
  { href: "/docente/indovina", label: "Indovina", icon: Sparkles },
  { href: "/docente/classe/gestione", label: "Gestione classe", icon: Settings2 },
];

export default function TeacherNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedClass } = useTeacherClass();
  const withClass = (href:string) => selectedClass ? `${href}?classe=${encodeURIComponent(selectedClass)}` : href;
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/docente/login"); router.refresh(); }
  return <div className="teacher-nav glass-soft">
    <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
      {links.map(({href,label,icon:Icon}) => {
        const active = pathname === href || (href !== "/docente/classe" && pathname.startsWith(href));
        return <Link key={href} href={withClass(href)} className={`teacher-nav-link ${active ? "active" : ""}`}><Icon size={15}/><span>{label}</span></Link>;
      })}
    </div>
    <div className="teacher-nav-actions"><ClassSelector compact /><button onClick={logout} className="teacher-logout" title="Esci"><LogOut size={15}/><span className="hidden sm:inline">Esci</span></button></div>
  </div>;
}
