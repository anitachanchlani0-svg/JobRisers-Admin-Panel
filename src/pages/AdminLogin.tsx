import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@jobrisers.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 350);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="font-display text-xl font-extrabold">J</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-[18px] font-extrabold tracking-[-.04em] text-foreground">jobrisers</div>
            <div className="mt-0.5 text-[9px] font-bold tracking-[.18em] text-muted-foreground">ADMIN CONSOLE</div>
          </div>
        </div>
        <a
          href="/"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span>User Website</span>
          <ArrowRight size={14} />
        </a>
      </header>

      {/* Main Login Card */}
      <main className="flex items-center justify-center py-8">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                <LockKeyhole size={22} />
              </div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Sign in to Admin Console
              </h1>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Enter your administrative credentials to manage marketplace operations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@jobrisers.com"
                    className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[11px] font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <span>Signing in…</span>
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Demo Admin Access</span>
                <p className="mt-0.5 text-[10px] leading-relaxed">
                  Default credentials are provided. Click <strong>Sign in to Dashboard</strong> to proceed directly into the Admin Console.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground/80 py-2">
        <p>© {new Date().getFullYear()} JobRisers. Internal marketplace administration system.</p>
      </footer>
    </div>
  );
}
