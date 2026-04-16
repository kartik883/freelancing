import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { getBaseUrl } from "./base-url";
import { sendTwilioOtp, verifyTwilioCode } from "./twilio";
import { sendVerificationEmail } from "./resend";

const phoneRegex = /^\+[1-9]\d{7,14}$/;

export const auth = betterAuth({
  baseURL: getBaseUrl(),

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  emailVerification: {
    sendOnSignUp: false,

    async sendVerificationEmail(
      {
        user,
        url,
      }: {
        user: {
          email: string;
          name?: string | null;
        };
        url: string;
      }
    ) {
      await sendVerificationEmail(
        user.email,
        user.name ?? "User",
        url
      );
    },
  },

  user: {
    additionalFields: {
      onboardingCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      address: {
        type: "string",
        required: false,
      },
      phoneNumberVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      age: {
        type: "string",
        required: false,
      },
    },
  },


  trustedOrigins: [getBaseUrl()],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    phoneNumber({
      phoneNumberValidator: async (value) => phoneRegex.test(value),

      signUpOnVerification: {
        getTempEmail: (phone) =>
          `${phone.replace(/[^\d]/g, "")}@phone.alome.local`,
        getTempName: () => "New User",
      },

      async sendOTP({ phoneNumber }) {
        await sendTwilioOtp(phoneNumber);
      },

      async verifyOTP({ phoneNumber, code }) {
        return await verifyTwilioCode(phoneNumber, code);
      },
    }),
  ],
});