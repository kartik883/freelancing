import Razorpay from "razorpay";
import crypto from "crypto";

export const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID?.replace(/['"]+/g, "").trim();
  const key_secret = process.env.RAZORPAY_SECRET?.replace(/['"]+/g, "").trim();

  if (!key_id || !key_secret) {
    throw new Error("Razorpay API keys are missing from environment variables.");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};




export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const secret = process.env.RAZORPAY_SECRET?.replace(/['"]+/g, "").trim();
  if (!secret) {
    throw new Error("RAZORPAY_SECRET is missing");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
};



export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
) => {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
};
