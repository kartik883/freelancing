"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="w-full border-b bg-green-950 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-[98px]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/download.jfif"
            alt="logo"
            className="w-12 h-12 rounded-md object-cover"
          />
          <span className=" text-white/50 text-xl font-bold tracking-wide">
            ALOMA
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xl font-medium text-gray-400">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <Link href="/features" className="hover:text-black transition">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-black transition">
            Pricing
          </Link>
          <Link href="/about" className="underline underline-offset-4 hover:text-black transition">
            About us
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className=" text-white hidden md:inline-flex">
            Login
          </Button>
          <Button className="bg-black text-white hover:bg-gray-800">
            Get Started
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Header;