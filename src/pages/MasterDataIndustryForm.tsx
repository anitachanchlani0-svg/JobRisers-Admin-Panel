import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Save,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { adminIndustries, type AdminIndustry } from '@/mock-data';

export function MasterDataIndustryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingIndustry = !isNew ? adminIndustries.find((i) => i.id === id) : null;

  const [name, setName] = useState(existingIndustry?.name || '');
  const [active, setActive] = useState(existingIndustry?.active ?? true);
  const [companyCount, setCompanyCount] = useState(existingIndustry?.companyCount ?? 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isNew) {
      const newIndustry: AdminIndustry = {
        id: `ind-${Date.now()}`,
        name: name.trim(),
        active,
        companyCount: Number(companyCount) || 0,
      };
      adminIndustries.push(newIndustry);
    } else if (existingIndustry) {
      existingIndustry.name = name.trim();
      existingIndustry.active = active;
      existingIndustry.companyCount = Number(companyCount) || 0;
    }

    navigate('/admin/master-data');
  };

  if (!isNew && !existingIndustry) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/master-data"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Master Data
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Industry Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No industry matching identifier "{id}".</p>
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
          {isNew ? 'New Industry' : `Industry ID: ${existingIndustry?.id}`}
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Add Industry (MST-4)' : `Edit Industry · ${existingIndustry?.name} (MST-4)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Standard industry sector taxonomy mapped to employer corporate profiles and job postings.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Configuration */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Industry Sector Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cleantech & Renewable Energy"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Companies Mapped
            </label>
            <input
              type="number"
              min={0}
              value={companyCount}
              onChange={(e) => setCompanyCount(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground text-xs">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span>Active Industry Classification on Marketplace</span>
            </label>
          </div>

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
              Save Industry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
