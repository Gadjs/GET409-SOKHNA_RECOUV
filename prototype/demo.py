"""Démo Ndimbal sur des clients FICTIFS.

Lancer :  python demo.py
"""
from datetime import date, datetime

from ndimbal.escalade import comprendre
from ndimbal.modeles import Client, Contrat, Preferences
from ndimbal.orchestrateur import plan_du_jour

AUJOURD_HUI = datetime(2026, 10, 12, 10, 0)  # un lundi, 10 h

clients = [
    Client("C1", "Mame Diarra",
           Preferences(canal_prefere="vocal", langue="wo",
                       canaux_consentis=("vocal", "sms", "appel_auto"), heure_debut=19, heure_fin=21)),
    Client("C2", "Ibrahima",
           Preferences(canal_prefere="app", langue="fr", canaux_consentis=("app", "sms", "chatbot")),
           a_installe_app=True),
    Client("C3", "Awa",
           Preferences(canal_prefere="chatbot", langue="fr", canaux_consentis=("chatbot", "sms", "appel_auto"))),
    Client("C4", "Modou",
           Preferences(canal_prefere="sms", langue="wo", canaux_consentis=("sms",))),
]

contrats = [
    # Mame Diarra : 3 jours de retard, mais ne veut être contactée qu'entre 19 h et 21 h
    Contrat("POL-000111", clients[0], 15000, 9, montant_du=15000, date_echeance_impayee=date(2026, 10, 9)),
    # Ibrahima : à jour, échéance le 15 → rappel J-3 aujourd'hui dans l'app
    Contrat("POL-000222", clients[1], 25000, 15),
    # Awa : 7 jours de retard → appel automatique
    Contrat("POL-000333", clients[2], 10000, 5, montant_du=10000, date_echeance_impayee=date(2026, 10, 5)),
    # Modou : 30 jours de retard → transfert au conseiller
    Contrat("POL-000444", clients[3], 20000, 12, montant_du=40000, date_echeance_impayee=date(2026, 9, 12)),
]


def afficher_plan(moment: datetime) -> None:
    print(f"\n=== Plan du {moment:%d/%m/%Y à %Hh%M} ===")
    actions = plan_du_jour(contrats, moment)
    if not actions:
        print("  (aucune action)")
    for a in actions:
        drapeau = "  ⚠ CONSEILLER" if a.escalade else ""
        print(f"- [{a.canal} | {a.langue}] {a.police}{drapeau}\n    {a.texte}")


afficher_plan(AUJOURD_HUI)
afficher_plan(AUJOURD_HUI.replace(hour=19))  # Mame Diarra est joignable le soir

print("\n=== Messages reçus des clients ===")
for message in [
    "Combien je dois ce mois-ci ?",
    "Man, ñaata laa war ?",
    "J'ai déjà payé par Wave hier !",
    "Maa ngi sonn, ay weer yi dafa metti, duma mën a fey leegi.",
    "Je veux faire un rachat de mon contrat",
]:
    r = comprendre(message)
    suite = "→ transfert conseiller" if r["escalade"] else "→ réponse automatique"
    print(f"- « {message} »\n    {r['intention']} {suite}")
