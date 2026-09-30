# Ndimbal — maquette statique (S4)

Maquette HTML/CSS/JS du module Ndimbal, conforme au cahier des charges de septembre 2026. Étape intermédiaire avant la migration vers React + Tailwind + Vite (+ Supabase pour l'espace agent).

## Ouvrir la maquette

Ouvrez `index.html` directement dans un navigateur, ou servez le dossier avec un petit serveur local (ex. `python3 -m http.server`, depuis ce dossier) pour un comportement plus proche de la production.

## Pages

- `index.html` — Accueil
- `cotisations.html` — Mes cotisations (réservée aux assurés connectés : chacun ne voit que ses propres contrats ; filtres, tableau desktop / cartes mobile)
- `contact.html` — Contact
- `connexion.html` — Connexion de l'assuré (téléphone + mot de passe)
- `agent.html` — Espace agent (connexion simulée, tableau de bord, export CSV)

## À remplacer avant la mise en production

Les visuels actuels sont des illustrations SVG aux couleurs NSIA (bleu #2B2B5E, jaune #D5A00A), en attendant les images officielles fournies par NSIA :

- `assets/img/logo-nsia.svg` → logo NSIA Vie
- `assets/img/banniere-hero.svg` → photo de bannière (hero Accueil + bannières fines Mes cotisations / Contact)
- `assets/img/produit-etudes.svg`, `produit-retraite.svg`, `produit-epargne.svg` → images produits

Remplacez chaque fichier par l'image réelle en conservant le même nom, ou mettez à jour les chemins `src` dans les quatre pages HTML.

## Connexion de l'assuré

« Mes cotisations » n'est accessible qu'après connexion ; sans session, le visiteur est redirigé vers `connexion.html`. Une fois connecté, l'assuré ne voit **que ses propres contrats**. Un bouton « Se déconnecter » apparaît dans l'en-tête, et la session expire après **15 minutes d'inactivité**.

Comptes de démonstration (fictifs, mot de passe `ndimbal2026`) :

| Assuré | Téléphone | Contrats visibles |
|---|---|---|
| Mame Diarra Sarr | 77 123 45 67 | POL009 (Études, en retard), POL010 (Épargne, à jour) |
| Awa Ndiaye | 77 234 56 78 | POL001 (Retraite, en retard) |
| Fatou Diop | 76 345 67 89 | POL002 (Études, à jour) |

**Limite assumée de la maquette** : la connexion est simulée dans le navigateur (comptes et données dans `assets/js/app.js`, session en `sessionStorage`). Ce n'est pas une sécurité réelle. Dans la version de production, l'authentification se fait par Supabase Auth (cible : numéro de téléphone + code SMS) et l'isolement des données est garanti côté base par la Row Level Security, décrite dans `supabase/schema.sql`.

## Espace agent

L'authentification est simulée côté client (n'importe quel e-mail/mot de passe ouvre le tableau de bord) : il n'y a pas encore de connexion Supabase. Les données du tableau (consultations, clics « Payer », promesses, demandes de contact) sont fictives, définies dans `assets/js/app.js` (`ACTIONS_AGENT`).

## Prochaine étape

Migrer cette structure vers un projet Vite + React + Tailwind CSS, brancher Supabase pour l'espace agent (authentification + table des actions clients), conformément à la stack technique du cahier des charges.
