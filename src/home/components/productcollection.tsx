"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Gentle Renewing Cleanser",
    amount: "$45.00",
    image1:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?q=80&w=1000&auto=format&fit=crop",
    category: "Cleansers",
  },
  {
    id: 2,
    name: "Advanced Hyaluronic Serum",
    amount: "$85.00",
    image1:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop",
    category: "Serums",
  },
  {
    id: 3,
    name: "Deep Hydration Moisturizer",
    amount: "$68.00",
    image1:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1000&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop",
    category: "Moisturizers",
  },
  {
    id: 4,
    name: "Botanical Face Oil",
    amount: "$92.00",
    image1:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000&auto=format&fit=crop",
    image2:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    category: "Face Oils",
  },
];

export const ProductCollection = () => {

  return (
    <section className="py-24 bg-background px-6 md:px-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary uppercase tracking-[0.4em] text-xs font-semibold"
          >
            Try it out
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-light tracking-tight text-center"
          >
            Our Collection
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] w-24 bg-primary/30 mt-4 origin-center"
          />
        </div>

        {/* 🔥 Horizontal scroll on small screens */}
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12">
          {products.map((product, idx) => (
            <div key={product.id} className="min-w-[260px] md:min-w-0">
              <ProductCard product={product} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
      className="space-y-4"
    >
      {/* ✅ Hover ONLY on image */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-secondary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={product.image1}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ${isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
            }`}
        />

        <Image
          src={product.image2}
          alt={`${product.name} alternate`}
          fill
          className={`object-cover absolute inset-0 transition-all duration-700 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
        />
      </div>

      {/* ✅ Text section (NO hover trigger now) */}
      <div className="space-y-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
          {product.category}
        </p>

        {/* ✅ Clickable name */}
        <h3 className="text-lg md:text-xl font-serif font-light leading-tight hover:text-primary transition cursor-pointer">
          {product.name}
        </h3>

        <p className="text-sm font-light tracking-widest text-muted-foreground italic">
          {product.amount}
        </p>

        {/* ✅ Independent button */}
        <button className="w-full bg-white/90 backdrop-blur-md text-black py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300">
          Quick Shop
        </button>
      </div>
    </motion.div>
  );
};