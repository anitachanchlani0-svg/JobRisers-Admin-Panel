import { useState, useMemo } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Save,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Modal } from '@/components/ui';
import {
  initialAdminSalaryBenchmarks,
  type AdminSalaryBenchmarkEntry,
} from '@/mock-data';

export function SalaryBenchmarkPage() {
  const [benchmarks, setBenchmarks] = useState<AdminSalaryBenchmarkEntry[]>(initialAdminSalaryBenchmarks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [editingEntry, setEditingEntry] = useState<AdminSalaryBenchmarkEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<AdminSalaryBenchmarkEntry>>({
    category: 'Engineering',
    role: '',
    city: 'Bengaluru, KA',
    experienceLevel: 'Senior (5-8y)',
    currency: 'INR',
    minSalary: 20.0,
    p25Salary: 28.0,
    medianSalary: 35.0,
    p75Salary: 45.0,
    maxSalary: 60.0,
    dataSource: 'Verified Offer Letters & Harvest ATS Ingest',
    status: 'Published',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // EXT-2 Strict Mathematical Validation: Min <= P25 <= Median <= P75 <= Max
  const validationError = useMemo(() => {
    const min = Number(formData.minSalary ?? 0);
    const p25 = Number(formData.p25Salary ?? 0);
    const med = Number(formData.medianSalary ?? 0);
    const p75 = Number(formData.p75Salary ?? 0);
    const max = Number(formData.maxSalary ?? 0);

    if (min <= 0 || p25 <= 0 || med <= 0 || p75 <= 0 || max <= 0) {
      return 'All salary percentile values must be positive non-zero numbers.';
    }
    if (min > p25) {
      return `Minimum salary (₹${min} LPA) cannot exceed 25th percentile (₹${p25} LPA).`;
    }
    if (p25 > med) {
      return `25th percentile (₹${p25} LPA) cannot exceed Median salary (₹${med} LPA).`;
    }
    if (med > p75) {
      return `Median salary (₹${med} LPA) cannot exceed 75th percentile (₹${p75} LPA).`;
    }
    if (p75 > max) {
      return `75th percentile (₹${p75} LPA) cannot exceed Maximum salary (₹${max} LPA).`;
    }
    if (!formData.role?.trim()) {
      return 'Please enter a target job role title.';
    }
    return null;
  }, [formData]);

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormData({
      category: 'Engineering',
      role: '',
      city: 'Bengaluru, KA',
      experienceLevel: 'Senior (5-8y)',
      currency: 'INR',
      minSalary: 20.0,
      p25Salary: 28.0,
      medianSalary: 35.0,
      p75Salary: 45.0,
      maxSalary: 60.0,
      dataSource: 'Verified Offer Letters & Placement Surveys',
      status: 'Published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: AdminSalaryBenchmarkEntry) => {
    setEditingEntry(entry);
    setFormData({ ...entry });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (validationError) return;

    if (editingEntry) {
      setBenchmarks((prev) =>
        prev.map((b) =>
          b.id === editingEntry.id
            ? ({
                ...b,
                ...formData,
                lastUpdated: 'Just now (Updated)',
              } as AdminSalaryBenchmarkEntry)
            : b
        )
      );
      showToast(`Updated salary benchmark for ${formData.role}.`);
    } else {
      const newEntry: AdminSalaryBenchmarkEntry = {
        id: `sb-${Date.now()}`,
        category: formData.category || 'Engineering',
        role: formData.role || 'New Role',
        city: formData.city || 'Bengaluru, KA',
        experienceLevel: formData.experienceLevel || 'Mid-Level (2-5y)',
        currency: formData.currency || 'INR',
        minSalary: Number(formData.minSalary),
        p25Salary: Number(formData.p25Salary),
        medianSalary: Number(formData.medianSalary),
        p75Salary: Number(formData.p75Salary),
        maxSalary: Number(formData.maxSalary),
        dataSource: formData.dataSource || 'Candidate Self-Reports',
        lastUpdated: 'Today',
        status: formData.status || 'Published',
      };
      setBenchmarks((prev) => [newEntry, ...prev]);
      showToast(`Added new benchmark for ${formData.role}.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, roleTitle: string) => {
    setBenchmarks((prev) => prev.filter((b) => b.id !== id));
    showToast(`Removed benchmark bracket for ${roleTitle}.`);
  };

  // Filtered list
  const filteredBenchmarks = useMemo(() => {
    return benchmarks.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        b.role.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
      const matchesCity = selectedCity === 'All' || b.city === selectedCity;
      return matchesSearch && matchesCat && matchesCity;
    });
  }, [benchmarks, searchQuery, selectedCategory, selectedCity]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3 shadow-2xl text-xs font-semibold text-foreground animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Sliders size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-lg font-extrabold text-foreground">
                Salary Benchmark Tool Configuration
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                EXT-2
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                Min ≤ P25 ≤ Median ≤ P75 ≤ Max Enforced
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Govern compensation percentiles, regional cost-of-living adjustments, and salary transparency tools.
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="btn-add-salary-benchmark"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer self-end md:self-auto"
        >
          <Plus size={14} />
          <span>Add Role Benchmark</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="text-muted-foreground text-xs font-medium">Verified Offer Data Points</div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">48,210</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            74% backed by ATS offers
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="text-muted-foreground text-xs font-medium">Standard Currency</div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">INR (₹ Lakh/yr)</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Calibrated for Indian metros</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="text-muted-foreground text-xs font-medium">Active Role Brackets</div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">
            {benchmarks.filter((b) => b.status === 'Published').length} Published
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {benchmarks.filter((b) => b.status === 'Draft').length} in draft revision
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="text-muted-foreground text-xs font-medium">Quarterly Calibration</div>
          <div className="mt-2 text-sm font-bold text-foreground">Oct 2026 Batch Active</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Next index: Jan 15, 2027</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            data-testid="input-salary-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, categories, or cities…"
            className="w-full rounded-xl border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-border bg-background py-1.5 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-xl border border-border bg-background py-1.5 px-3 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="All">All Regions</option>
            <option value="Bengaluru, KA">Bengaluru, KA</option>
            <option value="Delhi NCR, DL/HR">Delhi NCR</option>
            <option value="Hyderabad, TS">Hyderabad, TS</option>
            <option value="Pune, MH">Pune, MH</option>
          </select>
        </div>
      </div>

      {/* Salary Benchmarks Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Role & Domain</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Min LPA</th>
                <th className="py-3 px-4">25th %ile</th>
                <th className="py-3 px-4 font-bold text-foreground">Median (50th)</th>
                <th className="py-3 px-4">75th %ile</th>
                <th className="py-3 px-4">Max LPA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBenchmarks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-muted-foreground text-xs">
                    No salary benchmark brackets matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredBenchmarks.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-foreground">{item.role}</div>
                      <div className="text-[10px] text-muted-foreground">{item.category}</div>
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">{item.city}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {item.experienceLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">₹{item.minSalary}L</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">₹{item.p25Salary}L</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">₹{item.medianSalary}L</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">₹{item.p75Salary}L</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">₹{item.maxSalary}L</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 rounded-lg border border-border text-foreground hover:bg-muted cursor-pointer"
                          title="Edit Percentiles"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.role)}
                          className="p-1 rounded-lg border border-border text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Delete Bracket"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Salary Benchmark Modal */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          eyebrow="EXT-2 · COMPENSATION PERCENTILE CONFIGURATION"
          title={editingEntry ? `Edit Benchmark: ${editingEntry.role}` : 'Create Salary Benchmark Bracket'}
          maxWidth="max-w-[560px]"
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-[11px] text-muted-foreground">
                All brackets auto-convert for public transparency calculators.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-testid="btn-confirm-save-benchmark"
                  disabled={Boolean(validationError)}
                  onClick={handleSaveModal}
                  className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 cursor-pointer"
                >
                  Save Bracket
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 py-2 text-xs">
            {/* Validation Banner if Invalid */}
            {validationError && (
              <div
                data-testid="salary-validation-error-banner"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
              >
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Validation Error (Min ≤ P25 ≤ Median ≤ P75 ≤ Max):</div>
                  <div className="text-[11px] mt-0.5">{validationError}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-foreground mb-1">Target Role Title</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Lead Distributed Systems Engineer"
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Region / City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Bengaluru, KA">Bengaluru, KA (Tier 1)</option>
                  <option value="Delhi NCR, DL/HR">Delhi NCR (Tier 1)</option>
                  <option value="Hyderabad, TS">Hyderabad, TS</option>
                  <option value="Pune, MH">Pune, MH</option>
                  <option value="Remote India">Remote India</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Experience Tier</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceLevel: e.target.value as AdminSalaryBenchmarkEntry['experienceLevel'],
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Entry (0-2y)">Entry (0-2y)</option>
                  <option value="Mid-Level (2-5y)">Mid-Level (2-5y)</option>
                  <option value="Senior (5-8y)">Senior (5-8y)</option>
                  <option value="Lead / Staff (8-12y)">Lead / Staff (8-12y)</option>
                  <option value="Principal / VP (12+y)">Principal / VP (12+y)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as AdminSalaryBenchmarkEntry['status'],
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Published">Published (Public)</option>
                  <option value="Draft">Draft (Internal review)</option>
                </select>
              </div>
            </div>

            {/* Percentile Inputs */}
            <div className="pt-2 border-t border-border">
              <label className="block text-xs font-bold text-foreground mb-2">
                Compensation Percentiles (INR ₹ Lakh / Year)
              </label>
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">Minimum</span>
                  <input
                    type="number"
                    step="0.5"
                    data-testid="input-salary-min"
                    value={formData.minSalary}
                    onChange={(e) => setFormData({ ...formData, minSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-border bg-background p-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">25th %ile</span>
                  <input
                    type="number"
                    step="0.5"
                    data-testid="input-salary-p25"
                    value={formData.p25Salary}
                    onChange={(e) => setFormData({ ...formData, p25Salary: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-border bg-background p-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-primary block mb-1">Median (50th)</span>
                  <input
                    type="number"
                    step="0.5"
                    data-testid="input-salary-median"
                    value={formData.medianSalary}
                    onChange={(e) => setFormData({ ...formData, medianSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-primary bg-primary/5 p-1.5 font-mono text-xs text-foreground font-bold focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">75th %ile</span>
                  <input
                    type="number"
                    step="0.5"
                    data-testid="input-salary-p75"
                    value={formData.p75Salary}
                    onChange={(e) => setFormData({ ...formData, p75Salary: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-border bg-background p-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">Maximum</span>
                  <input
                    type="number"
                    step="0.5"
                    data-testid="input-salary-max"
                    value={formData.maxSalary}
                    onChange={(e) => setFormData({ ...formData, maxSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-border bg-background p-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Attributed Data Sources</label>
              <input
                type="text"
                value={formData.dataSource}
                onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                placeholder="e.g. Verified Offer Letters & Recruiter Disclosures"
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
