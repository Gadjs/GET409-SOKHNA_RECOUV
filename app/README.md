# Ndimbal — maquette statique (S4)

Maquette HTML/CSS/JS du module Ndimbal, conforme au cahier des charges de septembre 2026. Étape intermédiaire avant la migration vers React + Tailwind + Vite (+ Supabase pour l'espace agent).

## Ouvrir la maquette

Ouvrez `index.html` directement dans un navigateur, ou servez le dossier avec un petit serveur local (ex. `python3 -m http.server`, depuis ce dossier) pour un comportement plus proche de la production.

## Pages

- `index.html` — Accueil
- `cotisations.html` — Mes cotisations (6 contrats fictifs, filtres, tableau desktop / cartes mobile)
- `contact.html` — Contact
- `agent.html` — Espace agent (connexion simulée, tableau de bord, export CSV)

## À remplacer avant la mise en production

Les images jointes n'ont pas pu être intégrées (aucun fichier reçu). Cinq images provisoires marquent l'emplacement exact — mêmes dimensions, mêmes usages (`object-fit: cover`, lazy loading, texte alternatif déjà en place) :

- `assets/img/logo-nsia.svg` → logo NSIA Vie
- `assets/img/banniere-hero.svg` → photo de bannière (hero Accueil + bannières fines Mes cotisations / Contact)
- `assets/img/produit-etudes.svg`, `produit-retraite.svg`, `produit-epargne.svg` → images produits

Remplacez chaque fichier par l'image réelle en conservant le même nom, ou mettez à jour les chemins `src` dans les quatre pages HTML.

## Espace agent

L'authentification est simulée côté client (n'importe quel e-mail/mot de passe ouvre le tableau de bord) : il n'y a pas encore de connexion Supabase. Les données du tableau (consultations, clics « Payer », promesses, demandes de contact) sont fictives, définies dans `assets/js/app.js` (`ACTIONS_AGENT`).

## Prochaine étape

Migrer cette structure vers un projet Vite + React + Tailwind CSS, brancher Supabase pour l'espace agent (authentification + table des actions clients), conformément à la stack technique du cahier des charges.
