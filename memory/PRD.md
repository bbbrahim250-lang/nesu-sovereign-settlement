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

## Backlog / Remaining
- **P1:** Swap interim icon for the official `nesu_app_icon_v2_1024.png` when the upload arrives.
- **P1:** Wire the real Conceptual Proposal PDF when attached.
- **P2:** Corridor detail pages with GCRS score.

## Native-build notes
- Inline video autoplay and the certificate image save/share are best validated on a
  device build (Expo Go / dev build), not the web preview.
