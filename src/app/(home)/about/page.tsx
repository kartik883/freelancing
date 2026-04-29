import AboutView from "@/home/views/aboutview";
import { Metadata } from "next";

import { BRAND_NAME } from "@/brandhelp";

export const metadata: Metadata = {
    title: `Our Story | ${BRAND_NAME}`,
    description: `Learn about ${BRAND_NAME}'s journey to create pure, natural skincare.`,
};

export default function AboutPage() {
    return <AboutView />;
}
