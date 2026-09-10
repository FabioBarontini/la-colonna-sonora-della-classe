# Patch Home – Player per classe

Questa patch modifica esclusivamente il player musicale della homepage.

## Sostituire
- `app/components/NowPlaying.tsx`
- `app/api/now-playing/route.ts`

## Aggiungere
- `app/api/classes/route.ts`

## Comportamento
- Prima di ascoltare viene scelta una classe.
- Il player pesca casualmente un brano solo da quella classe.
- Non mostra mai il nome dello studente che ha scelto il brano.
- La classe scelta viene ricordata sul browser.
- Pausa/riproduzione e ultimo brano restano locali al singolo browser.
- Non sono richieste modifiche a Supabase o alle variabili Vercel.
