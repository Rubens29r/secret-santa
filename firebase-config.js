// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDgtdGCkuqdrLuflTVbitJCWL2KF4f0WPE",
  authDomain: "secret-santa-app-4ef4e.firebaseapp.com",
  projectId: "secret-santa-app-4ef4e",
  storageBucket: "secret-santa-app-4ef4e.firebasestorage.app",
  messagingSenderId: "405260576073",
  appId: "1:405260576073:web:5f16f5e559e9949fd66698",
  measurementId: "G-D7R4P2S89Z"
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

// Export pour utilisation dans app.js
window.db = db;
window.auth = auth;