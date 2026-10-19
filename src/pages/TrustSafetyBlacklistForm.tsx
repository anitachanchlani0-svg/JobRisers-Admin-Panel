import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Filter,
} from 'lucide-react';
import { initialAdminBlacklistRules, type AdminBlacklistRule } from '@/mock-data';

export function TrustSafetyBlacklistFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';

  const existing = useMemo(() => {
    if (isNew) return null;
    return initialAdminBlacklistRules.find((r) => r.id === id) || null;
  }, [id, isNew]);

  const [form, setForm] = useState<{
    pattern: string;
    category: 'Email Domains' | 'VoIP Numbers' | 'IP/CIDR' | 'Scam Companies' | 'Keywords';
    matchType: 'Exact' | 'Wildcard' | 'Regex' | 'Fuzzy';
    enforcementScope: Array<'Candidate signup' | 'Employer signup' | 'Job posting' | 'Messaging' | 'All surfaces'>;
    reason: string;
    status: 'Active' | 'Inactive';
  }>(() => {
    if (existing) {
      return {
        pattern: existing.pattern,
        category: existing.category,
        matchType: existing.matchType,
        enforcementScope: [...existing.enforcementScope],
        reason: existing.reason,
        status: existing.status,
      };
    }
    return {
      pattern: '',
      category: 'Email Domains',
      matchType: 'Wildcard',
      enforcementScope: ['Candidate signup', 'Employer signup'],
      reason: '',
      status: 'Active',
    };
  });

  const [toast, setToast] = useState<string | null>(null);

  const toggleScope = (scope: 'Candidate signup' | 'Employer signup' | 'Job posting' | 'Messaging' | 'All surfaces') => {
    if (scope === 'All surfaces') {
      if (form.enforcementScope.includes('All surfaces')) {
        setForm({ ...form, enforcementScope: ['Candidate signup', 'Employer signup'] });
      } else {
        setForm({ ...form, enforcementScope: ['All surfaces'] });
      }
      return;
    }

    const withoutAll = form.enforcementScope.filter((s) => s !== 'All surfaces');
    if (withoutAll.includes(scope)) {
      setForm({ ...form, enforcementScope: withoutAll.filter((s) => s !== scope) });
    } else {
      setForm({ ...form, enforcementScope: [...withoutAll, scope] });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pattern.trim()) {
      alert('Pattern / Value is required.');
      return;
    }
    if (!form.reason.trim()) {
      alert('Please provide a reason note for platform security records.');
      return;
    }

    if (existing) {
      Object.assign(existing, {
        ...form,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      const newRule: AdminBlacklistRule = {
        id: `blr-${Date.now()}`,
        pattern: form.pattern.trim(),
        category: form.category,
        matchType: form.matchType,
        enforcementScope: form.enforcementScope.length > 0 ? form.enforcementScope : ['All surfaces'],
        reason: form.reason.trim(),
        addedBy: 'Admin Maya (T&S Moderator)',
        addedDate: new Date().toISOString().split('T')[0],
        hitCount: 0,
        status: form.status,
      };
      initialAdminBlacklistRules.unshift(newRule);
    }

    setToast(isNew ? `Blacklist rule "${form.pattern}" activated.` : `Blacklist rule "${form.pattern}" updated.`);
    setTimeout(() => {
      navigate('/admin/trust-safety');
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
            onClick={() => navigate('/admin/trust-safety')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Return to Trust & Safety"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                TRUST & SAFETY &bull; {isNew ? 'NEW BLACKLIST RESTRICTION' : 'EDIT RULE'}
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; TNS-2 / TNS-8</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {isNew ? 'Add Blacklist Rule' : `Edit Rule: ${form.pattern}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/admin/trust-safety')}
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
            <span>{isNew ? 'Activate Rule' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <ShieldAlert size={18} className="text-rose-600 dark:text-rose-400" />
            <h2 className="text-sm font-bold text-foreground">Pattern & Scope Definition</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Pattern / Value <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.pattern}
              onChange={(e) => setForm({ ...form, pattern: e.target.value })}
              placeholder="e.g. @burnermail.com or 192.168.0.0/16 or scam company name"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Email Domains">Email Domains</option>
                <option value="VoIP Numbers">VoIP Numbers</option>
                <option value="IP/CIDR">IP/CIDR Network Blocks</option>
                <option value="Scam Companies">Scam Companies</option>
                <option value="Keywords">Prohibited Keywords</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Match Algorithm</label>
              <select
                value={form.matchType}
                onChange={(e) => setForm({ ...form, matchType: e.target.value as any })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Wildcard">Wildcard (*.domain.com)</option>
                <option value="Exact">Exact Match</option>
                <option value="Regex">Regex Pattern</option>
                <option value="Fuzzy">Fuzzy Match (Levenshtein &gt; 85%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Enforcement Scope</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['Candidate signup', 'Employer signup', 'Job posting', 'Messaging', 'All surfaces'] as const).map(
                (scope) => (
                  <label
                    key={scope}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background hover:bg-muted/40 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={form.enforcementScope.includes(scope)}
                      onChange={() => toggleScope(scope)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="font-semibold text-foreground">{scope}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Enforcement Reason & Threat Model <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Disposable temporary email provider commonly associated with automated bot signups..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Rule Activation State</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
            >
              <option value="Active">Active (Real-time Filtering Enforced)</option>
              <option value="Inactive">Inactive (Suspended Rule)</option>
            </select>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/trust-safety')}
            className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Save size={15} />
            <span>{isNew ? 'Activate Rule' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
