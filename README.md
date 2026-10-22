# My Toolbox

Application mobile **Ionic / Angular / Capacitor** pour les collectionneurs de cartes Pokémon TCG, avec un convertisseur de devises intégré.

## Fonctionnalités

- **Collection TCG** : Gestion des cartes Pokémon avec photo, série, génération, prix moyen, état, date d'acquisition et statut acquise / légendaire
- **Suivi** : Tableau de bord (total, acquises, manquantes, prix moyen, valeur estimée), dernières acquisitions, filtres et tris
- **Statistiques** : Répartition et progression de la collection
- **Convertisseur de devises** : Conversion EUR / USD / DOP avec taux de change en ligne (cache offline)
- **Sauvegarde / Restauration** : Export et import de la base de données SQLite au format JSON

## Pages

| Page | Route | Description |
|---|---|---|
| TCG - Suivi | `/tcg/suivi` | Tableau de bord, liste des cartes, filtres et tris |
| TCG - Création | `/tcg/suivi/creation` | Ajout d'une carte (formulaire + photo) |
| TCG - Édition | `/tcg/suivi/detail/:id` | Modification d'une carte |
| TCG - Statistiques | `/tcg/stats` | Statistiques de la collection |
| TCG - Backup | `/tcg/backup` | Export / import de la base |
| Convertisseur | `/tools/convertisseur` | Conversion de devises |

## Données

- **9 générations** Pokémon (Kanto → Paldea)
- **147 séries TCG** pré-chargées (Base Set → Mega Evolution)
- **7 états de carte** (Mint → Damaged)
- **3 devises** : EUR, USD, DOP
- Base de données SQLite locale avec migrations

## Base de données

Le schéma est défini dans `src/app/constants/database.ts`, les noms de tables dans `src/app/constants/table-names.ts`. Il utilise le système de migrations de `@capacitor-community/sqlite`.

### Structure

```typescript
export const DB_NAME = 'todo_list_db';   // nom du fichier SQLite
export const DB_VERSION = 5;             // version courante

// Tableau de statements SQL pour la version 1
export const version1: string[] = [
    `CREATE TABLE IF NOT EXISTS ${tableName.card} (...)`,
    `INSERT INTO ${tableName.serie} ...`,
];

// Tableau des migrations — une entrée par version
export const DB_UPGRADES = [
    { toVersion: 1, statements: version1 },
    // ...
    { toVersion: 5, statements: version5 },
];
```

### Ajouter une migration

Quand tu modifies le schéma (nouvelle colonne, nouvelle table) :

1. Incrémenter `DB_VERSION`
2. Créer un nouveau tableau `versionN` avec les statements de migration (`ALTER TABLE`, etc.)
3. Ajouter une entrée dans `DB_UPGRADES`

```typescript
export const DB_VERSION = 6;

export const version6: string[] = [
    `ALTER TABLE ${tableName.card} ADD COLUMN comment TEXT NULL;`,
];

export const DB_UPGRADES = [
    // ...
    { toVersion: 5, statements: version5 },
    { toVersion: 6, statements: version6 },
];
```

> Ne jamais modifier une version existante — les migrations déjà appliquées ne doivent pas changer.

## Stack technique

| Technologie | Version |
|---|---|
| Angular | 20 |
| Ionic | 8 |
| Capacitor | 8 |
| TypeScript | 5.9 |

**Plugins Capacitor :** SQLite, Camera, Filesystem, File Transfer, Network

## Services communs (sous-modules git)

Les services partagés entre mes applications sont intégrés en **sous-modules git** dans `src/app/services/` :

| Sous-module | Contenu |
|---|---|
| [`capacitor.services.common`](https://github.com/Revan027/capacitor.services.common) | `StorageService` (SQLite), `FileService`, `MediaService`, `HttpService` |
| [`ionic.services.common`](https://github.com/Revan027/ionic.services.common) | `ErrorService`, `ToastService`, `ConfirmationService`, enums |

> `StorageService` importe `../../constants/database` : les sous-modules doivent rester dans `src/app/services/`.

Mettre à jour les sous-modules vers la dernière version de leur branche `main` :

```bash
git submodule update --remote
```

## Installation

### 1. Cloner le repo (avec les sous-modules)

```bash
git clone --recurse-submodules https://github.com/Revan027/my-toolbox.git
cd my-toolbox
```

Si le repo a déjà été cloné sans les sous-modules :

```bash
git submodule update --init --recursive
```

### 2. Installer Ionic CLI (si pas déjà installé)

```bash
npm install -g @ionic/cli
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Configurer les environnements

Copier les fichiers d'exemple et renseigner ta clé API :

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

Remplacer `YOUR_API_KEY` par ta clé [CurrencyFreaks](https://currencyfreaks.com).

## Incrémenter la version de l'application

La version doit être mise à jour manuellement dans deux fichiers :

### 1. `package.json`

```json
"version": "X.Y.Z"
```

### 2. `android/app/build.gradle`

```gradle
versionCode X        // entier, toujours supérieur au précédent (actuellement 400 pour 4.0.0)
versionName "X.Y.Z"  // version lisible, doit correspondre à package.json
```

### Convention de versioning (semver)

| Type de changement | Exemple | Quand l'utiliser |
|--------------------|---------|------------------|
| `PATCH` (Z) | 1.0.0 → 1.0.1 | Correction de bug |
| `MINOR` (Y) | 1.0.0 → 1.1.0 | Nouvelle fonctionnalité rétrocompatible |
| `MAJOR` (X) | 1.0.0 → 2.0.0 | Changement majeur / breaking change |

> Le `versionCode` Android doit toujours augmenter à chaque APK publié, sinon Android refuse la mise à jour.

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

## Publier une release (CI)

Le workflow `.github/workflows/release-android.yml` construit l'APK et le publie dans une **Release GitHub** à chaque push d'un tag de version :

```bash
git tag v4.0.1
git push origin v4.0.1
```

Le tag peut s'écrire avec ou sans `v` (`v4.0.1` ou `4.0.1`). L'APK est attaché à la release sous le nom `my-toolbox-<tag>.apk`.

### Prérequis

- Secret GitHub **`ANDROID_DEBUG_KEYSTORE`** : le keystore de debug encodé en base64. Sans lui, le workflow échoue volontairement : l'APK aurait une autre signature et ne pourrait pas s'installer en mise à jour (désinstallation → perte des données SQLite).
- Les sous-modules doivent être **publics** : la CI les clone avec le jeton par défaut, qui n'a accès qu'à ce repo.
