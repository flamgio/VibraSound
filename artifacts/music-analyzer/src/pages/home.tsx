import { useState } from "react";
import { useLocation } from "wouter";
import { useAnalyzeMusic } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { WaveformIcon, MusicNoteIcon, SparkleIcon, AlertIcon, YoutubeIcon, SoundCloudIcon, DnaIcon, CellIcon, FrequencyIcon } from "@/components/icons";

const FEATURES = [
  {
    icon: FrequencyIcon,
    label: "Frequency Analysis",
    desc: "7-band spectrum from sub-bass to brilliance",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: DnaIcon,
    label: "Cellular Resonance",
    desc: "Solfeggio & healing frequency alignment",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: CellIcon,
    label: "Biofield Impact",
    desc: "Scientific assessment of cellular interaction",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();
  const analyzeMutation = useAnalyzeMusic();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || analyzeMutation.isPending) return;
    analyzeMutation.mutate(
      { data: { url: url.trim() } },
      { onSuccess: (data) => setLocation(`/analysis/${data.id}`) }
    );
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-8rem)]">
      {/* Hero */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <SparkleIcon className="w-4 h-4" />
            Music Rhythm &amp; Cellular Science
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
            Discover the{" "}
            <span className="gradient-text">Hidden Physics</span>
            {" "}of Sound
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Paste any song link to analyze its BPM, frequency spectrum, and cellular resonance.
            Understand how music interacts with the human body at a molecular level.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full"
        >
          <div className="glass-card rounded-2xl p-2 shadow-lg w-full glow-primary">
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MusicNoteIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste a YouTube or SoundCloud link..."
                  className="pl-11 h-12 rounded-xl text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                  data-testid="input-url"
                  disabled={analyzeMutation.isPending}
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-7 rounded-xl font-semibold text-base gap-2 shrink-0 relative overflow-hidden"
                disabled={!url.trim() || analyzeMutation.isPending}
                data-testid="button-analyze"
              >
                <AnimatePresence mode="wait">
                  {analyzeMutation.isPending ? (
                    <motion.span
                      key="analyzing"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <WaveformIcon className="w-5 h-5 animate-pulse" />
                      Analyzing...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="analyze"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <SparkleIcon className="w-5 h-5" />
                      Analyze
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </form>
          </div>

          {/* Supported platforms */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
              YouTube
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <SoundCloudIcon className="w-3.5 h-3.5 text-orange-500" />
              SoundCloud
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span>Direct Audio Links</span>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {analyzeMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full mt-4 flex items-start gap-3 p-4 rounded-xl bg-destructive/8 border border-destructive/20 text-sm"
            >
              <AlertIcon className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Analysis Failed</p>
                <p className="text-muted-foreground mt-0.5">
                  {(analyzeMutation.error as Error)?.message ||
                    "Could not analyze this URL. Please verify the link and try again."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-3xl grid sm:grid-cols-3 gap-4 px-4 pb-12"
      >
        {FEATURES.map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            className="glass-card rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center`}>
              <feat.icon className={`w-5 h-5 ${feat.color}`} />
            </div>
            <div>
              <p className="font-semibold text-sm">{feat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-2xl px-4 mb-8 text-center text-xs text-muted-foreground/70 leading-relaxed"
      >
        Analysis is computed from the song's URL metadata and acoustic theory models. BPM and frequency
        estimates are deterministic for each unique track. Healing frequency research references solfeggio
        and bioacoustic science literature.
      </motion.div>
    </div>
  );
}
