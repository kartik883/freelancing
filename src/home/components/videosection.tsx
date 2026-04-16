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
        <section ref={containerRef} className="relative py-24 px-6 md:px-12 bg-background overflow-hidden">
            <div className="container mx-auto">
                <div className="relative aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden border border-primary/10 shadow-k">
                    {/* Background Video */}
                    <div className="absolute inset-0 z-0 bg-foreground">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                        <div className="absolute inset-0 bg-primary/5 mix-blend-color" />
                        <div className="absolute inset-0 backdrop-blur-[2px]" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="space-y-4"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-white/80 uppercase tracking-[0.5em] text-[10px] md:text-xs font-semibold block"
                            >
                                Pure Essence
                            </motion.span>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="text-4xl md:text-7xl lg:text-8xl font-serif font-light text-white tracking-tight leading-none"
                            >
                                Aloma <br />
                                <span className="italic">Radiance</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.8, duration: 1.2 }}
                                className="max-w-xl mx-auto text-white/60 text-sm md:text-lg font-light tracking-wide px-4"
                            >
                                Experience the intersection of ancient botanical wisdom and modern dermatological science.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 1.1, duration: 0.8 }}
                        >
                            <button className="px-10 py-4 bg-primary-foreground text-foreground text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-xl group overflow-hidden relative">
                                <span className="relative z-10">Discover The Ritual</span>
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Premium Border Inner Glow */}
                    <div className="absolute inset-0 border-[8px] border-primary-foreground/10 pointer-events-none rounded-[2rem]" />
                    <div className="absolute inset-0 border border-primary-foreground/15 pointer-events-none rounded-[2rem]" />
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        </section>
    );
};