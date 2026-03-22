"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop",
    title: "Radiant Skin",
    subtitle: "Glow naturally with premium care",
  },
  {
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2070&auto=format&fit=crop",
    title: "Hydration First",
    subtitle: "Deep moisture for healthy skin",
  },
  {
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=2070&auto=format&fit=crop",
    title: "Pure Ingredients",
    subtitle: "Nature meets science",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2070&auto=format&fit=crop",
    title: "Timeless Beauty",
    subtitle: "Care that lasts forever",
  },
  {
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop",
    title: "Luxury Routine",
    subtitle: "Upgrade your skincare ritual",
  },
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={slides[index].image}
            alt="slider"
            fill
            priority
            className="object-cover"
          />

          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6">
              
              <motion.h1
                key={slides[index].title}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-white text-5xl md:text-7xl font-[var(--font-heading)] font-bold leading-tight"
              >
                {slides[index].title}
              </motion.h1>

              <motion.p
                key={slides[index].subtitle}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-lg md:text-xl text-gray-200 max-w-md"
              >
                {slides[index].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex gap-4"
              >
                <button className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition">
                  Shop Now
                </button>

                <button className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition">
                  Explore
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur p-2 rounded-full hover:bg-white/40 transition"
      >
        <ChevronLeft className="text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur p-2 rounded-full hover:bg-white/40 transition"
      >
        <ChevronRight className="text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;