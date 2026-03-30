import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
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
