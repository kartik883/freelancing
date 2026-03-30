"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Leaf, ShieldCheck, Zap, Heart, ArrowRight, Star, Quote, Award, Sparkles } from "lucide-react";

const AboutView = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax effects for the hero section
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const sectionFadeIn = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
    };

    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    return (
        <div ref={containerRef} className="bg-[#fdfcf9] text-[#1a1a1a] font-sans overflow-x-hidden pt-20">

            {/* Premium Hero with Background Video */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div style={{ y: y1 }} className="h-full w-full relative">
                        {/* Background Video Layer */}
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            onLoadedData={() => setIsVideoLoaded(true)}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <source src="https://player.vimeo.com/external/370331493.hd.mp4?s=38dccd062d6657c79373e48113bf18fb8f78a7f1&profile_id=175" type="video/mp4" />
                        </video>

                        {/* Fallback Image Layer if video fails or while loading */}
                        {!isVideoLoaded && (
                            <Image
                                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
                                alt="Natural background"
                                fill
                                className="object-cover"
                                priority
                            />
                        )}

                        {/* Soft Overlays for Depth */}
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#fdfcf9]" />
                    </motion.div>
                </div>

                <motion.div
                    style={{ opacity }}
                    className="container relative z-10 px-6 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
                    >
                        <Sparkles className="text-primary w-4 h-4" />
                        <span className="text-white uppercase tracking-[0.3em] text-[10px] font-bold">Premium Skincare Evolution</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white text-7xl md:text-[10rem] font-serif font-extralight leading-none tracking-tighter mb-10"
                    >
                        Organic <br /> <span className="italic font-light">Elegance</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="text-white/80 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-12"
                    >
                        Redefining the relationship between nature and beauty through meticulous science and artisanal care.
                    </motion.p>
                </motion.div>
            </section>

            {/* Alternating Sections - Our Philosophy */}
            <section className="py-32 md:py-48 bg-[#fdfcf9]">
                <div className="container px-6 mx-auto">
                    {/* Section 1: Left Image, Right Content */}
                    <div className="grid md:grid-cols-2 gap-24 items-center mb-48">
                        <motion.div
                            {...sectionFadeIn}
                            className="relative group lg:px-12"
                        >
                            <div className="absolute -inset-4 border border-primary/20 rounded-3xl transition-transform duration-700 group-hover:scale-105" />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                                <Image
                                    src="https://images.unsplash.com/photo-1679570939790-9d39b9c65405?q=80&w=870&auto=format&fit=crop"
                                    alt="Craftsmanship"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
                        </motion.div>

                        <motion.div {...sectionFadeIn} className="space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="h-[1px] w-16 bg-primary" />
                                <span className="text-primary text-xs font-bold uppercase tracking-widest">The Seed</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-serif font-light leading-[1.1]">
                                Inspired by the <br /> <span className="italic text-primary">Untamed Earth</span>
                            </h2>
                            <div className="space-y-6 text-foreground/60 text-lg md:text-xl font-light leading-relaxed">
                                <p>
                                    Every Alome formula begins in the wild. We source our botanicals from ethical harvesters who respect the seasonal cycles of the planet.
                                </p>
                                <p>
                                    By preserving the full spectrum of nature’s potency, we deliver skincare that doesn't just treat the surface, but deeply nourishes the soul.
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ x: 10 }}
                                className="group flex items-center gap-6 text-primary font-bold uppercase tracking-[0.2em] text-xs pt-6"
                            >
                                Learn Our Process <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Section 2: Right Image, Left Content */}
                    <div className="grid md:grid-cols-2 gap-24 items-center mb-48">
                        <motion.div {...sectionFadeIn} className="order-2 md:order-1 space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="h-[1px] w-16 bg-primary" />
                                <span className="text-primary text-xs font-bold uppercase tracking-widest">The Science</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-serif font-light leading-[1.1]">
                                Precision <br /> <span className="italic text-primary">Performance</span>
                            </h2>
                            <div className="space-y-6 text-foreground/60 text-lg md:text-xl font-light leading-relaxed">
                                <p>
                                    Nature provides the wisdom, science provides the precision. Our laboratory is where botanical purity meets molecular innovation.
                                </p>
                                <p>
                                    We utilize cold-extraction techniques to ensure that none of the vital nutrients are lost, resulting in active formulas that yield visible transformations.
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ x: 10 }}
                                className="group flex items-center gap-6 text-primary font-bold uppercase tracking-[0.2em] text-xs pt-6"
                            >
                                Our Botanical Library <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                            </motion.button>
                        </motion.div>

                        <motion.div
                            {...sectionFadeIn}
                            className="relative group lg:px-12 order-1 md:order-2"
                        >
                            <div className="absolute -inset-4 border border-primary/20 rounded-3xl transition-transform duration-700 group-hover:scale-105" />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                                <Image
                                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop"
                                    alt="Precision science"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section - Dark Themed Premium */}
            <section className="bg-[#0e0e0e] text-white py-32 md:py-48 overflow-hidden">
                <div className="container px-6 mx-auto">
                    <motion.div
                        {...sectionFadeIn}
                        className="text-center mb-32"
                    >
                        <div className="inline-block py-2 px-6 rounded-full border border-white/10 mb-6 font-bold tracking-[0.3em] text-[10px] uppercase text-primary">Uncompromising</div>
                        <h2 className="text-6xl md:text-8xl font-serif font-extralight tracking-tighter">The Alome <span className="italic font-light">Standards</span></h2>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { icon: Leaf, title: "100% Organic", desc: "No synthetic chemicals, ever. Only pure, earth-grown ingredients." },
                            { icon: ShieldCheck, title: "Artisanal", desc: "Small batch production ensures the highest level of detail and quality." },
                            { icon: Award, title: "Award Winning", desc: "Recognized globally for our innovation in sustainable beauty." },
                            { icon: Heart, title: "Cruelty Free", desc: "We love our planet and all its inhabitants. Zero animal testing." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group p-10 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                                <p className="text-white/40 leading-relaxed font-light text-base">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact & Reviews Section */}
            <section className="py-32 md:py-48 bg-[#fdfcf9] relative">
                <div className="container px-6 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-24">
                        {/* Left: Stats */}
                        <motion.div {...sectionFadeIn} className="space-y-12">
                            <h2 className="text-5xl font-serif font-light leading-tight">Global <br /> <span className="italic text-primary">Growth & reach</span></h2>
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { label: "Community Members", value: "50k+" },
                                    { label: "Countries Served", value: "45+" },
                                    { label: "Natural Ingredients", value: "100%" },
                                    { label: "Positive Reviews", value: "15k+" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-8 bg-white shadow-sm border border-primary/5 rounded-2xl">
                                        <div className="text-3xl font-serif text-primary mb-2">{stat.value}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Featured Testimonial */}
                        <motion.div {...sectionFadeIn} className="relative p-12 md:p-20 bg-primary/[0.03] rounded-[3rem] border border-primary/10">
                            <Quote className="text-primary/20 w-16 h-16 absolute top-10 left-10" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-primary text-primary" />)}
                                </div>
                                <p className="text-2xl md:text-3xl font-serif italic font-light leading-relaxed text-foreground/80">
                                    "Finding Alome was a turning point for my skin. The results are visible, but the ritual itself has become my favorite part of the day. Pure luxury in a bottle."
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                                            alt="User"
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Elena Rodriguez</div>
                                        <div className="text-xs text-foreground/40 uppercase tracking-widest">Wellness Coach</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 container px-6 mx-auto text-center border-t border-primary/10">
                <motion.div {...sectionFadeIn}>
                    <h2 className="text-4xl md:text-7xl font-serif font-light mb-12">Embrace your <span className="italic text-primary">natural glow</span>.</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="bg-primary text-white hover:bg-primary/90 px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 shadow-xl shadow-primary/20 text-primary-foreground">
                            Start Your Ritual
                        </button>
                        <button className="border border-primary/20 text-primary hover:bg-primary/5 px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all">
                            Visit Our Journal
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutView;