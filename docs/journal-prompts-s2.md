# Journal de Prompts — Séance 2

Outil : Claude (interface web). Projet : Ndimbal — assistant client multicanal NSIA Vie pour le recouvrement.
Règle : si la note est inférieure à 3/5, le prompt est reformulé et les deux versions sont documentées. Toutes les données client utilisées sont fictives.

| # | Technique | Note | Itération |
|---|---|---|---|
| P1 | Zero-Shot | 4/5 | Non |
| P2 | Zero-Shot | 2/5 → 4/5 | Oui |
| P3 | Few-Shot | 4/5 | Non |
| P4 | Chain-of-Thought | 5/5 | Non |
| P5 | Libre (classification + JSON) | 4/5 | Non |

---

## P1 — Zero-Shot : les 3 problèmes du persona

**Prompt envoyé**
```
Tu es consultant en inclusion financière au Sénégal.
Contexte : Mame Diarra, 46 ans, vendeuse de tissus au marché HLM à Dakar, a un contrat d'épargne NSIA Vie pour les études de ses enfants. Elle paie par Wave quand ses ventes le permettent, lit peu le français et préfère les messages vocaux en wolof.
Tâche : identifie ses 3 principaux problèmes dans le paiement de ses cotisations.
Format : liste numérotée en français, 2 phrases maximum par problème.
```
**Réponse IA (résumé)**
1) Revenus irréguliers qui créent des retards ponctuels. 2) Communications écrites en français qu'elle ne comprend pas bien, donc rappels ignorés. 3) Manque de visibilité sur sa situation (montant dû, paiements reçus), qui entretient la méfiance.

**Note : 4/5** — Juste et cohérent avec la carte d'empathie. Il manque le problème des horaires d'appel, ajouté au VPC.

---

## P2 — Zero-Shot : 5 fonctionnalités du MVP

### Version 1
**Prompt envoyé**
```
Donne 5 fonctionnalités pour un chatbot d'assurance.
```
**Réponse IA (résumé)**
Devis en ligne, déclaration de sinistre, FAQ, souscription, recommandation de produits. Rien sur le recouvrement ni sur le choix du canal.

**Note : 2/5** — Trop vague : pas de rôle, de contexte ni de format.

### Version 2 (itération)
**Prompt envoyé**
```
Tu es Product Owner chez un assureur vie à Dakar.
Contexte : l'application client NSIA existe déjà (créée par l'IT). Je veux y ajouter un module qui permet au client de choisir son canal (app, chatbot, SMS, appel automatique, vocal français/wolof, conseiller) pour recevoir ses rappels de cotisation et poser ses questions.
Tâche : propose 5 fonctionnalités pour un MVP réalisable en 4 semaines.
Format : tableau en français Fonctionnalité | Problème résolu | Priorité (Must / Should / Could).
```
**Réponse IA (résumé)**
1) Écran de préférences de contact (Must). 2) Rappels automatiques J-3 / J+3 par canal préféré (Must). 3) Chatbot « Ma situation » (Must). 4) Transfert au conseiller (Must). 5) Messages vocaux wolof pré-enregistrés (Should).

**Note : 4/5** — C'est le périmètre du prototype. J'ai ajouté le repli automatique quand un canal échoue.

---

## P3 — Few-Shot : question client → réponse et canal

**Prompt envoyé**
```
Voici comment l'assistant NSIA doit traiter les messages clients :

Message : « Man, ñaata laa war ? » (Combien je dois ?)
Réponse : consulter le contrat, donner le montant dû et la prochaine échéance, en wolof, par le canal du client.
Escalade : non

Message : « J'ai perdu mon travail, je ne peux plus payer. »
Réponse : message d'empathie, proposition d'être rappelé par un conseiller.
Escalade : oui (difficulté financière)

Message : « J'ai payé par Wave hier mais vous m'avez encore envoyé un rappel. »
Réponse :
Escalade :
```
**Réponse IA (résumé)**
Réponse : s'excuser, vérifier le paiement dans le relevé Wave ; s'il est trouvé, confirmer et arrêter les rappels ; sinon, demander la référence de transaction. Escalade : oui si le paiement n'est pas retrouvé (contestation).

**Note : 4/5** — Même format que les exemples ; logique reprise dans les règles d'escalade du prototype.

---

## P4 — Chain-of-Thought : cause → obstacle → solution

**Prompt envoyé**
```
Tu es expert en assurance vie et en inclusion financière en Afrique de l'Ouest.
Analyse le problème suivant : les assurés NSIA Vie à revenu irrégulier accumulent des retards de cotisation, alors que NSIA leur envoie des rappels.
Réfléchis étape par étape :
Étape 1 : Identifie la cause principale du problème dans le contexte de Dakar.
Étape 2 : Décris l'obstacle principal qui empêche une solution classique (plus de SMS, plus d'appels) de fonctionner.
Étape 3 : Propose une solution technologique accessible à ces assurés, y compris ceux qui lisent peu.
Développe chaque étape avant de conclure.
```
**Réponse IA (résumé)**
Étape 1 — Cause : les revenus irréguliers créent des retards, mais c'est surtout l'absence de rappel compris qui les laisse s'accumuler. Étape 2 — Obstacle : envoyer plus de messages dans le même format (SMS écrit en français) ne touche pas les clients qui ne lisent pas ; les appels à heures fixes ne tombent pas au bon moment. Étape 3 — Solution : laisser le client choisir son canal et sa langue, privilégier le vocal en wolof, rendre la situation consultable à tout moment, et transférer à un humain les cas de difficulté.

**Note : 5/5** — Raisonnement vérifiable, qui justifie directement le HMW définitif.

---

## P5 — Libre : classification d'intention en JSON

**Prompt envoyé**
```
Tu es le module de compréhension de l'assistant NSIA Vie.
Classe le message client suivant dans une seule intention parmi : SITUATION, PAIEMENT_CONTESTE, DIFFICULTE, RACHAT, RECLAMATION, PARLER_HUMAIN, AUTRE.
Indique si un conseiller doit intervenir.
Message : « Maa ngi sonn, ay weer yi dafa metti, duma mën a fey leegi. »
Format : JSON avec les clés "intention", "langue", "escalade", "justification".
```
**Réponse IA (résumé)**
`{"intention": "DIFFICULTE", "langue": "wolof", "escalade": true, "justification": "Le client exprime une difficulté à payer ces mois-ci."}`

**Note : 4/5** — Format JSON directement réutilisable dans un agent Dify (S3). La compréhension du wolof doit être testée sur beaucoup plus d'exemples réels.

---

## Ce que j'ai appris
- Sans rôle ni contexte (P2 v1), l'IA propose un chatbot d'assurance générique, hors sujet.
- Le Few-Shot permet d'imposer les règles d'escalade avec seulement 2 exemples.
- Le Chain-of-Thought justifie le choix du multicanal mieux que je ne l'aurais fait seule.
- La sortie JSON prépare la construction des agents Dify en S3.
- Le wolof est le point à tester en priorité : toute phrase doit être validée par un locuteur natif.
