// ============================================
// CONFIGURATION FIREBASE - TEMPLATE
// ============================================
// 
// Pour utiliser Firebase au lieu du LocalStorage :
// 
// 1. Créez un projet sur https://console.firebase.google.com
// 2. Activez Firestore Database
// 3. Activez Authentication (mode anonyme)
// 4. Copiez votre configuration ici
// 5. Décommentez le code ci-dessous
// 6. Modifiez app.js pour utiliser Firebase au lieu de LocalStorage
//

/*
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Se connecter anonymement
auth.signInAnonymously()
  .then(() => {
    console.log('✅ Connecté à Firebase');
  })
  .catch((error) => {
    console.error('❌ Erreur Firebase:', error);
  });
*/

// ============================================
// EXEMPLE D'UTILISATION AVEC FIRESTORE
// ============================================

// Créer une room
/*
async function createRoom(roomCode, ownerId) {
  await db.collection('rooms').doc(roomCode).set({
    ownerId: ownerId,
    participants: [],
    assignments: {},
    locked: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}
*/

// Ajouter un participant
/*
async function addParticipant(roomCode, name) {
  await db.collection('rooms').doc(roomCode).update({
    participants: firebase.firestore.FieldValue.arrayUnion(name)
  });
}
*/

// Sauvegarder les assignations
/*
async function saveAssignments(roomCode, assignments) {
  const batch = db.batch();
  
  for (const [giver, receiver] of Object.entries(assignments)) {
    const assignmentRef = db.collection('rooms')
      .doc(roomCode)
      .collection('assignments')
      .doc(giver); // Utiliser un ID unique en production
    
    batch.set(assignmentRef, {
      giverName: giver,
      receiverName: receiver,
      revealed: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  
  await batch.commit();
}
*/

// Écouter les changements en temps réel
/*
function listenToAssignment(roomCode, userId, callback) {
  db.collection('rooms')
    .doc(roomCode)
    .collection('assignments')
    .doc(userId)
    .onSnapshot((doc) => {
      if (doc.exists) {
        callback(doc.data());
      }
    });
}
*/

// ============================================
// DÉPLOIEMENT
// ============================================

/*
Étapes pour déployer :

1. Installer Firebase CLI :
   npm install -g firebase-tools

2. Se connecter :
   firebase login

3. Initialiser le projet :
   firebase init
   - Sélectionner : Hosting, Firestore
   - Public directory : . (point)
   - Single-page app : Yes
   - Automatic builds : No

4. Déployer :
   firebase deploy

5. Votre app sera disponible sur :
   https://votre-projet.web.app
*/
