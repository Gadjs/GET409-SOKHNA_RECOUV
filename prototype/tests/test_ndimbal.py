import sys
import unittest
from datetime import date, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from ndimbal.escalade import comprendre
from ndimbal.modeles import Client, Contrat, Preferences
from ndimbal.orchestrateur import choisir_canal, horaire_autorise, plan_du_jour


def client(**prefs):
    installe = prefs.pop("app", False)
    return Client("X", "Test", Preferences(**prefs), a_installe_app=installe)


class TestCanal(unittest.TestCase):
    def test_canal_prefere_consenti(self):
        c = client(canal_prefere="vocal", canaux_consentis=("vocal", "sms"))
        self.assertEqual(choisir_canal(c), "vocal")

    def test_repli_si_app_non_installee(self):
        c = client(canal_prefere="app", canaux_consentis=("app", "sms"))
        self.assertEqual(choisir_canal(c), "sms")

    def test_canal_impose_non_consenti(self):
        c = client(canal_prefere="sms", canaux_consentis=("sms",))
        self.assertEqual(choisir_canal(c, "appel_auto"), "sms")

    def test_preference_invalide(self):
        with self.assertRaises(ValueError):
            Preferences(canal_prefere="pigeon")


class TestHoraires(unittest.TestCase):
    def test_pas_la_nuit(self):
        c = client()
        self.assertFalse(horaire_autorise(c, datetime(2026, 10, 12, 22, 0)))

    def test_pas_vendredi_priere(self):
        c = client()
        self.assertFalse(horaire_autorise(c, datetime(2026, 10, 16, 14, 0)))  # vendredi
        self.assertTrue(horaire_autorise(c, datetime(2026, 10, 16, 16, 0)))


class TestParcours(unittest.TestCase):
    def test_rappel_j_moins_3(self):
        c = client(canal_prefere="sms", canaux_consentis=("sms",))
        contrat = Contrat("POL-123456", c, 10000, 15)
        actions = plan_du_jour([contrat], datetime(2026, 10, 12, 10))
        self.assertEqual(actions[0].cle_message, "rappel_j_moins_3")
        self.assertIn("•••3456", actions[0].texte)
        self.assertNotIn("POL-123456", actions[0].texte)

    def test_j_plus_30_escalade(self):
        c = client(canal_prefere="sms", canaux_consentis=("sms",))
        contrat = Contrat("POL-1", c, 10000, 12, montant_du=20000, date_echeance_impayee=date(2026, 9, 12))
        action = plan_du_jour([contrat], datetime(2026, 10, 12, 10))[0]
        self.assertEqual(action.canal, "conseiller")
        self.assertTrue(action.escalade)

    def test_wolof(self):
        c = client(canal_prefere="sms", langue="wo", canaux_consentis=("sms",))
        contrat = Contrat("POL-1", c, 10000, 9, montant_du=10000, date_echeance_impayee=date(2026, 10, 9))
        action = plan_du_jour([contrat], datetime(2026, 10, 12, 10))[0]
        self.assertIn("Asalaa maalekum", action.texte)


class TestEscalade(unittest.TestCase):
    def test_situation_sans_escalade(self):
        self.assertEqual(comprendre("Combien je dois ?"),
                         {"intention": "SITUATION", "escalade": False})

    def test_situation_wolof(self):
        self.assertEqual(comprendre("Man, ñaata laa war ?")["intention"], "SITUATION")

    def test_difficulte_escalade(self):
        r = comprendre("J'ai perdu mon travail, je ne peux plus payer")
        self.assertTrue(r["escalade"])

    def test_incomprehension_deux_fois(self):
        self.assertFalse(comprendre("bla bla")["escalade"])
        self.assertTrue(comprendre("bla bla", tentatives_echouees=1)["escalade"])


if __name__ == "__main__":
    unittest.main()
