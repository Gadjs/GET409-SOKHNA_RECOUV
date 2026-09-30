-- Ndimbal : schema cible Supabase avec isolement des donnees par client (Row Level Security)
-- La maquette statique simule ce comportement ; ce fichier decrit la version reelle.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  prenom text not null,
  nom text not null,
  telephone text unique not null,
  langue_preferee text not null default 'français' check (langue_preferee in ('français', 'wolof')),
  canal_prefere text not null default 'sms' check (canal_prefere in ('app', 'sms', 'appel', 'vocal', 'conseiller'))
);

create table public.contrats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  numero_police text unique not null,
  produit text not null,
  prime integer not null,
  periodicite text not null default 'mensuelle',
  statut text not null check (statut in ('ajour', 'retard', 'suspendu'))
);

create table public.cotisations (
  id uuid primary key default gen_random_uuid(),
  contrat_id uuid not null references public.contrats (id) on delete cascade,
  date_echeance date not null,
  montant integer not null,
  statut text not null check (statut in ('payee', 'en_retard', 'a_venir')),
  date_paiement date,
  moyen text check (moyen in ('wave', 'orange_money', 'agence'))
);

-- Isolement : chaque assure ne lit QUE ses propres lignes
alter table public.profiles    enable row level security;
alter table public.contrats    enable row level security;
alter table public.cotisations enable row level security;

create policy "profil : lecture de son propre profil" on public.profiles
  for select using (id = auth.uid());
create policy "profil : modification de son propre profil" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "contrats : lecture de ses propres contrats" on public.contrats
  for select using (user_id = auth.uid());

create policy "cotisations : lecture des cotisations de ses contrats" on public.cotisations
  for select using (
    exists (select 1 from public.contrats c where c.id = contrat_id and c.user_id = auth.uid())
  );
-- Aucune policy insert/delete pour les assures : seules les applications internes NSIA
-- (cle service_role, cote serveur) alimentent contrats et cotisations.
