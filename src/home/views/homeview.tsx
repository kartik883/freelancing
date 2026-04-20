"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AuthDialog from "../components/authdialog";
import HeroSlider from "../components/herosection";
import { ProductCollection } from "../components/newlaunchproducts";
import ScrollAnimation from "../components/scrollanimation";
import { VideoSection } from "../components/videosection";
import ProductImageDatabase from "../components/productimagedatabase";
import VideosGrid from "../components/videosgrid";
import { PremiumLoadingState } from "@/components/common/premium-loading";

gsap.registerPlugin(ScrollTrigger);

export const HomeView = () => {
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500); // Slightly faster loading for better UX

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (loading || !containerRef.current) return;

        // CRITICAL: Refresh ScrollTrigger after the loading screen is gone 
        // to ensure all trigger positions are calculated based on the final DOM layout.
        // We add a small delay to ensure the browser has finished painting.
        const refreshTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);

        const ctx = gsap.context(() => {
            const scrollSections = containerRef.current?.querySelectorAll(".scroll-reveal-section");
            
            scrollSections?.forEach((section) => {
                gsap.from(section, { 
                    opacity: 0.2,
                    y: 60,
                    filter: "blur(10px)",
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 92%",
                        toggleActions: "play none none none",
                    }
                });
            });
        }, containerRef);

        return () => {
          ctx.revert();
          clearTimeout(refreshTimer);
        }
    }, [loading]);

    if (loading) {
        return (
            <PremiumLoadingState
                title="Preparing your experience"
                description="We’re loading everything beautifully for you..."
                variant="fullscreen"
            />
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col">
            <AuthDialog />
            
            <HeroSlider />
            <ProductImageDatabase />

            <div className="scroll-reveal-section w-full">
                <ProductCollection />
            </div>

            <div className="w-full">
                <ScrollAnimation />
            </div>

            <div className="scroll-reveal-section w-full">
                <VideoSection />
            </div>

            <div className="scroll-reveal-section w-full">
                <VideosGrid />
            </div>
        </div>
    );
};

export const HomeLoadingState = () => {
    return (
        <PremiumLoadingState
            title="Loading Agents"
            description="This may take a few second..."
        />
    );
}