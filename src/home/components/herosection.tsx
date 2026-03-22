"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop",
    title: "Radiant Skin",
    subtitle: "Glow naturally with premium care",
    category: "Skin Care",
  },
  {
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2070&auto=format&fit=crop",
    title: "Hydration First",
    subtitle: "Deep moisture for healthy skin",
    category: "Moisturizers",
  },
  {
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=2070&auto=format&fit=crop",
    title: "Pure Ingredients",
    subtitle: "Nature meets science",
    category: "Organic",
  },
  {
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2070&auto=format&fit=crop",
    title: "Timeless Beauty",
    subtitle: "Care that lasts forever",
    category: "Anti-Aging",
  },
  {
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop",
    title: "Luxury Routine",
    subtitle: "Upgrade your skincare ritual",
    category: "Premium",
  },
];

const SLIDE_DURATION = 6000;

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (isHovered) return;

    const startTime = Date.now() - (progress / 100) * SLIDE_DURATION;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / SLIDE_DURATION) * 100;

      if (newProgress >= 100) {
        nextSlide();
      } else {
        setProgress(newProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [index, nextSlide, isHovered, progress]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Ken Burns Effect Image */}
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index].image}
              alt={slides[index].title}
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

          {/* Content Wrapper */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-3xl">
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="inline-flex items-center gap-2 mb-6"
                >
                  <span className="w-8 h-[1px] bg-primary/60" />
                  <span className="text-white/80 uppercase tracking-[0.3em] text-xs font-semibold">
                    {slides[index].category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-white text-5xl md:text-8xl font-serif font-light leading-[1.1] tracking-tight mb-8"
                >
                  {slides[index].title.split(" ").map((word, i) => (
                    <span key={i} className="block overflow-hidden">
                      <motion.span
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>{" "}
                    </span>
                  ))}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="text-lg md:text-xl text-white/70 max-w-lg mb-12 font-light leading-relaxed"
                >
                  {slides[index].subtitle}
                </motion.p>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  className="flex flex-wrap gap-6"
                >
                  <button className="group relative flex items-center gap-2 overflow-hidden bg-primary px-8 py-4 text-primary-foreground transition-all hover:pr-12">
                    <span className="font-semibold uppercase tracking-widest text-xs">Shop Collection</span>
                    <ArrowRight className="absolute right-4 translate-x-12 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    <div className="absolute inset-0 -translate-x-full bg-black/10 transition-transform group-hover:translate-x-0" />
                  </button>
                  <button className="group flex items-center gap-2 px-8 py-4 border border-white/30 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black">
                    <span className="font-semibold uppercase tracking-widest text-xs">Discover Story</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Luxury Navigation Controls */}
      <div className="absolute bottom-12 right-6 md:right-12 flex items-center gap-8">
        {/* Slide Counter */}
        {/* <div className="flex items-end gap-2 font-serif text-white order-2 md:order-1">
          <span className="text-3xl font-light">{(index + 1).toString().padStart(2, '0')}</span>
          <span className="text-white/40 mb-1">/</span>
          <span className="text-white/40 mb-1 text-sm">{slides.length.toString().padStart(2, '0')}</span>
        </div> */}

        {/* Arrow Buttons */}
        <div className="flex gap-4 order-1 md:order-2">
          <button
            onClick={prevSlide}
            className="group relative h-14 w-14 flex items-center justify-center border border-white/20 text-white backdrop-blur-md transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <button
            onClick={nextSlide}
            className="group relative h-14 w-14 flex items-center justify-center border border-white/20 text-white backdrop-blur-md transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Progress Bars Indicator */}
      <div className="absolute bottom-0 left-0 w-full flex">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/10 overflow-hidden cursor-pointer" onClick={() => { setIndex(i); setProgress(0); }}>
            {i === index && (
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            )}
            {i < index && <div className="h-full w-full bg-primary/40" />}
          </div>
        ))}
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-12 left-6 md:left-12 pointer-events-none">
        <span className="text-white/20 font-serif italic text-sm tracking-widest uppercase">Est. 2024</span>
      </div>
    </section>
  );
};

export default HeroSlider;