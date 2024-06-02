# Realtime Chat Application

Questo progetto è una semplice applicazione di chat in tempo reale utilizzando Firebase Realtime Database.

## Funzionalità

- Trova automaticamente un utente con cui chattare
- Notifica quando un utente si è connesso o disconnesso
- Chiude automaticamente la chat dopo 5 minuti di inattività
- Ricarica la pagina con un parametro per iniziare una nuova chat

## Configurazione

### Prerequisiti

- Un account Firebase
- Un progetto Firebase configurato con Realtime Database

### Installazione

1. Clona questo repository

    ```bash
    git clone https://github.com/tuo-username/nome-del-progetto.git
    cd nome-del-progetto
    ```

2. Configura Firebase

    Vai alla console di Firebase, crea un nuovo progetto e aggiungi una nuova app web. Copia la configurazione di Firebase e sostituisci la configurazione nel file `index.html`.

    ```javascript
    const firebaseConfig = {
        databaseURL: "https://ttstranger-6da0c-default-rtdb.europe-west1.firebasedatabase.app"
    };
    ```

3. Aggiungi le dipendenze di Firebase nel tuo `index.html`.

    ```html
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getDatabase, ref, push, onChildAdded, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
        ...
    </script>
    ```

## Utilizzo

1. Apri `index.html` nel tuo browser.
2. Clicca sul pulsante "Trova Chat".
3. Attendi che un altro utente si connetta.
4. Inizia a chattare!

## Dettagli del Codice

### Funzioni Principali

- `encodeHTML(html)`: Codifica HTML per prevenire attacchi XSS.
- `getCurrentTime()`: Ottiene l'ora corrente formattata.
- `toggleTextarea(textareaId, status)`: Abilita o disabilita una textarea.
- `toggleButton(buttonId, status)`: Abilita o disabilita un pulsante.
- `generaStringaCasuale()`: Genera una stringa casuale.
- `mostraMessaggioAlertChat(text)`: Mostra un messaggio di alert nella chat.
- `reloadWithParameter(param, value)`: Ricarica la pagina con un parametro aggiuntivo.
- `checkParameter(param)`: Controlla se un parametro è presente nell'URL.
- `inviaMessaggio(ref, message)`: Invia un messaggio.
- `trovaChatConPartecipantiUno()`: Trova una chat con un partecipante.
- `avviaChat(chatId)`: Avvia la chat.
- `resetInactivityTimeout(chatId)`: Resetta il timeout di inattività.
- `chiudiChatPerInattivita(chatId)`: Chiude la chat per inattività.
- `inserisciNuovaChatNelDatabase(idChat)`: Inserisce una nuova chat nel database.

### Event Listeners

- `window.onload`: Eseguita al caricamento della pagina.
- `window.onbeforeunload`: Eseguita prima di chiudere la finestra.
- `trovaChatButton.addEventListener('click', ...)`: Gestisce i click sul pulsante trova chat.

## Licenza

Questo progetto è concesso in licenza con i termini della licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli.