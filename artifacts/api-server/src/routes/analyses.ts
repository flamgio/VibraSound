import { Router, type Request, type Response, type IRouter } from "express";
import { db, analysesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import {
  AnalyzeMusicBody,
  GetRecentAnalysesQueryParams,
  GetAnalysisParams,
} from "@workspace/api-zod";
import { analyzeMusic } from "../lib/music-analyzer";

const router: IRouter = Router();

// ──────────────────────────────────────────
// POST /analyze
// ──────────────────────────────────────────
router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const parsed = AnalyzeMusicBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", message: "A valid URL is required" });
      return;
    }

    const { url } = parsed.data;
    const analysisResult = await analyzeMusic(url);

    const [inserted] = await db.insert(analysesTable).values({
      url: analysisResult.url,
      title: analysisResult.title,
      bpm: analysisResult.bpm,
      key: analysisResult.key,
      energy: analysisResult.energy,
      danceability: analysisResult.danceability,
      dominantFrequency: analysisResult.dominantFrequency,
      frequencySpectrum: analysisResult.frequencySpectrum,
      beatPattern: analysisResult.beatPattern,
      tempoChanges: analysisResult.tempoChanges,
      cellularResonance: analysisResult.cellularResonance,
    }).returning();

    res.json({
      id: inserted.id,
      url: inserted.url,
      title: inserted.title,
      bpm: inserted.bpm,
      key: inserted.key,
      energy: inserted.energy,
      danceability: inserted.danceability,
      dominantFrequency: inserted.dominantFrequency,
      frequencySpectrum: inserted.frequencySpectrum,
      beatPattern: inserted.beatPattern,
      tempoChanges: inserted.tempoChanges,
      cellularResonance: inserted.cellularResonance,
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    req.log.error({ err: error }, "Analysis failed");
    res.status(500).json({ error: "analysis_failed", message });
  }
});

// ──────────────────────────────────────────
// POST /analyze-playlist
// ──────────────────────────────────────────
router.post("/analyze-playlist", async (req: Request, res: Response) => {
  try {
    const { urls } = req.body as { urls: string[] };
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({ error: "validation_error", message: "urls array is required" });
      return;
    }
    const limited = urls.slice(0, 20);

    const settled = await Promise.allSettled(limited.map(async (url: string) => {
      const result = await analyzeMusic(url.trim());
      const [inserted] = await db.insert(analysesTable).values({
        url: result.url,
        title: result.title,
        bpm: result.bpm,
        key: result.key,
        energy: result.energy,
        danceability: result.danceability,
        dominantFrequency: result.dominantFrequency,
        frequencySpectrum: result.frequencySpectrum,
        beatPattern: result.beatPattern,
        tempoChanges: result.tempoChanges,
        cellularResonance: result.cellularResonance,
      }).returning();
      return {
        id: inserted.id,
        url: inserted.url,
        title: inserted.title,
        bpm: inserted.bpm,
        key: inserted.key,
        energy: inserted.energy,
        danceability: inserted.danceability,
        dominantFrequency: inserted.dominantFrequency,
        frequencySpectrum: inserted.frequencySpectrum,
        beatPattern: inserted.beatPattern,
        tempoChanges: inserted.tempoChanges,
        cellularResonance: inserted.cellularResonance,
        createdAt: inserted.createdAt.toISOString(),
      };
    }));

    const results = settled.map((s, i) => {
      if (s.status === "fulfilled") {
        return { url: limited[i], status: "success" as const, analysis: s.value };
      }
      return {
        url: limited[i],
        status: "error" as const,
        error: s.reason instanceof Error ? s.reason.message : "Analysis failed",
      };
    });

    const succeeded = results.filter((r) => r.status === "success").length;

    res.json({
      total: limited.length,
      succeeded,
      failed: limited.length - succeeded,
      results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Playlist analysis failed";
    req.log.error({ err: error }, "Playlist analysis failed");
    res.status(500).json({ error: "analysis_failed", message });
  }
});

// ──────────────────────────────────────────
// GET /lyrics
// ──────────────────────────────────────────
router.get("/lyrics", async (req: Request, res: Response) => {
  try {
    const rawTitle = (req.query.title as string) || "";
    let artist = (req.query.artist as string) || "";
    let song = (req.query.song as string) || rawTitle;

    if (!artist && rawTitle) {
      const separators = [" - ", " – ", " — ", " | ", ": "];
      for (const sep of separators) {
        const idx = rawTitle.indexOf(sep);
        if (idx > 0) {
          artist = rawTitle.slice(0, idx).trim();
          song = rawTitle.slice(idx + sep.length).trim();
          break;
        }
      }
      // Strip common YouTube noise from the song title
      song = song
        .replace(/\s*\(official\s*(music\s*)?video\)/gi, "")
        .replace(/\s*\[official\s*(music\s*)?video\]/gi, "")
        .replace(/\s*\(lyric\s*video\)/gi, "")
        .replace(/\s*\(official\s*audio\)/gi, "")
        .replace(/\s*\(official lyric video\)/gi, "")
        .replace(/\s*\(audio\)/gi, "")
        .replace(/\s*\(hd\)/gi, "")
        .replace(/\s*\(hq\)/gi, "")
        .replace(/\s*\(lyrics?\)/gi, "")
        .trim();
    }

    if (!song) {
      res.status(400).json({ error: "validation_error", message: "title or song parameter required" });
      return;
    }

    const fetchUrl = artist
      ? `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`
      : `https://api.lyrics.ovh/v1/_/${encodeURIComponent(song)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let lyricsText: string | null = null;
    try {
      const response = await fetch(fetchUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) {
        const data = await response.json() as { lyrics?: string; error?: string };
        if (data.lyrics) {
          lyricsText = data.lyrics.trim();
        }
      }
    } catch {
      clearTimeout(timeout);
    }

    if (!lyricsText) {
      res.json({
        found: false,
        artist,
        song,
        lyrics: null,
        lines: [],
        message: "Lyrics not found for this track. Try providing a more specific title.",
      });
      return;
    }

    const lines = lyricsText
      .split("\n")
      .map((l) => l.trim())
      .filter((l, i, arr) => {
        if (l === "") return i > 0 && arr[i - 1] !== "";
        return true;
      });

    res.json({
      found: true,
      artist,
      song,
      lyrics: lyricsText,
      lines,
    });
  } catch (error) {
    req.log.error({ err: error }, "Lyrics fetch failed");
    res.status(500).json({ error: "lyrics_failed", message: "Failed to fetch lyrics" });
  }
});

// ──────────────────────────────────────────
// GET /analyses
// ──────────────────────────────────────────
router.get("/analyses", async (req: Request, res: Response) => {
  try {
    const parsed = GetRecentAnalysesQueryParams.safeParse(req.query);
    const limit = parsed.success ? (parsed.data.limit ?? 10) : 10;

    const results = await db
      .select()
      .from(analysesTable)
      .orderBy(desc(analysesTable.createdAt))
      .limit(limit);

    const summaries = results.map((r) => ({
      id: r.id,
      title: r.title,
      url: r.url,
      bpm: r.bpm,
      key: r.key,
      energy: r.energy,
      cellularScore: (r.cellularResonance as { score: number }).score,
      category: (r.cellularResonance as { category: string }).category,
      createdAt: r.createdAt.toISOString(),
    }));

    res.json(summaries);
  } catch (error) {
    req.log.error({ err: error }, "Failed to fetch analyses");
    res.status(500).json({ error: "fetch_failed", message: "Failed to fetch analyses" });
  }
});

// ──────────────────────────────────────────
// GET /analyses/stats
// ──────────────────────────────────────────
router.get("/analyses/stats", async (req: Request, res: Response) => {
  try {
    const allAnalyses = await db.select().from(analysesTable);

    if (allAnalyses.length === 0) {
      res.json({
        totalAnalyses: 0,
        averageBpm: 0,
        averageCellularScore: 0,
        topHealingFrequency: "None",
        categoryBreakdown: {
          highly_beneficial: 0,
          beneficial: 0,
          neutral: 0,
          potentially_harmful: 0,
        },
      });
      return;
    }

    const totalAnalyses = allAnalyses.length;
    const averageBpm = Math.round(allAnalyses.reduce((sum, a) => sum + a.bpm, 0) / totalAnalyses);
    const avgCellScore = Math.round(
      allAnalyses.reduce((sum, a) => sum + (a.cellularResonance as { score: number }).score, 0) / totalAnalyses
    );

    const freqCounts = new Map<string, number>();
    for (const a of allAnalyses) {
      const cr = a.cellularResonance as { healingFrequencies: { name: string; presence: number }[] };
      if (cr.healingFrequencies) {
        for (const hf of cr.healingFrequencies) {
          if (hf.presence > 0.5) {
            freqCounts.set(hf.name, (freqCounts.get(hf.name) || 0) + 1);
          }
        }
      }
    }
    let topHealingFrequency = "528 Hz (DNA Repair)";
    let maxCount = 0;
    for (const [name, c] of freqCounts) {
      if (c > maxCount) {
        maxCount = c;
        topHealingFrequency = name;
      }
    }

    const categoryBreakdown = {
      highly_beneficial: 0,
      beneficial: 0,
      neutral: 0,
      potentially_harmful: 0,
    };
    for (const a of allAnalyses) {
      const cat = (a.cellularResonance as { category: string }).category as keyof typeof categoryBreakdown;
      if (cat in categoryBreakdown) categoryBreakdown[cat]++;
    }

    res.json({ totalAnalyses, averageBpm, averageCellularScore: avgCellScore, topHealingFrequency, categoryBreakdown });
  } catch (error) {
    req.log.error({ err: error }, "Failed to fetch stats");
    res.status(500).json({ error: "stats_failed", message: "Failed to fetch statistics" });
  }
});

// ──────────────────────────────────────────
// GET /analyses/:id
// ──────────────────────────────────────────
router.get("/analyses/:id", async (req: Request, res: Response) => {
  try {
    const parsed = GetAnalysisParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "validation_error", message: "Invalid analysis ID" });
      return;
    }

    const id = parsed.data.id;
    const [result] = await db
      .select()
      .from(analysesTable)
      .where(eq(analysesTable.id, id))
      .limit(1);

    if (!result) {
      res.status(404).json({ error: "not_found", message: "Analysis not found" });
      return;
    }

    res.json({
      id: result.id,
      url: result.url,
      title: result.title,
      bpm: result.bpm,
      key: result.key,
      energy: result.energy,
      danceability: result.danceability,
      dominantFrequency: result.dominantFrequency,
      frequencySpectrum: result.frequencySpectrum,
      beatPattern: result.beatPattern,
      tempoChanges: result.tempoChanges,
      cellularResonance: result.cellularResonance,
      createdAt: result.createdAt.toISOString(),
    });
  } catch (error) {
    req.log.error({ err: error }, "Failed to fetch analysis");
    res.status(500).json({ error: "fetch_failed", message: "Failed to fetch analysis" });
  }
});

export default router;
