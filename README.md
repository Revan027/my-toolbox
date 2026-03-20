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
git clone https://github.com/Revan027/services.common.git src/app/services/common
```

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

