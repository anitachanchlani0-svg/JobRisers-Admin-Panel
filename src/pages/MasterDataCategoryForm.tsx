import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ListFilter,
  Save,
  CheckCircle2,
  Tag,
  Check,
  Briefcase,
} from 'lucide-react';
import { adminCategories, adminRoles, type AdminCategory } from '@/mock-data';

export function MasterDataCategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingCategory = !isNew ? adminCategories.find((c) => c.id === id) : null;

  const [name, setName] = useState(existingCategory?.name || '');
  const [slug, setSlug] = useState(existingCategory?.slug || '');
  const [color, setColor] = useState(existingCategory?.color || '#3b82f6');
  const [active, setActive] = useState(existingCategory?.active ?? true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const colorsList = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'];

  const mappedRoles = existingCategory
    ? adminRoles.filter((r) => r.categoryId === existingCategory.id)
    : [];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (isNew || !existingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isNew) {
      const newCat: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        color,
        active,
        icon: 'Laptop',
        jobCount: 0,
        order: adminCategories.length + 1,
      };
      adminCategories.push(newCat);
    } else if (existingCategory) {
      existingCategory.name = name.trim();
      existingCategory.slug = slug.trim();
      existingCategory.color = color;
      existingCategory.active = active;
    }

    navigate('/admin/master-data');
  };

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
          {isNew ? 'New Category' : `Category ID: ${existingCategory?.id}`}
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
            style={{ backgroundColor: color }}
          >
            <ListFilter size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Add Category (MST-1)' : `Edit Category · ${existingCategory?.name} (MST-1)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure category naming, slug identifier, color swatch, and marketplace active status.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form & Mapped Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Technology & Software"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                URL Slug Identifier *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. tech-software"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-2">
                Tile Swatch Color
              </label>
              <div className="flex items-center gap-3">
                {colorsList.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-full transition-all cursor-pointer ${
                      color === c ? 'scale-125 ring-2 ring-primary ring-offset-2' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground text-xs">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>Active on Candidate & Employer Marketplace</span>
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
                Save Category
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Associated Roles Preview */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Briefcase size={14} className="text-primary" />
              Associated Taxonomy Roles ({mappedRoles.length})
            </h2>
            {mappedRoles.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No roles mapped directly to this category yet.</p>
            ) : (
              <div className="space-y-2">
                {mappedRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20 text-xs"
                  >
                    <span className="font-semibold text-foreground">{role.title}</span>
                    <Link
                      to={`/admin/master-data/roles/${role.id}`}
                      className="text-primary font-bold hover:underline"
                    >
                      Edit &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
