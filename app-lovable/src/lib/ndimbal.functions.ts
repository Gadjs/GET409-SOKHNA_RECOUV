import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Result =
  | { ok: true; text: string; erreurMetier: boolean; transfert: boolean }
  | { ok: false; error: string };

const INDISPO = "Service temporairement indisponible";

export const askNdimbal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ query: z.string().trim().min(1).max(1000) }).parse(d))
  .handler(async ({ data, context }): Promise<Result> => {
    const key = process.env["DIFY_API_KEY"];
    if (!key) return { ok: false, error: INDISPO };

    // Police de l'assuré connecté (RLS : uniquement ses propres contrats)
    let query = data.query;
    if (!/NSV-\d{4}-\d{4}/i.test(query)) {
      const { data: c } = await context.supabase
        .from("contrats")
        .select("numero_police")
        .order("numero_police")
        .limit(1)
        .maybeSingle();
      if (c?.numero_police) query = `Police ${c.numero_police}, ${query}`;
    }

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    try {
      const res = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: { query },
          response_mode: "blocking",
          user: "ndimbal-" + Date.now(),
        }),
        signal: ctrl.signal,
      });
      if (res.status !== 200) {
        console.error("Dify error", res.status, await res.text().catch(() => ""));
        return { ok: false, error: INDISPO };
      }
      const json = (await res.json()) as { data?: { outputs?: unknown } };
      const out = json.data?.outputs;
      let text = "";
      let erreurMetier = false;
      if (typeof out === "string") text = out;
      else if (out && typeof out === "object") {
        const o = out as Record<string, unknown>;
        const me = o["message_erreur"];
        if (typeof me === "string" && me.trim()) {
          text = me;
          erreurMetier = true;
        } else {
          const v = Object.values(o).find((x) => typeof x === "string" && x.trim());
          text = typeof v === "string" ? v : "";
        }
      }
      if (!text.trim()) return { ok: false, error: INDISPO };
      return {
        ok: true,
        text: text.trim(),
        erreurMetier,
        transfert: /TRANSFERT\s+CONSEILLER/i.test(text),
      };
    } catch (e) {
      if ((e as Error).name === "AbortError")
        return { ok: false, error: "La réponse prend trop de temps — réessayez" };
      console.error("Dify fetch failed", e);
      return { ok: false, error: INDISPO };
    } finally {
      clearTimeout(t);
    }
  });
