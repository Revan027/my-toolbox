# My Toolbox

Application mobile **Ionic / Angular / Capacitor** pour les collectionneurs de cartes Pokémon TCG, avec un convertisseur de devises intégré.

## Fonctionnalités

- **Collection TCG** : Gestion des cartes Pokémon avec photo, série, génération, prix moyen et priorité
- **Convertisseur de devises** : Conversion EUR / USD / DOP avec taux de change en ligne (cache offline)
- **Sauvegarde / Restauration** : Export et import de la base de données SQLite au format JSON

## Pages

| Page | Route | Description |
|---|---|---|
| TCG - Liste | `/tcg` | Affichage des cartes avec filtres par génération et recherche |
| TCG - Édition | `/tcg/:id` | Création et modification d'une carte (formulaire + photo) |
| Convertisseur | `/convertisseur` | Conversion de devises |
| Backup | `/backup` | Export / import de la base |

## Données

- **9 générations** Pokémon (Kanto → Paldea)
- **136 séries TCG** pré-chargées (Base Set → Scarlet & Violet)
- **3 devises** : EUR, USD, DOP
- Base de données SQLite locale avec migrations

## Base de données

Le schéma est défini dans `src/app/constants/database.ts`. Il utilise le système de migrations de `@capacitor-community/sqlite`.

### Structure

```typescript
export const DB_NAME = 'todo_list_db';   // nom du fichier SQLite
export const DB_VERSION = 1;             // version courante

// Tableau de statements SQL pour la version 1
export const version1: string[] = [
    `CREATE TABLE IF NOT EXISTS ...`,
    `INSERT INTO ...`,
];

// Tableau des migrations — une entrée par version
export const DB_UPGRADES = [
    { toVersion: 1, statements: version1 },
];
```

### Ajouter une migration

Quand tu modifies le schéma (nouvelle colonne, nouvelle table) :

1. Incrémenter `DB_VERSION`
2. Créer un nouveau tableau `version2` avec les statements de migration (`ALTER TABLE`, etc.)
3. Ajouter une entrée dans `DB_UPGRADES`

```typescript
export const DB_VERSION = 2;

export const version2: string[] = [
    `ALTER TABLE card ADD COLUMN picture TEXT`,
];

export const DB_UPGRADES = [
    { toVersion: 1, statements: version1 },
    { toVersion: 2, statements: version2 },
];
```

> Ne jamais modifier `version1` — les migrations existantes ne doivent pas changer.

## Stack technique

| Technologie | Version |
|---|---|
| Angular | 20 |
| Ionic | 8 |
| Capacitor | 8 |
| TypeScript | 5.9 |

**Plugins Capacitor :** SQLite, Camera, Filesystem, Network

## Installation

### 1. Cloner le repo

```bash
git clone https://github.com/Revan027/my-toolbox.git
cd my-toolbox
```

### 2. Installer Ionic CLI (si pas déjà installé)

```bash
npm install -g @ionic/cli
```

### 3. Installer les dépendances

```bash
npm install
```

### 3. Configurer les environnements

Copier les fichiers d'exemple et renseigner ta clé API :

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

Remplacer `YOUR_API_KEY` par ta clé [CurrencyFreaks](https://currencyfreaks.com).

### 4. Ajouter les services communs

Cloner le repo des services communs dans le bon dossier :

```bash
git clone https://github.com/Revan027/services.common.git src/app/services/services.common
```

## Incrémenter la version de l'application

La version doit être mise à jour manuellement dans deux fichiers :

### 1. `package.json`

```json
"version": "X.Y.Z"
```

### 2. `android/app/build.gradle`

```gradle
versionCode X        // entier, toujours incrémenté de 1 (ex: 1, 2, 3...)
versionName "X.Y.Z"  // version lisible, doit correspondre à package.json
```

### Convention de versioning (semver)

| Type de changement | Exemple | Quand l'utiliser |
|--------------------|---------|------------------|
| `PATCH` (Z) | 1.0.0 → 1.0.1 | Correction de bug |
| `MINOR` (Y) | 1.0.0 → 1.1.0 | Nouvelle fonctionnalité rétrocompatible |
| `MAJOR` (X) | 1.0.0 → 2.0.0 | Changement majeur / breaking change |

> Le `versionCode` Android doit toujours être incrémenté de 1 à chaque build publié sur le Play Store, indépendamment du `versionName`.

## Lancer en développement web

```bash
ionic serve
```

## Builder et déployer sur Android

### Prérequis
- Android SDK installé avec la variable `ANDROID_HOME` configurée
- Mode développeur activé sur le téléphone (Paramètres → À propos → taper 7x sur "Numéro de build")
- Débogage USB activé

### Déployer sur le téléphone (USB)

```bash
ionic cap run android
```

### Live reload sur le téléphone

```bash
ionic cap run android --livereload --external
```

