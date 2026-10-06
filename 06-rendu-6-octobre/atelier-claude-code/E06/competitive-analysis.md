# Analyse concurrentielle — assureurs au Sénégal (pour Ndimbal)

Date des observations : 2026-10-02. Pages publiques uniquement, sans connexion ni envoi de formulaire (aucun formulaire rempli ou soumis). Aucune bannière de cookies n'est apparue sur sn.sanlamallianz.com, donc aucun cookie n'a été accepté ni refusé.
Règle : tout ce qui n'a pas été vu est marqué « non observé ».

## 1. Périmètre réellement couvert

| Site | Statut le 2026-10-02 | Captures |
|---|---|---|
| https://sn.sanlamallianz.com/ | Accessible | `screenshots/sanlamallianz-01-accueil-fullpage.png`, `-02-contact-fullpage.png`, `-03-reclamations-fullpage.png`, `-04-agences-fullpage.png` |
| https://www.axa.sn/ | **En maintenance** (titre « Site indisponible ») | `screenshots/axa-01-maintenance-fullpage.png` |

**Limite majeure : AXA Sénégal n'a pas pu être analysé.** Le site affiche seulement une page de maintenance. Tous les critères demandés pour AXA sont donc « non observé ». La comparaison ci-dessous repose en pratique sur un seul assureur (SanlamAllianz). Les « motifs communs » sont à lire avec cette réserve. À refaire quand axa.sn sera de nouveau en ligne.

Aucune page de paiement en ligne n'a été trouvée sur Sanlam : le menu principal ne contient que Particuliers, Entreprises, À propos, Nos valeurs, Agences, Nous contacter, Réclamations et Actualités (capture 01). La page « service client » analysée est donc `/reclamations`, complétée par `/contact` et `/agences`.

## 2. SanlamAllianz Sénégal — https://sn.sanlamallianz.com/

| Critère | Observation | Source |
|---|---|---|
| Message d'accueil | « Vivez en toute confiance », suivi d'un texte sur la croissance partagée et la tranquillité d'esprit. Un carrousel affiche en slide « Notre assurance santé, couverture adaptée pour tout le personnel » (Assurance Non-Vie). | capture 01 |
| Couleurs | Dominante bleue : bleu marine et bleu roi en dégradé sur les bandeaux et le pied de page, fond bleu très clair, cartes blanches. Le logo est bleu. | captures 01, 02 |
| Police | « Allianz Neo » (relevée dans le code de la page, pas visible sur la capture) | page d'accueil, analyse du code |
| Appel à l'action principal | Trois liens sous le titre : « Contactez-nous », « Trouvez une agence », « Réclamations ». Bouton bleu « Trouver une agence » en bas de page. Sur `/contact`, bouton bleu « Envoyer ». | captures 01, 02 |
| Paiement en ligne (Wave, Orange Money, etc.) | **Non observé.** Aucune mention de Wave, Orange Money ou paiement de prime sur l'accueil, `/contact`, `/reclamations` ni `/agences`. | captures 01–04 (je n'ai pas relu les captures 03 et 04, seulement leur texte) |
| Rappels / notifications | **Non observé** : aucune fonction de rappel d'échéance ou d'alerte. Seules existent des demandes de rappel par un conseiller : « un conseiller SanlamAllianz vous rappellera très prochainement » sur `/contact`, et un onglet « Être rappelé » ainsi qu'un champ « Réponse souhaitée par Téléphone / E-mail » sur `/reclamations`. | `/contact`, `/reclamations` (capture 02 ; 03 non relue) |
| Langues | Français uniquement observé (`lang="fr"`). Aucun sélecteur de langue vu. Le menu « Choisissez votre pays ou votre région » est un choix de filiale (Sanlam Angola, Bénin, etc.), pas de langue. Wolof : non observé. | accueil, analyse du code |
| Canaux de contact | Téléphone fixe +221 33 849 44 00 / 33 849 69 00 ; WhatsApp +221 76 229 00 00 (lien `api.whatsapp.com`) ; e-mail senegal@sn.sanlamallianz.com ; adresse : Avenue Abdoulaye Fadiga x Rue de Thann, Dakar ; formulaire de contact (prénom, nom, e-mail, téléphone, message) ; formulaire de réclamation ; liste d'agences (une vingtaine, avec téléphones) ; réseaux X, LinkedIn, Facebook, Instagram. Chat en direct : non observé. | captures 01, 02, 04 |
| Barre flottante | Barre fixe à droite avec cinq boutons colorés : téléphone (bleu), WhatsApp (vert), « Nous contacter » (orange), « Trouver une agence » (vert clair), « Réclamations » (rouge). | captures 01, 02 |
| Autres | Produits vie : Rente Éducation, Hospicash, AZ Retraite, Prévoyance, Épargne Sérénité, Temporaire Décès. Produits non-vie : Automobile, Individuelle accidents, Multirisque habitation, Voyage, RC générale. Mention « Copyright © 2024 » en pied de page. Espace client / connexion : non observé dans la navigation. | capture 01 |

## 3. AXA Sénégal — https://www.axa.sn/

| Critère | Observation | Source |
|---|---|---|
| Statut | Page « Site en maintenance » : « Nous réinventons actuellement votre expérience digitale… Le site est temporairement indisponible et sera remis en ligne prochainement. » | `screenshots/axa-01-maintenance-fullpage.png` |
| Message d'accueil, appel à l'action, paiement en ligne, rappels, langues | **Non observé** (site indisponible). | — |
| Couleurs | Page de maintenance neutre : fond gris clair, carte blanche, bouton bleu, étincelles jaunes. Ce n'est pas la charte du site réel, donc à ne pas comparer. | même capture |
| Contact | Un seul canal : e-mail service.info@axa.sn. Téléphone, WhatsApp et chat : non observés. | même capture |
| Signal utile | « © 2026 AXA Assurance Sénégal » et une refonte annoncée (« expérience digitale »). Rien ne dit ce qu'elle contiendra. | même capture |

## 4. Forces, lacunes, motifs communs

**Forces de SanlamAllianz (observées)**
- Contact multicanal visible en permanence grâce à la barre flottante : téléphone, WhatsApp, agences, réclamations (captures 01, 02).
- WhatsApp affiché avec un numéro dédié, ce qui correspond aux usages locaux.
- Large réseau d'agences listé avec adresses et téléphones (capture 04).
- Charte visuelle cohérente, sobre et rassurante (bleu).

**Lacunes de SanlamAllianz (observées ou non observées)**
- Aucun paiement de prime en ligne ni mobile money vu : non observé.
- Aucun rappel d'échéance ou notification : non observé. Le rappel, c'est le client qui le demande, pas l'assureur qui le propose.
- Français seul, wolof non observé.
- Espace client / connexion : non observé.
- Les formulaires de contact et de réclamation réclament beaucoup de champs. Une réclamation demande jusqu'à une dizaine de champs, dont « Intermédiaire » et « Code » (texte de `/reclamations`).

**Motifs communs** : impossibles à établir avec un seul site analysé. À la place, une constatation : ni l'un ni l'autre n'offrait de parcours de paiement ou de rappel observable le 2026-10-02.

## 5. Cinq recommandations pour Ndimbal

Chacune s'appuie sur une lacune observée chez Sanlam. Les hypothèses sont signalées.

1. **Rendre le rappel proactif.** Sanlam ne propose que « être rappelé » à la demande du client (`/contact`, `/reclamations`). Ndimbal peut occuper la place libre : un rappel avant l'échéance de la prime, à J-7, J-3 et J. Le calendrier exact est une proposition, pas une observation.
2. **Faire de WhatsApp le canal principal.** Sanlam l'expose en bouton flottant vert (captures 01, 02). Ndimbal peut envoyer les rappels par WhatsApp et y recevoir les réponses, au lieu de seulement afficher un numéro.
3. **Proposer le paiement mobile dans le rappel.** Aucun paiement Wave ou Orange Money n'a été vu chez Sanlam. Un lien de paiement dans le message de rappel comblerait ce vide. À vérifier : faisabilité technique et accord de NSIA Vie, non établis ici.
4. **Parler français simple, avec une option wolof.** Sanlam est en français seul et en langage institutionnel (capture 01). Une option wolof, voix ou texte, est un point de différenciation. Non observé chez AXA.
5. **Rester minimal et rassurant visuellement.** Le bleu domine chez Sanlam (capture 01) ; une couleur d'accent chaude, le vert ou l'orange, distinguerait Ndimbal. Limiter chaque écran à une action, car Sanlam met plusieurs boutons de même poids en concurrence (trois liens sous le titre, cinq dans la barre flottante).

## 6. Suites recommandées
- Refaire AXA Sénégal quand le site sera de nouveau en ligne.
- Ajouter d'autres assureurs locaux pour avoir de vrais motifs communs. Les noms ne sont pas vérifiés ici, donc non listés.
- Recouper avec les canaux mobiles (application, WhatsApp Business), non couverts : seules des pages publiques ont été visitées.
