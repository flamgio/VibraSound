import { useParams, Link } from "wouter";
import { useGetAnalysis, getGetAnalysisQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, HeartPulse, Zap, Music, Disc, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AnalysisDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: analysis, isLoading, isError, error } = useGetAnalysis(id, {
    query: {
      enabled: !!id,
      queryKey: getGetAnalysisQueryKey(id)
    }
  });

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Not Found</AlertTitle>
          <AlertDescription>
            {error?.message || "Could not load the analysis details. It might not exist."}
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline" className="border-destructive/30 hover:bg-destructive/20">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || !analysis) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  const resonanceColor = 
    analysis.cellularResonance.score >= 80 ? "text-emerald-500" :
    analysis.cellularResonance.score >= 60 ? "text-blue-500" :
    analysis.cellularResonance.score >= 40 ? "text-yellow-500" : "text-red-500";

  const resonanceShadow = 
    analysis.cellularResonance.score >= 80 ? "drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
    analysis.cellularResonance.score >= 60 ? "drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" :
    analysis.cellularResonance.score >= 40 ? "drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" : "drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]";

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Badge variant="outline" className="font-mono bg-background/50 backdrop-blur">
          ID: {analysis.id}
        </Badge>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight line-clamp-2">
          {analysis.title}
        </h1>
        <a href={analysis.url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 w-fit">
          <Disc className="w-4 h-4" /> View Original Source
        </a>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card/50 backdrop-blur border-border/50 glow-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Tempo
                <Activity className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">{Math.round(analysis.bpm)} <span className="text-lg text-muted-foreground">BPM</span></div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card/50 backdrop-blur border-border/50 glow-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Musical Key
                <Music className="w-4 h-4 text-chart-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analysis.key}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card/50 backdrop-blur border-border/50 glow-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Energy Level
                <Zap className="w-4 h-4 text-chart-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(analysis.energy * 100).toFixed(0)}<span className="text-lg text-muted-foreground">%</span></div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-card/50 backdrop-blur border-border/50 glow-card h-full overflow-hidden relative">
            <div className={`absolute inset-0 opacity-10 ${resonanceColor} bg-current`}></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Cellular Resonance
                <HeartPulse className={`w-4 h-4 ${resonanceColor}`} />
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-4xl font-bold ${resonanceColor} ${resonanceShadow}`}>
                {analysis.cellularResonance.score}
              </div>
              <p className="text-xs font-medium mt-1 uppercase tracking-wider opacity-80">
                {analysis.cellularResonance.category.replace('_', ' ')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Frequency Spectrum */}
        <Card className="col-span-full lg:col-span-2 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Frequency Spectrum</CardTitle>
            <CardDescription>Distribution of audio frequencies</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.frequencySpectrum}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val*100).toFixed(0)}%`} />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Amplitude']}
                />
                <Bar dataKey="amplitude" radius={[4, 4, 0, 0]}>
                  {analysis.frequencySpectrum.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Healing Frequencies */}
        <Card className="col-span-full lg:col-span-1 bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Healing Frequencies</CardTitle>
            <CardDescription>Detected resonant frequencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.cellularResonance.healingFrequencies.length > 0 ? (
              analysis.cellularResonance.healingFrequencies.map((freq, i) => (
                <div key={i} className="flex flex-col space-y-1 p-3 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{freq.name}</span>
                    <Badge variant="secondary" className="font-mono text-xs">{freq.frequency} Hz</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{freq.benefit}</div>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${freq.presence * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic p-4 text-center border rounded-xl border-dashed">
                No distinct healing frequencies detected.
              </div>
            )}
            
            <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="text-sm font-semibold mb-1">Assessment</h4>
              <p className="text-sm text-muted-foreground">{analysis.cellularResonance.assessment}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tempo Map */}
        {analysis.tempoChanges.length > 0 && (
          <Card className="col-span-full bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Tempo Variations</CardTitle>
              <CardDescription>BPM changes throughout the track timeline</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis.tempoChanges}>
                  <defs>
                    <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => {
                      const mins = Math.floor(val / 60);
                      const secs = Math.floor(val % 60);
                      return `${mins}:${secs.toString().padStart(2, '0')}`;
                    }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                    labelFormatter={(val) => {
                      const mins = Math.floor(Number(val) / 60);
                      const secs = Math.floor(Number(val) % 60);
                      return `Time: ${mins}:${secs.toString().padStart(2, '0')}`;
                    }}
                    formatter={(value: number) => [`${Math.round(value)} BPM`, 'Tempo']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBpm)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
