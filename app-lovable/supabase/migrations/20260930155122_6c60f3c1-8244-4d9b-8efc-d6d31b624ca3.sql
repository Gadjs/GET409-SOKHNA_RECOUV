CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom text NOT NULL DEFAULT '',
  nom text NOT NULL DEFAULT '',
  telephone text,
  langue_preferee text NOT NULL DEFAULT 'français' CHECK (langue_preferee IN ('français','wolof')),
  canal_prefere text NOT NULL DEFAULT 'app' CHECK (canal_prefere IN ('app','SMS','appel','vocal','conseiller')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lire son profil" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Modifier son profil" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.contrats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  numero_police text NOT NULL UNIQUE,
  produit text NOT NULL,
  prime integer NOT NULL,
  periodicite text NOT NULL DEFAULT 'mensuelle',
  statut text NOT NULL DEFAULT 'actif',
  zone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.contrats(user_id);
GRANT SELECT ON public.contrats TO authenticated;
GRANT ALL ON public.contrats TO service_role;
ALTER TABLE public.contrats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lire ses contrats" ON public.contrats FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.cotisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrat_id uuid NOT NULL REFERENCES public.contrats(id) ON DELETE CASCADE,
  date_echeance date NOT NULL,
  montant integer NOT NULL,
  statut text NOT NULL CHECK (statut IN ('payée','en retard','à venir')),
  date_paiement date,
  moyen text CHECK (moyen IN ('Wave','Orange Money')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.cotisations(contrat_id);
GRANT SELECT ON public.cotisations TO authenticated;
GRANT ALL ON public.cotisations TO service_role;
ALTER TABLE public.cotisations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lire ses cotisations" ON public.cotisations FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.contrats c WHERE c.id = contrat_id AND c.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, prenom, nom, telephone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'prenom',''), COALESCE(NEW.raw_user_meta_data->>'nom',''), NEW.raw_user_meta_data->>'telephone');
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();