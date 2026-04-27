"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedProductsProps {
    productId: string;
}

const RelatedProductCard = ({ product, index }: { product: any, index: number }) => {
    const mainImage = product.images?.[0]?.url || product.productImage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                delay: index * 0.1, 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] 
            }}
            className="group relative"
        >
            <Link href={`/collection/product/${product.id}`} className="block">
                {/* Glassmorphism Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white/[0.03] backdrop-blur-md border border-white/10 transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.05] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {mainImage ? (
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] uppercase tracking-widest text-white/20">Purastone</span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                </div>

                <div className="mt-6 space-y-2 text-center">
                    <h3 className="text-[13px] font-serif font-light tracking-wide text-white/80 group-hover:text-white transition-colors line-clamp-1 italic">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] w-4 bg-primary/30" />
                        <p className="text-[11px] tracking-[0.25em] text-white/50 font-medium">
                            ₹{product.price}
                        </p>
                        <div className="h-[1px] w-4 bg-primary/30" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const RelatedProducts = ({ productId }: RelatedProductsProps) => {
    const trpc = useTRPC();
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const { data: relatedProducts } = useSuspenseQuery(
        trpc.collection.getRelatedProducts.queryOptions({ productId })
    );

    const handleScroll = () => {
        if (!containerRef.current) return;
        const ele = containerRef.current;
        const progress = ele.scrollLeft / (ele.scrollWidth - ele.clientWidth || 1);
        setScrollProgress(progress);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!containerRef.current) return;
        const scrollAmount = containerRef.current.clientWidth * 0.6;
        containerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (!relatedProducts || relatedProducts.length === 0) return null;

    return (
        <section className="relative py-32 bg-background px-6 md:px-12 overflow-hidden border-t border-white/5">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none translate-y-1/2" />

            <div className="container mx-auto max-w-[1400px] relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3"
                        >
                            <div className="h-[1px] w-8 bg-primary" />
                            <span className="text-primary uppercase tracking-[0.5em] text-[10px] font-bold">
                                Pure Selection
                            </span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-white/90">
                            You May <span className="italic text-primary/80">Also</span> Like
                        </h2>
                    </div>

                    <Link 
                        href="/collection" 
                        className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-bold text-white/40 hover:text-white transition-all outline-none"
                    >
                        Explore More
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all group-hover:border-primary/50 group-hover:bg-primary/10">
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                </div>

                <div className="relative">
                    <div 
                        ref={containerRef}
                        className="flex gap-6 overflow-x-auto pb-16 scrollbar-hide md:gap-x-8 snap-x snap-mandatory px-4 -mx-4"
                        onScroll={handleScroll}
                    >
                        {relatedProducts.map((product, idx) => (
                            <div
                                key={product.id}
                                className="min-w-[220px] w-[65vw] sm:w-[280px] md:w-[calc(25%-18px)] lg:w-[calc(20%-20px)] shrink-0 snap-start"
                            >
                                <RelatedProductCard 
                                    product={product} 
                                    index={idx} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* Premium Interaction Bar */}
                    <div className="mt-8 flex flex-col items-center gap-8">
                        <div className="h-[2px] w-64 bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                animate={{ left: `${scrollProgress * 100}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                style={{ width: "30%" }}
                            />
                        </div>
                        
                        <div className="flex gap-12">
                            <button 
                                onClick={() => scroll('left')}
                                className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-white/30 transition-all hover:border-white/20 hover:text-white disabled:opacity-5 outline-none"
                                disabled={scrollProgress <= 0.01}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button 
                                onClick={() => scroll('right')}
                                className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-white/30 transition-all hover:border-white/20 hover:text-white disabled:opacity-5 outline-none"
                                disabled={scrollProgress >= 0.98}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;