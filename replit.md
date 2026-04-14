# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Fonts**: Syne (display headings), Outfit (body), JetBrains Mono (mono)

## Project: VibraSound - Music Rhythm & Cellular Resonance Analyzer

A professional music analysis web application targeting music producers, video editors, and enthusiasts of bioacoustic science.

### Features
- **Single Track Analysis**: Paste any YouTube/SoundCloud URL → BPM, musical key, energy, danceability, frequency spectrum, cellular resonance score (0-100)
- **Mood & Genre Classifier**: Server-side classification using BPM + key + spectral data → detects moods (Aggressive, Euphoric, Energetic, Tense, Groovy, Melancholic, Calm, Dreamy) with confidence scores, suggests genre + sub-genre, provides 5-axis mood dimension radar chart (Energy, Aggression, Euphoria, Tension, Calmness), and lists sonic characteristics
- **Playlist / Batch Analysis**: Paste multiple URLs (one per line) → parallel analysis of up to 20 tracks, with sortable results
- **Lyrics Studio** (`/lyrics/:id`): Fetch real lyrics (via lyrics.ovh API) → animated line-by-line display with:
  - 6 animation styles: Fade Up, Slide Right, Typewriter, Glow, Pop, Blur In
  - 6 background presets including Green Screen for compositing
  - Font, size, color, glow controls
  - Edit lyrics inline
  - Download as 1920×1080 WebM video (Canvas + MediaRecorder)
- **Analysis History**: All past analyses with BPM/key/resonance badges
- **Global Stats**: Aggregate statistics with radial gauge + pie chart breakdown
- **Dark mode** (persisted to localStorage, respects OS preference)

### Design System (v2 — Premium Midnight Protocol)
- **Fonts**: Syne (display, geometric, -0.02em letter-spacing) + Outfit (body) + JetBrains Mono (numbers/code)
- **Color palette dark mode**: bg `240 18% 4%` (deep obsidian), primary `258 90% 75%` (electric violet), chart colors: violet, cyan, amber, emerald, rose
- **Card system**: `.vb-card` — gradient border via CSS mask trick + corner highlight; `.vb-metric` — 1.5px colored top accent line via `--metric-line` CSS variable
- **Typography utilities**: `.gradient-text` (violet→cyan), `.gradient-text-v2/gold/mint/cyan`, `.data-num` (JetBrains Mono tabular), `.label-xs/sm` (uppercase mono labels)
- **Glow utilities**: `.glow-violet/cyan/mint/amber/rose` (box-shadow glows)
- **Animated background**: aurora radial gradient orbs (4 orbs), floating particles, scan line in dark mode, dot grid (all wave/spectrum bar animations removed)
- **Button**: `.btn-glow` — top highlight + bottom glow shadow effect
- **Custom icons**: All redesigned with 1.5px stroke weight in `components/icons.tsx`
- **Animation easing**: Framer Motion with `[0.22, 1, 0.36, 1]` (smooth spring-like), delays staggered at 0.05s intervals

### Database Schema
- `analyses` table: stores all music analysis results with URL, title, BPM, key, energy, danceability, dominant frequency, frequency spectrum (JSONB), beat pattern (JSONB), tempo changes (JSONB), cellular resonance (JSONB), mood_genre (JSONB, nullable — added for Mood & Genre Classifier)

### API Endpoints
- `POST /api/analyze` — Analyze a single music URL
- `POST /api/analyze-playlist` — Analyze multiple URLs in parallel (up to 20)
- `GET /api/lyrics?title=...` — Fetch song lyrics from lyrics.ovh (parses artist/song from title)
- `GET /api/analyses` — Get recent analyses (with limit param)
- `GET /api/analyses/stats` — Get aggregate statistics
- `GET /api/analyses/:id` — Get specific analysis

### Pages
- `/` — Home with single/playlist mode tabs
- `/analysis/:id` — Full analysis detail with Get Lyrics button
- `/lyrics/:id` — Lyrics Studio (animated editor + video export)
- `/playlist` — Playlist batch results (data via sessionStorage)
- `/history` — Analysis history
- `/stats` — Global statistics

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
