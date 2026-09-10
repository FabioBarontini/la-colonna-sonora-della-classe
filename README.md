# WOW4 Multi-classe – FIX3

Correzione della Mappa musicale.

Sostituire SOLO:

`app/docente/mappa/page.tsx`

La correzione elimina l'ultimo riferimento al campo inesistente `s.title` e usa correttamente `s.titolo`, coerente con la tabella `canzoni`.

Non modificare Supabase, tsconfig, middleware o variabili Vercel.
