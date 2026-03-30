"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface Props {
    image: string | null;
    name: string;
    onUpdate: () => void;
}

export const AvatarUpload = ({ image, name, onUpdate }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const trpc = useTRPC();
    const qc = useQueryClient();

    const updateMutation = useMutation(
        trpc.profile.updateProfile.mutationOptions({
            onSuccess: () => {
                qc.invalidateQueries({ queryKey: [["profile", "getMe"]] });
                onUpdate();
                toast.success("Profile photo updated");
            },
        })
    );

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            await updateMutation.mutateAsync({ image: data.url });
        } catch (err) {
            toast.error("Upload failed. Try again.");
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const displayImg = preview ?? image;
    const initials = name.charAt(0).toUpperCase();

    return (
        <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
            {/* Circle */}
            <div className="w-28 h-28 rounded-full border-2 border-primary/20 overflow-hidden bg-secondary/30 shadow-xl ring-4 ring-background">
                {displayImg ? (
                    <img src={displayImg} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <span className="text-4xl font-serif text-primary">{initials}</span>
                    </div>
                )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1">
                {uploading ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                    <>
                        <Camera size={18} className="text-white" />
                        <span className="text-white text-[9px] uppercase tracking-widest font-semibold">Change</span>
                    </>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            />
        </div>
    );
};
