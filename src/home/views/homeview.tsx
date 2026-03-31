"use client";
import AuthDialog from "../components/authdialog";
import HeroSlider from "../components/herosection";
import { ProductCollection } from "../components/productcollection";
import ScrollAnimation from "../components/scrollanimation";
import { VideoSection } from "../components/videosection";
import ProductImageDatabase from "../components/productimagedatabase";
import UploadsVideos from "../components/uplaodsvideos";

export const HomeView = () => {
    return (
        <div>
            <AuthDialog />
            <HeroSlider />
            <ProductImageDatabase />
            <ProductCollection />
            <ScrollAnimation />
            <VideoSection />
            <UploadsVideos/>
        </div>
    );
};