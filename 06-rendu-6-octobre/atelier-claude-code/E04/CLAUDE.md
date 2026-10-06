# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose
Landing page for **Ndimbal**, a Master 1 student project (Swiss UMEF, Dakar): multichannel reminders
(SMS, automated call, French/Wolof voice assistant, chatbot/advisor) so NSIA Vie Assurances policyholders
don't miss premium payments. Audience: Senegalese policyholders. Unofficial, not endorsed by NSIA.

## Layout
- `index.html`: the whole site (one `<style>`, markup, one IIFE `<script>`). No build, no dependencies
  except Google Fonts.
- Sections: `#accueil` (hero + quiz), `#services`, `#cas`, `#contact`.
- Sibling `../v1-no-skill/` is the comparison variant. Never edit it from here.

## Design rules
- Fonts: Bricolage Grotesque for headings (`--display`), Atkinson Hyperlegible for body (`--text`).
- Palette tokens in `:root`: `--indigo` (text, quiz), `--mango` (accent, focus ring), `--chalk` (page
  background), `--leaf`, `--muted`, `--line`, `--error`. Use tokens, never raw hex.
- Spacing: `.wrap` max 1120px with 16px side gutter; `section.block` has 72px vertical padding;
  corners are small (4px) except the quiz card's 6px/28px asymmetric radius.
- Signature motifs: the rotated mango `.panneau` (bus destination sign) and the `.bazin` band. Keep them.
- Mobile first: no horizontal scroll at phone width.
- Accessibility is a requirement: keep `:focus-visible`, `aria-live` on the quiz, `role="status"` on the
  form feedback, a `<label>` on every field.

## Content rules
- All copy in French (`lang="fr"`). Wolof only where the feature is the Wolof voice assistant.
- No invented clients, testimonials, statistics or figures.
- No NSIA logo or NSIA branding. The name is only used to say who the project is about.
- Keep the footer line "Projet étudiant, non officiel" and the non-binding note in the quiz result.
- The contact form is a mock: it must never send or store data, and must say so.
- `#cas` stays as "à venir" placeholders until real scenarios are supplied.

## Preview
Open `index.html` in a browser, or run `python3 -m http.server` here and visit localhost:8000.
Check the quiz end to end and the form's error messages, at phone width and desktop width.

## Do / Don't
- Do add quiz options in `steps` and the matching `canalText` / `contratText` entry together.
- Do build DOM with the `el()` helper and `textContent`.
- Do give each new form field an `<id>-err` element, a `rules` entry and `aria-describedby`.
- Don't add a framework, bundler, tracker or external script.
- Don't add a real form endpoint or collect personal data.
- Don't promise coverage, payment or financial outcomes: recommendations are indicative only.
- Don't use `innerHTML` with user or quiz data.
