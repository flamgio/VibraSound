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
- **Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (mono)

## Project: VibraSound - Music Rhythm & Cellular Resonance Analyzer

A professional music analysis web application targeting music producers, video editors, and enthusiasts of bioacoustic science.

### Features
- **Single Track Analysis**: Paste any YouTube/SoundCloud URL → BPM, musical key, energy, danceability, frequency spectrum, cellular resonance score (0-100)
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

### Design System
- Custom SVG icons in `artifacts/music-analyzer/src/components/icons.tsx`
- Animated background: floating color orbs + frequency wave bars + sine waves
- Glassmorphism cards (`.glass-card`), glow utilities, gradient text
- Color palette: indigo/violet/blue primary, deep navy dark mode

### Database Schema
- `analyses` table: stores all music analysis results with URL, title, BPM, key, energy, danceability, dominant frequency, frequency spectrum (JSONB), beat pattern (JSONB), tempo changes (JSONB), cellular resonance (JSONB)

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
