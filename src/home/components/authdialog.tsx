"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const authSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    agree: z.boolean().optional(),
});

type AuthValues = z.infer<typeof authSchema>;

export default function AuthDialog() {
    
    const { isOpen, setIsOpen, mode, setMode } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<AuthValues>({
        resolver: zodResolver(authSchema),
    });

    // Auto popup after 5 sec
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const checkSession = async () => {
            const session = await authClient.getSession();

            if (!session.data) {
                timer = setTimeout(() => {
                    setIsOpen(true);
                }, 5000);
            }
        };

        checkSession();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [setIsOpen]);

    const onSubmit = async (values: AuthValues) => {
        if (mode === "signup" && !values.agree) {
            toast.error("You must agree to the terms");
            return;
        }
        console.log("from submit button:", mode);


        setLoading(true);

        try {
            if (mode === "signup") {
                await authClient.signUp.email({
                    email: values.email,
                    password: values.password,
                    name: values.name || "",
                    callbackURL: "/",
                });

                toast.success("Account created successfully!");
            } else {
                await authClient.signIn.email({
                    email: values.email,
                    password: values.password,
                    callbackURL: "/",
                });

                toast.success("Signed in successfully!");
            }

            setIsOpen(false);
            reset();
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google") => {
        setLoading(true);
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch (err) {
            toast.error(`Failed to sign in with ${provider}`);
        } finally {
            setLoading(false);
        }
    };

    console.log("MODE:", mode);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-background shadow-2xl backdrop-blur-xl z-[9999]">
                <div className="relative p-8 md:p-10">
                    <DialogHeader className="mb-8 text-center">
                        <DialogTitle className="text-3xl font-serif tracking-tight text-primary">
                            {mode === "signin" ? "Welcome Back" : "Create Account"}
                        </DialogTitle>
                        <DialogDescription className="text-foreground/60 font-light mt-2 tracking-wide">
                            {mode === "signin"
                                ? "Enter your credentials to continue your journey."
                                : "Create an account for find your skin product"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {mode === "signup" && (
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest font-semibold text-foreground/70">
                                    Full Name
                                </Label>
                                <Input
                                    {...register("name")}
                                    placeholder="E.g. Alex Stone"
                                    className="bg-primary/5 border-primary/10 focus:border-primary/30 rounded-none py-6"
                                />
                                {errors.name && (
                                    <p className="text-[10px] text-destructive">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest font-semibold text-foreground/70">
                                Email
                            </Label>
                            <Input
                                {...register("email")}
                                placeholder="alex@example.com"
                                className="bg-primary/5 border-primary/10 focus:border-primary/30 rounded-none py-6"
                            />
                            {errors.email && (
                                <p className="text-[10px] text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest font-semibold text-foreground/70">
                                Password
                            </Label>
                            <Input
                                type="password"
                                {...register("password")}
                                placeholder="••••••••"
                                className="bg-primary/5 border-primary/10 focus:border-primary/30 rounded-none py-6"
                            />
                            {errors.password && (
                                <p className="text-[10px] text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {mode === "signup" && (
                            <div className="flex items-start gap-3 py-2">
                                <Checkbox
                                    checked={watch("agree") || false}
                                    onCheckedChange={(val) =>
                                        setValue("agree", Boolean(val))
                                    }
                                />
                                <label className="text-[11px] text-foreground/60">
                                    I agree to Terms & Privacy Policy
                                </label>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-6 uppercase text-xs"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : mode === "signin" ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <div className="grid grid-cols- gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSocialLogin("google")}
                            >
                                Google
                            </Button>

                        </div>

                        <p className="text-[11px] text-center pt-4">
                            {mode === "signin" ? "New user?" : "Already have account?"}
                            <button
                                type="button"
                                onClick={() =>
                                    setMode(mode === "signin" ? "signup" : "signin")
                                }
                                className="ml-2 underline"
                            >
                                {mode === "signin" ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}