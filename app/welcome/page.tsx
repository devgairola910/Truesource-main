import { ProtectedPage } from "@/components/auth/protected-page";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <ProtectedPage>
      <div className="max-w-xl mx-auto space-y-4 py-4 min-h-[calc(100vh-var(--topbar-height))] flex flex-col justify-center">
        <section className="reveal-up text-center space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
            Welcome to Truesource
          </p>
          <h2 className="font-heading text-2xl font-bold text-[var(--text-strong)]">
            Secure Your Account
          </h2>
          <p className="max-w-md mx-auto text-sm leading-6 text-[var(--text-muted)]">
            Set a password to enable email login and additional security features.
          </p>
        </section>

        <div className="reveal-up scale-95 origin-top">
          <SetPasswordForm />
        </div>
      </div>
    </ProtectedPage>
  );
}
