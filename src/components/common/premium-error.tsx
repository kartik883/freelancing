"use client";

import { motion, Variants } from "framer-motion";
import { AlertTriangle, RefreshCcw, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PremiumErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showSupport?: boolean;
  variant?: "fullscreen" | "inline" | "card";
}

export function PremiumErrorState({
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again or reach out to support.",
  onRetry,
  showSupport,
  variant = "fullscreen",
}: PremiumErrorStateProps) {
  const containerVariants: Variants = {
    initial: { opacity: 0, scale: 0.9, x: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", damping: 20, stiffness: 300 } as any
    },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const content = (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate={["animate", "shake"]}
      className={cn(
        "relative flex flex-col items-center justify-center p-10 text-center max-w-[520px] w-full mx-auto overflow-hidden",
        variant === "card" && "bg-background/40 backdrop-blur-xl border border-destructive/20 rounded-3xl shadow-2xl shadow-destructive/5",
        variant === "fullscreen" && "min-h-[50vh]"
      )}
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]">
        <div className="absolute h-full w-full bg-[grid-linear-gradient(to_right,#808080_1px,transparent_1px),grid-linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Error Illustration/Icon */}
      <div className="relative mb-8">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center border border-destructive/20 shadow-[0_0_30px_rgba(var(--destructive),0.1)]"
        >
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </motion.div>
        {/* Glow */}
        <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full -z-10" />
      </div>

      {/* Typography */}
      <div className="space-y-4 mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif">
          {title}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-[360px] mx-auto">
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        {onRetry && (
          <Button 
            onClick={onRetry}
            size="lg"
            className="rounded-full px-8 font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        {showSupport && (
          <Button 
            variant="outline"
            size="lg"
            className="rounded-full px-8 font-medium border-white/10 glassmorphism hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <LifeBuoy className="w-4 h-4" />
            Support
          </Button>
        )}
      </div>

      {/* Subtle Floating Dust */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-foreground/20 rounded-full"
          animate={{
            y: [0, -100],
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            bottom: "-10px",
            left: `${10 + (i * 12)}%`,
          }}
        />
      ))}
    </motion.div>
  );

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md px-4">
        {content}
      </div>
    );
  }

  return content;
}
