# DESIGN_SYSTEM.md - CalTracker Visual Identity

## 1. Philosophie Design

**"Fonction Radicale, Esthétique Premium"**
Le design de CalTracker repose sur une esthétique sombre, moderne ("Dark Mode Only"), utilisant le **Glassmorphism** pour créer de la profondeur et des hiérarchies claires. L'interface est conçue pour être utilisable d'une seule main sur mobile (ergonomie "Fat Finger").

---

## 2. Palette de Couleurs Sémantique

L'utilisation de la couleur est purement fonctionnelle : elle indique l'état ou la nature de la donnée.

### États Principaux (Le Cœur du Système)
-   **CRU (Raw)**
    -   **Couleur :** `Emerald-400` (#34d399) / `Emerald-500` (#10b981)
    -   **Signification :** Naturel, frais, non transformé.
    -   **Usage :** Badges, boutons de bascule, indicateurs de saisie pour aliments crus.

-   **CUIT (Cooked)**
    -   **Couleur :** `Orange-400` (#fb923c) / `Orange-500` (#f97316)
    -   **Signification :** Chaleur, transformation, cuisson.
    -   **Usage :** Badges, boutons de bascule, indicateurs de saisie pour aliments cuits.

### Données Nutritionnelles
-   **Protéines :** `Blue-400` (#60a5fa). Toujours utilisé pour mettre en valeur l'apport protéique, la métrique clé pour les bodybuilders.
-   **Calories (Neutre) :** `White` (#ffffff). La donnée de base.
-   **Calories (Alerte) :** `Red-400` (#f87171). Indique un dépassement de l'objectif journalier.

### Structure & Fond
-   **Background :** `Neutral-950` (#0a0a0a). Noir profond, presque OLED.
-   **Surface (Cartes) :** `Neutral-900` (#171717). Légèrement plus clair pour se détacher du fond.
-   **Bordures :** `Neutral-800` (#262626). Subtiles, pour délimiter sans alourdir.
-   **Texte Secondaire :** `Neutral-400` (#a3a3a3) ou `#666666`. Pour les labels, unités et métadonnées.

---

## 3. Typographie

**Police :** `Inter` (Google Fonts). Choisie pour sa lisibilité exceptionnelle sur écrans et ses graisses variées.

### Hiérarchie
-   **Titres (Hero) :** `Inter Black` (900). Majuscules, tracking serré (`tracking-tighter`). Pour l'impact visuel fort.
-   **Titres de Section :** `Inter Bold` (700).
-   **Chiffres (Data) :** `Inter Medium` (500) ou `Bold` (700) avec `tabular-nums`.
    -   **Règle d'Or :** Toujours utiliser `tabular-nums` pour les compteurs et listes de valeurs afin d'assurer un alignement vertical parfait des chiffres.

---

## 4. Composants UI & Glassmorphism

### Effet "Glass Panel"
L'élément de construction de base. Il superpose un flou d'arrière-plan avec une transparence et une bordure fine.

```css
.glass-panel {
    background: rgba(23, 23, 23, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Boutons & Interactions
-   **Primaire (CTA) :** Fond Blanc, Texte Noir. Contraste maximal pour l'action principale.
    -   *Hover :* Scale 1.05 + Shadow Glow.
-   **Secondaire :** Fond Transparent ou `bg-white/10`. Pour les actions moins critiques (Annuler, Retour).
-   **Inputs :** `bg-black/50`. Sombres, avec bordure `border-white/10` qui s'éclaire au focus (`border-white/20`).

### Animations (Micro-interactions)
-   **Apparition (`animate-fadeIn`) :** Fade in doux pour les modales et nouvelles vues.
-   **Slide Up (`animate-slideUp`) :** Les listes et cartes glissent vers le haut à l'entrée.
-   **Float (`animate-float`) :** Mouvement perpétuel lent pour les éléments décoratifs de fond, donnant une impression de vie "organique".

---

## 5. Ergonomie Mobile ("Fat Finger")

-   **Zone de Touch :** Minimum 44px (idéalement 56px `h-14` tailwind) pour tous les éléments interactifs.
-   **Navigation :** Barre de navigation fixée en bas (`fixed bottom-0`), accessible au pouce.
-   **Feedback :** Retour visuel immédiat au clic (changement de couleur, légère transformation).
