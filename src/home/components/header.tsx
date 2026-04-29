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
import { Sun, Moon, ArrowRight, Loader2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { type ProductWithImages } from "./product-card";
import { useQuery } from "@tanstack/react-query";
import { BRAND_NAME, BRAND_LOGO } from "@/brandhelp";

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

  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const trpc = useTRPC();

  const { data: searchResults, isLoading: isSearching } = useQuery(
  trpc.home.searchProducts.queryOptions(searchQuery || undefined, {
    enabled: isSearchOpen,
  })
);

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

// Prevent body scroll when search is open
useEffect(() => {
  if (isSearchOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return () => {
    document.body.style.overflow = "auto";
  };
}, [isSearchOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
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
  animate={{ y: isVisible ? 0 : -140 }}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  className={`fixed top-1 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[92%] lg:w-[calc(100%-3rem)] max-w-[1900px] rounded-[2rem] md:rounded-[2.75rem] border transition-all duration-700 ${
    isScrolled
      ? "py-2 md:py-2.5 bg-[rgba(48,30,20,0.74)] border-white/10 backdrop-blur-3xl shadow-[0_20px_60px_rgba(18,10,0,0.38)]"
      : "py-2.5 md:py-3 bg-[linear-gradient(180deg,rgba(82,58,42,0.88),rgba(56,38,28,0.82))] border-[rgba(255,245,235,0.12)] backdrop-blur-[30px] shadow-[0_24px_80px_rgba(48,28,18,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]"
  }`}
>
  {/* Decorative Premium Layers - Wrapped to allow menu overflow */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent" />
    <div className="absolute inset-0 border border-white/[0.06] rounded-[inherit]" />
    <div className="absolute left-8 top-0 h-24 w-48 rounded-full bg-[rgba(255,240,225,0.12)] blur-3xl" />
    <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-[rgba(176,132,96,0.14)] blur-3xl" />
  </div>

  <div className="container mx-auto px-4 md:px-6 xl:px-7">
    <div className="flex items-center justify-between relative">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          className={`lg:hidden p-1.5 sm:p-2 md:p-2.5 rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:bg-white/10 ${
            isScrolled ? "text-white/80" : "text-white/90"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 md:gap-4 group outline-none"
        >
                  <div
            className={`group relative w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 
            overflow-hidden rounded-[1.35rem] border transition-all duration-500 ${
              isScrolled
                ? "border-white/10 bg-white/[0.05] shadow-[0_10px_28px_rgba(0,0,0,0.2)]"
                : "border-white/10 bg-[rgba(255,245,235,0.05)] shadow-[0_14px_34px_rgba(32,18,10,0.28)]"
            }`}
          >
            <img
              src={BRAND_LOGO}
              alt={`${BRAND_NAME} Logo`}
              className="w-full h-full object-cover bg-white transition-transform ease-out group-hover:scale-110"
            />
                    </div>

            <span
              className={`text-sm sm:text-base md:text-lg lg:text-2xl font-serif tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] transition-all duration-500 ${
                isScrolled
                  ? "text-white/90"
                  : "text-[rgba(255,245,235,0.95)] drop-shadow-[0_2px_16px_rgba(255,240,225,0.18)]"
              } group-hover:scale-105`}
            >
              {BRAND_NAME}
            </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`group relative text-[10px] md:text-[11px] uppercase tracking-[0.15em] lg:tracking-[0.2em] font-medium transition-all duration-300 ${
              isScrolled
                ? "text-white/70 hover:text-white"
                : "text-[rgba(255,245,235,0.86)] hover:text-white"
            } outline-none`}
          >
            {link.name}

            <span className="absolute -bottom-2 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/90 to-transparent transition-all duration-500 group-hover:w-full" />
          </Link>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
        <div className="relative">
          <button 
            onClick={() => {
              setIsSearchOpen(true);
              if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            }}
            className={`p-1.5 sm:p-2 md:p-2.5 rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:text-white outline-none`}
          >
            <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.7} />
          </button>
        </div>

        <Link
          href="/cart"
          className="relative p-1.5 sm:p-2 md:p-2.5 rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:text-white outline-none"
        >
          <ShoppingBag className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.7} />

          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-[10px] font-bold text-black px-1 shadow-lg">
              {cartItems.length}
            </span>
          )}
        </Link>

        {isPending ? (
          <div className="w-10 h-10 rounded-[1.25rem] bg-white/10 animate-pulse" />
        ) : session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.05] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-105 outline-none cursor-pointer">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.08] text-sm font-semibold text-white">
                    {session.user.name.charAt(0)}
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 p-2 rounded-[2rem] border border-white/10 bg-[#1D1108] shadow-[0_32px_80px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-300 transform-gpu"
            >
              <DropdownMenuLabel className="flex items-center gap-4 p-5">
                <div className="w-14 h-14 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-inner">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-serif text-white">
                      {session.user.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-white tracking-tight">
                    {session.user.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
                    Premium Member
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-white/5 mx-2" />

              <div className="p-2 space-y-1">
                <DropdownMenuItem className="rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-200">
                  <UserCircle size={18} className="mr-3 opacity-70" />
                  <Link href="/profile" className="text-[11px] uppercase tracking-widest font-medium w-full">
                    Edit Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-xl px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-200">
                  <Package size={18} className="mr-3 opacity-70" />
                  <Link href="/profile/orders" className="text-[11px] uppercase tracking-widest font-medium w-full">
                    My Orders
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-white/5 mx-2" />

              {mounted && (
                <>
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white/5 p-2 text-white/60">
                        {theme === "dark" ? (
                          <Moon size={14} />
                        ) : (
                          <Sun size={14} />
                        )}
                      </div>

                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
                        Dark Mode
                      </span>
                    </div>

                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                    />
                  </div>

                  <DropdownMenuSeparator className="bg-white/5 mx-2" />
                </>
              )}

              <div className="p-2">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer transition-all duration-200"
                >
                  <LogOut size={18} className="mr-3 opacity-70" />
                  <span className="text-[11px] uppercase tracking-widest font-bold">Sign Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={openAuth}
            className={`p-1.5 sm:p-2 md:p-2.5 rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:bg-white/10 hover:scale-105 outline-none cursor-pointer ${
              isScrolled ? "text-white/80" : "text-white/90"
            }`}
          >
            <User className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.7} />
          </button>
        )}
      </div>
    </div>
  </div>

  <AnimatePresence>
    {isMobileMenuOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-[-100vh] z-[-1] h-[300vh] w-[300vw] bg-black/40 backdrop-blur-md lg:hidden"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-[calc(100%+0.5rem)] w-[100%] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(84,58,40,0.94),rgba(42,24,16,0.96))] backdrop-blur-3xl shadow-[0_28px_70px_rgba(10,5,0,0.45)] lg:hidden"        >
          <nav className="flex flex-col gap-1 p-5">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-2xl border border-transparent px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-white/75 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {mounted && (
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/[0.06] p-2 text-white/80">
                    {theme === "dark" ? (
                      <Moon size={16} />
                    ) : (
                      <Sun size={16} />
                    )}
                  </div>

                  <span className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                    Dark Mode
                  </span>
                </div>

                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>
            )}
          </nav>
        </motion.div>
      </>
    )}
  </AnimatePresence>

  {/* Search Modal Overlay */}
 {/* Search Modal Overlay */}
<AnimatePresence>
  {isSearchOpen && (
    <div className="fixed inset-0 z-[100] flex items-start justify-end">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSearchOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Search Dialog (RIGHT SIDE PANEL) */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="
          relative 
          w-full 
          sm:w-[90%] 
          md:w-[70%] 
          lg:w-[520px] 
          xl:w-[560px]

          h-[80vh] 
          md:h-[70vh] 
          lg:h-[60vh]

          mt-20 md:mt-24 mr-2 md:mr-6

          bg-[rgba(32,20,14,0.96)] 
          border border-white/10 
          rounded-[2rem] 
          shadow-[0_40px_120px_rgba(0,0,0,0.7)] 
          backdrop-blur-3xl
          overflow-hidden
        "
      >
        <div className="flex flex-col h-full p-5 md:p-6 gap-5">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-white/50" />
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                Search {BRAND_NAME}
              </span>
            </div>

            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Input */}
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsSearchOpen(false);
              }}
              className="
                w-full 
                bg-transparent 
                border-b border-white/10 
                py-4 
                text-lg md:text-xl 
                text-white 
                placeholder:text-white/25 
                focus:outline-none 
                focus:border-white/30
                font-serif italic
              "
            />

            {isSearching && (
              <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 animate-spin" />
            )}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-4">

              {searchQuery && (
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Results for "{searchQuery}"
                </p>
              )}

              {/* Empty */}
              {searchResults?.length === 0 && !isSearching && searchQuery && (
                <div className="py-10 text-center">
                  <p className="text-white/40 italic text-sm">
                    No results found...
                  </p>
                </div>
              )}

              {/* Default */}
              {!searchQuery && !isSearching && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[9px] text-white/30 uppercase">Popular</p>
                    <p className="text-sm text-white font-serif">
                      Serums
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[9px] text-white/30 uppercase">Trending</p>
                    <p className="text-sm text-white font-serif">
                      Rituals
                    </p>
                  </div>
                </div>
              )}

              {/* Results */}
              {searchResults?.map((product: ProductWithImages) => (
                <Link
                  key={product.id}
                  href={`/collection/product/${product.id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.05] transition group"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5">
                    {product.productImage && (
                      <img
                        src={product.productImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <span className="text-sm text-white font-serif">
                      {product.name}
                    </span>

                    <span className="text-[10px] text-white/40">
                      ₹{product.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <Link
            href={`/collection${searchQuery ? `?search=${searchQuery}` : ""}`}
            onClick={() => setIsSearchOpen(false)}
            className="
              flex items-center justify-center 
              py-4 
              rounded-xl 
              bg-white 
              text-black 
              text-[10px] uppercase tracking-[0.3em] 
              hover:bg-primary hover:text-white 
              transition
            "
          >
            View All
          </Link>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
</motion.header>
  );
};

export default Header;
