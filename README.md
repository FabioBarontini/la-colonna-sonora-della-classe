# La colonna sonora della classe — aggiornamento WOW

Patch per il progetto già presente su GitHub.

## Cosa cambia
- Playlist studente da 5 a 10 brani.
- Modifica dei brani già salvati.
- Aggiunta e rimozione dei brani, mantenendo il minimo di 5.
- Salvataggio sincronizzato della playlist.
- Nuova grafica dark/musicale con gradienti, glassmorphism, waveform e music cards.
- Home completamente ridisegnata.
- Pagina studente ridisegnata.
- Dashboard docente ridisegnata.
- Mappa musicale ridisegnata.
- Gioco "Indovina il compagno" ridisegnato.
- Login docente ridisegnato.
- Gestione classe ridisegnata.

## Importante
Questa è una PATCH, non un progetto completo.

NON sostituire l'intero repository con lo ZIP.

Copia i file della patch nelle rispettive cartelle del repository GitHub e fai un unico commit su `main`.

Non modificare:
- `tsconfig.json`
- `middleware.ts`
- variabili Vercel
- configurazione Supabase
- schema del database
- `app/api/student/route.ts` (la versione attuale è già compatibile con la playlist)

La nuova API `/api/submissions` sincronizza la playlist: aggiorna i brani esistenti, inserisce quelli nuovi ed elimina quelli rimossi dall'utente, mantenendo sempre 5–10 brani.
