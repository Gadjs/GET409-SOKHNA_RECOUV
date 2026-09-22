# Les 6 canaux de Ndimbal

Principe : **le client choisit son canal préféré** (dans l'application, par SMS ou auprès de son conseiller). Ndimbal envoie chaque message par ce canal, et bascule sur un autre canal si le premier échoue. Tout reste modifiable par le client à tout moment.

| Canal | Pour qui | Usages recouvrement | Sens | Prérequis techniques |
|---|---|---|---|---|
| 📱 **Application NSIA** (existante, IT) | Clients autonomes numériquement | Situation du contrat, échéancier, historique des versements, bouton « Payer par Wave / OM », notifications push | Client ↔ NSIA | Nouveau module dans l'app IT : préférences de contact + écran « Ma situation » |
| 💬 **Chatbot** (app + WhatsApp) | Clients qui veulent poser une question tout de suite | « Combien je dois ? », « Mon paiement est-il arrivé ? », « Quand est ma prochaine échéance ? », demande d'échéancier | Client ↔ NSIA | API de consultation des contrats ; WhatsApp Business API (fournisseur agréé) |
| 📩 **SMS** | Tous, y compris téléphones basiques | Rappel J-3, confirmation de paiement, lien de paiement, code court « SITUATION » | Surtout NSIA → client | Agrégateur SMS au Sénégal ; nom d'expéditeur « NSIA VIE » |
| 📞 **Appel automatique** | Clients qui ne lisent pas les SMS | Rappels importants : retard J+7, risque de déchéance ; « tapez 1 pour être rappelé par un conseiller » | NSIA → client | Serveur vocal (SVI) + messages enregistrés en français et wolof |
| 🗣️ **Assistant vocal FR / wolof** | Clients à l'aise à l'oral | Écouter sa situation, poser sa question en parlant, recevoir des vocaux WhatsApp | Client ↔ NSIA | Reconnaissance vocale wolof (à évaluer), synthèse ou messages pré-enregistrés par une voix humaine |
| 👨🏽‍💼 **Conseiller NSIA** | Demandes complexes | Difficulté financière, négociation d'échéancier, rachat, réclamation, sinistre, décès | Humain ↔ humain | File de demandes dans le tableau de bord RecouvIA |

## Règles d'escalade vers un conseiller

Le chatbot et l'assistant vocal **transfèrent immédiatement** au conseiller quand :
- le client parle de difficulté financière, de perte d'emploi, de maladie ou de décès ;
- il demande un rachat, une résiliation ou fait une réclamation ;
- il conteste un montant ou dit avoir payé alors que rien n'est reçu ;
- il demande un humain (« je veux parler à quelqu'un ») ;
- l'IA n'a pas compris après 2 tentatives.

## Ordre de repli par défaut (si aucune préférence)
SMS → application (si installée) → appel automatique → conseiller.

## Ce que Ndimbal ne fait jamais
- Menacer, culpabiliser, ou utiliser un ton agressif.
- Envoyer un message entre 21 h et 8 h, ni le vendredi entre 13 h et 15 h.
- Contacter un tiers (voisin, famille) à propos de la dette du client.
- Donner un montant sans l'avoir lu dans le système NSIA (pas de chiffre inventé par l'IA).
