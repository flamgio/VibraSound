import { Router, type Request, type Response, type IRouter } from "express";
import { db, analysesTable } from "@workspace/db";
import { desc, sql, avg, count } from "drizzle-orm";
import { eq } from "drizzle-orm";
import {
  AnalyzeMusicBody,
  GetRecentAnalysesQueryParams,
  GetAnalysisParams,
} from "@workspace/api-zod";
import { analyzeMusic } from "../lib/music-analyzer";

const router: IRouter = Router();

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
      if (cat in categoryBreakdown) {
        categoryBreakdown[cat]++;
      }
    }

    res.json({
      totalAnalyses,
      averageBpm,
      averageCellularScore: avgCellScore,
      topHealingFrequency,
      categoryBreakdown,
    });
  } catch (error) {
    req.log.error({ err: error }, "Failed to fetch stats");
    res.status(500).json({ error: "stats_failed", message: "Failed to fetch statistics" });
  }
});

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
