"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IntroductionSectionProps {
    description?: string;
    howToUse?: string;
    ingredients?: string;
    benefits?: string;
}

const IntroductionSection = ({
    description,
    howToUse,
    ingredients,
    benefits
}: IntroductionSectionProps) => {
    const [expandedSection, setExpandedSection] = useState<string | null>("introduction");

    const sections = [
        {
            id: "introduction",
            title: "Introduction",
            content: description || "A luxurious addition to your daily skincare ritual, formulated with pure botanical extracts for unparalleled results. This premium formula works deep within the skin's surface to restore radiance and maintain a youthful glow."
        },
        {
            id: "howToUse",
            title: "How to Use",
            content: howToUse || "1. Cleanse your face thoroughly.\n2. Apply 2-3 drops of the serum onto your palm.\n3. Gently press into your skin until fully absorbed.\n4. Follow with your favorite moisturizer."
        },
        {
            id: "ingredients",
            title: "Ingredients",
            content: ingredients || "Aqua, Hyaluronic Acid, Vitamin C, Niacinamide, Glycerin, Organic Aloe Barbadensis Leaf Juice, Camellia Sinensis Leaf Extract, Phenoxyethanol, Ethylhexylglycerin."
        },
        {
            id: "benefits",
            title: "Benefits",
            content: benefits || "• Deeply hydrates and plumps the skin\n• Reduces the appearance of fine lines and wrinkles\n• Evens skin tone and boosts radiance\n• Protects against environmental stressors"
        }
    ];

    return (
        <div className="mt-24 space-y-4 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">Deep Dive</span>
                <h2 className="text-4xl md:text-5xl font-serif font-light mt-4">Product Details</h2>
            </div>

            <div className="border border-primary/10 rounded-3xl overflow-hidden bg-secondary/5">
                {sections.map((section) => (
                    <div key={section.id} className="border-b border-primary/5 last:border-0">
                        <button
                            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                            className="w-full py-8 px-8 md:px-12 flex justify-between items-center text-xs uppercase tracking-widest font-bold text-foreground/80 hover:text-primary transition-colors group"
                        >
                            <span className="group-hover:translate-x-2 transition-transform duration-300">{section.title}</span>
                            {expandedSection === section.id ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} />}
                        </button>
                        <AnimatePresence>
                            {expandedSection === section.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-10 px-8 md:px-12">
                                        <p className="text-muted-foreground font-light leading-relaxed whitespace-pre-line text-sm md:text-base">
                                            {section.content}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IntroductionSection;
