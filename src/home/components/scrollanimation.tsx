"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main pinning timeline
            const mainTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=400%",
                    pin: true,
                    scrub: 1.5,
                }
            });

            // Initial state for sections (except first)
            gsap.set(".section-2, .section-3", { opacity: 0, scale: 0.9, y: 50 });

            // Timeline Sequence
            mainTl
                .to(".section-1", { opacity: 0, scale: 1.1, y: -50, duration: 1.5 })
                .to(".section-2", { opacity: 1, scale: 1, y: 0, duration: 1.5 }, "-=0.5")
                .to(".section-2", { opacity: 0, scale: 1.1, y: -50, duration: 1.5 }, "+=1")
                .to(".section-3", { opacity: 1, scale: 1, y: 0, duration: 1.5 }, "-=0.5");

            // Parallax on image containers
            gsap.utils.toArray<HTMLElement>(".image-container").forEach((container) => {
                gsap.to(container.querySelector("img"), {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const sections = [
        {
            id: "1",
            title: "The Essence of Nature",
            subtitle: "Distilled from the world's most pristine botanical sources, captured at their peak potency.",
            image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=1200",
            className: "section-1"
        },
        {
            id: "2",
            title: "Advanced Bio-Science",
            subtitle: "Where ancient wisdom meets cutting-edge molecular research for transformative results.",
            image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200",
            className: "section-2 absolute inset-0 flex items-center justify-center pointer-events-none"
        },
        {
            id: "3",
            title: "Luminous Transformation",
            subtitle: "Experience a level of radiance and clarity that defines true premium skincare.",
            image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=1200",
            className: "section-3 absolute inset-0 flex items-center justify-center pointer-events-none"
        }
    ];

    return (
        <section ref={sectionRef} className="relative h-screen w-full bg-[#0a0c0b] text-white overflow-hidden">
            {/* Dark Premium Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full opacity-30" />
                <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full opacity-20" />
            </div>

            <div className="container mx-auto h-full px-6 md:px-12 flex items-center justify-center relative z-10">
                {sections.map((section, idx) => (
                    <div key={section.id} className={`${section.className} w-full grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center`}>
                        <div className="space-y-10 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="inline-block"
                            >
                                <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold px-5 py-2.5 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm">
                                    Chronicle {idx + 1}
                                </span>
                            </motion.div>
                            <h2 className="text-6xl md:text-8xl xl:text-9xl font-serif font-light tracking-tight leading-[0.9] text-white/95">
                                {section.title.split(" ").map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </h2>
                            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                                {section.subtitle}
                            </p>
                        </div>

                        <div className="image-container relative aspect-[4/5] overflow-hidden rounded-[4rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.8)] border border-white/5">
                            <Image
                                src={section.image}
                                alt={section.title}
                                fill
                                className="object-cover scale-110"
                                priority={idx === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0c0b]/40 via-transparent to-white/5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Side Progress Navigation */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 hidden xl:flex z-20">
                {sections.map((_, i) => (
                    <div key={i} className="group flex items-center gap-6 cursor-pointer">
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                            PART {i + 1}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary group-hover:scale-150 transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    </div>
                ))}
            </div>

            {/* Footer Prompt */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 opacity-50 z-20">
                <span className="text-[9px] text-white/60 uppercase tracking-[0.4em] font-medium">Scroll to Unveil</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
            </div>
        </section>
    );
};

export default ScrollAnimation;
