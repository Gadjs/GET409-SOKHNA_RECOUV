#!/bin/bash
# Lance NDIMBAL_NSIA en local (VS Code) avec les variables serveur.
# .env        : clés publiques Supabase (déjà présent, vient de Lovable)
# .env.local  : ta clé Dify (privée, jamais envoyée sur GitHub grâce à *.local dans .gitignore)
cd "$(dirname "$0")"
set -a
[ -f .env ] && source .env
[ -f .env.local ] && source .env.local
set +a
if [ -z "$DIFY_API_KEY" ]; then
  echo "⚠  DIFY_API_KEY manquante : crée le fichier .env.local (voir .env.local.example)."
  echo "   Le site démarre quand même, mais Ndimbal répondra « Service temporairement indisponible »."
fi
npm run dev
