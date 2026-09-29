# Journal de Prompts — Séance 1

Usage de l'IA documenté conformément au Code de déontologie IA du Lab GET 409. Outil : Claude (interface web).
Le journal des 5 prompts techniques de la séance 2 est dans [docs/journal-prompts-s2.md](docs/journal-prompts-s2.md).

| # | Objectif | Technique | Note |
|---|---|---|---|
| S1-P1 | Structurer l'idée « assistant client multicanal » | Zero-Shot | 4/5 |
| S1-P2 | Préparer les guides d'interview | Zero-Shot | 4/5 |
| S1-P3 | Formuler les HMW | Zero-Shot → itération | 2/5 → 4/5 |

---

## S1-P1 — Structurer l'idée

**Prompt envoyé**
```
Tu es consultant en expérience client dans l'assurance en Afrique de l'Ouest.
Contexte : chez NSIA Vie Assurances à Dakar, les IT ont créé une application client. Je suis chargée de recouvrement et je veux proposer que chaque client choisisse comment être contacté : application, chatbot, SMS, appel automatique, assistant vocal français/wolof, ou conseiller.
Tâche : pour chaque canal, indique à quel profil de client il convient et un usage concret pour le recouvrement des cotisations.
Format : tableau en français (Canal | Profil | Usage recouvrement).
```

**Réponse IA (résumé)**
Tableau des 6 canaux : application pour les clients autonomes (situation, paiement), chatbot pour les questions rapides, SMS pour les rappels simples, appel automatique pour les retards importants, vocal wolof pour les clients à l'aise à l'oral, conseiller pour les cas complexes.

**Note : 4/5** — Confirme la logique de mon idée. J'ai ajouté les règles d'escalade et les horaires interdits, qui viennent de mon expérience de relance. Résultat : [docs/canaux.md](docs/canaux.md).

---

## S1-P2 — Guides d'interview

**Prompt envoyé**
```
Tu es expert en recherche utilisateur.
Contexte : je prépare trois interviews d'empathie de 5 minutes : une assurée à revenu irrégulier qui paie par Wave et parle surtout wolof, un assuré qui utilise l'application NSIA, et une chargée de recouvrement.
Tâche : rédige 5 à 8 questions ouvertes pour chacun, sans proposer de solution et sans orienter les réponses.
Format : trois listes numérotées en français.
```

**Réponse IA (résumé)**
Trois listes de questions ouvertes (« Racontez-moi… », « Qu'avez-vous ressenti… »).

**Note : 4/5** — J'ai ajouté la question sur les heures de disponibilité (le marché) et sur la préférence lire / écouter / parler, clé pour le projet. Résultat : [guide-interview.md](guide-interview.md).

---

## S1-P3 — Formuler les HMW

### Version 1
**Prompt envoyé**
```
Fais un HMW pour mon assistant client NSIA avec chatbot et vocal.
```
**Réponse IA (résumé)**
« Comment pourrions-nous créer un chatbot vocal intelligent pour les clients de NSIA Vie ? »

**Note : 2/5** — La solution (chatbot vocal) est dans l'énoncé : c'est ce que la séance interdit. Pas de bénéfice client.

### Version 2 (itération)
**Prompt envoyé**
```
Formule 3 HMW avec la structure « Comment pourrions-nous [verbe] pour [utilisateur] afin de [bénéfice] ? ».
Utilisateur : assurés NSIA Vie, dont beaucoup lisent peu le français et préfèrent l'oral en wolof.
Insight : les rappels de cotisation ne sont pas lus ou pas compris, donc les retards s'accumulent.
Contrainte : aucun canal ni technologie dans l'énoncé.
Angles : le canal, la langue, l'interlocuteur.
```
**Réponse IA (résumé)**
Trois HMW, un par angle, sans solution imposée.

**Note : 4/5** — Retravaillés et retenus dans [hmw.md](hmw.md).
