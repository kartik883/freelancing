import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { user } from "@/db/schema";
import { verifyTwilioCode, sendTwilioOtp } from "@/lib/twilio";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/resend";

export const onboardingRouter = createTRPCRouter({
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const userData = await db.query.user.findFirst({
      where: eq(user.id, ctx.userId),
    });

    if (!userData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      email: userData.email,
      emailVerified: !!userData.emailVerified,
      phoneNumber: userData.phoneNumber,
      phoneNumberVerified: !!userData.phoneNumberVerified,
      onboardingCompleted: !!userData.onboardingCompleted,
      name: userData.name,
      age: userData.age,
      address: userData.address,
      image: userData.image,
    };
  }),

  sendVerificationEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email is already taken by ANOTHER user
      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, input.email),
      });

      if (existingUser && existingUser.id !== ctx.userId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That email is already associated with another account",
        });
      }

      // Generate 4-digit code
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      try {
        await db
          .update(user)
          .set({
            email: input.email,
            emailVerificationCode: otpCode,
            emailVerificationExpiresAt: expiresAt,
            // Optimization: we don't reset emailVerified here yet
            // but we ensure they have to verify this new code
          })
          .where(eq(user.id, ctx.userId));

        // Get user name for the email template
        const currentUser = await db.query.user.findFirst({
          where: eq(user.id, ctx.userId),
        });

        await sendVerificationEmail(input.email, currentUser?.name, otpCode);

        return {
          success: true,
          message: "Verification code sent to your email",
        };
      } catch (error) {
        console.error("sendVerificationEmail failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send verification email",
        });
      }
    }),

  verifyEmailCode: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await db.query.user.findFirst({
        where: eq(user.id, ctx.userId),
      });

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const isMatch = currentUser.emailVerificationCode === input.code;
      const isNotExpired = currentUser.emailVerificationExpiresAt && currentUser.emailVerificationExpiresAt > new Date();

      if (!isMatch || !isNotExpired) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification code",
        });
      }

      // Mark email as verified
      await db
        .update(user)
        .set({
          emailVerified: true,
          emailVerificationCode: null,
          emailVerificationExpiresAt: null,
        })
        .where(eq(user.id, ctx.userId));

      return {
        success: true,
        message: "Email verified successfully",
      };
    }),

  sendPhoneOtp: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await sendTwilioOtp(input.phoneNumber);

        return {
          success: true,
          message: "OTP sent successfully",
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send OTP",
        });
      }
    }),

  verifyPhoneOtp: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(10),
        code: z.string().length(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isValid = await verifyTwilioCode(input.phoneNumber, input.code);

      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OTP",
        });
      }

      await db
        .update(user)
        .set({
          phoneNumber: input.phoneNumber,
          phoneNumberVerified: true,
        })
        .where(eq(user.id, ctx.userId));

      return {
        success: true,
        message: "Phone number verified",
      };
    }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name is required"),
        age: z.string().min(1, "Age is required"),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUser = await db.query.user.findFirst({
        where: eq(user.id, ctx.userId),
      });

      if (!currentUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Require both verifications before completing onboarding
      if (!currentUser.emailVerified || !currentUser.phoneNumberVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please verify both email and phone number first",
        });
      }

      await db
        .update(user)
        .set({
          name: input.name,
          age: input.age,
          email: input.email,
          onboardingCompleted: true,
        })
        .where(eq(user.id, ctx.userId));

      try {
        await sendWelcomeEmail(input.email, input.name);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }

      return {
        success: true,
        message: "Onboarding completed successfully",
      };
    }),
});