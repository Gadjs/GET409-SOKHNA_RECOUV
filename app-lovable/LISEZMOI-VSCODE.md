# NDIMBAL_NSIA — de Lovable à VS Code (GET 409, séance 7)

Code source récupéré depuis le dépôt GitHub synchronisé par Lovable
(`Gadjs/pixel-perfect-render-8463`, branche `main`, commit a3a3133).

## Lancer le projet

1. Ouvrir ce dossier dans VS Code (Fichier → Ouvrir le dossier).
2. Terminal (Ctrl + `) :
   ```bash
   npm install
   cp .env.local.example .env.local   # puis coller ta clé Dify dans .env.local
   ./dev-local.sh
   ```
3. Ouvrir http://localhost:8080 et se connecter avec un compte de test.

Pourquoi `./dev-local.sh` plutôt que `npm run dev` : en local, les variables serveur
(`DIFY_API_KEY`, `SUPABASE_URL`…) ne sont pas lues automatiquement dans `.env`.
Le script les charge avant de démarrer Vite.

## Où est quoi

| Fichier | Rôle |
|---|---|
| `src/routes/_authenticated/cotisations.tsx` | Page Mes cotisations |
| `src/components/NdimbalAsk.tsx` | Encadré « Posez votre question à Ndimbal » |
| `src/lib/ndimbal.functions.ts` | Webhook Dify (server function, clé côté serveur) |
| `src/routes/connexion.tsx` | Page de connexion |
| `src/integrations/supabase/` | Connexion à la base (Lovable Cloud / Supabase) |
| `supabase/migrations/` | Tables contrats, cotisations, profils + règles d'accès |
| `src/styles.css` | Couleurs NSIA (#2B2B5E, #D5A00A) |

## Relier ce dossier à GitHub (pour que Lovable voie tes modifications)

```bash
git init
git remote add origin https://github.com/Gadjs/pixel-perfect-render-8463.git
git fetch origin
git reset origin/main        # rattache le dossier à l'historique, sans toucher aux fichiers
git status                   # seuls dev-local.sh, .env.local.example, LISEZMOI-VSCODE.md apparaissent
```
Puis, après chaque modification : `git add .` → `git commit -m "…"` → `git push`.
Lovable récupère automatiquement ce qui est poussé sur `main`.

⚠ Ne jamais mettre la clé Dify dans `.env` : ce fichier est suivi par Git.
