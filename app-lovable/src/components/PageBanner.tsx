import { Link } from "@tanstack/react-router";

export function PageBanner({ titre }: { titre: string }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Accueil
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-foreground">{titre}</span>
        </nav>
        <h1 className="mt-2 text-3xl font-bold text-primary">
          {titre}
          <span className="ml-3 inline-block h-1 w-6 translate-y-[-0.3rem] rounded bg-gold align-middle" />
        </h1>
      </div>
    </section>
  );
}
