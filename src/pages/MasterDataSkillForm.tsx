import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  Tag,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { adminSkills, type AdminSkill } from '@/mock-data';

export function MasterDataSkillFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingSkill = !isNew ? adminSkills.find((s) => s.id === id) : null;

  const [name, setName] = useState(existingSkill?.name || '');
  const [aliases, setAliases] = useState<string[]>(existingSkill?.aliases || []);
  const [aliasInput, setAliasInput] = useState('');
  const [status, setStatus] = useState<'Approved' | 'Suggested'>(existingSkill?.status || 'Approved');
  const [usageCount, setUsageCount] = useState(existingSkill?.usageCount ?? 0);
  const [suggestedBy, setSuggestedBy] = useState(existingSkill?.suggestedBy || '');
  const [suggestedAt, setSuggestedAt] = useState(existingSkill?.suggestedAt || '');

  const handleAddAlias = () => {
    const trimmed = aliasInput.trim();
    if (trimmed && !aliases.includes(trimmed)) {
      setAliases([...aliases, trimmed]);
      setAliasInput('');
    }
  };

  const handleRemoveAlias = (aliasToRemove: string) => {
    setAliases(aliases.filter((a) => a !== aliasToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isNew) {
      const newSkill: AdminSkill = {
        id: `sk-${Date.now()}`,
        name: name.trim(),
        aliases,
        usageCount: Number(usageCount) || 0,
        status,
        suggestedBy: status === 'Suggested' ? (suggestedBy.trim() || 'Internal Admin') : undefined,
        suggestedAt: status === 'Suggested' ? (suggestedAt.trim() || 'Just now') : undefined,
      };
      adminSkills.unshift(newSkill);
    } else if (existingSkill) {
      existingSkill.name = name.trim();
      existingSkill.aliases = aliases;
      existingSkill.status = status;
      existingSkill.usageCount = Number(usageCount) || 0;
      if (status === 'Suggested') {
        existingSkill.suggestedBy = suggestedBy.trim() || existingSkill.suggestedBy;
        existingSkill.suggestedAt = suggestedAt.trim() || existingSkill.suggestedAt;
      } else {
        existingSkill.suggestedBy = undefined;
        existingSkill.suggestedAt = undefined;
      }
    }

    navigate('/admin/master-data');
  };

  if (!isNew && !existingSkill) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/master-data"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Master Data
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Skill Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No skill record matching identifier "{id}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/master-data"
          data-testid="link-back-to-master-data"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Master Data Taxonomy
        </Link>
        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
          {isNew ? 'New Skill' : `Skill ID: ${existingSkill?.id}`}
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Add Verified Skill (MST-3)' : `Edit Skill · ${existingSkill?.name} (MST-3)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Maintain standardized skill names, synonym aliases, approval status, and candidate profile usage metrics.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Configuration */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React 19 & Next.js"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Recognized Synonym Aliases
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAlias();
                  }
                }}
                placeholder="Type alias and press Enter (e.g. NextJS)"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddAlias}
                className="rounded-xl border border-border bg-muted px-3 py-2 font-semibold hover:bg-muted/80 text-foreground"
              >
                <Plus size={13} className="inline mr-1" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl border border-border bg-muted/20">
              {aliases.length === 0 ? (
                <span className="text-[11px] text-muted-foreground italic">No aliases defined yet.</span>
              ) : (
                aliases.map((alias) => (
                  <span
                    key={alias}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-2.5 py-1 text-[11px] font-mono font-medium text-foreground"
                  >
                    <span>{alias}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlias(alias)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Approval Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Approved">Approved (Live Taxonomy)</option>
                <option value="Suggested">Suggested (Queue Review)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Candidate Profile Usage Count
              </label>
              <input
                type="number"
                min={0}
                value={usageCount}
                onChange={(e) => setUsageCount(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          {status === 'Suggested' && (
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Submission Metadata
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Suggested By
                  </label>
                  <input
                    type="text"
                    value={suggestedBy}
                    onChange={(e) => setSuggestedBy(e.target.value)}
                    placeholder="e.g. Candidate: Aarav Mehta"
                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Suggested At
                  </label>
                  <input
                    type="text"
                    value={suggestedAt}
                    onChange={(e) => setSuggestedAt(e.target.value)}
                    placeholder="e.g. 18 min ago"
                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/admin/master-data')}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 flex items-center gap-1.5"
            >
              <Save size={14} />
              Save Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
