import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageBanner } from "@/components/PageBanner";
import { NdimbalAsk } from "@/components/NdimbalAsk";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/cotisations")({
  head: () => ({
    meta: [
      { title: "Mes cotisations — NDIMBAL_NSIA" },
      {
        name: "description",
        content:
          "Consultez vos contrats NSIA Vie, votre prime mensuelle et votre solde dû, et réglez par Wave ou Orange Money.",
      },
      { property: "og:title", content: "Mes cotisations — NDIMBAL_NSIA" },
      {
        property: "og:description",
        content: "Contrats NSIA Vie, prime mensuelle, solde dû et statut de paiement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cotisations,
});

type Contrat = {
  nom: string;
  police: string;
  zone: string;
  produit: string;
  prime: number;
  solde: number;
};

async function chargerContrats(): Promise<Contrat[]> {
  const [{ data: profil }, { data: rows, error }] = await Promise.all([
    supabase.from("profiles").select("prenom, nom").maybeSingle(),
    supabase.from("contrats").select("numero_police, produit, prime, zone, cotisations(montant, statut)").order("numero_police"),
  ]);
  if (error) throw error;
  const nom = profil ? `${profil.prenom} ${profil.nom}`.trim() : "";
  return (rows ?? []).map((r) => ({
    nom,
    police: r.numero_police,
    zone: r.zone ?? "—",
    produit: r.produit,
    prime: r.prime,
    solde: (r.cotisations ?? []).filter((c) => c.statut === "en retard").reduce((t, c) => t + c.montant, 0),
  }));
}

const filtres = ["Tous", "NSIA Études", "NSIA Retraite", "NSIA Épargne"] as const;

const fcfa = (n: number) => `${n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;

function Statut({ enRetard }: { enRetard: boolean }) {
  return (
    <span
      className={
        "inline-flex min-w-24 items-center justify-center gap-2 whitespace-nowrap rounded px-3 py-1.5 text-[13px] font-medium " +
        (enRetard
          ? "bg-status-late-surface text-status-late"
          : "bg-status-ok-surface text-status-ok")
      }
    >
      <span className={"h-1.5 w-1.5 shrink-0 rounded-full bg-current" + (enRetard ? " dot-pulse" : "")} aria-hidden="true" />
      {enRetard ? "En retard" : "À jour"}
    </span>
  );
}

function Cotisations() {
  const [filtre, setFiltre] = useState<(typeof filtres)[number]>("Tous");
  const [info, setInfo] = useState<null | { titre: string; texte: string }>(null);
  const { data: contrats = [] } = useQuery({ queryKey: ["mes-contrats"], queryFn: chargerContrats });

  const liste = contrats.filter((c) => filtre === "Tous" || c.produit.includes(filtre.replace("NSIA ", "")));

  const payer = (c: Contrat) =>
    setInfo({
      titre: "Payer par Wave / Orange Money",
      texte: `Prototype : aucun paiement réel. Dans l'application Wave ou Orange Money, vous payeriez ${fcfa(c.solde)} pour la police ${c.police}. Aucun code secret ne vous sera demandé.`,
    });

  const promettre = (c: Contrat) =>
    toast.success(`Promesse enregistrée pour ${c.police}. Un conseiller vous rappellera.`);

  const aJour = contrats.filter((c) => c.solde === 0).length;
  const totalDu = contrats.reduce((t, c) => t + c.solde, 0);

  return (
    <div>
      <PageBanner titre="Mes cotisations" />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { l: "Contrats à jour", v: String(aJour) },
            { l: "Contrats en retard", v: String(contrats.length - aJour) },
            { l: "Total des soldes dus", v: fcfa(totalDu), gold: true },
          ].map((b) => (
            <div key={b.l} className="rounded-md border border-border bg-card p-4 shadow-[var(--shadow-card)]">
              <p className="text-sm text-muted-foreground">{b.l}</p>
              <p className={"tnum mt-1 text-2xl font-semibold " + (b.gold ? "text-foreground" : "text-foreground")}>{b.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {filtres.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFiltre(f)}
                className={
                  "press h-10 rounded-md border px-3 text-sm duration-200 " +
                  (filtre === f
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-background text-foreground hover:bg-surface")
                }
              >
                {f}
              </button>
            ))}
          </div>
          <p className="shrink-0 pb-2 text-sm font-medium text-muted-foreground">
            {liste.length} {liste.length === 1 ? "contrat" : "contrats"}
          </p>
        </div>

        <NdimbalAsk />

        <p className="mt-6 text-xs text-muted-foreground">Données de démonstration</p>

        <div className="mt-3 hidden overflow-x-auto rounded-md border border-border md:block">
          <table className="w-full min-w-[1120px] border-collapse text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left">Police</th>
                <th className="px-4 py-3 text-left">Assuré</th>
                <th className="px-4 py-3 text-left">Zone</th>
                <th className="px-4 py-3 text-left">Produit</th>
                <th className="px-4 py-3 text-right">Prime</th>
                <th className="px-4 py-3 text-right">Solde dû</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody key={filtre} className="fade-soft">
              {liste.map((c) => {
                const enRetard = c.solde > 0;
                return (
                  <tr key={c.police} className="h-18 border-b border-border last:border-b-0 transition-colors duration-200 hover:bg-surface">
                    <td className="tnum whitespace-nowrap px-4 py-3 align-middle font-medium">{c.police}</td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle font-medium">{c.nom}</td>
                    <td className="px-4 py-3 align-middle">{c.zone}</td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle">{c.produit}</td>
                    <td className="tnum whitespace-nowrap px-4 py-3 text-right align-middle">{fcfa(c.prime)}</td>
                    <td className={"tnum whitespace-nowrap px-4 py-3 text-right align-middle font-semibold " + (enRetard ? "text-status-late" : "text-muted-foreground")}>
                      {fcfa(c.solde)}
                    </td>
                    <td className="px-4 py-3 text-center align-middle"><Statut enRetard={enRetard} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-middle">
                      {enRetard ? (
                        <div className="inline-flex items-center justify-end gap-3">
                          <button type="button" onClick={() => payer(c)} className="rounded-md press bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Payer</button>
                          <button type="button" onClick={() => promettre(c)} className="text-sm text-primary underline underline-offset-4">Promettre une date</button>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div key={filtre} className="fade-soft mt-3 grid grid-cols-1 gap-4 md:hidden">
          {liste.map((c) => {
            const enRetard = c.solde > 0;
            return (
              <article key={c.police} className="rounded-md border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-surface">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="min-w-0 font-semibold">{c.nom}</h2>
                  <Statut enRetard={enRetard} />
                </div>
                <p className="tnum mt-2 text-sm text-muted-foreground">Police {c.police} · {c.produit}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <div><dt className="text-muted-foreground">Zone</dt><dd className="mt-1">{c.zone}</dd></div>
                  <div><dt className="text-muted-foreground">Prime</dt><dd className="tnum mt-1 whitespace-nowrap">{fcfa(c.prime)}</dd></div>
                  <div className="col-span-2"><dt className="text-muted-foreground">Solde dû</dt><dd className={"tnum mt-1 whitespace-nowrap font-semibold " + (enRetard ? "text-status-late" : "text-muted-foreground")}>{fcfa(c.solde)}</dd></div>
                </dl>
                {enRetard && (
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                    <button type="button" onClick={() => payer(c)} className="min-h-11 rounded-md press bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Payer</button>
                    <button type="button" onClick={() => promettre(c)} className="min-h-11 rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary">Promettre une date</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
      {info && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4"
          onClick={() => setInfo(null)}
        >
          <div className="w-full max-w-md rounded-lg bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-primary">{info.titre}</h2>
            <p className="mt-3 text-sm text-foreground/80">{info.texte}</p>
            <button
              type="button"
              onClick={() => setInfo(null)}
              className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
