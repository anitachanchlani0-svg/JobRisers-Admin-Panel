import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Save,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { adminLocations, type AdminLocation } from '@/mock-data';

export function MasterDataLocationFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingLocation = !isNew ? adminLocations.find((l) => l.id === id) : null;

  const [city, setCity] = useState(existingLocation?.city || '');
  const [state, setState] = useState(existingLocation?.state || '');
  const [active, setActive] = useState(existingLocation?.active ?? true);
  const [jobCount, setJobCount] = useState(existingLocation?.jobCount ?? 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !state.trim()) return;

    if (isNew) {
      const newLoc: AdminLocation = {
        id: `loc-${Date.now()}`,
        city: city.trim(),
        state: state.trim(),
        active,
        jobCount: Number(jobCount) || 0,
      };
      adminLocations.push(newLoc);
    } else if (existingLocation) {
      existingLocation.city = city.trim();
      existingLocation.state = state.trim();
      existingLocation.active = active;
      existingLocation.jobCount = Number(jobCount) || 0;
    }

    navigate('/admin/master-data');
  };

  if (!isNew && !existingLocation) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/master-data"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Master Data
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Location Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No location matching identifier "{id}".</p>
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
          {isNew ? 'New Location' : `Location ID: ${existingLocation?.id}`}
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Add Location (MST-4)' : `Edit Location · ${existingLocation?.city} (MST-4)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hub cities, state regions, active toggles, and live jobs mapped across metro centers.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Configuration */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Metro City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Ahmedabad"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              State / Region *
            </label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Gujarat (GJ)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Live Jobs Count
            </label>
            <input
              type="number"
              min={0}
              value={jobCount}
              onChange={(e) => setJobCount(Number(e.target.value))}
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
              <span>Active Metro Hub on Marketplace</span>
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
              Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
