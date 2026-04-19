"use client";

import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Minus,
    Plus,
    Trash2,
    ArrowRight,
    ShoppingBag,
    MapPin,
    CreditCard,
    Banknote,
    Plus as PlusIcon,
    X,
    Check,
    ChevronDown,
    Truck,
    Shield,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ─── Types ─────────────────────────────────────────────── */
type Address = {
    id: string;
    fullName: string;
    phone: string;
    city: string;
    state: string;
    pincode: string;
    addressLine: string;
};

type PaymentMethod = "prepaid" | "cod";

const emptyForm = {
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
};

/* ─── Cart View ─────────────────────────────────────────── */
const CartView = () => {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const total = getTotal();

    /* Address & payment state */
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("prepaid");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressExpanded, setAddressExpanded] = useState(true);
    const [form, setForm] = useState(emptyForm);

    const trpc = useTRPC();
    const qc = useQueryClient();

    /* Fetch user + addresses */
    const { data: profileData, isLoading: profileLoading } = useQuery({
        ...trpc.profile.getMe.queryOptions(),
    });

    const addresses: Address[] = (profileData?.addresses ?? []) as Address[];

    /* Auto-select first address */
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    /* Razorpay script */
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    /* Save new address */
    const upsert = useMutation(
        trpc.profile.upsertAddress.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({ queryKey: [["profile", "getMe"]] });
                setShowAddressForm(false);
                setForm(emptyForm);
                toast.success("Address saved successfully");
            },
            onError: () => toast.error("Failed to save address"),
        })
    );

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        upsert.mutate(form);
    };

    /* Checkout mutations */
    const createRazorOrder = useMutation(
        trpc.cart.createRazorpayOrder.mutationOptions({
            onError: () => toast.error("Failed to initialize payment"),
        })
    );

    const placeOrderMutation = useMutation(
        trpc.cart.placeOrder.mutationOptions({
            onSuccess: (data) => {
                toast.success("Order placed successfully!");
                clearCart();
                setOrderSuccess(data.orderId);
            },
            onError: (err) => toast.error(err.message || "Failed to place order"),
        })
    );

    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

    /* Checkout handler */
    const handleCheckout = async () => {
        if (items.length === 0) return;
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            setAddressExpanded(true); // Auto-expand if not selected
            return;
        }

        const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
        if (!selectedAddress) return;

        if (paymentMethod === "cod") {
            placeOrderMutation.mutate({
                addressId: selectedAddressId,
                paymentMethod: "cod",
                items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price, name: i.name })),
                totalAmount: total,
            });
            return;
        }

        // Prepaid Flow
        const rzpOrder = await createRazorOrder.mutateAsync({ amount: total });

        const options = {
            key: rzpOrder.key,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            name: "ALOMA",
            description: "Premium Skincare Purchase",
            image: "/download.jfif",
            order_id: rzpOrder.id,
            prefill: {
                name: selectedAddress.fullName,
                contact: selectedAddress.phone,
            },
            handler: function (response: any) {
                placeOrderMutation.mutate({
                    addressId: selectedAddressId,
                    paymentMethod: "prepaid",
                    items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price, name: i.name })),
                    totalAmount: total,
                    razorpayOrderId: rzpOrder.id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                });
            },
            theme: { color: "#000000" },
            modal: {
                ondismiss: function () {
                    toast.error("Payment cancelled");
                }
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    /* ── Order Success State ── */
    if (orderSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 pt-32 px-6 overflow-hidden">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="relative"
                >
                    <div className="p-10 rounded-full bg-primary/10 text-primary">
                        <Check size={80} strokeWidth={1} />
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full border-4 border-primary/20 scale-110"
                    />
                </motion.div>

                <div className="text-center space-y-4 max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif font-light"
                    >
                        Order Confirmed
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground font-light tracking-wide px-4"
                    >
                        Your order <span className="text-foreground font-medium">#{orderSuccess.slice(0, 8).toUpperCase()}</span> has been placed. We're preparing your ritual items for delivery.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row shadow-2xl gap-4"
                >
                    <Link
                        href="/profile"
                        className="group flex items-center justify-center gap-3 bg-black text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all"
                    >
                        Track Order
                        <Truck size={16} />
                    </Link>
                    <Link
                        href="/"
                        className="group flex items-center justify-center gap-3 bg-white border border-primary/20 text-black px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary/20 transition-all"
                    >
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    /* ── Empty State ── */
    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 pt-32 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-full bg-primary/5 text-primary/20"
                >
                    <ShoppingBag size={80} strokeWidth={0.5} />
                </motion.div>
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-serif font-light">Your collection is empty</h1>
                    <p className="text-muted-foreground font-light tracking-wide">
                        Explore our products and find your next skincare ritual.
                    </p>
                </div>
                <Link
                    href="/collection"
                    className="group flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl"
                >
                    Explore Collection
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        );
    }

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

    return (
        <section className="pt-32 pb-24 px-6 md:px-12 bg-background min-h-screen">
            <div className="container mx-auto max-w-6xl">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between mb-12 border-b border-primary/10 pb-8 gap-6">
                    <div className="space-y-2">
                        <span className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold">Checkout</span>
                        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight">Your Cart</h1>
                    </div>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest self-end">
                        {items.length} {items.length === 1 ? "Item" : "Items"} in your bag
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">

                    {/* ══════════════════════════════════
                        LEFT — Cart Items + Address + Payment
                    ══════════════════════════════════ */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* ── Cart Items ── */}
                        <div className="space-y-4">
                            <SectionLabel icon={<ShoppingBag size={14} />} text="Your Items" />
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-secondary/5 border border-primary/5 hover:border-primary/20 transition-all group"
                                    >
                                        <div className="relative w-32 h-40 overflow-hidden rounded-2xl bg-secondary/10 shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                                <h3 className="text-xl font-serif font-light">{item.name}</h3>
                                                <p className="text-lg font-medium tracking-wider">{item.price}</p>
                                            </div>
                                            <div className="flex items-center justify-center sm:justify-between w-full">
                                                <div className="flex items-center bg-background border border-primary/10 rounded-full px-2 py-1 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:text-primary transition-colors outline-none"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-12 text-center text-sm font-bold tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:text-primary transition-colors outline-none"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-all"
                                                >
                                                    <Trash2 size={20} strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* ── Delivery Address ── */}
                        <div className="rounded-3xl border border-primary/10 overflow-hidden">
                            {/* Header */}
                            <button
                                onClick={() => setAddressExpanded((p) => !p)}
                                className="w-full flex items-center justify-between p-6 bg-secondary/5 hover:bg-secondary/10 transition-colors"
                            >
                                <SectionLabel icon={<MapPin size={14} />} text="Delivery Address" inline />
                                <div className="flex items-center gap-3">
                                    {selectedAddress && !addressExpanded && (
                                        <span className="text-[11px] text-muted-foreground hidden sm:block max-w-[200px] truncate">
                                            {selectedAddress.addressLine}, {selectedAddress.city}
                                        </span>
                                    )}
                                    <ChevronDown
                                        size={16}
                                        className={`text-muted-foreground transition-transform duration-300 ${addressExpanded ? "rotate-180" : ""}`}
                                    />
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {addressExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-4 space-y-4">
                                            {/* Loading */}
                                            {profileLoading && (
                                                <div className="py-6 text-center">
                                                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                                                    <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">Loading addresses…</p>
                                                </div>
                                            )}

                                            {/* Not logged in */}
                                            {!profileLoading && !profileData?.user && (
                                                <div className="py-6 text-center border border-dashed border-border/40 rounded-2xl">
                                                    <MapPin size={22} className="text-muted-foreground/30 mx-auto mb-2" />
                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                                                        Sign in to use saved addresses
                                                    </p>
                                                </div>
                                            )}

                                            {/* Existing addresses */}
                                            {!profileLoading && profileData?.user && (
                                                <>
                                                    <div className="space-y-3">
                                                        {addresses.length === 0 && !showAddressForm && (
                                                            <div className="py-6 text-center border border-dashed border-border/40 rounded-2xl">
                                                                <MapPin size={22} className="text-muted-foreground/30 mx-auto mb-2" />
                                                                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                                                                    No saved addresses
                                                                </p>
                                                            </div>
                                                        )}

                                                        <AnimatePresence>
                                                            {addresses.map((addr) => (
                                                                <motion.button
                                                                    key={addr.id}
                                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                                    initial={{ opacity: 0, y: 8 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 relative ${selectedAddressId === addr.id
                                                                            ? "border-primary bg-primary/5"
                                                                            : "border-border/40 bg-secondary/5 hover:border-primary/30"
                                                                        }`}
                                                                >
                                                                    {/* Selected Check */}
                                                                    <AnimatePresence>
                                                                        {selectedAddressId === addr.id && (
                                                                            <motion.div
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 1 }}
                                                                                exit={{ scale: 0 }}
                                                                                className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                                                            >
                                                                                <Check size={11} className="text-white" strokeWidth={3} />
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>

                                                                    <p className="text-sm font-semibold text-foreground pr-8">{addr.fullName}</p>
                                                                    <p className="text-xs text-muted-foreground mt-1">{addr.addressLine}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {addr.city}, {addr.state} — {addr.pincode}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground/70 mt-1">📞 {addr.phone}</p>
                                                                </motion.button>
                                                            ))}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Add New Address Toggle */}
                                                    {!showAddressForm && (
                                                        <button
                                                            onClick={() => setShowAddressForm(true)}
                                                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary/5 transition-all"
                                                        >
                                                            <PlusIcon size={14} />
                                                            Add New Address
                                                        </button>
                                                    )}

                                                    {/* Inline Add Address Form */}
                                                    <AnimatePresence>
                                                        {showAddressForm && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="border border-primary/20 rounded-2xl p-6 bg-secondary/5 space-y-1">
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <h4 className="text-sm font-serif font-light">New Delivery Address</h4>
                                                                        <button
                                                                            onClick={() => { setShowAddressForm(false); setForm(emptyForm); }}
                                                                            className="text-muted-foreground hover:text-foreground transition"
                                                                        >
                                                                            <X size={16} />
                                                                        </button>
                                                                    </div>
                                                                    <div className="h-[1px] w-8 bg-primary/30 mb-5" />

                                                                    <form onSubmit={handleSaveAddress} className="space-y-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <FormField label="Full Name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
                                                                            <FormField label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} type="tel" />
                                                                        </div>
                                                                        <FormField label="Address Line" value={form.addressLine} onChange={(v) => setForm((f) => ({ ...f, addressLine: v }))} />
                                                                        <div className="grid grid-cols-3 gap-4">
                                                                            <FormField label="City" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
                                                                            <FormField label="State" value={form.state} onChange={(v) => setForm((f) => ({ ...f, state: v }))} />
                                                                            <FormField label="Pincode" value={form.pincode} onChange={(v) => setForm((f) => ({ ...f, pincode: v }))} />
                                                                        </div>
                                                                        <button
                                                                            type="submit"
                                                                            disabled={upsert.isPending}
                                                                            className="w-full bg-foreground text-background py-3.5 rounded-xl text-[11px] uppercase tracking-[0.25em] font-bold hover:opacity-80 transition disabled:opacity-50 mt-2"
                                                                        >
                                                                            {upsert.isPending ? "Saving…" : "Save Address"}
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Payment Method ── */}
                        <div className="rounded-3xl border border-primary/10 overflow-hidden">
                            <div className="p-6 bg-secondary/5">
                                <SectionLabel icon={<CreditCard size={14} />} text="Payment Method" />
                            </div>
                            <div className="p-6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Prepaid */}
                                <PaymentOption
                                    id="prepaid"
                                    selected={paymentMethod === "prepaid"}
                                    onClick={() => setPaymentMethod("prepaid")}
                                    icon={<CreditCard size={22} strokeWidth={1.5} />}
                                    title="Pay Online"
                                    subtitle="UPI, Cards, Net Banking"
                                    badge="Recommended"
                                />
                                {/* Cash on Delivery */}
                                <PaymentOption
                                    id="cod"
                                    selected={paymentMethod === "cod"}
                                    onClick={() => setPaymentMethod("cod")}
                                    icon={<Banknote size={22} strokeWidth={1.5} />}
                                    title="Cash on Delivery"
                                    subtitle="Pay when you receive"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════
                        RIGHT  — Order Summary
                    ══════════════════════════════════ */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6 bg-secondary/5 rounded-3xl p-8 border border-primary/10">
                            <h2 className="text-2xl font-serif font-light border-b border-primary/5 pb-4">
                                Order Summary
                            </h2>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-sm tracking-wide">
                                <div className="flex justify-between text-muted-foreground uppercase text-[10px] font-bold">
                                    <span>Subtotal</span>
                                    <span className="text-foreground tracking-widest">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground uppercase text-[10px] font-bold">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold uppercase tracking-[0.2em] text-[8px]">
                                        Complimentary
                                    </span>
                                </div>
                                {paymentMethod === "cod" && (
                                    <div className="flex justify-between text-muted-foreground uppercase text-[10px] font-bold">
                                        <span>COD Charges</span>
                                        <span className="text-foreground tracking-widest">Free</span>
                                    </div>
                                )}
                                <div className="h-[1px] bg-primary/10 my-2" />
                                <div className="flex justify-between items-end pt-1">
                                    <span className="text-lg font-serif">Total</span>
                                    <span className="text-3xl font-light tracking-tighter">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Delivery Address Preview */}
                            {selectedAddress && (
                                <motion.div
                                    key={selectedAddress.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-background rounded-2xl p-4 border border-primary/10 space-y-1"
                                >
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-bold mb-2">
                                        <Truck size={12} />
                                        Delivering to
                                    </div>
                                    <p className="text-sm font-medium">{selectedAddress.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{selectedAddress.addressLine}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                                    </p>
                                </motion.div>
                            )}

                            {/* Payment Badge */}
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                                    {paymentMethod === "prepaid" ? "💳 Paying Online" : "💵 Cash on Delivery"}
                                </span>
                            </div>

                            {/* CTA */}
                            <div className="space-y-4 pt-2">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-black text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={items.length === 0}
                                >
                                    {paymentMethod === "prepaid" ? "Proceed to Payment" : "Place Order"}
                                    <ArrowRight size={16} />
                                </button>

                                {/* Trust badges */}
                                <div className="flex items-center justify-center gap-4 pt-1">
                                    <TrustBadge icon={<Shield size={11} />} text="Secure" />
                                    <div className="w-[1px] h-3 bg-border" />
                                    <TrustBadge icon={<Truck size={11} />} text="Free Shipping" />
                                    <div className="w-[1px] h-3 bg-border" />
                                    <TrustBadge icon={<Sparkles size={11} />} text="Premium" />
                                </div>

                                <p className="text-[10px] text-center text-muted-foreground px-4 leading-relaxed font-medium uppercase tracking-[0.1em]">
                                    {paymentMethod === "prepaid"
                                        ? "Secure payments powered by Razorpay."
                                        : "Pay cash when your order arrives at your doorstep."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ─── Small reusable components ─────────────────────────── */

const SectionLabel = ({
    icon,
    text,
    inline,
}: {
    icon: React.ReactNode;
    text: string;
    inline?: boolean;
}) => (
    <div className={`flex items-center gap-2.5 ${inline ? "" : "mb-0"}`}>
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">{text}</span>
    </div>
);

const PaymentOption = ({
    id,
    selected,
    onClick,
    icon,
    title,
    subtitle,
    badge,
}: {
    id: string;
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: string;
}) => (
    <button
        onClick={onClick}
        className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col gap-3 ${selected
                ? "border-primary bg-primary/5"
                : "border-border/40 bg-secondary/5 hover:border-primary/30"
            }`}
    >
        {badge && (
            <span className="absolute top-3 right-3 text-[8px] font-bold uppercase tracking-[0.2em] bg-primary/10 text-primary px-2 py-1 rounded-full">
                {badge}
            </span>
        )}
        <AnimatePresence>
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                    <Check size={11} className="text-white" strokeWidth={3} />
                </motion.div>
            )}
        </AnimatePresence>
        <span className={`transition-colors ${selected ? "text-primary" : "text-muted-foreground"}`}>
            {icon}
        </span>
        <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
    </button>
);

const FormField = ({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) => (
    <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            required
            className="w-full bg-transparent border-b border-border/60 focus:border-primary/60 outline-none py-2 text-sm text-foreground placeholder:text-muted-foreground/40 transition-colors"
        />
    </div>
);

const TrustBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-[9px] uppercase tracking-widest font-medium">{text}</span>
    </div>
);

export default CartView;
