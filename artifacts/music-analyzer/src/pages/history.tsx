import { useGetRecentAnalyses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format } from "date-fns";
import { Activity, Clock, Music, ArrowRight, Disc } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { data: analyses, isLoading } = useGetRecentAnalyses({ limit: 20 });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    if (score >= 40) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
        <p className="text-muted-foreground mt-2">Past rhythmic and cellular resonance analyses</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analyses?.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur border-border/50 text-center py-12">
          <CardContent className="flex flex-col items-center">
            <Disc className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No analyses yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Start by analyzing your first track.</p>
            <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Analyze a track
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyses?.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/analysis/${analysis.id}`}>
                <Card className="h-full bg-card/50 backdrop-blur border-border/50 hover:bg-accent/50 transition-all cursor-pointer group glow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors text-lg">
                      {analysis.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(analysis.createdAt), 'MMM d, yyyy • h:mm a')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-secondary/50 font-mono">
                        {Math.round(analysis.bpm)} BPM
                      </Badge>
                      <Badge variant="secondary" className="bg-secondary/50">
                        Key: {analysis.key}
                      </Badge>
                      <Badge variant="outline" className={getScoreColor(analysis.cellularScore)}>
                        Resonance: {Math.round(analysis.cellularScore)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-primary font-medium group-hover:underline mt-auto">
                      View details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
