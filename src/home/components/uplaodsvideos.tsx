"use client";
import { useRef, useEffect, useState, Suspense } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Play, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const UploadsVideosContent = () => {
  const trpc = useTRPC();
  const { data: videos } = useSuspenseQuery(
    trpc.home.getVideoUploads.queryOptions()
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !videos || videos.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".video-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [videos]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="py-24 bg-background overflow-hidden px-6 md:px-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.4em] text-[10px] md:text-xs font-semibold"
          >
            Community
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-light tracking-tight text-center"
          >
            Aloma in Real Life
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] w-24 bg-primary/30 mt-4 origin-center"
          />
        </div>

        {/* Mobile & Tablet: Horizontal Scroll */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {videos.map((video) => (
                <CarouselItem key={video.id} className="pl-4 basis-[85%] sm:basis-[45%] md:basis-[33%]">
                  <VideoCard
                    video={video}
                    onPlay={() => setSelectedVideo(video.url)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Desktop: Grid 2-4 */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={() => setSelectedVideo(video.url)}
              className="video-card"
            />
          ))}
        </div>
      </div>

      {/* Responsive Video Dialog / Fullscreen */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-[90vw] lg:max-w-4xl p-0 overflow-hidden bg-black border-none rounded-2xl shadow-2xl">
          <div className="relative aspect-video flex items-center justify-center">
            {selectedVideo && (
              <video
                src={selectedVideo}
                className="w-full h-full object-contain"
                autoPlay
                controls
                playsInline
              />
            )}
            <DialogClose className="absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors">
              <X className="h-6 w-6" />
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

const VideoCard = ({
  video,
  onPlay,
  className,
}: {
  video: { id: string; url: string; thumbnail: string | null; title: string | null };
  onPlay: () => void;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer group rounded-[2rem] overflow-hidden aspect-[9/16] ${className}`}
      onClick={onPlay}
    >
      {/* Thumbnail */}
      {video.thumbnail ? (
        <Image
          src={video.thumbnail}
          alt={video.title || "Video thumbnail"}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
          <Play className="h-12 w-12 text-primary opacity-50" />
        </div>
      )}

      {/* Video Overlay (Muted Loop) */}
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}>
        <video
          src={video.url}
          muted
          loop
          playsInline
          autoPlay={isHovered}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Content */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <h3 className="text-white font-serif text-xl tracking-tight leading-tight mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          {video.title || "Experience Aloma"}
        </h3>
        <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-500">
                <Play className="h-4 w-4 text-white fill-white ml-0.5" />
            </div>
            <span className="text-white/80 text-[10px] uppercase tracking-[0.2em] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                Watch Now
            </span>
        </div>
      </div>

      {/* Premium Border Inner Glow */}
      <div className="absolute inset-0 border border-white/20 rounded-[2rem] pointer-events-none group-hover:border-white/40 transition-colors" />
    </motion.div>
  );
};

const UploadsVideos = () => {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <UploadsVideosContent />
    </Suspense>
  );
};

export default UploadsVideos;