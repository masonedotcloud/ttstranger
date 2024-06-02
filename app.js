import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Funzione per codificare HTML per prevenire attacchi XSS
function encodeHTML(html) {
    return document.createElement('div').appendChild(document.createTextNode(html)).parentNode.innerHTML;
}

// Funzione per ottenere l'ora corrente formattata
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Funzione per abilitare o disabilitare una textarea
function toggleTextarea(textareaId, status) {
    const textarea = document.getElementById(textareaId);
    textarea.disabled = status;
}

// Funzione per abilitare o disabilitare un pulsante
function toggleButton(buttonId, status) {
    const button = document.getElementById(buttonId);
    button.disabled = status;
}

// Funzione per generare una stringa casuale
function generaStringaCasuale() {
    return Math.random().toString(36).substring(2);
}

// Funzione per mostrare un messaggio di alert nella chat
function mostraMessaggioAlertChat(text) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML += `<div class="alert-yellow">${text}</div>`;
}

// Funzione per ricaricare la pagina con un parametro aggiuntivo
function reloadWithParameter(param, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.location.href = url.toString();
}

// Funzione per controllare se un parametro è presente nell'URL
function checkParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(param);
}

// Funzione per inviare un messaggio
function inviaMessaggio(ref, message) {
    if (message !== '') {
        const messageData = {
            sender: currentUser,
            text: message
        };
        push(ref, messageData);
        if (clickCount === 2) {
            clickCount--;
        }
        messageInput.value = '';
    }
}

// Configurazione Firebase
const firebaseConfig = {
    databaseURL: "https://ttstranger-6da0c-default-rtdb.europe-west1.firebasedatabase.app"
};

// Inizializzazione Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const chatRef = ref(database, '/');

let currentChatId = null; // ID della chat corrente
let clickCount = 0; // Contatore dei click sul pulsante trova chat
let currentUser = generaStringaCasuale(); // ID utente corrente
let inactivityTimeout = null; // Timeout per inattività

// ID degli elementi del DOM
let IDbuttonNewChat = "trovaChatButton";
let IDInputMessage = "messageInput";
let IDChat = "chatMessages";
let IDSendButton = "sendMessageButton";

const trovaChatButton = document.getElementById(IDbuttonNewChat);

// Funzione per trovare una chat con un partecipante
function trovaChatConPartecipantiUno() {
    get(chatRef).then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            let chatTrovata = false;
            // Itera sulle chat esistenti per trovare una chat con un partecipante
            Object.keys(data).some(chatId => {
                const partecipanti = data[chatId].partecipanti;
                if (partecipanti === 1 && !chatTrovata) {
                    mostraMessaggioAlertChat("In attesa di un utente...");
                    const chatRef = ref(database, `/${chatId}/partecipanti`);
                    set(chatRef, 2);
                    chatTrovata = true;
                    currentChatId = chatId;
                    return true;
                }
            });

            if (chatTrovata) {
                const partecipantiRef = ref(database, `/${currentChatId}/partecipanti`);
                // Aggiungi listener per aggiornamenti sui partecipanti
                onValue(partecipantiRef, (snapshot) => {
                    const partecipanti = snapshot.val();
                    if (partecipanti === 2) {
                        mostraMessaggioAlertChat("Utente trovato");
                        trovaChatButton.textContent = 'Nuova chat';
                        toggleTextarea(IDInputMessage, false);
                        toggleButton(IDbuttonNewChat, false);
                        avviaChat(currentChatId);
                    } else if (partecipanti === 0) {
                        mostraMessaggioAlertChat("Utente disconnesso");
                        trovaChatButton.textContent = 'Nuova chat';
                        clickCount = 2;
                        toggleTextarea(IDInputMessage, true);
                    }
                });
            } else if (!Object.values(data).some(room => room.partecipanti === 1)) {
                // Se non ci sono chat con un partecipante, crea una nuova chat
                const idChatDaInserire = generaStringaCasuale();
                chatTrovata = true;
                currentChatId = idChatDaInserire;
                avviaChat(currentChatId);
                inserisciNuovaChatNelDatabase(idChatDaInserire);
            }
        } else {
            // Se non ci sono chat nel database, crea una nuova chat
            const idChatDaInserire = generaStringaCasuale();
            inserisciNuovaChatNelDatabase(idChatDaInserire);
        }
    }).catch((error) => {
        console.error("Errore durante il recupero dei dati dal database:", error);
    });
}

// Funzione per avviare la chat
function avviaChat(chatId) {
    const chatRef = ref(database, `/${chatId}/messages`);

    // Listener per nuovi messaggi
    onChildAdded(chatRef, (snapshot) => {
        const messageData = snapshot.val();
        const chatMessages = document.getElementById(IDChat);
        const messageClass = messageData.sender === currentUser ? 'sent' : 'received';
        const messageText = messageData.text;
        chatMessages.innerHTML += `<div class="message ${messageClass}">${encodeHTML(messageText)} <span class="timestamp">${getCurrentTime()}</span></div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        resetInactivityTimeout(chatId); // Resetta il timeout di inattività quando viene ricevuto un nuovo messaggio
    });

    const messageInput = document.getElementById(IDInputMessage);
    messageInput.addEventListener('keydown', handleKeyPress);
    messageInput.addEventListener('keypress', handleKeyPress);

    const sendMessageButton = document.getElementById(IDSendButton);
    sendMessageButton.addEventListener('click', () => {
        inviaMessaggio(chatRef, messageInput.value.trim());
    });

    // Funzione per gestire la pressione dei tasti
    function handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            inviaMessaggio(chatRef, messageInput.value.trim());
        }
    }

    resetInactivityTimeout(chatId);
}

// Funzione per resettare il timeout di inattività
function resetInactivityTimeout(chatId) {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        chiudiChatPerInattivita(chatId);
    }, 300000);
}

// Funzione per chiudere la chat per inattività
function chiudiChatPerInattivita(chatId) {
    mostraMessaggioAlertChat("Chat chiusa per inattività.");
    const partecipantiRef = ref(database, `/${chatId}/partecipanti`);
    set(partecipantiRef, 0);
    toggleTextarea(IDInputMessage, true);
    trovaChatButton.textContent = 'Nuova chat';
    clickCount = 2;
}

// Funzione per inserire una nuova chat nel database
function inserisciNuovaChatNelDatabase(idChat) {
    const chatPath = `/${idChat}`;
    const chatData = { partecipanti: 1 };
    set(ref(database, chatPath), chatData);

    mostraMessaggioAlertChat("In attesa di un utente...");

    const partecipantiRef = ref(database, `/${idChat}/partecipanti`);
    // Listener per aggiornamenti sui partecipanti
    onValue(partecipantiRef, (snapshot) => {
        const partecipanti = snapshot.val();
        if (partecipanti === 2) {
            mostraMessaggioAlertChat("Utente trovato");
            trovaChatButton.textContent = 'Nuova chat';
            toggleTextarea(IDInputMessage, false);
            toggleButton(IDbuttonNewChat, false);
        } else if (partecipanti === 0) {
            mostraMessaggioAlertChat("Utente disconnesso");
            trovaChatButton.textContent = 'Nuova chat';
            clickCount = 3;
            toggleTextarea(IDInputMessage, true);
        }
    });
}

// Event listener per il pulsante trova chat
trovaChatButton.addEventListener('click', function() {
    clickCount++;

    if (clickCount >= 3) {
        reloadWithParameter('new-chat', 'true');
    } else if (clickCount === 2) {
        trovaChatButton.textContent = 'Sei sicuro?';
    } else {
        trovaChatConPartecipantiUno();
        toggleButton(IDbuttonNewChat, true);
    }
});

// Funzione eseguita prima di chiudere la finestra
window.onbeforeunload = function () {
    if (currentChatId) {
        const chatRef = ref(database, `/${currentChatId}/partecipanti`);
        set(chatRef, 0);
    }
};

// Funzione eseguita al caricamento della pagina
window.onload = function() {
    if (checkParameter('new-chat')) {
        clickCount++;
        trovaChatConPartecipantiUno();
        toggleButton(IDbuttonNewChat, true);
    }
};
