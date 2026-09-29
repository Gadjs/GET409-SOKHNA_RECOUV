"""Compréhension simple des messages clients et règles d'escalade.

Version V0 par mots-clés (français + quelques mots wolof). En S3, cette
brique sera remplacée par un agent IA (Dify) qui renvoie le même format.
"""
import unicodedata

INTENTIONS = {
    "DIFFICULTE": ["difficulte", "perdu mon travail", "chomage", "malade", "pas d'argent",
                   "ne peux plus payer", "jafe", "metti", "duma men a fey", "amuma xaalis"],
    "DECES": ["deces", "decede", "mort", "faatu"],
    "RACHAT": ["rachat", "racheter", "resilier", "resiliation", "arreter mon contrat"],
    "RECLAMATION": ["reclamation", "plainte", "pas normal", "arnaque"],
    "PAIEMENT_CONTESTE": ["deja paye", "j'ai paye", "fey naa", "paye hier", "paye par wave"],
    "PARLER_HUMAIN": ["conseiller", "quelqu'un", "un humain", "appelez-moi", "woo ma"],
    "SITUATION": ["combien", "je dois", "montant", "situation", "echeance", "naata", "nyaata"],
}

# Intentions qui exigent toujours un humain.
A_ESCALADER = {"DIFFICULTE", "DECES", "RACHAT", "RECLAMATION", "PARLER_HUMAIN"}

ORDRE_PRIORITE = ["DECES", "DIFFICULTE", "RACHAT", "RECLAMATION",
                  "PAIEMENT_CONTESTE", "PARLER_HUMAIN", "SITUATION"]


def _normaliser(texte: str) -> str:
    texte = texte.lower().replace("ñ", "ny")
    texte = unicodedata.normalize("NFD", texte)
    return "".join(c for c in texte if unicodedata.category(c) != "Mn")


def comprendre(message: str, tentatives_echouees: int = 0) -> dict:
    texte = _normaliser(message)
    trouvees = {i for i, mots in INTENTIONS.items() if any(m in texte for m in mots)}
    intention = next((i for i in ORDRE_PRIORITE if i in trouvees), "AUTRE")

    escalade = intention in A_ESCALADER
    if intention == "AUTRE" and tentatives_echouees >= 1:
        escalade = True  # 2e incompréhension : on passe la main à un humain

    return {"intention": intention, "escalade": escalade}
