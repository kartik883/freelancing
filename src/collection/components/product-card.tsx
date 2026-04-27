"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { ShoppingCart, Eye, Plus } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    image: string | null;
    images?: { url: string }[];
}

export const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
        toast.success(`${product.name} added to cart`, {
            description: "Your selection has been added to your collection.",
        });
    };

    const displayImages = product.images && product.images.length > 0 
        ? [product.image, ...product.images.map(img => img.url)].filter(Boolean) as string[]
        : [product.image].filter(Boolean) as string[];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/collection/product/${product.id}`} className="block h-full">
                <div className="relative h-[48vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-[#F9F7F5] rounded-[2.5rem] mb-6 border border-black/5 transition-all duration-700 group-hover:rounded-[3rem] group-hover:shadow-2xl group-hover:shadow-black/5">
                    
                    {/* Image Collage / Main Image */}
                    <div className="absolute inset-0 w-full h-full">
                        {displayImages.length > 1 ? (
                            <div className="grid grid-cols-2 h-full gap-[2px] bg-white">
                                <div className="relative h-full overflow-hidden">
                                    <Image
                                        src={displayImages[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </div>
                                <div className="grid grid-rows-2 h-full gap-[2px]">
                                    <div className="relative h-full overflow-hidden">
                                        <Image
                                            src={displayImages[1]}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
                                    {displayImages[2] ? (
                                        <div className="relative h-full overflow-hidden">
                                            <Image
                                                src={displayImages[2]}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-primary/5 flex items-center justify-center font-serif italic text-primary/40 text-[10px] sm:text-xs">
                                            Handcrafted
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Badge */}
                    {index % 3 === 0 && (
                        <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-black/5">
                             <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-primary">New Arrival</span>
                        </div>
                    )}

                    {/* Mobile Quick Add Button - Pinned Bottom Right */}
                    <div className="sm:hidden absolute bottom-4 right-4 z-20">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl border border-black/5"
                        >
                            <Plus size={20} strokeWidth={1.5} />
                        </motion.button>
                    </div>

                    {/* Desktop Overlay Actions */}
                    <div className="hidden sm:flex absolute bottom-8 left-0 right-0 px-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-white text-black py-4 rounded-3xl text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all shadow-2xl active:scale-95"
                        >
                            <ShoppingCart size={14} />
                            Add to Cart
                        </button>
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-xl text-black rounded-3xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-2xl cursor-pointer">
                            <Eye size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 px-1 text-left">
                    <div className="flex items-baseline justify-between gap-1">
                        <h3 className="text-xl md:text-2xl font-serif font-light text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {product.name}
                        </h3>
                        <p className="text-base md:text-lg font-medium tracking-tight text-foreground/80">
                            {product.price}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                            {product.description?.split(".")[0] || "Minimalist Skincare Ritual"}
                        </p>
                        {/* Mobile Add to Cart Trigger Area */}
                        <button 
                            onClick={handleAddToCart}
                            className="sm:hidden text-[9px] uppercase tracking-[0.3em] font-bold text-primary active:scale-95"
                        >
                            Quick Add
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
