import Link from "next/link";
export default function Home() {
 return <main className="min-h-screen px-6 py-12">
   <div className="mx-auto max-w-5xl">
     <div className="mb-16">
       <p className="text-sm uppercase tracking-[.22em] text-neutral-500">La colonna sonora</p>
       <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-7xl">della classe.</h1>
       <p className="mt-6 max-w-xl text-lg text-neutral-600">Una canzone, una storia, una classe. Inserisci il brano che ti rappresenta e raccontaci perché l’hai scelto.</p>
     </div>
     <div className="grid gap-5 md:grid-cols-2">
       <Link href="/partecipa" className="card block p-7 transition hover:-translate-y-1">
         <div className="text-3xl">🎵</div><h2 className="mt-8 text-2xl font-semibold">La mia canzone</h2>
         <p className="mt-2 text-neutral-500">Inserisci il tuo brano e racconta la tua scelta.</p>
       </Link>
       <Link href="/docente/login" className="card block p-7 transition hover:-translate-y-1">
         <div className="text-3xl">🔐</div><h2 className="mt-8 text-2xl font-semibold">Area docente</h2>
         <p className="mt-2 text-neutral-500">Dashboard, mappa musicale e gioco della classe.</p>
       </Link>
     </div>
   </div>
 </main>
}