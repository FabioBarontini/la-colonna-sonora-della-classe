import { Suspense } from "react";
import TeacherClassContext from "./components/TeacherClassContext";
export default function Layout({children}:{children:React.ReactNode}){return <Suspense fallback={<div className="min-h-screen"/>}><TeacherClassContext>{children}</TeacherClassContext></Suspense>}
