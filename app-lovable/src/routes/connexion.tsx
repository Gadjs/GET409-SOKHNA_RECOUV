import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageBanner } from "@/components/PageBanner";

export const Route = createFileRoute("/connexion")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Connexion — NDIMBAL_NSIA" },
      { name: "description", content: "Connectez-vous à votre espace assuré NSIA Vie · Ndimbal." },
      { property: "og:title", content: "Connexion — NDIMBAL_NSIA" },
      { property: "og:description", content: "Espace assuré NSIA Vie · Ndimbal : connexion sécurisée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Connexion,
});

const champ =
  "mt-1 block h-11 w-full rounded-md border border-border bg-background px-3 text-foreground outline-none transition-colors duration-200 focus:border-primary";

function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState("");
  const [charge, setCharge] = useState(false);

  const envoyer = async (e: FormEvent) => {
    e.preventDefault();
    setErreur("");
    setCharge(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: mdp });
    setCharge(false);
    if (error) {
      setErreur("E-mail ou mot de passe incorrect.");
      return;
    }
    navigate({ to: "/", replace: true });
  };

  return (
    <div>
      <PageBanner titre="Connexion" />
      <div className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={envoyer} className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <label className="block text-sm font-medium text-foreground">
            E-mail
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={champ} />
          </label>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Mot de passe
            <input type="password" required autoComplete="current-password" value={mdp} onChange={(e) => setMdp(e.target.value)} className={champ} />
          </label>
          {erreur && (
            <p role="alert" className="mt-4 rounded-md bg-status-late-surface px-3 py-2 text-sm text-status-late">{erreur}</p>
          )}
          <button
            type="submit"
            disabled={charge}
            className="press mt-6 w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
          >
            {charge ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Bientôt : connexion par numéro de téléphone et code SMS
        </p>
      </div>
    </div>
  );
}
