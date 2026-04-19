import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const sendOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber } = sendOtpSchema.parse(body);

    await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber },
      headers: req.headers,
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send OTP";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
