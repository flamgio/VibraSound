import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const demoAnalyses = [
  {
    url: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
    title: "Linkin Park - Numb (Official Music Video)",
    bpm: 112.4,
    key: "Bb Major",
    energy: 0.74,
    danceability: 0.62,
    dominant_frequency: 528,
    frequency_spectrum: [
      { label: "Sub-Bass", minHz: 20, maxHz: 60, amplitude: 0.72 },
      { label: "Bass", minHz: 60, maxHz: 250, amplitude: 0.81 },
      { label: "Low-Mid", minHz: 250, maxHz: 500, amplitude: 0.68 },
      { label: "Mid", minHz: 500, maxHz: 2000, amplitude: 0.76 },
      { label: "Upper-Mid", minHz: 2000, maxHz: 4000, amplitude: 0.64 },
      { label: "Presence", minHz: 4000, maxHz: 6000, amplitude: 0.55 },
      { label: "Brilliance", minHz: 6000, maxHz: 20000, amplitude: 0.42 },
    ],
    beat_pattern: [0.9, 0.3, 0.7, 0.3, 0.9, 0.3, 0.7, 0.3, 0.9, 0.3, 0.7, 0.3, 0.9, 0.3, 0.7, 0.3],
    tempo_changes: [
      { timestamp: 0, bpm: 111.8 },
      { timestamp: 45, bpm: 112.4 },
      { timestamp: 130, bpm: 112.6 },
    ],
    cellular_resonance: {
      score: 72,
      category: "beneficial",
      assessment: "Strong 528 Hz presence promotes cellular restoration. Mid-frequency richness supports emotional release and neural harmony.",
      healingFrequencies: [
        { frequency: 528, name: "528 Hz (DNA Repair)", presence: 0.88, benefit: "Promotes cellular restoration and DNA repair processes" },
        { frequency: 432, name: "432 Hz (Nature Tune)", presence: 0.42, benefit: "Aligns with natural frequencies for calming effect" },
        { frequency: 396, name: "396 Hz (Liberation)", presence: 0.35, benefit: "Releases guilt and fear, grounding effect" },
      ],
    },
    mood_genre: {
      mood: "Melancholic",
      moodEmoji: "🌧",
      moodConfidence: 0.87,
      moodDescription: "Deep emotional weight with cathartic release. Tension-driven verses give way to soaring choruses.",
      genre: "Alternative Rock",
      subGenre: "Nu-Metal",
      genreConfidence: 0.92,
      characteristics: ["Distorted guitars", "Electronic undertones", "Anthemic chorus", "Rap-influenced verses"],
      moodDimensions: { energy: 0.74, aggression: 0.62, euphoria: 0.31, tension: 0.78, calmness: 0.18 },
    },
  },
  {
    url: "https://www.youtube.com/watch?v=SlPhMPnQ58k",
    title: "Weightless - Marconi Union (8 Hours)",
    bpm: 60.0,
    key: "A Minor",
    energy: 0.21,
    danceability: 0.18,
    dominant_frequency: 432,
    frequency_spectrum: [
      { label: "Sub-Bass", minHz: 20, maxHz: 60, amplitude: 0.12 },
      { label: "Bass", minHz: 60, maxHz: 250, amplitude: 0.28 },
      { label: "Low-Mid", minHz: 250, maxHz: 500, amplitude: 0.45 },
      { label: "Mid", minHz: 500, maxHz: 2000, amplitude: 0.62 },
      { label: "Upper-Mid", minHz: 2000, maxHz: 4000, amplitude: 0.58 },
      { label: "Presence", minHz: 4000, maxHz: 6000, amplitude: 0.44 },
      { label: "Brilliance", minHz: 6000, maxHz: 20000, amplitude: 0.31 },
    ],
    beat_pattern: [0.4, 0.1, 0.2, 0.1, 0.4, 0.1, 0.2, 0.1, 0.4, 0.1, 0.2, 0.1, 0.4, 0.1, 0.2, 0.1],
    tempo_changes: [
      { timestamp: 0, bpm: 65 },
      { timestamp: 120, bpm: 62 },
      { timestamp: 300, bpm: 60 },
    ],
    cellular_resonance: {
      score: 97,
      category: "highly_beneficial",
      assessment: "Clinically studied to reduce anxiety by 65%. 432 Hz tuning harmonizes with Earth's natural Schumann resonance. Highly beneficial for cellular regeneration.",
      healingFrequencies: [
        { frequency: 432, name: "432 Hz (Nature Tune)", presence: 0.96, benefit: "Aligns brain waves with Earth's natural frequency" },
        { frequency: 528, name: "528 Hz (DNA Repair)", presence: 0.74, benefit: "Promotes cellular restoration and DNA repair processes" },
        { frequency: 639, name: "639 Hz (Harmony)", presence: 0.68, benefit: "Enhances communication and interpersonal relationships" },
        { frequency: 741, name: "741 Hz (Awakening)", presence: 0.52, benefit: "Supports intuition and problem-solving clarity" },
      ],
    },
    mood_genre: {
      mood: "Calm",
      moodEmoji: "🌊",
      moodConfidence: 0.98,
      moodDescription: "Scientifically designed to induce maximum relaxation. Gradual tempo reduction from 65 BPM synchronizes with resting heart rate.",
      genre: "Ambient",
      subGenre: "Therapeutic Drone",
      genreConfidence: 0.95,
      characteristics: ["Gradual tempo decrease", "Binaural undertones", "Nature-tuned 432 Hz", "No percussion"],
      moodDimensions: { energy: 0.12, aggression: 0.03, euphoria: 0.22, tension: 0.06, calmness: 0.98 },
    },
  },
  {
    url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    title: "Ed Sheeran - Shape of You (Official Audio)",
    bpm: 96.0,
    key: "C# Minor",
    energy: 0.66,
    danceability: 0.83,
    dominant_frequency: 639,
    frequency_spectrum: [
      { label: "Sub-Bass", minHz: 20, maxHz: 60, amplitude: 0.58 },
      { label: "Bass", minHz: 60, maxHz: 250, amplitude: 0.76 },
      { label: "Low-Mid", minHz: 250, maxHz: 500, amplitude: 0.69 },
      { label: "Mid", minHz: 500, maxHz: 2000, amplitude: 0.82 },
      { label: "Upper-Mid", minHz: 2000, maxHz: 4000, amplitude: 0.71 },
      { label: "Presence", minHz: 4000, maxHz: 6000, amplitude: 0.63 },
      { label: "Brilliance", minHz: 6000, maxHz: 20000, amplitude: 0.48 },
    ],
    beat_pattern: [0.9, 0.4, 0.6, 0.4, 0.8, 0.4, 0.6, 0.4, 0.9, 0.4, 0.6, 0.4, 0.8, 0.4, 0.6, 0.4],
    tempo_changes: [
      { timestamp: 0, bpm: 96 },
      { timestamp: 60, bpm: 96 },
      { timestamp: 200, bpm: 96 },
    ],
    cellular_resonance: {
      score: 81,
      category: "highly_beneficial",
      assessment: "Dominant 639 Hz presence strengthens interpersonal harmony and emotional connectivity. Infectious rhythm pattern promotes dopamine release.",
      healingFrequencies: [
        { frequency: 639, name: "639 Hz (Harmony)", presence: 0.84, benefit: "Enhances communication and interpersonal relationships" },
        { frequency: 528, name: "528 Hz (DNA Repair)", presence: 0.61, benefit: "Promotes cellular restoration and DNA repair processes" },
        { frequency: 396, name: "396 Hz (Liberation)", presence: 0.48, benefit: "Releases guilt and fear, grounding effect" },
      ],
    },
    mood_genre: {
      mood: "Groovy",
      moodEmoji: "💃",
      moodConfidence: 0.91,
      moodDescription: "Infectious, dance-floor ready groove. The marimba-driven melody creates an irresistible rhythmic pattern that stimulates motor cortex activity.",
      genre: "Pop",
      subGenre: "Tropical Pop",
      genreConfidence: 0.88,
      characteristics: ["Marimba loops", "Lush backing vocals", "World music influences", "Consistent groove"],
      moodDimensions: { energy: 0.66, aggression: 0.12, euphoria: 0.71, tension: 0.22, calmness: 0.35 },
    },
  },
  {
    url: "https://soundcloud.com/daftpunk/get-lucky",
    title: "Daft Punk - Get Lucky (feat. Pharrell Williams)",
    bpm: 116.0,
    key: "F# Minor",
    energy: 0.78,
    danceability: 0.91,
    dominant_frequency: 741,
    frequency_spectrum: [
      { label: "Sub-Bass", minHz: 20, maxHz: 60, amplitude: 0.68 },
      { label: "Bass", minHz: 60, maxHz: 250, amplitude: 0.84 },
      { label: "Low-Mid", minHz: 250, maxHz: 500, amplitude: 0.77 },
      { label: "Mid", minHz: 500, maxHz: 2000, amplitude: 0.88 },
      { label: "Upper-Mid", minHz: 2000, maxHz: 4000, amplitude: 0.79 },
      { label: "Presence", minHz: 4000, maxHz: 6000, amplitude: 0.72 },
      { label: "Brilliance", minHz: 6000, maxHz: 20000, amplitude: 0.61 },
    ],
    beat_pattern: [1.0, 0.3, 0.6, 0.3, 1.0, 0.3, 0.6, 0.3, 1.0, 0.3, 0.6, 0.3, 1.0, 0.3, 0.6, 0.3],
    tempo_changes: [
      { timestamp: 0, bpm: 116 },
      { timestamp: 90, bpm: 116 },
      { timestamp: 210, bpm: 116 },
    ],
    cellular_resonance: {
      score: 88,
      category: "highly_beneficial",
      assessment: "Exceptional rhythmic consistency at 116 BPM with 741 Hz presence enhances cellular awakening. Nile Rodgers' guitar creates unique harmonic overtones that stimulate neural plasticity.",
      healingFrequencies: [
        { frequency: 741, name: "741 Hz (Awakening)", presence: 0.79, benefit: "Supports intuition and problem-solving clarity" },
        { frequency: 528, name: "528 Hz (DNA Repair)", presence: 0.67, benefit: "Promotes cellular restoration and DNA repair processes" },
        { frequency: 852, name: "852 Hz (Intuition)", presence: 0.58, benefit: "Awakens intuition and returns to spiritual order" },
      ],
    },
    mood_genre: {
      mood: "Euphoric",
      moodEmoji: "✨",
      moodConfidence: 0.94,
      moodConfidence: 0.94,
      moodDescription: "Pure euphoric disco-funk. The hypnotic chord progression creates a trance-like state of joyful anticipation and release.",
      genre: "Electronic",
      subGenre: "Nu-Disco / Funk",
      genreConfidence: 0.93,
      characteristics: ["Live funk guitar", "Four-on-the-floor kick", "Vocoder harmonics", "Synth arpeggios"],
      moodDimensions: { energy: 0.78, aggression: 0.18, euphoria: 0.95, tension: 0.14, calmness: 0.25 },
    },
  },
  {
    url: "https://www.youtube.com/watch?v=hT_nvWreIhg",
    title: "OneRepublic - Counting Stars (Official Music Video)",
    bpm: 122.4,
    key: "C Minor",
    energy: 0.69,
    danceability: 0.72,
    dominant_frequency: 528,
    frequency_spectrum: [
      { label: "Sub-Bass", minHz: 20, maxHz: 60, amplitude: 0.55 },
      { label: "Bass", minHz: 60, maxHz: 250, amplitude: 0.73 },
      { label: "Low-Mid", minHz: 250, maxHz: 500, amplitude: 0.71 },
      { label: "Mid", minHz: 500, maxHz: 2000, amplitude: 0.85 },
      { label: "Upper-Mid", minHz: 2000, maxHz: 4000, amplitude: 0.77 },
      { label: "Presence", minHz: 4000, maxHz: 6000, amplitude: 0.68 },
      { label: "Brilliance", minHz: 6000, maxHz: 20000, amplitude: 0.54 },
    ],
    beat_pattern: [0.9, 0.3, 0.5, 0.7, 0.9, 0.3, 0.5, 0.7, 0.9, 0.3, 0.5, 0.7, 0.9, 0.3, 0.5, 0.7],
    tempo_changes: [
      { timestamp: 0, bpm: 121 },
      { timestamp: 55, bpm: 122.4 },
      { timestamp: 200, bpm: 122.8 },
    ],
    cellular_resonance: {
      score: 76,
      category: "beneficial",
      assessment: "Rich harmonic content with strong 528 Hz presence. The building dynamics and gospel-influenced vocal harmonics create powerful resonance patterns.",
      healingFrequencies: [
        { frequency: 528, name: "528 Hz (DNA Repair)", presence: 0.78, benefit: "Promotes cellular restoration and DNA repair processes" },
        { frequency: 639, name: "639 Hz (Harmony)", presence: 0.64, benefit: "Enhances communication and interpersonal relationships" },
        { frequency: 396, name: "396 Hz (Liberation)", presence: 0.51, benefit: "Releases guilt and fear, grounding effect" },
      ],
    },
    mood_genre: {
      mood: "Energetic",
      moodEmoji: "⚡",
      moodConfidence: 0.85,
      moodDescription: "Driving, anthemic energy with gospel roots. Building from quiet verses to explosive choruses with handclap percussion adds primal rhythm.",
      genre: "Pop",
      subGenre: "Indie Pop / Gospel-influenced",
      genreConfidence: 0.82,
      characteristics: ["Handclap percussion", "Gospel vocal harmonics", "Dynamic builds", "Banjo undertones"],
      moodDimensions: { energy: 0.69, aggression: 0.28, euphoria: 0.62, tension: 0.44, calmness: 0.22 },
    },
  },
  {
    url: "https://www.youtube.com/watch?v=fKopy74weus",
    title: "Hans Zimmer - Time (Inception OST)",
    bpm: 56.0,
    key: "D Major",
    energy: 0.44,
    danceability: 0.22,
    dominant_frequency: 963,
    frequency_spectrum: [
      { label: "Sub-Bass", minHz: 20, maxHz: 60, amplitude: 0.42 },
      { label: "Bass", minHz: 60, maxHz: 250, amplitude: 0.61 },
      { label: "Low-Mid", minHz: 250, maxHz: 500, amplitude: 0.74 },
      { label: "Mid", minHz: 500, maxHz: 2000, amplitude: 0.88 },
      { label: "Upper-Mid", minHz: 2000, maxHz: 4000, amplitude: 0.82 },
      { label: "Presence", minHz: 4000, maxHz: 6000, amplitude: 0.75 },
      { label: "Brilliance", minHz: 6000, maxHz: 20000, amplitude: 0.69 },
    ],
    beat_pattern: [0.7, 0.1, 0.3, 0.1, 0.7, 0.1, 0.3, 0.1, 0.7, 0.1, 0.3, 0.1, 0.7, 0.1, 0.3, 0.1],
    tempo_changes: [
      { timestamp: 0, bpm: 40 },
      { timestamp: 60, bpm: 48 },
      { timestamp: 180, bpm: 56 },
    ],
    cellular_resonance: {
      score: 91,
      category: "highly_beneficial",
      assessment: "Extraordinary 963 Hz presence — the frequency of divine consciousness. Shepard tone effect creates transcendent auditory illusion. Exceptional for pineal gland activation.",
      healingFrequencies: [
        { frequency: 963, name: "963 Hz (Divine)", presence: 0.91, benefit: "Activates pineal gland, promotes divine consciousness" },
        { frequency: 852, name: "852 Hz (Intuition)", presence: 0.78, benefit: "Awakens intuition and returns to spiritual order" },
        { frequency: 741, name: "741 Hz (Awakening)", presence: 0.65, benefit: "Supports intuition and problem-solving clarity" },
      ],
    },
    mood_genre: {
      mood: "Dreamy",
      moodEmoji: "🌌",
      moodConfidence: 0.96,
      moodDescription: "Transcendent, consciousness-expanding soundscape. The Shepard tone creates an ever-ascending illusion that bypasses conscious resistance, dissolving boundaries of time.",
      genre: "Orchestral",
      subGenre: "Cinematic / Neoclassical",
      genreConfidence: 0.97,
      characteristics: ["Shepard tone effect", "Massive orchestral swell", "Minimalist piano motif", "Endless ascension"],
      moodDimensions: { energy: 0.44, aggression: 0.05, euphoria: 0.55, tension: 0.66, calmness: 0.61 },
    },
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Checking existing data...");
    const { rows: existing } = await client.query("SELECT COUNT(*) as count FROM analyses");
    const count = parseInt(existing[0].count, 10);

    if (count >= demoAnalyses.length) {
      console.log(`Database already has ${count} analyses. Skipping seed.`);
      return;
    }

    console.log(`Seeding ${demoAnalyses.length} demo analyses...`);

    for (const demo of demoAnalyses) {
      await client.query(
        `INSERT INTO analyses (url, title, bpm, key, energy, danceability, dominant_frequency, frequency_spectrum, beat_pattern, tempo_changes, cellular_resonance, mood_genre, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW() - (random() * INTERVAL '30 days'))`,
        [
          demo.url,
          demo.title,
          demo.bpm,
          demo.key,
          demo.energy,
          demo.danceability,
          demo.dominant_frequency,
          JSON.stringify(demo.frequency_spectrum),
          JSON.stringify(demo.beat_pattern),
          JSON.stringify(demo.tempo_changes),
          JSON.stringify(demo.cellular_resonance),
          JSON.stringify(demo.mood_genre),
        ]
      );
      console.log(`  ✓ ${demo.title}`);
    }
    console.log("Seed complete!");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
