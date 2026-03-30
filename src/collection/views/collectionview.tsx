"use client"

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../components/product-card";
import { motion } from "framer-motion";

const CollectionView = () => {
    const trpc = useTRPC();
    const { data, isLoading } = useQuery(trpc.collection.getmany.queryOptions());

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
        <section className="pt-32 pb-24 px-6 md:px-12 bg-background min-h-screen">
            <div className="container mx-auto">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold"
                    >
                        Our Products
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-serif font-light tracking-tight text-center"
                    >
                        The Full Collection
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-[1px] w-32 bg-primary/30 mt-6"
                    />
                </div>

                {data && data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {data.map((product, idx) => (
                            <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground font-serif italic text-xl">Our collection is currently being replenished. Please check back soon.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CollectionView;