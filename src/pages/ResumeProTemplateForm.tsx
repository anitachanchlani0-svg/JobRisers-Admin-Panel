import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { initialAdminResumeTemplates, type AdminResumeTemplate } from '@/mock-data';

export function ResumeProTemplateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';

  const existing = useMemo(() => {
    if (isNew) return null;
    return initialAdminResumeTemplates.find((t) => t.id === id) || null;
  }, [id, isNew]);

  const [form, setForm] = useState<Partial<AdminResumeTemplate>>(() => {
    if (existing) {
      return { ...existing };
    }
    return {
      name: '',
      version: 'v1.0',
      tier: 'Standard',
      atsValidated: false,
      status: 'Published',
      displayOrder: 6,
      description: '',
      layout: 'single-column',
      thumbnailBadge: 'Standard',
      isRestricted: false,
      tags: ['Modern'],
    };
  });

  const [toast, setToast] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      alert('Template Name is required.');
      return;
    }

    if (existing) {
      Object.assign(existing, {
        ...form,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      const newTemplate: AdminResumeTemplate = {
        id: `tpl-${Date.now()}`,
        name: form.name.trim(),
        version: form.version || 'v1.0',
        tier: form.tier || 'Standard',
        atsValidated: !!form.atsValidated,
        status: form.status || 'Published',
        displayOrder: form.displayOrder || 1,
        description: form.description || '',
        layout: form.layout || 'single-column',
        thumbnailBadge: form.tier || 'Standard',
        isRestricted: !!form.isRestricted,
        tags: form.tags && form.tags.length > 0 ? form.tags : ['General'],
        downloadsCount: 0,
        activeUsersCount: 0,
        atsCompatibilityScore: form.atsValidated ? 98 : 82,
        recommendedForRoles: ['Software Engineering', 'Product Management'],
        primaryFontFamily: 'Inter',
        colorSchemesCount: 4,
      };
      initialAdminResumeTemplates.unshift(newTemplate);
    }

    setToast(isNew ? `Template "${form.name}" created successfully.` : `Template "${form.name}" updated successfully.`);
    setTimeout(() => {
      navigate('/admin/resume-pro');
    }, 900);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = form.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...currentTags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setForm({ ...form, tags: (form.tags || []).filter((t) => t !== tag) });
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
                RESUME PRO &bull; {isNew ? 'NEW TEMPLATE' : 'TEMPLATE EDITOR'}
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; PRO-1 / PRO-2</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {isNew ? 'Create Resume Template' : `Edit Template: ${form.name}`}
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
            <span>{isNew ? 'Create Template' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <Layers size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Core Template Specifications</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Template Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Executive Modern"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Version Release Tag <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.version || ''}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="e.g. v2.4"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Access Tier</label>
              <select
                value={form.tier || 'Standard'}
                onChange={(e) => setForm({ ...form, tier: e.target.value as any, thumbnailBadge: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Standard">Standard (Free)</option>
                <option value="ATS Pro">ATS Pro</option>
                <option value="Pro">Pro Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Layout Structure</label>
              <select
                value={form.layout || 'single-column'}
                onChange={(e) => setForm({ ...form, layout: e.target.value as any })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              >
                <option value="single-column">Single Column (Standard)</option>
                <option value="two-column-sidebar">Two Column Sidebar</option>
                <option value="dense-grid">Dense Engineering Grid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Catalogue Display Order</label>
              <input
                type="number"
                min={1}
                max={99}
                value={form.displayOrder || 1}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Short Description</label>
            <textarea
              rows={3}
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Highlight typographic tone, recommended seniorities, and industry fits..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Taxonomy Tags</label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {(form.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-semibold text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag (e.g. Modern, Tech, Executive) and press Enter"
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none flex-1"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* ATS & Visibility Governance Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <ShieldCheck size={18} className="text-emerald-500" />
            <h2 className="text-sm font-bold text-foreground">ATS Certification & Catalogue Visibility</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">ATS Validated Engine</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Display verified ATS parser pass badge in candidate builder.
                </p>
              </div>
              <input
                type="checkbox"
                checked={!!form.atsValidated}
                onChange={(e) => setForm({ ...form, atsValidated: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground">Catalog Publication Status</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Controls candidate accessibility in the template picker.
                </p>
              </div>
              <select
                value={form.status || 'Published'}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold focus:outline-none"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
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
            <span>{isNew ? 'Create Template' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
