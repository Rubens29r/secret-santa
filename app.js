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
// GESTION DU STOCKAGE LOCAL (Simulation)
// ============================================

class LocalStorage {
    static saveRoom(roomCode, data) {
        const rooms = this.getAllRooms();
        rooms[roomCode] = {
            ...data,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('secretSantaRooms', JSON.stringify(rooms));
    }

    static getRoom(roomCode) {
        const rooms = this.getAllRooms();
        return rooms[roomCode] || null;
    }

    static getAllRooms() {
        const data = localStorage.getItem('secretSantaRooms');
        return data ? JSON.parse(data) : {};
    }

    static deleteRoom(roomCode) {
        const rooms = this.getAllRooms();
        delete rooms[roomCode];
        localStorage.setItem('secretSantaRooms', JSON.stringify(rooms));
    }

    static saveUserSession(userId, userName, roomCode) {
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

function createRoom() {
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

    // Vérifier si la room existe déjà
    const existingRoom = LocalStorage.getRoom(roomCode);
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

    LocalStorage.saveRoom(roomCode, roomData);
    LocalStorage.saveUserSession(userId, 'Organisateur', roomCode);

    APP_STATE.currentRoom = roomCode;
    APP_STATE.currentUser = userId;
    APP_STATE.isOrganizer = true;
    APP_STATE.participants = [];

    showRoomManagement(roomCode);
    showNotification(`Partie "${roomCode}" créée avec succès !`);
}

function showRoomManagement(roomCode) {
    document.getElementById('currentRoomCode').textContent = roomCode;
    document.getElementById('roomManagement').style.display = 'block';
    
    // Générer et afficher le lien de partage
    const shareLink = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    document.getElementById('shareLink').value = shareLink;
    
    updateParticipantsList();
}

function addParticipant() {
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

    APP_STATE.participants.push(name);
    
    // Sauvegarder
    const roomData = LocalStorage.getRoom(APP_STATE.currentRoom);
    roomData.participants = APP_STATE.participants;
    LocalStorage.saveRoom(APP_STATE.currentRoom, roomData);

    nameInput.value = '';
    updateParticipantsList();
    showNotification(`${name} a été ajouté`);
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

function generateDraw() {
    if (APP_STATE.participants.length < 2) {
        showNotification('Il faut au moins 2 participants', 'error');
        return;
    }

    try {
        const assignments = generateSecretSanta(APP_STATE.participants);
        APP_STATE.assignments = assignments;
        
        // Sauvegarder
        const roomData = LocalStorage.getRoom(APP_STATE.currentRoom);
        roomData.assignments = assignments;
        LocalStorage.saveRoom(APP_STATE.currentRoom, roomData);

        showNotification('🎲 Tirage généré avec succès !');
    } catch (error) {
        showNotification(error.message, 'error');
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
        
        // Simuler une vérification périodique (en production, utiliser Firestore listeners)
        const checkInterval = setInterval(() => {
            const updatedRoom = LocalStorage.getRoom(APP_STATE.currentRoom);
            if (updatedRoom && updatedRoom.assignments[userName]) {
                clearInterval(checkInterval);
                hideElement('waitingArea');
                showElement('readyArea');
                
                document.getElementById('btnReveal').onclick = () => {
                    showResult(userName, updatedRoom.assignments[userName]);
                };
            }
        }, 2000);
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

function init() {
    // Vérifier si on arrive avec un code de room dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');

    if (roomCode) {
        // Mode participant
        const roomData = LocalStorage.getRoom(roomCode);
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
            const roomData = LocalStorage.getRoom(session.roomCode);
            if (roomData && roomData.ownerId === session.userId) {
                // Restaurer la session organisateur
                APP_STATE.currentRoom = session.roomCode;
                APP_STATE.currentUser = session.userId;
                APP_STATE.isOrganizer = true;
                APP_STATE.participants = roomData.participants || [];
                APP_STATE.assignments = roomData.assignments || {};
                
                showSection('organizerSection');
                showRoomManagement(session.roomCode);
            } else {
                showSection('initialSection');
            }
        } else {
            showSection('initialSection');
        }
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
