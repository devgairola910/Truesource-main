"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession } from "@/lib/auth-client";
import { useFirebaseAuth } from "@/lib/hooks/use-firebase-auth";
import Link from "next/link";

export function SignupForm() {
  const router = useRouter();
  const { loginWithGoogle, user, error: authError } = useFirebaseAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (authError) {
      setStatus("error");
      setFeedback(authError.message || "Failed to sign in with Google.");
    }
  }, [authError]);

  useEffect(() => {
    if (getSession() || user) {
      router.replace("/welcome");
    }
  }, [router, user]);

  async function handleGoogleSignup() {
    setStatus("loading");
    setFeedback("");

    try {
      await loginWithGoogle();
      // Code will stop here as the page redirects.
    } catch (error: any) {
      setStatus("error");
      setFeedback(error.message || "Could not create account with Google.");
    }
  }

  return (
    <div className="space-y-6" aria-label="Sign up options">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={status === "loading"}
          className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          ) : (
            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
          )}
          <span className="font-medium">{status === "loading" ? "Creating account..." : "Continue with Google"}</span>
        </button>
        {feedback ? <p className="text-sm font-medium text-[var(--danger)] text-center bg-[var(--danger)]/10 py-2 rounded-xl border border-[var(--danger)]/20">{feedback}</p> : null}
      </div>

      <div className="text-center space-y-2 pt-4 border-t border-[var(--stroke)]">
        <p className="text-sm text-[var(--text-muted)]">
          Already have an account?
          <Link href="/login" className="ml-1.5 font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
