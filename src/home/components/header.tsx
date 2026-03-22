"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { setIsOpen, setMode } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Collection", href: "/collection" },
    { name: "Our Story", href: "/about" },
    { name: "Journal", href: "/blog" },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const openAuth = (mode: "signin" | "signup") => {
    setMode(mode);
    setIsOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? "bg-background/80 backdrop-blur-md border-b border-primary/10 py-4 shadow-sm hover:bg-green-900"
        : "bg-black/10 backdrop-blur-[2px] py-8 hover:bg-green-900"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between relative">

          {/* Mobile Menu Icon */}
          <button
            className={`md:hidden ${isScrolled ? "text-foreground" : "text-white drop-shadow-md"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Centered for Luxury Brand Feel */}
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className={`relative w-10 h-10 overflow-hidden rounded-full border border-primary/20 ${isScrolled ? "bg-primary/10" : "bg-white/20 shadow-lg"}`}>
              <img
                src="/download.jfif"
                alt="Alome Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`text-2xl md:text-3xl font-serif tracking-widest transition-all duration-500 ${isScrolled ? "text-primary" : "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"}`}>
              ALOMA
            </span>
          </Link>

          {/* Navigation Links - Center on desktop */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? "text-foreground/70" : "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"} hover:text-primary`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full font-bold" />
              </Link>
            ))}
          </nav>

          {/* Actions: Search, Cart, User Auth */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className={`hidden sm:flex items-center gap-4 ${isScrolled ? "text-foreground/80" : "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"}`}>
              <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5 relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow-lg">
                  0
                </span>
              </button>
            </div>

            {/* Better-Auth Logic: User Avatar vs Login Button */}
            <div className="flex items-center gap-3">
              {isPending ? (
                <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
              ) : session ? (
                <div className="flex items-center gap-2">
                  {/* User Avatar */}
                  <button className="relative w-9 h-9 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm transition-transform hover:scale-105">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md">
                        {session.user.name.charAt(0)}
                      </div>
                    )}
                  </button>
                  <button onClick={handleLogout} className={`p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors`} title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => openAuth("signin")}
                  className={`text-xs uppercase tracking-widest font-semibold px-6 py-2 rounded-full ${isScrolled ? "text-primary hover:bg-primary/10" : "text-white border border-white/30 hover:bg-white/10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"} transition-all`}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-background border-t border-primary/10 overflow-hidden shadow-2xl backdrop-blur-2xl"
          >
            <nav className="flex flex-col gap-6 py-10 px-8 text-center uppercase tracking-[0.3em] text-sm font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] w-12 bg-primary/20 mx-auto" />
              <div className="flex justify-center gap-10 text-foreground/70 py-4">
                <button><Search size={22} /></button>
                <button className="relative">
                  <ShoppingBag size={22} />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">0</span>
                </button>
                {!session && <button onClick={() => openAuth("signin")}><User size={22} /></button>}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;