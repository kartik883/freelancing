"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProductWithImages = {
    id: string;
    name: string;
    price: string;
    description?: string | null;
    categoryId?: string | null;
    productImage:string| null;
    primaryImages: { id: string; url: string; productId: string }[];
    cureImages: { id: string; url: string; productId: string }[];
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const ProductCardDB = ({
    product,
    index,
}: {
    product: ProductWithImages;
    index: number;
}) => {
    const [hovered, setHovered] = useState(false);

    const primaryImg = product.productImage ;
    const hoverImg = product.cureImages[0]?.url ?? null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.15, duration: 0.75, ease: "easeOut" }}
            className="group flex flex-col"
        >
            {/* ── Image container ── */}
            <Link href={`/collection/product/${product.id}`}>
                <div
                    className="relative aspect-[4/5] overflow-hidden bg-secondary/20 cursor-pointer"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Badge */}
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        className="absolute top-3 left-3 z-10 bg-background/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.25em] px-3 py-1 text-foreground/70 border border-border/40"
                    >
                        New Arrival
                    </motion.span>

                    {/* Primary image */}
                    {primaryImg ? (
                        <Image
                            src={primaryImg}
                            alt={product.name}
                            fill
                            sizes="(max-width:768px) 100vw, 25vw"
                            className={`object-cover transition-all duration-700 ${hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
                                }`}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/60 flex items-center justify-center">
                            <span className="text-muted-foreground/30 text-xs uppercase tracking-widest">No Image</span>
                        </div>
                    )}

                    {/* Cure / hover image */}
                    {hoverImg && hoverImg !== primaryImg && (
                        <Image
                            src={hoverImg}
                            alt={`${product.name} — alternate`}
                            fill
                            sizes="(max-width:768px) 100vw, 25vw"
                            className={`absolute inset-0 object-cover transition-all duration-700 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
                                }`}
                        />
                    )}

                    {/* Quick shop overlay */}
                    <div
                        className={`absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur-sm py-3 text-center transition-all duration-500 ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                            }`}
                    >
                        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-foreground">
                            Quick Shop
                        </span>
                    </div>
                </div>
            </Link>

            {/* ── Info ── */}
            <div className="mt-4 space-y-1.5 text-center px-1">
                <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground font-medium">
                    Skincare
                </p>

                <Link href={`/collection/${product.id}`}>
                    <h3 className="text-base md:text-lg font-serif font-light leading-snug hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-sm font-light tracking-widest text-muted-foreground italic">
                    ₹{product.price}
                </p>

                {/* Add to cart */}
                <button className="w-full mt-2 border border-foreground/20 bg-transparent text-foreground py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all duration-300">
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const ProductImageDatabase = () => {
    const trpc = useTRPC();
    const { data: products } = useSuspenseQuery(
        trpc.home.getProductsWithImages.queryOptions()
    );

    if (!products || products.length === 0) {
        return (
            <section className="py-24 px-6 md:px-12 bg-background text-center">
                <p className="text-muted-foreground text-sm uppercase tracking-widest">
                    No products found
                </p>
            </section>
        );
    }

    return (
        <section className="py-24 bg-background px-6 md:px-12">
            <div className="container mx-auto">
                {/* ── Header ── */}
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary uppercase tracking-[0.4em] text-xs font-semibold"
                    >
                        Our Range
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-light tracking-tight text-center"
                    >
                        Featured Products
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-[1px] w-24 bg-primary/30 mt-4 origin-center"
                    />
                </div>

                {/* ── Grid ── */}
                <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-10 md:overflow-visible">
                    {products.map((product, idx) => (
                        <div key={product.id} className="min-w-[260px] md:min-w-0">
                            <ProductCardDB product={product} index={idx} />
                        </div>
                    ))}
                </div>

                {/* ── View all CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center mt-14"
                >
                    <Link
                        href="/collection"
                        className="border border-foreground/30 px-10 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                        View All Products
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ProductImageDatabase;