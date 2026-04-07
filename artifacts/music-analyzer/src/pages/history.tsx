import { useGetRecentAnalyses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { BpmIcon, MusicNoteIcon, ArrowRightIcon, HistoryIcon, WaveformIcon } from "@/components/icons";

function CategoryDot({ category }: { category: string }) {
  const map: Record<string, string> = {
    highly_beneficial: "bg-emerald-500",
    beneficial: "bg-primary",
    neutral: "bg-amber-500",
    potentially_harmful: "bg-red-500",
  };
  return <span className={`w-2 h-2 rounded-full ${map[category] ?? "bg-muted"}`} />;
}

function ScoreBadge({ score, category }: { score: number; category: string }) {
  const map: Record<string, string> = {
    highly_beneficial: "bg-emerald-500/12 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
    beneficial: "bg-primary/12 text-primary border-primary/25",
    neutral: "bg-amber-500/12 text-amber-600 border-amber-500/25 dark:text-amber-400",
    potentially_harmful: "bg-red-500/12 text-red-600 border-red-500/25 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${map[category] ?? ""}`}>
      <CategoryDot category={category} />
      Score: {Math.round(score)}
    </span>
  );
}

export default function History() {
  const { data: analyses, isLoading } = useGetRecentAnalyses({ limit: 20 });

  return (
    <div className="space-y-8 pt-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HistoryIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Analysis History</h1>
            <p className="text-sm text-muted-foreground">Past rhythmic and cellular resonance analyses</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2 rounded-xl h-9 text-sm" data-testid="button-new-analysis">
            <WaveformIcon className="w-4 h-4" />
            New Analysis
          </Button>
        </Link>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : !analyses?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <HistoryIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No analyses yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Analyze your first track to see it here.</p>
          </div>
          <Link href="/">
            <Button className="mt-2 gap-2 rounded-xl">
              <WaveformIcon className="w-4 h-4" />
              Analyze a track
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, ease: "easeOut" }}
            >
              <Link href={`/analysis/${analysis.id}`} data-testid={`card-analysis-${analysis.id}`}>
                <Card className="glass-card border-0 rounded-2xl h-full cursor-pointer group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <CardHeader className="pb-2 pt-5 px-5">
                    <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors leading-snug">
                      {analysis.title}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1.5 mt-0.5">
                      {format(new Date(analysis.createdAt), "MMM d, yyyy · h:mm a")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1 text-xs font-medium rounded-lg">
                        <BpmIcon className="w-3 h-3" />
                        {Math.round(analysis.bpm)} BPM
                      </Badge>
                      <Badge variant="secondary" className="gap-1 text-xs font-medium rounded-lg">
                        <MusicNoteIcon className="w-3 h-3" />
                        {analysis.key}
                      </Badge>
                    </div>
                    <ScoreBadge score={analysis.cellularScore} category={analysis.category} />
                    <div className="flex items-center gap-1 text-xs text-primary font-medium mt-1 group-hover:gap-2 transition-all">
                      View full analysis
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
