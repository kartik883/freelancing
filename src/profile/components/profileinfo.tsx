"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    name: string;
    email: string;
}

export const ProfileInfo = ({ name, email }: Props) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(name);
    const trpc = useTRPC();
    const qc = useQueryClient();

    const mutation = useMutation(
        trpc.profile.updateProfile.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({ queryKey: [["profile", "getMe"]] });
                setEditing(false);
                toast.success("Name updated");
            },
            onError: () => toast.error("Failed to update name"),
        })
    );

    const handleSave = () => {
        if (!value.trim() || value === name) { setEditing(false); return; }
        mutation.mutate({ name: value.trim() });
    };

    return (
        <div className="space-y-1 text-center">
            {/* Name row */}
            <div className="flex items-center justify-center gap-2">
                {editing ? (
                    <>
                        <input
                            autoFocus
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSave()}
                            className="text-xl font-serif font-light border-b border-primary/40 bg-transparent text-center focus:outline-none text-foreground w-48"
                        />
                        <button onClick={handleSave} className="text-primary hover:opacity-70 transition">
                            <Check size={16} />
                        </button>
                        <button onClick={() => { setEditing(false); setValue(name); }} className="text-muted-foreground hover:opacity-70 transition">
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-serif font-light tracking-tight text-foreground">{name}</h2>
                        <button
                            onClick={() => setEditing(true)}
                            className="text-muted-foreground hover:text-primary transition"
                        >
                            <Pencil size={14} />
                        </button>
                    </>
                )}
            </div>

            {/* Email (read-only) */}
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{email}</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary/60 font-semibold mt-1">Premium Member</p>
        </div>
    );
};
