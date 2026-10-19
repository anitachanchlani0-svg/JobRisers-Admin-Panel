import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { initialAdminCandidatePlanTiers, type AdminCandidatePlanTier } from '@/mock-data';

export function ResumeProPlanFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const existing = useMemo(() => {
    return initialAdminCandidatePlanTiers.find((p) => p.id === id) || null;
  }, [id]);

  const [form, setForm] = useState<AdminCandidatePlanTier>(() => {
    if (existing) {
      return { ...existing };
    }
    return {
      id: id || 'plan-custom',
      name: 'Custom Plan',
      badgeTone: 'bg-primary/10 text-primary border-primary/20',
      priceUsdMonthly: 12.0,
      priceUsdAnnual: 96.0,
      priceInrMonthly: 999,
      trialDays: 7,
      status: 'Active',
      hasMoneyBackGuarantee: true,
      recruiterIndexingEntitlement: true,
      entitlements: {
        unlimitedAtsResumes: true,
        aiBulletEnhancer: true,
        priorityRecruiterIndexing: true,
        exportWithoutWatermark: true,
        coverLetterGenerator: true,
        realtimeMatchAnalysis: true,
      },
      activeSubscribersCount: 0,
      annualDiscountPercent: 33,
    };
  });

  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Plan Name is required.');
      return;
    }

    if (existing) {
      Object.assign(existing, { ...form });
    } else {
      initialAdminCandidatePlanTiers.push({ ...form });
    }

    setToast(`Plan "${form.name}" updated successfully.`);
    setTimeout(() => {
      navigate('/admin/resume-pro');
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3.5 shadow-2xl text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground">{toast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/resume-pro')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Return to Resume Pro"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                RESUME PRO &bull; PLAN CONFIGURATION
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; PRO-3 / PRO-8</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Edit Subscription Plan: {form.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/admin/resume-pro')}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Save size={14} />
            <span>Save Plan Changes</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Pricing Parameters */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <CreditCard size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Pricing & Commercial Parameters</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Plan Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Monthly Price (USD $)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={form.priceUsdMonthly}
                onChange={(e) => setForm({ ...form, priceUsdMonthly: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Annual Price (USD $)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={form.priceUsdAnnual}
                onChange={(e) => setForm({ ...form, priceUsdAnnual: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Monthly Price (INR ₹)
              </label>
              <input
                type="number"
                min={0}
                value={form.priceInrMonthly}
                onChange={(e) => setForm({ ...form, priceInrMonthly: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Free Trial Duration (Days)
              </label>
              <input
                type="number"
                min={0}
                value={form.trialDays}
                onChange={(e) => setForm({ ...form, trialDays: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Plan Availability Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Active">Active (Publicly Purchasable)</option>
                <option value="Draft">Draft (Internal Sandbox)</option>
                <option value="Archived">Archived (Grandfathered)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guarantees & Entitlements Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h2 className="text-sm font-bold text-foreground">Buyer Protection & Search Boost Entitlements</h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">7-Day Money-Back Guarantee (PRO-5)</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Allows candidates to request automated self-service refund within 7 days of initial charge.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.hasMoneyBackGuarantee}
                onChange={(e) => setForm({ ...form, hasMoneyBackGuarantee: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">Priority Recruiter Indexing Spotlight (PRO-17)</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Grants subscribers top-tier placement in employer search queries and talent discovery algorithms.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.recruiterIndexingEntitlement}
                onChange={(e) => setForm({ ...form, recruiterIndexingEntitlement: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Feature Matrix Checkboxes */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Included Feature Flags</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(form.entitlements).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                <span className="font-semibold text-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <input
                  type="checkbox"
                  checked={val}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      entitlements: {
                        ...form.entitlements,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/resume-pro')}
            className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Save size={15} />
            <span>Save Plan Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
