import AuthDialog from "../components/authdialog";
import HeroSlider from "../components/herosection";
import { ProductCollection } from "../components/productcollection";
import ScrollAnimation from "../components/scrollanimation";
import { VideoSection } from "../components/videosection";
import ProductImageDatabase from "../components/productimagedatabase";

export const HomeView = () => {
    return (
        <div>
            <AuthDialog />
            <HeroSlider />
            <ProductImageDatabase />
            <ProductCollection />
            <ScrollAnimation />
            <VideoSection />
        </div>
    );
};