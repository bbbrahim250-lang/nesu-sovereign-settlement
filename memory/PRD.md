# NESU — NUR Energy Settlement Unit — PRD

## Original Problem Statement
Build a trilingual (EN/FR/AR + full RTL) Expo/React Native mobile app for NESU, a
research & policy initiative of Digital-UNI AI Labs. NESU is a zero-interest,
gold- and commodity-backed settlement unit for nation-to-nation energy & mineral
trade — explicitly NOT a public cryptocurrency, not tradable, not for retail
investment. Hard constraints: no payment/wallet/checkout anywhere; no crypto/
Bitcoin value conversions anywhere (incl. the pledge certificate); every corridor
labeled "Lead Corridor" or "Roadmap"; pledge totals shared across all users via a
real datastore starting at zero (no fake seeding). A persistent header with an
EN/FR/ع switcher and a footer disclaimer appear on every screen.

## Architecture
- **Frontend:** Expo Router (file-based), 6-tab bottom navigation, dark-only
  sovereign theme (navy #050A10 + gold #D4AF37 + green). Cormorant Garamond
  (display) + Cairo (Arabic) fonts loaded via expo-font. Trilingual i18n context
  with per-component RTL mirroring (+ web `document.dir`). @tanstack/react-query
  for the shared totals. expo-video (inline autoplay/muted/looped, fixed 16:9),
  react-native-view-shot + expo-media-library + expo-sharing for the certificate.
- **Backend:** FastAPI + MongoDB (motor). Endpoints: `GET /api/pledges/totals`,
  `POST /api/pledges`. Region/tier validation, soft-delete field, totals computed
  live from real submissions only.

## User Personas
- Sovereign states, central banks, national energy/mineral authorities.
- Multilateral settlement institutions.
- Policy researchers reviewing the concept. (NOT retail investors / crypto traders.)

## Core Requirements (static)
- Trilingual EN/FR/AR with correct RTL for Arabic.
- 6 tabs: Home, How It Works, Green Corridors, Comparison, Pledge, Research.
- No payments/crypto anywhere; certificate is symbolic and watermarked.
- Shared, live, zero-based pledge totals broken down by region.

## Implemented (2026-09-16)
- Full 6-tab app with persistent trilingual header + footer disclaimer on every screen.
- Home (summary + who-for/who-not-for), How It Works (SERVICE ≠ MONEY + 6 layers).
- Green Corridors: inline fixed-16:9 video (the attached NESU explainer) + 5 corridor
  cards (Europe–Algeria = Lead; USA/BRICS/Middle East/Africa = Roadmap).
- Comparison: NESU vs Bitcoin (7 dimensions) + precedents (mBridge, Buna, BRICS Pay, e-CNY).
- Pledge: live shared totals per region (starts at zero), symbolic form (no payment,
  no upload), watermarked "Certificate of Pledged Support" as a captured image with
  render-before-capture gating on the save/share button.
- Research: 7 document rows (EN/FR/AR real PDFs; Proposal/DE/ZH/RU as marked stand-ins).
- Backend pledges API (13/13 backend tests passing); NESU-branded placeholder icons.

## Implemented (2026-09-16, iteration 2)
- Docs: real DE/ZH/RU Swiss Counsel briefs wired (only the Conceptual Proposal remains a marked stand-in).
- Share Card: `src/components/ShareCard.tsx` — one-tap shareable NESU-vs-Bitcoin summary image
  (view-shot + expo-sharing) on the Comparison tab and after the pledge certificate. Trilingual, RTL-mirrored.
- Branding: full-bleed splash (`assets/images/splash.png`, resizeMode "cover", `enableFullScreenImage_legacy`),
  interim app icon / adaptive icon / favicon cropped from the official splash artwork, and the in-app `Logo`
  now renders the real gold-laurel emblem (`assets/images/emblem.png`).
- Pledge totals reset to zero after testing (iteration_2: all frontend checks pass).

## Implemented (2026-09-16, iteration 3) — Pledge → Membership
- The symbolic "Pledge of Support" tab was replaced by a real **Membership** tab (`app/(tabs)/membership.tsx`):
  5 tier cards (Bronze $50M · Silver $250M · Gold $500M · Diamond $1B · Platinum $10B) modelled on the
  GOV · POWER · TRADE · CARD artwork, same form fields, button "Request Membership" (no payment processed
  in-app; fees settled by wire under a signed agreement). Result: "Certificate of Membership Request"
  (status pending review) + save/share + share card. Live shared "Membership requests" counter by region.
- Backend: `GET /api/memberships/totals`, `POST /api/memberships` (tier key + amount_usd, status
  pending_review); `/api/pledges` removed. Collection `memberships`. 15/15 backend tests pass.
- All "pledge/symbolic" copy removed in EN/FR/AR; footer disclaimer updated.
- Home hero now shows the official NESU brand artwork (`assets/images/hero.jpg`).
- Counter reset to zero after testing.

## Implemented (iteration 4) — Confirmation emails
- `backend/emailer.py`: Emergent managed email (Resend proxy). On every membership request the backend
  sends (as a background task) a confirmation to the applicant and a notification to the team inbox
  `TEAM_EMAIL=institutional@nesu-sovereign-settlement.ch` (also Reply-To). `EMAIL_FROM_NAME=NESU`.
  Server-side templates only; guardrail gate applied on every send. Verified 202 Accepted for both sends.

## Implemented (iteration 5) — Tracker, tier benefits, real Proposal PDF
- Request Tracker (`src/components/RequestTracker.tsx`): applicants enter the request ID from their
  certificate → `GET /api/memberships/{id}/status` (no personal data returned) → status pill
  pending_review / in_review / approved / declined with description, tier, institution, dates.
- Team status updates: `PATCH /api/memberships/{id}/status` with header `X-Admin-Key` (= `ADMIN_KEY` in
  backend/.env, copy in memory/test_credentials.md), body `{"status": "in_review"|"approved"|"declined"|"pending_review"}`.
- Tier benefits: tapping a card shows "What this tier unlocks" (4 bullets per tier, EN/FR/AR) +
  "Compare all tiers" full-screen modal with select buttons (`src/components/TierBenefits.tsx`).
- Docs: real NESU Conceptual Proposal (Combined v2) wired — no stand-ins remain.
- Counter reset to zero.

## Implemented (iteration 6) — Team console, status emails, Home membership section
- Team console `app/team.tsx` (route /team, discreet footer link on every screen): unlock with ADMIN_KEY
  (SecureStore native / AsyncStorage web), filter chips, request cards with contact details, status action
  buttons with confirm, lock. Endpoints: `POST /api/admin/verify`, `GET /api/admin/memberships[?status=]`,
  `PATCH /api/memberships/{id}/status` (all X-Admin-Key). 20/20 backend tests.
- Status emails: applicant is emailed when status becomes in_review / approved / declined
  (`emailer.send_status_email`, background task, 429 retry with backoff).
- Home: smaller brand hero with tagline beneath (no overlap) + "Membership tiers" section (uploaded cards
  artwork `assets/images/membership-cards.jpg` + 5 tappable tier rows → Membership tab).
- Membership tab: all five tier cards stacked vertically (all visible).
- Note: the "nesu_app_icon_v2_1024.png" upload was actually the 924×2000 splash artwork again, so the
  icon remains the emblem crop derived from that artwork.

## Backlog / Remaining
- **P1:** Privacy-policy URL → add link in footer once the user provides it (store review).
- **P1:** Swap interim icon if a true 1024×1024 icon file is provided.
- **P2:** Corridor detail pages with GCRS score.

## Native-build notes
- Inline video autoplay and the certificate image save/share are best validated on a
  device build (Expo Go / dev build), not the web preview.
