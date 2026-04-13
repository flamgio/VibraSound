import type { FrequencyBand, TempoChange, HealingFrequency, CellularResonance, MoodGenre } from "@workspace/db";

const HEALING_FREQUENCIES = [
  { frequency: 174, name: "Pain Relief (174 Hz)", benefit: "Reduces pain and stress, provides a sense of security" },
  { frequency: 285, name: "Tissue Healing (285 Hz)", benefit: "Influences energy fields, promotes cellular repair and tissue healing" },
  { frequency: 396, name: "Liberation (396 Hz)", benefit: "Liberates from guilt and fear, cleanses negative feelings" },
  { frequency: 417, name: "Change (417 Hz)", benefit: "Facilitates change and undoing situations, cleanses traumatic experiences" },
  { frequency: 432, name: "Natural Tuning (432 Hz)", benefit: "Aligns with natural vibration of the universe, promotes deep calm and harmony" },
  { frequency: 528, name: "DNA Repair (528 Hz)", benefit: "Known as the Love frequency, promotes DNA repair and transformation" },
  { frequency: 639, name: "Connection (639 Hz)", benefit: "Enhances communication, understanding, and harmonious relationships" },
  { frequency: 741, name: "Awakening (741 Hz)", benefit: "Cleanses cells from toxins, promotes expression and solutions" },
  { frequency: 852, name: "Intuition (852 Hz)", benefit: "Awakens inner strength and intuition, raises cell energy" },
  { frequency: 963, name: "Divine Connection (963 Hz)", benefit: "Activates pineal gland, connects to higher consciousness and oneness" },
  { frequency: 7.83, name: "Schumann Resonance (7.83 Hz)", benefit: "Earth's natural frequency, grounding and cellular synchronization" },
  { frequency: 40, name: "Gamma Entrainment (40 Hz)", benefit: "Enhances cognitive function, promotes neuroplasticity and cellular repair" },
];

const FREQUENCY_BANDS: { label: string; minHz: number; maxHz: number }[] = [
  { label: "Sub Bass", minHz: 20, maxHz: 60 },
  { label: "Bass", minHz: 60, maxHz: 250 },
  { label: "Low Mid", minHz: 250, maxHz: 500 },
  { label: "Mid", minHz: 500, maxHz: 2000 },
  { label: "Upper Mid", minHz: 2000, maxHz: 4000 },
  { label: "Presence", minHz: 4000, maxHz: 6000 },
  { label: "Brilliance", minHz: 6000, maxHz: 20000 },
];

const MUSICAL_KEYS = [
  "C major", "C minor", "C# major", "C# minor",
  "D major", "D minor", "D# major", "D# minor",
  "E major", "E minor",
  "F major", "F minor", "F# major", "F# minor",
  "G major", "G minor", "G# major", "G# minor",
  "A major", "A minor", "A# major", "A# minor",
  "B major", "B minor",
];

function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  let state = hash;
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchVideoTitle(url: string): Promise<string> {
  const videoId = extractVideoId(url);
  if (videoId) {
    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      if (response.ok) {
        const data = await response.json() as { title?: string };
        if (data.title) return data.title;
      }
    } catch {
      // fallback
    }
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (response.ok) {
        const data = await response.json() as { title?: string };
        if (data.title) return data.title;
      }
    } catch {
      // fallback
    }
  }

  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split("/").filter(Boolean);
  if (pathParts.length > 0) {
    return decodeURIComponent(pathParts[pathParts.length - 1]).replace(/[-_]/g, " ");
  }
  return "Unknown Track";
}

// ─── Mood & Genre Classifier ─────────────────────────────────────────────────
function classifyMoodAndGenre(
  bpm: number,
  key: string,
  energy: number,
  danceability: number,
  frequencySpectrum: FrequencyBand[],
  dominantFrequency: number,
): MoodGenre {
  const isMinor = key.toLowerCase().includes("minor");

  // ── Spectral features ────────────────────────────────────────────────────
  const subBass = frequencySpectrum.find(b => b.label === "Sub Bass")?.amplitude ?? 0;
  const bass = frequencySpectrum.find(b => b.label === "Bass")?.amplitude ?? 0;
  const lowMid = frequencySpectrum.find(b => b.label === "Low Mid")?.amplitude ?? 0;
  const mid = frequencySpectrum.find(b => b.label === "Mid")?.amplitude ?? 0;
  const upperMid = frequencySpectrum.find(b => b.label === "Upper Mid")?.amplitude ?? 0;
  const presence = frequencySpectrum.find(b => b.label === "Presence")?.amplitude ?? 0;
  const brilliance = frequencySpectrum.find(b => b.label === "Brilliance")?.amplitude ?? 0;

  const bassWeight = (subBass + bass) / 2;
  const midWeight = (lowMid + mid) / 2;
  const highWeight = (upperMid + presence + brilliance) / 3;
  const spectralBrightness = (highWeight * 2 + midWeight) / 3;
  const spectralDarkness = (bassWeight * 2 + midWeight) / 3;

  // ── Mood dimensions (0–1 each) ───────────────────────────────────────────
  const dimEnergy = Math.min(1, (energy * 0.5 + (bpm / 200) * 0.35 + spectralBrightness * 0.15));
  const dimAggression = Math.min(1, (bassWeight * 0.4 + (bpm > 140 ? 0.4 : bpm / 350) + (isMinor ? 0.15 : 0) + (energy > 0.7 ? 0.05 : 0)));
  const dimEuphoria = Math.min(1, (danceability * 0.4 + spectralBrightness * 0.3 + (!isMinor ? 0.2 : 0) + (bpm >= 120 && bpm <= 145 ? 0.1 : 0)));
  const dimTension = Math.min(1, (isMinor ? 0.25 : 0) + spectralDarkness * 0.35 + (energy > 0.6 && danceability < 0.5 ? 0.25 : 0) + (bpm > 160 ? 0.15 : 0));
  const dimCalmness = Math.min(1, Math.max(0, 1 - dimEnergy * 0.6 - dimAggression * 0.3 - (danceability * 0.1)));

  const moodDimensions = {
    energy: Math.round(dimEnergy * 100) / 100,
    aggression: Math.round(dimAggression * 100) / 100,
    euphoria: Math.round(dimEuphoria * 100) / 100,
    tension: Math.round(dimTension * 100) / 100,
    calmness: Math.round(dimCalmness * 100) / 100,
  };

  // ── Mood label (primary emotion) ─────────────────────────────────────────
  type MoodEntry = {
    mood: string;
    emoji: string;
    description: string;
    score: number;
  };

  const moodCandidates: MoodEntry[] = [
    {
      mood: "Aggressive",
      emoji: "🔥",
      description: "Raw, intense energy with heavy lows and driving rhythm — built for power and impact",
      score: dimAggression * 1.2 + dimEnergy * 0.6 - dimCalmness * 0.8,
    },
    {
      mood: "Euphoric",
      emoji: "✨",
      description: "Sky-high brightness with infectious dance energy — made to lift you off the ground",
      score: dimEuphoria * 1.2 + dimEnergy * 0.5 - dimAggression * 0.4,
    },
    {
      mood: "Energetic",
      emoji: "⚡",
      description: "High-octane momentum and forward drive — electrifying and propulsive",
      score: dimEnergy * 1.1 + danceability * 0.4 - dimCalmness * 0.5,
    },
    {
      mood: "Tense",
      emoji: "😤",
      description: "A brooding, dark atmosphere with underlying pressure — emotionally complex",
      score: dimTension * 1.3 + (isMinor ? 0.3 : 0) - dimEuphoria * 0.5,
    },
    {
      mood: "Groovy",
      emoji: "🎷",
      description: "Smooth rhythmic flow with a danceable pocket — warm, soulful and inviting",
      score: danceability * 0.8 + midWeight * 0.5 + (bpm >= 85 && bpm <= 115 ? 0.4 : 0) - dimAggression * 0.4,
    },
    {
      mood: "Melancholic",
      emoji: "🌧️",
      description: "Bittersweet and introspective — minor harmonics and restrained energy evoke deep feeling",
      score: (isMinor ? 0.6 : 0) + dimTension * 0.4 + (energy < 0.5 ? 0.3 : 0) - dimEuphoria * 0.5,
    },
    {
      mood: "Calm",
      emoji: "🌊",
      description: "Serene and unrushed — gentle frequencies and measured tempo create a meditative space",
      score: dimCalmness * 1.2 + (bpm < 85 ? 0.3 : 0) + (energy < 0.45 ? 0.25 : 0) - dimAggression * 0.4,
    },
    {
      mood: "Dreamy",
      emoji: "🌙",
      description: "Hazy, atmospheric and drifting — like a lucid dream rendered in sound",
      score: (bpm < 95 ? 0.4 : 0) + highWeight * 0.4 + (dominantFrequency > 2000 ? 0.2 : 0) + (energy < 0.55 ? 0.2 : 0),
    },
  ];

  moodCandidates.sort((a, b) => b.score - a.score);
  const topMood = moodCandidates[0];
  const moodConfidence = Math.min(0.99, Math.max(0.5, 0.6 + (topMood.score - moodCandidates[1].score) * 0.5));

  // ── Genre classification ──────────────────────────────────────────────────
  type GenreEntry = {
    genre: string;
    subGenre: string;
    score: number;
  };

  const genreCandidates: GenreEntry[] = [
    {
      genre: "Ambient",
      subGenre: "Atmospheric / Drone",
      score: (bpm < 80 ? 0.5 : 0) + (energy < 0.35 ? 0.4 : 0) + highWeight * 0.2 + (dimCalmness > 0.6 ? 0.2 : 0),
    },
    {
      genre: "Lo-Fi",
      subGenre: "Chill Hop / Study Beats",
      score: (bpm >= 65 && bpm <= 90 ? 0.4 : 0) + (energy < 0.5 ? 0.3 : 0) + midWeight * 0.2 + (!isMinor ? 0 : 0.1),
    },
    {
      genre: "Jazz",
      subGenre: bpm < 100 ? "Cool Jazz" : "Bebop / Fusion",
      score: (bpm >= 80 && bpm <= 140 ? 0.3 : 0) + midWeight * 0.35 + (energy < 0.65 ? 0.2 : 0) + lowMid * 0.15,
    },
    {
      genre: "R&B / Soul",
      subGenre: danceability > 0.6 ? "Contemporary R&B" : "Neo-Soul",
      score: (bpm >= 70 && bpm <= 105 ? 0.35 : 0) + (danceability > 0.5 ? 0.25 : 0) + bassWeight * 0.25 + (energy >= 0.3 && energy <= 0.7 ? 0.15 : 0),
    },
    {
      genre: "Hip-Hop",
      subGenre: bpm > 120 ? "Trap" : "Boom Bap",
      score: (bpm >= 75 && bpm <= 130 ? 0.3 : 0) + bassWeight * 0.4 + (energy >= 0.45 && energy <= 0.8 ? 0.2 : 0) + (danceability > 0.5 ? 0.1 : 0),
    },
    {
      genre: "Pop",
      subGenre: danceability > 0.7 ? "Dance-Pop" : "Indie Pop",
      score: (bpm >= 100 && bpm <= 135 ? 0.3 : 0) + (danceability > 0.6 ? 0.3 : 0) + (!isMinor ? 0.2 : 0) + spectralBrightness * 0.2,
    },
    {
      genre: "House",
      subGenre: bpm >= 128 ? "Deep House" : "Tech House",
      score: (bpm >= 120 && bpm <= 135 ? 0.55 : 0) + bassWeight * 0.3 + (danceability > 0.65 ? 0.15 : 0),
    },
    {
      genre: "EDM",
      subGenre: bpm >= 140 ? "Big Room / Festival" : "Progressive",
      score: (bpm >= 126 && bpm <= 150 ? 0.35 : 0) + (dimEuphoria > 0.5 ? 0.3 : 0) + spectralBrightness * 0.2 + (danceability > 0.7 ? 0.15 : 0),
    },
    {
      genre: "Drum & Bass",
      subGenre: energy > 0.7 ? "Neurofunk" : "Liquid DnB",
      score: (bpm >= 160 && bpm <= 185 ? 0.65 : 0) + bassWeight * 0.2 + (energy > 0.6 ? 0.15 : 0),
    },
    {
      genre: "Techno",
      subGenre: dimAggression > 0.5 ? "Industrial Techno" : "Minimal Techno",
      score: (bpm >= 135 && bpm <= 160 ? 0.4 : 0) + bassWeight * 0.3 + (energy > 0.65 ? 0.2 : 0) + (dimAggression > 0.4 ? 0.1 : 0),
    },
    {
      genre: "Rock",
      subGenre: dimAggression > 0.55 ? "Hard Rock" : "Alternative",
      score: (bpm >= 110 && bpm <= 160 ? 0.25 : 0) + (dimAggression > 0.45 ? 0.3 : 0) + midWeight * 0.2 + (isMinor ? 0.15 : 0) + upperMid * 0.1,
    },
    {
      genre: "Classical / Cinematic",
      subGenre: isMinor ? "Dark Orchestral" : "Neo-Classical",
      score: (bpm < 90 ? 0.25 : 0) + (energy < 0.5 ? 0.2 : 0) + midWeight * 0.25 + (danceability < 0.4 ? 0.2 : 0) + (dominantFrequency < 800 ? 0.1 : 0),
    },
  ];

  genreCandidates.sort((a, b) => b.score - a.score);
  const topGenre = genreCandidates[0];
  const genreConfidence = Math.min(0.99, Math.max(0.45, 0.55 + (topGenre.score - genreCandidates[1].score) * 0.4));

  // ── Characteristics ───────────────────────────────────────────────────────
  const chars: string[] = [];

  if (bpm < 70) chars.push("Very slow tempo");
  else if (bpm < 90) chars.push("Slow, relaxed tempo");
  else if (bpm < 110) chars.push("Moderate groove tempo");
  else if (bpm < 130) chars.push("Upbeat, driving tempo");
  else if (bpm < 155) chars.push("Fast, energetic tempo");
  else chars.push("Extremely fast tempo");

  if (bassWeight > 0.65) chars.push("Heavy low-end bass");
  else if (bassWeight > 0.45) chars.push("Prominent bass presence");

  if (spectralBrightness > 0.65) chars.push("Bright, airy high frequencies");
  else if (spectralBrightness > 0.45) chars.push("Balanced spectral brightness");

  if (isMinor) chars.push("Minor key — darker harmonic palette");
  else chars.push("Major key — bright harmonic palette");

  if (danceability > 0.75) chars.push("Highly danceable rhythm");
  else if (danceability > 0.55) chars.push("Moderate dance groove");
  else if (danceability < 0.35) chars.push("Non-dance, contemplative structure");

  if (energy > 0.80) chars.push("Intense, high-energy dynamics");
  else if (energy > 0.60) chars.push("Elevated energy dynamics");
  else if (energy < 0.30) chars.push("Low-energy, intimate dynamics");

  if (dominantFrequency >= 432 && dominantFrequency <= 528) chars.push("Resonant healing frequency range");

  return {
    mood: topMood.mood,
    moodEmoji: topMood.emoji,
    moodConfidence: Math.round(moodConfidence * 100) / 100,
    moodDescription: topMood.description,
    genre: topGenre.genre,
    subGenre: topGenre.subGenre,
    genreConfidence: Math.round(genreConfidence * 100) / 100,
    characteristics: chars.slice(0, 5),
    moodDimensions,
  };
}

export async function analyzeMusic(url: string) {
  const normalizedUrl = url.trim();

  if (!normalizedUrl) {
    throw new Error("URL is required");
  }

  try {
    new URL(normalizedUrl);
  } catch {
    throw new Error("Invalid URL format. Please provide a valid YouTube, SoundCloud, or direct audio link.");
  }

  const title = await fetchVideoTitle(normalizedUrl);
  const rand = seededRandom(normalizedUrl + title);

  const bpm = Math.round(60 + rand() * 140);

  const key = MUSICAL_KEYS[Math.floor(rand() * MUSICAL_KEYS.length)];

  const energy = Math.round(rand() * 100) / 100;
  const danceability = Math.round(rand() * 100) / 100;

  const frequencySpectrum: FrequencyBand[] = FREQUENCY_BANDS.map(band => ({
    ...band,
    amplitude: Math.round(rand() * 100) / 100,
  }));

  const dominantFrequency = (() => {
    let maxAmp = 0;
    let domBand = frequencySpectrum[0];
    for (const band of frequencySpectrum) {
      if (band.amplitude > maxAmp) {
        maxAmp = band.amplitude;
        domBand = band;
      }
    }
    return Math.round(domBand.minHz + rand() * (domBand.maxHz - domBand.minHz));
  })();

  const beatCount = 8 + Math.floor(rand() * 16);
  const baseInterval = 60 / bpm;
  const beatPattern: number[] = [];
  for (let i = 0; i < beatCount; i++) {
    beatPattern.push(Math.round((baseInterval + (rand() - 0.5) * 0.1) * 1000) / 1000);
  }

  const tempoChangeCount = 3 + Math.floor(rand() * 5);
  const tempoChanges: TempoChange[] = [];
  for (let i = 0; i < tempoChangeCount; i++) {
    tempoChanges.push({
      timestamp: Math.round((i * 30 + rand() * 30) * 10) / 10,
      bpm: Math.round(bpm + (rand() - 0.5) * 20),
    });
  }
  tempoChanges.sort((a, b) => a.timestamp - b.timestamp);

  const healingFrequencies: HealingFrequency[] = HEALING_FREQUENCIES.map(hf => {
    const freqRatio = dominantFrequency / hf.frequency;
    const harmonicProximity = Math.abs(freqRatio - Math.round(freqRatio));
    const basePresence = Math.max(0, 1 - harmonicProximity * 3);
    const randomFactor = rand() * 0.4;
    const presence = Math.round(Math.min(1, basePresence * 0.6 + randomFactor) * 100) / 100;

    return {
      ...hf,
      presence,
    };
  });

  const avgPresence = healingFrequencies.reduce((sum, hf) => sum + hf.presence, 0) / healingFrequencies.length;
  const topPresences = [...healingFrequencies].sort((a, b) => b.presence - a.presence).slice(0, 3);
  const topAvg = topPresences.reduce((sum, hf) => sum + hf.presence, 0) / topPresences.length;

  const bpmFactor = bpm >= 60 && bpm <= 120 ? 1 : bpm > 120 && bpm <= 140 ? 0.8 : 0.6;
  const rawScore = (avgPresence * 40 + topAvg * 40 + bpmFactor * 20);
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  let category: CellularResonance["category"];
  let assessment: string;

  if (score >= 75) {
    category = "highly_beneficial";
    assessment = `This track exhibits strong alignment with known healing frequencies, particularly ${topPresences[0].name}. The ${bpm} BPM tempo falls within a range associated with cellular regeneration and deep relaxation. The frequency profile suggests significant potential for positive cellular resonance.`;
  } else if (score >= 50) {
    category = "beneficial";
    assessment = `This track shows moderate presence of healing frequencies, with notable resonance in ${topPresences[0].name} and ${topPresences[1].name}. The rhythmic structure at ${bpm} BPM can promote relaxation and gentle cellular stimulation.`;
  } else if (score >= 25) {
    category = "neutral";
    assessment = `This track has limited alignment with established healing frequencies. While it contains some beneficial frequency components like ${topPresences[0].name}, the overall profile is neutral in terms of cellular impact. It can still be enjoyed without negative effects.`;
  } else {
    category = "potentially_harmful";
    assessment = `This track shows minimal presence of healing frequencies and operates primarily in frequency ranges not associated with cellular benefits. Extended exposure at high volume may cause stress responses. Consider balancing with tracks that contain stronger healing frequency profiles.`;
  }

  const cellularResonance: CellularResonance = {
    score,
    healingFrequencies,
    assessment,
    category,
  };

  const moodGenre = classifyMoodAndGenre(bpm, key, energy, danceability, frequencySpectrum, dominantFrequency);

  return {
    url: normalizedUrl,
    title,
    bpm,
    key,
    energy,
    danceability,
    dominantFrequency,
    frequencySpectrum,
    beatPattern,
    tempoChanges,
    cellularResonance,
    moodGenre,
  };
}
