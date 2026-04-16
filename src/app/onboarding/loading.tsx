import { Loader2 } from "lucide-react";

export default function OnboardingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="font-serif text-lg tracking-widest text-muted-foreground animate-pulse">
          ALOME
        </p>
      </div>
    </div>
  );
}
