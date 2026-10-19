import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Video,
  Search,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Link2,
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Building2,
  Briefcase,
  Eye,
  Plus,
  RefreshCw,
  Check,
  MapPin,
  FileText,
  AlertCircle,
  Copy,
  Table as TableIcon,
  CalendarDays,
  Sparkles,
  Pencil,
  ArrowRight,
} from 'lucide-react';
import { Avatar, StatusPill, EmptyState, Modal } from '../components/ui';
import {
  adminInterviews,
  adminInterviewDisputes,
  adminMeetingLinkRules,
  adminInterviewPrepLinks,
  AdminInterviewRecord,
  AdminInterviewDispute,
  AdminMeetingLinkRules,
  AdminInterviewPrepLink,
} from '../mock-data';
import { CurriculumBuilderView } from './CurriculumBuilder';

type TopTab = 'All Interviews' | 'Disputes' | 'Meeting-link Rules' | 'Prep Content' | 'Curriculum Builder';
type StatusFilter = 'All' | 'Scheduled & Confirmed' | 'Feedback Pending' | 'Completed' | 'No-show / Cancelled';
type ViewMode = 'table' | 'calendar';

export function InterviewsPage() {
  const navigate = useNavigate();
  // Navigation
  const [activeTab, setActiveTab] = useState<TopTab>('All Interviews');

  // --- TAB 1: ALL INTERVIEWS STATE ---
  const [interviewFilter, setInterviewFilter] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedInterview, setSelectedInterview] = useState<AdminInterviewRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // --- TAB 2: DISPUTES STATE ---
  const [disputes, setDisputes] = useState<AdminInterviewDispute[]>(adminInterviewDisputes);
  const [disputeFilter, setDisputeFilter] = useState<'All' | 'Pending Review' | 'Investigating' | 'Resolved' | 'Dismissed'>('All');
  const [selectedDispute, setSelectedDispute] = useState<AdminInterviewDispute | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');
  const [disputeFeedback, setDisputeFeedback] = useState<string | null>(null);

  // --- TAB 3: MEETING-LINK RULES STATE ---
  const [rules, setRules] = useState<AdminMeetingLinkRules>(adminMeetingLinkRules);
  const [rulesMessage, setRulesMessage] = useState<string | null>(null);

  // --- TAB 4: PREP CONTENT STATE ---
  const [prepLinks, setPrepLinks] = useState<AdminInterviewPrepLink[]>(adminInterviewPrepLinks);
  const [isAddPrepModalOpen, setIsAddPrepModalOpen] = useState(false);
  const [editingPrepItem, setEditingPrepItem] = useState<AdminInterviewPrepLink | null>(null);
  const [previewCandidateItem, setPreviewCandidateItem] = useState<AdminInterviewPrepLink | null>(null);
  const [prepFeedback, setPrepFeedback] = useState<string | null>(null);

  // Prep Form State
  const [prepFormTitle, setPrepFormTitle] = useState('');
  const [prepFormCategory, setPrepFormCategory] = useState('Engineering & Tech');
  const [prepFormRole, setPrepFormRole] = useState('');
  const [prepFormTrigger, setPrepFormTrigger] = useState<'Interview confirmation email' | 'Candidate dashboard / in-app banner' | '24-hour reminder'>('Interview confirmation email');
  const [prepFormStatus, setPrepFormStatus] = useState<'Active' | 'Draft' | 'Archived'>('Active');
  const [prepFormSummary, setPrepFormSummary] = useState('');
  const [prepFormReadTime, setPrepFormReadTime] = useState('8 min read');

  // --- FILTERED INTERVIEWS ---
  const filteredInterviews = useMemo(() => {
    return adminInterviews.filter((item) => {
      // Status filter
      if (interviewFilter === 'Scheduled & Confirmed') {
        if (item.status !== 'Scheduled' && item.status !== 'Confirmed') return false;
      } else if (interviewFilter === 'Feedback Pending') {
        if (item.status !== 'Feedback Pending') return false;
      } else if (interviewFilter === 'Completed') {
        if (item.status !== 'Completed') return false;
      } else if (interviewFilter === 'No-show / Cancelled') {
        if (item.status !== 'No-show' && item.status !== 'Cancelled') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCandidate = item.candidateName.toLowerCase().includes(q);
        const matchesCompany = item.companyName.toLowerCase().includes(q);
        const matchesRole = item.jobTitle.toLowerCase().includes(q);
        const matchesInterviewer = item.interviewerName.toLowerCase().includes(q);
        const matchesProvider = item.provider.toLowerCase().includes(q);
        if (!matchesCandidate && !matchesCompany && !matchesRole && !matchesInterviewer && !matchesProvider) {
          return false;
        }
      }

      return true;
    });
  }, [interviewFilter, searchQuery]);

  // --- AGENDA GROUPED CHRONOLOGICALLY ---
  const agendaGrouped = useMemo(() => {
    // Sort chronologically by date
    const sorted = [...filteredInterviews].sort((a, b) => {
      const getDay = (str: string) => {
        const match = str.match(/Oct (\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getDay(a.dateTime) - getDay(b.dateTime);
    });

    const groups: Record<string, AdminInterviewRecord[]> = {};
    for (const item of sorted) {
      const datePart = item.dateTime.split('·')[0].trim();
      if (!groups[datePart]) {
        groups[datePart] = [];
      }
      groups[datePart].push(item);
    }
    return groups;
  }, [filteredInterviews]);

  // --- FILTERED DISPUTES ---
  const filteredDisputes = useMemo(() => {
    return disputes.filter((dsp) => {
      if (disputeFilter === 'All') return true;
      return dsp.status === disputeFilter;
    });
  }, [disputes, disputeFilter]);

  // Handlers for Disputes
  const handleDisputeAction = (
    actionType: 'cancel' | 'reschedule' | 'strike' | 'resolve' | 'dismiss'
  ) => {
    if (!selectedDispute) return;

    let updatedStatus: 'Pending Review' | 'Investigating' | 'Resolved' | 'Dismissed' = 'Resolved';
    let defaultNote = '';

    if (actionType === 'cancel') {
      updatedStatus = 'Resolved';
      defaultNote = 'Interview officially cancelled following dispute review. Candidate issued priority reschedule voucher.';
      setDisputeFeedback(`Dispute #${selectedDispute.id}: Interview cancelled and case marked as Resolved.`);
    } else if (actionType === 'reschedule') {
      updatedStatus = 'Resolved';
      defaultNote = 'Reschedule authorization granted without applicant penalty. Recruiter calendar invite reset.';
      setDisputeFeedback(`Dispute #${selectedDispute.id}: Reschedule notice issued to both parties.`);
    } else if (actionType === 'strike') {
      updatedStatus = 'Investigating';
      defaultNote = 'Formal compliance strike issued to employer account. Trust & safety investigation escalated.';
      setDisputeFeedback(`Dispute #${selectedDispute.id}: Account flagged with Compliance Strike 1.`);
    } else if (actionType === 'resolve') {
      updatedStatus = 'Resolved';
      defaultNote = resolutionInput.trim() || 'Dispute resolved following administrative verification.';
      setDisputeFeedback(`Dispute #${selectedDispute.id}: Marked as Resolved.`);
    } else if (actionType === 'dismiss') {
      updatedStatus = 'Dismissed';
      defaultNote = resolutionInput.trim() || 'Dispute reviewed and dismissed as unsubstantiated.';
      setDisputeFeedback(`Dispute #${selectedDispute.id}: Case dismissed.`);
    }

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              status: updatedStatus,
              resolutionNotes: resolutionInput.trim() || defaultNote,
            }
          : d
      )
    );

    setSelectedDispute(null);
    setResolutionInput('');
  };

  // Handlers for Prep Content
  const openAddPrepModal = () => {
    setPrepFormTitle('');
    setPrepFormCategory('Engineering & Tech');
    setPrepFormRole('');
    setPrepFormTrigger('Interview confirmation email');
    setPrepFormStatus('Active');
    setPrepFormSummary('');
    setPrepFormReadTime('8 min read');
    setIsAddPrepModalOpen(true);
  };

  const openEditPrepModal = (item: AdminInterviewPrepLink) => {
    setEditingPrepItem(item);
    setPrepFormTitle(item.title);
    setPrepFormCategory(item.targetCategory);
    setPrepFormRole(item.targetRole);
    setPrepFormTrigger(item.deliveryTrigger);
    setPrepFormStatus(item.status);
    setPrepFormSummary(item.summary);
    setPrepFormReadTime(item.estimatedReadTime);
  };

  const handleSavePrepLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prepFormTitle.trim()) return;

    if (editingPrepItem) {
      setPrepLinks((prev) =>
        prev.map((p) =>
          p.id === editingPrepItem.id
            ? {
                ...p,
                title: prepFormTitle.trim(),
                targetCategory: prepFormCategory,
                targetRole: prepFormRole.trim() || 'All Candidates',
                deliveryTrigger: prepFormTrigger,
                status: prepFormStatus,
                summary: prepFormSummary.trim() || p.summary,
                estimatedReadTime: prepFormReadTime.trim() || p.estimatedReadTime,
                lastUpdated: 'Just now',
              }
            : p
        )
      );
      setPrepFeedback(`Prep guide "${prepFormTitle.trim()}" updated successfully.`);
      setEditingPrepItem(null);
    } else {
      const newRecord: AdminInterviewPrepLink = {
        id: `prep-${Date.now().toString().slice(-4)}`,
        title: prepFormTitle.trim(),
        targetCategory: prepFormCategory,
        targetRole: prepFormRole.trim() || 'All Candidates',
        deliveryTrigger: prepFormTrigger,
        status: prepFormStatus,
        articleSlug: prepFormTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        estimatedReadTime: prepFormReadTime.trim() || '7 min read',
        summary: prepFormSummary.trim() || 'Curated career guidance and tactical interview prep strategies.',
        keyTopics: ['Preparation Framework', 'Core Competencies', 'Follow-up Protocol'],
        lastUpdated: 'Today',
      };
      setPrepLinks((prev) => [newRecord, ...prev]);
      setPrepFeedback(`New prep guide "${prepFormTitle.trim()}" linked to candidate workflow.`);
      setIsAddPrepModalOpen(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. TOP KPI SUMMARY CARDS */}
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Scheduled today', '14', 'Confirmed interviews across employers'],
          ['Awaiting feedback', '6', 'Interviews requiring employer evaluation'],
          ['Completion rate', '94.2%', 'Completed vs no-show rate (30d)'],
        ].map(([label, value, detail]) => (
          <article
            key={label}
            className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)]"
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
            <div className="mt-2 truncate font-display text-[22px] font-extrabold tracking-tight">
              {value}
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">{detail}</div>
          </article>
        ))}
      </section>

      {/* 2. MAIN OVERSIGHT CARD CONTAINER */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary">
              <Calendar size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[18px] font-extrabold tracking-tight">
                  Interview scheduling & oversight
                </h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  PRD v2.0
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground max-w-2xl">
                Supervise video meeting coordination across marketplace employers, enforce link safety rules, review candidate disputes, and link career prep materials.
              </p>
            </div>
          </div>
        </div>

        {/* TOP-LEVEL TABS (PRD MODULES) */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
          {(
            [
              ['All Interviews', `${adminInterviews.length}`],
              ['Disputes', `${disputes.filter((d) => d.status === 'Pending Review' || d.status === 'Investigating').length} pending`],
              ['Meeting-link Rules', 'Rules'],
              ['Prep Content', `${prepLinks.length}`],
              ['Curriculum Builder', 'EXT-3'],
            ] as const
          ).map(([tab, badge]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[12px] font-bold transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                  activeTab === tab
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {badge}
              </span>
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: ALL INTERVIEWS                                         */}
        {/* ============================================================== */}
        {activeTab === 'All Interviews' && (
          <div className="mt-5 space-y-4">
            {/* Toolbar: Search, Status Filters, View Switcher */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate, company, role, or interviewer…"
                  className="h-9 w-full rounded-xl border border-border bg-background pl-8.5 pr-8 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-[10px]"
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* View Switcher: Table vs Calendar / Agenda */}
              <div className="flex items-center gap-1.5 self-end lg:self-auto rounded-xl border border-border bg-muted/30 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                    viewMode === 'table'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TableIcon size={13} />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CalendarDays size={13} />
                  <span>Calendar / Agenda</span>
                </button>
              </div>
            </div>

            {/* Preserved Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {(
                [
                  'All',
                  'Scheduled & Confirmed',
                  'Feedback Pending',
                  'Completed',
                  'No-show / Cancelled',
                ] as StatusFilter[]
              ).map((filterOption) => {
                const count = adminInterviews.filter((item) => {
                  if (filterOption === 'All') return true;
                  if (filterOption === 'Scheduled & Confirmed')
                    return item.status === 'Scheduled' || item.status === 'Confirmed';
                  if (filterOption === 'Feedback Pending')
                    return item.status === 'Feedback Pending';
                  if (filterOption === 'Completed') return item.status === 'Completed';
                  if (filterOption === 'No-show / Cancelled')
                    return item.status === 'No-show' || item.status === 'Cancelled';
                  return true;
                }).length;

                return (
                  <button
                    key={filterOption}
                    onClick={() => setInterviewFilter(filterOption)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      interviewFilter === filterOption
                        ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                        : 'border border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <span>{filterOption}</span>
                    <span
                      className={`rounded-full px-1 text-[9px] font-bold ${
                        interviewFilter === filterOption
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3A. TABLE VIEW */}
            {viewMode === 'table' && (
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                {filteredInterviews.length === 0 ? (
                  <EmptyState
                    title="No interviews found"
                    detail="Try clearing your search term or adjusting status filters."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[12px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <th className="py-3 px-3.5">Candidate</th>
                          <th className="py-3 px-3.5">Company</th>
                          <th className="py-3 px-3.5">Role</th>
                          <th className="py-3 px-3.5">Date / Time</th>
                          <th className="py-3 px-3.5">Provider / Format</th>
                          <th className="py-3 px-3.5">Status</th>
                          <th className="py-3 px-3.5">Join Link</th>
                          <th className="py-3 px-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredInterviews.map((interview) => (
                          <tr
                            key={interview.id}
                            className="hover:bg-muted/30 transition-colors group"
                          >
                            {/* Candidate */}
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={interview.candidateName} />
                                <div>
                                  <div className="font-bold text-foreground">
                                    {interview.candidateName}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground font-mono">
                                    {interview.candidateId}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Company */}
                            <td className="py-3 px-3.5">
                              <div className="font-semibold text-foreground">
                                {interview.companyName}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {interview.companyId}
                              </div>
                            </td>

                            {/* Role */}
                            <td className="py-3 px-3.5">
                              <div className="font-medium text-foreground">
                                {interview.jobTitle}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {interview.duration} · {interview.format}
                              </div>
                            </td>

                            {/* Date / Time */}
                            <td className="py-3 px-3.5">
                              <div className="font-medium text-foreground">
                                {interview.dateTime}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {interview.timezone}
                              </div>
                            </td>

                            {/* Provider / Format */}
                            <td className="py-3 px-3.5">
                              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/20 px-2 py-0.5 text-[11px] font-medium text-foreground">
                                <Video size={11} className="text-primary" />
                                {interview.provider}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3.5">
                              <StatusPill value={interview.status} />
                            </td>

                            {/* Join Link */}
                            <td className="py-3 px-3.5">
                              {interview.meetingLink ? (
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 hover:border-primary/40"
                                >
                                  <Video size={12} />
                                  <span>Join Meeting</span>
                                  <ExternalLink size={10} className="opacity-60" />
                                </a>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <MapPin size={11} />
                                  {interview.location || 'On-site'}
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => navigate(`/admin/interviews/${interview.id}`)}
                                className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-accent hover:border-border/80 transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3B. CALENDAR / AGENDA VIEW */}
            {viewMode === 'calendar' && (
              <div className="space-y-4">
                {Object.keys(agendaGrouped).length === 0 ? (
                  <EmptyState
                    title="No interviews scheduled in this view"
                    detail="Adjust your status filter or search parameters to see upcoming timeline events."
                  />
                ) : (
                  Object.entries(agendaGrouped).map(([dateLabel, items]) => (
                    <div
                      key={dateLabel}
                      className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs"
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-primary" />
                          <span className="font-display text-[13px] font-extrabold tracking-tight text-foreground">
                            {dateLabel}
                          </span>
                        </div>
                        <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-bold text-muted-foreground border border-border">
                          {items.length} {items.length === 1 ? 'interview' : 'interviews'}
                        </span>
                      </div>

                      {/* Day Sessions List */}
                      <div className="divide-y divide-border/60">
                        {items.map((session) => (
                          <div
                            key={session.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/20 transition-colors gap-3"
                          >
                            {/* Left: Time badge & Candidate info */}
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-center min-w-[95px] shrink-0">
                                <span className="text-[12px] font-extrabold text-primary">
                                  {session.dateTime.split('·')[1]?.trim() || session.dateTime}
                                </span>
                                <span className="text-[9px] font-semibold text-muted-foreground">
                                  {session.duration}
                                </span>
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <Avatar name={session.candidateName} />
                                  <span className="font-bold text-foreground text-[13px]">
                                    {session.candidateName}
                                  </span>
                                  <StatusPill value={session.status} />
                                </div>
                                <div className="mt-1 text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-foreground">
                                    {session.jobTitle}
                                  </span>
                                  <span>·</span>
                                  <span>{session.companyName}</span>
                                  <span>·</span>
                                  <span className="inline-flex items-center gap-1">
                                    <User size={10} />
                                    Interviewer: {session.interviewerName} ({session.interviewerTitle})
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Quick actions */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                              <span className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                                <Video size={11} className="text-primary" />
                                {session.provider}
                              </span>

                              {session.meetingLink && (
                                <a
                                  href={session.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors"
                                >
                                  <Video size={12} />
                                  <span>Join</span>
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => navigate(`/admin/interviews/${session.id}`)}
                                className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DISPUTES (INT-3)                                        */}
        {/* ============================================================== */}
        {activeTab === 'Disputes' && (
          <div className="mt-5 space-y-4">
            {/* Feedback alert */}
            {disputeFeedback && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] font-medium text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{disputeFeedback}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDisputeFeedback(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    'All',
                    'Pending Review',
                    'Investigating',
                    'Resolved',
                    'Dismissed',
                  ] as const
                ).map((filterOpt) => {
                  const count = disputes.filter((d) =>
                    filterOpt === 'All' ? true : d.status === filterOpt
                  ).length;
                  return (
                    <button
                      key={filterOpt}
                      onClick={() => setDisputeFilter(filterOpt)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        disputeFilter === filterOpt
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'border border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      <span>{filterOpt}</span>
                      <span
                        className={`rounded-full px-1 text-[9px] font-bold ${
                          disputeFilter === filterOpt
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-muted-foreground">
                Casework resolution queue for candidate & employer interview incidents
              </div>
            </div>

            {/* Disputes Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              {filteredDisputes.length === 0 ? (
                <EmptyState
                  title="No disputes found"
                  detail="All candidate and employer interview sessions currently operate without open dispute complaints."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[12px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="py-3 px-3.5">Dispute ID</th>
                        <th className="py-3 px-3.5">Candidate / Role</th>
                        <th className="py-3 px-3.5">Company</th>
                        <th className="py-3 px-3.5">Filing Party</th>
                        <th className="py-3 px-3.5">Reason</th>
                        <th className="py-3 px-3.5">Filing Date</th>
                        <th className="py-3 px-3.5">Status</th>
                        <th className="py-3 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredDisputes.map((dsp) => (
                        <tr
                          key={dsp.id}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          <td className="py-3 px-3.5 font-mono font-bold text-foreground">
                            {dsp.id}
                          </td>

                          <td className="py-3 px-3.5">
                            <div className="font-bold text-foreground">
                              {dsp.candidateName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {dsp.jobTitle}
                            </div>
                          </td>

                          <td className="py-3 px-3.5">
                            <div className="font-semibold text-foreground">
                              {dsp.companyName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              Ref: {dsp.interviewId}
                            </div>
                          </td>

                          <td className="py-3 px-3.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                dsp.filingParty === 'Employer'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {dsp.filingParty}
                            </span>
                            <div className="mt-0.5 text-[10px] text-muted-foreground">
                              {dsp.filerName}
                            </div>
                          </td>

                          <td className="py-3 px-3.5">
                            <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                              <AlertTriangle size={11} className="shrink-0 text-amber-600" />
                              {dsp.reason}
                            </span>
                          </td>

                          <td className="py-3 px-3.5 text-[11px] text-muted-foreground">
                            {dsp.filingDate}
                          </td>

                          <td className="py-3 px-3.5">
                            <StatusPill value={dsp.status} />
                          </td>

                          <td className="py-3 px-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/interviews/disputes/${dsp.id}`)}
                              className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                            >
                              Review Dispute
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MEETING-LINK RULES (INT-4)                              */}
        {/* ============================================================== */}
        {activeTab === 'Meeting-link Rules' && (
          <div className="mt-5 space-y-6 max-w-4xl">
            {/* Rules saved confirmation alert */}
            {rulesMessage && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] font-medium text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{rulesMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRulesMessage(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Rule Group 1: Provider Whitelist */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[15px] font-extrabold text-foreground flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    Authorized Video Providers (Whitelist)
                  </h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Only whitelisted conference platforms can be attached to confirmed candidate interview invitations.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    key: 'googleMeet',
                    label: 'Google Meet',
                    domain: 'meet.google.com/*',
                    desc: 'Default cloud meeting provider for Google Calendar integration.',
                    active: rules.allowedProviders.googleMeet,
                  },
                  {
                    key: 'zoom',
                    label: 'Zoom Video',
                    domain: '*.zoom.us/j/*',
                    desc: 'Enterprise video bridge with passcode enforcement.',
                    active: rules.allowedProviders.zoom,
                  },
                  {
                    key: 'microsoftTeams',
                    label: 'Microsoft Teams',
                    domain: 'teams.microsoft.com/*',
                    desc: 'Corporate tenant rooms and Azure AD calendar links.',
                    active: rules.allowedProviders.microsoftTeams,
                  },
                  {
                    key: 'webex',
                    label: 'Cisco Webex',
                    domain: '*.webex.com/meet/*',
                    desc: 'Enterprise Cisco conferencing bridge.',
                    active: rules.allowedProviders.webex,
                  },
                ].map((prov) => (
                  <label
                    key={prov.key}
                    className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      prov.active
                        ? 'border-primary/40 bg-primary/[0.02]'
                        : 'border-border bg-muted/20 opacity-75'
                    }`}
                  >
                    <div className="space-y-1 pr-3">
                      <div className="font-bold text-foreground text-[12px] flex items-center gap-1.5">
                        <Video size={13} className="text-primary" />
                        {prov.label}
                      </div>
                      <div className="font-mono text-[10px] text-primary/80">
                        {prov.domain}
                      </div>
                      <div className="text-[10px] text-muted-foreground leading-normal">
                        {prov.desc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={prov.active}
                      onChange={(e) =>
                        setRules((r) => ({
                          ...r,
                          allowedProviders: {
                            ...r.allowedProviders,
                            [prov.key]: e.target.checked,
                          },
                        }))
                      }
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Rule Group 2: Anti-Phishing & Link Security */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <h3 className="font-display text-[15px] font-extrabold text-foreground flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-600" />
                Anti-Phishing & Domain Security Controls
              </h3>

              <div className="space-y-3">
                {/* Shortener Blocker */}
                <div className="flex items-start justify-between p-3.5 rounded-xl border border-border bg-muted/10 gap-4">
                  <div>
                    <div className="font-bold text-foreground text-[12px] flex items-center gap-1.5">
                      <span>Block Obfuscated URL Shorteners</span>
                      <span className="rounded-full bg-rose-50 text-rose-700 px-1.5 py-0.2 text-[9px] font-bold border border-rose-200">
                        Strict Security
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Automatically reject meeting links containing known URL masking services to prevent credential harvesting.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {rules.blockedShortenersList.map((domain) => (
                        <span
                          key={domain}
                          className="font-mono text-[10px] rounded-md border border-border bg-card px-1.5 py-0.5 text-muted-foreground"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.blockUrlShorteners}
                    onChange={(e) =>
                      setRules((r) => ({ ...r, blockUrlShorteners: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                </div>

                {/* Custom Domains */}
                <div className="flex items-start justify-between p-3.5 rounded-xl border border-border bg-muted/10 gap-4">
                  <div>
                    <div className="font-bold text-foreground text-[12px]">
                      Allow Custom Corporate Vanity Domains
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      When disabled, employers can only supply standard provider root domains. When enabled, approved enterprise subdomains (e.g. `company.zoom.us`) are permitted.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.allowCustomDomains}
                    onChange={(e) =>
                      setRules((r) => ({ ...r, allowCustomDomains: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                </div>

                {/* Host Validation */}
                <div className="flex items-start justify-between p-3.5 rounded-xl border border-border bg-muted/10 gap-4">
                  <div>
                    <div className="font-bold text-foreground text-[12px]">
                      Enforce Verified Host Domain Match
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Verify that the scheduling recruiter's registered corporate email domain matches the company organization on file.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.enforceHostValidation}
                    onChange={(e) =>
                      setRules((r) => ({ ...r, enforceHostValidation: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Rule Group 3: Timing & Activation Controls */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
              <h3 className="font-display text-[15px] font-extrabold text-foreground flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Access Windows & Calendar Integration
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Join button activation slider */}
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-bold text-foreground">
                      Candidate "Join Meeting" Activation Window
                    </span>
                    <span className="font-mono font-bold text-primary">
                      {rules.joinWindowMinutesBefore} min prior
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Controls how many minutes before the scheduled start time the candidate-facing "Join Interview" button becomes clickable.
                  </p>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={rules.joinWindowMinutesBefore}
                    onChange={(e) =>
                      setRules((r) => ({
                        ...r,
                        joinWindowMinutesBefore: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>5 min</span>
                    <span>15 min (Recommended)</span>
                    <span>30 min</span>
                  </div>
                </div>

                {/* Expiry window */}
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-bold text-foreground">
                      Link Expiry Post-Session
                    </span>
                    <span className="font-mono font-bold text-primary">
                      {rules.linkExpiryMinutesAfter} min post
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Duration after the scheduled interview completion when join credentials are archived and disabled.
                  </p>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={rules.linkExpiryMinutesAfter}
                    onChange={(e) =>
                      setRules((r) => ({
                        ...r,
                        linkExpiryMinutesAfter: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>15 min</span>
                    <span>60 min (Default)</span>
                    <span>120 min</span>
                  </div>
                </div>
              </div>

              {/* Automatic ICS invite */}
              <div className="flex items-start justify-between p-3.5 rounded-xl border border-border bg-muted/10 gap-4">
                <div>
                  <div className="font-bold text-foreground text-[12px]">
                    Automatic Calendar Invite (.ICS) Generation
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Automatically generate RFC-5545 compliant .ICS calendar attachment sent with email confirmation to candidates and employers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={rules.autoGenerateCalendarInvite}
                  onChange={(e) =>
                    setRules((r) => ({
                      ...r,
                      autoGenerateCalendarInvite: e.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-muted-foreground">
                Last updated: <span className="font-medium text-foreground">{rules.lastUpdated}</span> by {rules.updatedBy}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setRules({ ...adminMeetingLinkRules });
                    setRulesMessage('Rules restored to JobRisers platform defaults.');
                  }}
                  className="rounded-xl border border-border bg-card px-3.5 py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRulesMessage('Meeting-link security rules updated and applied to marketplace sessions.');
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PREP CONTENT (INT-8)                                    */}
        {/* ============================================================== */}
        {activeTab === 'Prep Content' && (
          <div className="mt-5 space-y-4">
            {/* Feedback alert */}
            {prepFeedback && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] font-medium text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{prepFeedback}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPrepFeedback(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-[15px] font-extrabold text-foreground">
                  Interview Preparation & Guidance Workflows
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Connect CMS advice articles to automated interview confirmation emails and candidate dashboards.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddPrepModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-auto"
              >
                <Plus size={13} />
                <span>Link Content</span>
              </button>
            </div>

            {/* Prep Content Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="py-3 px-3.5">Guide / Article Title</th>
                      <th className="py-3 px-3.5">Target Category & Role</th>
                      <th className="py-3 px-3.5">Delivery Trigger</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5">Read Time</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {prepLinks.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Title */}
                        <td className="py-3 px-3.5 max-w-[280px]">
                          <div className="font-bold text-foreground">
                            {item.title}
                          </div>
                          <div className="font-mono text-[10px] text-muted-foreground truncate">
                            slug: /{item.articleSlug}
                          </div>
                        </td>

                        {/* Category & Role */}
                        <td className="py-3 px-3.5">
                          <div className="font-medium text-foreground">
                            {item.targetCategory}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {item.targetRole}
                          </div>
                        </td>

                        {/* Delivery Trigger */}
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            <Sparkles size={10} />
                            {item.deliveryTrigger}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3.5">
                          <StatusPill value={item.status} />
                        </td>

                        {/* Read Time / Updated */}
                        <td className="py-3 px-3.5">
                          <div className="text-[11px] font-medium text-foreground">
                            {item.estimatedReadTime}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Updated {item.lastUpdated}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewCandidateItem(item)}
                              title="Preview Candidate Card"
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                            >
                              <Eye size={12} />
                              <span className="hidden sm:inline">Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditPrepModal(item)}
                              title="Edit Link Configuration"
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                            >
                              <Pencil size={12} />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CURRICULUM BUILDER (EXT-3) */}
        {activeTab === 'Curriculum Builder' && (
          <div className="mt-5">
            <CurriculumBuilderView />
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* MODAL 1: INTERVIEW DETAILS MODAL (ALL INTERVIEWS)              */}
      {/* ============================================================== */}
      <Modal
        isOpen={Boolean(selectedInterview)}
        onClose={() => {
          setSelectedInterview(null);
          setCopiedLink(false);
        }}
        eyebrow="MARKETPLACE INTERVIEW OVERSIGHT"
        title={selectedInterview?.jobTitle || 'Interview Details'}
        subtitle={
          selectedInterview
            ? `${selectedInterview.candidateName} with ${selectedInterview.companyName} (${selectedInterview.id})`
            : undefined
        }
        maxWidth="max-w-[560px]"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-[10px] font-mono text-muted-foreground">
              ID: {selectedInterview?.id}
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedInterview(null);
                setCopiedLink(false);
              }}
              className="rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        }
      >
        {selectedInterview && (
          <div className="space-y-4 text-[12px]">
            {/* Status & Provider Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Status:
                </span>
                <StatusPill value={selectedInterview.status} />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                <Video size={13} className="text-primary" />
                <span>{selectedInterview.provider}</span>
                <span className="text-muted-foreground">({selectedInterview.format})</span>
              </div>
            </div>

            {/* Candidate & Employer Context Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <User size={11} />
                  Candidate
                </div>
                <div className="font-bold text-foreground text-[13px]">
                  {selectedInterview.candidateName}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  Ref: {selectedInterview.candidateId}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Building2 size={11} />
                  Hiring Company
                </div>
                <div className="font-bold text-foreground text-[13px]">
                  {selectedInterview.companyName}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  Ref: {selectedInterview.companyId}
                </div>
              </div>
            </div>

            {/* Schedule & Duration */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-2">
              <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Clock size={11} />
                Schedule & Timezone
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Date / Time:</span>{' '}
                  <span className="font-semibold text-foreground">
                    {selectedInterview.dateTime}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timezone:</span>{' '}
                  <span className="font-semibold text-foreground">
                    {selectedInterview.timezone}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>{' '}
                  <span className="font-semibold text-foreground">
                    {selectedInterview.duration}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Interviewer:</span>{' '}
                  <span className="font-semibold text-foreground">
                    {selectedInterview.interviewerName}
                  </span>{' '}
                  <span className="text-[10px] text-muted-foreground">
                    ({selectedInterview.interviewerTitle})
                  </span>
                </div>
              </div>
            </div>

            {/* Meeting Link or On-site Location */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-2">
              <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Link2 size={11} />
                Meeting Access Coordinates
              </div>
              {selectedInterview.meetingLink ? (
                <div className="flex items-center justify-between gap-2 p-2 rounded-lg border border-primary/20 bg-primary/5">
                  <span className="font-mono text-[11px] text-primary truncate">
                    {selectedInterview.meetingLink}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedInterview.meetingLink) {
                          navigator.clipboard.writeText(selectedInterview.meetingLink);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }
                      }}
                      className="rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Copy meeting link"
                    >
                      {copiedLink ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <a
                      href={selectedInterview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
                    >
                      <span>Join</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <MapPin size={13} className="text-primary" />
                  <span>
                    Location: {selectedInterview.location || 'Bandra Kurla Complex, Mumbai (On-site HQ)'}
                  </span>
                </div>
              )}
            </div>

            {/* Assessment Notes */}
            {selectedInterview.notes && (
              <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <FileText size={11} />
                  Session Notes / Evaluation Brief
                </div>
                <p className="text-[11px] leading-relaxed text-foreground">
                  {selectedInterview.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: DISPUTE CASEWORK MODAL (DISPUTES)                     */}
      {/* ============================================================== */}
      <Modal
        isOpen={Boolean(selectedDispute)}
        onClose={() => {
          setSelectedDispute(null);
          setResolutionInput('');
        }}
        eyebrow="INTERVIEW DISPUTE CASEWORK"
        title={selectedDispute ? `Case #${selectedDispute.id}: ${selectedDispute.reason}` : ''}
        subtitle={
          selectedDispute
            ? `Filed by ${selectedDispute.filingParty} (${selectedDispute.filerName}) on ${selectedDispute.filingDate}`
            : undefined
        }
        maxWidth="max-w-[620px]"
        footer={
          <div className="flex flex-wrap items-center justify-between w-full gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedDispute(null);
                setResolutionInput('');
              }}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
            >
              Close
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDisputeAction('dismiss')}
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted"
              >
                Dismiss Case
              </button>
              <button
                type="button"
                onClick={() => handleDisputeAction('resolve')}
                className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                Resolve Case
              </button>
            </div>
          </div>
        }
      >
        {selectedDispute && (
          <div className="space-y-4 text-[12px]">
            {/* Status & Filing Summary */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Current Status:
                </span>
                <StatusPill value={selectedDispute.status} />
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                Interview Ref: {selectedDispute.interviewId}
              </span>
            </div>

            {/* Related Interview Context */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">
                  Candidate
                </div>
                <div className="font-bold text-foreground">
                  {selectedDispute.candidateName}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Role: {selectedDispute.jobTitle}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">
                  Employer
                </div>
                <div className="font-bold text-foreground">
                  {selectedDispute.companyName}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Scheduled: {selectedDispute.scheduledTime}
                </div>
              </div>
            </div>

            {/* Complaint Statement */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                <AlertCircle size={14} className="text-amber-700" />
                Filing Statement ({selectedDispute.filingParty}):
              </div>
              <p className="text-[11px] leading-relaxed text-amber-950">
                "{selectedDispute.description}"
              </p>
            </div>

            {/* Quick Casework Actions */}
            <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Casework Intervention Actions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDisputeAction('cancel')}
                  className="rounded-lg border border-border bg-muted/40 p-2 text-left hover:border-rose-300 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="font-bold text-foreground text-[11px] text-rose-700">
                    Cancel Interview
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5 leading-normal">
                    Officially nullify session without candidate penalty.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDisputeAction('reschedule')}
                  className="rounded-lg border border-border bg-muted/40 p-2 text-left hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <div className="font-bold text-foreground text-[11px] text-primary">
                    Issue Reschedule
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5 leading-normal">
                    Reset invitation calendar link for recruiter rebooking.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDisputeAction('strike')}
                  className="rounded-lg border border-border bg-muted/40 p-2 text-left hover:border-amber-300 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="font-bold text-foreground text-[11px] text-amber-700">
                    Flag / Strike Account
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5 leading-normal">
                    Issue warning strike for off-platform fees or no-show.
                  </div>
                </button>
              </div>
            </div>

            {/* Resolution Note Editor */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-foreground block">
                Administrative Resolution Note:
              </label>
              <textarea
                rows={3}
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="Record final review rationale, communications dispatched, and case outcome..."
                className="w-full rounded-xl border border-border bg-background p-2.5 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 3: ADD / EDIT PREP LINK MODAL (PREP CONTENT)             */}
      {/* ============================================================== */}
      <Modal
        isOpen={isAddPrepModalOpen || Boolean(editingPrepItem)}
        onClose={() => {
          setIsAddPrepModalOpen(false);
          setEditingPrepItem(null);
        }}
        eyebrow="INTERVIEW PREPARATION WORKFLOW"
        title={editingPrepItem ? 'Edit Prep Content Link' : 'Link New Interview Prep Guide'}
        subtitle="Connect curated CMS guidance to automated candidate calendar invites and dashboard alerts."
        maxWidth="max-w-[540px]"
      >
        <form onSubmit={handleSavePrepLink} className="space-y-3.5 text-[12px]">
          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Article / Guide Title *
            </label>
            <input
              type="text"
              required
              value={prepFormTitle}
              onChange={(e) => setPrepFormTitle(e.target.value)}
              placeholder="e.g. Mastering Technical Whiteboard Sessions"
              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">
                Target Category
              </label>
              <select
                value={prepFormCategory}
                onChange={(e) => setPrepFormCategory(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              >
                <option value="Engineering & Tech">Engineering & Tech</option>
                <option value="Engineering & Architecture">Engineering & Architecture</option>
                <option value="Product & Leadership">Product & Leadership</option>
                <option value="Sales & Support">Sales & Support</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="General Careers">General Careers</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={prepFormReadTime}
                onChange={(e) => setPrepFormReadTime(e.target.value)}
                placeholder="e.g. 8 min read"
                className="h-9 w-full rounded-xl border border-border bg-background px-3 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Target Role Specification
            </label>
            <input
              type="text"
              value={prepFormRole}
              onChange={(e) => setPrepFormRole(e.target.value)}
              placeholder="e.g. Senior Frontend, Mobile & Fullstack Engineers"
              className="h-9 w-full rounded-xl border border-border bg-background px-3 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">
                Automated Delivery Trigger
              </label>
              <select
                value={prepFormTrigger}
                onChange={(e) =>
                  setPrepFormTrigger(
                    e.target.value as 'Interview confirmation email' | 'Candidate dashboard / in-app banner' | '24-hour reminder'
                  )
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              >
                <option value="Interview confirmation email">
                  Interview confirmation email
                </option>
                <option value="Candidate dashboard / in-app banner">
                  Candidate dashboard / in-app banner
                </option>
                <option value="24-hour reminder">24-hour reminder</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">
                Status
              </label>
              <select
                value={prepFormStatus}
                onChange={(e) =>
                  setPrepFormStatus(e.target.value as 'Active' | 'Draft' | 'Archived')
                }
                className="h-9 w-full rounded-xl border border-border bg-background px-2.5 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Candidate Briefing Summary
            </label>
            <textarea
              rows={3}
              value={prepFormSummary}
              onChange={(e) => setPrepFormSummary(e.target.value)}
              placeholder="Key concepts, checklists, and interview takeaways provided in this resource..."
              className="w-full rounded-xl border border-border bg-background p-2.5 text-[12px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddPrepModalOpen(false);
                setEditingPrepItem(null);
              }}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-[12px] font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {editingPrepItem ? 'Save Changes' : 'Link Content'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 4: CANDIDATE CARD PREVIEW (PREP CONTENT)                 */}
      {/* ============================================================== */}
      <Modal
        isOpen={Boolean(previewCandidateItem)}
        onClose={() => setPreviewCandidateItem(null)}
        eyebrow="JOB SEEKER EXPERIENCE PREVIEW"
        title="Candidate Interview Guidance Card"
        subtitle="This interactive card appears in the candidate's upcoming interview schedule and confirmation alerts."
        maxWidth="max-w-[480px]"
        footer={
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => setPreviewCandidateItem(null)}
              className="rounded-xl bg-primary px-4 py-2 text-[12px] font-bold text-primary-foreground hover:bg-primary/90"
            >
              Close Preview
            </button>
          </div>
        }
      >
        {previewCandidateItem && (
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-card p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                <Sparkles size={11} />
                RECOMMENDED PREPARATION
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {previewCandidateItem.estimatedReadTime}
              </span>
            </div>

            <div>
              <h4 className="font-display text-[16px] font-extrabold text-foreground leading-snug">
                {previewCandidateItem.title}
              </h4>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                {previewCandidateItem.summary}
              </p>
            </div>

            {previewCandidateItem.keyTopics && previewCandidateItem.keyTopics.length > 0 && (
              <div className="rounded-xl border border-border bg-card/80 p-3 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Core Modules Covered:
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-medium text-foreground">
                  {previewCandidateItem.keyTopics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-primary shrink-0" />
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Delivery: {previewCandidateItem.deliveryTrigger}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary cursor-pointer hover:underline">
                Read Complete Guide
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
