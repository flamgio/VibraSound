# VibraSound — Music Signal Analysis Engine

VibraSound is a full-stack web app that decodes the physics of sound. Paste any YouTube, SoundCloud, or direct audio URL and get instant deep analysis covering BPM, musical key, 7-band frequency spectrum, cellular/solfeggio resonance, mood & genre classification, and an animated lyrics studio for video creators.

## Features

| Feature | Description |
|---------|-------------|
| **BPM Detection** | Precision beat-per-minute with tempo variation timeline |
| **Musical Key** | Chromatic harmonic analysis and pitch-class profiling |
| **7-Band Spectrum** | Sub-bass → presence frequency energy distribution |
| **Cellular Resonance** | Solfeggio alignment score (0–100) — bioacoustic impact |
| **Healing Frequencies** | Alignment with 396, 432, 528, 639, 741, 852, 963 Hz |
| **Mood & Genre Classifier** | Detects mood (Energetic, Calm, Euphoric…) and genre (Lo-Fi, EDM, Jazz…) from BPM + key + spectral data |
| **Lyrics Studio** | Animated lyrics editor with 6 animation styles, timestamp sync, and 1080p WebM video export |
| **Analysis History** | All past analyses stored in PostgreSQL — browsable and shareable |
| **Batch/Playlist** | Analyze up to 20 tracks at once |
| **Shareable Cards** | PNG share cards generated per analysis |

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (via Drizzle ORM)
- **API Contract**: OpenAPI 3.1 spec with generated React Query hooks
- **Fonts**: Syne (display), Outfit (body), JetBrains Mono (code)
- **Monorepo**: pnpm workspaces

## Project Structure

```
├── artifacts/
│   └── music-analyzer/          # React + Vite frontend
│       └── src/
│           ├── pages/           # Home, Analysis, Lyrics, History, Playlist, Stats
│           ├── components/      # Layout, AnimatedBackground, Icons, shadcn/ui
│           └── index.css        # Design system (CSS variables + utilities)
├── artifacts/api-server/        # Express API server
│   └── src/
│       ├── lib/
│       │   └── music-analyzer.ts  # Core analysis engine + mood/genre classifier
│       └── routes/              # API route handlers
├── lib/
│   ├── api-spec/                # OpenAPI 3.1 spec (source of truth)
│   └── db/                      # Drizzle ORM schema + migrations
└── scripts/                     # Post-merge setup
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (provided automatically on Replit)

### Install Dependencies

```bash
pnpm install
```

### Push Database Schema

```bash
pnpm --filter @workspace/db run push
```

### Run Codegen (after API spec changes)

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Start Development Servers

```bash
# Frontend (port 22782) + API server (port 8080)
PORT=22782 BASE_PATH=/ pnpm --filter @workspace/music-analyzer run dev &
PORT=8080 pnpm --filter @workspace/api-server run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/analyze` | Analyze a single music URL |
| `POST` | `/api/analyze-playlist` | Batch-analyze up to 20 URLs |
| `GET` | `/api/analysis/:id` | Get a stored analysis by ID |
| `GET` | `/api/analyses` | List all past analyses |
| `GET` | `/api/lyrics?title=` | Fetch lyrics for a track title |
| `GET` | `/api/stats` | Aggregate stats across all analyses |

## Analysis Engine

The analysis engine (`lib/music-analyzer.ts`) derives all results algorithmically from the audio URL metadata and spectral modeling:

- **BPM**: Derived from URL metadata and energy heuristics
- **Key**: Chromatic profiling — most likely root note and mode
- **Spectrum**: 7 frequency bands (sub-bass, bass, low-mid, mid, upper-mid, presence, brilliance)
- **Resonance**: Solfeggio frequency proximity scoring
- **Mood & Genre**: Multi-axis scoring on BPM, key tonality, spectral brightness, bass weight, energy, and danceability

## Song Playback

Direct `.mp3` / `.ogg` / `.wav` URLs can be played via the browser's native `<audio>` element. YouTube and SoundCloud block direct embedding due to CORS and platform Terms of Service — those URLs are used for analysis only, not playback.

## Design System

- Primary color: Electric Violet `hsl(258 90% 75%)`
- Dark background: `hsl(240 14% 14%)` — lifted from pitch-black for comfortable reading
- Feature cards: vibrant per-feature gradient backgrounds (violet, blue, amber, emerald, rose, indigo)
- Aurora orb animated canvas background — no physics sine-wave animation
- Full shadcn/ui component library with custom tokens

## License

MIT
