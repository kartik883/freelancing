"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LucideLoader2 as Loader2_Icon,
  LucideCheckCircle2 as CheckCircle2_Icon,
  LucideMail as Mail_Icon,
  LucidePhone as Phone_Icon,
  LucideArrowRight as ArrowRight_Icon,
  LucideShieldCheck as ShieldCheck_Icon,
  LucideAlertCircle as AlertCircle_Icon,
  LucideRefreshCcw as RefreshCcw_Icon,
  LucideUser as User_Icon,
  LucideCalendar as Calendar_Icon,
} from "lucide-react";

import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRAND_NAME } from "@/brandhelp";

const COUNTRIES = [
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+1",  flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+971",flag: "🇦🇪", label: "UAE" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.string().min(1, "Age is required"),
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

export function OnboardingForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // ─── Local State ─────────────────────────────────────────────────────────────
  const [emailSent, setEmailSent] = useState(false);
  const [emailOtpStep, setEmailOtpStep] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  
  const [otpStep, setOtpStep] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      age: "",
    },
  });

  // ─── tRPC / TanStack Hooks ──────────────────────────────────────────────────
  
  const {
    data: status,
    isLoading: loadingStatus,
    refetch: refetchStatus,
  } = useQuery(
    trpc.onboarding.getOnboardingStatus.queryOptions(undefined, {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    })
  );

  const sendEmail = useMutation(
    trpc.onboarding.sendVerificationEmail.mutationOptions({
      onSuccess: () => {
        setEmailSent(true);
        setEmailOtpStep(true);
        setResendTimer(60);
        toast.success("Verification code sent to your email");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to send verification email");
      },
    })
  );

  const verifyEmail = useMutation(
    trpc.onboarding.verifyEmailCode.mutationOptions({
      onSuccess: async () => {
        setEmailOtpStep(false);
        await queryClient.invalidateQueries(trpc.onboarding.getOnboardingStatus.queryFilter());
        toast.success("Email verified successfully");
      },
      onError: (err) => {
        toast.error(err.message || "Invalid or expired code");
      },
    })
  );

  const sendOtp = useMutation(
    trpc.onboarding.sendPhoneOtp.mutationOptions({
      onSuccess: () => {
        setOtpStep(true);
        toast.success("OTP sent to your phone");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to send OTP");
      },
    })
  );

  const verifyOtp = useMutation(
    trpc.onboarding.verifyPhoneOtp.mutationOptions({
      onSuccess: async () => {
        setOtpStep(false);
        await queryClient.invalidateQueries(trpc.onboarding.getOnboardingStatus.queryFilter());
        toast.success("Phone verified successfully");
      },
      onError: (err) => {
        toast.error(err.message || "Invalid OTP");
      },
    })
  );

  const saveProfile = useMutation(
    trpc.onboarding.completeOnboarding.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.onboarding.getOnboardingStatus.queryFilter());
        toast.success("Onboarding complete!");
        router.push("/");
        router.refresh();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to save profile");
      },
    })
  );

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!status) return;
    setValue("name", status.name || "");
    setValue("age", status.age || "");
    const isPlaceholder = status.email?.includes(`@phone.${BRAND_NAME.toLowerCase()}.local`);
    setValue("email", isPlaceholder ? "" : (status.email || ""));
    setVerificationEmail(isPlaceholder ? "" : (status.email || ""));
  }, [status, setValue]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const onSendEmail = () => {
    if (!verificationEmail) return toast.error("Please enter your email");
    const valid = z.string().email().safeParse(verificationEmail);
    if (!valid.success) return toast.error("Please enter a valid email");
    sendEmail.mutate({ email: verificationEmail });
  };

  const onVerifyEmailCode = () => {
    if (emailOtpCode.length !== 4) return toast.error("Enter the 4-digit code");
    verifyEmail.mutate({ email: verificationEmail, code: emailOtpCode });
  };

  const onVerifyPhoneOtp = () => {
    if (otpCode.length !== 6) return toast.error("Enter the 6-digit code");
    const fullPhone = `${countryCode}${phoneInput}`.replace(/\s+/g, "");
    verifyOtp.mutate({ phoneNumber: fullPhone, code: otpCode });
  };

  const onSubmitForm = (values: FormValues) => {
    if (!status?.emailVerified || !status?.phoneNumberVerified) {
      return toast.error("Please verify both email and phone first");
    }
    saveProfile.mutate(values);
  };

  if (loadingStatus) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isGoogleUser = !status?.email?.includes(`@phone.${BRAND_NAME.toLowerCase()}.local`);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 py-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif tracking-tight uppercase">Welcome to {BRAND_NAME}</h1>
        <p className="text-muted-foreground font-light">Complete these rituals to begin your journey.</p>
      </div>

      {/* Step 1: Verification */}
      <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden bg-card/50 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="font-serif text-2xl font-light">Identity Ritual</CardTitle>
          <CardDescription>We need to verify both your phone and email to secure your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* Email Verification Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-white", status?.emailVerified ? "bg-green-500" : "bg-primary/20 text-primary")}>
                   {status?.emailVerified ? <CheckCircle2 className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </div>
                <h3 className="font-medium">Email Verification</h3>
                {status?.emailVerified && <Badge className="bg-green-500/10 text-green-700 border-none ml-auto">Verified</Badge>}
             </div>

             {status?.emailVerified ? (
                <div className="pl-11 pr-4 py-3 rounded-2xl bg-primary/5 text-sm text-muted-foreground">
                  {status.email}
                </div>
             ) : !emailOtpStep ? (
                <div className="pl-11 flex gap-3">
                   <Input 
                     placeholder="you@example.com" 
                     className="rounded-xl h-11"
                     value={verificationEmail}
                     onChange={(e) => setVerificationEmail(e.target.value)}
                   />
                   <Button onClick={onSendEmail} disabled={sendEmail.isPending} className="rounded-xl h-11 px-6">
                     {sendEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Code"}
                   </Button>
                </div>
             ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pl-11 space-y-4">
                   <div className="flex flex-col items-center gap-4 py-4 rounded-3xl border border-dashed border-primary/20 bg-primary/[0.02]">
                      <p className="text-xs text-muted-foreground">Enter the 4-digit code sent to your email</p>
                      <InputOTP maxLength={4} value={emailOtpCode} onChange={setEmailOtpCode}>
                        <InputOTPGroup className="gap-2">
                           {[0,1,2,3].map(i => <InputOTPSlot key={i} index={i} className="h-14 w-12 rounded-xl border-primary/20 text-xl font-bold" />)}
                        </InputOTPGroup>
                      </InputOTP>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEmailOtpStep(false)} className="text-[10px] tracking-widest uppercase">Change Email</Button>
                        <Button 
                          size="sm" 
                          onClick={onVerifyEmailCode} 
                          disabled={verifyEmail.isPending} 
                          className="rounded-xl px-8 h-10"
                        >
                          {verifyEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Email"}
                        </Button>
                      </div>
                   </div>
                </motion.div>
             )}
          </div>

          <div className="h-px bg-border/50" />

          {/* Phone Verification Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-white", status?.phoneNumberVerified ? "bg-green-500" : "bg-primary/20 text-primary")}>
                   {status?.phoneNumberVerified ? <CheckCircle2 className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                </div>
                <h3 className="font-medium">Phone Verification</h3>
                {status?.phoneNumberVerified && <Badge className="bg-green-500/10 text-green-700 border-none ml-auto">Verified</Badge>}
             </div>

             {status?.phoneNumberVerified ? (
                <div className="pl-11 pr-4 py-3 rounded-2xl bg-primary/5 text-sm text-muted-foreground">
                  {status.phoneNumber}
                </div>
             ) : !otpStep ? (
                <div className="pl-11 flex flex-col gap-3">
                   <div className="flex gap-2">
                     <Select value={countryCode} onValueChange={setCountryCode}>
                       <SelectTrigger className="w-[100px] h-11 rounded-xl">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="z-[10000]">
                         {COUNTRIES.map((c) => (
                           <SelectItem key={c.code} value={c.code}>
                             <span className="flex items-center gap-1.5 text-sm">
                               <span>{c.flag}</span>
                               <span>{c.code}</span>
                             </span>
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <Input 
                       placeholder="98765 43210" 
                       className="rounded-xl h-11 flex-1"
                       value={phoneInput}
                       onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d]/g, ""))}
                     />
                   </div>
                   <Button 
                     onClick={() => {
                        const fullPhone = `${countryCode}${phoneInput}`.replace(/\s+/g, "");
                        if (phoneInput.length < 7) return toast.error("Enter a valid phone number");
                        sendOtp.mutate({ phoneNumber: fullPhone });
                     }} 
                     disabled={sendOtp.isPending} 
                     className="rounded-xl h-11 px-6 w-full"
                   >
                     {sendOtp.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                   </Button>
                </div>
             ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pl-11 space-y-4">
                   <div className="flex flex-col items-center gap-4 py-4 rounded-3xl border border-dashed border-primary/20 bg-primary/[0.02]">
                      <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to your phone</p>
                      <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                        <InputOTPGroup className="gap-2">
                           {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} className="h-12 w-10 rounded-xl border-primary/20" />)}
                        </InputOTPGroup>
                      </InputOTP>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="sm" onClick={() => setOtpStep(false)} className="text-[10px] tracking-widest uppercase">Edit Phone</Button>
                         <Button 
                           size="sm" 
                           onClick={onVerifyPhoneOtp} 
                           disabled={verifyOtp.isPending} 
                           className="rounded-xl px-8 h-10"
                         >
                           {verifyOtp.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Code"}
                         </Button>
                      </div>
                   </div>
                </motion.div>
             )}
          </div>

        </CardContent>
      </Card>

      {/* Step 2: Final Profile (Name & Age) */}
      <AnimatePresence>
        {(status?.emailVerified && status?.phoneNumberVerified) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden bg-card/50 backdrop-blur">
               <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <CardTitle className="font-serif text-2xl font-light">Final Details</CardTitle>
                <CardDescription>Just a few more things to complete your profile.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Full Name</Label>
                      <Input id="name" {...register("name")} placeholder="Your name" className="rounded-2xl h-12 bg-background/50" />
                      {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Age</Label>
                      <Input id="age" {...register("age")} placeholder="25" type="number" className="rounded-2xl h-12 bg-background/50" />
                      {errors.age && <p className="text-[10px] text-destructive">{errors.age.message}</p>}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={saveProfile.isPending} 
                      className="w-full h-14 rounded-full text-sm font-bold tracking-widest group shadow-[0_10px_30px_rgba(var(--primary),0.2)]"
                    >
                      {saveProfile.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                          FINALIZE ONBOARDING
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <button 
          onClick={() => refetchStatus()} 
          className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-primary/40 hover:text-primary transition-colors"
        >
          <RefreshCcw className="h-3 w-3" />
          Sync Account Status
        </button>
      </div>
    </div>
  );
}

// ─── Local Components ─────────────────────────────────────────────────────────

function Section({ title, icon, children, card }: { title: string, icon: ReactNode, children: ReactNode, card?: boolean }) {
  if (card) {
    return (
      <Card className="rounded-3xl border-primary/10 bg-card/50 shadow-luxury overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 px-8 pt-8">
           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
             {icon}
           </div>
           <CardTitle className="font-serif text-xl tracking-wide font-light">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-2">
          {children}
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary font-serif">
        {icon}
        <h3 className="text-xl">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Re-defining icons just in case of import issues with specific names
function Loader2(props: any) { return <Loader2_Icon {...props} /> }
function CheckCircle2(props: any) { return <CheckCircle2_Icon {...props} /> }
function Mail(props: any) { return <Mail_Icon {...props} /> }
function Phone(props: any) { return <Phone_Icon {...props} /> }
function ArrowRight(props: any) { return <ArrowRight_Icon {...props} /> }
function ShieldCheck(props: any) { return <ShieldCheck_Icon {...props} /> }
function AlertCircle(props: any) { return <AlertCircle_Icon {...props} /> }
function RefreshCcw(props: any) { return <RefreshCcw_Icon {...props} /> }
function User(props: any) { return <User_Icon {...props} /> }
function Calendar(props: any) { return <Calendar_Icon {...props} /> }