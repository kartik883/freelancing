"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { ShoppingCart, Star, ChevronDown, ChevronUp, ArrowLeft, ChevronRight, Leaf, ShieldCheck, FlaskConical, Instagram, Facebook, MessageCircle } from "lucide-react";
import Link from "next/link";
import BenifitSection from "../productviewcomponent/benifitsection";
import IntroductionSection from "../productviewcomponent/introductionsection";
import RelatedProducts from "../components/relatedproducts";

const ProductDetailView = ({ id }: { id: string }) => {
    const trpc = useTRPC();
    const { data: product, isLoading } = useQuery(trpc.collection.getById.queryOptions({ id }));
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>("description");
    const addItem = useCartStore((state) => state.addItem);

    const images = product?.images ? [product.image, ...product.images.map(img => img.url)].filter(Boolean) as string[] : [product?.image].filter(Boolean) as string[];
    const mainImage = selectedImage || images[0] || "";

    const handleAddToCart = () => {
        if (!product) return;
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="w-9 h-9 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
                <h2 className="text-2xl font-serif">Product Not Found</h2>
                <Link href="/collection" className="text-primary hover:underline">Return to Collection</Link>
            </div>
        );
    }

    return (
        <section className="pt-32 pb-24 bg-background min-h-screen">
            <div className="container mx-auto px-6 md:px-12">
                {/* Breadcrumbs */}
                <div className="mb-12 flex items-center gap-4">
                    <Link href="/collection" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                        <ArrowLeft size={14} />
                        Back to Collection
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
                    {/* Left: Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary/10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mainImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full"
                                >
                                    <Image src={mainImage} alt={product.name} fill className="object-cover" />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? "border-primary scale-95" : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">Premium Skincare</span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} strokeWidth={1.5} />
                                ))}
                                <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase ml-2">4.8 (24 Reviews)</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-light tracking-tight text-foreground/80">{product.price}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-8 border-b border-primary/10">
                            <button
                                onClick={handleAddToCart}
                                className="w-full border-2 border-primary text-primary py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                            >
                                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] group"
                            >
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                Buy now
                            </button>
                        </div>

                        {/* Feature Highlights */}
                        <div className="p-6 rounded-3xl border border-primary/10 bg-secondary/5 grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center space-y-2 group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Leaf size={18} />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Natural</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">All Skin</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <FlaskConical size={18} />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">No Chemicals</span>
                            </div>
                        </div>

                        {/* Share Section */}
                        <div className="py-6 flex items-center gap-6 border-y border-primary/5">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Share:</span>
                            <div className="flex gap-4">
                                <Link
                                    href={`https://www.instagram.com/`}
                                    target="_blank"
                                    className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                                >
                                    <Instagram size={14} />
                                </Link>
                                <Link
                                    href={`https://wa.me/?text=Check this out: ${typeof window !== 'undefined' ? window.location.href : ''}`}
                                    target="_blank"
                                    className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                                >
                                    <MessageCircle size={14} />
                                </Link>
                                <Link
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                    target="_blank"
                                    className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                                >
                                    <Facebook size={14} />
                                </Link>
                            </div>
                        </div>


                    </div>
                </div>

                {/* benifit section */}
                <BenifitSection images={images} productName={product.name} />

                {/* section for product introduction  */}
                <IntroductionSection
                    description={product.description || undefined}
                    howToUse={product.howToUse || undefined}
                />

                <RelatedProducts productId={product.id} />


                {/* Reviews Section */}
                <div className="mt-32 space-y-16 border-t border-primary/10 pt-24">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <span className="text-primary uppercase tracking-[0.4em] text-[10px] font-bold">Testimonials</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-light">Customer Experiences</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {product.reviews.length > 0 ? product.reviews.map((review, idx) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-3xl bg-secondary/5 border border-primary/5 space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-primary/10 flex items-center justify-center font-serif text-primary">
                                        {review.userImage ? <img src={review.userImage} className="w-full h-full object-cover" /> : review.userName?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold tracking-tight">{review.userName || "Verified Buyer"}</h4>
                                        <div className="flex gap-1 text-yellow-500 mt-1">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < parseInt(review.rating) ? "currentColor" : "none"} />)}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm font-light leading-relaxed text-muted-foreground italic">"{review.comment}"</p>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-12 bg-secondary/5 rounded-3xl text-center">
                                <p className="text-muted-foreground font-serif italic text-lg">Be the first to share your experience with {product.name}.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </section>
    );
};

const AccordionItem = ({ title, isOpen, onClick, children }: { title: string; isOpen: boolean; onClick: () => void; children: React.ReactNode }) => {
    return (
        <div className="border-b border-primary/5 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-6 flex justify-between items-center text-xs uppercase tracking-widest font-bold text-foreground/80 hover:text-primary transition-colors"
            >
                {title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetailView;
