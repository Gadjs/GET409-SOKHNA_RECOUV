import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, CountUp } from "@/components/Reveal";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "NDIMBAL_NSIA — Bienvenue, dalal ak jamm" },
      {
        name: "description",
        content:
          "Ndimbal vous prévient avant chaque échéance NSIA Vie, en français ou en wolof. Paiement par Wave, Orange Money ou en agence.",
      },
      { property: "og:title", content: "NDIMBAL_NSIA — Bienvenue, dalal ak jamm" },
      {
        property: "og:description",
        content: "Rappels avant échéance en français ou en wolof pour les assurés NSIA Vie.",
      },
    ],
  }),
  component: Accueil,
});

const etapes = [
  { t: "Rappel", d: "SMS, appel ou message vocal dès J-3." },
  { t: "Paiement", d: "Wave, Orange Money ou en agence." },
  { t: "Suivi", d: "Situation à jour, promesse de paiement, conseiller." },
];

const chiffres = [
  { n: 20, s: " ans", l: "au service des assurés (depuis 2005)" },
  { n: 72, s: " h", l: "de traitement en moyenne" },
  { n: 6, s: "", l: "canaux de contact, dont le vocal en wolof" },
];

const faq = [
  {
    q: "Comment payer ma cotisation par Wave ?",
    r: "Ouvrez Wave, choisissez « Payer », puis NSIA Vie. Indiquez votre numéro de police et le montant. Nous ne vous demandons jamais votre code secret.",
  },
  {
    q: "Que se passe-t-il si je paie en retard ?",
    r: "Vous recevez un rappel. Sans paiement, votre contrat peut être suspendu. Vous pouvez promettre une date de paiement depuis Mes cotisations.",
  },
  {
    q: "Puis-je recevoir mes rappels en wolof ?",
    r: "Oui. Choisissez le message vocal en wolof. Vous pouvez changer de langue à tout moment.",
  },
  {
    q: "Comment parler à un conseiller ?",
    r: "Remplissez le formulaire de contact ou appelez le +221 33 889 60 20. Un conseiller vous répond sous 72 h.",
  },
];

function Accueil() {
  return (
    <div>
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr] md:py-20">
          <div>
            <h1 className="text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              BIENVENUE — <span className="text-primary">DALAL AK JAMM</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/75">
              Avec Ndimbal, vous êtes prévenu avant chaque échéance, en français ou en wolof, et
              vous payez par Wave, Orange Money ou en agence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cotisations"
                className="press inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Vérifier ma situation
              </Link>
              <Link
                to="/contact"
                className="press inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 font-semibold text-foreground hover:bg-surface"
              >
                Parler à un conseiller
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase text-muted-foreground">Mes cotisations</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="font-semibold">Fatou Diop</p>
              <span className="inline-flex items-center gap-2 rounded bg-status-ok-surface px-3 py-1.5 text-[13px] font-medium text-status-ok">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />À jour
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Police POL002 · NSIA Études</p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Prime mensuelle</p>
              <p className="tnum mt-1 text-2xl font-semibold text-foreground">30 000 FCFA</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <Reveal className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl text-foreground">Votre parcours cotisation</h2>
          <ol className="relative mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <span aria-hidden="true" className="absolute left-5 top-5 bottom-5 w-px bg-border md:bottom-auto md:left-[16.66%] md:right-[16.66%] md:h-px md:w-auto" />
            {etapes.map((e, i) => (
              <li key={e.t} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg text-foreground md:mt-3">{e.t}</h3>
                  <p className="mt-1 text-foreground/70">{e.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="bg-background">
        <Reveal className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border px-4 py-14 text-center md:grid-cols-3 md:divide-x md:divide-y-0">
          {chiffres.map((c) => (
            <div key={c.l} className="px-6 py-6 md:py-0">
              <p className="text-5xl font-semibold text-gold">
                <CountUp value={c.n} suffix={c.s} />
              </p>
              <p className="mt-2 text-muted-foreground">{c.l}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="bg-surface">
        <Reveal className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl text-foreground">Questions fréquentes</h2>
          <div className="mt-8 space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                  {f.q}
                  <span className="text-xl text-primary transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-foreground/75">{f.r}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
