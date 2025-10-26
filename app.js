// ============================================
// SECRET SANTA - Application JavaScript
// ============================================

// État global de l'application
const APP_STATE = {
    currentUser: null,
    currentRoom: null,
    isOrganizer: false,
    participants: [],
    assignments: {}
};

// ============================================
// UTILITAIRES
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Algorithme de tirage Secret Santa (personne ne se tire elle-même)
function generateSecretSanta(participants) {
    if (participants.length < 2) {
        throw new Error('Il faut au moins 2 participants');
    }

    let givers = [...participants];
    let receivers = shuffleArray([...participants]);
    
    // S'assurer que personne ne se tire soi-même
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        let valid = true;
        for (let i = 0; i < givers.length; i++) {
            if (givers[i] === receivers[i]) {
                valid = false;
                break;
            }
        }
        
        if (valid) {
            const assignments = {};
            for (let i = 0; i < givers.length; i++) {
                assignments[givers[i]] = receivers[i];
            }
            return assignments;
        }
        
        receivers = shuffleArray([...participants]);
        attempts++;
    }
    
    throw new Error('Impossible de générer un tirage valide. Réessayez.');
}

// ============================================
// GESTION DU STOCKAGE FIRESTORE
// ============================================

class LocalStorage {
    static async saveRoom(roomCode, data) {
        try {
            await db.collection('rooms').doc(roomCode).set({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la room:', error);
            throw error;
        }
    }

    static async getRoom(roomCode) {
        try {
            const doc = await db.collection('rooms').doc(roomCode).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la room:', error);
            return null;
        }
    }

    static async getAllRooms() {
        try {
            const snapshot = await db.collection('rooms').get();
            const rooms = {};
            snapshot.forEach(doc => {
                rooms[doc.id] = doc.data();
            });
            return rooms;
        } catch (error) {
            console.error('Erreur lors de la récupération des rooms:', error);
            return {};
        }
    }

    static async deleteRoom(roomCode) {
        try {
            await db.collection('rooms').doc(roomCode).delete();
        } catch (error) {
            console.error('Erreur lors de la suppression de la room:', error);
            throw error;
        }
    }

    static saveUserSession(userId, userName, roomCode) {
        // On garde la session en local pour la persistance
        localStorage.setItem('secretSantaSession', JSON.stringify({
            userId,
            userName,
            roomCode,
            timestamp: new Date().toISOString()
        }));
    }

    static getUserSession() {
        const data = localStorage.getItem('secretSantaSession');
        return data ? JSON.parse(data) : null;
    }

    static clearUserSession() {
        localStorage.removeItem('secretSantaSession');
    }
}

// ============================================
// GESTION DE L'INTERFACE
// ============================================

function showSection(sectionId) {
    const sections = ['initialSection', 'organizerSection', 'participantSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.toggle('hidden', id !== sectionId);
        }
    });
}

function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// ============================================
// ORGANISATEUR - Fonctions
// ============================================

async function createRoom() {
    const roomCodeInput = document.getElementById('roomCode');
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        showNotification('Veuillez entrer un code de partie', 'error');
        return;
    }

    if (roomCode.length < 4) {
        showNotification('Le code doit contenir au moins 4 caractères', 'error');
        return;
    }

    try {
        // Vérifier si la room existe déjà
        const existingRoom = await LocalStorage.getRoom(roomCode);
        if (existingRoom) {
            showNotification('Ce code existe déjà. Choisissez-en un autre.', 'error');
            return;
        }

        // Créer la room
        const userId = generateId();
        const roomData = {
            ownerId: userId,
            participants: [],
            assignments: {},
            locked: false
        };

        await LocalStorage.saveRoom(roomCode, roomData);
        LocalStorage.saveUserSession(userId, 'Organisateur', roomCode);

        APP_STATE.currentRoom = roomCode;
        APP_STATE.currentUser = userId;
        APP_STATE.isOrganizer = true;
        APP_STATE.participants = [];

        showRoomManagement(roomCode);
        showNotification(`Partie "${roomCode}" créée avec succès !`);
    } catch (error) {
        console.error('Erreur lors de la création de la room:', error);
        showNotification('Une erreur est survenue lors de la création de la partie', 'error');
    }
}

function showRoomManagement(roomCode) {
    document.getElementById('currentRoomCode').textContent = roomCode;
    document.getElementById('roomManagement').style.display = 'block';
    
    // Générer et afficher le lien de partage
    const shareLink = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    document.getElementById('shareLink').value = shareLink;
    
    updateParticipantsList();
}

async function addParticipant() {
    const nameInput = document.getElementById('participantName');
    const name = nameInput.value.trim();
    
    if (!name) {
        showNotification('Veuillez entrer un prénom', 'error');
        return;
    }

    // Vérifier si le prénom existe déjà
    if (APP_STATE.participants.includes(name)) {
        showNotification('Ce prénom existe déjà', 'error');
        return;
    }

    try {
        APP_STATE.participants.push(name);
        
        // Sauvegarder
        const roomData = await LocalStorage.getRoom(APP_STATE.currentRoom);
        roomData.participants = APP_STATE.participants;
        await LocalStorage.saveRoom(APP_STATE.currentRoom, roomData);

        nameInput.value = '';
        updateParticipantsList();
        showNotification(`${name} a été ajouté`);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du participant:', error);
        showNotification('Une erreur est survenue lors de l\'ajout du participant', 'error');
        // Retirer le participant de l'état local en cas d'erreur
        APP_STATE.participants = APP_STATE.participants.filter(p => p !== name);
    }
}

function removeParticipant(name) {
    APP_STATE.participants = APP_STATE.participants.filter(p => p !== name);
    
    // Sauvegarder
    const roomData = LocalStorage.getRoom(APP_STATE.currentRoom);
    roomData.participants = APP_STATE.participants;
    LocalStorage.saveRoom(APP_STATE.currentRoom, roomData);

    updateParticipantsList();
    showNotification(`${name} a été retiré`);
}

function updateParticipantsList() {
    const list = document.getElementById('participantsList');
    
    if (APP_STATE.participants.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: #a0aec0;">Aucun participant pour le moment</li>';
        return;
    }

    list.innerHTML = APP_STATE.participants.map(name => `
        <li>
            <span>${name}</span>
            <button class="btn-remove" onclick="removeParticipant('${name}')">Retirer</button>
        </li>
    `).join('');
}

async function generateDraw() {
    if (APP_STATE.participants.length < 2) {
        showNotification('Il faut au moins 2 participants', 'error');
        return;
    }

    try {
        const assignments = generateSecretSanta(APP_STATE.participants);
        APP_STATE.assignments = assignments;
        
        // Sauvegarder
        const roomData = await LocalStorage.getRoom(APP_STATE.currentRoom);
        if (!roomData) {
            throw new Error('La partie n\'existe plus');
        }
        
        roomData.assignments = assignments;
        await LocalStorage.saveRoom(APP_STATE.currentRoom, roomData);

        showNotification('🎲 Tirage généré avec succès !');
    } catch (error) {
        console.error('Erreur lors de la génération du tirage:', error);
        showNotification(error.message || 'Une erreur est survenue lors du tirage', 'error');
    }
}

function lockRoom() {
    const roomData = LocalStorage.getRoom(APP_STATE.currentRoom);
    roomData.locked = true;
    LocalStorage.saveRoom(APP_STATE.currentRoom, roomData);
    
    showNotification('🔒 Partie verrouillée');
    document.getElementById('btnLock').disabled = true;
}

function viewAllResults() {
    if (Object.keys(APP_STATE.assignments).length === 0) {
        showNotification('Aucun tirage n\'a été généré', 'error');
        return;
    }

    const container = document.getElementById('allResultsContainer');
    container.innerHTML = Object.entries(APP_STATE.assignments)
        .map(([giver, receiver]) => `
            <div class="result-item">
                <span><strong>${giver}</strong> offre à</span>
                <span>${receiver}</span>
            </div>
        `).join('');

    document.getElementById('resultsModal').classList.remove('hidden');
}

function copyShareLink() {
    const linkInput = document.getElementById('shareLink');
    linkInput.select();
    document.execCommand('copy');
    showNotification('📋 Lien copié !');
}

// ============================================
// PARTICIPANT - Fonctions
// ============================================

function joinAsParticipant() {
    const nameInput = document.getElementById('userName');
    const name = nameInput.value.trim();
    
    if (!name) {
        showNotification('Veuillez entrer votre prénom', 'error');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    
    if (!roomCode) {
        showNotification('Code de partie manquant dans l\'URL', 'error');
        return;
    }

    const roomData = LocalStorage.getRoom(roomCode);
    if (!roomData) {
        showNotification('Cette partie n\'existe pas', 'error');
        return;
    }

    // Vérifier si le prénom existe dans la liste
    if (!roomData.participants.includes(name)) {
        showNotification('Ce prénom n\'est pas dans la liste des participants', 'error');
        return;
    }

    const userId = generateId();
    LocalStorage.saveUserSession(userId, name, roomCode);

    APP_STATE.currentUser = userId;
    APP_STATE.currentRoom = roomCode;
    APP_STATE.isOrganizer = false;

    hideElement('loginArea');
    checkAssignmentStatus(name, roomData);
}

function checkAssignmentStatus(userName, roomData) {
    const assignments = roomData.assignments || {};
    
    if (assignments[userName]) {
        // Tirage déjà effectué
        showElement('readyArea');
        
        document.getElementById('btnReveal').onclick = () => {
            showResult(userName, assignments[userName]);
        };
    } else {
        // En attente du tirage
        showElement('waitingArea');
        
        // Écouter les changements en temps réel avec Firestore
        const unsubscribe = db.collection('rooms').doc(APP_STATE.currentRoom)
            .onSnapshot((doc) => {
                const updatedRoom = doc.data();
                if (updatedRoom && updatedRoom.assignments[userName]) {
                    unsubscribe(); // Arrêter l'écoute une fois le tirage effectué
                    hideElement('waitingArea');
                    showElement('readyArea');
                    
                    document.getElementById('btnReveal').onclick = () => {
                        showResult(userName, updatedRoom.assignments[userName]);
                    };
                }
            }, (error) => {
                console.error('Erreur lors de l\'écoute des changements:', error);
                showNotification('Une erreur est survenue lors de la mise à jour', 'error');
            });
    }
}

function showResult(giver, receiver) {
    hideElement('readyArea');
    
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = `
        <div class="result-card">
            <h2>🎯 Tu offres un cadeau à :</h2>
            <h1 class="recipient-name">${receiver}</h1>
            <p class="hint">Garde le secret ! 🤫</p>
        </div>
    `;
    showElement('resultArea');
}

// ============================================
// INITIALISATION
// ============================================

async function init() {
    try {
        // Vérifier si on arrive avec un code de room dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const roomCode = urlParams.get('room');

        if (roomCode) {
            // Mode participant
            const roomData = await LocalStorage.getRoom(roomCode);
            if (roomData) {
                showSection('participantSection');
            } else {
                showNotification('Cette partie n\'existe pas', 'error');
                showSection('initialSection');
            }
        } else {
            // Vérifier s'il y a une session en cours
            const session = LocalStorage.getUserSession();
            if (session) {
                const roomData = await LocalStorage.getRoom(session.roomCode);
                if (roomData && roomData.ownerId === session.userId) {
                    // Restaurer la session organisateur
                    APP_STATE.currentRoom = session.roomCode;
                    APP_STATE.currentUser = session.userId;
                    APP_STATE.isOrganizer = true;
                    APP_STATE.participants = roomData.participants || [];
                    APP_STATE.assignments = roomData.assignments || {};
                    
                    showSection('organizerSection');
                    showRoomManagement(session.roomCode);

                    // Mettre en place l'écouteur pour les mises à jour en temps réel
                    db.collection('rooms').doc(session.roomCode)
                        .onSnapshot((doc) => {
                            const updatedData = doc.data();
                            if (updatedData) {
                                APP_STATE.participants = updatedData.participants || [];
                                APP_STATE.assignments = updatedData.assignments || {};
                                updateParticipantsList();
                            }
                        });
                } else {
                    showSection('initialSection');
                }
            } else {
                showSection('initialSection');
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showNotification('Une erreur est survenue lors du chargement', 'error');
        showSection('initialSection');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Boutons écran initial
    document.getElementById('btnOrganizer')?.addEventListener('click', () => {
        showSection('organizerSection');
    });

    document.getElementById('btnParticipant')?.addEventListener('click', () => {
        showSection('participantSection');
    });

    // Organisateur
    document.getElementById('btnCreateRoom')?.addEventListener('click', createRoom);
    document.getElementById('btnAddParticipant')?.addEventListener('click', addParticipant);
    document.getElementById('btnGenerate')?.addEventListener('click', generateDraw);
    document.getElementById('btnLock')?.addEventListener('click', lockRoom);
    document.getElementById('btnViewResults')?.addEventListener('click', viewAllResults);
    document.getElementById('btnCopyLink')?.addEventListener('click', copyShareLink);

    // Enter key sur les inputs
    document.getElementById('roomCode')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createRoom();
    });

    document.getElementById('participantName')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addParticipant();
    });

    document.getElementById('userName')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinAsParticipant();
    });

    // Participant
    document.getElementById('btnJoin')?.addEventListener('click', joinAsParticipant);

    // Modal
    document.querySelector('.close')?.addEventListener('click', () => {
        document.getElementById('resultsModal').classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('resultsModal');
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Initialiser l'app
    init();
});

// ============================================
// FONCTIONS GLOBALES (accessibles depuis HTML)
// ============================================
window.removeParticipant = removeParticipant;
