# Ndimbal — Assistant client multicanal NSIA Vie

*Ndimbal* signifie « aide » en wolof.

Projet de recouvrement pour **NSIA Vie Assurances**, dans le cadre du cours GET 409 Atelier IA (Master 1, Swiss UMEF University, Dakar). Ndimbal est un module à ajouter à l'**application client NSIA existante** (créée par l'IT) : chaque assuré choisit comment il veut être informé, rappelé et accompagné sur ses cotisations.

## HMW définitif

> **« Comment pourrions-nous permettre à chaque assuré de NSIA Vie d'être informé, rappelé et accompagné sur ses cotisations par le moyen qu'il comprend et préfère (écrit ou oral, français ou wolof), afin qu'il reste à jour de ses versements et conserve son contrat ? »**

## Le client choisit son canal

| Canal | Pour qui |
|---|---|
| 📱 **Application** | Clients autonomes numériquement |
| 💬 **Chatbot** | Poser directement une question (« Combien je dois ? ») |
| 📩 **SMS** | Recevoir des informations simples, même sur un téléphone basique |
| 📞 **Appel automatique** | Rappels et notifications importantes |
| 🗣️ **Assistant vocal français / wolof** | Clients qui préfèrent communiquer oralement |
| 👨🏽‍💼 **Conseiller NSIA** | Demandes complexes : difficulté, rachat, réclamation, décès |

Détails : [docs/canaux.md](docs/canaux.md) · Parcours J-3 → J+30 : [docs/parcours-recouvrement.md](docs/parcours-recouvrement.md)

## Persona

**Mame Diarra**, 46 ans, vendeuse de tissus au marché HLM. Contrat d'épargne pour les études de ses enfants, paie par Wave, préfère les messages vocaux en wolof, n'a jamais ouvert l'application NSIA.

**Insight :** le client ne refuse pas de payer ; le bon message envoyé par le mauvais canal est un message perdu.

## Équipe

| Membre | Rôles | Contact |
|---|---|---|
| Sokhna GADIAGA | Chef de Produit · Master Prompt Engineer · Dev UI · Responsable Impact | gadiagasokhnaawa28@gmail.com |

## Structure du dépôt

```
ndimbal-nsia/
├── README.md
├── fiche-equipe.md
├── carte-empathie.md            (S1)
├── guide-interview.md           (S1)
├── hmw.md                       (S1)
├── journal-prompts.md           (S1)
├── docs/
│   ├── chapeaux-bono.md         (S2)
│   ├── vpc.md                   (S2)
│   ├── hmw-definitif.md         (S2)
│   ├── journal-prompts-s2.md    (S2)
│   ├── pitch-hmw.md             (S2)
│   ├── canaux.md                les 6 canaux et les règles d'escalade
│   ├── parcours-recouvrement.md le parcours J-3 → J+30
│   ├── architecture.md          intégration à l'app NSIA existante
│   ├── confidentialite.md       données personnelles et éthique
│   └── assets/                  PDF et images
├── prototype/                   prototype Python V0 + tests
└── app-lovable/                 app Lovable (TanStack Start + Supabase + Dify), voir LISEZMOI-VSCODE.md
```

## Prototype

```bash
cd prototype
python3 demo.py
python3 -m unittest discover -s tests -v
```

Voir [prototype/README.md](prototype/README.md).

## Feuille de route

| Étape | Contenu | Statut |
|---|---|---|
| S1 | Carte d'empathie, guide d'interview, HMW | ✅ |
| S2 | 6 chapeaux, VPC, HMW définitif, journal de prompts, pitch | ✅ |
| V0 | Prototype : préférences, orchestrateur, messages FR / wolof, escalade | ✅ (données fictives) |
| S3 | Agent Dify : compréhension des questions clients | ⏳ |
| S4 | Écrans du module dans l'app (Bolt.new) | ⏳ |
| V1 | Vocal wolof enregistré, appel automatique | ⏳ |
| V2 | Assistant vocal qui comprend le wolof parlé | ⏳ |

## Lien avec RecouvIA
[RecouvIA](https://github.com/Gadjs/GET409-SOKHNA_SOLO) outille la chargée de recouvrement : **qui** relancer et **quand**. Ndimbal outille le client : **comment** il reçoit la relance et comment il y répond.

## Confidentialité
Dépôt public : **aucune donnée réelle de client**. Tous les exemples sont fictifs. Voir [docs/confidentialite.md](docs/confidentialite.md).
