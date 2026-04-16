"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, ArrowRight, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Shop Now",
            links: [
                { name: "All Collection", href: "/collection" },
                { name: "Best Sellers", href: "/best-sellers" },
                { name: "New Arrivals", href: "/new-arrivals" },
                { name: "Special Offers", href: "/offers" },
            ],
        },
        {
            title: "Quick Links",
            links: [
                { name: "Our Story", href: "/about" },
                { name: "Journal", href: "/blog" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faq" },
            ],
        },
    ];

    return (
        <footer className="bg-foreground text-primary-foreground pt-24 pb-12 overflow-hidden border-t border-primary-foreground/10">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    {/* Brand Identity Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative w-12 h-12 overflow-hidden rounded-full border border-primary/30 bg-primary-foreground/15 flex-shrink-0">
                                <img
                                    src="/download.jfif"
                                    alt="Alome Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-2xl md:text-3xl font-serif tracking-[0.3em] font-light">
                                ALOMA
                            </span>
                        </Link>
                        <p className="text-primary-foreground/60 text-base leading-relaxed font-light max-w-xs">
                            Elevating the essence of natural beauty through botanical wisdom and artisanal craftsmanship. Pure. Ethical. Timeless.
                        </p>
                        <div className="flex items-center gap-6 pt-2">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <Link key={i} href="#" className="text-primary-foreground/50 hover:text-primary transition-colors duration-300">
                                    <Icon size={20} strokeWidth={1.5} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="space-y-8">
                            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-primary">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-primary-foreground/60 hover:text-primary-foreground hover:translate-x-2 inline-block transition-all duration-300 font-light text-base"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter Section */}
                    <div className="space-y-8">
                        <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-primary">
                            The Journal
                        </h4>
                        <p className="text-primary-foreground/60 text-sm font-light leading-relaxed">
                            Join our community and receive exclusive botanical wisdom and early access to new rituals.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full bg-primary-foreground/8 border border-primary-foreground/15 rounded-full px-6 py-4 text-sm font-light text-primary-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-primary-foreground/35"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary p-2 rounded-full text-primary-foreground hover:scale-110 transition-transform">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-primary-foreground/40 text-xs font-light tracking-widest uppercase">
                        © {currentYear} ALOMA. All rights reserved.
                    </div>
                    <div className="flex gap-10">
                        {["Privacy Policy", "Terms of Service", "Shipping"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-primary-foreground/45 hover:text-primary-foreground text-[10px] uppercase tracking-[0.2em] transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        </footer>
    );
};