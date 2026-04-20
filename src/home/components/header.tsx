"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, LogOut, Settings, Package, UserCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore, useCartStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const { setIsOpen } = useAuthStore();
  const { items: cartItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled enough for style changes
      setIsScrolled(currentScrollY > 20);

      // Visibility logic: Visible when scrolling down, hidden when scrolling up
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // Show when scrolling down
        } else {
          setIsVisible(true); // Hide when scrolling up
        }
      } else {
        setIsVisible(true); // Always show at the top
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Collection", href: "/collection" },
    { name: "Our Story", href: "/about" },
    { name: "Journal", href: "/blog" },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const openAuth = () => {
    setIsOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -120 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${isScrolled
        ? "bg-background/40 backdrop-blur-xl border-b border-primary/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
        : "bg-transparent py-6 md:py-8"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between relative">
          {/* Left: Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-4">
            <button
              className={`lg:hidden p-2 -ml-2 transition-colors ${isScrolled ? "text-foreground hover:bg-primary/5" : "text-foreground hover:bg-secondary/30"
                }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 outline-none">
              <div
                className={`relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-full border border-primary/20 ${isScrolled ? "bg-primary/10" : "bg-primary/5 shadow-lg"
                  }`}
              >
                <img src={`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/skin_care_fyko63.png`} alt="Alome Logo" className="w-full h-full object-cover" />
              </div>
              <span
                className={`text-xl md:text-3xl font-serif tracking-widest transition-all duration-500 ${isScrolled ? "text-primary" : "text-foreground drop-shadow-sm"
                  }`}
              >
                Purastone
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? "text-foreground/70" : "text-foreground/80"
                  } hover:text-primary outline-none`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search and Cart - Always visible on sm/md as requested */}
            <div
              className={`flex items-center gap-1 md:gap-4 ${isScrolled ? "text-foreground/80" : "text-foreground/70"
                }`}
            >
              <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5 outline-none">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link href="/cart" className="hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5 relative outline-none">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[7px] font-bold text-primary-foreground shadow-sm">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              {isPending ? (
                <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative w-8 h-8 md:w-9 md:h-9 overflow-hidden rounded-full border border-primary/20 shadow-sm transition-transform hover:scale-105 outline-none cursor-pointer">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {session.user.name.charAt(0)}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 p-2 bg-background/95 backdrop-blur-2xl border border-primary/10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl animate-in fade-in zoom-in-95 duration-200"
                  >
                    <DropdownMenuLabel className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/10 bg-primary/5 shadow-inner">
                        {session.user.image ? (
                          <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-serif text-primary">
                            {session.user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground tracking-tight">{session.user.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Premium Member</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                    <div className="p-1">
                      <DropdownMenuItem className="flex items-center gap-3 p-3 text-xs uppercase tracking-widest font-medium rounded-xl focus:bg-primary/5 cursor-pointer outline-none transition-colors">
                        <UserCircle size={16} className="text-primary/60" />
                        <Link href="/profile" className="flex-1">
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-3 p-3 text-xs uppercase tracking-widest font-medium rounded-xl focus:bg-primary/5 cursor-pointer outline-none transition-colors">
                        <Package size={16} className="text-primary/60" />
                        <Link href="/profile/orders" className="flex-1">
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                    
                    {/* Theme Toggle Section */}
                    {mounted && (
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/5 text-primary">
                            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">
                            Dark Mode
                          </span>
                        </div>
                        <Switch
                          checked={theme === "dark"}
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        />
                      </div>
                    )}

                    <DropdownMenuSeparator className="bg-primary/5 mx-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 text-xs uppercase tracking-widest font-bold text-destructive rounded-xl focus:bg-destructive/5 cursor-pointer outline-none transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={openAuth}
                  className={`p-2 rounded-full transition-all ${isScrolled
                    ? "text-foreground/80 hover:bg-primary/5"
                    : "text-foreground hover:bg-secondary/30"
                    } outline-none cursor-pointer`}
                >
                  <User size={22} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-foreground/10 backdrop-blur-sm z-[-1]"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute top-full left-0 w-full bg-background/60 backdrop-blur-3xl border-t border-primary/5 overflow-hidden shadow-2xl rounded-b-3xl"
            >
              <nav className="flex flex-col gap-1 py-8 px-6 text-center uppercase tracking-[0.3em] text-xs font-semibold">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-4 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Theme Toggle */}
                {mounted && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    className="mt-4 pt-6 border-t border-primary/5 flex items-center justify-between px-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/5 text-primary">
                        {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/70">
                        Dark Mode
                      </span>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </motion.div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
