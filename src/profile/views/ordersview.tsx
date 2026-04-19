"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, ShoppingBag, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    delivered: "bg-primary/10 text-primary border-primary/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export const OrdersView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.profile.getMe.queryOptions());
    const { orders } = data;

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/profile" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            Profile
                        </Link>
                        <ChevronRight size={10} className="text-muted-foreground/40" />
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">My Orders</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground tracking-tight">Order History</h1>
                    <p className="text-sm text-muted-foreground font-light mt-4 max-w-lg">
                        Manage and track your premium skincare rituals. Every order is meticulously prepared for your journey.
                    </p>
                </header>

                {orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-24 text-center border border-dashed border-primary/10 rounded-[2rem] bg-secondary/20"
                    >
                        <ShoppingBag size={48} className="text-primary/20 mx-auto mb-6" />
                        <h2 className="text-xl font-serif text-foreground mb-2">No orders found</h2>
                        <p className="text-sm text-muted-foreground font-light mb-8">You haven't started your skincare ritual yet.</p>
                        <Link href="/collection">
                            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform">
                                Explore Collection
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order, i) => {
                            const status = (order.status ?? "pending").toLowerCase();
                            const colorClass = statusColors[status] ?? statusColors.pending;
                            const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            });

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link href={`/profile/orders/${order.id}`}>
                                        <div className="group relative overflow-hidden bg-background border border-primary/10 rounded-2xl p-6 md:p-8 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 cursor-pointer">
                                            {/* Status Badge */}
                                            <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                                        <Package size={20} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5">{date}</p>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${colorClass}`}>
                                                    <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{status}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                                                <div className="flex items-center gap-8">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-1">Total Amount</p>
                                                        <p className="text-xl font-serif text-foreground italic">₹{order.totalAmount}</p>
                                                    </div>
                                                    <div className="hidden md:block">
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-1">Payment</p>
                                                        <p className="text-xs font-semibold text-foreground tracking-tight">Verified Secure</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-primary group-hover:translate-x-2 transition-transform duration-500">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">View Details</span>
                                                    <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};
