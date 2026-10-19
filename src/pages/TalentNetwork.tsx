import { useState } from 'react';
import {
  Globe,
  Sparkles,
  Users,
  Building2,
  Search,
  Eye,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Save,
  RefreshCw,
  Lock,
  BadgeCheck,
  Check,
  FileCheck,
} from 'lucide-react';
import { Modal } from '@/components/ui';
import {
  initialAdminTalentNetworkConfig,
  type AdminTalentNetworkConfig,
  type AdminTalentNetworkSection,
} from '@/mock-data';

export function TalentNetworkPage() {
  const [config, setConfig] = useState<AdminTalentNetworkConfig>(initialAdminTalentNetworkConfig);
  const [activeTab, setActiveTab] = useState<'branding' | 'visibility' | 'sections'>('branding');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSection = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, active: !s.active } : s)),
    }));
    showToast('Section visibility updated.');
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setConfig((prev) => ({ ...prev, sections: newSections }));
  };

  const handleSaveConfig = () => {
    setConfig((prev) => ({
      ...prev,
      lastPublished: 'Just now (Updated)',
    }));
    showToast('Talent Network portal settings saved and published to edge nodes.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3 shadow-2xl text-xs font-semibold text-foreground animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Quick Controls */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Globe size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-lg font-extrabold text-foreground">
                Talent Network Portal Manager
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                EXT-1
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  config.portalStatus === 'Live'
                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                }`}
              >
                ● {config.portalStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Oversee candidate-facing discovery, branding, privacy rules, and verified employer access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            type="button"
            data-testid="btn-preview-talent-network"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-2xs transition-colors cursor-pointer"
          >
            <Eye size={14} className="text-primary" />
            <span>Candidate Preview</span>
          </button>
          <button
            type="button"
            data-testid="btn-save-talent-network"
            onClick={handleSaveConfig}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer"
          >
            <Save size={14} />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Verified Talent Pool</span>
            <Users size={16} className="text-primary" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">
            {config.stats.totalCandidates.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>+{config.stats.weeklyAdditions} joining this week</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Approved Hiring Teams</span>
            <Building2 size={16} className="text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">
            {config.stats.activeEmployers}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Direct intro requests enabled
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Monthly Inbound Searches</span>
            <Search size={16} className="text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">
            {(config.stats.monthlySearches / 1000).toFixed(1)}k
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Aggregated skill & location queries
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Portal Edge Status</span>
            <Globe size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2 text-sm font-bold text-foreground">
            Global CDN Sync (99.98%)
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground truncate">
            Last sync: {config.lastPublished}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'branding'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Branding & Identity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('visibility')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'visibility'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Visibility & Privacy Controls
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'sections'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Portal Section Curation
        </button>
      </div>

      {/* Tab 1: Branding & Identity */}
      {activeTab === 'branding' && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Portal Headline & Title
              </label>
              <input
                type="text"
                value={config.portalTitle}
                onChange={(e) => setConfig({ ...config, portalTitle: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Displayed in browser tab and hero masthead of the talent network.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Portal Operational State
              </label>
              <select
                value={config.portalStatus}
                onChange={(e) =>
                  setConfig({ ...config, portalStatus: e.target.value as AdminTalentNetworkConfig['portalStatus'] })
                }
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Live">Live (Accepting candidate submissions & employer searches)</option>
                <option value="Maintenance">Maintenance (Display maintenance notice)</option>
                <option value="Draft">Draft (Internal administrative testing only)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Hero Value Proposition Tagline
              </label>
              <textarea
                rows={2}
                value={config.heroTagline}
                onChange={(e) => setConfig({ ...config, heroTagline: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Primary Brand Accent Theme
              </label>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Indigo Brand', hex: '#6366f1' },
                  { name: 'Emerald Growth', hex: '#10b981' },
                  { name: 'Purple Royal', hex: '#8b5cf6' },
                  { name: 'Blue Cyber', hex: '#3b82f6' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setConfig({ ...config, primaryColor: color.hex })}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium cursor-pointer ${
                      config.primaryColor === color.hex
                        ? 'border-primary bg-primary/10 text-foreground font-bold shadow-xs'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Candidate Join URL Slug
              </label>
              <input
                type="text"
                value={config.joinUrlSlug}
                onChange={(e) => setConfig({ ...config, joinUrlSlug: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Visibility & Privacy Controls */}
      {activeTab === 'visibility' && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="space-y-4 divide-y divide-border/60">
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-xs font-bold text-foreground">
                  Public Search Engine Indexing (SEO / Google Jobs)
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Allows search engine crawlers to discover sanitized, unidentifiable skill summaries.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.publicSearchIndexing}
                onChange={(e) => setConfig({ ...config, publicSearchIndexing: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="text-xs font-bold text-foreground">
                  1-Click Direct Recruiter Intro Inquiries
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Verified employers with active subscription seats can request direct introductions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.directRecruiterInquiries}
                onChange={(e) => setConfig({ ...config, directRecruiterInquiries: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>Mandatory PII Masking on Public Surface (DPDP Act 2023)</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    Mandatory
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Strictly masks full names, personal phone numbers, and email addresses until mutual handshake.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.maskPiiOnPublic}
                onChange={(e) => setConfig({ ...config, maskPiiOnPublic: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="text-xs font-bold text-foreground">
                  Auto-Index Shortlisted Candidates
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Automatically invites candidates who passed screening rounds to the verified talent pool.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.autoAddShortlisted}
                onChange={(e) => setConfig({ ...config, autoAddShortlisted: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Portal Section Curation */}
      {activeTab === 'sections' && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <p className="text-xs text-muted-foreground">
            Configure section hierarchy and ordering displayed on the external Talent Network homepage.
          </p>
          <div className="space-y-2.5">
            {config.sections.map((section, idx) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span>{section.name}</span>
                      {section.active ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600">
                          Active
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{section.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveSection(idx, 'up')}
                    className="p-1 rounded-lg border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                    title="Move section up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === config.sections.length - 1}
                    onClick={() => handleMoveSection(idx, 'down')}
                    className="p-1 rounded-lg border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                    title="Move section down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSection(section.id)}
                    className={`ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      section.active
                        ? 'border border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
                        : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                    }`}
                  >
                    {section.active ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Candidate-Facing Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPreviewOpen(false)}
          eyebrow="EXT-1 · TALENT NETWORK PREVIEW"
          title="Candidate-Facing Portal View (Simulated)"
          maxWidth="max-w-[780px]"
          footer={
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-muted-foreground text-[11px]">
                Viewing responsive candidate surface with PII protection active.
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                Close Preview
              </button>
            </div>
          }
        >
          <div className="space-y-5 py-2">
            {/* Simulated Hero */}
            <div
              className="rounded-2xl p-6 text-white text-center space-y-3 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${config.primaryColor} 0%, #0f172a 100%)`,
              }}
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
                <Sparkles size={12} />
                <span>JobRisers Verified Exclusive Community</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
                {config.portalTitle}
              </h2>
              <p className="text-xs text-white/80 max-w-lg mx-auto leading-relaxed">
                {config.heroTagline}
              </p>
              <div className="pt-2 flex justify-center gap-3 text-xs">
                <button
                  type="button"
                  className="rounded-xl bg-white text-slate-900 font-bold px-4 py-2 shadow-lg"
                >
                  Join Verified Network
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 backdrop-blur-md"
                >
                  Browse Top Talents
                </button>
              </div>
            </div>

            {/* Simulated Candidate Highlights */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Featured Verified Engineers (PII Protected)</span>
                <span className="text-primary text-[11px]">14,820 Total Members</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <span>Aarav M.</span>
                      <BadgeCheck size={14} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      Tier 1 Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Senior Frontend Engineer · 6.5y Exp · Bengaluru
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-muted">React 19</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted">TypeScript</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted">Next.js</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <span>Priya S.</span>
                      <BadgeCheck size={14} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      Tier 1 Verified
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Fintech Product Lead · 5.0y Exp · Gurugram
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-muted">UPI Switch</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted">Product Strategy</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted">SQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
