import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Save,
  CheckCircle2,
  ListFilter,
  Check,
} from 'lucide-react';
import { adminRoles, adminCategories, type AdminRole } from '@/mock-data';

export function MasterDataRoleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const role = !isNew ? adminRoles.find((r) => r.id === id) : null;

  const [title, setTitle] = useState(role?.title || '');
  const [categoryId, setCategoryId] = useState(role?.categoryId || adminCategories[0]?.id || 'cat-1');
  const [skillsIncluded, setSkillsIncluded] = useState(role?.inOnboarding ?? true);
  const [active, setActive] = useState(role?.active ?? true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedCategory = adminCategories.find((c) => c.id === categoryId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isNew) {
      const newRole: AdminRole = {
        id: `role-${Date.now()}`,
        title: title.trim(),
        categoryId,
        categoryName: selectedCategory?.name || 'Technology & Software',
        inOnboarding: skillsIncluded,
        active,
      };
      adminRoles.push(newRole);
    } else if (role) {
      role.title = title.trim();
      role.categoryId = categoryId;
      role.categoryName = selectedCategory?.name || role.categoryName;
      role.inOnboarding = skillsIncluded;
      role.active = active;
    }

    navigate('/admin/master-data');
  };

  if (!isNew && !role) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/master-data"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Master Data
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Role Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No role matching identifier "{id}".</p>
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
          {isNew ? 'New Role Creator' : `Role ID: ${role?.id}`}
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Add Role (MST-2)' : `Edit Role · ${role?.title} (MST-2)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure job title, parent category taxonomy mapping, and onboarding inclusion.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Configuration Grid */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Role Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Parent Category Mapping (MST-2) *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              {adminCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
            <div className="text-[11px] font-bold text-foreground flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCategory?.color || '#3b82f6' }}
              />
              <span>Mapped Category: {selectedCategory?.name}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Candidate search filters and employer job postings tagged with "{title}" will be grouped under this category tree.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground text-xs">
              <input
                type="checkbox"
                checked={skillsIncluded}
                onChange={(e) => setSkillsIncluded(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span>Include in Candidate Onboarding Role Autocomplete</span>
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
              Save Role Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
