"use client";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  addressLine: string;
};

const addressSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name is too long")
    .regex(/^[a-zA-Z ]+$/, "Only letters and spaces are allowed"),

  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian phone number"),

  addressLine: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(120, "Address is too long"),

  city: z
    .string()
    .min(2, "City is required")
    .max(40, "City name is too long")
    .regex(/^[a-zA-Z ]+$/, "Only letters and spaces are allowed"),

  state: z
    .string()
    .min(2, "State is required")
    .max(40, "State name is too long")
    .regex(/^[a-zA-Z ]+$/, "Only letters and spaces are allowed"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const emptyForm: AddressFormValues = {
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

  const trpc = useTRPC();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (editing) {
      reset({
        fullName: editing.fullName,
        phone: editing.phone,
        city: editing.city,
        state: editing.state,
        pincode: editing.pincode,
        addressLine: editing.addressLine,
      });
    } else {
      reset(emptyForm);
    }
  }, [editing, reset]);

  const upsert = useMutation(
    trpc.profile.upsertAddress.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [["profile", "getMe"]] });
        setDialogOpen(false);
        setEditing(null);
        reset(emptyForm);
        toast.success("Address saved");
      },
      onError: () => {
        toast.error("Failed to save address");
      },
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

  const openNew = () => {
    setEditing(null);
    reset(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setDialogOpen(true);
  };

  const onSubmit = (data: AddressFormValues) => {
    upsert.mutate({
      ...(editing ? { id: editing.id } : {}),
      ...data,
    });
  };

  const field = (
    label: string,
    key: keyof AddressFormValues,
    placeholder?: string,
    type: string = "text"
  ) => (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder ?? label}
        {...register(key)}
        className={`w-full bg-transparent border-b py-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors
          ${
            errors[key]
              ? "border-red-500 focus:border-red-500"
              : "border-border/60 focus:border-primary/60"
          }`}
      />

      {errors[key] && (
        <p className="text-[11px] text-red-500 mt-1">
          {errors[key]?.message}
        </p>
      )}
    </div>
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-serif font-light text-foreground">
            Saved Addresses
          </h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 && (
          <div className="col-span-full py-10 text-center border border-dashed border-border/40 rounded-sm">
            <MapPin size={22} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              No addresses saved yet
            </p>
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
            <p className="text-xs text-muted-foreground">
              {addr.city}, {addr.state} — {addr.pincode}
            </p>
            <p className="text-xs text-muted-foreground">{addr.phone}</p>

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(addr)}
                className="text-muted-foreground hover:text-primary transition"
              >
                <Pencil size={13} />
              </button>

              <button
                onClick={() => del.mutate({ id: addr.id })}
                className="text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDialogOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              className="bg-background w-full max-w-md p-8 border border-border/30 shadow-2xl relative"
            >
              <button
                onClick={() => setDialogOpen(false)}
                className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>

              <h4 className="text-xl font-serif font-light mb-1">
                {editing ? "Edit Address" : "New Address"}
              </h4>
              <div className="h-[1px] w-12 bg-primary/30 mb-6" />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {field("Full Name", "fullName")}
                {field("Phone", "phone", "9876543210", "tel")}
                {field("Address Line", "addressLine")}

                <div className="grid grid-cols-2 gap-4">
                  {field("City", "city")}
                  {field("State", "state")}
                </div>

                {field("Pincode", "pincode", "140001", "text")}

                <button
                  type="submit"
                  disabled={upsert.isPending}
                  className="w-full mt-2 bg-foreground text-background py-3 text-[11px] uppercase tracking-[0.25em] font-semibold hover:opacity-80 transition disabled:opacity-50"
                >
                  {upsert.isPending
                    ? "Saving…"
                    : editing
                    ? "Update Address"
                    : "Save Address"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};