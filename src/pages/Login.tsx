import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Server,
  KeyRound,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Modal } from '@/components/ui';

interface LoginPageProps {
  onLoginSuccess?: (email: string, roleName: string) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('sourabh@jobrisers.com');
  const [password, setPassword] = useState('Admin@JobRisers2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!email.trim()) {
      setErrorMessage('Please enter your administrative corporate email.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid work email address (e.g. name@jobrisers.com).');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your administrative console password.');
      return;
    }

    setIsLoading(true);

    // Simulated authenticating state
    setTimeout(() => {
      setIsLoading(false);
      // Valid mock credentials check
      const lower = email.toLowerCase().trim();
      let matchedRole = 'Operations Admin';
      if (lower.includes('sourabh') || lower.includes('super')) {
        matchedRole = 'Super Admin';
      } else if (lower.includes('support')) {
        matchedRole = 'Support Agent';
      } else if (lower.includes('analyst')) {
        matchedRole = 'Analyst';
      }

      localStorage.setItem('jobrisers_admin_auth', 'true');
      localStorage.setItem('jobrisers_admin_email', email);
      localStorage.setItem('jobrisers_admin_role', matchedRole);

      if (onLoginSuccess) {
        onLoginSuccess(email, matchedRole);
      }
      navigate('/admin/dashboard');
    }, 600);
  };

  const handleQuickFill = (demoEmail: string, _roleTitle: string) => {
    setEmail(demoEmail);
    setPassword(demoEmail.startsWith('operations') ? 'OpsAdmin@JobRisers2026!' : 'Admin@JobRisers2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <span className="font-display text-xl font-extrabold">J</span>
          </div>
          <div>
            <div className="font-display text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>jobrisers</span>
              <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-primary/20 text-primary-foreground/90 border border-primary/30 uppercase">
                Admin
              </span>
            </div>
            <div className="text-[9px] font-bold tracking-[.18em] text-slate-400">
              OPERATIONS CONSOLE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-800/60 border border-slate-700/60 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Console v2.4 (Active)
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-8">
        <div className="relative rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -left-12 -z-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 -z-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-inner">
              <Lock size={22} className="text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-[26px]">
              Admin Console Sign In
            </h1>
            <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
              Authorized access portal for JobRisers marketplace governance & operations staff.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              data-testid="login-error-banner"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-in fade-in duration-200"
            >
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="admin-email"
                  type="email"
                  required
                  data-testid="input-admin-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="admin.name@jobrisers.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Console Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-primary hover:text-primary-foreground transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  data-testid="input-admin-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your security passphrase"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me & MFA note */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-primary accent-primary focus:ring-0"
                />
                <span>Remember this workstation</span>
              </label>
              <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={12} />
                MFA Enforced
              </span>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              data-testid="btn-admin-signin"
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Credentials & Session…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Demo Quick-Fill Personas</span>
              <span className="text-primary font-normal">Mock Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('sourabh@jobrisers.com', 'Super Admin')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/50 p-2 text-left hover:bg-slate-700/50 transition-colors text-slate-200"
              >
                <div className="h-6 w-6 rounded-md bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                  SA
                </div>
                <div className="truncate">
                  <div className="font-semibold leading-tight">Super Admin</div>
                  <div className="text-[9px] text-slate-400">Sourabh J.</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('operations@jobrisers.com', 'Operations Admin')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/50 p-2 text-left hover:bg-slate-700/50 transition-colors text-slate-200"
              >
                <div className="h-6 w-6 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                  OA
                </div>
                <div className="truncate">
                  <div className="font-semibold leading-tight">Operations</div>
                  <div className="text-[9px] text-slate-400">Platform Ops</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Warning Footnote */}
        <div className="mt-5 text-center space-y-1.5 text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-1.5 font-medium text-slate-300">
            <Shield size={13} className="text-primary" />
            <span>DPDP Act 2023 Compliant · Administrative Audit Active</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500 max-w-sm mx-auto">
            All console access attempts are geolocated and recorded in the immutable security audit log. Unauthorized tampering is strictly prohibited under Indian IT Act 2000.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-3 border-t border-slate-800 text-[11px] text-slate-500">
        <div>&copy; 2026 JobRisers Technologies Pvt. Ltd. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>Security Operations Center</span>
          <span>&bull;</span>
          <span>Helpdesk Hotline: +91 80 4000 8920</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsForgotModalOpen(false)}
          eyebrow="SECURITY PROTOCOL · CREDENTIAL RECOVERY"
          title="Administrative Password Recovery"
          maxWidth="max-w-[460px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                Understood
              </button>
            </div>
          }
        >
          <div className="space-y-3.5 py-1 text-xs text-foreground">
            <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-3.5 text-amber-900 text-xs space-y-2 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                <KeyRound size={16} className="text-amber-600 shrink-0" />
                Dual-Authorization Recovery Required
              </div>
              <p className="leading-relaxed">
                Self-service administrative password resets are disabled per JobRisers Information Security Policy §4.2 and DPDP Act 2023 guidelines.
              </p>
            </div>

            <div className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
              <p>To request credential reissuance or hardware token resynchronization:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contact the <strong>Super Administrator</strong> directly or email <code className="text-foreground">security@jobrisers.com</code>.</li>
                <li>Provide your employee ID, official government photo ID, and verified mobile OTP.</li>
                <li>Your request will be validated through out-of-band video verification before access is unlocked.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
