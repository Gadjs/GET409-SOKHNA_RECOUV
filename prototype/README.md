# Prototype Ndimbal (V0)

Petit prototype Python, **sans dépendance externe**, qui montre la logique de Ndimbal sur des clients fictifs :

- `ndimbal/modeles.py` : clients, préférences de contact (canal, langue, horaires, consentement), contrats ;
- `ndimbal/orchestrateur.py` : choix du message du jour (J-3, J+3, J+7, J+15, J+30), du canal (préféré puis repli) et respect des horaires ;
- `ndimbal/messages.py` : modèles de messages en français et en wolof (**wolof à faire relire par une personne wolophone**) ;
- `ndimbal/escalade.py` : compréhension simple des messages clients et transfert au conseiller pour les cas sensibles.

## Lancer

```bash
cd prototype
python3 demo.py                              # démonstration
python3 -m unittest discover -s tests -v     # 13 tests
```

Python 3.10 ou plus récent.

## Limites de la V0
- Les envois sont simulés (affichés à l'écran) : pas encore de connexion SMS, WhatsApp ou serveur vocal.
- Pour le canal « vocal », le texte affiché est le script à enregistrer ou à synthétiser.
- La compréhension des messages repose sur des mots-clés ; elle sera remplacée par un agent IA (Dify, S3) qui renvoie le même format `{"intention", "escalade"}`.
- Un paiement contesté déclenche d'abord une vérification automatique ; si le paiement n'est pas retrouvé, le cas passe au conseiller (à implémenter avec les données Wave / OM).
