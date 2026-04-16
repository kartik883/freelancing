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
  DialogHeader,
  DialogTitle,
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
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string | null } | null>(null);

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
        <div className="flex flex-col items-center mb-16 space-y-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.4em] text-[10px] md:text-xs font-semibold"
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
             className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base font-light font-sans"
          >
            See how our community uses Aloma to transform their daily skincare ritual.
          </motion.p>
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
                <CarouselItem key={video.id} className="pl-4 basis-[80%] sm:basis-[45%] md:basis-[33%]">
                  <VideoCard
                    video={video}
                    onPlay={() => setSelectedVideo({ url: video.url, title: video.title })}
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
              onPlay={() => setSelectedVideo({ url: video.url, title: video.title })}
              className="video-card"
            />
          ))}
        </div>
      </div>

      {/* Responsive Video Dialog / Fullscreen */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-[95vw] lg:max-w-5xl h-[85vh] p-0 overflow-hidden bg-[#faf9f6] border-none rounded-3xl shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedVideo?.title || "Ritual Video"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row h-full w-full">
            {/* Left side: Vertical Video Area */}
            <div className="relative w-full lg:w-[45%] h-[60%] lg:h-full bg-black flex items-center justify-center group">
              {selectedVideo && (
                <video
                  src={selectedVideo.url}
                  className="w-full h-full object-cover lg:object-contain"
                  autoPlay
                  controls
                  playsInline
                  loop
                />
              )}
              <DialogClose className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white">
                 <X className="h-5 w-5" />
              </DialogClose>
            </div>

            {/* Right side: Information Area */}
            <div className="w-full lg:w-[55%] h-[40%] lg:h-full p-8 lg:p-12 flex flex-col justify-between bg-white overflow-y-auto custom-scrollbar">
               <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Cure Video
                    </span>
                    <span className="text-muted-foreground text-xs font-light">
                      • 24.5k Views
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl lg:text-5xl font-serif font-light text-foreground leading-tight mb-4">
                      {selectedVideo?.title || "Community Ritual"}
                    </h2>
                    <p className="text-muted-foreground text-sm lg:text-base leading-relaxed font-light font-sans max-w-md">
                      Experience the transformative power of Aloma. This routine focuses on deep hydration and restoring the natural radiance of your skin using our signature botanical extracts.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-secondary/20">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">Featured Products</h4>
                    <div className="flex items-center space-x-4 p-4 bg-secondary/5 rounded-2xl border border-secondary/10 hover:border-primary/20 transition-colors cursor-pointer">
                        <div className="h-16 w-16 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
                           <Image src="/download.jfif" alt="Product" width={64} height={64} className="object-cover h-full w-full" />
                        </div>
                        <div>
                          <p className="font-serif text-lg leading-none mb-1">Radiance Elixir</p>
                          <p className="text-xs text-primary font-medium tracking-wide">₹ 2,499.00</p>
                        </div>
                    </div>
                  </div>
               </div>

               <div className="pt-8 lg:pt-0">
                  <button className="w-full py-5 bg-foreground text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-primary transition-all duration-500 shadow-xl">
                    Shop The Routine
                  </button>
               </div>
            </div>

            {/* Desktop Only Close Button */}
            <DialogClose className="hidden lg:flex absolute top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full text-foreground hover:bg-primary hover:text-white transition-all duration-300 shadow-lg border border-secondary/20">
               <X className="h-5 w-5" />
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
      whileHover={{ y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-secondary/10 shadow-lg transition-all duration-500 ${className}`}
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
          <Play className="h-12 w-12 text-primary opacity-30" />
        </div>
      )}

      {/* Video Overlay (Muted Loop) */}
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${isHovered ? "opacity-100" : ""}`}>
        <video
          src={video.url}
          muted
          loop
          playsInline
          autoPlay={isHovered}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Premium Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

      {/* Ritual Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">
           Ritual Video
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-8 left-8 right-8 z-10">
        <div className="space-y-3">
          <h3 className="text-white font-serif text-2xl tracking-tight leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {video.title || "Pure Glow"}
          </h3>
          
          <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 transform translate-y-4 group-hover:translate-y-0">
             <div className="h-12 w-12 bg-white flex items-center justify-center rounded-full scale-90 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                <Play className="h-5 w-5 text-black fill-black ml-0.5" />
             </div>
             <div className="flex flex-col">
                <span className="text-white text-[10px] uppercase tracking-widest font-bold">Watch Now</span>
                <span className="text-white/60 text-[9px] font-light italic">@aloma_ritual</span>
             </div>
          </div>
        </div>
      </div>

      {/* Inner Glow Border */}
      <div className="absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none group-hover:border-white/40 transition-colors duration-500" />
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