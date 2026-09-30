import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/PageBanner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NDIMBAL_NSIA" },
      {
        name: "description",
        content:
          "Écrivez à un conseiller NSIA Vie Assurances Sénégal et choisissez votre canal de réponse : SMS, appel, vocal wolof ou e-mail.",
      },
      { property: "og:title", content: "Contact — NDIMBAL_NSIA" },
      {
        property: "og:description",
        content: "Contactez un conseiller NSIA Vie Assurances Sénégal à Dakar.",
      },
    ],
  }),
  component: Contact,
});

const canaux = ["SMS", "Appel", "Vocal wolof", "E-mail"];

function Contact() {

  return (
    <div>
    <PageBanner titre="Contact" />
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-muted-foreground">
        Écrivez-nous, un conseiller vous répond par le canal de votre choix.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_20rem]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Demande envoyée. Un conseiller vous répond sous 72 h.");
            (e.target as HTMLFormElement).reset();
          }}
          className="rounded-md border border-border bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Champ id="nom" label="Nom complet" required />
            <Champ id="email" label="E-mail" type="email" required />
            <Champ id="tel" label="Téléphone" type="tel" required />
            <Champ id="police" label="Numéro de police (optionnel)" />
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors duration-200 focus:border-primary"
            />
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium">Me répondre par</legend>
            <div className="mt-2 flex flex-wrap gap-4">
              {canaux.map((c, i) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="canal"
                    value={c}
                    defaultChecked={i === 0}
                    className="accent-primary"
                  />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-6 w-full rounded-md press bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover sm:w-auto"
          >
            Envoyer ma demande
          </button>

        </form>

        <aside className="rounded-md border border-border bg-surface p-5 text-sm">
          <h2 className="text-base">NSIA Vie Assurances Sénégal</h2>
          <p className="mt-3 text-muted-foreground">
            Mermoz, Pyrotechnie N°75A, Dakar
          </p>
          <p className="tnum mt-2 text-muted-foreground">+221 33 889 60 20</p>
          <p className="mt-4 text-muted-foreground">
            Nous ne demandons jamais votre code secret ni votre code PIN Wave ou Orange Money.
          </p>
        </aside>
      </div>
    </div>
    </div>
  );
}

function Champ({
  id,
  label,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors duration-200 focus:border-primary"
      />
    </div>
  );
}
