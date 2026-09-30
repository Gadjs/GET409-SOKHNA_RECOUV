import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — NDIMBAL_NSIA" },
      {
        name: "description",
        content:
          "Mentions légales du prototype académique NDIMBAL_NSIA, réalisé dans le cadre du cours GET409 Swiss UMEF.",
      },
      { property: "og:title", content: "Mentions légales — NDIMBAL_NSIA" },
      {
        property: "og:description",
        content: "Prototype académique non officiel, données de démonstration.",
      },
    ],
  }),
  component: Mentions,
});

function Mentions() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl">Mentions légales</h1>
      <div className="mt-6 space-y-4 text-sm text-muted-foreground">
        <p>
          NDIMBAL_NSIA est un prototype académique réalisé dans le cadre du cours GET409 à Swiss
          UMEF. Ce site n'est pas un service officiel de NSIA Vie Assurances Sénégal.
        </p>
        <p>
          Les contrats, montants et statuts présentés sont des données de démonstration. Aucun
          paiement réel n'est traité et aucun code secret n'est demandé.
        </p>
        <p>
          Pour toute démarche réelle, adressez-vous à NSIA Vie Assurances Sénégal, Mermoz,
          Pyrotechnie N°75A, Dakar, au +221 33 889 60 20.
        </p>
      </div>
    </div>
  );
}
