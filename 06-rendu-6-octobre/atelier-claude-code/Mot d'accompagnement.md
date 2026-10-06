# GET409 – Atelier Claude Code : rendu de Sokhna Awa Gadiaga

Master 1, Swiss UMEF – Dakar.

Bonjour Monsieur,

Vous trouverez ici mon rendu de l'atelier Claude Code, épisodes E00 à E14 (parcours Essentiel et parcours Avancé). Chaque dossier E00 à E14 contient les captures et les fichiers demandés pour l'épisode correspondant.

## Adaptations

- Tous les exercices ont été réalisés sur Mac (commandes adaptées depuis PowerShell).
- Au lieu de l'exemple ATA suarl, j'ai appliqué les exercices à mon projet de cours **Ndimbal** (assistant de rappel de cotisations pour les assurés de NSIA Vie) et, pour le projet fil rouge (E07 à E10, E14), à **RecouvIA** (outil pour la chargée de recouvrement) à la place de PromptLens. Toutes les données utilisées sont fictives (projet étudiant, non officiel). Correction du 6 octobre : contrairement à ce qu'indiquait la première version de ce mot, l'application et la vidéo affichaient encore le logo et les coordonnées de NSIA ; ils ont été retirés dans la version corrigée.

## Points à signaler

- **E02** : le retour arrière par Échap Échap n'a pas restauré le fichier ; je l'ai fait avec `git restore`, qui a ramené un `git status` propre.
- **E03** : le plugin frontend-design installé en `--scope local` s'est appliqué à tout le dossier `claude-lab` (racine git) ; la V1 avait été faite avant l'installation.
- **E03** : les 5 lignes de direction artistique affichées par Claude Code n'avaient pas été sauvegardées ; elles ont été rédigées après coup à partir du code de la page V2.
- **E05** : le fichier SKILL.md de la skill `/ndimbal-brand` a été rédigé avec l'aide de Claude dans le chat, car la session Claude Code ne l'avait pas créé ; l'email, le post et le flyer ont été produits avec ma session Claude Code. Le texte du post LinkedIn n'a pas été sauvegardé et n'est donc pas joint.
- **E06** : Playwright ne se connectait pas au premier essai (délai dépassé) ; après installation manuelle, il a fonctionné. Le site axa.sn était en maintenance le 2 octobre : l'analyse complète porte sur SanlamAllianz Sénégal, et la page de maintenance d'AXA est citée comme telle.
- **E11** : j'ai utilisé le SDK Google ADK (Gemini) et la skill officielle `adk-agent-builder` (google/adk-python ; la skill `adk-cheatsheet` prévue au départ n'existe plus dans le dépôt google/adk-docs). Le quota gratuit de Gemini (20 requêtes/jour) a été atteint pendant les tests ; le notebook a été réexécuté entièrement après la remise à zéro du quota, avec le modèle `gemini-3.5-flash-lite` : sans mémoire, l'agent oublie la préférence WhatsApp ; avec la même session, il la retient (voir `E11/agent_lab.ipynb` et la capture `E11-notebook-execution-complete.png`).
- **E12** : le PDF de mon CV n'était pas lisible par Claude Code (aucun outil PDF installé) ; le texte a été extrait en `.txt` puis ingéré. L'erreur et sa correction sont notées dans `vault/errors.md` (boucle d'auto-correction).
- **E13** : Gmail et Google Agenda sont connectés en lecture seule ; aucun email n'est envoyé, archivé ni supprimé.
- **E14** : la commande `/agents` a été retirée de Claude Code ; j'ai vérifié le sous-agent en demandant à Claude de lister les sous-agents du projet. Le rapport propose des correctifs sans les appliquer, comme demandé.

## Autres éléments du rendu

Comme demandé dans votre message du 4 octobre, ce rendu contient aussi, à côté de l'atelier :
- l'application Ndimbal mise à jour, avec des illustrations de ses écrans (dossier `2-Application-Ndimbal`) ;
- la vidéo de présentation de 60 s et son dossier de production (dossier `3-Video-presentation`).

Cordialement,
Sokhna Awa Gadiaga
