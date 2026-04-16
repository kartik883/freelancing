import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const verifyOtpSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, code } = verifyOtpSchema.parse(body);
    console.log("VERIFY INPUT:", phoneNumber, code);


    const response = await auth.api.verifyPhoneNumber({
      body: { phoneNumber, code },
      headers: req.headers,
      asResponse: true,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to verify OTP";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
