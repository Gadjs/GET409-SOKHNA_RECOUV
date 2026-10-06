# Errors & Fixes

Check here before retrying anything that fails. Add every new fix, newest last.

Entry format:
```
## YYYY-MM-DD — <short title>
- Symptom: <exact error or behavior>
- Cause: <root cause>
- Fix: <what worked>
- Context: <skill/task/tool involved>
```

## 2026-10-05 — Cannot read PDF sources (cv.pdf)
- Symptom: Read tool on `vault/sources/cv.pdf` fails with "pdftoppm is not installed. Install poppler-utils"; no `pdftotext`, `mutool`, `qpdf`, `pypdf`, `PyPDF2`, `fitz` or `Quartz` available either.
- Cause: No PDF text-extraction tool installed on this machine.
- Fix: use the extracted text file `vault/sources/cv.txt` (provided by user) and ingest that instead of the PDF. For future PDFs, ask for a .txt extraction. Dead ends: `brew install poppler` also fails: Command Line Tools are outdated (Xcode 26.6 CLT required) and Homebrew has no bottles for Intel x86_64, so it would build poppler + 66 dependencies from source. Remaining options: `pip3 install pypdf`, paste the CV text into chat, or PDFKit via Swift.
- Context: /ingest of vault/sources/cv.pdf

## 2026-10-05 — Gmail and Google Calendar connectors absent
- Symptom: ToolSearch "gmail calendar" returns only Notion tools; no Gmail or Calendar tool exists in the session.
- Cause: connectors not yet enabled on claude.ai for this account/session (Notion's own Mail/Calendar search is not Gmail).
- Fix: unresolved — user connects Gmail and Google Calendar on claude.ai, restarts Claude Code, then runs `/morning-brief`. Until then the skill produces a partial brief.
- Context: /new-automation morning-brief

## 2026-10-05 — Connecteurs Gmail/Agenda : résolu
- Symptom: voir entrée « Gmail and Google Calendar connectors absent ».
- Cause: connecteurs non connectés lors du scaffolding.
- Fix: connecteurs connectés sur claude.ai, outils `mcp__claude_ai_Gmail__*` et `mcp__claude_ai_Google_Calendar__*` disponibles via ToolSearch (select). Premier run réel réussi.
- Context: /morning-brief

## 2026-10-05 — Titre de page « Daily briefs » : date obligatoire (garde préventive)
- Symptom: aucun échec constaté. Vérification de la page du jour : titre « Brief 2026-10-05 », date déjà présente, rien à corriger. Risque visé : une page créée avec un titre sans date (ex. « Brief »), qui casse la recherche par titre et l'unicité d'une page par date.
- Cause: le titre est libre et construit à la main ; la règle « Brief YYYY-MM-DD » n'était qu'implicite.
- Fix: règle écrite dans work/02-morning-brief/CLAUDE.md (« Learned fixes ») : le titre est toujours « Brief YYYY-MM-DD » avec la date du run, vérifié par relecture (fetch) après création ou mise à jour ; corriger via update_properties si absent.
- Context: /morning-brief, étape 9 (miroir Notion)
