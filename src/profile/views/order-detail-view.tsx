"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, Package, Truck, Calendar, CreditCard, MapPin, ExternalLink, HelpCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { StatusStepper } from "../components/status-stepper";

export const OrderDetailView = ({ orderId }: { orderId: string }) => {
    const trpc = useTRPC();
    const { data: order } = useSuspenseQuery(trpc.profile.getOrderDetails.queryOptions({ id: orderId }));

    if (!order) return null;

    const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
                {/* ── Breadcrumbs & Back Button ── */}
                <div className="mb-12 flex items-center justify-between">
                    <Link 
                        href="/profile/orders" 
                        className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary">
                        <Package size={14} />
                        Order Details
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* ── Left Column: Order Status & Items ── */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Header Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-primary/10 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-serif font-light text-foreground mb-4 italic tracking-tight uppercase">
                                        Ritual #{orderId.slice(0, 8).toUpperCase()}
                                    </h1>
                                    <div className="flex items-center gap-3 text-muted-foreground/60">
                                        <Calendar size={14} />
                                        <span className="text-[10px] uppercase tracking-widest font-medium">{date}</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 text-center min-w-[140px]">
                                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Status</p>
                                    <p className="text-sm font-semibold text-foreground tracking-widest italic">{order.status}</p>
                                </div>
                            </div>

                            <StatusStepper currentStatus={order.status ?? "pending"} />

                            {/* Tracking Button (If Shipped) */}
                            {order.shipment?.trackingId && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-12 p-6 bg-secondary/30 rounded-3xl border border-primary/5 flex items-center justify-between gap-6 flex-wrap"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                            <Truck size={20} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">In Transit</p>
                                            <p className="text-sm font-semibold text-foreground tracking-tight ">{order.shipment.courier} - {order.shipment.trackingId}</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20 cursor-pointer">
                                        Track Order
                                        <ExternalLink size={14} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Order Items */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-primary/10 rounded-[2rem] p-8 md:p-12 overflow-hidden"
                        >
                            <h3 className="text-lg font-serif font-light text-foreground italic mb-10 flex items-center gap-3">
                                <ShoppingBag size={20} strokeWidth={1} />
                                Included Essentials
                            </h3>
                            <div className="space-y-8">
                                {order.items.map((item, idx) => (
                                    <div key={item.id} className="flex gap-6 items-center p-4 hover:bg-primary/5 transition-colors duration-500 rounded-3xl group ">
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-secondary border border-primary/5 group-hover:scale-105 transition-transform duration-500">
                                            {item.product?.image && (
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex justify-between items-center gap-6">
                                            <div>
                                                <h4 className="text-sm md:text-base font-serif font-light text-foreground">{item.product?.name}</h4>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-1">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="text-base font-serif text-foreground italic tracking-tight">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Right Column: Summary & Address ── */}
                    <div className="space-y-8">
                        {/* Summary Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-card border border-primary/10 rounded-[2rem] p-8 space-y-6"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-3 mb-6">
                                <CreditCard size={16} />
                                Summary
                            </h3>
                            <div className="space-y-4 text-xs font-light text-muted-foreground font-sans tracking-wide">
                                <div className="flex justify-between border-b border-primary/5 pb-4">
                                    <span>Subtotal</span>
                                    <span className="text-foreground tracking-tight">₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between border-b border-primary/5 pb-4">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-bold tracking-widest uppercase">Free</span>
                                </div>
                                <div className="flex justify-between pt-4 text-lg items-center">
                                    <span className="font-serif italic font-light text-foreground">Total</span>
                                    <span className="font-serif italic text-2xl text-foreground bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10 tracking-tight">₹{order.totalAmount}</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-muted-foreground/60 pt-6 border-t border-primary/5 mt-6 font-light leading-relaxed">
                                Paid via SSL-Secured Payment Gateway. GST Invoice included in the package.
                            </p>
                        </motion.div>

                        {/* Address Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-card border border-primary/10 rounded-[2rem] p-8 space-y-6 group"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                                <MapPin size={16} />
                                Destination
                            </h3>
                            <div className="space-y-4 bg-primary/5 p-6 rounded-3xl border border-primary/10 group-hover:bg-primary/20 transition-colors duration-700">
                                <p className="text-sm font-bold text-foreground tracking-tight">{order.address?.fullName}</p>
                                <div className="space-y-1 text-xs text-muted-foreground font-light leading-relaxed tracking-wide">
                                    <p>{order.address?.addressLine}</p>
                                    <p>{order.address?.city}, {order.address?.state}</p>
                                    <p>{order.address?.pincode}</p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-primary/10">
                                    <p className="text-[10px] text-muted-foreground italic tracking-widest font-medium uppercase">{order.address?.phone}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Support Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center space-y-4 relative overflow-hidden group cursor-pointer hover:bg-primary/20 transition-all duration-700"
                        >
                            <HelpCircle size={24} className="text-primary mx-auto opacity-30 group-hover:opacity-100 transition-opacity" />
                            <p className="text-xs font-bold text-foreground tracking-widest uppercase">Need Assistance?</p>
                            <p className="text-[10px] text-muted-foreground font-light uppercase tracking-[0.2em]">Contact our Lifestyle Concierge for any queries regarding your ritual.</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
};
