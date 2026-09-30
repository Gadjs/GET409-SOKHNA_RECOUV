import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { askNdimbal } from "@/lib/ndimbal.functions";
import bannerAsset from "@/assets/nsia-ndimbal-banner.jpg.asset.json";

const suggestions = ["Combien je dois ?", "Comment payer par Wave ?", "Je n'arrive plus à payer"];

type MarkdownBlock =
  | { type: "paragraph" | "heading"; text: string }
  | { type: "list"; items: string[] };

function inlineMarkdown(text: string) {
  const cleanText = text.replace(/(^|\s)#{1,6}\s*/g, "$1").replace(/\*{3,}/g, "**");
  return cleanText.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={`${part}-${index}`}>{part.replace(/\*/g, "")}</span>
    ),
  );
}

function parseMarkdown(text: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)/);
    const bulletText = bullet?.[1];
    if (bulletText) {
      listItems.push(bulletText);
      continue;
    }
    flushList();
    const heading = line.match(/^#{1,6}\s+(.+)/);
    blocks.push({ type: heading ? "heading" : "paragraph", text: heading?.[1] ?? line });
  }
  flushList();
  return blocks;
}

function MarkdownResponse({ text }: { text: string }) {
  return (
    <div className="mt-3 space-y-2 text-sm leading-6 text-foreground">
      {parseMarkdown(text).map((block, index) => {
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="ml-5 list-disc space-y-1 marker:text-gold">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{inlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "heading") {
          return <p key={`heading-${index}`} className="font-semibold text-primary">{inlineMarkdown(block.text)}</p>;
        }
        return <p key={`paragraph-${index}`}>{inlineMarkdown(block.text)}</p>;
      })}
    </div>
  );
}

export function NdimbalAsk() {
  const ask = useServerFn(askNdimbal);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [rep, setRep] = useState<null | { text: string; muted: boolean; transfert: boolean }>(null);
  const [rappel, setRappel] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const envoyer = async () => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setErr(null);
    setRep(null);
    setRappel(false);
    try {
      const r = await ask({ data: { query: q.trim() } });
      if (r.ok) setRep({ text: r.text, muted: r.erreurMetier, transfert: r.transfert });
      else setErr(r.error);
    } catch {
      setErr("Service temporairement indisponible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="mt-8 overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="relative h-[120px] overflow-hidden rounded-t-md">
        <img
          src={bannerAsset.url}
          alt="Univers NSIA Vie Assurances"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/85" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center px-5 sm:px-7">
          <h2 className="text-xl font-semibold text-primary-foreground sm:text-2xl">Posez votre question à Ndimbal</h2>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <p className="text-sm leading-6 text-muted-foreground">
          Situation de votre contrat, montant dû, moyens de paiement — réponse en quelques secondes.
        </p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            envoyer();
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex : Combien je dois ?"
            aria-label="Votre question"
            className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
          <Button type="submit" disabled={!q.trim() || loading} className="press h-11 w-full px-5 sm:w-auto">
            Demander à Ndimbal
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Button
              key={s}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQ(s)}
              className="press bg-surface text-foreground hover:border-primary hover:text-primary"
            >
              {s}
            </Button>
          ))}
        </div>

        {loading && (
          <div className="mt-4 flex items-center gap-3 text-sm text-primary" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
            Ndimbal analyse votre contrat…
          </div>
        )}
        {err && (
          <p className="fade-soft mt-4 rounded-md bg-status-late-surface px-4 py-3 text-sm text-status-late" role="alert">
            {err}
          </p>
        )}
        {rep && (
          <div className={"fade-soft mt-5 rounded-md border border-border bg-surface p-4 sm:p-5" + (rep.transfert ? " border-l-4 border-l-gold" : "")}>
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <span className="h-8 w-1 rounded bg-gold" aria-hidden="true" />
              <p className="text-sm font-semibold text-primary">Réponse de Ndimbal</p>
            </div>
            {rep.muted ? (
              <div className="mt-3 text-sm leading-6 text-foreground/80">
                <p>{rep.text}</p>
                <p className="mt-2 text-muted-foreground">Précisez votre demande ou contactez un conseiller</p>
              </div>
            ) : (
              <MarkdownResponse text={rep.text} />
            )}
            {rep.transfert && (
              <div className="mt-4 border-t border-border pt-4">
                {rappel ? (
                  <p className="text-sm font-medium text-primary" role="status">Votre demande a été transmise à un conseiller NSIA</p>
                ) : (
                  <Button
                    type="button"
                    className="press"
                    onClick={() => {
                      setRappel(true);
                      toast.success("Votre demande a été transmise à un conseiller NSIA");
                    }}
                  >
                    Être rappelé par un conseiller
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Réponse générée par IA à partir de données de démonstration. Pour toute réclamation, contactez un conseiller NSIA.
        </p>
      </div>
    </section>
    <p className="mt-2 text-xs text-muted-foreground">Données fictives — prototype pédagogique GET 409</p>
    </>
  );
}
