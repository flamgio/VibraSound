import { pgTable, serial, text, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const analysesTable = pgTable("analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  bpm: real("bpm").notNull(),
  key: text("key").notNull(),
  energy: real("energy").notNull(),
  danceability: real("danceability").notNull(),
  dominantFrequency: real("dominant_frequency").notNull(),
  frequencySpectrum: jsonb("frequency_spectrum").notNull().$type<FrequencyBand[]>(),
  beatPattern: jsonb("beat_pattern").notNull().$type<number[]>(),
  tempoChanges: jsonb("tempo_changes").notNull().$type<TempoChange[]>(),
  cellularResonance: jsonb("cellular_resonance").notNull().$type<CellularResonance>(),
  moodGenre: jsonb("mood_genre").$type<MoodGenre>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface FrequencyBand {
  label: string;
  minHz: number;
  maxHz: number;
  amplitude: number;
}

export interface TempoChange {
  timestamp: number;
  bpm: number;
}

export interface HealingFrequency {
  frequency: number;
  name: string;
  presence: number;
  benefit: string;
}

export interface CellularResonance {
  score: number;
  healingFrequencies: HealingFrequency[];
  assessment: string;
  category: "highly_beneficial" | "beneficial" | "neutral" | "potentially_harmful";
}

export interface MoodGenre {
  mood: string;
  moodEmoji: string;
  moodConfidence: number;
  moodDescription: string;
  genre: string;
  subGenre: string;
  genreConfidence: number;
  characteristics: string[];
  moodDimensions: {
    energy: number;
    aggression: number;
    euphoria: number;
    tension: number;
    calmness: number;
  };
}

export const insertAnalysisSchema = createInsertSchema(analysesTable).omit({ id: true, createdAt: true });
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analysesTable.$inferSelect;
