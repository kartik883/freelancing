"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

export type ProductWithImages = {
    id: string;
    name: string;
    price: string;
    description?: string | null;
    categoryId?: string | null;
    productImage: string | null;
    primaryImages: { id: string; url: string; productId: string }[];
    cureImages: { id: string; url: string; productId: string }[];
    isNewLaunch?: boolean | null;
};

interface ProductCardProps {
    product: ProductWithImages;
    index: number;
    badgeText?: string;
}

const ProductCard = ({ product, index, badgeText }: ProductCardProps) => {
    const [hovered, setHovered] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const primaryImg = product.productImage;
    const hoverImg = product.cureImages[0]?.url ?? null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: primaryImg,
        });
        toast.success(`${product.name} added to cart`, {
            description: "Your selection has been added to your collection.",
            action: {
                label: "View Cart",
                onClick: () => window.location.href = "/cart",
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1],
                delay: (index % 4) * 0.1 // Stagger based on column position or similar
            }}
            className="group flex flex-col h-full"
        >
            {/* ── Image container ── */}
            <Link href={`/collection/product/${product.id}`} className="block">
                <div
                    className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.02))] shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer group-hover:border-primary/20 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.18)] group-hover:-translate-y-2
                     dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.2))]"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {/* Badge */}
                    {(badgeText || product.isNewLaunch) && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute left-5 top-5 z-20 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                        >
                            {badgeText || (product.isNewLaunch ? "New Launch" : "Featured")}
                        </motion.span>
                    )}

                    {/* Primary image */}
                    {primaryImg ? (
                        <Image
                            src={primaryImg}
                            alt={product.name}
                            fill
                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                            className={`object-cover rounded-[inherit] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
                            }`}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/60 flex items-center justify-center">
                            <span className="text-muted-foreground/30 text-xs uppercase tracking-widest">No Image</span>
                        </div>
                    )}

                    {/* Hover image */}
                    {hoverImg && hoverImg !== primaryImg && (
                        <Image
                            src={hoverImg}
                            alt={`${product.name} — alternate`}
                            fill
                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                            className={`absolute inset-0 object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                hovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
                            }`}
                        />
                    )}

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {/* Quick shop overlay */}
                    <div
                        className={`absolute inset-x-5 bottom-5 z-20 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl py-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            hovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                    >
                        <span className="text-xs uppercase tracking-[0.3em] font-bold text-white drop-shadow-sm">
                            Quick Shop
                        </span>
                    </div>
                </div>
            </Link>

            {/* ── Info ── */}
            <div className="mt-6 space-y-2 text-center px-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">
                    Premium Skincare
                </p>

                <Link href={`/collection/product/${product.id}`}>
                    <h3 className="text-base sm:text-lg md:text-xl font-serif font-light leading-snug tracking-tight text-foreground/90 transition-all duration-500 hover:text-primary hover:tracking-wide">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm sm:text-base md:text-[0.95rem] tracking-[0.15em] text-foreground/60 font-medium font-sans">
                    ₹{product.price}
                </p>

                {/* Add to cart */}
                <button
                    onClick={handleAddToCart}
                    className="mt-4 w-full rounded-2xl border border-border/60 bg-background/40 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground transition-all duration-500 hover:border-primary/50 hover:bg-foreground hover:text-background hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] active:scale-[0.98]"
                >
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
