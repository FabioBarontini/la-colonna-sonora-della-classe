# WOW4 — Area docente multi-classe

Questa patch rende tutta l'area docente dipendente dalla **classe attiva**.

## Cosa cambia

- In alto, nella barra docente, compare il selettore **Classe attiva**.
- La classe scelta viene salvata nel browser e mantenuta passando tra Dashboard, Mappa, Playlist, Indovina e Gestione classe.
- La Dashboard mostra esclusivamente dati e brani della classe selezionata.
- La Mappa musicale usa esclusivamente gli studenti e i brani della classe selezionata.
- Il gioco Indovina usa esclusivamente i brani della classe selezionata.
- Playlist studenti mostra solo gli studenti della classe selezionata.
- Gestione classe mostra gli studenti della classe selezionata e permette di aggiungere studenti a una nuova classe digitandone il nome.
- La classe selezionata viene mantenuta anche tornando alla Dashboard.
- Viene aggiunta l'API per recuperare le classi disponibili e le API filtrate per classe.

## Installazione

Sostituire i file della patch nelle rispettive cartelle del progetto GitHub e fare commit su `main`.

Non modificare le variabili Vercel né la configurazione Supabase.

Non serve cambiare lo schema del database: viene utilizzato il campo `studenti.classe` già presente.

## Primo utilizzo

1. Entrare nell'area docente.
2. Scegliere una classe dal menu **Classe attiva**.
3. Da quel momento tutte le pagine lavoreranno su quella classe.
4. Per cambiare classe basta usare nuovamente il menu in alto.

Se non è ancora presente nessuna classe, entrare in **Gestione classe**, digitare il nome della nuova classe e aggiungere gli studenti.
