# ChessMentor

ChessMentor est un MVP Next.js/React/TypeScript pour apprendre les echecs avec cours interactifs, exercices tactiques, progression, partie contre ordinateur, conseils pedagogiques et analyse apres partie.

## Architecture

- `app/` : pages App Router et routes API.
- `components/` : interface, echiquier, lecons, exercices, partie et analyse.
- `data/` : contenu initial des cours et positions FEN.
- `lib/` : Prisma, auth, moteur d'echecs, progression, traductions.
- `messages/` : fichier de navigation en francais.
- `prisma/` : schema PostgreSQL et seed.
- `tests/` : tests Vitest de la logique d'echecs et de progression.

## Installation

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

## Tests et build

```bash
npm run test
npm run build
```

## Compte demo

- Email : `demo@chessmentor.local`
- Mot de passe : `ChessMentor123!`

## MVP inclus

- Accueil responsive avec mode clair/sombre.
- Inscription, connexion, deconnexion et profil.
- Tableau de bord personnalise avec XP, badges et statistiques.
- Deux lecons interactives jouables.
- Dix exercices tactiques avec indices, tentatives et repetition.
- Echiquier avec glisser-deposer, clic, coups legaux, dernier coup, historique, PGN, rotation.
- Partie contre ordinateur en trois niveaux, avec mode entrainement et assistance.
- Sauvegarde des parties et analyse pedagogique simple.
- Prisma/PostgreSQL avec modeles principaux demandes.
- Interface limitee au francais pour le moment.

La connexion Google est preparee par variables d'environnement, mais l'activation complete necessite d'ajouter un fournisseur OAuth dans la couche auth.
