import AboutView from "@/home/views/aboutview";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Story | Alome",
    description: "Learn about Alome's journey to create pure, natural skincare.",
};

export default function AboutPage() {
    return <AboutView />;
}
