"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Heart, Shield, Zap } from "lucide-react";
import { BRAND_NAME } from "@/brandhelp";

interface BenefitSectionProps {
    images: string[];
    productName?: string;
}

const BenifitSection = ({ images, productName }: BenefitSectionProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeBenefits = [
        {
            title: "Cellular Regeneration",
            description: "Stimulates natural collagen production to firm and lift your skin's appearance.",
            icon: <Sparkles size={20} />,
            image: images[1] || images[0]
        },
        {
            title: "Deep Hydration",
            description: "Locks in moisture for up to 24 hours, leaving skin plump and dewy.",
            icon: <Heart size={20} />,
            image: images[2] || images[0]
        },
        {
            title: "Skin Barrier Shield",
            description: "Reinforces your natural defenses against environmental pollutants and blue light.",
            icon: <Shield size={20} />,
            image: images[3] || images[0]
        },
        {
            title: "Instant Radiance",
            description: "Visibly brightens dull skin for an immediate, healthy glow.",
            icon: <Zap size={20} />,
            image: images[0]
        }
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Dynamic Image Showcase */}
                    <div className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary/10 shadow-3xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                className="w-full h-full"
                            >
                                <Image
                                    src={activeBenefits[activeIndex]?.image || images[0]}
                                    alt={`${productName} benefit`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: Interactive Benefit List */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">Why {BRAND_NAME}?</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight">Powerful Results.</h2>
                            <p className="text-muted-foreground font-light max-w-lg leading-relaxed">
                                Experience the fusion of nature and science. Our formulas are crafted to deliver visible transformations.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {activeBenefits.map((benefit, idx) => (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    className={`group cursor-default transition-all duration-300 flex items-start gap-6 p-6 rounded-3xl border-2 ${activeIndex === idx
                                            ? "border-primary/20 bg-secondary/5 translate-x-4"
                                            : "border-transparent hover:bg-secondary/5"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeIndex === idx
                                            ? "bg-primary text-white scale-110 rotate-3 shadow-lg"
                                            : "bg-primary/10 text-primary group-hover:scale-110"
                                        }`}>
                                        {benefit.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className={`text-lg font-serif transition-colors ${activeIndex === idx ? "text-primary font-medium" : "text-foreground"
                                            }`}>
                                            {benefit.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenifitSection;
