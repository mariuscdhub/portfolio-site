# FUNCTIONAL_SPEC.md - Spécifications Fonctionnelles Détaillées

Ce document décrit en détail le fonctionnement de l'application **CalTracker**, écran par écran, fonctionnalité par fonctionnalité. Il sert de référence pour le développement et la validation (QA).

## 1. Landing Page & Authentification

### Landing Page (Visiteur)
-   **Objectif :** Présenter la proposition de valeur unique (Cru vs Cuit, Sync Cloud) et convertir le visiteur.
-   **Structure :**
    -   **Hero Section :** Titre accrocheur ("UNLOCK YOUR NUTRITION FLOW"), bouton CTA principal.
    -   **Problem Section :** 3 cartes expliquant les douleurs actuelles (erreurs de calcul, recettes complexes, perte de données).
    -   **Solution Section :** 4 cartes détaillant les fonctionnalités clés (Cru/Cuit, Recettes, Frigo, Cloud).
-   **Interaction :** Cliquer sur "Se connecter" ou "Commencer" ouvre la modale d'authentification.

### Authentification (AuthModal)
-   **Modes :** Connexion / Inscription (bascule via lien en bas de modale).
-   **Champs :** Email, Mot de passe (validation HTML5 standard).
-   **Logique :**
    -   Requête Firebase Auth (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).
    -   Gestion d'erreurs affichée en rouge sous les champs.
    -   Redirection automatique vers l'App (`setView('app')`) après succès.
    -   **Mode Démo :** Si aucune clé API n'est configurée, simule l'authentification dans le `localStorage`.

---

## 2. Application Principale (App)

Une fois connecté, l'utilisateur accède à l'interface principale divisée en 4 onglets via une barre de navigation fixe en bas.

### A. Onglet "Journal" (TrackerTab) - *Écran par défaut*
Le cœur de l'application. Permet de saisir ses aliments et suivre son total journalier.

#### 1. Carte Objectif (Goal Card)
-   **Affichage :**
    -   Grand compteur "Calories Restantes".
    -   Jauge de progression colorimétrique (Dégradé Emerald -> Orange -> Rouge si dépassement).
-   **Interaction :**
    -   Cliquer sur l'objectif (ex: 2500) pour l'éditer. L'input s'active avec focus automatique.
    -   Valider l'édition (Blur ou Enter) sauvegarde la nouvelle valeur dans Firestore (`users/{userId}/dailyGoal`).

#### 2. Zone de Saisie (Input Area)
-   **Sélecteur Cru/Cuit :** Switch à 2 états. Change la couleur d'accent (Vert pour Cru, Orange pour Cuit).
    -   *Impact :* Filtre la liste des aliments disponibles dans le sélecteur.
-   **Recherche :** Champ texte filtrant la liste déroulante en temps réel.
-   **Sélecteur d'Aliment :** Liste combinant les Aliments Statiques (`INITIAL_FOODS`) + Aliments Custom (`custom_foods` du Cloud).
-   **Calculateur :**
    -   Saisir le Poids (g) -> Calcule les Kcal automatiquement.
    -   Saisir les Kcal -> Calcule le Poids théorique automatiquement (règle de 3 basée sur la densité calorique de l'aliment sélectionné).

#### 3. Liste du Jour (Daily Log)
-   **Affichage :** Liste antéchronologique des entrées du jour.
-   **Groupe de Couleurs :** Bordure gauche verte (Cru) ou orange (Cuit) pour repérage rapide.
-   **Actions :**
    -   Bouton Poubelle : Supprime l'entrée du journal.
    -   Bouton "Créer recette" (si >1 aliment) : Prend tous les items du jour pour pré-remplir le formulaire de création de recette.

---

### B. Onglet "Frigo" (FridgeTab)
Gestion de la base de données personnelle de l'utilisateur.

#### 1. Liste des Aliments
-   **Contenu :** Affiche TOUS les aliments (Statiques + Custom).
-   **Recherche :** Filtre la liste.
-   **Interaction :**
    -   Bouton "Poubelle" sur un aliment :
        -   Si Custom (Cloud) : Supprime définitivement le document Firestore.
        -   Si Statique (Local) : Ajoute l'ID à la liste noire `deletedFoodIds` dans Firestore (masquage logique).

#### 2. Ajout d'Aliment (Formulaire)
-   **Champs :** Nom, Type (Cru/Cuit), Kcal/100g, Protéines/100g.
-   **Validation :** Alert si Nom vide ou Kcal <= 0.
-   **Action :** Crée un document dans la collection `custom_foods`. L'aliment devient immédiatement disponible dans le Tracker.

---

### C. Onglet "Recettes" (RecipesTab)
Créateur intelligent de repas composés.

#### 1. Liste des Recettes
-   **Affichage :** Carte simple avec Nom + Total Calories.
-   **Actions :**
    -   Clic : Ouvre le détail (Ingrédients).
    -   Edit (Crayon) : Ouvre l'éditeur avec pré-remplissage.
    -   Trash (Poubelle) : Déplace en corbeille temporaire (liste locale `deletedRecipes`).
    -   Corbeille : Permet de restaurer ou vider définitivement.

#### 2. Éditeur de Recette
-   **Concept :** Une recette est une liste d'ingrédients pondérés.
-   **Flux :**
    1.  Donner un nom.
    2.  Ajouter des ingrédients un par un (comme dans le Tracker).
    3.  L'application somme les calories/protéines de chaque ingrédient.
    4.  "Sauvegarder" : Calcule le total final et enregistre l'objet complexe dans Firestore.

---

### D. Onglet "Stats" (StatsTab)
Visualisation de la constance et des progrès.

-   **Streak (Série) :**
    -   Affiche la série actuelle de jours consécutifs où l'objectif calorique (90% min) a été atteint.
    -   Affiche le record personnel ("Longest Streak").
-   **Calendrier Mensuel :**
    -   Grille visuelle des jours du mois.
    -   Code couleur :
        -   Rouge : < 50% de l'objectif.
        -   Jaune : 50-90%.
        -   Vert (Succès) : 90-110%.
        -   Bleu (Surplus) : > 110%.
-   **Détail du Jour :** Cliquer sur une case jour ouvre une modale avec le résumé précis (Total vs Objectif).

---

## 3. Synchronisation Cloud & Données

### Modèle de Données Firestore
Toutes les données sont sous `users/{userId}/...` pour garantir l'isolation et la sécurité via les règles Firestore.

1.  **logs/ (Collection) :** Chaque entrée du journal est un document.
    -   `{ foodId, name, type, weight, calories, protein, timestamp }`
2.  **custom_foods/ (Collection) :** Aliments créés.
    -   `{ name, kcal, protein, type }`
3.  **recipes/ (Collection) :** Recettes complètes.
    -   `{ name, ingredients: [...], calories }`
4.  **daily_summaries/ (Collection) :** Agrégats pour les stats (mise à jour différée/debounced).
    -   `{ date: "YYYY-MM-DD", totalCalories, goal, completed }`
5.  **user (Document Racine) :** Métadonnées globales.
    -   `{ dailyGoal, deletedFoodIds: [] }`

### Logique de Synchronisation
-   **Lecture :** `onSnapshot` (Temps réel). L'UI se met à jour sans rechargement à chaque modification distante (ex: ajout depuis mobile -> visible sur desktop).
-   **Écriture :** Directe. Optimistic UI n'est pas implémentée (l'UI attend la confirmation Firestore pour plus de sûreté, sauf pour l'ajout rapide qui simule l'ajout localement en attendant).
