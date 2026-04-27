import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

import { BRAND_NAME, BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/brandhelp";

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: ["natural skincare", "chemical-free products", "acne removal", "pimple treatment", "glowing skin naturally", "botanical skincare India", "unisex skincare", "skincare routine steps"],
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://purastone.com",
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} | Natural Skincare for Acne & Glow`,
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} Skincare`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Chemical-Free Skincare`,
    description: BRAND_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProvider } from "@/components/providers/scroll-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollProvider>
            {children}
            <Toaster richColors position="top-center" />
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
    </TRPCReactProvider>
  );
}