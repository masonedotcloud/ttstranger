# ttstranger

## Panoramica

`ttstranger` è un'applicazione web di chat semplice che consente agli utenti di connettersi con estranei in una chat room. L'applicazione è alimentata da Firebase per la comunicazione in tempo reale e offre un'interfaccia minimalista. Gli utenti possono avviare una chat, inviare e ricevere messaggi e anche essere abbinati con altri utenti casualmente. La chat si chiuderà automaticamente dopo un periodo di inattività.

## Funzionalità

- **Chat con estranei**: Gli utenti possono connettersi con persone a caso cliccando sul pulsante "Ricerca chat".
- **Messaggistica in tempo reale**: I messaggi vengono scambiati in tempo reale, con una semplice interfaccia per l'invio e la ricezione dei messaggi.
- **Timeout per inattività**: Se una chat rimane inattiva per 5 minuti, viene automaticamente chiusa.
- **Design reattivo**: L'applicazione si adatta alle dimensioni dello schermo di dispositivi desktop e mobili per un'esperienza fluida.
- **Integrazione Firebase**: Utilizza Firebase per la sincronizzazione in tempo reale del database dei messaggi e dello stato della chat.

## Stack Tecnologico

- **Frontend**: HTML, CSS (con un focus sul design reattivo), e JavaScript.
- **Backend**: Firebase Realtime Database per memorizzare i messaggi e tracciare lo stato della chat.
- **Libreria**: Firebase JS SDK (per le funzionalità del database in tempo reale).

## Struttura del Progetto

```
ttstranger/
│
├── index.html            # File HTML principale per l'interfaccia di chat
└── app.js                # File JavaScript per la funzionalità della chat e l'integrazione con Firebase
```

## Come Iniziare

Per eseguire `ttstranger` localmente:

### Prerequisiti

- Un browser web moderno (Chrome, Firefox, ecc.).
- Una connessione a Internet per utilizzare il database Firebase.

### Istruzioni

1. Clona questo repository:
    ```bash
    git clone https://github.com/masonedotcloud/ttstranger.git
    ```

2. Apri il file `index.html` nel tuo browser:
    ```bash
    open index.html
    ```

3. Interagisci con l'applicazione:
    - Clicca su "Ricerca chat" per iniziare a cercare una chat.
    - Se una chat viene trovata, potrai inviare e ricevere messaggi.
    - Se non ci sono chat disponibili, verrà creata una nuova chat per te.

4. L'applicazione mostrerà notifiche se un utente è disconnesso o se la chat viene chiusa per inattività.

## Configurazione di Firebase

1. Crea un progetto Firebase visitando [Firebase Console](https://console.firebase.google.com/).
2. Crea un database Realtime Database per il progetto.
3. Sostituisci l'oggetto `firebaseConfig` nel file `app.js` con la tua configurazione Firebase:

```javascript
const firebaseConfig = {
  apiKey: "tua-api-key",
  authDomain: "tuo-auth-domain",
  databaseURL: "https://tuo-database-name.firebaseio.com",
  projectId: "tuo-project-id",
  storageBucket: "tuo-storage-bucket",
  messagingSenderId: "tuo-sender-id",
  appId: "tuo-app-id"
};
```

4. Distribuisci il tuo progetto Firebase (se necessario) e il gioco è fatto!

## Funzioni e Flusso di Lavoro

### 1. **Trovare una Chat**
Quando un utente clicca sul pulsante "Ricerca chat", l'app verifica se esiste una chat con un solo partecipante. Se trovata, l'utente viene connesso a quella chat. Se non ci sono chat disponibili, ne viene creata una nuova.

### 2. **Invio e Ricezione di Messaggi**
Una volta in una chat, gli utenti possono inviare messaggi. Questi messaggi sono visibili immediatamente all'altro utente nella chat, grazie agli aggiornamenti in tempo reale di Firebase. I messaggi vengono visualizzati con un timestamp.

### 3. **Timeout per Inattività**
Se una chat rimane inattiva per più di 5 minuti, viene automaticamente chiusa. Viene mostrato un messaggio per informare l'utente che la chat è stata chiusa per inattività.

### 4. **Notifiche di Avviso**
L'app mostra messaggi come "In attesa di un utente..." quando si sta aspettando un altro utente, o "Utente trovato" quando un altro utente si unisce alla chat.

## Licenza

Questo progetto è distribuito sotto la Licenza MIT - vedi il file [LICENSE](LICENSE) per ulteriori dettagli.


## Autore

Questo progetto è stato creato da [alessandromasone](https://github.com/alessandromasone).
