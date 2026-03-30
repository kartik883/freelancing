"use client";

import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";

type Order = {
    id: string;
    totalAmount: string;
    status: string | null;
    createdAt: Date | string;
};

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    delivered: "bg-primary/10 text-primary border-primary/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export const OrderSection = ({ orders }: { orders: Order[] }) => {
    return (
        <section>
            <div className="mb-6">
                <h3 className="text-lg font-serif font-light text-foreground">Order History</h3>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="py-14 text-center border border-dashed border-border/40">
                    <ShoppingBag size={24} className="text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">No orders yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Your orders will appear here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order, i) => {
                        const status = (order.status ?? "pending").toLowerCase();
                        const colorClass = statusColors[status] ?? statusColors.pending;
                        const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between border border-border/40 px-5 py-4 hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-secondary/40 flex items-center justify-center">
                                        <Package size={16} className="text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">{date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <p className="text-sm font-light text-foreground">₹{order.totalAmount}</p>
                                    <span className={`text-[9px] uppercase tracking-[0.2em] font-semibold px-3 py-1 border rounded-full ${colorClass}`}>
                                        {status}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};
