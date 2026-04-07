import { useState } from "react";
import { useLocation } from "wouter";
import { Activity, Music, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAnalyzeMusic } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();
  const analyzeMutation = useAnalyzeMusic();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    analyzeMutation.mutate({ data: { url } }, {
      onSuccess: (data) => {
        setLocation(`/analysis/${data.id}`);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl flex flex-col items-center gap-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-2">
            <Activity className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Hidden Physics</span> of Sound
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Analyze the rhythm, frequencies, and cellular resonance of any music track. Uncover how sound waves interact with the human body.
          </p>
        </div>

        <Card className="w-full p-2 rounded-3xl border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl glow-card">
          <CardContent className="p-4">
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube, SoundCloud, or direct audio link..."
                  className="pl-12 h-14 rounded-2xl text-lg bg-background/50 border-border/50 focus-visible:ring-primary/50"
                  data-testid="input-url"
                  disabled={analyzeMutation.isPending}
                />
              </div>
              <Button 
                type="submit"
                size="lg" 
                className="h-14 px-8 rounded-2xl gap-2 font-semibold text-lg relative overflow-hidden group"
                disabled={!url.trim() || analyzeMutation.isPending}
                data-testid="button-analyze"
              >
                {analyzeMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-5 h-5 animate-spin" /> Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" /> Analyze
                  </span>
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {analyzeMutation.isError && (
          <Alert variant="destructive" className="w-full max-w-xl bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>
              {analyzeMutation.error?.message || "There was an error analyzing the audio. Please verify the URL and try again."}
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
}
