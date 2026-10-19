import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sliders,
  Save,
  CheckCircle2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { adminSalaryBuckets, type AdminSalaryBucket } from '@/mock-data';

export function MasterDataSalaryBucketFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingBucket = !isNew ? adminSalaryBuckets.find((b) => b.id === id) : null;

  const [label, setLabel] = useState(existingBucket?.label || '');
  const [minLpa, setMinLpa] = useState(existingBucket?.minLpa ?? 0);
  const [maxLpa, setMaxLpa] = useState(existingBucket?.maxLpa === 999 ? 25 : (existingBucket?.maxLpa ?? 5));
  const [isUpperUncapped, setIsUpperUncapped] = useState(existingBucket?.maxLpa === 999);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const finalMax = isUpperUncapped ? 999 : Number(maxLpa);

    if (isNew) {
      const newBucket: AdminSalaryBucket = {
        id: `sb-${Date.now()}`,
        label: label.trim(),
        minLpa: Number(minLpa),
        maxLpa: finalMax,
      };
      adminSalaryBuckets.push(newBucket);
    } else if (existingBucket) {
      existingBucket.label = label.trim();
      existingBucket.minLpa = Number(minLpa);
      existingBucket.maxLpa = finalMax;
    }

    navigate('/admin/master-data');
  };

  if (!isNew && !existingBucket) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/master-data"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Master Data
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Salary Bucket Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No salary bucket matching identifier "{id}".</p>
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
          {isNew ? 'New Salary Bucket' : `Bucket Ref: ${existingBucket?.id}`}
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Sliders size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Add Salary Bucket (MST-14)' : `Edit Salary Bucket · ${existingBucket?.label} (MST-14)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure salary range intervals remain mathematically contiguous across candidate filtering and compensation insights.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Configuration */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Bucket Label *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. ₹6 - ₹12 LPA"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Minimum LPA (₹ Lakhs per Annum) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={minLpa}
                onChange={(e) => setMinLpa(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Maximum LPA (₹ Lakhs per Annum)
              </label>
              <input
                type="number"
                min={minLpa + 1}
                disabled={isUpperUncapped}
                value={isUpperUncapped ? 999 : maxLpa}
                onChange={(e) => setMaxLpa(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground text-xs">
              <input
                type="checkbox"
                checked={isUpperUncapped}
                onChange={(e) => setIsUpperUncapped(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span>Uncapped Upper Limit (e.g. ₹25+ LPA open interval)</span>
            </label>
          </div>

          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs space-y-1">
            <div className="font-semibold text-foreground">Contiguity Rule Reminder:</div>
            <p className="text-muted-foreground text-[11px]">
              The minimum of this range should equal the maximum of the preceding range to prevent unrepresented salary gaps in search results.
            </p>
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
              Save Salary Bucket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
