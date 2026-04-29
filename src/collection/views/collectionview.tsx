"use client"

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../components/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import Link from "next/link";

const CollectionView = () => {
    const trpc = useTRPC();
    const { data: products, isLoading } = useQuery(trpc.collection.getmany.queryOptions());
    const { items: cartItems } = useCartStore();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs uppercase tracking-[0.4em] font-bold text-primary animate-pulse">Curating Collection</p>
                </div>
            </div>
        )
    }

    return (
        <section className="relative pt-32 pb-48 px-4 md:px-12 bg-[#FFFAF5] min-h-screen">
            <div className="container mx-auto max-w-7xl">
                {/* Intro Section */}
                <div className="flex flex-col items-center mb-24 space-y-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="h-[1px] w-8 bg-primary/30" />
                        <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">
                            Minimalist Essentials
                        </span>
                        <div className="h-[1px] w-8 bg-primary/30" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-serif font-light tracking-tight text-[#2A1810]"
                    >
                        Ethereal <span className="italic text-primary/80">Rituals</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md text-sm text-foreground/60 font-light leading-relaxed tracking-wide px-4"
                    >
                        A curated collection of conscious skincare, designed for the modern minimalist who values purity and performance.
                    </motion.p>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                        {products.map((product, idx) => (
                            <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 border border-dashed border-primary/20 rounded-[3rem]">
                        <p className="text-muted-foreground font-serif italic text-xl">Our collection is currently being replenished. Please check back soon.</p>
                    </div>
                )}
            </div>

            {/* Floating Premium Cart Button for Mobile/Tablet */}
            <AnimatePresence>
                {cartItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 40 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[25] sm:hidden"
                    >
                        <Link href="/cart">
                            <div className="flex items-center gap-4 bg-[#2A1810] text-white px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl border border-white/10">
                                <div className="relative">
                                    <ShoppingBag size={20} strokeWidth={1.5} />
                                    <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">View Collection</span>
                                <ArrowRight size={16} />
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CollectionView;