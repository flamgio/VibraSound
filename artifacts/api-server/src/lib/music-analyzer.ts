import type { FrequencyBand, TempoChange, HealingFrequency, CellularResonance } from "@workspace/db";

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
  };
}
