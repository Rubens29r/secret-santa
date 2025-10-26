# 🎁 Secret Santa - Application Web

Application web complète pour organiser un Secret Santa anonyme et sécurisé.

## 🌟 Fonctionnalités

### Pour l'Organisateur
- ✅ Créer une partie avec un code personnalisé
- ✅ Ajouter/retirer des participants
- ✅ Générer le tirage automatiquement (algorithme garanti sans auto-attribution)
- ✅ Verrouiller la partie
- ✅ Voir tous les résultats
- ✅ Partager un lien unique

### Pour les Participants
- ✅ Rejoindre avec un simple prénom
- ✅ Découvrir son destinataire
- ✅ Interface intuitive et animée
- ✅ Confidentialité totale

## 🚀 Version Actuelle : Standalone (LocalStorage)

Cette version fonctionne **entièrement en local** sans base de données.

### ⚠️ Limitations de cette version
- Les données sont stockées dans le navigateur (localStorage)
- Une seule personne (l'organisateur) peut gérer la partie
- Les participants doivent recharger la page pour voir les mises à jour
- Les données sont perdues si le cache du navigateur est vidé

### ✅ Avantages
- **Fonctionne immédiatement** sans configuration
- Aucun serveur requis
- Parfait pour tester l'interface
- Gratuit à 100%

## 📦 Installation

### Option 1 : Ouvrir directement dans le navigateur

1. Téléchargez tous les fichiers dans un dossier
2. Ouvrez `index.html` dans votre navigateur
3. C'est prêt ! 🎉

### Option 2 : Serveur local avec VS Code

1. Installez l'extension "Live Server" dans VS Code
2. Clic droit sur `index.html` → "Open with Live Server"
3. L'application s'ouvre automatiquement

### Option 3 : Python Simple Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## 🎮 Mode d'emploi

### En tant qu'Organisateur

1. **Créer une partie**
   - Cliquez sur "Organiser un Secret Santa"
   - Entrez un code (ex: NOEL2024)
   - Cliquez sur "Créer la partie"

2. **Ajouter les participants**
   - Entrez les prénoms un par un
   - Cliquez sur "Ajouter"

3. **Générer le tirage**
   - Une fois tous les participants ajoutés
   - Cliquez sur "🎲 Générer le tirage"

4. **Partager le lien**
   - Copiez le lien affiché
   - Envoyez-le à vos participants

5. **Voir les résultats** (optionnel)
   - Cliquez sur "👁️ Voir tous les résultats"

### En tant que Participant

1. **Ouvrir le lien**
   - Cliquez sur le lien reçu

2. **Entrer votre prénom**
   - Tapez exactement le prénom enregistré par l'organisateur

3. **Découvrir votre destinataire**
   - Cliquez sur "🎁 Découvrir mon destinataire"

4. **Gardez le secret !** 🤫

## 🔧 Structure des fichiers

```
secret-santa/
├── index.html          # Interface principale
├── style.css           # Design et animations
├── app.js              # Logique JavaScript
└── README.md           # Ce fichier
```

## 🎨 Personnalisation

### Changer les couleurs

Dans `style.css`, modifiez les variables CSS :

```css
:root {
    --primary: #667eea;        /* Couleur principale */
    --secondary: #764ba2;      /* Couleur secondaire */
    --success: #4caf50;        /* Vert de succès */
    --danger: #f44336;         /* Rouge d'erreur */
}
```

### Modifier le titre

Dans `index.html`, ligne ~9 :

```html
<title>🎁 Secret Santa</title>
```

## 📊 Algorithme de Tirage

L'algorithme garantit que :
- ✅ Personne ne se tire soi-même
- ✅ Chaque personne offre à exactement une autre personne
- ✅ Chaque personne reçoit d'exactement une autre personne
- ✅ Tirage aléatoire et équitable

```javascript
// Simplifié
function generateSecretSanta(participants) {
    // Mélange aléatoire des destinataires
    let receivers = shuffle(participants);
    
    // S'assurer que personne ne se tire soi-même
    while (hasConflict(participants, receivers)) {
        receivers = shuffle(participants);
    }
    
    return createPairs(participants, receivers);
}
```

## 🚀 Migration vers Firebase (Production)

Pour une utilisation avec plusieurs personnes en temps réel, vous aurez besoin de Firebase.

### Étapes de migration

1. **Créer un projet Firebase**
   - Aller sur [console.firebase.google.com](https://console.firebase.google.com)
   - Créer un nouveau projet

2. **Activer Firestore**
   - Dans la console → Firestore Database
   - Créer en mode test

3. **Obtenir la configuration**
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     // ...
   };
   ```

4. **Remplacer LocalStorage par Firestore**
   - Dans `app.js`, remplacer les appels `LocalStorage.*`
   - Par des appels Firestore équivalents

5. **Déployer sur Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy
   ```

### Configuration Firebase (exemple)

```javascript
// À ajouter dans app.js après les imports Firebase

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-app.firebaseapp.com",
  projectId: "votre-app",
  storageBucket: "votre-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
```

## 🐛 Débogage

### Problème : Les participants ne voient pas le tirage

**Cause :** Version localStorage ne synchronise pas automatiquement

**Solution temporaire :** 
- Demandez aux participants de recharger la page (F5)
- Ou passez à la version Firebase pour le temps réel

### Problème : "Ce prénom n'est pas dans la liste"

**Cause :** Orthographe différente ou prénom non ajouté

**Solution :**
- Vérifiez l'orthographe exacte (majuscules/minuscules)
- Demandez à l'organisateur d'ajouter le prénom

### Problème : Les données disparaissent

**Cause :** Cache du navigateur vidé

**Solution :**
- Ne pas vider le cache pendant l'événement
- Ou migrer vers Firebase pour une persistance permanente

## 📱 Compatibilité

- ✅ Chrome / Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS / Android)

## 🔒 Sécurité

### Version actuelle (LocalStorage)
- ⚠️ Pas de véritable sécurité
- ⚠️ Les participants techniques peuvent voir les données dans le localStorage
- ✅ Suffisant pour un usage familial confiant

### Version Firebase (recommandée pour production)
- ✅ Règles de sécurité Firestore
- ✅ Authentication anonyme
- ✅ Chiffrement des données en transit
- ✅ Impossible de voir le destinataire des autres

## 💡 Astuces

1. **Codes mémorables** : Utilisez des codes faciles à retenir (NOEL2024, HIVER, FAMILLE...)

2. **Nombre de participants** : L'algorithme fonctionne avec 2+ participants (optimal : 4-20)

3. **Test avant l'événement** : Testez avec 3-4 prénoms fictifs avant le vrai tirage

4. **Backup** : Notez les résultats quelque part au cas où (version localStorage uniquement)

## 📄 Licence

MIT - Libre d'utilisation et de modification

## 🤝 Contribution

N'hésitez pas à améliorer le code, ajouter des fonctionnalités ou corriger des bugs !

## 📞 Support

Pour toute question, consultez la documentation complète dans le fichier `Secret-Santa-Guide-Complet.md`.

---

**Joyeux Secret Santa ! 🎁🎄**
