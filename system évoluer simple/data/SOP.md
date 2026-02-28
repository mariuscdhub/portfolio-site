# SOP : Standard Operating Procedure - CalTracker

## 1. Vue d'ensemble du Projet

**CalTracker** est une application web monopage (SPA) optimisée pour le suivi nutritionnel des bodybuilders. Elle se distingue par sa gestion précise des états "Cru" vs "Cuit" et sa synchronisation Cloud en temps réel.

### Objectifs Clés
- **Zéro Friction :** Interface ultra-rapide, pensée pour le mobile ("Fat Finger friendly").
- **Fiabilité des Données :** Distinction stricte entre poids cru et cuit pour éviter les erreurs de calcul calorique.
- **Ubiquité :** Synchronisation instantanée entre mobile (saisie) et desktop (planification) via Firebase.

---

## 2. Architecture Technique

### Stack Technologique
- **Frontend :** HTML5 (Fichier unique), React 18 (via CDN), Tailwind CSS (via CDN), Babel Standalone.
- **Backend / Cloud :** Firebase (Auth, Firestore) configuré en mode Web.
- **Hébergement :** Tout serveur statique (GitHub Pages, Vercel, ou simple hébergement de fichier).

### Structure des Fichiers
Le projet tient dans un seul fichier principal pour une portabilité maximale :
- `index.html` : Contient tout le code (Structure HTML, Styles Tailwind, Logique React).

### Flux de Données (Data Flow)
Le système utilise un modèle hybride de données :
1.  **Données Statiques (Local) :** `INITIAL_FOODS`. Une base de données d'aliments courants codée en dur pour une performance instantanée (ex: Riz, Poulet). Ces données sont **immutables**.
2.  **Données Dynamiques (Cloud) :** Firestore.
    -   `users/{userId}/custom_foods` : Aliments créés par l'utilisateur.
    -   `users/{userId}/logs` : Historique des repas.
    -   `users/{userId}/recipes` : Recettes enregistrées.
    -   `users/{userId}/daily_summaries` : Résumés journaliers pour les statistiques.

---

## 3. Protocoles Opérationnels

### A. Initialisation & Authentification
1.  **Chargement :** L'application détecte la configuration Firebase.
2.  **Auth Check :**
    -   Si un utilisateur est connecté (`onAuthStateChanged`), l'application charge ses données Firestore.
    -   Sinon, la "Landing Page" est affichée avec options de Connexion/Inscription.
3.  **Mode Démo :** Si l'API Key est absente ou générique, l'application bascule automatiquement en "Mock Mode" utilisant le `localStorage` pour simuler le backend.

### B. Gestion des Aliments (Fridge Management)
-   **Ajout :** Tout nouvel aliment créé via l'onglet "Frigo" est envoyé à `custom_foods` dans Firestore.
-   **Suppression :**
    -   Les aliments Cloud (ID = string) peuvent être supprimés définitivement.
    -   Les aliments Statiques (ID = number) peuvent être masqués via une liste noire (`deletedFoodIds`) stockée dans le profil utilisateur.

### C. Calculs Nutritionnels (Core Logic)
-   **Formule Cru/Cuit :** L'application ne convertit pas les valeurs. Elle oblige l'utilisateur à choisir l'état.
    -   *Exemple :* 100g de Riz Cru = ~360 kcal. 100g de Riz Cuit = ~120 kcal.
    -   L'utilisateur sélectionne l'état correspondant à sa pesée.

### D. Synchronisation & Persistance
-   **Temps réel :** Des écouteurs (`onSnapshot`) sont actifs sur toutes les collections Firestore. Toute modification sur un appareil est immédiatement reflétée sur les autres.
-   **Mode Hors-ligne :** Firestore gère un cache local, mais la connectivité est recommandée pour la sauvegarde.

---

## 4. Maintenance & Développement

### Modification du Code
1.  Éditer directement `index.html`.
2.  Ne pas séparer le CSS ou le JS dans des fichiers externes pour maintenir la structure "Single File".
3.  Utiliser les classes utilitaires Tailwind pour tout le styling. Ne jamais écrire de CSS global sauf pour les animations complexes (`@keyframes`).

### Déploiement
-   Comme l'application est un fichier statique, le déploiement consiste simplement à uploader `index.html` sur le serveur.
-   **Script de Sync :** Utiliser `sync-to-github.ps1` (si configuré) pour pousser les changements vers le dépôt de versioning.

### Gestion des Erreurs
-   **Auth :** Si l'authentification échoue, vérifier la console pour les codes d'erreur Firebase (`auth/wrong-password`, etc.).
-   **Quotas Firestore :** L'application optimise les lectures, mais surveiller la console Firebase pour les limites de lecture en version gratuite.

---

## 5. Sécurité

-   **Règles Firestore :** Configurer les règles de sécurité Firestore pour que seul le propriétaire des données puisse les lire/écrire :
    ```
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    ```
-   **API Keys :** La clé API Firebase est publique dans le code client. Restreindre son usage aux domaines autorisés (localhost, votre-domaine.com) via la console Google Cloud.
