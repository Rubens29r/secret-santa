# 🚀 Guide de Déploiement - Secret Santa

Ce guide vous accompagne pas à pas pour mettre votre Secret Santa en ligne gratuitement.

## 📋 Table des matières

1. [Version Simple (sans Firebase)](#version-simple)
2. [Version Firebase (recommandée)](#version-firebase)
3. [Alternatives gratuites](#alternatives)
4. [Dépannage](#dépannage)

---

## Version Simple (sans Firebase)

### Option 1 : GitHub Pages (Gratuit, 5 minutes)

**Avantages :**
- ✅ 100% gratuit
- ✅ Très simple
- ✅ HTTPS automatique
- ✅ Aucune configuration

**Étapes :**

1. **Créer un compte GitHub** (si vous n'en avez pas)
   - Aller sur [github.com](https://github.com)
   - S'inscrire gratuitement

2. **Créer un nouveau repository**
   - Cliquer sur le bouton "New" (vert)
   - Nom : `secret-santa`
   - Cocher "Public"
   - Cliquer sur "Create repository"

3. **Uploader vos fichiers**
   - Cliquer sur "uploading an existing file"
   - Glisser-déposer tous les fichiers :
     - `index.html`
     - `style.css`
     - `app.js`
     - `README.md`
   - Cliquer sur "Commit changes"

4. **Activer GitHub Pages**
   - Aller dans Settings (roue crantée)
   - Dans le menu latéral : "Pages"
   - Source : "Deploy from a branch"
   - Branch : "main" + folder "/ (root)"
   - Cliquer sur "Save"

5. **Récupérer votre URL**
   - Attendre 2-3 minutes
   - Votre site est disponible sur :
     ```
     https://VOTRE-USERNAME.github.io/secret-santa/
     ```

**C'est tout ! 🎉**

---

### Option 2 : Netlify Drop (Gratuit, 1 minute)

**Le plus rapide de tous !**

1. Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glisser-déposer le dossier `secret-santa` complet
3. Votre site est en ligne immédiatement !
4. URL générée automatiquement : `https://random-name-123.netlify.app`

**Personnaliser l'URL (optionnel) :**
- Créer un compte Netlify (gratuit)
- Site settings → Change site name
- Exemple : `mon-secret-santa.netlify.app`

---

## Version Firebase (recommandée pour production)

### Pourquoi Firebase ?

- ✅ Base de données temps réel (Firestore)
- ✅ Synchronisation automatique entre tous les participants
- ✅ Authentification anonyme sécurisée
- ✅ 100% gratuit jusqu'à 50k lectures/jour (largement suffisant)
- ✅ Règles de sécurité robustes

### Prérequis

- Node.js installé ([nodejs.org](https://nodejs.org))
- Un compte Google

### Étape 1 : Créer un projet Firebase

1. **Aller sur la console Firebase**
   - [console.firebase.google.com](https://console.firebase.google.com)
   - Se connecter avec votre compte Google

2. **Créer un nouveau projet**
   - Cliquer sur "Ajouter un projet"
   - Nom : "Secret Santa" (ou ce que vous voulez)
   - Désactiver Google Analytics (pas nécessaire)
   - Cliquer sur "Créer le projet"

3. **Attendre la création** (30 secondes)

### Étape 2 : Configurer Firestore

1. Dans le menu latéral : **"Firestore Database"**
2. Cliquer sur **"Créer une base de données"**
3. Sélectionner **"Commencer en mode test"**
4. Choisir une région (ex: `europe-west1` pour l'Europe)
5. Cliquer sur **"Activer"**

### Étape 3 : Activer l'Authentication

1. Dans le menu latéral : **"Authentication"**
2. Cliquer sur **"Commencer"**
3. Onglet **"Sign-in method"**
4. Cliquer sur **"Anonyme"**
5. Activer le bouton
6. Cliquer sur **"Enregistrer"**

### Étape 4 : Obtenir la configuration

1. Dans le menu latéral : **⚙️ Paramètres du projet**
2. Faire défiler jusqu'à **"Vos applications"**
3. Cliquer sur l'icône **Web** `</>`
4. Nom de l'app : "Secret Santa Web"
5. Cocher **"Configurer aussi Firebase Hosting"**
6. Cliquer sur **"Enregistrer l'application"**

7. **Copier le code de configuration** qui ressemble à :
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

### Étape 5 : Installer Firebase CLI

Ouvrir un terminal (PowerShell, CMD, ou Terminal Mac/Linux) :

```bash
npm install -g firebase-tools
```

Vérifier l'installation :
```bash
firebase --version
```

### Étape 6 : Se connecter à Firebase

```bash
firebase login
```

- Une page web s'ouvre
- Se connecter avec le même compte Google
- Autoriser l'accès

### Étape 7 : Initialiser le projet

Dans le dossier `secret-santa` :

```bash
cd chemin/vers/secret-santa
firebase init
```

**Répondre aux questions :**

```
? Which Firebase features do you want to set up?
→ Cocher : Firestore, Hosting (avec espace)
→ Appuyer sur Entrée

? Select a default Firebase project
→ Sélectionner votre projet "Secret Santa"

? What file should be used for Firestore Rules?
→ Appuyer sur Entrée (firestore.rules)

? What file should be used for Firestore indexes?
→ Appuyer sur Entrée (firestore.indexes.json)

? What do you want to use as your public directory?
→ Taper : .
→ (point = dossier actuel)

? Configure as a single-page app?
→ Taper : y (oui)

? Set up automatic builds and deploys with GitHub?
→ Taper : n (non)

? File ./index.html already exists. Overwrite?
→ Taper : n (NON ! Important)
```

### Étape 8 : Modifier app.js pour Firebase

**Option A : Version complète Firestore (recommandé)**

Créez un nouveau fichier `app-firebase.js` avec le code fourni séparément.

**Option B : Garde la version localStorage (temporaire)**

Pour tester immédiatement, gardez `app.js` tel quel.

### Étape 9 : Ajouter la configuration Firebase

Dans `index.html`, avant la ligne `<script src="app.js"></script>`, ajoutez :

```html
<script>
  const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
  };
  
  firebase.initializeApp(firebaseConfig);
</script>
```

### Étape 10 : Déployer ! 🚀

```bash
firebase deploy
```

**Résultat :**
```
✔  Deploy complete!

Hosting URL: https://votre-projet.web.app
```

**Félicitations ! Votre Secret Santa est en ligne ! 🎉**

---

## Alternatives gratuites

### Vercel (Simple et puissant)

1. Installer Vercel CLI :
   ```bash
   npm i -g vercel
   ```

2. Dans le dossier du projet :
   ```bash
   vercel
   ```

3. Suivre les instructions
4. URL générée automatiquement

### Cloudflare Pages (Ultra rapide)

1. Créer un compte sur [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connecter votre repo GitHub
3. Deploy automatique à chaque push
4. CDN mondial inclus

---

## 🎯 Tableau comparatif

| Solution | Gratuit | Facile | Temps réel | Base de données |
|----------|---------|--------|------------|-----------------|
| GitHub Pages | ✅ | ⭐⭐⭐ | ❌ | ❌ |
| Netlify | ✅ | ⭐⭐⭐ | ❌ | ❌ |
| **Firebase** | ✅ | ⭐⭐ | ✅ | ✅ |
| Vercel | ✅ | ⭐⭐⭐ | ❌ | ❌ |
| Cloudflare | ✅ | ⭐⭐ | ⚠️ | ⚠️ |

**Recommandation :**
- 🏠 **Usage familial simple** → GitHub Pages ou Netlify
- 🎄 **Secret Santa complet** → Firebase (temps réel)
- ⚡ **Performance maximale** → Cloudflare Pages

---

## Dépannage

### "Command not found: firebase"

**Problème :** Firebase CLI n'est pas installé correctement

**Solution :**
```bash
npm install -g firebase-tools
# ou avec sudo sur Mac/Linux
sudo npm install -g firebase-tools
```

### "Permission denied"

**Problème :** Droits d'administration requis

**Solution :**
- Windows : Lancer PowerShell en tant qu'administrateur
- Mac/Linux : Ajouter `sudo` devant la commande

### "Firebase CLI not found in PATH"

**Problème :** npm global n'est pas dans le PATH

**Solution :**
Ajouter au PATH :
- Windows : `C:\Users\VOTRE_NOM\AppData\Roaming\npm`
- Mac/Linux : `~/.npm-global/bin`

### Déploiement bloqué

**Problème :** Le déploiement ne se termine pas

**Solution :**
1. Vérifier votre connexion internet
2. Essayer : `firebase deploy --debug`
3. Vérifier les logs pour l'erreur exacte

### "Error: Cannot find module 'firebase'"

**Problème :** Mauvaise version des scripts

**Solution :**
Vérifiez que vous utilisez bien les CDN dans `index.html` :
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
```

---

## 📝 Checklist finale

Avant de partager avec vos invités :

- [ ] Le site est accessible publiquement
- [ ] Vous pouvez créer une room
- [ ] Vous pouvez ajouter des participants
- [ ] Le tirage fonctionne correctement
- [ ] Les participants peuvent révéler leur destinataire
- [ ] Le design s'affiche correctement sur mobile
- [ ] Vous avez testé en navigation privée

---

## 🆘 Besoin d'aide ?

1. **Consultez les logs**
   ```bash
   firebase deploy --debug
   ```

2. **Vérifiez la console du navigateur**
   - Ouvrir les DevTools (F12)
   - Onglet Console
   - Chercher les erreurs en rouge

3. **Documentation officielle**
   - Firebase : [firebase.google.com/docs](https://firebase.google.com/docs)
   - GitHub Pages : [pages.github.com](https://pages.github.com)

---

**Bon déploiement ! 🚀🎁**
