"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, User, Eye, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
type Video = {
  id: string;
  url: string;
  thumbnail: string | null;
  title: string | null;
  description: string | null;
  creatorName: string | null;
  createdAt: Date | string;
};

// ─── Dialog ───────────────────────────────────────────────────────────────────
const VideoDialog = ({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-5xl flex flex-col lg:flex-row bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/40"
          style={{ maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Left: Video Player ──────────────────────────── */}
          <div className="relative w-full lg:w-[42%] bg-foreground flex-shrink-0 flex items-center justify-center"
            style={{ minHeight: "55vw", maxHeight: "90vh" }}>
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-full object-contain"
              autoPlay
              controls
              playsInline
              loop
              preload="auto"
              style={{ maxHeight: "90vh" }}
            />
          </div>

          {/* ── Right: Info ─────────────────────────────────── */}
          <div className="flex flex-col w-full lg:w-[58%] overflow-y-auto bg-background">
            {/* Header */}
            <div className="flex items-start justify-between p-8 pb-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  Cure Ritual
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  24.5k
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary/20 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 pt-6 space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-serif font-light leading-tight text-foreground mb-3">
                  {video.title || "Aloma Ritual"}
                </h2>
                {video.creatorName && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Creator</p>
                      <p className="text-sm font-semibold text-foreground">@{video.creatorName.replace(" ", "_").toLowerCase()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-secondary/20" />

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-3">About this ritual</h4>
                <p className="text-sm leading-relaxed text-muted-foreground font-light">
                  {video.description || "Experience the transformative power of Aloma. This ritual combines ancient botanical wisdom with modern dermatological science for radiant, healthy skin."}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">How to use</h4>
                {["Cleanse your face with warm water", "Apply a small amount evenly", "Let absorb for 3–5 minutes", "Follow with moisturiser"].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-8 pt-0">
              <button className="w-full py-4 rounded-full bg-foreground text-primary-foreground text-xs font-bold uppercase tracking-[0.25em] hover:bg-primary transition-all duration-500 shadow-lg">
                Shop the Routine
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const VideoCard = ({
  video,
  index,
  onClick,
}: {
  video: Video;
  index: number;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="relative group flex-shrink-0 w-[220px] sm:w-full cursor-pointer rounded-3xl overflow-hidden aspect-[9/16] bg-secondary/10 shadow-md"
      onClick={onClick}
    >
      {/* Thumbnail */}
      {video.thumbnail ? (
        <Image
          src={video.thumbnail}
          alt={video.title || "Ritual video"}
          fill
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={index < 4}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Play className="h-12 w-12 text-primary/40" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

      {/* Top Badge */}
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-foreground/15 backdrop-blur-md border border-primary-foreground/20 text-primary-foreground text-[9px] font-bold uppercase tracking-widest">
          <Sparkles className="h-2.5 w-2.5" />
          Ritual
        </span>
      </div>

      {/* Play Button — always visible, no hover-play */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/30 flex items-center justify-center
          opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
          <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-0.5" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-serif text-lg leading-tight mb-1 line-clamp-2">
            {video.title || "Aloma Ritual"}
          </h3>
          {video.creatorName && (
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
              @{video.creatorName.replace(" ", "_").toLowerCase()}
            </p>
          )}
        </div>
      </div>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-3xl border border-primary-foreground/15 group-hover:border-primary-foreground/35 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

// ─── Grid Content ─────────────────────────────────────────────────────────────
const VideosGridContent = () => {
  const trpc = useTRPC();
  const { data: videos } = useSuspenseQuery(
    trpc.home.getVideoUploads.queryOptions()
  );
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -240, behavior: "smooth" });
  }, []);
  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 240, behavior: "smooth" });
  }, []);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center text-center mb-14 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.45em] text-[10px] font-bold"
          >
            Aloma Rituals
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-light tracking-tight"
          >
            Glow in Real Life
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md text-sm md:text-base font-light leading-relaxed"
          >
            Real results from our community. Watch how Aloma transforms everyday skincare into a ritual.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="h-px w-20 bg-primary/30 origin-center"
          />
        </div>

        {/* ── Mobile / Tablet: Horizontal Scroll ── */}
        <div className="relative lg:hidden">
          {/* Scroll Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 h-9 w-9 rounded-full bg-card shadow-lg border border-border/40 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 h-9 w-9 rounded-full bg-card shadow-lg border border-border/40 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
          >
            {videos.map((video, i) => (
              <div key={video.id} className="snap-start">
                <VideoCard
                  video={video}
                  index={i}
                  onClick={() => setSelectedVideo(video)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop: 2 rows × 4 columns grid ── */}
        <div className="hidden lg:grid grid-cols-4 gap-5">
          {videos.slice(0, 8).map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              onClick={() => setSelectedVideo(video)}
            />
          ))}
        </div>
      </div>

      {/* ── Dialog ── */}
      {selectedVideo && (
        <VideoDialog
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
};

// ─── Public Export (with Suspense) ────────────────────────────────────────────
export default function VideosGrid() {
  return (
    <Suspense
      fallback={
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center gap-4 mb-14">
              <div className="h-3 w-24 bg-secondary/40 rounded-full animate-pulse" />
              <div className="h-10 w-64 bg-secondary/40 rounded-full animate-pulse" />
            </div>
            <div className="hidden lg:grid grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[9/16] rounded-3xl bg-secondary/20 animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <VideosGridContent />
    </Suspense>
  );
}
