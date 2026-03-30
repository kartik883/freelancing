"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Address = {
    id: string;
    fullName: string;
    phone: string;
    city: string;
    state: string;
    pincode: string;
    addressLine: string;
};

const emptyForm = {
    fullName: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    addressLine: "",
};

export const AddressSection = ({ addresses }: { addresses: Address[] }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Address | null>(null);
    const [form, setForm] = useState(emptyForm);
    const trpc = useTRPC();
    const qc = useQueryClient();

    const upsert = useMutation(
        trpc.profile.upsertAddress.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({ queryKey: [["profile", "getMe"]] });
                setDialogOpen(false);
                setEditing(null);
                setForm(emptyForm);
                toast.success("Address saved");
            },
            onError: () => toast.error("Failed to save address"),
        })
    );

    const del = useMutation(
        trpc.profile.deleteAddress.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({ queryKey: [["profile", "getMe"]] });
                toast.success("Address removed");
            },
        })
    );

    const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
    const openEdit = (addr: Address) => {
        setEditing(addr);
        setForm({ fullName: addr.fullName, phone: addr.phone, city: addr.city, state: addr.state, pincode: addr.pincode, addressLine: addr.addressLine });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        upsert.mutate({ ...(editing ? { id: editing.id } : {}), ...form });
    };

    const field = (label: string, key: keyof typeof emptyForm, placeholder?: string) => (
        <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{label}</label>
            <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder ?? label}
                required
                className="w-full bg-transparent border-b border-border/60 focus:border-primary/60 outline-none py-2 text-sm text-foreground placeholder:text-muted-foreground/40 transition-colors"
            />
        </div>
    );

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-serif font-light text-foreground">Saved Addresses</h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                        {addresses.length} address{addresses.length !== 1 ? "es" : ""}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold border border-foreground/20 px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-300"
                >
                    <Plus size={12} />
                    Add New
                </button>
            </div>

            {/* Address cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 && (
                    <div className="col-span-full py-10 text-center border border-dashed border-border/40 rounded-sm">
                        <MapPin size={22} className="text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">No addresses saved yet</p>
                    </div>
                )}
                {addresses.map((addr) => (
                    <motion.div
                        key={addr.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-border/40 p-5 space-y-1.5 relative group hover:border-primary/30 transition-colors"
                    >
                        <p className="font-medium text-sm text-foreground">{addr.fullName}</p>
                        <p className="text-xs text-muted-foreground">{addr.addressLine}</p>
                        <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p className="text-xs text-muted-foreground">{addr.phone}</p>

                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(addr)} className="text-muted-foreground hover:text-primary transition">
                                <Pencil size={13} />
                            </button>
                            <button onClick={() => del.mutate({ id: addr.id })} className="text-muted-foreground hover:text-destructive transition">
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Dialog */}
            <AnimatePresence>
                {dialogOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setDialogOpen(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 24, scale: 0.97 }}
                            className="bg-background w-full max-w-md p-8 border border-border/30 shadow-2xl relative"
                        >
                            <button onClick={() => setDialogOpen(false)} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition">
                                <X size={18} />
                            </button>
                            <h4 className="text-xl font-serif font-light mb-1">{editing ? "Edit Address" : "New Address"}</h4>
                            <div className="h-[1px] w-12 bg-primary/30 mb-6" />

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {field("Full Name", "fullName")}
                                {field("Phone", "phone")}
                                {field("Address Line", "addressLine")}
                                <div className="grid grid-cols-2 gap-4">
                                    {field("City", "city")}
                                    {field("State", "state")}
                                </div>
                                {field("Pincode", "pincode")}

                                <button
                                    type="submit"
                                    disabled={upsert.isPending}
                                    className="w-full mt-2 bg-foreground text-background py-3 text-[11px] uppercase tracking-[0.25em] font-semibold hover:opacity-80 transition disabled:opacity-50"
                                >
                                    {upsert.isPending ? "Saving…" : editing ? "Update Address" : "Save Address"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
