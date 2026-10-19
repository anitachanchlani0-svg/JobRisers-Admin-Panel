import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { adminBenefits, type AdminBenefit } from '@/mock-data';

export function MasterDataBenefitFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingBenefit = !isNew ? adminBenefits.find((b) => b.id === id) : null;

  const [label, setLabel] = useState(existingBenefit?.label || '');
  const [icon, setIcon] = useState(existingBenefit?.icon || 'ShieldCheck');
  const [active, setActive] = useState(existingBenefit?.active ?? true);
  const [adoptionPercent, setAdoptionPercent] = useState(existingBenefit?.adoptionPercent ?? 0);

  const availableIcons = ['Laptop', 'ShieldCheck', 'Armchair', 'GraduationCap', 'Coins', 'Heart', 'Coffee', 'Plane'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    if (isNew) {
      const newBenefit: AdminBenefit = {
        id: `ben-${Date.now()}`,
        label: label.trim(),
        icon,
        active,
        adoptionPercent: Number(adoptionPercent) || 0,
      };
      adminBenefits.push(newBenefit);
    } else if (existingBenefit) {
      existingBenefit.label = label.trim();
      existingBenefit.icon = icon;
      existingBenefit.active = active;
      existingBenefit.adoptionPercent = Number(adoptionPercent) || 0;
    }

    navigate('/admin/master-data');
  };

  if (!isNew && !existingBenefit) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/master-data"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Master Data
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Benefit Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No benefit matching identifier "{id}".</p>
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
          {isNew ? 'New Benefit' : `Benefit ID: ${existingBenefit?.id}`}
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
              {isNew ? 'Add Managed Standard Benefit (MST-4)' : `Edit Benefit · ${existingBenefit?.label} (MST-4)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Standard benefit perks available to employers when creating job postings and compensation offers.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Configuration */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Benefit Title / Perk Label *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Parental Leave & Childcare Allowance"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Select Icon Representation
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              {availableIcons.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Employer Adoption Percentage (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={adoptionPercent}
              onChange={(e) => setAdoptionPercent(Number(e.target.value))}
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
              <span>Available in Employer Job Posting Creator</span>
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
              Save Benefit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
