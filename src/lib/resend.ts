import "server-only";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is missing");
}

const resend = new Resend(resendApiKey);

// Helper to get sender email
const getFromEmail = () => process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function sendWelcomeEmail(email: string, name?: string | null) {
  const displayName = name || "Valued Customer";
  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: "Welcome to Alome ✦ Your Ritual Begins",
    html: `
      <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #1a1a1a; background-color: #faf9f6;">
        <h1 style="font-size: 28px; font-weight: normal; letter-spacing: 0.2em; text-align: center; text-transform: uppercase; margin-bottom: 40px;">ALOME</h1>
        <div style="line-height: 1.8; font-size: 15px;">
          <p>Welcome home, ${displayName},</p>
          <p>We are honored to have you join our community. Your Alome profile is now complete, and your journey toward intentional, beautiful rituals has officially begun.</p>
          <p>Whether you're exploring our curated collections or sharing your own glow, we are here to support your daily ritual.</p>
          <div style="text-align: center; margin: 50px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://alome.dev'}" style="background-color: #1a1a1a; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 100px; font-size: 12px; letter-spacing: 0.15em; font-weight: bold; display: inline-block;">EXPLORE THE COLLECTION</a>
          </div>
          <p style="margin-top: 50px; text-align: center; font-style: italic; color: #666;">
            "Glow in Real Life"
          </p>
          <p style="margin-top: 40px; border-top: 1px solid #e5e5e5; pt: 20px; font-size: 13px; color: #999; text-align: center;">
            With gratitude,<br/>The Alome Team
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendVerificationEmail(email: string, name?: string | null, code?: string | null) {
  const displayName = name || "New User";
  const verificationCode = code || "0000";
  
  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: "Verify your Alome account",
    html: `
      <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #1a1a1a;">
        <h1 style="font-size: 24px; font-weight: normal; letter-spacing: 0.1em; text-align: center; text-transform: uppercase;">ALOME</h1>
        <div style="margin-top: 40px; line-height: 1.6;">
          <p>Hello ${displayName},</p>
          <p>Thank you for joining the journey with us. To begin your personalized Alome experience, please verify your email address using the code below.</p>
          <div style="text-align: center; margin: 40px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 0.3em; background-color: #f4f4f4; display: inline-block; padding: 12px 24px; border-radius: 8px;">
              ${verificationCode}
            </div>
          </div>
          <p style="font-size: 13px; color: #666; text-align: center;">This code will expire in 10 minutes.</p>
          <p style="font-size: 13px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
          <p style="margin-top: 40px;">With gratitude,<br/>The Alome Team</p>
        </div>
      </div>
    `,
  });
}

