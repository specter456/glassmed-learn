import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { BeeTutorial } from "@/components/BeeTutorial";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { GlassMedBrand } from "@/components/GlassMedLogo";
import { markLoginArrival } from "@/components/Celebration";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

// How long a user must wait before asking for a fresh code. It's persisted to
// localStorage so a page reload can't reset it and spam the email relay.
// Codes also expire after 15 minutes server-side, so this is a UX guard on
// top of the backend's own limits.
const RESEND_COOLDOWN_SECONDS = 30;
const OTP_SEND_KEY = "glassmed-otp-sent-at";

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  // "signIn" = show email input, { email } = show OTP input
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  // authMode: "signin" = returning user, "signup" = new user (visual only — same OTP flow)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Seconds left before a code can be resent — seeded from localStorage so
  // refreshing the page doesn't bypass the cooldown.
  const [cooldownLeft, setCooldownLeft] = useState(() => {
    try {
      const lastSent = Number(localStorage.getItem(OTP_SEND_KEY));
      if (Number.isFinite(lastSent) && lastSent > 0) {
        return Math.max(
          0,
          RESEND_COOLDOWN_SECONDS - Math.floor((Date.now() - lastSent) / 1000),
        );
      }
    } catch {
      // localStorage unavailable — start the cooldown from scratch.
    }
    return 0;
  });
  const [resentNote, setResentNote] = useState(false);
  // Ref guard (not state): navigates exactly once per auth completion, without
  // triggering extra renders. There is no wait screen — the welcome
  // celebration plays over the destination page instead (see LoginCelebration).
  const redirectScheduled = useRef(false);
  // Tracks whether the user explicitly clicked a login button.
  // Auto-redirect only fires after an explicit action, preventing
  // the auth page from instantly forwarding already-authenticated users.
  const loginTriggered = useRef(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && loginTriggered.current && !redirectScheduled.current) {
      redirectScheduled.current = true;
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  // Tick the resend cooldown down once a second while on the OTP screen.
  useEffect(() => {
    if (step === "signIn") return;
    const timer = setInterval(() => {
      setCooldownLeft((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  /** Send (or resend) the 6-digit code to an email. Returns true on success. */
  const sendCode = async (emailAddr: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", emailAddr);
      await signIn("email-otp", formData);
      const sentAt = Date.now();
      try {
        localStorage.setItem(OTP_SEND_KEY, String(sentAt));
      } catch {
        // Non-fatal — the in-memory cooldown still applies for this session.
      }
      setCooldownLeft(RESEND_COOLDOWN_SECONDS);
      return true;
    } catch (error) {
      console.error("Email code send error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const emailValue = (formData.get("email") as string)?.trim();
    // Validation: email cannot be empty
    if (!emailValue) {
      setError("Please enter your email address.");
      return;
    }
    if (!emailValue.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (await sendCode(emailValue)) {
      setStep({ email: emailValue });
    }
  };

  const handleResend = async () => {
    if (step === "signIn" || cooldownLeft > 0 || isLoading) return;
    setResentNote(false);
    if (await sendCode(step.email)) {
      setResentNote(true);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    loginTriggered.current = true;
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      // Flag the welcome celebration BEFORE signIn.
      markLoginArrival(false);
      await signIn("email-otp", formData);
    } catch (error) {
      console.error("OTP verification error:", error);
      const message = error instanceof Error ? error.message : "";
      setError(
        /RATE_LIMITED|too many|throttled/i.test(message)
          ? "Too many attempts — please wait a minute and try again."
          : "The verification code you entered is incorrect or expired.",
      );
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = () => {
    loginTriggered.current = true;
    // Flag the welcome celebration BEFORE navigation — mark as guest.
    markLoginArrival(true);
    // Navigate IMMEDIATELY — do not await signIn.
    navigate(redirect);
    // Fire-and-forget: signIn completes asynchronously.
    signIn("anonymous").catch((err) => {
      console.error("Guest sign-in failed (background):", err);
    });
  };

  const toggleAuthMode = () => {
    setAuthMode((m) => (m === "signin" ? "signup" : "signin"));
    setError(null);
  };

  return (
    <div className="relative min-h-screen">
      <GlassBackdrop />
      <BeeTutorial />

      {/* Auth Content */}
      <div className="flex min-h-screen flex-1 items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-md flex-col items-center">
          <button onClick={() => navigate("/")} aria-label="Back to home">
            <GlassMedBrand size="lg" />
          </button>

          <Card className="glass-strong shine mt-8 w-full rounded-3xl border-0 pb-0 shadow-none">
            {step === "signIn" ? (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-extrabold tracking-tight text-wistaria">
                    {authMode === "signin" ? "Welcome Back" : "Create Account"}
                  </CardTitle>
                  <CardDescription>
                    {authMode === "signin"
                      ? "Enter your email and we'll send you a magic code to sign in."
                      : "Enter your email to get started — we'll send you a magic code."}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          className="pl-9"
                          disabled={isLoading}
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(null); }}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        size="icon"
                        disabled={isLoading}
                        aria-label="Send code"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}

                    {/* Sign-in / Sign-up toggle */}
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      {authMode === "signin" ? (
                        <>
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={toggleAuthMode}
                            className="font-semibold text-wistaria underline-offset-2 hover:underline"
                          >
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={toggleAuthMode}
                            className="font-semibold text-wistaria underline-offset-2 hover:underline"
                          >
                            Sign in
                          </button>
                        </>
                      )}
                    </p>

                    <div className="mt-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="glass-chip rounded-full px-2 text-muted-foreground">
                            Or
                          </span>
                        </div>
                      </div>

                      {/* Guest note */}
                      <p className="mt-3 text-center text-[11px] text-muted-foreground/70">
                        As a guest, your progress and data will not be saved.
                      </p>

                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2 w-full active:scale-[0.97] active:bg-wistaria/10 transition-transform duration-100"
                        onClick={handleGuestLogin}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Continue as Guest
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="mt-4 text-center">
                  <CardTitle className="text-2xl font-extrabold tracking-tight text-wistaria">
                    Check your email
                  </CardTitle>
                  <CardDescription>
                    We've sent a 6-digit code to {step.email}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="pb-4">
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />

                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                            const form = (e.target as HTMLElement).closest("form");
                            if (form) form.requestSubmit();
                          }
                        }}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && (
                      <p className="mt-2 text-center text-sm text-red-500">
                        {error}
                      </p>
                    )}
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Didn't receive a code?{" "}
                      <Button
                        variant="link"
                        className="h-auto p-0 font-semibold"
                        onClick={handleResend}
                        disabled={cooldownLeft > 0 || isLoading}
                      >
                        {isLoading
                          ? "Sending…"
                          : cooldownLeft > 0
                            ? `Resend in 0:${String(cooldownLeft).padStart(2, "0")}`
                            : "Resend code"}
                      </Button>
                      {resentNote && !error && (
                        <span className="text-cloud"> · Fresh code sent ✉️</span>
                      )}
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify code
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => { setStep("signIn"); setError(null); }}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Use different email
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}

            <div className="rounded-b-3xl border-t border-white/10 bg-white/5 px-6 py-4 text-center text-xs text-muted-foreground backdrop-blur">
              By continuing, you agree to our{" "}
              <span className="font-semibold text-foreground/80">Terms of Service</span>{" "}
              and{" "}
              <span className="font-semibold text-foreground/80">Privacy Policy</span>.
              <br />
              <span className="mt-1 inline-block text-[10px] opacity-70">
                We only save your study progress and flashcard data. We do not sell your data.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
