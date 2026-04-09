import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WaveformIcon, ArrowLeftIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-7 text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-20 h-20 rounded-3xl bg-muted/50 ring-1 ring-border/50 flex items-center justify-center"
      >
        <WaveformIcon className="w-9 h-9 text-muted-foreground/30" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-2"
      >
        <div className="label-xs text-primary/60 mb-3 font-mono-custom">Error 404</div>
        <h1 className="font-display text-[2.5rem] font-700 tracking-tight gradient-text">
          Signal lost.
        </h1>
        <p className="text-[15px] text-muted-foreground max-w-sm font-body leading-relaxed">
          This page doesn't exist or has been moved. Head back to the analyzer to continue.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href="/">
          <Button className="gap-2 rounded-xl btn-glow font-body h-10 px-6">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Analyzer
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
