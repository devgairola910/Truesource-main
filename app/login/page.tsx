import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--brand)] opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--brand)] opacity-10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 z-10 reveal-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--surface-2)] border border-[var(--stroke)] shadow-sm mb-6">
            <svg
              className="w-8 h-8 text-[var(--brand)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-2 text-3xl font-heading font-bold tracking-tight text-[var(--text-strong)]">
            Welcome back
          </h2>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Sign in to access your secure integrity workspace
          </p>
        </div>

        <div className="bg-[var(--surface-1)]/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-[var(--stroke)]">
          <LoginForm requestedRedirect={redirect ?? null} />
        </div>
      </div>
    </div>
  );
}
