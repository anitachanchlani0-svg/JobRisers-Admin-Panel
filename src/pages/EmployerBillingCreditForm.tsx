import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Gift,
  Building2,
  Sparkles,
} from 'lucide-react';
import { adminBillingCredits, type EmployerBillingCreditEntry } from '@/mock-data';

export function EmployerBillingCreditFormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: 'Northstar Labs',
    creditType: 'Job Posting' as 'Job Posting' | 'Featured Spotlight' | 'Promotional Waiver' | 'System Compensation',
    amountOrCredits: '1 Job Post',
    reason: 'Customer goodwill credit',
  });

  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reason.trim()) {
      alert('Please provide a casework justification for issuing this credit.');
      return;
    }

    const newEntry: EmployerBillingCreditEntry = {
      id: `CRD-${Date.now().toString().slice(-4)}`,
      companyName: form.companyName,
      creditType: form.creditType as any,
      amountOrCredits: form.amountOrCredits,
      issuedDate: new Date().toISOString().split('T')[0],
      expiresDate: '2026-12-31',
      status: 'Active',
      reason: form.reason.trim(),
    };

    adminBillingCredits.unshift(newEntry);
    setToast(`Credit of ${form.amountOrCredits} allocated to ${form.companyName}.`);
    setTimeout(() => {
      navigate('/admin/employer-billing');
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3.5 shadow-2xl text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/employer-billing')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Return to Employer Billing"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                EMPLOYER BILLING &bull; CREDIT ADJUSTMENT
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; BIL-4</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Issue Employer Goodwill Credit
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/admin/employer-billing')}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Gift size={14} />
            <span>Issue Credit</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <Gift size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Credit Allocation Parameters</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Select Employer Account <span className="text-rose-500">*</span>
            </label>
            <select
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              <option value="Northstar Labs">Northstar Labs (Tech / Enterprise)</option>
              <option value="Cloudframe">Cloudframe (SaaS / Growth)</option>
              <option value="Pioneer Talent">Pioneer Talent (Staffing Partner)</option>
              <option value="Zenith HealthTech">Zenith HealthTech (Healthcare AI)</option>
              <option value="BrightPath Careers">BrightPath Careers (Recruiting)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Credit Classification</label>
              <select
                value={form.creditType}
                onChange={(e) => setForm({ ...form, creditType: e.target.value as any })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Job Posting">Job Posting Slot</option>
                <option value="Featured Spotlight">Featured Spotlight Credit</option>
                <option value="Promotional Waiver">Promotional Fee Waiver</option>
                <option value="System Compensation">System Outage Compensation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Credit Value / Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.amountOrCredits}
                onChange={(e) => setForm({ ...form, amountOrCredits: e.target.value })}
                placeholder="e.g. 1 Job Post or ₹5,000 INR"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Casework Justification & Audit Note <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Compensation for temporary webhook notification outage on support ticket JR-8821..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/employer-billing')}
            className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Gift size={15} />
            <span>Issue Credit Now</span>
          </button>
        </div>
      </form>
    </div>
  );
}
