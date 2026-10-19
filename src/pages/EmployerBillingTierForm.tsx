import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  CreditCard,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { adminEmployerPlans, type EmployerPlanTier } from '@/mock-data';

export function EmployerBillingTierFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const existing = useMemo(() => {
    return adminEmployerPlans.find((p) => p.id === id) || adminEmployerPlans[0];
  }, [id]);

  const [form, setForm] = useState<EmployerPlanTier>(() => {
    return {
      ...existing,
      features: { ...existing.features },
    };
  });

  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Plan Name is required.');
      return;
    }

    const target = adminEmployerPlans.find((p) => p.id === form.id);
    if (target) {
      Object.assign(target, form);
    }

    setToast(`Employer Tier "${form.name}" updated successfully.`);
    setTimeout(() => {
      navigate('/admin/employer-billing');
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
                EMPLOYER BILLING &bull; TIER CONFIGURATION
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; BIL-1</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Edit Employer Pricing Tier: {form.name}
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
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Save size={14} />
            <span>Save Tier Changes</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Pricing & Name */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <Building2 size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Plan Identifiers & Pricing (INR)</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Monthly Price (INR ₹)
              </label>
              <input
                type="number"
                min={0}
                value={form.priceMonthly}
                onChange={(e) => setForm({ ...form, priceMonthly: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Annual Price (INR ₹)
              </label>
              <input
                type="number"
                min={0}
                value={form.priceAnnual}
                onChange={(e) => setForm({ ...form, priceAnnual: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Active Job Post Quota
              </label>
              <input
                type="number"
                min={0}
                value={form.features.jobPostLimit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: {
                      ...form.features,
                      jobPostLimit: Number(e.target.value),
                    },
                  })
                }
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Featured Spotlight Credits Included
              </label>
              <input
                type="number"
                min={0}
                value={form.features.featuredJobCredits}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: {
                      ...form.features,
                      featuredJobCredits: Number(e.target.value),
                    },
                  })
                }
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Support Service Level Agreement (SLA) String
            </label>
            <input
              type="text"
              value={form.features.supportSla}
              onChange={(e) =>
                setForm({
                  ...form,
                  features: {
                    ...form.features,
                    supportSla: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Tier Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'Active' | 'Grandfathered' })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              <option value="Active">Active (Available for Employer Selection)</option>
              <option value="Grandfathered">Grandfathered (Legacy Accounts Only)</option>
            </select>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Advanced Recruiter Tool Access</h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">Talent Network Direct Sourcing Search</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Allows recruiters to proactively discover and contact candidates outside active job listings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.features.talentSearchAccess}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: {
                      ...form.features,
                      talentSearchAccess: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">Company Branding Customizations</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Custom cover banners, culture highlights, and video links on employer company profile pages.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.features.customBranding}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: {
                      ...form.features,
                      customBranding: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">ATS Webhook & Sync Integration</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Real-time webhook events and two-way applicant tracking synchronization.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.features.atsIntegration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    features: {
                      ...form.features,
                      atsIntegration: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>
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
            <Save size={15} />
            <span>Save Tier Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
