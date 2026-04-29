"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumLoadingStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "fullscreen" | "inline" | "card";
}

export function PremiumLoadingState({
  title = "Loading...",
  description = "Please wait while we prepare everything for you.",
  icon,
  variant = "fullscreen",
}: PremiumLoadingStateProps) {
  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const content = (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "relative flex flex-col items-center justify-center p-8 text-center max-w-[520px] w-full mx-auto",
        variant === "card" && "bg-background/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl",
        variant === "fullscreen" && "min-h-[60vh]"
      )}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-primary/5 blur-[100px] rounded-full" />
      
      {/* Animated Logo/Spinner Area */}
      <div className="relative mb-8">
        {icon ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            {icon}
          </motion.div>
        ) : (
          <div className="relative w-20 h-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-b-2 border-primary/30 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[30%] bg-primary/10 rounded-full blur-sm"
            />
          </div>
        )}
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            animate={{
              y: [0, -40, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            style={{
              top: "50%",
              left: "50%",
            }}
          />
        ))}
      </div>

      {/* Typography */}
      <div className="space-y-4 w-full">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground font-serif">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Skeleton Lines */}
      <div className="mt-8 space-y-3 w-full max-w-[280px]">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="h-1.5 w-[80%] bg-foreground/5 rounded-full mx-auto overflow-hidden"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
        </motion.div>
      </div>

      {/* Animated Gradient Border (if card) */}
      {variant === "card" && (
        <div className="absolute inset-0 rounded-3xl border border-transparent [mask-image:linear-gradient(white,white)_padding-box,linear-gradient(white,white)] pointer-events-none overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0,transparent_25%,var(--primary)_50%,transparent_75%,transparent_100%)] opacity-20"
          />
        </div>
      )}
    </motion.div>
  );

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
        {content}
      </div>
    );
  }

  return content;
}
