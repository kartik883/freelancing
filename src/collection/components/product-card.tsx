"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    image: string | null;
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
            action: {
                label: "View Cart",
                onClick: () => window.location.href = "/cart",
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/collection/product/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 rounded-2xl mb-4">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                            No Image
                        </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-6 left-0 right-0 px-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-white text-black py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors shadow-lg"
                        >
                            <ShoppingCart size={14} />
                            Add to Cart
                        </button>
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-md text-black rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg">
                            <Eye size={18} />
                        </div>
                    </div>
                </div>

                <div className="space-y-1 px-1">
                    <h3 className="text-lg font-serif font-light text-foreground group-hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 font-light italic">
                        {product.description || "Premium skincare essential"}
                    </p>
                    <p className="text-sm font-semibold tracking-wider text-foreground pt-1">
                        {product.price}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
};
