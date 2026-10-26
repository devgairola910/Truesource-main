"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { useFirebaseAuth } from "@/lib/hooks/use-firebase-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type LoginFormProps = {
  requestedRedirect: string | null;
};

export function LoginForm({ requestedRedirect }: LoginFormProps) {
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, user, error: authError } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      router.replace(requestedRedirect || "/dashboard");
    }
  }, [router, user, requestedRedirect]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      await loginWithEmail(email, password);
      // Success will trigger the useEffect above
    } catch (error: any) {
      setStatus("error");
      setFeedback(error.message || "Invalid email or password.");
    }
  }

  async function handleGoogleLogin() {
    setStatus("loading");
    setFeedback("");

    try {
      await loginWithGoogle();
      // Code will stop here as the page redirects or popup resolves.
    } catch (error: any) {
      setStatus("error");
      setFeedback(error.message || "Unable to log in with Google.");
    }
  }

  return (
    <div className="space-y-6" aria-label="Login options">
      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)] transition-all"
            placeholder="name@company.com"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="password">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-[var(--brand)] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)] transition-all"
            placeholder="••••••••"
            required
            disabled={status === "loading"}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--stroke)]"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--surface-2)] px-2 text-[var(--text-soft)]">Or continue with</span>
        </div>
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={status === "loading"}
        className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
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
        <span>Google</span>
      </button>

      {feedback && (
        <p className="text-xs text-[var(--danger)] bg-[var(--danger-surface)] p-3 rounded-lg border border-[var(--danger)]/20 text-center">
          {feedback}
        </p>
      )}

      <div className="text-center space-y-2 pt-4 border-t border-[var(--stroke)]">
        <p className="text-sm text-[var(--text-muted)]">
          New to Truesource?
          <Link href="/signup" className="ml-1.5 font-semibold text-[var(--brand)] hover:opacity-80 transition-opacity">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
