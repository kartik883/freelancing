"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AvatarUpload } from "../components/avatarupload";
import { ProfileInfo } from "../components/profileinfo";
import { AddressSection } from "../components/addresssection";
import { OrderSection } from "../components/ordersection";
import { ShieldCheck } from "lucide-react";

export const ProfileView = () => {
    const trpc = useTRPC();
    const qc = useQueryClient();
    const { data, refetch } = useSuspenseQuery(trpc.profile.getMe.queryOptions());

    const { user, addresses, orders } = data;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground text-sm uppercase tracking-widest">Please sign in to view your profile.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-28 pb-24 px-6 md:px-12">
            <div className="max-w-3xl mx-auto space-y-16">

                {/* ── Hero: Avatar + Name ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex flex-col items-center gap-5 text-center"
                >
                    <AvatarUpload
                        image={user.image ?? null}
                        name={user.name}
                        onUpdate={() => refetch()}
                    />
                    <ProfileInfo name={user.name} email={user.email} />

                    {/* Verification badge */}
                    {user.emailVerified && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-primary/70 font-semibold">
                            <ShieldCheck size={13} />
                            Verified Account
                        </div>
                    )}
                </motion.div>

                {/* ── Divider ── */}
                <Divider />

                {/* ── Addresses ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                >
                    <AddressSection addresses={addresses} />
                </motion.div>

                {/* ── Divider ── */}
                <Divider />

                {/* ── Orders ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                >
                    <OrderSection orders={orders} />
                </motion.div>
            </div>
        </main>
    );
};

const Divider = () => (
    <div className="flex items-center gap-6">
        <div className="flex-1 h-[1px] bg-border/40" />
        <div className="w-1 h-1 rounded-full bg-primary/30" />
        <div className="flex-1 h-[1px] bg-border/40" />
    </div>
);
