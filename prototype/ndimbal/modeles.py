"""Modèles de données de Ndimbal (données fictives uniquement)."""
from dataclasses import dataclass, field
from datetime import date

CANAUX = ("app", "chatbot", "sms", "appel_auto", "vocal", "conseiller")
LANGUES = ("fr", "wo")


@dataclass
class Preferences:
    canal_prefere: str = "sms"
    langue: str = "fr"
    canaux_consentis: tuple = ("sms",)
    heure_debut: int = 8   # heure locale à partir de laquelle on peut contacter
    heure_fin: int = 21    # heure locale après laquelle on ne contacte plus

    def __post_init__(self):
        if self.canal_prefere not in CANAUX:
            raise ValueError(f"Canal inconnu : {self.canal_prefere}")
        if self.langue not in LANGUES:
            raise ValueError(f"Langue inconnue : {self.langue}")
        inconnus = set(self.canaux_consentis) - set(CANAUX)
        if inconnus:
            raise ValueError(f"Canaux inconnus : {inconnus}")


@dataclass
class Client:
    identifiant: str
    prenom: str
    preferences: Preferences
    a_installe_app: bool = False


@dataclass
class Contrat:
    police: str
    client: Client
    cotisation_mensuelle: int          # en FCFA
    jour_echeance: int                 # jour du mois
    montant_du: int = 0                # arriérés en FCFA
    date_echeance_impayee: date | None = None  # plus ancienne échéance non payée
    historique: list = field(default_factory=list)

    def police_masquee(self) -> str:
        """On n'affiche que les 4 derniers chiffres dans les messages."""
        return "•••" + self.police[-4:]

    def jours_de_retard(self, aujourd_hui: date) -> int:
        if self.date_echeance_impayee is None or self.montant_du <= 0:
            return 0
        return (aujourd_hui - self.date_echeance_impayee).days
