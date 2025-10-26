# 📸 Captures d'écran et Démo

## 🎨 Aperçu de l'interface

### Page d'accueil

Lorsqu'un utilisateur arrive sur l'application, il voit :

```
┌─────────────────────────────────────┐
│        🎁 Secret Santa              │
│  Organisez votre échange de         │
│     cadeaux en toute simplicité     │
├─────────────────────────────────────┤
│                                     │
│      Tu es ici pour :               │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 👑 Organiser un Secret Santa  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🎁 Participer à un Secret     │ │
│  │    Santa                      │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Interface Organisateur

```
┌─────────────────────────────────────┐
│    👑 Espace Organisateur           │
├─────────────────────────────────────┤
│  Créer une nouvelle partie          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Code (ex: NOEL2024)         │   │
│  └─────────────────────────────┘   │
│  [Créer la partie]                  │
├─────────────────────────────────────┤
│  Gestion de la partie : NOEL2024    │
│                                     │
│  Participants                       │
│  ┌──────────────┬────────────┐     │
│  │ Prénom       │ [Ajouter]  │     │
│  └──────────────┴────────────┘     │
│                                     │
│  • Marie         [Retirer]          │
│  • Pierre        [Retirer]          │
│  • Sophie        [Retirer]          │
│  • Thomas        [Retirer]          │
│                                     │
│  [🎲 Générer le tirage]             │
│  [🔒 Verrouiller]                   │
│  [👁️ Voir tous les résultats]      │
│                                     │
│  Partager avec les participants     │
│  ┌──────────────────────────────┐  │
│  │ https://...?room=NOEL2024    │  │
│  └──────────────────────────────┘  │
│  [📋 Copier]                        │
└─────────────────────────────────────┘
```

### Interface Participant

**Avant connexion :**
```
┌─────────────────────────────────────┐
│        👤 Participant               │
├─────────────────────────────────────┤
│  Entre ton prénom pour découvrir    │
│  à qui tu dois offrir un cadeau :   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Ton prénom                  │   │
│  └─────────────────────────────┘   │
│  [Continuer]                        │
└─────────────────────────────────────┘
```

**En attente du tirage :**
```
┌─────────────────────────────────────┐
│        ⏳ Presque prêt !            │
├─────────────────────────────────────┤
│  L'organisateur prépare le tirage..│
│                                     │
│  Tu seras notifié dès que ce sera   │
│  prêt !                             │
└─────────────────────────────────────┘
```

**Prêt à révéler :**
```
┌─────────────────────────────────────┐
│        🎉 C'est prêt !              │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │  🎁 Découvrir mon           │   │
│  │     destinataire            │   │
│  └─────────────────────────────┘   │
│         (bouton animé)              │
└─────────────────────────────────────┘
```

**Résultat révélé :**
```
┌─────────────────────────────────────┐
│  ╔═══════════════════════════════╗ │
│  ║                               ║ │
│  ║  🎯 Tu offres un cadeau à :   ║ │
│  ║                               ║ │
│  ║         MARIE                 ║ │
│  ║                               ║ │
│  ║   Garde le secret ! 🤫        ║ │
│  ║                               ║ │
│  ╚═══════════════════════════════╝ │
└─────────────────────────────────────┘
        (fond dégradé violet)
```

### Modal des résultats (Organisateur)

```
┌─────────────────────────────────────┐
│  📋 Tous les résultats          [×] │
├─────────────────────────────────────┤
│                                     │
│  Marie offre à        → Thomas      │
│  ──────────────────────────────────│
│                                     │
│  Pierre offre à       → Sophie      │
│  ──────────────────────────────────│
│                                     │
│  Sophie offre à       → Marie       │
│  ──────────────────────────────────│
│                                     │
│  Thomas offre à       → Pierre      │
│  ──────────────────────────────────│
│                                     │
└─────────────────────────────────────┘
```

## 🎨 Palette de couleurs

```css
Couleurs principales :
├── Primary   : #667eea (Bleu-violet)
├── Secondary : #764ba2 (Violet foncé)
├── Success   : #4caf50 (Vert)
├── Danger    : #f44336 (Rouge)
├── Warning   : #ff9800 (Orange)
└── Background: Dégradé violet (#667eea → #764ba2)
```

## ✨ Animations

### Bouton "Découvrir" (effet pulse)
```
🎁 Découvrir mon destinataire
   ↓ scale(1) → scale(1.05) → scale(1)
   ↓ Répète toutes les 2 secondes
```

### Apparition des cartes
```
Cards :
  Opacity: 0 → 1
  Position: translateY(30px) → translateY(0)
  Duration: 0.5s
```

### Résultat révélé
```
Nom du destinataire :
  Opacity: 0 → 1
  Scale: 0.3 → 1.05 → 0.9 → 1
  Duration: 0.6s (bounce)
```

## 📱 Responsive Design

### Desktop (> 768px)
- Largeur max : 800px
- Cartes spacieuses
- Boutons en ligne

### Mobile (< 768px)
- Pleine largeur
- Boutons empilés
- Texte adapté
- Touch-friendly

## 🎭 États visuels

### Boutons
```
Normal    : Couleur primaire, ombre légère
Hover     : Couleur plus foncée, monte de 2px
Active    : Enfoncé
Disabled  : Gris, curseur "not-allowed"
```

### Inputs
```
Normal : Bordure grise
Focus  : Bordure bleue, halo lumineux
Error  : Bordure rouge, texte d'erreur
```

### Notifications
```
Success : Bordure verte à gauche
Error   : Bordure rouge à gauche
Apparition : Slide depuis la droite
Disparition : Après 3 secondes
```

## 🎬 Flux utilisateur complet

```
┌──────────────┐
│  Arrivée     │
│  sur le site │
└──────┬───────┘
       │
       ├─────────────┬─────────────┐
       │             │             │
   Organiser    Participer    URL avec
       │             │         ?room=
       │             │             │
       ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Créer    │  │ Rejoindre│  │ Auto-    │
│ partie   │  │ partie   │  │ detect   │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     ▼             └─────┬───────┘
┌──────────┐            │
│ Ajouter  │            ▼
│ noms     │      ┌──────────┐
└────┬─────┘      │ Entrer   │
     │            │ prénom   │
     ▼            └────┬─────┘
┌──────────┐          │
│ Générer  │          ▼
│ tirage   │    ┌──────────┐
└────┬─────┘    │ Attendre │
     │          │ ou       │
     │          │ Révéler  │
     │          └────┬─────┘
     │               │
     ▼               ▼
┌──────────┐  ┌──────────┐
│ Voir     │  │ Voir son │
│ résultats│  │ destinat.│
└──────────┘  └──────────┘
```

## 🎯 Points clés du design

1. **Minimaliste** : Pas de surcharge visuelle
2. **Coloré** : Dégradés violets festifs
3. **Animations douces** : Feedback visuel agréable
4. **Mobile-first** : Fonctionne parfaitement sur smartphone
5. **Accessibilité** : Contrastes respectés, textes lisibles

## 💫 Easter eggs & détails

- Émojis contextuels partout
- Ombres portées subtiles
- Coins arrondis pour la douceur
- Transitions fluides (0.3s)
- Effets au survol des boutons
- Bounce sur les notifications

---

**Pour voir l'application en action, ouvrez simplement `index.html` ! 🎁**
