import { useState, useMemo } from 'react';
import {
  Sliders,
  Cpu,
  Search,
  Plus,
  RotateCcw,
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Eye,
  Pencil,
  Trash2,
  History,
  Sparkles,
  TrendingUp,
  BarChart3,
  Target,
  Briefcase,
  Building2,
  Lock,
  Unlock,
  Clock,
  Settings,
  Zap,
  Award,
  Info,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Avatar, StatusPill, EmptyState, Modal } from '../components/ui';
import {
  adminRecommendations,
  adminRecommendationAudits,
  adminMatchScoreSamples,
  adminMatchAlgorithmConfig,
  adminProfileStrengthFormula,
  adminAlgorithmAuditLogs,
  RecommendationBoostItem,
  RecommendationAuditEntry,
  MatchScoreSample,
  AdminMatchFactorWeights,
  AdminAlgorithmVersionEntry,
  AdminMatchAlgorithmConfig,
  AdminProfileStrengthFormula,
  AdminAlgorithmAuditLogEntry,
} from '../mock-data';

const recommendationSections = [
  'Algorithm weights',
  'Match score distribution',
  'Candidate boosts',
  'Model evaluation',
] as const;

type RecommendationSection = (typeof recommendationSections)[number];

type BoostStatusFilter = 'All' | 'Pinned' | 'Boosted' | 'Suppressed';

export function RecommendationsPage() {
  const [selectedSection, setSelectedSection] = useState<RecommendationSection>(recommendationSections[0]);

  // ==========================================
  // TAB 1: ALGORITHM WEIGHTS STATE
  // ==========================================
  const [modelConfig, setModelConfig] = useState<AdminMatchAlgorithmConfig>(adminMatchAlgorithmConfig);
  const [factorWeights, setFactorWeights] = useState<AdminMatchFactorWeights>(adminMatchAlgorithmConfig.weights);
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(adminMatchAlgorithmConfig.minMatchScore);
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(adminMatchAlgorithmConfig.killSwitchActive);

  // Modals & Feedback
  const [isKillSwitchModalOpen, setIsKillSwitchModalOpen] = useState(false);
  const [isRollbackModalOpen, setIsRollbackModalOpen] = useState(false);
  const [selectedRollbackVersion, setSelectedRollbackVersion] = useState<AdminAlgorithmVersionEntry | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Dynamic Total Weight
  const totalWeight = useMemo(() => {
    return (
      (factorWeights.skills || 0) +
      (factorWeights.role || 0) +
      (factorWeights.location || 0) +
      (factorWeights.workMode || 0) +
      (factorWeights.salary || 0) +
      (factorWeights.experience || 0)
    );
  }, [factorWeights]);

  const isWeightValid = totalWeight === 100;

  // Handle Factor Slider Change
  const handleWeightChange = (key: keyof AdminMatchFactorWeights, val: number) => {
    setFactorWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, val)),
    }));
  };

  // Save Weights Action
  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeightValid) {
      setSaveFeedback(`Cannot save: Total factor weight is ${totalWeight}%. It must equal exactly 100%.`);
      setTimeout(() => setSaveFeedback(null), 4000);
      return;
    }

    const previousWeightsStr = `Skills: ${modelConfig.weights.skills}%, Role: ${modelConfig.weights.role}%, Loc: ${modelConfig.weights.location}%`;
    const newWeightsStr = `Skills: ${factorWeights.skills}%, Role: ${factorWeights.role}%, Loc: ${factorWeights.location}%`;

    setModelConfig((prev) => ({
      ...prev,
      weights: factorWeights,
      minMatchScore: minMatchThreshold,
    }));

    // Add entry to audit log
    const newLog: AdminAlgorithmAuditLogEntry = {
      id: `log-alg-${Date.now()}`,
      timestamp: 'Just now',
      adminName: 'Admin (Current Session)',
      changeType: 'Weight Tuning',
      previousValue: previousWeightsStr,
      newValue: newWeightsStr,
      status: 'Applied',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setSaveFeedback('Algorithm factor weights and minimum match threshold saved successfully.');
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  // Reset Weights to Audited Defaults
  const handleResetWeights = () => {
    setFactorWeights(adminMatchAlgorithmConfig.weights);
    setMinMatchThreshold(adminMatchAlgorithmConfig.minMatchScore);
    setSaveFeedback('Restored audited default weights (Skills 35%, Role 25%, Location 15%, Work Mode 10%, Salary 10%, Exp 5%).');
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  // Confirm Rollback Action
  const handleConfirmRollback = () => {
    if (!selectedRollbackVersion) return;
    setFactorWeights(selectedRollbackVersion.weights);
    setMinMatchThreshold(selectedRollbackVersion.minMatchScore);
    setModelConfig((prev) => ({
      ...prev,
      activeVersion: selectedRollbackVersion.version,
      weights: selectedRollbackVersion.weights,
      minMatchScore: selectedRollbackVersion.minMatchScore,
    }));

    const newLog: AdminAlgorithmAuditLogEntry = {
      id: `log-alg-${Date.now()}`,
      timestamp: 'Just now',
      adminName: 'Admin (Current Session)',
      changeType: 'Version Rollback',
      previousValue: modelConfig.activeVersion,
      newValue: selectedRollbackVersion.version,
      status: 'Applied',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setIsRollbackModalOpen(false);
    setSelectedRollbackVersion(null);
    setSaveFeedback(`Successfully rolled back active recommendation model to ${selectedRollbackVersion.version}.`);
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  // Confirm Kill-Switch Action
  const handleToggleKillSwitch = () => {
    const newState = !killSwitchActive;
    setKillSwitchActive(newState);
    setModelConfig((prev) => ({
      ...prev,
      killSwitchActive: newState,
    }));

    const newLog: AdminAlgorithmAuditLogEntry = {
      id: `log-alg-${Date.now()}`,
      timestamp: 'Just now',
      adminName: 'Admin (Emergency Action)',
      changeType: 'Global Kill-Switch',
      previousValue: killSwitchActive ? 'Active' : 'Inactive',
      newValue: newState ? 'Active (Pure Recency Fallback)' : 'Inactive (Algorithm Restored)',
      status: 'Applied',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setIsKillSwitchModalOpen(false);
    setSaveFeedback(
      newState
        ? 'EMERGENCY: Algorithm kill-switch engaged! Recommendation feeds are falling back to pure chronological recency.'
        : 'Algorithm kill-switch disengaged. Model recommendation scoring restored.'
    );
    setTimeout(() => setSaveFeedback(null), 5000);
  };

  // ==========================================
  // PROFILE STRENGTH CONFIGURATION (REC-4 / SET-4)
  // ==========================================
  const [profileFormula, setProfileFormula] = useState<AdminProfileStrengthFormula>(adminProfileStrengthFormula);
  const [isEditingTips, setIsEditingTips] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);

  const handleProfileWeightChange = (key: keyof AdminProfileStrengthFormula['sectionWeights'], val: number) => {
    setProfileFormula((prev) => ({
      ...prev,
      sectionWeights: {
        ...prev.sectionWeights,
        [key]: Math.max(0, Math.min(100, val)),
      },
    }));
  };

  const handleTierTipChange = (index: number, newTip: string) => {
    setProfileFormula((prev) => {
      const updatedTiers = [...prev.tiers];
      updatedTiers[index] = { ...updatedTiers[index], tipText: newTip };
      return { ...prev, tiers: updatedTiers };
    });
  };

  const totalProfileWeight = useMemo(() => {
    const sw = profileFormula.sectionWeights;
    return (sw.photo || 0) + (sw.skills || 0) + (sw.experience || 0) + (sw.education || 0) + (sw.resume || 0) + (sw.summary || 0);
  }, [profileFormula]);

  const handleSaveProfileFormula = () => {
    if (totalProfileWeight !== 100) {
      setProfileFeedback(`Profile weights sum to ${totalProfileWeight}%. Must equal 100% to save.`);
      setTimeout(() => setProfileFeedback(null), 4000);
      return;
    }
    setProfileFeedback('Candidate profile strength formula and tier tips updated.');
    setIsEditingTips(false);
    setTimeout(() => setProfileFeedback(null), 4000);
  };

  // ==========================================
  // TAB 2: MATCH SCORE DISTRIBUTION & SIMULATOR
  // ==========================================
  const [matchSamples] = useState<MatchScoreSample[]>(adminMatchScoreSamples);
  const [selectedSampleForExplain, setSelectedSampleForExplain] = useState<MatchScoreSample | null>(null);

  // Simulator State: factor adjustment bias for live testing
  const [simSkillsBias, setSimSkillsBias] = useState(35);
  const [simRoleBias, setSimRoleBias] = useState(25);
  const [simLocBias, setSimLocBias] = useState(15);
  const [simSalaryBias, setSimSalaryBias] = useState(10);

  // Dynamically calculate simulated match scores
  const simulatedSamples = useMemo(() => {
    const totalSimWeight = simSkillsBias + simRoleBias + simLocBias + simSalaryBias;
    return matchSamples.map((sample) => {
      // Base factor values
      const f = sample.factors;
      if (totalSimWeight === 0) return { ...sample, simScore: sample.matchScore };

      // Weighted calculation
      const weightedScore = Math.round(
        (f.skillsMatch * simSkillsBias +
          f.experienceMatch * simRoleBias +
          f.locationMatch * simLocBias +
          f.salaryFit * simSalaryBias) /
          totalSimWeight
      );
      return {
        ...sample,
        simScore: Math.min(99, Math.max(50, weightedScore)),
      };
    }).sort((a, b) => b.simScore - a.simScore);
  }, [matchSamples, simSkillsBias, simRoleBias, simLocBias, simSalaryBias]);

  // ==========================================
  // TAB 3: CANDIDATE BOOSTS & TOP WIDGET STATE
  // ==========================================
  const [boostItems, setBoostItems] = useState<RecommendationBoostItem[]>(adminRecommendations);
  const [boostSearch, setBoostSearch] = useState('');
  const [boostFilter, setBoostFilter] = useState<BoostStatusFilter>('All');
  const [isAddEditBoostOpen, setIsAddEditBoostOpen] = useState(false);
  const [editingBoostItem, setEditingBoostItem] = useState<RecommendationBoostItem | null>(null);
  const [boostNotice, setBoostNotice] = useState<string | null>(null);

  // Form fields for Add/Edit Boost
  const [formTargetType, setFormTargetType] = useState<'Job' | 'Company'>('Job');
  const [formTargetId, setFormTargetId] = useState('');
  const [formTargetTitle, setFormTargetTitle] = useState('');
  const [formCompanyName, setFormCompanyName] = useState('');
  const [formStatus, setFormStatus] = useState<RecommendationBoostItem['status']>('Pinned');
  const [formBoostWeight, setFormBoostWeight] = useState('+25% Score Boost');
  const [formReason, setFormReason] = useState('');

  // Top Recommendations Widget Config (REC-2)
  const [topWidgetCount, setTopWidgetCount] = useState(modelConfig.topRecommendationsCount);
  const [refreshCadence, setRefreshCadence] = useState(modelConfig.refreshCadenceHours);
  const [matchBadgeThreshold, setMatchBadgeThreshold] = useState(modelConfig.matchBadgeThreshold);
  const [widgetConfigNotice, setWidgetConfigNotice] = useState<string | null>(null);

  // Filtered Boost Items
  const filteredBoostItems = useMemo(() => {
    return boostItems.filter((item) => {
      if (boostFilter !== 'All' && item.status !== boostFilter) {
        return false;
      }
      if (!boostSearch.trim()) return true;
      const q = boostSearch.toLowerCase();
      return (
        item.targetTitle.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        item.targetId.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q)
      );
    });
  }, [boostItems, boostFilter, boostSearch]);

  const handleOpenAddBoost = () => {
    setEditingBoostItem(null);
    setFormTargetType('Job');
    setFormTargetId(`job-${Math.floor(3010 + Math.random() * 90)}`);
    setFormTargetTitle('');
    setFormCompanyName('');
    setFormStatus('Pinned');
    setFormBoostWeight('+25% Score Boost');
    setFormReason('');
    setIsAddEditBoostOpen(true);
  };

  const handleOpenEditBoost = (item: RecommendationBoostItem) => {
    setEditingBoostItem(item);
    setFormTargetType(item.type);
    setFormTargetId(item.targetId);
    setFormTargetTitle(item.targetTitle);
    setFormCompanyName(item.companyName);
    setFormStatus(item.status);
    setFormBoostWeight(item.boostWeight);
    setFormReason(item.reason);
    setIsAddEditBoostOpen(true);
  };

  const handleSaveBoost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTargetTitle.trim() || !formCompanyName.trim()) return;

    if (editingBoostItem) {
      setBoostItems((prev) =>
        prev.map((b) =>
          b.id === editingBoostItem.id
            ? {
                ...b,
                type: formTargetType,
                targetId: formTargetId,
                targetTitle: formTargetTitle.trim(),
                companyName: formCompanyName.trim(),
                status: formStatus,
                boostWeight: formBoostWeight,
                reason: formReason.trim(),
                updatedBy: 'Admin (Current Session)',
                updatedAt: 'Just now',
              }
            : b
        )
      );
      setBoostNotice(`Updated recommendation entry for "${formTargetTitle}".`);
    } else {
      const newItem: RecommendationBoostItem = {
        id: `rec-boost-${Math.floor(10 + Math.random() * 90)}`,
        type: formTargetType,
        targetId: formTargetId || `target-${Date.now()}`,
        targetTitle: formTargetTitle.trim(),
        companyName: formCompanyName.trim(),
        status: formStatus,
        boostWeight: formBoostWeight,
        reason: formReason.trim(),
        updatedBy: 'Admin (Current Session)',
        updatedAt: 'Just now',
      };
      setBoostItems((prev) => [newItem, ...prev]);
      setBoostNotice(`Created new ${formStatus} recommendation for "${formTargetTitle}".`);
    }
    setIsAddEditBoostOpen(false);
    setTimeout(() => setBoostNotice(null), 4000);
  };

  const handleQuickToggleBoost = (id: string, newStatus: RecommendationBoostItem['status'], newWeight: string) => {
    setBoostItems((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus, boostWeight: newWeight, updatedAt: 'Just now' } : b))
    );
    setBoostNotice(`Updated status to ${newStatus}.`);
    setTimeout(() => setBoostNotice(null), 3000);
  };

  const handleDeleteBoost = (id: string) => {
    setBoostItems((prev) => prev.filter((b) => b.id !== id));
    setBoostNotice('Removed boost item from catalogue.');
    setTimeout(() => setBoostNotice(null), 3000);
  };

  const handleSaveWidgetConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setModelConfig((prev) => ({
      ...prev,
      topRecommendationsCount: topWidgetCount,
      refreshCadenceHours: refreshCadence,
      matchBadgeThreshold: matchBadgeThreshold,
    }));
    setWidgetConfigNotice('Top Recommendations widget configuration updated successfully.');
    setTimeout(() => setWidgetConfigNotice(null), 4000);
  };

  // ==========================================
  // TAB 4: MODEL EVALUATION & AUDIT LOGS
  // ==========================================
  const [auditMetrics] = useState<RecommendationAuditEntry[]>(adminRecommendationAudits);
  const [auditLogs, setAuditLogs] = useState<AdminAlgorithmAuditLogEntry[]>(adminAlgorithmAuditLogs);

  return (
    <div className="space-y-5">
      {/* Top KPI Cards */}
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          [
            'Matching model',
            killSwitchActive ? 'Pure Recency' : modelConfig.activeVersion,
            killSwitchActive
              ? 'EMERGENCY: Algorithm kill-switch active'
              : 'Production candidate-job match model',
          ],
          ['Match CTR', '28.4%', 'Click-through rate on recommendations'],
          ['Daily match runs', '52,400', 'Automated pairing evaluations today'],
        ].map(([label, value, detail]) => (
          <article
            key={label}
            className={`rounded-2xl border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)] transition-colors ${
              label === 'Matching model' && killSwitchActive
                ? 'border-rose-300 bg-rose-50/50'
                : 'border-border'
            }`}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
            <div
              className={`mt-2 truncate font-display text-[22px] font-extrabold tracking-tight ${
                label === 'Matching model' && killSwitchActive ? 'text-rose-700' : 'text-foreground'
              }`}
            >
              {value}
            </div>
            <div
              className={`mt-1 text-[10px] ${
                label === 'Matching model' && killSwitchActive ? 'font-semibold text-rose-600' : 'text-muted-foreground'
              }`}
            >
              {detail}
            </div>
          </article>
        ))}
      </section>

      {/* Main Recommendations Container */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        {/* Module Header Banner */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary">
              <Sliders size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[18px] font-extrabold tracking-tight">Recommendation engine & tuning</h2>
                {killSwitchActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-800">
                    <AlertTriangle size={11} /> Recency Fallback Active
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Configure candidate-job match weights, inspect match score breakdowns, and tune recommendation distribution.
              </p>
            </div>
          </div>

          {/* Quick Kill Switch Trigger on Header */}
          <button
            onClick={() => setIsKillSwitchModalOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-2xs ${
              killSwitchActive
                ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                : 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertOctagon size={13} />
            {killSwitchActive ? 'Disengage Kill-Switch' : 'Emergency Kill-Switch'}
          </button>
        </div>

        {/* Existing 4 Tabs Bar (EXACT TAB NAMES PRESERVED) */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
          {recommendationSections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              aria-pressed={selectedSection === section}
              className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[11px] font-bold transition-colors ${
                selectedSection === section
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ALGORITHM WEIGHTS */}
        {/* ========================================================================= */}
        {selectedSection === 'Algorithm weights' && (
          <div className="mt-6 space-y-6">
            {/* Feedback notification */}
            {saveFeedback && (
              <div
                className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  saveFeedback.includes('EMERGENCY') || saveFeedback.includes('Cannot save')
                    ? 'border border-rose-200 bg-rose-50 text-rose-800'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}
              >
                {saveFeedback.includes('Cannot save') ? (
                  <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                )}
                {saveFeedback}
              </div>
            )}

            {/* Model Info & Total Weight Banner */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Architecture</div>
                <div className="font-display text-base font-extrabold text-foreground flex items-center gap-2">
                  {modelConfig.activeVersion}
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Production</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{modelConfig.modelName}</div>
              </div>

              {/* Total Weight Calculation Card */}
              <div
                className={`rounded-xl border p-4 space-y-1 transition-colors ${
                  isWeightValid
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                    : 'border-amber-200 bg-amber-50/50 text-amber-900'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider">Total Model Factor Weight</div>
                <div className="font-display text-xl font-extrabold flex items-center gap-2">
                  {totalWeight}%
                  {isWeightValid ? (
                    <span className="text-xs font-bold text-emerald-700">✓ Balanced (100%)</span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700">⚠️ Needs {100 - totalWeight > 0 ? `+${100 - totalWeight}%` : `${100 - totalWeight}%`}</span>
                  )}
                </div>
                <div className="text-[11px] opacity-80">
                  {isWeightValid ? 'Weights perfectly calibrated to 100% total allocation.' : 'Total must equal exactly 100% before applying.'}
                </div>
              </div>

              {/* Minimum Threshold Card */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Minimum Match Threshold</div>
                <div className="font-display text-xl font-extrabold text-foreground">{minMatchThreshold}%</div>
                <div className="text-[11px] text-muted-foreground">Cut-off score required to trigger feed recommendation cards.</div>
              </div>
            </div>

            {/* Factor Weights Tuning Form */}
            <form onSubmit={handleSaveWeights} className="rounded-2xl border border-border bg-card p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <Target size={16} className="text-primary" />
                    Six Core Match Factors (REC-1)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Adjust the relative influence of candidate qualification signals. All six factors sum dynamically to 100%.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetWeights}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <RotateCcw size={12} className="text-muted-foreground" />
                    Reset Audited Defaults
                  </button>
                  <button
                    type="submit"
                    disabled={!isWeightValid}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors shadow-sm ${
                      isWeightValid ? 'bg-primary hover:bg-primary/90' : 'bg-muted-foreground/40 cursor-not-allowed'
                    }`}
                  >
                    <Check size={14} />
                    Save Weight Changes
                  </button>
                </div>
              </div>

              {/* 6 Factor Sliders Grid */}
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  {
                    key: 'skills' as const,
                    label: 'Skills Match',
                    defaultVal: 35,
                    desc: 'Overlap between verified candidate skills & job requirements.',
                  },
                  {
                    key: 'role' as const,
                    label: 'Role & Title Relevance',
                    defaultVal: 25,
                    desc: 'Semantic match between candidate target role & job title.',
                  },
                  {
                    key: 'location' as const,
                    label: 'Location & Commute Proximity',
                    defaultVal: 15,
                    desc: 'Candidate city proximity or remote willingness.',
                  },
                  {
                    key: 'workMode' as const,
                    label: 'Work Mode Alignment',
                    defaultVal: 10,
                    desc: 'Match between candidate preference (Remote/Hybrid/Onsite) & job setting.',
                  },
                  {
                    key: 'salary' as const,
                    label: 'Salary & Compensation Fit',
                    defaultVal: 10,
                    desc: 'Alignment with candidate expected compensation and budget ceiling.',
                  },
                  {
                    key: 'experience' as const,
                    label: 'Experience Level & Seniority',
                    defaultVal: 5,
                    desc: 'Years of verified industry experience vs minimum requirement.',
                  },
                ].map(({ key, label, defaultVal, desc }) => (
                  <div key={key} className="rounded-xl border border-border bg-muted/15 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">{label}</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Default: {defaultVal}%</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={factorWeights[key]}
                          onChange={(e) => handleWeightChange(key, Number(e.target.value))}
                          className="w-14 rounded-lg border border-border bg-background px-2 py-0.5 text-right text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                        />
                        <span className="text-xs font-bold text-foreground">%</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={factorWeights[key]}
                      onChange={(e) => handleWeightChange(key, Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-lg"
                    />

                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Minimum Match Score Threshold Slider */}
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-foreground">Minimum Feed Display Threshold</label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Pairings scoring below this percentage are suppressed from the candidate's recommended feed.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={40}
                      max={90}
                      value={minMatchThreshold}
                      onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                      className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-right text-xs font-bold text-foreground"
                    />
                    <span className="text-xs font-bold text-foreground">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={1}
                  value={minMatchThreshold}
                  onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-lg"
                />
              </div>
            </form>

            {/* Version History & Rollback Section */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <History size={16} className="text-primary" />
                    Model Version History & Rollback (REC-1)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inspect past algorithmic configurations and instantly rollback in case of metric degradation.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                      <th className="py-2.5 px-3.5">Version</th>
                      <th className="py-2.5 px-3.5">Release Date</th>
                      <th className="py-2.5 px-3.5">Released By</th>
                      <th className="py-2.5 px-3.5">Weights Summary</th>
                      <th className="py-2.5 px-3.5">Min Score</th>
                      <th className="py-2.5 px-3.5">Change Summary</th>
                      <th className="py-2.5 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {modelConfig.versionHistory.map((ver) => (
                      <tr key={ver.version} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3.5 font-bold font-mono text-foreground">
                          {ver.version}
                          {ver.version === modelConfig.activeVersion && (
                            <span className="ml-1.5 rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-bold text-emerald-700">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">{ver.releaseDate}</td>
                        <td className="py-2.5 px-3.5 font-medium text-foreground">{ver.releasedBy}</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">
                          Skills {ver.weights.skills}% · Role {ver.weights.role}% · Loc {ver.weights.location}%
                        </td>
                        <td className="py-2.5 px-3.5 font-bold text-foreground">{ver.minMatchScore}%</td>
                        <td className="py-2.5 px-3.5 text-muted-foreground max-w-[200px] truncate" title={ver.changeSummary}>
                          {ver.changeSummary}
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          {ver.version === modelConfig.activeVersion ? (
                            <span className="text-[11px] font-semibold text-muted-foreground">Current</span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedRollbackVersion(ver);
                                setIsRollbackModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                            >
                              <RotateCcw size={11} className="text-muted-foreground" />
                              Rollback
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profile Strength Configuration (REC-4 / SET-4) */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    Candidate Profile Strength Rules (REC-4, SET-4)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configures candidate profile completeness score (e.g. "95% All-Star") and onboarding recommendations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {profileFeedback && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {profileFeedback}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveProfileFormula}
                    className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Check size={13} />
                    Save Profile Rules
                  </button>
                </div>
              </div>

              {/* Section Weights Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Profile Section Weight Contributions</span>
                  <span className={`font-mono text-xs font-bold ${totalProfileWeight === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    Total: {totalProfileWeight}% {totalProfileWeight === 100 ? '✓' : '(Must be 100%)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { key: 'photo' as const, label: 'Photo' },
                    { key: 'skills' as const, label: 'Skills' },
                    { key: 'experience' as const, label: 'Experience' },
                    { key: 'education' as const, label: 'Education' },
                    { key: 'resume' as const, label: 'Resume' },
                    { key: 'summary' as const, label: 'Summary' },
                  ].map(({ key, label }) => (
                    <div key={key} className="rounded-xl border border-border bg-card p-2.5 text-center space-y-1">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">{label}</div>
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={profileFormula.sectionWeights[key]}
                          onChange={(e) => handleProfileWeightChange(key, Number(e.target.value))}
                          className="w-12 rounded border border-border bg-background px-1 py-0.5 text-center text-xs font-bold text-foreground"
                        />
                        <span className="text-[11px] text-muted-foreground">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Tiers and Tip Text Editor */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Profile Strength Tiers & Improvement Tips</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingTips(!isEditingTips)}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    {isEditingTips ? 'Done Editing' : 'Edit Improvement Tips'}
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {profileFormula.tiers.map((tier, idx) => (
                    <div key={tier.tier} className="rounded-xl border border-border bg-card p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          {tier.tier} Tier
                        </span>
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
                          Min: {tier.minScore}%
                        </span>
                      </div>
                      {isEditingTips ? (
                        <textarea
                          rows={2}
                          value={tier.tipText}
                          onChange={(e) => handleTierTipChange(idx, e.target.value)}
                          className="w-full rounded border border-border bg-background p-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                          "{tier.tipText}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MATCH SCORE DISTRIBUTION */}
        {/* ========================================================================= */}
        {selectedSection === 'Match score distribution' && (
          <div className="mt-6 space-y-8">
            {/* Header Description */}
            <div>
              <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" />
                Match Score Breakdown & Factor Inspection (REC-6)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect how candidate qualifications align with active job descriptions across skills, experience, location, and salary fit.
              </p>
            </div>

            {/* Match Sample Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {matchSamples.map((sample) => (
                <div key={sample.candidateId} className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-2xs">
                  {/* Candidate and Job header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={sample.candidateName} />
                      <div>
                        <div className="font-bold text-sm text-foreground">{sample.candidateName}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Briefcase size={11} /> {sample.jobTitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 rounded-xl bg-[#eeeafd] px-2.5 py-1 text-sm font-extrabold text-[#6352a5]">
                        <Sparkles size={13} /> {sample.matchScore}% Match
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{sample.jobId}</div>
                    </div>
                  </div>

                  {/* Factor Progress Bars */}
                  <div className="space-y-2 pt-1 border-t border-border/60 text-xs">
                    {[
                      { label: 'Skills Match', val: sample.factors.skillsMatch, color: 'bg-emerald-500' },
                      { label: 'Experience Match', val: sample.factors.experienceMatch, color: 'bg-blue-500' },
                      { label: 'Location Proximity', val: sample.factors.locationMatch, color: 'bg-purple-500' },
                      { label: 'Salary Fit', val: sample.factors.salaryFit, color: 'bg-amber-500' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground font-medium">{label}</span>
                          <span className="font-bold text-foreground">{val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedSampleForExplain(sample)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                    >
                      <Info size={12} className="text-primary" />
                      Explain Match Score
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Test User Feed & Onboarding Preference Simulator (REC-5) */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap size={18} className="text-amber-600" />
                    <h3 className="font-display text-sm font-bold text-foreground">
                      Interactive Preference & Weight Simulator (REC-5)
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Adjust candidate preference biases to simulate how ranking changes in real-time without modifying production configuration.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Live Sandbox Simulation
                  </span>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Skills Bias</span>
                    <span className="text-primary">{simSkillsBias}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={simSkillsBias}
                    onChange={(e) => setSimSkillsBias(Number(e.target.value))}
                    className="w-full accent-primary h-1.5"
                  />
                </div>

                <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Experience Bias</span>
                    <span className="text-blue-600">{simRoleBias}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={simRoleBias}
                    onChange={(e) => setSimRoleBias(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5"
                  />
                </div>

                <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Location Bias</span>
                    <span className="text-purple-600">{simLocBias}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={simLocBias}
                    onChange={(e) => setSimLocBias(Number(e.target.value))}
                    className="w-full accent-purple-600 h-1.5"
                  />
                </div>

                <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Salary Fit Bias</span>
                    <span className="text-amber-600">{simSalaryBias}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={simSalaryBias}
                    onChange={(e) => setSimSalaryBias(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1.5"
                  />
                </div>
              </div>

              {/* Simulated Results Preview */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                      <th className="py-2.5 px-3.5">Simulated Rank</th>
                      <th className="py-2.5 px-3.5">Candidate</th>
                      <th className="py-2.5 px-3.5">Job Match</th>
                      <th className="py-2.5 px-3.5 text-center">Production Score</th>
                      <th className="py-2.5 px-3.5 text-center">Simulated Score</th>
                      <th className="py-2.5 px-3.5 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {simulatedSamples.map((s, idx) => {
                      const diff = s.simScore - s.matchScore;
                      return (
                        <tr key={s.candidateId} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3.5 font-bold font-mono text-foreground">#{idx + 1}</td>
                          <td className="py-2.5 px-3.5 font-semibold text-foreground">{s.candidateName}</td>
                          <td className="py-2.5 px-3.5 text-muted-foreground">{s.jobTitle}</td>
                          <td className="py-2.5 px-3.5 text-center font-bold text-muted-foreground">{s.matchScore}%</td>
                          <td className="py-2.5 px-3.5 text-center font-bold text-primary">{s.simScore}%</td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-bold">
                            {diff > 0 ? (
                              <span className="text-emerald-600">+{diff}%</span>
                            ) : diff < 0 ? (
                              <span className="text-rose-600">{diff}%</span>
                            ) : (
                              <span className="text-muted-foreground">0%</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CANDIDATE BOOSTS (PINNED & SUPPRESSED ITEMS) */}
        {/* ========================================================================= */}
        {selectedSection === 'Candidate boosts' && (
          <div className="mt-6 space-y-6">
            {/* Action Notice feedback */}
            {boostNotice && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {boostNotice}
              </div>
            )}

            {/* Top Bar: Search, Filters, and Add Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={boostSearch}
                  onChange={(e) => setBoostSearch(e.target.value)}
                  placeholder="Search pinned, boosted, or suppressed items..."
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  {(['All', 'Pinned', 'Boosted', 'Suppressed'] as BoostStatusFilter[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setBoostFilter(status)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        boostFilter === status
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleOpenAddBoost}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Plus size={14} />
                  Add Pin / Boost
                </button>
              </div>
            </div>

            {/* Pinned & Suppressed Items Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                      <th className="py-3 px-3.5">Target</th>
                      <th className="py-3 px-3.5">Type</th>
                      <th className="py-3 px-3.5">Company</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5">Boost Weight</th>
                      <th className="py-3 px-3.5">Reason</th>
                      <th className="py-3 px-3.5">Updated By</th>
                      <th className="py-3 px-3.5">Updated At</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredBoostItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center">
                          <EmptyState
                            title="No boost items found"
                            detail="No jobs or companies matched your filter or search criteria."
                          />
                        </td>
                      </tr>
                    ) : (
                      filteredBoostItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          {/* Target */}
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-foreground">{item.targetTitle}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{item.targetId}</div>
                          </td>

                          {/* Type */}
                          <td className="py-3 px-3.5">
                            <span className="inline-block rounded bg-muted px-2 py-0.5 font-semibold text-[10px] text-foreground">
                              {item.type}
                            </span>
                          </td>

                          {/* Company */}
                          <td className="py-3 px-3.5 font-medium text-foreground">
                            {item.companyName}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3.5">
                            <StatusPill value={item.status} />
                          </td>

                          {/* Boost Weight */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span
                              className={`font-mono font-bold text-xs ${
                                item.status === 'Pinned'
                                  ? 'text-purple-700'
                                  : item.status === 'Boosted'
                                  ? 'text-blue-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {item.boostWeight}
                            </span>
                          </td>

                          {/* Reason */}
                          <td className="py-3 px-3.5 max-w-[200px]">
                            <p className="line-clamp-2 text-muted-foreground text-[11px]" title={item.reason}>
                              {item.reason}
                            </p>
                          </td>

                          {/* Updated By */}
                          <td className="py-3 px-3.5 text-muted-foreground whitespace-nowrap">
                            {item.updatedBy}
                          </td>

                          {/* Updated At */}
                          <td className="py-3 px-3.5 text-muted-foreground whitespace-nowrap font-medium">
                            {item.updatedAt}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status === 'Pinned' && (
                                <button
                                  onClick={() => handleQuickToggleBoost(item.id, 'Boosted', '+20% Score Boost')}
                                  className="rounded px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:bg-muted"
                                  title="Unpin and convert to standard boost"
                                >
                                  Unpin
                                </button>
                              )}
                              {item.status === 'Boosted' && (
                                <button
                                  onClick={() => handleQuickToggleBoost(item.id, 'Pinned', '+35% Score Boost')}
                                  className="rounded px-2 py-0.5 text-[10px] font-semibold text-purple-700 hover:bg-purple-50"
                                  title="Pin to top"
                                >
                                  Pin
                                </button>
                              )}
                              {item.status === 'Suppressed' && (
                                <button
                                  onClick={() => handleQuickToggleBoost(item.id, 'Boosted', '+15% Score Boost')}
                                  className="rounded px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50"
                                  title="Lift suppression"
                                >
                                  Lift
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenEditBoost(item)}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                title="Edit boost item"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteBoost(item.id)}
                                className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 transition-colors"
                                title="Delete boost entry"
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

            {/* Top Recommendations Widget Controls (REC-2) */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <Settings size={16} className="text-primary" />
                    Top Recommendations Widget Controls (REC-2)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure candidate dashboard spotlight count, refresh frequency, and '98% Match' badge thresholds.
                  </p>
                </div>

                {widgetConfigNotice && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    {widgetConfigNotice}
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveWidgetConfig} className="grid gap-4 sm:grid-cols-3 text-xs">
                {/* Control 1: Top Count */}
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                  <label className="font-bold text-foreground">Spotlight Count Shown</label>
                  <p className="text-[11px] text-muted-foreground">Number of recommended jobs shown in the candidate hero widget.</p>
                  <select
                    value={topWidgetCount}
                    onChange={(e) => setTopWidgetCount(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value={3}>Top 3 Jobs</option>
                    <option value={5}>Top 5 Jobs (Default)</option>
                    <option value={10}>Top 10 Jobs</option>
                  </select>
                </div>

                {/* Control 2: Refresh Cadence */}
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                  <label className="font-bold text-foreground">Refresh Interval</label>
                  <p className="text-[11px] text-muted-foreground">Cadence for recomputing personalized recommendations.</p>
                  <select
                    value={refreshCadence}
                    onChange={(e) => setRefreshCadence(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value={12}>Every 12 Hours</option>
                    <option value={24}>Every 24 Hours (Daily)</option>
                    <option value={48}>Every 48 Hours</option>
                  </select>
                </div>

                {/* Control 3: Badge Threshold */}
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-foreground">High Match Badge Rule</label>
                    <span className="font-mono font-bold text-primary">{matchBadgeThreshold}%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Minimum score to award the featured 'Top Match' badge.</p>
                  <input
                    type="range"
                    min={80}
                    max={95}
                    value={matchBadgeThreshold}
                    onChange={(e) => setMatchBadgeThreshold(Number(e.target.value))}
                    className="w-full accent-primary h-1.5"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Check size={14} />
                    Save Widget Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MODEL EVALUATION & FAIRNESS AUDIT */}
        {/* ========================================================================= */}
        {selectedSection === 'Model evaluation' && (
          <div className="mt-6 space-y-6">
            {/* Prominent Fairness & Demographic Parity Verification Card (REC-6) */}
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck size={22} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-extrabold text-emerald-950">
                      Fairness & Demographic Parity Verification (REC-6)
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      Zero Protected Attributes
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-900">
                    <span className="font-bold text-emerald-950">Fairness verification:</span> Protected demographic attributes
                    are strictly excluded from recommendation model inputs. Candidate ranking is blinded to{' '}
                    <span className="font-semibold underline">Gender</span>,{' '}
                    <span className="font-semibold underline">Age</span>,{' '}
                    <span className="font-semibold underline">Ethnicity</span>, and{' '}
                    <span className="font-semibold underline">Religion</span>. Model fidelity is audited against demographic parity
                    baselines before any weight modification is released.
                  </p>
                </div>
              </div>
            </div>

            {/* Model Evaluation Metrics Table */}
            <div className="space-y-3">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Model Performance & Evaluation Metrics (REC-6)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily benchmark tracking algorithmic accuracy, CTR conversion, and recency decay.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                        <th className="py-2.5 px-3.5">Metric</th>
                        <th className="py-2.5 px-3.5">Model</th>
                        <th className="py-2.5 px-3.5">Score / Value</th>
                        <th className="py-2.5 px-3.5">Status</th>
                        <th className="py-2.5 px-3.5">Details</th>
                        <th className="py-2.5 px-3.5 text-right">Evaluated At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {auditMetrics.map((audit) => (
                        <tr key={audit.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3.5 font-bold text-foreground">{audit.metric}</td>
                          <td className="py-2.5 px-3.5 font-mono text-muted-foreground">{audit.model}</td>
                          <td className="py-2.5 px-3.5 font-mono font-extrabold text-xs text-primary">{audit.score}</td>
                          <td className="py-2.5 px-3.5">
                            <StatusPill value={audit.status} />
                          </td>
                          <td className="py-2.5 px-3.5 text-muted-foreground text-[11px]">{audit.details}</td>
                          <td className="py-2.5 px-3.5 text-right text-muted-foreground whitespace-nowrap font-medium">
                            {audit.evaluatedAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Parameter Audit Trail / Change Log */}
            <div className="space-y-3">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <History size={16} className="text-primary" />
                  Parameter Audit Trail & Configuration Log
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chronological history of all admin weight adjustments, threshold revisions, and emergency interventions.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                        <th className="py-2.5 px-3.5">Date / Time</th>
                        <th className="py-2.5 px-3.5">Admin</th>
                        <th className="py-2.5 px-3.5">Change Type</th>
                        <th className="py-2.5 px-3.5">Previous Value</th>
                        <th className="py-2.5 px-3.5">New Value</th>
                        <th className="py-2.5 px-3.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3.5 text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                          <td className="py-2.5 px-3.5 font-bold text-foreground">{log.adminName}</td>
                          <td className="py-2.5 px-3.5 font-medium text-foreground">{log.changeType}</td>
                          <td className="py-2.5 px-3.5 font-mono text-[11px] text-muted-foreground">{log.previousValue}</td>
                          <td className="py-2.5 px-3.5 font-mono text-[11px] font-bold text-foreground">{log.newValue}</td>
                          <td className="py-2.5 px-3.5 text-right">
                            <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-semibold text-emerald-700">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: EXPLAIN MATCH SCORE (REC-6) */}
      {/* ========================================================================= */}
      {selectedSampleForExplain && (
        <Modal
          isOpen={!!selectedSampleForExplain}
          onClose={() => setSelectedSampleForExplain(null)}
          title={`Explain Match Score — ${selectedSampleForExplain.candidateName}`}
          eyebrow="Explainable AI & Transparency (REC-6)"
          subtitle={`Mathematical breakdown for ${selectedSampleForExplain.jobTitle} (${selectedSampleForExplain.jobId})`}
          maxWidth="max-w-[560px]"
          footer={
            <div className="flex justify-end w-full">
              <button
                onClick={() => setSelectedSampleForExplain(null)}
                className="rounded-xl border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Overall Score Box */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Computed Match Fit</span>
                <div className="font-display text-2xl font-extrabold text-primary">
                  {selectedSampleForExplain.matchScore}% Score
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recommendation Tier</span>
                <div className="font-semibold text-foreground text-sm">Top 5% Candidate Fit</div>
              </div>
            </div>

            {/* Factor Formula Table */}
            <div className="space-y-2">
              <div className="font-bold text-foreground">Factor Weight Contribution Analysis</div>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 font-semibold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-2.5">Factor</th>
                      <th className="p-2.5 text-center">Score</th>
                      <th className="p-2.5 text-center">Weight</th>
                      <th className="p-2.5 text-right">Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {[
                      { name: 'Skills Match', val: selectedSampleForExplain.factors.skillsMatch, w: factorWeights.skills },
                      { name: 'Experience Match', val: selectedSampleForExplain.factors.experienceMatch, w: factorWeights.experience },
                      { name: 'Location Alignment', val: selectedSampleForExplain.factors.locationMatch, w: factorWeights.location },
                      { name: 'Salary Expectation Fit', val: selectedSampleForExplain.factors.salaryFit, w: factorWeights.salary },
                    ].map(({ name, val, w }) => (
                      <tr key={name}>
                        <td className="p-2.5 font-medium">{name}</td>
                        <td className="p-2.5 text-center font-bold">{val}%</td>
                        <td className="p-2.5 text-center font-mono text-muted-foreground">{w}%</td>
                        <td className="p-2.5 text-right font-mono font-bold text-primary">
                          {((val * w) / 100).toFixed(1)} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fairness notice */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-950">Fairness & Demographics Guarantee:</span> Matching is evaluated
                purely against qualifications. Age, gender, ethnicity, and religion are explicitly excluded from model inputs.
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ROLLBACK CONFIRMATION */}
      {/* ========================================================================= */}
      {isRollbackModalOpen && selectedRollbackVersion && (
        <Modal
          isOpen={isRollbackModalOpen}
          onClose={() => setIsRollbackModalOpen(false)}
          title={`Confirm Rollback to ${selectedRollbackVersion.version}`}
          eyebrow="Algorithm Version Control"
          subtitle="Restores previous weight matrix and minimum threshold parameters."
          maxWidth="max-w-[480px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsRollbackModalOpen(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRollback}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <RotateCcw size={13} />
                Confirm Rollback
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              Are you sure you want to rollback production configuration from{' '}
              <span className="font-bold text-foreground">{modelConfig.activeVersion}</span> to{' '}
              <span className="font-bold text-foreground">{selectedRollbackVersion.version}</span>?
            </p>
            <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1 font-mono text-[11px]">
              <div>Release Date: {selectedRollbackVersion.releaseDate}</div>
              <div>Released By: {selectedRollbackVersion.releasedBy}</div>
              <div>Skills: {selectedRollbackVersion.weights.skills}% · Role: {selectedRollbackVersion.weights.role}%</div>
              <div>Min Threshold: {selectedRollbackVersion.minMatchScore}%</div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EMERGENCY KILL-SWITCH CONFIRMATION */}
      {/* ========================================================================= */}
      {isKillSwitchModalOpen && (
        <Modal
          isOpen={isKillSwitchModalOpen}
          onClose={() => setIsKillSwitchModalOpen(false)}
          title={killSwitchActive ? 'Disengage Emergency Kill-Switch?' : 'Engage Emergency Algorithm Kill-Switch?'}
          eyebrow="Safety & Reliability Safeguard (REC-6)"
          subtitle="Emergency override for platform recommendation ranking."
          maxWidth="max-w-[480px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsKillSwitchModalOpen(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleKillSwitch}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors shadow-sm ${
                  killSwitchActive ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <AlertOctagon size={13} />
                {killSwitchActive ? 'Disengage & Restore Model' : 'Engage Emergency Override'}
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            {killSwitchActive ? (
              <p>
                Disengaging the kill-switch will re-enable the <span className="font-bold text-foreground">{modelConfig.activeVersion}</span> multi-factor
                scoring engine across all candidate feeds and restore personalized ranking.
              </p>
            ) : (
              <p className="text-rose-950 bg-rose-50 p-3 rounded-xl border border-rose-200">
                ⚠️ Warning: Engaging the kill-switch will immediately bypass all neural embedding and weighted match scoring.
                Candidate feeds will fall back strictly to <span className="font-bold">pure chronological recency</span>. Use this
                if algorithm degradation or ranking bias is detected.
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD / EDIT CANDIDATE BOOST / PIN */}
      {/* ========================================================================= */}
      {isAddEditBoostOpen && (
        <Modal
          isOpen={isAddEditBoostOpen}
          onClose={() => setIsAddEditBoostOpen(false)}
          title={editingBoostItem ? 'Edit Boost / Pin Entry' : 'Add Candidate Pin / Boost'}
          eyebrow="Recommendation Placement Policy (REC-2)"
          subtitle="Configure spotlights, organic ranking boosts, or entity suppressions."
          maxWidth="max-w-[500px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsAddEditBoostOpen(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="boost-form"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Check size={14} />
                {editingBoostItem ? 'Update Entry' : 'Create Entry'}
              </button>
            </div>
          }
        >
          <form id="boost-form" onSubmit={handleSaveBoost} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Target Type *</label>
                <select
                  value={formTargetType}
                  onChange={(e) => setFormTargetType(e.target.value as 'Job' | 'Company')}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Job">Job Listing</option>
                  <option value="Company">Company Account</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Target ID *</label>
                <input
                  type="text"
                  required
                  value={formTargetId}
                  onChange={(e) => setFormTargetId(e.target.value)}
                  placeholder="e.g. job-3012 or emp-2005"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Target Title / Description *</label>
              <input
                type="text"
                required
                value={formTargetTitle}
                onChange={(e) => setFormTargetTitle(e.target.value)}
                placeholder="e.g. Senior DevOps Lead or All Active Listings"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Company Name *</label>
              <input
                type="text"
                required
                value={formCompanyName}
                onChange={(e) => setFormCompanyName(e.target.value)}
                placeholder="e.g. Northstar Labs"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Placement Status *</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as RecommendationBoostItem['status'])}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Pinned">Pinned (Hero Spotlight)</option>
                  <option value="Boosted">Boosted (Organic Score Lift)</option>
                  <option value="Suppressed">Suppressed (Penalty / Excluded)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Boost / Penalty Weight *</label>
                <select
                  value={formBoostWeight}
                  onChange={(e) => setFormBoostWeight(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="+35% Score Boost">+35% Score Boost (Top Priority)</option>
                  <option value="+25% Score Boost">+25% Score Boost (Scale Partner)</option>
                  <option value="+20% Score Boost">+20% Score Boost (Talent Scarcity)</option>
                  <option value="+15% Score Boost">+15% Score Boost (Remote First)</option>
                  <option value="-50% Penalty">-50% Penalty (Incomplete Spec)</option>
                  <option value="-100% (Excluded)">-100% (Excluded / Suspended)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Reason / Policy Note *</label>
              <textarea
                required
                rows={2}
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                placeholder="Business justification (e.g. Enterprise hiring partner placement benefit or safety review)"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
