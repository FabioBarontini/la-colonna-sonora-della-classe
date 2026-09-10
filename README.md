# Patch WOW 2 — player reale + pannello amministratore

Questa patch si applica al progetto già funzionante.

## Nuove funzioni
- Home con player **NOW PLAYING** reale: sceglie casualmente un brano dal database `canzoni`.
- Riproduzione tramite player YouTube incorporato, con controlli e pausa indipendente su ogni browser.
- Il browser ricorda l'ultimo brano e lo stato pausa/riproduzione tramite localStorage.
- Pulsante **Cambia brano** per estrarre un'altra canzone casuale.
- Pulsante **Pannello docente** più evidente nella home.
- Nuova barra di navigazione WOW nell'area docente.
- Nuovo percorso `/docente/classe/gestione` per il pannello amministratore.
- Gestione classe separata dal dashboard, con codici personali e stampa.
- La nuova area gestione è protetta dal middleware Supabase.
- Mappa musicale e gioco `Indovina` mantengono il design WOW e ora condividono la navigazione docente.
- La sezione **Come funziona** della home è stata resa più chiara e raggiungibile con scroll.

## File da copiare nel repository GitHub
Copia mantenendo le cartelle:

- `app/page.tsx`
- `app/globals.css`
- `app/components/NowPlaying.tsx`
- `app/api/now-playing/route.ts`
- `app/docente/components/TeacherNav.tsx`
- `app/docente/classe/page.tsx`
- `app/docente/classe/gestione/page.tsx`
- `app/docente/mappa/page.tsx`
- `app/docente/indovina/page.tsx`
- `middleware.ts`

Non modificare variabili Vercel, Supabase o `tsconfig.json`.

## Nota
Il player usa i link YouTube già presenti nel database. L'autoplay con audio può essere bloccato dalle impostazioni del browser: in quel caso basta premere **Ascolta**. Questo è un comportamento normale dei browser moderni.
