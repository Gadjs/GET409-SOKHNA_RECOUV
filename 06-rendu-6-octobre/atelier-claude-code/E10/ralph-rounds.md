## 2026-10-05 — Ralph round 1: UI polish
- **Palette**: NSIA-inspired navy `#2b2b5e` (primary) and gold `#d5a00a` (accent) as CSS tokens in
  `src/styles.css`, with a dark-mode variant. Header is now a navy band with the app name and
  today's date (`formatLongDate`).
- **Journal as cards** instead of a table (readable at 360 px): police, colour-coded statut badge,
  date/step/canal/origin, note, proof summary, message, actions. Colour-coded by statut via one
  `STATUT_CLASS` map in `RelanceList.tsx`; the label is always shown too, so colour is not the only cue.
- **Statut filter**: chips (`aria-pressed`) with per-statut counts, combined with the police search.
- **States**: loading indicator while the repository loads; separate empty messages for "no entry"
  and "no match for filters".
- Tests updated from table to list queries; added a statut-filter test.
- **Not verified**: no real-browser check (360 px layout, contrast of the status colours was chosen
  by design, not measured). Per-policy counter already existed and is unchanged; error state for
  the repository is still missing (localStorage repository never rejects).
