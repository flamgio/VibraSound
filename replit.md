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

## Project: VibraSound - Music Rhythm Analyzer

A music rhythm and cellular resonance analysis tool that accepts song URLs (YouTube, SoundCloud, or direct audio links) and analyzes rhythmic features including BPM, beat patterns, tempo changes, frequency spectrum, and healing frequency alignment.

### Features
- Paste any song URL to get full rhythm analysis
- BPM, musical key, energy level, and danceability detection
- Frequency spectrum visualization with 7 bands
- Cellular resonance scoring (0-100) based on healing frequency alignment
- Healing frequency detection (Solfeggio frequencies, Schumann resonance, etc.)
- Analysis history and global statistics
- Dark mode toggle
- Animated background with floating particles

### Database Schema
- `analyses` table: stores all music analysis results with URL, title, BPM, key, energy, danceability, dominant frequency, frequency spectrum (JSONB), beat pattern (JSONB), tempo changes (JSONB), cellular resonance (JSONB)

### API Endpoints
- `POST /api/analyze` - Analyze a music URL
- `GET /api/analyses` - Get recent analyses (with limit param)
- `GET /api/analyses/stats` - Get aggregate statistics
- `GET /api/analyses/:id` - Get specific analysis

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
