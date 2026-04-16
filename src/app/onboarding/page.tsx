import { OnboardingForm } from "@/onboarding/components/onboarding-form";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  // Redirect to home if onboarding is already completed
  if ((session.user as any).onboardingCompleted) {
    redirect("/");
  }

  const queryClient = getQueryClient();

  // Pre-fetch onboarding status on the server
  await queryClient.prefetchQuery(trpc.onboarding.getOnboardingStatus.queryOptions());

  return (
    <main className="min-h-screen bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <OnboardingForm />
        </div>
      </HydrationBoundary>
    </main>
  );
}
