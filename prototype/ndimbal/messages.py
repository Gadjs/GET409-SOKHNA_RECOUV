"""Modèles de messages du parcours de recouvrement.

Les textes en wolof sont des propositions : ils DOIVENT être relus par une
personne wolophone et validés par NSIA avant tout usage réel.
"""

MESSAGES = {
    "rappel_j_moins_3": {
        "fr": "Bonjour {prenom}, NSIA Vie vous rappelle votre cotisation de {montant} FCFA "
              "(contrat {police}) prévue le {date}. Vous pouvez payer par Wave ou Orange Money. Merci !",
        "wo": "Asalaa maalekum {prenom}, NSIA Vie di la fàttali sa cotisation bu {montant} FCFA "
              "(contrat {police}) ci {date}. Mën nga fey ak Wave walla Orange Money. Jërëjëf !",
    },
    "merci_paiement": {
        "fr": "Merci {prenom} ! Nous avons bien reçu votre paiement de {montant} FCFA "
              "pour le contrat {police}.",
        "wo": "Jërëjëf {prenom} ! Jot nanu sa fey bu {montant} FCFA ngir contrat {police}.",
    },
    "rappel_j_plus_3": {
        "fr": "Bonjour {prenom}, votre cotisation de {montant} FCFA (contrat {police}) n'est pas "
              "encore arrivée. Si vous avez une difficulté, répondez 1 : un conseiller vous rappellera.",
        "wo": "Asalaa maalekum {prenom}, sa cotisation bu {montant} FCFA (contrat {police}) agagul. "
              "Su amee jafe-jafe, tontul 1 : benn conseiller dina la woo.",
    },
    "appel_j_plus_7": {
        "fr": "Bonjour {prenom}, ici NSIA Vie. Il reste {montant} FCFA à régler sur votre contrat {police}. "
              "Tapez 1 pour payer maintenant, tapez 2 pour être rappelé par un conseiller.",
        "wo": "Asalaa maalekum {prenom}, NSIA Vie la. Des na {montant} FCFA ci sa contrat {police}. "
              "Bësal 1 ngir fey leegi, bësal 2 ngir benn conseiller woo la.",
    },
    "proposition_echeancier": {
        "fr": "{prenom}, votre contrat {police} protège votre avenir. Nous pouvons étudier avec vous "
              "un échéancier pour régler les {montant} FCFA restants. Répondez OUI pour être rappelé.",
        "wo": "{prenom}, sa contrat {police} dafa aar sa ëllëg. Mën nanu defar ak yow ab pexe ngir "
              "fey {montant} FCFA yi des. Tontul WAAW ngir ñu woo la.",
    },
    "transfert_conseiller": {
        "fr": "{prenom}, un conseiller NSIA Vie va vous appeler personnellement pour trouver "
              "une solution avec vous.",
        "wo": "{prenom}, benn conseiller NSIA Vie dina la woo ngir seet ak yow ab pexe.",
    },
}


def formater(cle: str, langue: str, **valeurs) -> str:
    modele = MESSAGES[cle].get(langue) or MESSAGES[cle]["fr"]
    if "montant" in valeurs:
        valeurs["montant"] = f"{valeurs['montant']:,}".replace(",", " ")
    return modele.format(**valeurs)
