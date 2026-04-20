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

export const metadata: Metadata = {
  title: "Alome | Premium Branding",
  description: "Elevating your brand identity with modern design.",
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