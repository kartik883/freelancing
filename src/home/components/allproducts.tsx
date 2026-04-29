"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import ProductCard from "./product-card";

const ProductImageDatabase = () => {
    const trpc = useTRPC();
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const { data: products } = useSuspenseQuery(
        trpc.home.getProductsWithImages.queryOptions()
    );

    const handleScroll = () => {
        if (!containerRef.current) return;
        const ele = containerRef.current;
        const progress = ele.scrollLeft / (ele.scrollWidth - ele.clientWidth);
        setScrollProgress(progress);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!containerRef.current) return;
        const scrollAmount = containerRef.current.clientWidth * 0.8;
        containerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (!products || products.length === 0) {
        return (
            <section className="py-24 px-6 md:px-12 bg-background text-center">
                <p className="text-muted-foreground text-xs uppercase tracking-[0.4em] font-medium">
                    No products found
                </p>
            </section>
        );
    }

    return (
        <section className="py-24 sm:py-32 bg-background px-6 md:px-12 overflow-hidden">
            <div className="container mx-auto max-w-[1400px]">
                {/* ── Header ── */}
                <div className="flex flex-col items-center mb-20 space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-primary uppercase tracking-[0.5em] text-[10px] sm:text-xs font-bold px-4 py-2 border border-primary/10 rounded-full bg-primary/5"
                    >
                        Our Range
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-serif font-light tracking-tight text-center leading-[0.95]"
                    >
                        Featured <br className="sm:hidden" /> Collections
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-[1px] w-32 bg-primary/20 mt-6 origin-center"
                    />
                </div>

                {/* ── Responsive Grid & Carousel ── */}
                <div className="relative group/container">
                    <div 
                        ref={containerRef}
                        className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide md:gap-x-8 snap-x snap-mandatory"
                        onScroll={handleScroll}
                    >
                        {products.map((product, idx) => (
                            <div
                                key={product.id}
                                className="min-w-[280px] w-[75vw] sm:w-[320px] md:w-[calc(33.333%-22px)] lg:w-[calc(25%-24px)] shrink-0 snap-start transition-all duration-700"
                            >
                                <ProductCard 
                                    product={product as any} 
                                    index={idx} 
                                    badgeText="Best Seller"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Premium Progress Track */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="h-[2px] w-48 bg-primary/10 rounded-full overflow-hidden relative">
                            <motion.div 
                                className="absolute inset-y-0 left-0 bg-primary/40 rounded-full"
                                style={{ width: `${scrollProgress * 100}%` }}
                            />
                        </div>
                        
                        <div className="flex gap-8">
                            <button 
                                onClick={() => scroll('left')}
                                className="text-foreground/40 hover:text-foreground transition-colors disabled:opacity-20"
                                disabled={scrollProgress <= 0}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button 
                                onClick={() => scroll('right')}
                                className="text-foreground/40 hover:text-foreground transition-colors disabled:opacity-20"
                                disabled={scrollProgress >= 0.99}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── View all CTA ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex justify-center mt-20 sm:mt-24"
                >
                    <Link
                        href="/collection"
                        className="group relative overflow-hidden rounded-full border border-primary/20 px-12 py-5 text-[11px] uppercase tracking-[0.4em] font-bold transition-all duration-500 hover:border-primary hover:px-14"
                    >
                        <span className="relative z-10 text-foreground transition-colors group-hover:text-background">
                            Explore Full Catalog
                        </span>
                        <div className="absolute inset-0 z-0 -translate-x-full bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ProductImageDatabase;


// ─── Section ──────────────────────────────────────────────────────────────────


