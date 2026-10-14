import { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Sliders,
  Plus,
  Trash2,
  Pencil,
  AlertOctagon,
  ShieldCheck,
  Check,
  RotateCcw,
  Ban,
  FileSpreadsheet,
} from 'lucide-react';
import { Avatar, StatusPill, EmptyState, Modal } from '../components/ui';
import {
  adminConversations,
  adminFlaggedThreads,
  adminKeywordMonitors,
  adminMessagingPolicies,
  adminReportedThreads,
  AdminConversationMetadata,
  AdminFlaggedThread,
  AdminKeywordRule,
  AdminMessagingPolicies,
  AdminReportedThread,
} from '../mock-data';

const messagingSections = [
  'Active threads',
  'Flagged conversations',
  'Keyword monitors',
  'Audit transcripts',
] as const;

type MessagingSection = (typeof messagingSections)[number];

// Filter types
type ActiveThreadFilter = 'All' | 'Active' | 'Archived' | 'Locked';
type FlaggedThreadFilter = 'All' | 'Under Review' | 'Investigating' | 'Resolved' | 'Dismissed';
type ReportedThreadFilter = 'All' | 'Under Review' | 'Investigating' | 'Action Taken' | 'Dismissed';
type KeywordCategoryFilter = 'All' | 'Fee Solicitation' | 'Off-Platform Contact' | 'Spam / Phishing' | 'Harassment' | 'Security Risk';

export function MessagingPage() {
  const [selectedSection, setSelectedSection] = useState<MessagingSection>(messagingSections[0]);

  // ==========================================
  // TAB 1: ACTIVE THREADS STATE
  // ==========================================
  const [conversations, setConversations] = useState<AdminConversationMetadata[]>(adminConversations);
  const [activeSearch, setActiveSearch] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<ActiveThreadFilter>('All');
  const [selectedConversation, setSelectedConversation] = useState<AdminConversationMetadata | null>(null);

  // Filtered Active Threads
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (activeStatusFilter !== 'All' && c.status !== activeStatusFilter) {
        return false;
      }
      if (!activeSearch.trim()) return true;
      const q = activeSearch.toLowerCase();
      return (
        c.candidateName.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.employerContactName.toLowerCase().includes(q) ||
        c.jobTitle.toLowerCase().includes(q) ||
        c.jobId.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [conversations, activeStatusFilter, activeSearch]);

  // Quick toggle conversation status
  const handleToggleConversationStatus = (id: string, newStatus: 'Active' | 'Archived' | 'Locked') => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedConversation && selectedConversation.id === id) {
      setSelectedConversation((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // ==========================================
  // TAB 2: FLAGGED CONVERSATIONS STATE
  // ==========================================
  const [flaggedThreads, setFlaggedThreads] = useState<AdminFlaggedThread[]>(adminFlaggedThreads);
  const [flagFilter, setFlagFilter] = useState<FlaggedThreadFilter>('All');
  const [flagSearch, setFlagSearch] = useState('');
  const [selectedFlag, setSelectedFlag] = useState<AdminFlaggedThread | null>(null);
  const [flagActionNotice, setFlagActionNotice] = useState<string | null>(null);

  // Filtered Flagged Threads
  const filteredFlaggedThreads = useMemo(() => {
    return flaggedThreads.filter((f) => {
      if (flagFilter !== 'All' && f.status !== flagFilter) {
        return false;
      }
      if (!flagSearch.trim()) return true;
      const q = flagSearch.toLowerCase();
      return (
        f.candidateName.toLowerCase().includes(q) ||
        f.companyName.toLowerCase().includes(q) ||
        f.employerContactName.toLowerCase().includes(q) ||
        f.matchedKeyword.toLowerCase().includes(q) ||
        f.triggerRule.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.threadId.toLowerCase().includes(q)
      );
    });
  }, [flaggedThreads, flagFilter, flagSearch]);

  // Flag moderation actions
  const handleUpdateFlagStatus = (
    flagId: string,
    newStatus: 'Under Review' | 'Investigating' | 'Resolved' | 'Dismissed',
    note?: string
  ) => {
    setFlaggedThreads((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, status: newStatus, resolutionNote: note || f.resolutionNote } : f))
    );
    if (selectedFlag && selectedFlag.id === flagId) {
      setSelectedFlag((prev) => (prev ? { ...prev, status: newStatus, resolutionNote: note || prev.resolutionNote } : null));
    }
    const message = `Flag ${flagId} updated to "${newStatus}".`;
    setFlagActionNotice(message);
    setTimeout(() => setFlagActionNotice(null), 4000);
  };

  const handleLockThreadFromFlag = (flag: AdminFlaggedThread) => {
    // Also lock thread in conversations
    setConversations((prev) =>
      prev.map((c) => (c.id === flag.threadId ? { ...c, status: 'Locked', isFlagged: true } : c))
    );
    handleUpdateFlagStatus(flag.id, 'Resolved', 'Thread locked by moderation admin.');
  };

  // ==========================================
  // TAB 3: KEYWORD MONITORS STATE
  // ==========================================
  const [keywordRules, setKeywordRules] = useState<AdminKeywordRule[]>(adminKeywordMonitors);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<KeywordCategoryFilter>('All');
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AdminKeywordRule | null>(null);

  // Add/Edit Rule Form state
  const [ruleKeyword, setRuleKeyword] = useState('');
  const [ruleCategory, setRuleCategory] = useState<AdminKeywordRule['category']>('Fee Solicitation');
  const [ruleSeverity, setRuleSeverity] = useState<AdminKeywordRule['severity']>('High');
  const [ruleAction, setRuleAction] = useState<AdminKeywordRule['action']>('Auto-flag & Notify');
  const [ruleIsActive, setRuleIsActive] = useState(true);

  // Policy Settings state
  const [policies, setPolicies] = useState<AdminMessagingPolicies>(adminMessagingPolicies);
  const [policyDailyLimit, setPolicyDailyLimit] = useState(adminMessagingPolicies.dailyOutreachLimit);
  const [policyCooldown, setPolicyCooldown] = useState(adminMessagingPolicies.unresponsiveCooldownHours);
  const [policyMaxFileSize, setPolicyMaxFileSize] = useState(adminMessagingPolicies.maxFileSizeMb);
  const [policyBlockScripts, setPolicyBlockScripts] = useState(adminMessagingPolicies.blockExecutableScripts);
  const [policySavedNotice, setPolicySavedNotice] = useState(false);

  // Filtered Keyword Rules
  const filteredKeywordRules = useMemo(() => {
    return keywordRules.filter((r) => {
      if (categoryFilter !== 'All' && r.category !== categoryFilter) {
        return false;
      }
      if (!keywordSearch.trim()) return true;
      const q = keywordSearch.toLowerCase();
      return r.keyword.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    });
  }, [keywordRules, categoryFilter, keywordSearch]);

  const handleOpenAddRuleModal = () => {
    setEditingRule(null);
    setRuleKeyword('');
    setRuleCategory('Fee Solicitation');
    setRuleSeverity('High');
    setRuleAction('Auto-flag & Notify');
    setRuleIsActive(true);
    setIsRuleModalOpen(true);
  };

  const handleOpenEditRuleModal = (rule: AdminKeywordRule) => {
    setEditingRule(rule);
    setRuleKeyword(rule.keyword);
    setRuleCategory(rule.category);
    setRuleSeverity(rule.severity);
    setRuleAction(rule.action);
    setRuleIsActive(rule.isActive);
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleKeyword.trim()) return;

    if (editingRule) {
      setKeywordRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                keyword: ruleKeyword.trim(),
                category: ruleCategory,
                severity: ruleSeverity,
                action: ruleAction,
                isActive: ruleIsActive,
              }
            : r
        )
      );
    } else {
      const newRule: AdminKeywordRule = {
        id: `kw-${Math.floor(100 + Math.random() * 900)}`,
        keyword: ruleKeyword.trim(),
        category: ruleCategory,
        severity: ruleSeverity,
        action: ruleAction,
        isActive: ruleIsActive,
        hitCount: 0,
        lastTriggered: 'Just created',
      };
      setKeywordRules((prev) => [newRule, ...prev]);
    }
    setIsRuleModalOpen(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    setKeywordRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleToggleRuleActive = (ruleId: string) => {
    setKeywordRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicies({
      ...policies,
      dailyOutreachLimit: policyDailyLimit,
      unresponsiveCooldownHours: policyCooldown,
      maxFileSizeMb: policyMaxFileSize,
      blockExecutableScripts: policyBlockScripts,
      lastUpdated: 'Just now',
      updatedBy: 'Admin (Current Session)',
    });
    setPolicySavedNotice(true);
    setTimeout(() => setPolicySavedNotice(false), 4000);
  };

  const handleResetPolicies = () => {
    setPolicyDailyLimit(adminMessagingPolicies.dailyOutreachLimit);
    setPolicyCooldown(adminMessagingPolicies.unresponsiveCooldownHours);
    setPolicyMaxFileSize(adminMessagingPolicies.maxFileSizeMb);
    setPolicyBlockScripts(adminMessagingPolicies.blockExecutableScripts);
    setPolicies(adminMessagingPolicies);
    setPolicySavedNotice(true);
    setTimeout(() => setPolicySavedNotice(false), 4000);
  };

  // ==========================================
  // TAB 4: AUDIT TRANSCRIPTS STATE
  // ==========================================
  const [reportedThreads, setReportedThreads] = useState<AdminReportedThread[]>(adminReportedThreads);
  const [reportFilter, setReportFilter] = useState<ReportedThreadFilter>('All');
  const [reportSearch, setReportSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<AdminReportedThread | null>(null);
  const [reportActionNotice, setReportActionNotice] = useState<string | null>(null);

  // Filtered Reported Threads
  const filteredReportedThreads = useMemo(() => {
    return reportedThreads.filter((r) => {
      if (reportFilter !== 'All' && r.status !== reportFilter) {
        return false;
      }
      if (!reportSearch.trim()) return true;
      const q = reportSearch.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.reportedBy.toLowerCase().includes(q) ||
        r.offendingUser.toLowerCase().includes(q) ||
        r.organization.toLowerCase().includes(q) ||
        r.violationReason.toLowerCase().includes(q)
      );
    });
  }, [reportedThreads, reportFilter, reportSearch]);

  const handleUpdateReportStatus = (
    reportId: string,
    newStatus: 'Under Review' | 'Investigating' | 'Action Taken' | 'Dismissed',
    note?: string
  ) => {
    setReportedThreads((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus, resolutionNotes: note || r.resolutionNotes } : r))
    );
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport((prev) => (prev ? { ...prev, status: newStatus, resolutionNotes: note || prev.resolutionNotes } : null));
    }
    const message = `Report ${reportId}: Status changed to "${newStatus}".`;
    setReportActionNotice(message);
    setTimeout(() => setReportActionNotice(null), 4000);
  };

  // Derived KPI values
  const activeThreadsCount = conversations.filter((c) => c.status === 'Active').length;
  const flaggedCount = flaggedThreads.filter(
    (f) => f.status === 'Under Review' || f.status === 'Investigating'
  ).length;

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Active threads', activeThreadsCount.toLocaleString(), 'Active conversations between parties'],
          ['Flagged messages', flaggedCount.toString(), 'Conversations flagged by automated rules'],
          ['Resolution SLA', '1.4 hrs', 'Average safety turnaround time'],
        ].map(([label, value, detail]) => (
          <article
            key={label}
            className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)]"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 truncate font-display text-[22px] font-extrabold tracking-tight">{value}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{detail}</div>
          </article>
        ))}
      </section>

      {/* Main Messaging Oversight Module Container */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        {/* Module Header Banner */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary">
            <MessageSquare size={22} />
          </div>
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-tight">Platform messaging oversight</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              Review platform communication, enforce user interaction rules, and investigate off-platform contact attempts.
            </p>
          </div>
        </div>

        {/* Existing 4 Tabs Bar */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
          {messagingSections.map((section) => (
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
        {/* TAB 1: ACTIVE THREADS */}
        {/* ========================================================================= */}
        {selectedSection === 'Active threads' && (
          <div className="mt-6 space-y-4">
            {/* Privacy Oversight Disclaimer Banner */}
            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-blue-900">
              <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold text-blue-950">Privacy Protected Oversight:</span> Active Threads displays
                conversation metadata only (participants, message frequency, status, timestamps). Raw transcript content is
                strictly restricted to authorized Trust & Safety queues to protect user privacy.
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={activeSearch}
                  onChange={(e) => setActiveSearch(e.target.value)}
                  placeholder="Search by candidate, company, recruiter, job title, job ID..."
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {activeSearch && (
                  <button
                    onClick={() => setActiveSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Active', 'Archived', 'Locked'] as ActiveThreadFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatusFilter(status)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeStatusFilter === status
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Threads Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                      <th className="py-3 px-3.5">Candidate</th>
                      <th className="py-3 px-3.5">Recruiter / Contact</th>
                      <th className="py-3 px-3.5">Company</th>
                      <th className="py-3 px-3.5">Role / Job</th>
                      <th className="py-3 px-3.5">Started Date</th>
                      <th className="py-3 px-3.5">Last Activity</th>
                      <th className="py-3 px-3.5 text-center">Messages</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5">Flagged State</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredConversations.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-10 text-center">
                          <EmptyState
                            title="No conversation metadata found"
                            detail="No threads matched your current search criteria or status filter."
                          />
                        </td>
                      </tr>
                    ) : (
                      filteredConversations.map((thread) => (
                        <tr
                          key={thread.id}
                          className="hover:bg-muted/30 transition-colors group cursor-pointer"
                          onClick={() => setSelectedConversation(thread)}
                        >
                          {/* Candidate */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={thread.candidateName}  />
                              <div>
                                <div className="font-semibold text-foreground flex items-center gap-1.5">
                                  {thread.candidateName}
                                  {thread.isUnread && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" title="Unread messages" />
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground">{thread.candidateId}</div>
                              </div>
                            </div>
                          </td>

                          {/* Recruiter / Contact */}
                          <td className="py-3 px-3.5 font-medium text-foreground">
                            {thread.employerContactName}
                          </td>

                          {/* Company */}
                          <td className="py-3 px-3.5 font-medium text-foreground">
                            {thread.companyName}
                          </td>

                          {/* Role / Job */}
                          <td className="py-3 px-3.5">
                            <div className="font-medium text-foreground truncate max-w-[180px]">{thread.jobTitle}</div>
                            <div className="text-[10px] text-muted-foreground">{thread.jobId}</div>
                          </td>

                          {/* Started Date */}
                          <td className="py-3 px-3.5 text-muted-foreground whitespace-nowrap">
                            {thread.startedDate}
                          </td>

                          {/* Last Activity */}
                          <td className="py-3 px-3.5 text-foreground whitespace-nowrap font-medium">
                            {thread.lastActivity}
                          </td>

                          {/* Message Count */}
                          <td className="py-3 px-3.5 text-center">
                            <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 font-semibold text-[11px] text-foreground">
                              {thread.messageCount}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3.5">
                            <StatusPill value={thread.status} />
                          </td>

                          {/* Flagged State */}
                          <td className="py-3 px-3.5">
                            {thread.isFlagged ? (
                              <span
                                className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-semibold text-rose-700"
                                title={thread.flagReason || 'Flagged by automated monitor'}
                              >
                                <AlertTriangle size={10} /> Flagged
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedConversation(thread)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                            >
                              <Eye size={12} className="text-muted-foreground" />
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination / Total count bar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <div>
                Showing <span className="font-semibold text-foreground">{filteredConversations.length}</span> of{' '}
                <span className="font-semibold text-foreground">{conversations.length}</span> conversation records
              </div>
              <div className="text-[11px]">Canonical IDs: conv-501 to conv-506 preserved</div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FLAGGED CONVERSATIONS */}
        {/* ========================================================================= */}
        {selectedSection === 'Flagged conversations' && (
          <div className="mt-6 space-y-4">
            {/* Action Notice feedback */}
            {flagActionNotice && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {flagActionNotice}
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={flagSearch}
                  onChange={(e) => setFlagSearch(e.target.value)}
                  placeholder="Search flagged queue by participant, company, keyword, or ID..."
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Under Review', 'Investigating', 'Resolved', 'Dismissed'] as FlaggedThreadFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFlagFilter(status)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      flagFilter === status
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Flagged Queue Moderation Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                      <th className="py-3 px-3.5">Thread / Flag ID</th>
                      <th className="py-3 px-3.5">Participants</th>
                      <th className="py-3 px-3.5">Company & Job</th>
                      <th className="py-3 px-3.5">Trigger Rule / Keyword</th>
                      <th className="py-3 px-3.5">Trigger Snippet Preview</th>
                      <th className="py-3 px-3.5">Risk & Severity</th>
                      <th className="py-3 px-3.5">Timestamp</th>
                      <th className="py-3 px-3.5">Review Status</th>
                      <th className="py-3 px-3.5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredFlaggedThreads.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center">
                          <EmptyState
                            title="No flagged conversations in queue"
                            detail="All conversation screening alerts have been reviewed or none match the active filters."
                          />
                        </td>
                      </tr>
                    ) : (
                      filteredFlaggedThreads.map((flag) => (
                        <tr
                          key={flag.id}
                          className="hover:bg-muted/30 transition-colors group cursor-pointer"
                          onClick={() => setSelectedFlag(flag)}
                        >
                          {/* Thread / Flag ID */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <div className="font-bold text-foreground">{flag.id}</div>
                            <div className="text-[10px] text-muted-foreground">{flag.threadId}</div>
                          </td>

                          {/* Participants */}
                          <td className="py-3 px-3.5">
                            <div className="font-semibold text-foreground">{flag.candidateName}</div>
                            <div className="text-[11px] text-muted-foreground">w/ {flag.employerContactName}</div>
                          </td>

                          {/* Company & Job */}
                          <td className="py-3 px-3.5">
                            <div className="font-medium text-foreground">{flag.companyName}</div>
                            <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{flag.jobTitle}</div>
                          </td>

                          {/* Trigger Rule / Keyword */}
                          <td className="py-3 px-3.5">
                            <div className="font-semibold text-foreground text-[11px]">{flag.triggerRule}</div>
                            <div className="mt-1">
                              <span className="inline-block rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800 border border-amber-200">
                                "{flag.matchedKeyword}"
                              </span>
                            </div>
                          </td>

                          {/* Snippet Preview */}
                          <td className="py-3 px-3.5 max-w-[200px]">
                            <p className="line-clamp-2 text-[11px] italic text-muted-foreground bg-muted/40 p-1.5 rounded border border-border/50">
                              "{flag.triggerSnippet}"
                            </p>
                          </td>

                          {/* Risk & Severity */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-mono text-xs font-extrabold ${
                                  flag.riskScore >= 90
                                    ? 'text-rose-600'
                                    : flag.riskScore >= 75
                                    ? 'text-amber-600'
                                    : 'text-blue-600'
                                }`}
                              >
                                {flag.riskScore}/100
                              </span>
                              <StatusPill value={flag.severity} />
                            </div>
                          </td>

                          {/* Timestamp */}
                          <td className="py-3 px-3.5 text-muted-foreground whitespace-nowrap">
                            {flag.timestamp}
                          </td>

                          {/* Review Status */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <StatusPill value={flag.status} />
                          </td>

                          {/* Moderation Actions */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedFlag(flag)}
                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                              >
                                <Eye size={12} className="text-muted-foreground" />
                                Snapshot
                              </button>

                              {flag.status !== 'Resolved' && flag.status !== 'Dismissed' && (
                                <>
                                  <button
                                    onClick={() => handleLockThreadFromFlag(flag)}
                                    title="Lock thread and resolve flag"
                                    className="rounded-lg p-1 text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <Lock size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateFlagStatus(flag.id, 'Dismissed')}
                                    title="Dismiss flag as false positive"
                                    className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: KEYWORD MONITORS & POLICIES */}
        {/* ========================================================================= */}
        {selectedSection === 'Keyword monitors' && (
          <div className="mt-6 space-y-8">
            {/* Top Section: Monitored Keyword Dictionary */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-[15px] font-bold tracking-tight text-foreground">
                    Monitored Keyword & Pattern Dictionary
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Automated rule engine detects fee demands, off-platform redirects, and phishing links.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddRuleModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto"
                >
                  <Plus size={14} />
                  Add Keyword Rule
                </button>
              </div>

              {/* Filters for Keywords */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={keywordSearch}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    placeholder="Search keywords or patterns..."
                    className="w-full rounded-xl border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['All', 'Fee Solicitation', 'Off-Platform Contact', 'Spam / Phishing'] as KeywordCategoryFilter[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                          categoryFilter === cat
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Keyword Rules Table */}
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                        <th className="py-2.5 px-3.5">Keyword / Pattern</th>
                        <th className="py-2.5 px-3.5">Category</th>
                        <th className="py-2.5 px-3.5">Severity</th>
                        <th className="py-2.5 px-3.5">Action Trigger</th>
                        <th className="py-2.5 px-3.5 text-center">Rule Status</th>
                        <th className="py-2.5 px-3.5">Detection Activity</th>
                        <th className="py-2.5 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredKeywordRules.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center">
                            <EmptyState
                              title="No keyword rules found"
                              detail="No rules match your keyword search or category filter."
                            />
                          </td>
                        </tr>
                      ) : (
                        filteredKeywordRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-muted/30 transition-colors">
                            {/* Keyword */}
                            <td className="py-2.5 px-3.5">
                              <span className="font-mono font-bold text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/80">
                                {rule.keyword}
                              </span>
                            </td>

                            {/* Category */}
                            <td className="py-2.5 px-3.5 font-medium text-foreground">
                              {rule.category}
                            </td>

                            {/* Severity */}
                            <td className="py-2.5 px-3.5">
                              <StatusPill value={rule.severity} />
                            </td>

                            {/* Action Trigger */}
                            <td className="py-2.5 px-3.5">
                              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground">
                                {rule.action}
                              </span>
                            </td>

                            {/* Rule Status Toggle */}
                            <td className="py-2.5 px-3.5 text-center">
                              <button
                                onClick={() => handleToggleRuleActive(rule.id)}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                                  rule.isActive
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${rule.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                                {rule.isActive ? 'Active' : 'Disabled'}
                              </button>
                            </td>

                            {/* Detection Activity */}
                            <td className="py-2.5 px-3.5 text-muted-foreground">
                              <span className="font-medium text-foreground">{rule.hitCount} hits</span> • {rule.lastTriggered}
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditRuleModal(rule)}
                                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                  title="Edit rule"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteRule(rule.id)}
                                  className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                                  title="Delete rule"
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
            </div>

            {/* Bottom Section: Messaging Policy & Outreach Safeguards */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sliders size={18} className="text-primary" />
                    <h3 className="font-display text-[15px] font-bold tracking-tight text-foreground">
                      Outreach Limits & Attachment Safety Policies
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enforce platform anti-spam throttles, candidate cooldowns, and malware protection rules.
                  </p>
                </div>

                {policySavedNotice && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Policy settings updated successfully!
                  </div>
                )}
              </div>

              <form onSubmit={handleSavePolicies} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Card A: Employer Daily Outreach Limit */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Employer Daily Outreach Limit</label>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">MSG-3</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Maximum candidate outreach messages permitted per employer recruiter within a rolling 24-hour window.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        min={5}
                        max={500}
                        value={policyDailyLimit}
                        onChange={(e) => setPolicyDailyLimit(Number(e.target.value))}
                        className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <span className="text-xs font-medium text-muted-foreground">messages / day</span>
                    </div>
                  </div>

                  {/* Card B: Unresponsive Candidate Cooldown */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Unresponsive Candidate Cooldown</label>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">MSG-3</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Mandatory waiting period before an employer can re-contact a candidate who has not responded to initial outreach.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        min={1}
                        max={168}
                        value={policyCooldown}
                        onChange={(e) => setPolicyCooldown(Number(e.target.value))}
                        className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <span className="text-xs font-medium text-muted-foreground">hours cooldown</span>
                    </div>
                  </div>

                  {/* Card C: Attachment Safety */}
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Attachment Safety Controls</label>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">MSG-6</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Allowed file types:</span>
                        <div className="flex gap-1">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">PDF</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">DOCX</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span>Max attachment size:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={25}
                            value={policyMaxFileSize}
                            onChange={(e) => setPolicyMaxFileSize(Number(e.target.value))}
                            className="w-16 rounded border border-border bg-background px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"
                          />
                          <span className="text-xs font-medium">MB</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="font-medium text-foreground">Block Executables (.exe, .bat, .zip):</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={policyBlockScripts}
                            onChange={(e) => setPolicyBlockScripts(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetPolicies}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <RotateCcw size={13} className="text-muted-foreground" />
                    Reset Defaults
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Check size={14} />
                    Save Policy Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AUDIT TRANSCRIPTS */}
        {/* ========================================================================= */}
        {selectedSection === 'Audit transcripts' && (
          <div className="mt-6 space-y-4">
            {/* Casework Notification Feedback */}
            {reportActionNotice && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {reportActionNotice}
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  placeholder="Search reported casework by reporter, offending user, company, or reason..."
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Under Review', 'Investigating', 'Action Taken', 'Dismissed'] as ReportedThreadFilter[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setReportFilter(status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        reportFilter === status
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Reported Casework Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                      <th className="py-3 px-3.5">Report ID</th>
                      <th className="py-3 px-3.5">Reported By</th>
                      <th className="py-3 px-3.5">Offending User</th>
                      <th className="py-3 px-3.5">Organization</th>
                      <th className="py-3 px-3.5">Violation Reason</th>
                      <th className="py-3 px-3.5">Reported At</th>
                      <th className="py-3 px-3.5">Casework Status</th>
                      <th className="py-3 px-3.5 text-right">Casework Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredReportedThreads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center">
                          <EmptyState
                            title="No reported conversation casework"
                            detail="All candidate and employer reports have been resolved or none match active filters."
                          />
                        </td>
                      </tr>
                    ) : (
                      filteredReportedThreads.map((report) => (
                        <tr
                          key={report.id}
                          className="hover:bg-muted/30 transition-colors group cursor-pointer"
                          onClick={() => setSelectedReport(report)}
                        >
                          {/* Report ID */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <div className="font-bold text-foreground">{report.id}</div>
                            <div className="text-[10px] text-muted-foreground">{report.threadId}</div>
                          </td>

                          {/* Reported By */}
                          <td className="py-3 px-3.5">
                            <div className="font-semibold text-foreground">{report.reportedBy}</div>
                            <span className="inline-block mt-0.5 rounded bg-muted px-1.5 py-0.2 text-[9px] font-semibold text-muted-foreground">
                              {report.reporterRole}
                            </span>
                          </td>

                          {/* Offending User */}
                          <td className="py-3 px-3.5">
                            <div className="font-semibold text-rose-700">{report.offendingUser}</div>
                            <span className="inline-block mt-0.5 rounded bg-rose-50 px-1.5 py-0.2 text-[9px] font-semibold text-rose-700">
                              {report.offendingRole}
                            </span>
                          </td>

                          {/* Organization */}
                          <td className="py-3 px-3.5 font-medium text-foreground">
                            {report.organization}
                          </td>

                          {/* Violation Reason */}
                          <td className="py-3 px-3.5 max-w-[220px]">
                            <p className="line-clamp-2 text-foreground font-medium text-[11px]">
                              {report.violationReason}
                            </p>
                          </td>

                          {/* Reported At */}
                          <td className="py-3 px-3.5 text-muted-foreground whitespace-nowrap">
                            {report.reportedAt}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <StatusPill value={report.status} />
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedReport(report)}
                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                              >
                                <FileText size={12} className="text-muted-foreground" />
                                Audit Transcript
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
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: ACTIVE THREAD METADATA DETAILS (NO RAW MESSAGES - PRIVACY PRESERVED) */}
      {/* ========================================================================= */}
      {selectedConversation && (
        <Modal
          isOpen={!!selectedConversation}
          onClose={() => setSelectedConversation(null)}
          title={`Conversation Metadata — ${selectedConversation.id}`}
          eyebrow="Active Thread Oversight"
          subtitle="Direct metadata inspection without exposing private participant conversation contents."
          maxWidth="max-w-[560px]"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                {selectedConversation.status !== 'Locked' ? (
                  <button
                    onClick={() => handleToggleConversationStatus(selectedConversation.id, 'Locked')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    <Lock size={12} /> Lock Thread
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleConversationStatus(selectedConversation.id, 'Active')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <Unlock size={12} /> Unlock Thread
                  </button>
                )}
                {selectedConversation.status !== 'Archived' && (
                  <button
                    onClick={() => handleToggleConversationStatus(selectedConversation.id, 'Archived')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    Archive
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="rounded-xl border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Privacy protected callout */}
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900 leading-relaxed">
              <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-950">Privacy Model Active:</span> Message payload text is encrypted
                and hidden in this metadata oversight console. Full transcripts are accessible only upon automated keyword triggers or reported casework.
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Candidate</div>
                <div className="font-bold text-foreground text-sm">{selectedConversation.candidateName}</div>
                <div className="text-[11px] text-muted-foreground">ID: {selectedConversation.candidateId}</div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Recruiter / Employer</div>
                <div className="font-bold text-foreground text-sm">{selectedConversation.employerContactName}</div>
                <div className="text-[11px] text-muted-foreground">{selectedConversation.companyName} ({selectedConversation.employerId})</div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Job Context</div>
                <div className="font-bold text-foreground truncate">{selectedConversation.jobTitle}</div>
                <div className="text-[11px] text-muted-foreground">Job ID: {selectedConversation.jobId}</div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Current Thread Status</div>
                <div className="pt-1">
                  <StatusPill value={selectedConversation.status} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Started Date</div>
                <div className="font-medium text-foreground">{selectedConversation.startedDate}</div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Last Activity</div>
                <div className="font-medium text-foreground">{selectedConversation.lastActivity}</div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Message Volume</div>
                <div className="font-bold text-foreground">{selectedConversation.messageCount} total messages exchanged</div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Flagged State</div>
                <div>
                  {selectedConversation.isFlagged ? (
                    <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                      <AlertTriangle size={11} /> Flagged
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold text-[11px]">Clear / No Active Flags</span>
                  )}
                </div>
              </div>
            </div>

            {selectedConversation.isFlagged && selectedConversation.flagReason && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-900">
                <div className="font-bold flex items-center gap-1.5 text-rose-950 mb-1">
                  <AlertTriangle size={14} className="text-rose-600" />
                  Flag Reason
                </div>
                {selectedConversation.flagReason}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FLAGGED CONVERSATION SNAPSHOT */}
      {/* ========================================================================= */}
      {selectedFlag && (
        <Modal
          isOpen={!!selectedFlag}
          onClose={() => setSelectedFlag(null)}
          title={`Flagged Snapshot — ${selectedFlag.id}`}
          eyebrow="Trust & Safety Moderation"
          subtitle={`Automated rule hit on thread ${selectedFlag.threadId} (${selectedFlag.companyName})`}
          maxWidth="max-w-[620px]"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    handleLockThreadFromFlag(selectedFlag);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-2xs"
                >
                  <Lock size={12} /> Lock Thread
                </button>
                <button
                  onClick={() => {
                    handleUpdateFlagStatus(selectedFlag.id, 'Investigating', 'Escalated to Safety Casework for deeper review.');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                >
                  <AlertOctagon size={12} /> Escalate Casework
                </button>
                <button
                  onClick={() => {
                    handleUpdateFlagStatus(selectedFlag.id, 'Dismissed', 'Dismissed as false positive by admin.');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <XCircle size={12} /> Dismiss Flag
                </button>
              </div>
              <button
                onClick={() => setSelectedFlag(null)}
                className="rounded-xl border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Audit Notice */}
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 leading-relaxed">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-950">Audit & Moderation Notice:</span> Access to this flagged
                conversation snippet is restricted to compliance personnel. All viewings and actions taken are permanently logged in the audit trail.
              </div>
            </div>

            {/* Trigger Rule & Risk Score Card */}
            <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Trigger Rule</span>
                  <div className="text-xs font-bold text-foreground mt-0.5">{selectedFlag.triggerRule}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Risk Score</span>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    <span className="font-mono text-sm font-extrabold text-rose-600">{selectedFlag.riskScore} / 100</span>
                    <StatusPill value={selectedFlag.severity} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground">Matched Keyword:</span>{' '}
                  <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    "{selectedFlag.matchedKeyword}"
                  </span>
                </div>
                <div className="text-muted-foreground">Detected at: {selectedFlag.timestamp}</div>
              </div>
            </div>

            {/* Flagged Message Snippet Box */}
            <div className="rounded-xl border-2 border-rose-200 bg-rose-50/40 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950">
                <AlertOctagon size={14} className="text-rose-600" />
                Detected Offending Snippet:
              </div>
              <p className="font-mono text-xs text-foreground bg-white/80 p-2.5 rounded-lg border border-rose-100 italic shadow-2xs">
                "{selectedFlag.triggerSnippet}"
              </p>
            </div>

            {/* Surrounding Context Box */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare size={14} className="text-muted-foreground" />
                Surrounding Conversation Context:
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-border bg-muted/10 p-3 text-xs">
                {selectedFlag.surroundingContext.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border ${
                      msg.isOffender
                        ? 'bg-rose-50/60 border-rose-200'
                        : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span className={`font-semibold ${msg.isOffender ? 'text-rose-700' : 'text-foreground'}`}>
                        {msg.sender} {msg.isOffender && '(Offending Sender)'}
                      </span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs text-foreground">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Note if present */}
            {selectedFlag.resolutionNote && (
              <div className="rounded-lg bg-muted p-2.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Current Note:</span> {selectedFlag.resolutionNote}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD / EDIT KEYWORD RULE */}
      {/* ========================================================================= */}
      {isRuleModalOpen && (
        <Modal
          isOpen={isRuleModalOpen}
          onClose={() => setIsRuleModalOpen(false)}
          title={editingRule ? 'Edit Keyword Rule' : 'Add Keyword Monitor Rule'}
          eyebrow="Policy Configuration"
          subtitle="Configure proactive detection patterns for the automated Trust & Safety scanner."
          maxWidth="max-w-[480px]"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsRuleModalOpen(false)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="keyword-rule-form"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Check size={14} />
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </button>
            </div>
          }
        >
          <form id="keyword-rule-form" onSubmit={handleSaveRule} className="space-y-4 text-xs">
            {/* Keyword / Pattern input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Keyword or Regex Pattern *</label>
              <input
                type="text"
                required
                value={ruleKeyword}
                onChange={(e) => setRuleKeyword(e.target.value)}
                placeholder="e.g. deposit, wire transfer, bit.ly, WhatsApp"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Category *</label>
              <select
                value={ruleCategory}
                onChange={(e) => setRuleCategory(e.target.value as AdminKeywordRule['category'])}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Fee Solicitation">Fee Solicitation</option>
                <option value="Off-Platform Contact">Off-Platform Contact</option>
                <option value="Spam / Phishing">Spam / Phishing</option>
                <option value="Harassment">Harassment</option>
                <option value="Security Risk">Security Risk</option>
              </select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Severity *</label>
              <select
                value={ruleSeverity}
                onChange={(e) => setRuleSeverity(e.target.value as AdminKeywordRule['severity'])}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Critical">Critical (Immediate alert / lock candidate)</option>
                <option value="High">High (High priority queue)</option>
                <option value="Medium">Medium (Standard queue)</option>
              </select>
            </div>

            {/* Action Trigger */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Enforcement Action *</label>
              <select
                value={ruleAction}
                onChange={(e) => setRuleAction(e.target.value as AdminKeywordRule['action'])}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Auto-flag & Notify">Auto-flag & Notify (Send to moderation queue)</option>
                <option value="Block Message">Block Message (Drop payload & issue warning)</option>
                <option value="Warning Banner">Warning Banner (Inject cautionary banner)</option>
                <option value="Review Queue">Review Queue (Silent logging)</option>
              </select>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Enable rule immediately</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ruleIsActive}
                  onChange={(e) => setRuleIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: AUDIT TRANSCRIPT INSPECTION */}
      {/* ========================================================================= */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Audit Transcript — ${selectedReport.id}`}
          eyebrow="Casework Transcript Audit"
          subtitle={`Reported by ${selectedReport.reportedBy} (${selectedReport.reporterRole}) against ${selectedReport.offendingUser} (${selectedReport.organization})`}
          maxWidth="max-w-[700px]"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    handleUpdateReportStatus(selectedReport.id, 'Action Taken', 'Official disciplinary warning issued to offender.')
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                >
                  <AlertTriangle size={12} /> Warn User
                </button>
                <button
                  onClick={() =>
                    handleUpdateReportStatus(selectedReport.id, 'Action Taken', 'Thread permanently locked by safety audit.')
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-2xs"
                >
                  <Lock size={12} /> Lock Thread
                </button>
                <button
                  onClick={() =>
                    handleUpdateReportStatus(selectedReport.id, 'Action Taken', 'Account suspended pending legal compliance.')
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <Ban size={12} /> Suspend Account
                </button>
                <button
                  onClick={() =>
                    handleUpdateReportStatus(selectedReport.id, 'Dismissed', 'Report reviewed and dismissed as non-violative.')
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <XCircle size={12} /> Dismiss Report
                </button>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-xl border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Audit Notice Box */}
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 leading-relaxed">
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-blue-700 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-950">Safety Casework Authorization:</span> This chronological transcript
                is unmasked pursuant to active Trust & Safety investigation <span className="font-mono font-bold">{selectedReport.id}</span>.
                All admin interactions and actions are recorded in the immutable compliance log.
              </div>
            </div>

            {/* Violation Details summary */}
            <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reported Violation Reason</span>
                  <div className="font-semibold text-rose-700 mt-0.5">{selectedReport.violationReason}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</span>
                  <div className="mt-0.5">
                    <StatusPill value={selectedReport.status} />
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Reported at: {selectedReport.reportedAt}</span>
                <span>Evidence items: {selectedReport.messages.length} messages</span>
              </div>
              {selectedReport.resolutionNotes && (
                <div className="mt-1 pt-1.5 border-t border-border text-emerald-800 font-medium">
                  Resolution Note: {selectedReport.resolutionNotes}
                </div>
              )}
            </div>

            {/* Visual Chat Transcript Log */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-primary" />
                  Chronological Message Audit Transcript:
                </span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  Thread ID: {selectedReport.threadId}
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-3 rounded-xl border border-border bg-muted/15 p-4 text-xs">
                {selectedReport.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isOffender ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-muted-foreground">
                      <span className={`font-semibold ${msg.isOffender ? 'text-rose-700' : 'text-blue-700'}`}>
                        {msg.sender} ({msg.senderRole})
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                        msg.isReportedViolation
                          ? 'border-2 border-rose-300 bg-rose-50 text-rose-950 font-medium'
                          : msg.isOffender
                          ? 'border border-border bg-card text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {msg.isReportedViolation && (
                        <div className="flex items-center gap-1 font-bold text-[10px] text-rose-700 uppercase tracking-wider mb-1">
                          <AlertTriangle size={11} /> Reported Violation Message
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
