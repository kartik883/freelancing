"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export const VideoSection = () => {
    const containerRef = useRef(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.error("Video play failed", e));
        }
    }, []);

    return (
        <section ref={containerRef} className="relative py-16 px-6 md:py-24 md:px-12 bg-background overflow-hidden">
            <div className="container mx-auto">
                <div className="relative min-h-[550px] md:min-h-0 md:aspect-[21/9] rounded-[2rem] overflow-hidden border border-primary/10 shadow-2xl">
                    {/* Background Video */}
                    <div className="absolute inset-0 z-0 bg-neutral-900">
                        <video
                            ref={videoRef}
                            key="aloma-background-video"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover opacity-60"
                        >
                            <source src="/videohome.mp4" type="video/mp4" />
                            {/* Fallback high-quality video if local fails */}
                            <source 
                                src="https://player.vimeo.com/external/494252666.sd.mp4?s=72ce530c3098305018659d57a26f866b17c8ae97&profile_id=165" 
                                type="video/mp4" 
                            />
                            Your browser does not support the video tag.
                        </video>
                        {/* Premium Dynamic Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                        <div className="absolute inset-0 backdrop-blur-[1px]" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full h-full min-h-[550px] md:min-h-0 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="space-y-6 md:space-y-8 max-w-2xl"
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <motion.span
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="text-white/70 uppercase tracking-[0.5em] text-[10px] sm:text-xs font-bold block"
                                >
                                    Pure Essence
                                </motion.span>
                                <div className="h-[1px] w-8 bg-white/20" />
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 25 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light text-white tracking-tight leading-[1.1] sm:leading-none"
                            >
                                Aloma <br />
                                <span className="italic relative">
                                    Radiance
                                    <svg className="absolute -bottom-2 left-0 w-full opacity-30" viewBox="0 0 200 8" fill="none">
                                        <path d="M1 7C50 1 150 1 199 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.8, duration: 1.2 }}
                                className="max-w-md md:max-w-xl mx-auto text-white/60 text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed"
                            >
                                Discover the perfect harmony between botanical purity and clinical excellence. Crafted for your skin&apos;s ultimate transformation.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="mt-10 md:mt-12"
                        >
                            <button className="px-10 sm:px-12 py-4 sm:py-5 bg-white text-black text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-white/90 transition-all duration-500 shadow-2xl group overflow-hidden relative">
                                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">Discover The Ritual</span>
                                <div className="absolute inset-0 bg-primary/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Premium Edge Refinement */}
                    <div className="absolute inset-0 ring-1 ring-white/10 rounded-[2rem] pointer-events-none" />
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent/10 rounded-full blur-[80px] -z-10 pointer-events-none opacity-50" />
        </section>
    );
};