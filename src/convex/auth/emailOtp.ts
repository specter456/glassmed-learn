import { Email } from "@convex-dev/auth/providers/Email";
import axios from "axios";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  // This function can be asynchronous
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    return generateRandomString(random, alphabet, 6);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    // The relay key is a secret: it must come from the Keys tab / env, never
    // from source code. It is not needed for the OTP to be generated — only
    // for the email to be delivered — so a missing key is reported clearly.
    const apiKey = (
      process.env.FREEBUFF_EMAIL_API_KEY ??
      process.env.VLY_EMAIL_API_KEY ??
      ""
    ).trim();
    if (!apiKey) {
      throw new Error(
        "Email relay key is not configured. Add FREEBUFF_EMAIL_API_KEY in the Keys tab.",
      );
    }
    try {
      await axios.post(
        "https://auth.freebuff.app/send_otp",
        {
          to: email,
          otp: token,
          appName: process.env.VLY_APP_NAME || "a freebuff.com application",
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );
    } catch (error) {
      // Never serialize the raw error: axios errors embed the request config,
      // including headers — which would leak the API key into logs/UI.
      console.error("Email OTP send failed:", error instanceof Error ? error.message : error);
      throw new Error("We couldn't send the verification code. Please try again.");
    }
  },
});
