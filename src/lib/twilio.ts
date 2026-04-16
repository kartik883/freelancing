import "server-only";
import twilio from "twilio";

// Lazy initialization — avoids crashing at module load if env vars aren't set yet
function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error(
      "Twilio credentials missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env"
    );
  }
  return twilio(accountSid, authToken);
}

function getServiceSid() {
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!sid) {
    throw new Error(
      "TWILIO_VERIFY_SERVICE_SID is missing. Create a Verify Service at twilio.com/console and add the SID to .env"
    );
  }
  return sid;
}

export async function sendTwilioOtp(phoneNumber: string): Promise<void> {

  await getClient()
    .verify.v2.services(getServiceSid())
    .verifications.create({ to: phoneNumber, channel: "sms" });
}

// export async function verifyTwilioCode(
//   phoneNumber: string,
//   code: string
// ): Promise<boolean> {
//   const result = await getClient()
//     .verify.v2.services(getServiceSid())
//     .verificationChecks.create({ to: phoneNumber, code });
//   return result.status === "approved";
// }

export async function verifyTwilioCode(
  phoneNumber: string,
  code: string
): Promise<boolean> {
  console.log("VERIFY INPUT:", phoneNumber, code);

  const result = await getClient()
    .verify.v2.services(getServiceSid())
    .verificationChecks.create({
      to: phoneNumber,
      code,
    });

  console.log("TWILIO FULL RESPONSE:", result);
  console.log("TWILIO STATUS:", result.status);

  return result.status === "approved";
}
