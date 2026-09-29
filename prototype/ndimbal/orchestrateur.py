"""Orchestrateur : décide chaque jour quel message envoyer, à qui, par quel canal."""
from dataclasses import dataclass
from datetime import date, datetime, timedelta

from .messages import formater
from .modeles import Client, Contrat

# Canal de repli si le canal préféré n'est pas consenti ou indisponible.
ORDRE_REPLI = ("sms", "app", "appel_auto", "conseiller")

# Étapes du parcours : (jours de retard, clé du message, canal imposé ou None)
ETAPES_RETARD = (
    (30, "transfert_conseiller", "conseiller"),
    (15, "proposition_echeancier", None),
    (7, "appel_j_plus_7", "appel_auto"),
    (3, "rappel_j_plus_3", None),
)


@dataclass
class Action:
    police: str
    canal: str
    langue: str
    cle_message: str
    texte: str
    escalade: bool = False


def prochaine_echeance(contrat: Contrat, aujourd_hui: date) -> date:
    jour = min(contrat.jour_echeance, 28)
    candidate = aujourd_hui.replace(day=jour)
    if candidate < aujourd_hui:
        mois = aujourd_hui.month % 12 + 1
        annee = aujourd_hui.year + (aujourd_hui.month == 12)
        candidate = date(annee, mois, jour)
    return candidate


def choisir_canal(client: Client, canal_impose: str | None = None) -> str:
    """Canal imposé par l'étape s'il est consenti, sinon canal préféré, sinon repli."""
    prefs = client.preferences
    consentis = set(prefs.canaux_consentis) | {"conseiller"}  # un humain peut toujours rappeler
    if canal_impose and canal_impose in consentis:
        return canal_impose
    if prefs.canal_prefere in consentis:
        if prefs.canal_prefere == "app" and not client.a_installe_app:
            pass  # l'app n'est pas installée : on passe au repli
        else:
            return prefs.canal_prefere
    for canal in ORDRE_REPLI:
        if canal in consentis and not (canal == "app" and not client.a_installe_app):
            return canal
    return "conseiller"


def horaire_autorise(client: Client, moment: datetime) -> bool:
    prefs = client.preferences
    if not (prefs.heure_debut <= moment.hour < prefs.heure_fin):
        return False
    # Pas d'envoi le vendredi entre 13 h et 15 h (prière du vendredi).
    if moment.weekday() == 4 and 13 <= moment.hour < 15:
        return False
    return True


def action_du_jour(contrat: Contrat, moment: datetime) -> Action | None:
    aujourd_hui = moment.date()
    client = contrat.client
    langue = client.preferences.langue
    valeurs = {"prenom": client.prenom, "police": contrat.police_masquee()}

    retard = contrat.jours_de_retard(aujourd_hui)
    if retard > 0:
        for seuil, cle, canal_impose in ETAPES_RETARD:
            if retard == seuil:
                canal = choisir_canal(client, canal_impose)
                texte = formater(cle, langue, montant=contrat.montant_du, **valeurs)
                return Action(contrat.police, canal, langue, cle, texte,
                              escalade=(cle == "transfert_conseiller"))
        return None

    echeance = prochaine_echeance(contrat, aujourd_hui)
    if echeance - aujourd_hui == timedelta(days=3):
        canal = choisir_canal(client)
        texte = formater("rappel_j_moins_3", langue, montant=contrat.cotisation_mensuelle,
                         date=echeance.strftime("%d/%m"), **valeurs)
        return Action(contrat.police, canal, langue, "rappel_j_moins_3", texte)
    return None


def plan_du_jour(contrats: list[Contrat], moment: datetime) -> list[Action]:
    """Toutes les actions à mener maintenant, en respectant les horaires des clients."""
    actions = []
    for contrat in contrats:
        action = action_du_jour(contrat, moment)
        if action is None:
            continue
        if action.canal != "conseiller" and not horaire_autorise(contrat.client, moment):
            continue
        actions.append(action)
    return actions
