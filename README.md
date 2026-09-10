# La colonna sonora della classe

Stack: Next.js + TypeScript + Tailwind + Supabase + Vercel.

## Avvio
1. `npm install`
2. crea un progetto Supabase
3. esegui `supabase/schema.sql` nel SQL Editor
4. copia `.env.example` in `.env.local` e inserisci le chiavi
5. crea l'utente docente in Supabase Authentication > Users
6. `npm run dev`

## Pubblicazione
Importa il repository in Vercel e imposta le tre variabili d'ambiente. Non pubblicare mai `SUPABASE_SERVICE_ROLE_KEY` nel client.

## Note
La prima versione usa una tabella `songs`. La mappa confronta i titoli normalizzati; in una fase successiva conviene aggiungere un identificativo YouTube/ISRC e una tabella `students` per rendere il matching più robusto.
