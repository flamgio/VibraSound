import { useGetRecentAnalyses } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BpmIcon, MusicNoteIcon, ArrowRightIcon, HistoryIcon, WaveformIcon, CellIcon
} from "@/components/icons";

function CategoryBadge({ category, score }: { category: string; score: number }) {
  const map: Record<string, { cls: string; dot: string }> = {
    highly_beneficial: { cls: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20", dot: "bg-emerald-500" },
    beneficial: { cls: "text-violet-400 bg-violet-500/10 ring-violet-500/20", dot: "bg-violet-400" },
    neutral: { cls: "text-amber-500 bg-amber-500/10 ring-amber-500/20", dot: "bg-amber-500" },
    potentially_harmful: { cls: "text-red-500 bg-red-500/10 ring-red-500/20", dot: "bg-red-500" },
  };
  const { cls, dot } = map[category] ?? { cls: "text-muted-foreground bg-muted/40 ring-border/40", dot: "bg-muted-foreground" };
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-semibold ring-1 ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="font-mono-custom">{Math.round(score)}</span>
      <span className="opacity-60 font-body">/ 100</span>
    </div>
  );
}

export default function History() {
  const { data: analyses, isLoading } = useGetRecentAnalyses({ limit: 20 });

  return (
    <div className="space-y-8 pt-10 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-primary/8 ring-1 ring-primary/18 flex items-center justify-center">
            <HistoryIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-[1.75rem] font-700 tracking-tight leading-tight">Analysis History</h1>
            <p className="text-[13px] text-muted-foreground font-body mt-0.5">Past rhythmic and cellular resonance analyses</p>
          </div>
        </div>
        <Link href="/">
          <Button
            variant="outline"
            className="gap-2 rounded-xl h-9 text-[13px] font-body ring-1 ring-border hover:ring-primary/30 transition-all"
            data-testid="button-new-analysis"
          >
            <WaveformIcon className="w-4 h-4" />
            New Analysis
          </Button>
        </Link>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-2xl" />
          ))}
        </div>
      ) : !analyses?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center py-28 text-center gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 ring-1 ring-border/50 flex items-center justify-center">
            <HistoryIcon className="w-7 h-7 text-muted-foreground/35" />
          </div>
          <div>
            <h3 className="font-display text-[18px] font-700 tracking-tight">No analyses yet</h3>
            <p className="text-[13.5px] text-muted-foreground mt-1 font-body">Analyze your first track to see it here.</p>
          </div>
          <Link href="/">
            <Button className="mt-1 gap-2 rounded-xl btn-glow font-body">
              <WaveformIcon className="w-4 h-4" />
              Analyze a track
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/analysis/${analysis.id}`} data-testid={`card-analysis-${analysis.id}`}>
                <div className="vb-card h-full cursor-pointer group">
                  <div className="relative z-10 p-5 space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-700 text-[14px] leading-snug line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
                        {analysis.title}
                      </h3>
                      <ArrowRightIcon className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                    </div>

                    {/* Date */}
                    <p className="text-[11px] text-muted-foreground/55 font-mono-custom">
                      {format(new Date(analysis.createdAt), "MMM d, yyyy · h:mm a")}
                    </p>

                    {/* Metrics */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 ring-1 ring-border/40 text-[11.5px] font-mono-custom text-muted-foreground">
                        <BpmIcon className="w-3 h-3" />
                        {Math.round(analysis.bpm)} BPM
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 ring-1 ring-border/40 text-[11.5px] font-mono-custom text-muted-foreground">
                        <MusicNoteIcon className="w-3 h-3" />
                        {analysis.key}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-between">
                      <CategoryBadge score={analysis.cellularScore} category={analysis.category} />
                      <div className="flex items-center gap-1 text-[11.5px] text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all">
                        <span className="font-body">View</span>
                        <ArrowRightIcon className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
