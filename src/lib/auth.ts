import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/schema";
import { getBaseUrl } from "./base-url";

export const auth = betterAuth({
    baseURL: getBaseUrl(),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        getBaseUrl(),
    ],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: schema,
    }),
});

