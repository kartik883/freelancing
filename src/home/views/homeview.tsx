"use client";
import AuthDialog from "../components/authdialog";
import HeroSlider from "../components/herosection";
import { ProductCollection } from "../components/productcollection";
import ScrollAnimation from "../components/scrollanimation";
import { VideoSection } from "../components/videosection";
import ProductImageDatabase from "../components/productimagedatabase";
import VideosGrid from "../components/videosgrid";

export const HomeView = () => {
    return (
        <div>
            <AuthDialog />
            <HeroSlider />
            <ProductImageDatabase />
            <ProductCollection />
            <ScrollAnimation />
            <VideoSection />
            <VideosGrid />
        </div>
    );
};