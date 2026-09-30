import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import type { QueryClient as QC } from "@tanstack/react-query";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NDIMBAL_NSIA" },
      {
        name: "description",
        content:
          "Suivi des cotisations NSIA Vie Assurances Sénégal : rappels avant échéance en français ou en wolof.",
      },
      { property: "og:title", content: "NDIMBAL_NSIA" },
      {
        property: "og:description",
        content: "Votre cotisation, sans oubli.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/cotisations", label: "Mes cotisations" },
  { to: "/contact", label: "Contact" },
] as const;

const INACTIVITE_MS = 15 * 60 * 1000;

function useSession(queryClient: QC) {
  const router = useRouter();
  const navigate = useNavigate();
  const [connecte, setConnecte] = useState(false);

  const deconnecter = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/connexion", replace: true });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setConnecte(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setConnecte(!!session);
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  useEffect(() => {
    if (!connecte) return;
    let t: ReturnType<typeof setTimeout>;
    const relancer = () => {
      clearTimeout(t);
      t = setTimeout(() => void deconnecter(), INACTIVITE_MS);
    };
    const evts = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
    evts.forEach((e) => window.addEventListener(e, relancer, { passive: true }));
    relancer();
    return () => {
      clearTimeout(t);
      evts.forEach((e) => window.removeEventListener(e, relancer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connecte]);

  return { connecte, deconnecter };
}

function SiteHeader({ connecte, onDeconnexion }: { connecte: boolean; onDeconnexion: () => void }) {
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  useEffect(() => {
    const f = () => setDefile(window.scrollY > 4);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-surface px-4 py-1 text-center text-xs text-muted-foreground">
        Prototype académique – GET409 Swiss UMEF – non officiel
      </div>
      <div
        className={
          "border-b bg-background transition-colors duration-200 " +
          (defile ? "border-border" : "border-transparent")
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <span aria-hidden="true">🛡️</span>
            NSIA Vie · Ndimbal
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="nav-link text-sm text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{ className: "font-semibold text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {connecte && (
              <button
                type="button"
                onClick={onDeconnexion}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Se déconnecter
              </button>
            )}
            <button
              type="button"
              className="press rounded-md border border-border px-3 py-2 text-sm md:hidden"
              aria-label="Ouvrir le menu"
              onClick={() => setOuvert(true)}
            >
              Menu
            </button>
          </div>
        </div>
      </div>
      {ouvert && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="fade-soft absolute inset-0 bg-foreground/40" onClick={() => setOuvert(false)} />
          <nav className="panel-in absolute right-0 top-0 flex h-full w-72 flex-col bg-background p-6 shadow-lg">
            <button
              type="button"
              onClick={() => setOuvert(false)}
              className="press self-end rounded-md border border-border px-3 py-2 text-sm"
            >
              Fermer
            </button>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOuvert(false)}
                activeOptions={{ exact: l.to === "/" }}
                className="border-b border-border py-4 text-foreground"
                activeProps={{ className: "font-semibold text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Titre({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-lg font-bold">
      {children}
          </h3>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy-deep text-navy-deep-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Titre>Adresse</Titre>
          <p className="mt-4 opacity-80">Mermoz, Pyrotechnie N°75A, Dakar</p>
        </div>
        <div>
          <Titre>Contact</Titre>
          <p className="tnum mt-4 opacity-80">+221 33 889 60 20</p>
        </div>
        <div>
          <Titre>Liens</Titre>
          <ul className="mt-4 space-y-2 opacity-80">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/mentions-legales" className="hover:underline">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <Titre>Réseaux sociaux</Titre>
          <div className="mt-4 flex gap-3">
            {[
              { l: "Facebook", i: <Facebook className="h-4 w-4" /> },
              { l: "Instagram", i: <Instagram className="h-4 w-4" /> },
              { l: "LinkedIn", i: <Linkedin className="h-4 w-4" /> },
            ].map((r) => (
              <a
                key={r.l}
                href="#"
                aria-label={r.l}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary transition-colors hover:bg-primary-hover"
              >
                {r.i}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-navy-deep-foreground/15 py-4 text-center text-sm opacity-70">
        © 2026 NDIMBAL_NSIA – prototype non officiel
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { connecte, deconnecter } = useSession(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader connecte={connecte} onDeconnexion={() => void deconnecter()} />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster position="bottom-center" duration={4000} />
      </div>
    </QueryClientProvider>
  );
}

