# La colonna sonora della classe — V3

Versione collegata al database Supabase definitivo.

## Funzioni V3
- Home pubblica.
- Accesso dello studente tramite **codice personale**.
- Verifica del codice contro la tabella `studenti`.
- Visualizzazione del nome/classe associati al codice.
- Inserimento di una sola canzone per studente, con controllo applicativo.
- Titolo, artista, link YouTube e motivazione.
- Validazione del link YouTube.
- Normalizzazione del titolo per la futura mappa delle connessioni.
- API della dashboard adattata alle tabelle `studenti` e `canzoni`.

## Database
- `studenti`
- `canzoni`
- `voti`

## Variabili d'ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

La `SUPABASE_SERVICE_ROLE_KEY` deve restare esclusivamente lato server e non va mai pubblicata su GitHub.

## Prossimi passi
1. Preparare l'importazione dell'elenco reale degli studenti e la generazione dei codici.
2. Inserire uno studente di prova e verificare il primo invio.
3. Sistemare autenticazione e protezione dell'area docente con Supabase Auth + RLS.
4. Costruire dashboard, statistiche, voti e mappa musicale in modo definitivo.
