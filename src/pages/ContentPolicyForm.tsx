import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Save,
  CheckCircle2,
  Check,
  AlertTriangle,
  History,
  Clock,
} from 'lucide-react';
import { initialAdminStaticPolicies, type AdminStaticPolicy } from '@/mock-data';

export function ContentPolicyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingPolicy = !isNew ? initialAdminStaticPolicies.find((p) => p.id === id) : null;

  const [title, setTitle] = useState(existingPolicy?.title || '');
  const [slug, setSlug] = useState(existingPolicy?.slug || '');
  const [version, setVersion] = useState(existingPolicy?.version || 'v1.0');
  const [complianceTag, setComplianceTag] = useState(existingPolicy?.complianceTag || 'DPDP Act 2023');
  const [effectiveDate, setEffectiveDate] = useState(existingPolicy?.effectiveDate || new Date().toISOString().split('T')[0]);
  const [mandatoryReconsent, setMandatoryReconsent] = useState(existingPolicy?.mandatoryReconsent ?? false);
  const [status, setStatus] = useState<AdminStaticPolicy['status']>(existingPolicy?.status || 'Published');
  const [content, setContent] = useState(existingPolicy?.content || '# Policy Content\n\nTerms and conditions...');
  const [changelogNotes, setChangelogNotes] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (isNew || !existingPolicy) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const today = new Date().toISOString().split('T')[0];

    if (isNew) {
      const newPolicy: AdminStaticPolicy = {
        id: `pol-${Date.now()}`,
        title: title.trim(),
        slug: slug.trim(),
        version: version.trim() || 'v1.0',
        complianceTag: complianceTag.trim(),
        effectiveDate,
        lastUpdated: today,
        mandatoryReconsent,
        status,
        content: content.trim(),
        changelog: [
          {
            version: version.trim() || 'v1.0',
            date: today,
            publisher: 'Sourabh Jhajharia (Super Admin)',
            notes: changelogNotes.trim() || 'Initial policy formulation.',
          },
        ],
      };
      initialAdminStaticPolicies.unshift(newPolicy);
    } else if (existingPolicy) {
      const isVersionBump = existingPolicy.version !== version;
      existingPolicy.title = title.trim();
      existingPolicy.slug = slug.trim();
      existingPolicy.version = version.trim();
      existingPolicy.complianceTag = complianceTag.trim();
      existingPolicy.effectiveDate = effectiveDate;
      existingPolicy.lastUpdated = today;
      existingPolicy.mandatoryReconsent = mandatoryReconsent;
      existingPolicy.status = status;
      existingPolicy.content = content.trim();

      if (changelogNotes.trim() || isVersionBump) {
        existingPolicy.changelog.unshift({
          version: version.trim(),
          date: today,
          publisher: 'Sourabh Jhajharia (Super Admin)',
          notes: changelogNotes.trim() || `Administrative update to version ${version}.`,
        });
      }
    }

    navigate('/admin/content');
  };

  if (!isNew && !existingPolicy) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/content"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Content CMS
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Policy Page Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No policy record matching identifier "{id}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/content"
          data-testid="link-back-to-content"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Content CMS & Policies
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            {isNew ? 'New Policy Draft' : `Policy Ref: ${existingPolicy?.id}`}
          </span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted border border-border">
            {version}
          </span>
        </div>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Add Legal Policy Page (CMS-3)' : `Edit Legal Policy · ${existingPolicy?.title} (CMS-3)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Maintain legally compliant terms of service, privacy charters, version histories, and re-consent obligations.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Editor */}
        <div className="lg:col-span-2 space-y-5">
          <form id="policy-form" onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Policy Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Terms of Service & Candidate Charter"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Route Slug Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. terms"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Compliance Tag / Framework
                  </label>
                  <input
                    type="text"
                    value={complianceTag}
                    onChange={(e) => setComplianceTag(e.target.value)}
                    placeholder="e.g. DPDP Act 2023 / GDPR"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Policy Legal Terms & Clauses (Markdown Supported) *
                </label>
                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft policy clauses in Markdown..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Revision / Changelog Note */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History size={14} className="text-primary" />
                Version Audit Log Note
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Document reason for this revision in the legal compliance registry:
              </p>
              <textarea
                rows={2}
                value={changelogNotes}
                onChange={(e) => setChangelogNotes(e.target.value)}
                placeholder="e.g. Updated data retention clause per DPDP Act notification..."
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </form>
        </div>

        {/* Right Col: Version Control & Consent Enforcers */}
        <div className="space-y-5 text-xs">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Version Governance
            </h2>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Version Identifier (SemVer)
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. v2.1"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Effective Enforcement Date
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Published">Published (Active Law)</option>
                <option value="Draft">Draft Review</option>
                <option value="Archived">Archived Historical</option>
              </select>
            </div>

            <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 space-y-2">
              <label className="flex items-start gap-2 cursor-pointer font-bold text-amber-900 text-xs">
                <input
                  type="checkbox"
                  checked={mandatoryReconsent}
                  onChange={(e) => setMandatoryReconsent(e.target.checked)}
                  className="rounded border-amber-400 text-primary focus:ring-primary h-4 w-4 mt-0.5"
                />
                <span>Mandate Re-Consent On Next Login (AUTH-8)</span>
              </label>
              <p className="text-[10px] text-amber-800 leading-relaxed">
                When checked, every registered candidate and employer must explicitly acknowledge this version before proceeding past the security gateway.
              </p>
            </div>

            {existingPolicy && existingPolicy.changelog.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2">
                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-between">
                  <span>Revision History</span>
                  <span>{existingPolicy.changelog.length} revisions</span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {existingPolicy.changelog.map((log, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-muted/30 text-[10px] border border-border/60">
                      <div className="flex items-center justify-between font-mono font-bold text-foreground">
                        <span>{log.version}</span>
                        <span className="text-muted-foreground font-normal">{log.date}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 line-clamp-1">{log.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/admin/content')}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="policy-form"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 flex items-center gap-1.5"
              >
                <Save size={14} />
                Save Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
