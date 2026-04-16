"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Phone, ShieldCheck } from "lucide-react";

// ─── Country codes ────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+1",  flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+971",flag: "🇦🇪", label: "UAE" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 56 : -56,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -56 : 56,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const subtitleVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

// ─── Google Icon ─────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Step = "phone" | "otp";

export default function AuthDialog() {
  const { isOpen, setIsOpen } = useAuthStore();

  const [step,        setStep]        = useState<Step>("phone");
  const [direction,   setDirection]   = useState(1);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone,       setPhone]       = useState("");
  const [otp,         setOtp]         = useState("");
  const [loading,     setLoading]     = useState(false);
  const [resendIn,    setResendIn]    = useState(0);

  const fullPhone = useMemo(
    () => `${countryCode}${phone}`.replace(/\s+/g, ""),
    [countryCode, phone]
  );

  // Countdown timer
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep("phone");
        setPhone("");
        setOtp("");
        setResendIn(0);
        setDirection(1);
        setLoading(false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Navigation helpers ────────────────────────────────────────────────────

  const goToOtp = () => {
    setDirection(1);
    setStep("otp");
  };

  const goBack = () => {
    setOtp("");
    setDirection(-1);
    setStep("phone");
  };

  // ── OTP Send ─────────────────────────────────────────────────────────────

  const sendOtp = async () => {
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!phoneRegex.test(fullPhone)) {
      toast.error("Enter a valid phone number", {
        description: "Include your country code, e.g. +91 98765 43210",
      });
      return;
    }

    setLoading(true);
    try {
      // Better Auth phoneNumber plugin — calls /api/auth/phone-number/send-verification-code
      const { error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: fullPhone,
      });

      if (error) {
        throw new Error(error.message ?? "Failed to send OTP");
      }

      goToOtp();
      setResendIn(30);
      toast.success("Code sent!", {
        description: `A 6-digit OTP was sent to ${fullPhone}`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Verify ───────────────────────────────────────────────────────────

  const verifyOtp = async () => {
    if (loading) return;
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit code");
      return;
    }

    setLoading(true);
    
    try {
      // Better Auth phoneNumber plugin — calls /api/auth/phone-number/verify
      const { error } = await authClient.phoneNumber.verify({
        phoneNumber: fullPhone,
        code: otp.trim(),
      });

      if (error) {
        throw new Error(error.message ?? "Verification failed");
      }

      toast.success("Welcome to Alome ✦", {
        description: "You're signed in. Enjoy your experience.",
      });
      setIsOpen(false);

      // Small delay for toast to show before redirect
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 600);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed", {
        description: "Check the code and try again, or request a new one.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/onboarding",
      });
      // Loading stays true — browser navigates away
    } catch {
      toast.error("Google sign-in failed", {
        description: "Please try again or use your phone number.",
      });
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="z-[9999] overflow-hidden border border-border/40 bg-background/[0.97] p-0 shadow-[0_32px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:max-w-[420px] [&>button]:top-5 [&>button]:right-5"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
        </DialogHeader>

        {/* ── Top accent bar */}
        <div
          aria-hidden
          className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />

        <div className="px-8 py-9 overflow-hidden">

          {/* ── Brand header */}
          <div className="mb-8 text-center select-none">
            {/* Logo wordmark */}
            <p className="font-serif text-[2rem] leading-none tracking-[0.08em] text-foreground">
              ALOME
            </p>

            {/* Dynamic subtitle */}
            <div className="mt-2 h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  variants={subtitleVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-[13px] text-muted-foreground"
                >
                  {step === "phone"
                    ? "Your luxury skincare journey begins"
                    : `Code sent to ${fullPhone}`}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Step content (animated slide) */}
          <AnimatePresence mode="wait" custom={direction}>

            {/* ════════════════ PHONE STEP ════════════════ */}
            {step === "phone" && (
              <motion.div
                key="phone-step"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                {/* Phone field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone-input"
                    className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger
                        id="country-select"
                        className="w-[90px] shrink-0 h-11 text-sm"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            <span className="flex items-center gap-1.5">
                              <span>{c.flag}</span>
                              <span className="text-muted-foreground">{c.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      id="phone-input"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/[^\d]/g, ""))
                      }
                      onKeyDown={(e) => e.key === "Enter" && !loading && sendOtp()}
                      placeholder="98765 43210"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      className="flex-1 h-11 tracking-wider text-[15px]"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Continue CTA */}
                <Button
                  id="send-otp-btn"
                  className="w-full h-11 text-sm font-semibold tracking-wide"
                  onClick={sendOtp}
                  disabled={loading || phone.length < 7}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Continue with Phone
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] font-medium text-muted-foreground shrink-0">
                    or
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Google */}
                <Button
                  id="google-signin-btn"
                  type="button"
                  variant="outline"
                  className="w-full h-11 gap-2.5 text-sm font-medium"
                  onClick={handleGoogle}
                  disabled={loading}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>

                {/* Terms */}
                <p className="text-center text-[11px] leading-relaxed text-muted-foreground/70 pt-1">
                  By continuing you agree to our{" "}
                  <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                    Terms
                  </span>{" "}
                  &amp;{" "}
                  <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                    Privacy Policy
                  </span>
                </p>
              </motion.div>
            )}

            {/* ════════════════ OTP STEP ════════════════ */}
            {step === "otp" && (
              <motion.div
                key="otp-step"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                {/* OTP label */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Verification Code
                  </label>
                  <p className="text-[13px] text-muted-foreground">
                    Enter the 6-digit code sent via SMS
                  </p>
                </div>

                {/* OTP Slots */}
                <div className="flex justify-center">
                  <InputOTP
                    id="otp-input"
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    //onComplete={verifyOtp}
                    disabled={loading}
                    containerClassName="gap-2"
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-11 text-base font-semibold rounded-xl border-border/60 focus-within:border-primary transition-all"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Verify CTA */}
                <Button
                  id="verify-otp-btn"
                  className="w-full h-11 text-sm font-semibold tracking-wide"
                  onClick={verifyOtp}
                  disabled={loading || otp.length < 6}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Verify &amp; Sign In
                    </>
                  )}
                </Button>

                {/* Bottom actions row */}
                <div className="flex items-center justify-between text-[13px]">
                  <button
                    id="back-to-phone-btn"
                    type="button"
                    onClick={goBack}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:pointer-events-none"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change number
                  </button>

                  <button
                    id="resend-otp-btn"
                    type="button"
                    onClick={sendOtp}
                    disabled={resendIn > 0 || loading}
                    className="font-medium text-primary disabled:text-muted-foreground transition-colors disabled:pointer-events-none"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Bottom accent bar */}
        <div
          aria-hidden
          className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </DialogContent>
    </Dialog>
  );
}