"use client";
import { ChevronDown, Layers3 } from "lucide-react";
import { useTeacherClass } from "../components/TeacherClassContext";

export default function ClassSelector({ compact = false }: { compact?: boolean }) {
  const { classes, selectedClass, loading, selectClass } = useTeacherClass();
  return <label className={`class-selector ${compact ? "compact" : ""}`}>
    <span className="class-selector-icon"><Layers3 size={14}/></span>
    <span className="class-selector-copy"><small>Classe attiva</small><strong>{selectedClass || (loading ? "Caricamento…" : "Seleziona una classe")}</strong></span>
    <select value={selectedClass} onChange={e => e.target.value && selectClass(e.target.value)} aria-label="Seleziona la classe">
      <option value="">Seleziona…</option>
      {classes.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
    <ChevronDown size={14} className="class-selector-chevron"/>
  </label>;
}
