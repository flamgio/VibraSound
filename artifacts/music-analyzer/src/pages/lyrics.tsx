import { useParams, Link } from "wouter";
import { useGetAnalysis } from "@workspace/api-client-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeftIcon, SparkleIcon, WaveformIcon, AlertIcon, MusicNoteIcon
} from "@/components/icons";

type AnimStyle = "fade-up" | "slide-right" | "typewriter" | "glow" | "scale-pop" | "blur-in";
type FontChoice = "Space Grotesk" | "Inter" | "Georgia" | "Courier New" | "Impact";
type BgChoice = "dark" | "gradient-dark" | "gradient-purple" | "gradient-blue" | "white" | "transparent";

interface LyricsState {
  found: boolean;
  artist: string;
  song: string;
  lines: string[];
  message?: string;
}

const ANIM_STYLES: { id: AnimStyle; label: string }[] = [
  { id: "fade-up", label: "Fade Up" },
  { id: "slide-right", label: "Slide Right" },
  { id: "typewriter", label: "Typewriter" },
  { id: "glow", label: "Glow" },
  { id: "scale-pop", label: "Pop" },
  { id: "blur-in", label: "Blur In" },
];

const FONTS: FontChoice[] = ["Space Grotesk", "Inter", "Georgia", "Courier New", "Impact"];

const BG_PRESETS: { id: BgChoice; label: string; className: string }[] = [
  { id: "dark", label: "Pure Black", className: "bg-black" },
  { id: "gradient-dark", label: "Dark Gradient", className: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" },
  { id: "gradient-purple", label: "Purple Night", className: "bg-gradient-to-br from-purple-950 via-indigo-950 to-black" },
  { id: "gradient-blue", label: "Ocean Deep", className: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" },
  { id: "white", label: "Clean White", className: "bg-white" },
  { id: "transparent", label: "Green Screen", className: "bg-green-500" },
];

function getAnimVariants(style: AnimStyle) {
  switch (style) {
    case "fade-up":
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
      };
    case "slide-right":
      return {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, x: 60, transition: { duration: 0.25 } },
      };
    case "typewriter":
      return {
        hidden: { opacity: 0, width: 0 },
        visible: { opacity: 1, width: "100%", transition: { duration: 0.8, ease: "linear" } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      };
    case "glow":
      return {
        hidden: { opacity: 0, filter: "blur(20px)", scale: 0.95 },
        visible: {
          opacity: 1, filter: "blur(0px)", scale: 1,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
        },
        exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3 } },
      };
    case "scale-pop":
      return {
        hidden: { opacity: 0, scale: 0.5, rotateX: 30 },
        visible: {
          opacity: 1, scale: 1, rotateX: 0,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        },
        exit: { opacity: 0, scale: 1.2, transition: { duration: 0.2 } },
      };
    case "blur-in":
    default:
      return {
        hidden: { opacity: 0, filter: "blur(12px)" },
        visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5 } },
        exit: { opacity: 0, filter: "blur(8px)", transition: { duration: 0.25 } },
      };
  }
}

function TypewriterLine({ text, color, fontSize, fontFamily }: {
  text: string; color: string; fontSize: number; fontFamily: string
}) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{ color, fontFamily, fontSize }} className="whitespace-nowrap overflow-hidden">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function LyricsDisplay({
  lines, currentLine, animStyle, font, fontSize, textColor, textShadow, bgPreset, isLight
}: {
  lines: string[]; currentLine: number; animStyle: AnimStyle; font: FontChoice;
  fontSize: number; textColor: string; textShadow: boolean; bgPreset: BgChoice; isLight: boolean;
}) {
  const bg = BG_PRESETS.find(b => b.id === bgPreset);
  const variants = getAnimVariants(animStyle);
  const line = lines[currentLine] || "";
  const prevLine = currentLine > 0 ? lines[currentLine - 1] : "";
  const nextLine = currentLine < lines.length - 1 ? lines[currentLine + 1] : "";

  return (
    <div className={`w-full h-full ${bg?.className} flex flex-col items-center justify-center relative overflow-hidden rounded-2xl`}>
      {/* Prev line (ghost) */}
      {prevLine && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-full w-full text-center px-8 pointer-events-none">
          <p style={{
            fontFamily: font, fontSize: fontSize * 0.55,
            color: textColor, opacity: 0.3, fontWeight: 600
          }}>
            {prevLine}
          </p>
        </div>
      )}

      {/* Current line */}
      <div className="w-full text-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentLine}-${line}`}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {animStyle === "typewriter" ? (
              <TypewriterLine text={line} color={textColor} fontSize={fontSize} fontFamily={font} />
            ) : (
              <p style={{
                fontFamily: font,
                fontSize,
                color: textColor,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                textShadow: textShadow
                  ? `0 0 40px ${textColor}80, 0 0 80px ${textColor}40`
                  : "none",
              }}>
                {line || "♪"}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next line (ghost) */}
      {nextLine && (
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-full w-full text-center px-8 pointer-events-none">
          <p style={{
            fontFamily: font, fontSize: fontSize * 0.55,
            color: textColor, opacity: 0.25, fontWeight: 600
          }}>
            {nextLine}
          </p>
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {lines.slice(Math.max(0, currentLine - 4), currentLine + 5).map((_, i) => {
          const actual = Math.max(0, currentLine - 4) + i;
          return (
            <div
              key={actual}
              className={`rounded-full transition-all duration-300 ${
                actual === currentLine
                  ? "w-4 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/30"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function LyricsPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: analysis, isLoading: analysisLoading } = useGetAnalysis(id, {
    query: { enabled: !!id }
  });

  const [lyricsState, setLyricsState] = useState<LyricsState | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [editedLines, setEditedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lineDelay, setLineDelay] = useState(3000);
  const [animStyle, setAnimStyle] = useState<AnimStyle>("fade-up");
  const [font, setFont] = useState<FontChoice>("Space Grotesk");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textShadow, setTextShadow] = useState(true);
  const [bgPreset, setBgPreset] = useState<BgChoice>("gradient-dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [editingLine, setEditingLine] = useState<number | null>(null);
  const [tab, setTab] = useState<"preview" | "editor">("preview");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const fetchLyrics = useCallback(async () => {
    if (!analysis) return;
    setLyricsLoading(true);
    try {
      const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      const resp = await fetch(`${BASE_URL}/api/lyrics?title=${encodeURIComponent(analysis.title)}`);
      const data = await resp.json() as LyricsState;
      setLyricsState(data);
      if (data.found && data.lines) {
        setEditedLines(data.lines.filter(l => l.length > 0));
      }
    } catch {
      setLyricsState({ found: false, artist: "", song: "", lines: [], message: "Failed to load lyrics" });
    } finally {
      setLyricsLoading(false);
    }
  }, [analysis]);

  useEffect(() => {
    if (analysis && !lyricsState && !lyricsLoading) {
      fetchLyrics();
    }
  }, [analysis, lyricsState, lyricsLoading, fetchLyrics]);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentLine(prev => {
        if (prev >= editedLines.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, lineDelay);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, lineDelay, editedLines.length]);

  const handleDownload = async () => {
    if (editedLines.length === 0) return;
    setIsDownloading(true);

    const W = 1920, H = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Detect the best supported MIME type
    const mimeTypes = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    const mimeType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) ?? "";

    const stream = canvas.captureStream(30);
    const chunks: Blob[] = [];

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    } catch {
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType || "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(lyricsState?.song || "lyrics").replace(/[^a-z0-9]/gi, "_")}-animated.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setIsDownloading(false);
    };

    const bgColors: Record<string, string> = {
      dark: "#000000",
      "gradient-dark": "#0a0a1a",
      "gradient-purple": "#1a0a2e",
      "gradient-blue": "#0a1020",
      white: "#ffffff",
      transparent: "#00ff00",
    };

    const fps = 30;
    const msPerFrame = 1000 / fps;
    const framesPerLine = Math.max(1, Math.floor((lineDelay / 1000) * fps));
    let lineIdx = 0;
    let frame = 0;

    const drawCanvasFrame = () => {
      const line = editedLines[lineIdx] ?? "";
      const prevL = lineIdx > 0 ? editedLines[lineIdx - 1] : "";
      const nextL = lineIdx < editedLines.length - 1 ? editedLines[lineIdx + 1] : "";
      const progress = frame / framesPerLine;
      const alpha = progress < 0.15 ? progress / 0.15 : progress > 0.85 ? (1 - progress) / 0.15 : 1;

      // Background
      ctx.globalAlpha = 1;
      ctx.fillStyle = bgColors[bgPreset] ?? "#000000";
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Prev line ghost
      if (prevL) {
        ctx.globalAlpha = 0.25 * alpha;
        ctx.font = `600 ${Math.round(fontSize * 0.55)}px "${font}", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(prevL, W / 2, H / 2 - fontSize * 1.6, W - 200);
      }

      // Current line (with word wrap)
      ctx.globalAlpha = alpha;
      ctx.fillStyle = textColor;
      ctx.shadowBlur = 0;
      if (textShadow) {
        ctx.shadowColor = textColor;
        ctx.shadowBlur = 40;
      }
      ctx.font = `700 ${fontSize}px "${font}", sans-serif`;

      const words = line.split(" ");
      const maxW = W - 200;
      const lineObjs: string[] = [];
      let current = "";
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (ctx.measureText(test).width > maxW && current) {
          lineObjs.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lineObjs.push(current);

      const totalH = lineObjs.length * fontSize * 1.3;
      let yStart = H / 2 - totalH / 2 + fontSize / 2;
      for (const l of lineObjs) {
        ctx.fillText(l, W / 2, yStart);
        yStart += fontSize * 1.3;
      }

      ctx.shadowBlur = 0;

      // Next line ghost
      if (nextL) {
        ctx.globalAlpha = 0.2 * alpha;
        ctx.font = `600 ${Math.round(fontSize * 0.55)}px "${font}", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(nextL, W / 2, H / 2 + fontSize * 1.9, W - 200);
      }

      ctx.globalAlpha = 1;
    };

    // Start recording — use setInterval for reliable fixed-rate frame timing
    recorder.start();

    // Draw initial frame immediately
    drawCanvasFrame();

    const intervalId = setInterval(() => {
      frame++;
      if (frame >= framesPerLine) {
        frame = 0;
        lineIdx++;
      }
      if (lineIdx >= editedLines.length) {
        clearInterval(intervalId);
        // Give the recorder a moment to flush the last frames
        setTimeout(() => recorder.stop(), 200);
        return;
      }
      drawCanvasFrame();
    }, msPerFrame);
  };

  const isLight = bgPreset === "white";

  if (analysisLoading) {
    return (
      <div className="max-w-4xl mx-auto pt-8 pb-16 space-y-6">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-12 w-2/3 rounded-xl" />
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertIcon className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">Analysis not found.</p>
        <Link href="/"><Button variant="outline" className="gap-2 rounded-xl"><ArrowLeftIcon className="w-4 h-4" />Back</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/analysis/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 rounded-xl hover:bg-muted/70">
            <ArrowLeftIcon className="w-4 h-4" />Back to Analysis
          </Button>
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <div className="flex items-center gap-2">
          <MusicNoteIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Lyrics Studio</span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight line-clamp-1">{analysis.title}</h1>
        {lyricsState && (
          <p className="text-sm text-muted-foreground mt-1">
            {lyricsState.found
              ? `${lyricsState.artist} · ${lyricsState.song} · ${editedLines.length} lines`
              : lyricsState.message}
          </p>
        )}
      </div>

      {lyricsLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <WaveformIcon className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-muted-foreground">Fetching lyrics...</p>
        </div>
      ) : !lyricsState?.found ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <MusicNoteIcon className="w-7 h-7 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-semibold">Lyrics not found</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {lyricsState?.message || "Could not find lyrics for this track."}<br />
              You can type or paste lyrics manually in the editor tab.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl gap-2" onClick={() => {
            setLyricsState({ found: true, artist: "", song: analysis.title, lines: [] });
            setEditedLines(["Your lyrics here...", "Edit these lines in the editor tab"]);
            setTab("editor");
          }}>
            <SparkleIcon className="w-4 h-4" />Add Lyrics Manually
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Tab navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["preview", "editor"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "preview" ? "Preview" : "Edit Lyrics"}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-4 rounded-lg text-xs gap-1.5"
                onClick={handleDownload}
                disabled={isDownloading || editedLines.length === 0}
              >
                {isDownloading ? (
                  <><WaveformIcon className="w-3.5 h-3.5 animate-pulse" />Exporting...</>
                ) : (
                  <><SparkleIcon className="w-3.5 h-3.5" />Download Video</>
                )}
              </Button>
            </div>
          </div>

          {tab === "editor" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="p-1 rounded-2xl border border-border/50 bg-muted/20 max-h-[400px] overflow-y-auto space-y-1">
                {editedLines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2 group px-2 py-1 rounded-xl hover:bg-muted/40 transition-colors">
                    <span className="text-xs text-muted-foreground/50 w-7 text-right shrink-0 font-mono">{i + 1}</span>
                    {editingLine === i ? (
                      <input
                        autoFocus
                        value={line}
                        onChange={(e) => {
                          const next = [...editedLines];
                          next[i] = e.target.value;
                          setEditedLines(next);
                        }}
                        onBlur={() => setEditingLine(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingLine(null)}
                        className="flex-1 bg-background/80 border border-primary/30 rounded-lg px-3 py-1.5 text-sm outline-none font-mono"
                      />
                    ) : (
                      <button
                        className="flex-1 text-left text-sm px-3 py-1.5 rounded-lg hover:bg-background/60 transition-colors font-mono truncate"
                        onClick={() => { setEditingLine(i); setCurrentLine(i); }}
                      >
                        {line || <span className="text-muted-foreground/40 italic">(empty line)</span>}
                      </button>
                    )}
                    <button
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive transition-all text-xs"
                      onClick={() => setEditedLines(editedLines.filter((_, idx) => idx !== i))}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="w-full text-left px-4 py-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                  onClick={() => setEditedLines([...editedLines, ""])}
                >
                  + Add line
                </button>
              </div>
            </motion.div>
          )}

          {tab === "preview" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {/* Preview area */}
              <div ref={previewRef} className="aspect-video w-full rounded-2xl overflow-hidden border border-border/30 shadow-xl">
                <LyricsDisplay
                  lines={editedLines}
                  currentLine={currentLine}
                  animStyle={animStyle}
                  font={font}
                  fontSize={fontSize}
                  textColor={textColor}
                  textShadow={textShadow}
                  bgPreset={bgPreset}
                  isLight={isLight}
                />
              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-3 mt-3">
                <Button
                  size="sm"
                  variant={isPlaying ? "outline" : "default"}
                  className="h-8 px-4 rounded-lg text-xs gap-1.5"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </Button>
                <Button
                  size="sm" variant="ghost"
                  className="h-8 px-3 rounded-lg text-xs"
                  onClick={() => { setCurrentLine(0); setIsPlaying(false); }}
                >
                  ↩ Reset
                </Button>
                <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
                  <span>{currentLine + 1} / {editedLines.length}</span>
                </div>
                <button className="h-8 px-3 rounded-lg text-xs bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50" onClick={() => setCurrentLine(Math.max(0, currentLine - 1))} disabled={currentLine === 0}>←</button>
                <button className="h-8 px-3 rounded-lg text-xs bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50" onClick={() => setCurrentLine(Math.min(editedLines.length - 1, currentLine + 1))} disabled={currentLine >= editedLines.length - 1}>→</button>
              </div>
            </motion.div>
          )}

          {/* Style Controls */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border/40">
            {/* Animation style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Animation</label>
              <div className="flex flex-wrap gap-1.5">
                {ANIM_STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setAnimStyle(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      animStyle === s.id ? "bg-primary text-primary-foreground" : "bg-background/70 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Background</label>
              <div className="flex flex-wrap gap-1.5">
                {BG_PRESETS.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBgPreset(b.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      bgPreset === b.id ? "bg-primary text-primary-foreground" : "bg-background/70 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Font</label>
              <div className="flex flex-wrap gap-1.5">
                {FONTS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFont(f)}
                    style={{ fontFamily: f }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      font === f ? "bg-primary text-primary-foreground" : "bg-background/70 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Color + Size */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
                  />
                  {["#ffffff", "#fbbf24", "#60a5fa", "#34d399", "#f87171", "#a78bfa"].map(c => (
                    <button
                      key={c}
                      onClick={() => setTextColor(c)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${textColor === c ? "border-primary scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Size: {fontSize}px</label>
                <Slider
                  value={[fontSize]}
                  onValueChange={([v]) => setFontSize(v)}
                  min={24} max={96} step={4}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Speed: {lineDelay / 1000}s/line</label>
                <Slider
                  value={[lineDelay]}
                  onValueChange={([v]) => setLineDelay(v)}
                  min={1000} max={8000} step={500}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Glow toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTextShadow(!textShadow)}
                className={`relative w-10 h-6 rounded-full transition-colors ${textShadow ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${textShadow ? "translate-x-5" : "translate-x-1"}`} />
              </button>
              <label className="text-xs font-medium">Text Glow Effect</label>
            </div>
          </div>

          {/* Download notice */}
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
            <strong className="text-foreground">Video Export:</strong> Downloads a 1920×1080 WebM video of the animated lyrics.
            Import into any video editor (DaVinci Resolve, Premiere, CapCut, etc.) as a clip or overlay.
            For green screen transparency, select the "Green Screen" background.
          </div>
        </div>
      )}
    </div>
  );
}
