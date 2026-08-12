import { Email } from "@convex-dev/auth/providers/Email";
import axios from "axios";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

const OTP_APP_NAME = process.env.VLY_APP_NAME || "GlassMed Learn";

/**
 * Send the one-time code via whichever provider is configured.
 *
 * Order of preference:
 *   1. Resend (RESEND_API_KEY) — your own provider, works anywhere. Use the
 *      "onboarding@resend.dev" sender for testing before you verify a domain.
 *   2. Freebuff relay (FREEBUFF_EMAIL_API_KEY) — the platform's OTP relay.
 *
 * Keys are secrets: they must come from the Keys tab / env, never source code.
 * Errors are sanitized — axios errors embed the request config including
 * headers, which would leak the API key into logs/UI.
 */
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
    const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
    const relayKey = (
      process.env.FREEBUFF_EMAIL_API_KEY ??
      process.env.VLY_EMAIL_API_KEY ??
      ""
    ).trim();

    if (!resendKey && !relayKey) {
      throw new Error(
        "Email sending is not configured. Add RESEND_API_KEY or FREEBUFF_EMAIL_API_KEY in the Keys tab.",
      );
    }

    const subject = `Your GlassMed login code is ${token}`;
    const text =
      `Here is your GlassMed Learn login code:\n\n` +
      `    ${token}\n\n` +
      `It expires in 15 minutes. If you didn't request this, you can safely ignore it.\n\n` +
      `— GlassMed Learn 💙`;

    try {
      if (resendKey) {
        await axios.post(
          "https://api.resend.com/emails",
          {
            from: process.env.RESEND_FROM || "GlassMed Learn <onboarding@resend.dev>",
            to: [email],
            subject,
            text,
          },
          { headers: { Authorization: `Bearer ${resendKey}` } },
        );
      } else {
        await axios.post(
          "https://auth.freebuff.app/send_otp",
          {
            to: email,
            otp: token,
            appName: OTP_APP_NAME,
          },
          { headers: { "x-api-key": relayKey } },
        );
      }
    } catch (error) {
      console.error("Email OTP send failed:", error instanceof Error ? error.message : error);
      throw new Error("We couldn't send the verification code. Please try again.");
    }
  },
});
