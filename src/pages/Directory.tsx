import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter,
  LockKeyhole,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Send,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Eye,
  XCircle,
  AlertTriangle,
  Search,
  Download,
  UserX,
  Bell,
  CheckSquare,
  Square,
  X,
  Sparkles,
  GitMerge,
  UserCheck,
  Archive,
  RefreshCw,
  Sliders,
  FileText,
  CheckCircle,
  ExternalLink,
  Layers,
  Copy,
  ChevronRight,
  Info,
  Building2,
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
  UploadCloud,
  FileSpreadsheet,
} from 'lucide-react';
import { fetchCandidates } from '@/lib/api';
import {
  adminCandidates,
  adminEmployers,
  adminJobs,
  adminJobConsistencyIssues,
  initialAdminAtsConnectors,
  initialAdminDuplicateCandidatePairs,
  filterDirectoryRecords,
  filterCandidateRecords,
  reviewStatus,
  type AdminCandidate,
  type AdminEmployer,
  type AdminJob,
  type JobConsistencyIssue,
  type DirectoryKind,
  type DirectoryRecord,
  type ReviewDecision,
  type OnboardingStepNumber,
  type OnboardingStepStatus,
  type AdminAtsConnector,
  type AdminDuplicateCandidatePair,
  type AtsSyncLog,
} from '@/mock-data';
import { Avatar, StatusPill, TableSkeleton, EmptyState, Modal } from '@/components/ui';

type DirectoryPageProps = {
  kind: DirectoryKind;
  title: string;
  eyebrow: string;
  description: string;
};

const directorySections = {
  candidates: ['All candidates', 'Candidate detail', 'Duplicate candidates', 'Deletion requests'],
  employers: ['Employer accounts', 'Companies', 'Verification queue', 'Onboarding tracker'],
  jobs: ['All jobs', 'Moderation queue', 'Reported jobs', 'Imports', 'Consistency checks'],
};

export function DirectoryPage({ kind, title, eyebrow, description }: DirectoryPageProps) {
  const navigate = useNavigate();
  const sections = directorySections[kind];
  const [selected, setSelected] = useState(sections[0]);
  const [status, setStatus] = useState('All statuses');
  const [candidates, setCandidates] = useState<AdminCandidate[]>(adminCandidates);
  const [employers, setEmployers] = useState<AdminEmployer[]>(adminEmployers);
  const [jobs, setJobs] = useState<AdminJob[]>(adminJobs);
  const [consistencyIssues, setConsistencyIssues] = useState<JobConsistencyIssue[]>(adminJobConsistencyIssues);

  useEffect(() => {
    setSelected(directorySections[kind][0]);
    setStatus('All statuses');
  }, [kind]);

  useEffect(() => {
    if (kind !== 'candidates') return;
    let isMounted = true;
    fetchCandidates()
      .then((res) => {
        if (isMounted && res && res.data && res.data.length > 0) {
          setCandidates(res.data as any);
        }
      })
      .catch((err) => {
        console.warn('Backend candidates fetch notice:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [kind]);

  const activeSection = sections.includes(selected) ? selected : sections[0];

  // Candidate Unmasked PII Tracking
  const [unmaskedCandidateIds, setUnmaskedCandidateIds] = useState<Set<string>>(new Set());

  // Job Moderation
  const [reviewTarget, setReviewTarget] = useState<AdminJob | null>(null);
  const [decision, setDecision] = useState<ReviewDecision>('approve');
  const [reason, setReason] = useState('');

  // Center Confirmation/Action Modal
  const [actionModal, setActionModal] = useState<{
    title: string;
    subtitle: string;
    actionText: string;
    tone: string;
    onConfirm?: () => void;
  } | null>(null);

  // Candidate Refined Filter States (CAN-1)
  const [candidateQuery, setCandidateQuery] = useState('');
  const [candidateStatus, setCandidateStatus] = useState('All statuses');
  const [candidateLocation, setCandidateLocation] = useState('All locations');
  const [candidateSource, setCandidateSource] = useState('All sources');
  const [candidateCompletion, setCandidateCompletion] = useState('All');
  const [candidatePro, setCandidatePro] = useState('All');
  const [candidateRemote, setCandidateRemote] = useState('All');
  const [candidateVisible, setCandidateVisible] = useState('All');
  const [candidateVerification, setCandidateVerification] = useState('All');

  // Candidate Bulk Actions State (CAN-5)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());
  const [bulkNotifyModal, setBulkNotifyModal] = useState(false);
  const [bulkNotifyTitle, setBulkNotifyTitle] = useState('');
  const [bulkNotifyMessage, setBulkNotifyMessage] = useState('');

  // Batch 4: JOB-7 Automated ATS Feed Connectors State
  const [atsConnectors, setAtsConnectors] = useState<AdminAtsConnector[]>(initialAdminAtsConnectors);
  const [syncingConnectorId, setSyncingConnectorId] = useState<string | null>(null);
  const [selectedAtsLogs, setSelectedAtsLogs] = useState<AdminAtsConnector | null>(null);
  const [editingAtsConnector, setEditingAtsConnector] = useState<AdminAtsConnector | null>(null);
  const [isCsvUploadModalOpen, setIsCsvUploadModalOpen] = useState(false);
  const [csvUploadState, setCsvUploadState] = useState<{
    fileName: string;
    rowCount: number;
    delimiter: string;
    isUploading: boolean;
    autoPublish: boolean;
  }>({
    fileName: 'bulk_job_listings_q4.csv',
    rowCount: 24,
    delimiter: 'comma',
    isUploading: false,
    autoPublish: false,
  });

  // Batch 4: CAN-6 Fuzzy Duplicate Candidate Detection State
  const [duplicatePairs, setDuplicatePairs] = useState<AdminDuplicateCandidatePair[]>(initialAdminDuplicateCandidatePairs);
  const [duplicateTierFilter, setDuplicateTierFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [duplicateSearchQuery, setDuplicateSearchQuery] = useState('');
  const [selectedDuplicatePair, setSelectedDuplicatePair] = useState<AdminDuplicateCandidatePair | null>(null);
  const [survivingCandidateChoice, setSurvivingCandidateChoice] = useState<'A' | 'B'>('A');
  const [revealedCandidateIds, setRevealedCandidateIds] = useState<Set<string>>(new Set());
  const [piiJustificationModalOpen, setPiiJustificationModalOpen] = useState(false);
  const [piiJustificationText, setPiiJustificationText] = useState('');
  const [piiTargetCandidateId, setPiiTargetCandidateId] = useState<string | null>(null);

  const candidateFilteredRows = useMemo(() => {
    return filterCandidateRecords(candidates, {
      query: candidateQuery,
      status: candidateStatus,
      location: candidateLocation,
      source: candidateSource,
      completionRange: candidateCompletion,
      proStatus: candidatePro,
      openToRemote: candidateRemote,
      visibleToEmployers: candidateVisible,
      verificationStatus: candidateVerification,
    });
  }, [
    candidates,
    candidateQuery,
    candidateStatus,
    candidateLocation,
    candidateSource,
    candidateCompletion,
    candidatePro,
    candidateRemote,
    candidateVisible,
    candidateVerification,
  ]);

  // Employer Granular Filters State (EMP-1)
  const [employerQuery, setEmployerQuery] = useState('');
  const [employerStatus, setEmployerStatus] = useState('All statuses');
  const [employerIndustry, setEmployerIndustry] = useState('All industries');
  const [employerLocation, setEmployerLocation] = useState('All locations');
  const [employerSize, setEmployerSize] = useState('All sizes');
  const [employerPlan, setEmployerPlan] = useState('All tiers');
  const [employerVerification, setEmployerVerification] = useState('All states');
  const [employerJoined, setEmployerJoined] = useState('All time');

  // Employer Bulk Actions State (EMP-12)
  const [selectedEmployerIds, setSelectedEmployerIds] = useState<Set<string>>(new Set());

  // Job Bulk Actions State (JOB-13) & Duplicate Consolidation (JOB-11)
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [duplicateJobMergeTarget, setDuplicateJobMergeTarget] = useState<{ original: AdminJob; duplicate: AdminJob } | null>(null);
  const [survivingJobId, setSurvivingJobId] = useState<string>('');

  const employerFilteredRows = useMemo(() => {
    return employers.filter((e) => {
      if (employerQuery.trim()) {
        const q = employerQuery.toLowerCase();
        const match =
          e.company.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          (e.emailMasked && e.emailMasked.toLowerCase().includes(q)) ||
          (e.location && e.location.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (employerStatus !== 'All statuses' && e.status !== employerStatus) return false;
      if (employerIndustry !== 'All industries' && e.industry !== employerIndustry) return false;
      if (employerLocation !== 'All locations' && !e.location.toLowerCase().includes(employerLocation.toLowerCase())) return false;
      if (employerSize !== 'All sizes' && e.size !== employerSize) return false;
      if (employerPlan !== 'All tiers' && e.plan !== employerPlan) return false;
      if (employerVerification !== 'All states' && e.verification !== employerVerification) return false;
      if (employerJoined !== 'All time') {
        if (employerJoined === '2026' && !e.joined.includes('2026')) return false;
        if (employerJoined === '2025' && !e.joined.includes('2025')) return false;
      }
      return true;
    });
  }, [
    employers,
    employerQuery,
    employerStatus,
    employerIndustry,
    employerLocation,
    employerSize,
    employerPlan,
    employerVerification,
    employerJoined,
  ]);

  const list = useMemo(() => {
    if (kind === 'candidates') return candidateFilteredRows;
    if (kind === 'employers') return employerFilteredRows;
    return filterDirectoryRecords(kind, jobs, '', status);
  }, [kind, candidateFilteredRows, employerFilteredRows, jobs, status]);

  const busy = false;

  const handleToggleSelectAllCandidates = () => {
    if (selectedCandidateIds.size === list.length && list.length > 0) {
      setSelectedCandidateIds(new Set());
    } else {
      setSelectedCandidateIds(new Set((list as AdminCandidate[]).map((c) => c.id)));
    }
  };

  const handleToggleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else {
        next.add(candidateId);
      }
      return next;
    });
  };

  const handleBulkExport = () => {
    const selectedRows = candidates.filter((c) => selectedCandidateIds.has(c.id));
    const targetRows = selectedRows.length ? selectedRows : (list as AdminCandidate[]);
    const headers = [
      'Candidate ID',
      'Name',
      'Headline',
      'Location',
      'Status',
      'Completion %',
      'Source',
      'Pro Tier',
      'Open to Remote',
      'Visible to Employers',
      'Email Verified',
    ];
    const csvContent = [
      headers.join(','),
      ...targetRows.map((c) =>
        [
          `"${c.id}"`,
          `"${c.name}"`,
          `"${(c.headline || '').replace(/"/g, '""')}"`,
          `"${c.location || ''}"`,
          `"${c.status}"`,
          `"${c.completion}%"`,
          `"${c.source}"`,
          `"${c.pro ? 'Pro' : 'Free'}"`,
          `"${c.openToRemote ? 'Yes' : 'No'}"`,
          `"${c.visibleToEmployers !== false ? 'Yes' : 'No'}"`,
          `"${c.isEmailVerified ? 'Verified' : 'Unverified'}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jobrisers-candidates-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkSuspend = () => {
    setActionModal({
      title: `Suspend ${selectedCandidateIds.size} Candidate Account(s)?`,
      subtitle: `Are you sure you want to suspend the ${selectedCandidateIds.size} selected candidate(s)? They will be blocked from submitting applications and accessing Pro features.`,
      actionText: 'Confirm Bulk Suspension',
      tone: 'rose',
      onConfirm: () => {
        setCandidates((prev) =>
          prev.map((c) => (selectedCandidateIds.has(c.id) ? { ...c, status: 'Suspended' } : c))
        );
        setSelectedCandidateIds(new Set());
      },
    });
  };

  const handleConfirmBulkNotify = () => {
    if (!bulkNotifyTitle.trim()) return;
    const count = selectedCandidateIds.size;
    setActionModal({
      title: 'Broadcast Dispatched',
      subtitle: `System notification "${bulkNotifyTitle}" successfully queued for delivery to ${count} candidate(s).`,
      actionText: 'Done',
      tone: 'green',
      onConfirm: () => {
        setBulkNotifyModal(false);
        setBulkNotifyTitle('');
        setBulkNotifyMessage('');
        setSelectedCandidateIds(new Set());
      },
    });
  };

  const handleClearCandidateFilters = () => {
    setCandidateQuery('');
    setCandidateStatus('All statuses');
    setCandidateLocation('All locations');
    setCandidateSource('All sources');
    setCandidateCompletion('All');
    setCandidatePro('All');
    setCandidateRemote('All');
    setCandidateVisible('All');
    setCandidateVerification('All');
  };

  const handleClearEmployerFilters = () => {
    setEmployerQuery('');
    setEmployerStatus('All statuses');
    setEmployerIndustry('All industries');
    setEmployerLocation('All locations');
    setEmployerSize('All sizes');
    setEmployerPlan('All tiers');
    setEmployerVerification('All states');
    setEmployerJoined('All time');
  };

  const handleToggleSelectAllEmployers = () => {
    if (selectedEmployerIds.size === employerFilteredRows.length && employerFilteredRows.length > 0) {
      setSelectedEmployerIds(new Set());
    } else {
      setSelectedEmployerIds(new Set(employerFilteredRows.map((e) => e.id)));
    }
  };

  const handleToggleSelectEmployer = (id: string) => {
    setSelectedEmployerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkVerifyEmployers = () => {
    const count = selectedEmployerIds.size;
    setActionModal({
      title: `Verify ${count} Employer Account(s)?`,
      subtitle: `Mark ${count} selected employer accounts as Verified. This issues marketplace credentials and permits job postings.`,
      actionText: 'Confirm Bulk Verification',
      tone: 'green',
      onConfirm: () => {
        setEmployers((prev) =>
          prev.map((e) => (selectedEmployerIds.has(e.id) ? { ...e, verification: 'Verified' } : e))
        );
        setSelectedEmployerIds(new Set());
      },
    });
  };

  const handleBulkSuspendEmployers = () => {
    const count = selectedEmployerIds.size;
    setActionModal({
      title: `Suspend ${count} Employer Account(s)?`,
      subtitle: `Are you sure you want to suspend the ${count} selected employer accounts? All associated jobs will be deactivated.`,
      actionText: 'Confirm Bulk Suspension',
      tone: 'rose',
      onConfirm: () => {
        setEmployers((prev) =>
          prev.map((e) => (selectedEmployerIds.has(e.id) ? { ...e, status: 'Suspended' } : e))
        );
        setSelectedEmployerIds(new Set());
      },
    });
  };

  const handleBulkExportEmployers = () => {
    const selectedRows = employers.filter((e) => selectedEmployerIds.has(e.id));
    const targetRows = selectedRows.length ? selectedRows : employerFilteredRows;
    const headers = ['Employer ID', 'Company', 'Contact Person', 'Email', 'Location', 'Industry', 'Size', 'Verification', 'Plan', 'Status', 'Jobs', 'Joined'];
    const csvContent = [
      headers.join(','),
      ...targetRows.map((e) =>
        [
          `"${e.id}"`,
          `"${e.company}"`,
          `"${e.name}"`,
          `"${e.emailMasked}"`,
          `"${e.location}"`,
          `"${e.industry || ''}"`,
          `"${e.size || ''}"`,
          `"${e.verification}"`,
          `"${e.plan}"`,
          `"${e.status}"`,
          `"${e.jobs}"`,
          `"${e.joined}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jobrisers-employers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleSelectAllJobs = () => {
    const activeJobs = list as AdminJob[];
    if (selectedJobIds.size === activeJobs.length && activeJobs.length > 0) {
      setSelectedJobIds(new Set());
    } else {
      setSelectedJobIds(new Set(activeJobs.map((j) => j.id)));
    }
  };

  const handleToggleSelectJob = (id: string) => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkApproveJobs = () => {
    const count = selectedJobIds.size;
    setActionModal({
      title: `Approve ${count} Job Listing(s)?`,
      subtitle: `Approve the ${count} selected job listings to make them live on the JobRisers marketplace.`,
      actionText: 'Confirm Bulk Approval',
      tone: 'green',
      onConfirm: () => {
        setJobs((prev) =>
          prev.map((j) => (selectedJobIds.has(j.id) ? { ...j, status: 'Live' } : j))
        );
        setSelectedJobIds(new Set());
      },
    });
  };

  const handleBulkRejectJobs = () => {
    const count = selectedJobIds.size;
    setActionModal({
      title: `Reject ${count} Job Listing(s)?`,
      subtitle: `Reject the ${count} selected job listings. Employers will be notified to review listing guidelines.`,
      actionText: 'Confirm Bulk Rejection',
      tone: 'rose',
      onConfirm: () => {
        setJobs((prev) =>
          prev.map((j) => (selectedJobIds.has(j.id) ? { ...j, status: 'Rejected' } : j))
        );
        setSelectedJobIds(new Set());
      },
    });
  };

  const handleBulkArchiveJobs = () => {
    const count = selectedJobIds.size;
    setActionModal({
      title: `Archive ${count} Job Listing(s)?`,
      subtitle: `Archive the ${count} selected job listings. Listings will be closed and removed from active search.`,
      actionText: 'Confirm Bulk Archive',
      tone: 'rose',
      onConfirm: () => {
        setJobs((prev) =>
          prev.map((j) => (selectedJobIds.has(j.id) ? { ...j, status: 'Archived' } : j))
        );
        setSelectedJobIds(new Set());
      },
    });
  };

  const handleBulkExportJobs = () => {
    const selectedRows = jobs.filter((j) => selectedJobIds.has(j.id));
    const targetRows = selectedRows.length ? selectedRows : (list as AdminJob[]);
    const headers = ['Job ID', 'Title', 'Company', 'Location', 'Work Mode', 'Type', 'Status', 'Applicants', 'Posted'];
    const csvContent = [
      headers.join(','),
      ...targetRows.map((j) =>
        [
          `"${j.id}"`,
          `"${j.title}"`,
          `"${j.company}"`,
          `"${j.location}"`,
          `"${j.workMode}"`,
          `"${j.type}"`,
          `"${j.status}"`,
          `"${j.applicants}"`,
          `"${j.posted}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jobrisers-jobs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenJobConsolidation = (jobA: AdminJob, duplicateTargetId: string) => {
    const jobB = jobs.find((j) => j.id === duplicateTargetId);
    if (!jobB) return;
    setDuplicateJobMergeTarget({ original: jobA, duplicate: jobB });
    setSurvivingJobId(jobA.id);
  };

  const handleConfirmJobConsolidation = () => {
    if (!duplicateJobMergeTarget || !survivingJobId) return;
    const { original, duplicate } = duplicateJobMergeTarget;
    const survivor = survivingJobId === original.id ? original : duplicate;
    const merged = survivingJobId === original.id ? duplicate : original;

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === survivor.id) {
          return {
            ...j,
            applicants: j.applicants + merged.applicants,
            duplicateSignals: undefined,
          };
        }
        if (j.id === merged.id) {
          return {
            ...j,
            status: 'Archived',
            title: `${j.title} (Merged into ${survivor.id})`,
            duplicateSignals: undefined,
          };
        }
        return j;
      })
    );
    setDuplicateJobMergeTarget(null);
  };

  // -------------------------------------------------------------
  // BATCH 4 HANDLERS: JOB-7 AUTOMATED ATS CONNECTORS & CSV IMPORT
  // -------------------------------------------------------------
  const handleSyncConnectorNow = (connectorId: string) => {
    setSyncingConnectorId(connectorId);
    setTimeout(() => {
      setAtsConnectors((prev) =>
        prev.map((c) => {
          if (c.id === connectorId) {
            const added = Math.floor(6 + Math.random() * 10);
            const newLog: AtsSyncLog = {
              id: `log-${Date.now()}`,
              timestamp: 'Just now',
              status: 'Success',
              recordsImported: added,
              durationSeconds: +(2 + Math.random() * 2.5).toFixed(1),
              message: `Delta sync complete: ${added} fresh job postings ingested and mapped.`,
            };
            return {
              ...c,
              lastSync: 'Just now',
              recordsImported: c.recordsImported + added,
              status: 'Connected',
              connectionState: 'Active',
              logs: [newLog, ...c.logs],
            };
          }
          return c;
        })
      );
      setSyncingConnectorId(null);
      setActionModal({
        title: 'ATS Feed Synchronization Complete (JOB-7)',
        subtitle: `Successfully synchronized jobs from connector feed. Vacancies are indexed and visible in Moderation Queue.`,
        actionText: 'Close',
        tone: 'green',
      });
    }, 850);
  };

  const handleToggleConnectorEnabled = (connectorId: string) => {
    setAtsConnectors((prev) =>
      prev.map((c) => {
        if (c.id === connectorId) {
          const nextEnabled = !c.enabled;
          return {
            ...c,
            enabled: nextEnabled,
            status: nextEnabled ? 'Connected' : 'Disabled',
            connectionState: nextEnabled ? 'Active' : 'Offline',
          };
        }
        return c;
      })
    );
  };

  const handleSaveConnectorConfig = (updated: AdminAtsConnector) => {
    setAtsConnectors((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingAtsConnector(null);
    setActionModal({
      title: 'Connector Configuration Saved',
      subtitle: `Updated settings, sync interval (${updated.syncFrequency}), and endpoint for ${updated.name}.`,
      actionText: 'Done',
      tone: 'green',
    });
  };

  const handleExecuteCsvUpload = () => {
    setCsvUploadState((prev) => ({ ...prev, isUploading: true }));
    setTimeout(() => {
      setCsvUploadState((prev) => ({ ...prev, isUploading: false }));
      setIsCsvUploadModalOpen(false);
      setActionModal({
        title: 'Manual CSV Job Import Succeeded (JOB-7)',
        subtitle: `Imported ${csvUploadState.rowCount} job listings from "${csvUploadState.fileName}". Manual CSV import pipeline completed without errors.`,
        actionText: 'View Moderation Queue',
        tone: 'green',
        onConfirm: () => setSelected('Moderation queue'),
      });
    }, 600);
  };

  // -------------------------------------------------------------
  // BATCH 4 HANDLERS: CAN-6 DUPLICATE CANDIDATE RESOLUTION & PII
  // -------------------------------------------------------------
  const handleConfirmMergeCandidates = (pair: AdminDuplicateCandidatePair, masterChoice: 'A' | 'B') => {
    const survivor = masterChoice === 'A' ? pair.candidateA : pair.candidateB;
    const subsumed = masterChoice === 'A' ? pair.candidateB : pair.candidateA;

    setDuplicatePairs((prev) =>
      prev.map((p) =>
        p.id === pair.id
          ? {
              ...p,
              status: 'Merged',
              resolvedAt: 'Just now',
              resolutionNote: `Merged ${subsumed.name} (${subsumed.id}) into master profile ${survivor.name} (${survivor.id}). Preserved ${survivor.applicationsCount + subsumed.applicationsCount} total applications.`,
            }
          : p
      )
    );
    setSelectedDuplicatePair(null);
    setActionModal({
      title: 'Candidate Profiles Merged Successfully (CAN-6)',
      subtitle: `Profile ${subsumed.id} was consolidated into primary profile ${survivor.name} (${survivor.id}). Audit log JR-AUD-${Date.now().toString().slice(-4)} recorded.`,
      actionText: 'Done',
      tone: 'green',
    });
  };

  const handleDismissDuplicatePair = (pairId: string, reasonText?: string) => {
    setDuplicatePairs((prev) =>
      prev.map((p) =>
        p.id === pairId
          ? {
              ...p,
              status: 'Dismissed',
              resolvedAt: 'Just now',
              resolutionNote: reasonText || 'Marked as distinct candidates after human verification.',
            }
          : p
      )
    );
    setSelectedDuplicatePair(null);
    setActionModal({
      title: 'Duplicate Suggestion Dismissed (CAN-6)',
      subtitle: 'Candidate profiles marked as distinct individuals. Will not re-trigger match alerts.',
      actionText: 'Close',
      tone: 'primary',
    });
  };

  const handleConfirmPiiReveal = () => {
    if (!piiTargetCandidateId) return;
    if (!piiJustificationText.trim()) {
      alert('DPDP Statutory Requirement: Please provide a valid justification before unmasking PII.');
      return;
    }
    setRevealedCandidateIds((prev) => new Set(prev).add(piiTargetCandidateId));
    setPiiJustificationModalOpen(false);
    setPiiJustificationText('');
    setPiiTargetCandidateId(null);
  };


  const statuses =
    kind === 'candidates'
      ? ['All statuses', 'Active', 'Pending', 'Suspended']
      : kind === 'employers'
      ? ['All statuses', 'Active', 'Suspended', 'Pending', 'Under review', 'Need info', 'Verified', 'Rejected']
      : ['All statuses', 'Draft', 'Pending', 'Live', 'Paused', 'Expired', 'Rejected', 'Removed'];

  const submitReview = () => {
    if (!reviewTarget) return;
    const newStatus = reviewStatus(decision);
    setJobs((current) =>
      current.map((job) => (job.id === reviewTarget.id ? { ...job, status: newStatus } : job))
    );
    setReviewTarget(null);
    setReason('');
  };

  const activeCandidate = candidates[0];
  const isCandidateUnmasked = activeCandidate ? unmaskedCandidateIds.has(activeCandidate.id) : false;

  return (
    <div className="space-y-5">
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setSelected(section)}
            aria-pressed={activeSection === section}
            className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[11px] font-bold transition-colors ${
              activeSection === section
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {activeSection !== sections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 mt-5 overflow-x-auto">
          {kind === 'candidates' && activeSection === 'Candidate detail' && activeCandidate && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <Avatar name={activeCandidate.name} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{activeCandidate.name}</h2>
                      {activeCandidate.pro && (
                        <span className="rounded-full bg-[#eee9fc] px-1.5 py-0.5 text-[9px] font-bold text-primary">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activeCandidate.headline} · {activeCandidate.location}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <StatusPill value={activeCandidate.status} />
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">
                        Profile {activeCandidate.completion}% Complete
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  data-testid="button-open-candidate-page"
                  onClick={() => navigate(`/admin/candidates/${activeCandidate.id}`)}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                >
                  View Full Profile Page <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Contact Information ({isCandidateUnmasked ? 'Unmasked' : 'Masked'})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Email:{' '}
                    <span className="font-mono text-foreground">
                      {isCandidateUnmasked
                        ? activeCandidate.emailFull || activeCandidate.emailMasked
                        : activeCandidate.emailMasked}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Phone:{' '}
                    <span className="font-mono text-foreground">
                      {isCandidateUnmasked
                        ? activeCandidate.phoneFull || activeCandidate.phoneMasked || '+91 98765 00000'
                        : activeCandidate.phoneMasked || '+91 98765 *****'}
                    </span>
                  </p>
                  {!isCandidateUnmasked && (
                    <button
                      onClick={() =>
                        setActionModal({
                          title: 'Unmask Contact Info',
                          subtitle: `Unmask sensitive contact information for ${activeCandidate.name}? This action is recorded in the platform audit logs.`,
                          actionText: 'Confirm Unmask',
                          tone: 'primary',
                          onConfirm: () =>
                            setUnmaskedCandidateIds((prev) => new Set(prev).add(activeCandidate.id)),
                        })
                      }
                      className="mt-3 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
                    >
                      <LockKeyhole size={12} /> Request Unmask (Audit Logged)
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Account Activity</h3>
                  <p className="text-xs text-muted-foreground">
                    Last active: <span className="font-semibold text-foreground">{activeCandidate.lastActive}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sign-up source: <span className="font-semibold text-foreground">{activeCandidate.source}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Subscription:{' '}
                    <span className="font-semibold text-foreground">
                      {activeCandidate.pro ? 'Pro Tier (Active)' : 'Free Tier'}
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      setActionModal({
                        title: 'Suspend Account',
                        subtitle: `Are you sure you want to suspend ${activeCandidate.name}?`,
                        actionText: 'Suspend Account',
                        tone: 'rose',
                        onConfirm: () => {
                          setCandidates((current) =>
                            current.map((c) =>
                              c.id === activeCandidate.id ? { ...c, status: 'Suspended' } : c
                            )
                          );
                        },
                      })
                    }
                    className="mt-3 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-colors"
                  >
                    Suspend Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {kind === 'candidates' && activeSection === 'Duplicate candidates' && (
            <div className="space-y-6">
              {/* Top Banner / Engine Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                      CAN-6 ENGINE ACTIVE
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Fuzzy Duplicate Candidate Suggestion Queue
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Multi-signal probabilistic identity resolution matching Soundex phonetics, normalized email addresses, and phone numbers.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>{duplicatePairs.filter((p) => p.status === 'Pending Review').length} In Queue</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span>{duplicatePairs.filter((p) => p.status === 'Merged').length} Merged</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {(['All', 'High', 'Medium', 'Low'] as const).map((tier) => {
                    const count = tier === 'All' ? duplicatePairs.length : duplicatePairs.filter((p) => p.matchConfidenceTier === tier).length;
                    return (
                      <button
                        key={tier}
                        onClick={() => setDuplicateTierFilter(tier)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                          duplicateTierFilter === tier
                            ? 'bg-primary text-primary-foreground shadow-2xs'
                            : 'border border-border bg-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tier === 'All' ? 'All Matches' : `${tier} Confidence (${tier === 'High' ? '95%+' : tier === 'Medium' ? '85–94%' : '70–84%'})`}
                        <span className="ml-1.5 opacity-75 font-normal">({count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative min-w-[240px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={duplicateSearchQuery}
                    onChange={(e) => setDuplicateSearchQuery(e.target.value)}
                    placeholder="Search candidate name or ID…"
                    className="h-8 w-full rounded-xl border border-border bg-card pl-8 pr-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Duplicate Suggestion Cards */}
              <div className="space-y-4">
                {duplicatePairs
                  .filter((p) => {
                    if (duplicateTierFilter !== 'All' && p.matchConfidenceTier !== duplicateTierFilter) return false;
                    if (duplicateSearchQuery.trim()) {
                      const q = duplicateSearchQuery.toLowerCase();
                      const matchA = p.candidateA.name.toLowerCase().includes(q) || p.candidateA.id.toLowerCase().includes(q);
                      const matchB = p.candidateB.name.toLowerCase().includes(q) || p.candidateB.id.toLowerCase().includes(q);
                      if (!matchA && !matchB) return false;
                    }
                    return true;
                  })
                  .map((pair) => {
                    const isMerged = pair.status === 'Merged';
                    const isDismissed = pair.status === 'Dismissed';

                    const tierColor =
                      pair.matchConfidenceTier === 'High'
                        ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800'
                        : pair.matchConfidenceTier === 'Medium'
                        ? 'border-amber-300 bg-amber-50/70 text-amber-800'
                        : 'border-blue-300 bg-blue-50/70 text-blue-800';

                    return (
                      <div
                        key={pair.id}
                        data-testid={`card-duplicate-pair-${pair.id}`}
                        className={`rounded-2xl border p-5 transition-all ${
                          isMerged
                            ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                            : isDismissed
                            ? 'border-border bg-muted/20 opacity-60'
                            : 'border-border bg-card hover:border-primary/40 shadow-sm'
                        }`}
                      >
                        {/* Pair Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-muted-foreground">
                              {pair.id}
                            </span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold flex items-center gap-1 ${tierColor}`}>
                              <Sparkles size={11} /> {pair.matchConfidence}% Confidence · {pair.matchConfidenceTier}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Detected {pair.detectedAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isMerged ? (
                              <span className="rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-0.5 text-[11px] font-bold flex items-center gap-1">
                                <CheckCircle size={12} /> Merged ({pair.resolvedAt})
                              </span>
                            ) : isDismissed ? (
                              <span className="rounded-full bg-muted border border-border text-muted-foreground px-3 py-0.5 text-[11px] font-bold">
                                Dismissed
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDismissDuplicatePair(pair.id)}
                                  className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                  Dismiss / Ignore
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDuplicatePair(pair);
                                    setSurvivingCandidateChoice('A');
                                  }}
                                  className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-2xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
                                >
                                  <GitMerge size={13} /> Side-by-Side Review
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Matching Reasons */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {pair.matchReasons.map((reason, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground flex items-center gap-1"
                            >
                              <Check size={10} className="text-primary" /> {reason}
                            </span>
                          ))}
                        </div>

                        {/* Side by Side Preview Cards */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Candidate A */}
                          <div className="rounded-xl border border-border/80 bg-background/50 p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={pair.candidateA.name} />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground">{pair.candidateA.name}</span>
                                    <span className="rounded bg-primary/10 text-primary px-1.5 py-0.2 text-[9px] font-mono font-bold">
                                      {pair.candidateA.id}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-1">{pair.candidateA.headline}</p>
                                </div>
                              </div>
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                                Primary
                              </span>
                            </div>

                            <div className="mt-3 space-y-1 text-[11px]">
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Location:</span>
                                <span className="font-medium text-foreground">{pair.candidateA.location}</span>
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Contact PII:</span>
                                <span className="font-mono text-foreground">
                                  {revealedCandidateIds.has(pair.candidateA.id)
                                    ? pair.candidateA.email
                                    : `${pair.candidateA.email.slice(0, 3)}••••@${pair.candidateA.email.split('@')[1] || 'domain.com'}`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Applications:</span>
                                <span className="font-bold text-primary">{pair.candidateA.applicationsCount} active</span>
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Resume:</span>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">{pair.candidateA.resumeFileName}</span>
                              </div>
                            </div>
                          </div>

                          {/* Candidate B */}
                          <div className="rounded-xl border border-border/80 bg-background/50 p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={pair.candidateB.name} />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground">{pair.candidateB.name}</span>
                                    <span className="rounded bg-amber-500/10 text-amber-700 px-1.5 py-0.2 text-[9px] font-mono font-bold">
                                      {pair.candidateB.id}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-1">{pair.candidateB.headline}</p>
                                </div>
                              </div>
                              <span className="rounded-full bg-amber-500/10 text-amber-700 px-2 py-0.5 text-[9px] font-bold">
                                Potential Duplicate
                              </span>
                            </div>

                            <div className="mt-3 space-y-1 text-[11px]">
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Location:</span>
                                <span className="font-medium text-foreground">{pair.candidateB.location}</span>
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Contact PII:</span>
                                <span className="font-mono text-foreground">
                                  {revealedCandidateIds.has(pair.candidateB.id)
                                    ? pair.candidateB.email
                                    : `${pair.candidateB.email.slice(0, 3)}••••@${pair.candidateB.email.split('@')[1] || 'domain.com'}`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Applications:</span>
                                <span className="font-bold text-primary">{pair.candidateB.applicationsCount} active</span>
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground">
                                <span>Resume:</span>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">{pair.candidateB.resumeFileName}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Suggested Action Bar */}
                        <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/30 px-3.5 py-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Info size={13} className="text-primary" />
                            <strong>Recommended Action:</strong> {pair.suggestedAction}
                          </span>
                          {!isMerged && !isDismissed && (
                            <button
                              type="button"
                              onClick={() => handleConfirmMergeCandidates(pair, 'A')}
                              className="text-primary font-bold hover:underline flex items-center gap-1"
                            >
                              Quick Merge into Candidate A <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {kind === 'candidates' && activeSection === 'Deletion requests' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
                  <th>CANDIDATE</th>
                  <th>REQUEST DATE</th>
                  <th>STATUS</th>
                  <th>SLA</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]">
                  <td className="py-4 px-2 text-[12px] font-semibold">Meera Iyer</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Oct 1, 2026</td>
                  <td className="py-4 px-2">
                    <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-amber-200">
                      Pending Review
                    </span>
                  </td>
                  <td className="py-4 px-2 text-xs font-semibold text-rose-600">3 Days left</td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() =>
                        setActionModal({
                          title: 'Process Deletion',
                          subtitle: 'Meera Iyer (Data Subject Request)',
                          actionText: 'Permanently Delete',
                          tone: 'rose',
                        })
                      }
                      className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Process
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {kind === 'employers' && activeSection === 'Companies' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
                  <th>COMPANY</th>
                  <th>INDUSTRY</th>
                  <th>SIZE</th>
                  <th>HQ</th>
                  <th>VERIFIED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]">
                  <td className="py-4 px-2 text-[12px] font-semibold">Northstar Labs</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Technology</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">51-200</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Bengaluru</td>
                  <td className="py-4 px-2 text-xs text-emerald-600 font-bold">Yes</td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() => {
                        const emp = employers.find((e) => e.company === 'Northstar Labs') || employers[0];
                        navigate(`/admin/employers/${emp.id}`);
                      }}
                      className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#fbfaff]">
                  <td className="py-4 px-2 text-[12px] font-semibold">Cloudframe</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">SaaS</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">1-50</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Pune</td>
                  <td className="py-4 px-2 text-xs text-amber-600 font-bold">No</td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() => {
                        const emp = employers.find((e) => e.company === 'Cloudframe') || employers[1];
                        navigate(`/admin/employers/${emp.id}`);
                      }}
                      className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {kind === 'employers' && activeSection === 'Verification queue' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
                  <th>COMPANY</th>
                  <th>REQUESTER</th>
                  <th>DOCUMENTS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]">
                  <td className="py-4 px-2 text-[12px] font-semibold">Cloudframe</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Vikram Sethi</td>
                  <td
                    className="py-4 px-2 text-xs text-primary font-medium hover:underline cursor-pointer"
                    onClick={() => {
                      const emp = employers.find((e) => e.company === 'Cloudframe') || employers[1];
                      navigate(`/admin/employers/${emp.id}`);
                    }}
                  >
                    2 Attachments (Inspect)
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      Under review
                    </span>
                  </td>
                  <td className="py-4 px-2 flex gap-2">
                    <button
                      onClick={() => {
                        const target = employers.find((e) => e.company === 'Cloudframe') || employers[1];
                        setActionModal({
                          title: 'Approve Verification',
                          subtitle: `Approve verification for ${target.company}?`,
                          actionText: 'Approve',
                          tone: 'green',
                          onConfirm: () => {
                            setEmployers((current) =>
                              current.map((e) => (e.id === target.id ? { ...e, verification: 'Verified' } : e))
                            );
                          },
                        });
                      }}
                      className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors px-3 py-1.5 rounded-lg text-[10px] font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const target = employers.find((e) => e.company === 'Cloudframe') || employers[1];
                        setActionModal({
                          title: 'Reject Verification',
                          subtitle: `Reject verification for ${target.company}?`,
                          actionText: 'Reject',
                          tone: 'rose',
                          onConfirm: () => {
                            setEmployers((current) =>
                              current.map((e) => (e.id === target.id ? { ...e, verification: 'Rejected' } : e))
                            );
                          },
                        });
                      }}
                      className="text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors px-3 py-1.5 rounded-lg text-[10px] font-bold"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {kind === 'employers' && activeSection === 'Onboarding tracker' && (
            <OnboardingTrackerView
              employers={employers}
              onInspect={(emp) => navigate(`/admin/employers/${emp.id}`)}
              onNudge={(emp) => {
                setActionModal({
                  title: 'Send Onboarding Reminder',
                  subtitle: `Send an automated reminder email to ${emp.name} (${emp.emailMasked}) at ${emp.company} regarding Step ${emp.onboarding?.step}: ${emp.onboarding?.stepName}?`,
                  actionText: 'Send Nudge Email',
                  tone: 'primary',
                  onConfirm: () => {
                    setEmployers((prev) =>
                      prev.map((e) =>
                        e.id === emp.id && e.onboarding
                          ? {
                              ...e,
                              onboarding: {
                                ...e.onboarding,
                                nudgeCount: (e.onboarding.nudgeCount || 0) + 1,
                                lastNudgeDate: 'Just now',
                              },
                            }
                          : e
                      )
                    );
                  },
                });
              }}
              onResetStep={(emp) => {
                setActionModal({
                  title: `Reset Step ${emp.onboarding?.step}: ${emp.onboarding?.stepName}?`,
                  subtitle: `Are you sure you want to reset onboarding step ${emp.onboarding?.step} for ${emp.company}? The employer will be moved to "Draft" status for this step and prompted to resubmit their details.`,
                  actionText: 'Reset to Draft',
                  tone: 'rose',
                  onConfirm: () => {
                    setEmployers((prev) =>
                      prev.map((e) =>
                        e.id === emp.id && e.onboarding
                          ? {
                              ...e,
                              onboarding: {
                                ...e.onboarding,
                                stepStatus: 'Draft',
                                dropOffWarning: 'Step reset to draft by admin. Awaiting employer resubmission.',
                              },
                            }
                          : e
                      )
                    );
                  },
                });
              }}
            />
          )}

          {kind === 'jobs' && activeSection === 'Moderation queue' && (
            <div className="overflow-x-auto">
              <JobsTable
                rows={list.filter((j) => (j as AdminJob).status === 'Pending') as AdminJob[]}
                onReview={(job, action) => {
                  setReviewTarget(job);
                  setDecision(action);
                  setReason('');
                }}
                onRowClick={(job) => navigate(`/admin/jobs/${job.id}`)}
              />
            </div>
          )}

          {kind === 'jobs' && activeSection === 'Reported jobs' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
                  <th>JOB</th>
                  <th>REPORT REASON</th>
                  <th>REPORTS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]">
                  <td className="py-4 px-2 text-[12px] font-semibold">Data Platform Engineer</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Suspicious links</td>
                  <td className="py-4 px-2 text-xs text-rose-600 font-bold">14</td>
                  <td className="py-4 px-2">
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      Pending Review
                    </span>
                  </td>
                  <td className="py-4 px-2 flex gap-2">
                    <button
                      onClick={() =>
                        setActionModal({
                          title: 'Remove Job',
                          subtitle: 'Data Platform Engineer',
                          actionText: 'Remove Listing',
                          tone: 'rose',
                          onConfirm: () => {
                            setJobs((current) =>
                              current.map((j) => (j.id === 'job-3003' ? { ...j, status: 'Removed' } : j))
                            );
                          },
                        })
                      }
                      className="text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {kind === 'jobs' && activeSection === 'Imports' && (
            <div className="space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                      JOB-7 ATS CONNECTORS ENGINE
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Automated ATS Feed Connectors & CSV Importer
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Continuous automated synchronization from Greenhouse, Lever, and Workday enterprise systems, plus bulk CSV uploads.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-testid="button-manual-csv-upload"
                    onClick={() => setIsCsvUploadModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                  >
                    <UploadCloud size={14} className="text-primary" /> Manual CSV Upload
                  </button>
                  <button
                    type="button"
                    data-testid="button-sync-all-connectors"
                    onClick={() => {
                      atsConnectors.filter((c) => c.enabled).forEach((c) => handleSyncConnectorNow(c.id));
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-2xs hover:opacity-90 transition-opacity"
                  >
                    <RefreshCw size={13} /> Sync All Active
                  </button>
                </div>
              </div>

              {/* 3 ATS Connectors Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {atsConnectors.map((connector) => {
                  const isSyncing = syncingConnectorId === connector.id;
                  const isEnabled = connector.enabled;

                  const statusColor =
                    connector.status === 'Connected'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : connector.status === 'Warning'
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : connector.status === 'Failed'
                      ? 'border-rose-300 bg-rose-50 text-rose-800'
                      : 'border-border bg-muted/40 text-muted-foreground';

                  const providerBadgeColor =
                    connector.provider === 'Greenhouse'
                      ? 'bg-emerald-600 text-white'
                      : connector.provider === 'Lever'
                      ? 'bg-blue-600 text-white'
                      : 'bg-indigo-600 text-white';

                  return (
                    <div
                      key={connector.id}
                      data-testid={`card-ats-connector-${connector.id}`}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                        isEnabled ? 'border-border bg-card hover:border-primary/40 shadow-sm' : 'border-border/60 bg-muted/15 opacity-75'
                      }`}
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2 border-b border-border/70 pb-3">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-lg px-2 py-1 text-[10px] font-extrabold tracking-wide uppercase ${providerBadgeColor}`}>
                              {connector.provider}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">{connector.name}</h4>
                              <span className="font-mono text-[9px] text-muted-foreground">{connector.id}</span>
                            </div>
                          </div>

                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColor}`}>
                            {isSyncing ? 'Syncing…' : connector.status}
                          </span>
                        </div>

                        {/* Metrics Grid */}
                        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-xl border border-border/80 bg-background/50 p-2.5">
                            <span className="text-[10px] text-muted-foreground block">Jobs Synced</span>
                            <span className="text-base font-extrabold text-foreground">{connector.recordsImported}</span>
                          </div>
                          <div className="rounded-xl border border-border/80 bg-background/50 p-2.5">
                            <span className="text-[10px] text-muted-foreground block">Sync Cadence</span>
                            <span className="text-xs font-bold text-foreground">{connector.syncFrequency}</span>
                          </div>
                        </div>

                        {/* Feed Specs */}
                        <div className="mt-3 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Last Sync:</span>
                            <span className="font-medium text-foreground">{connector.lastSync}</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Next Sync:</span>
                            <span className="font-medium text-foreground">{connector.nextSync}</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Endpoint:</span>
                            <span className="font-mono text-[10px] text-foreground truncate max-w-[140px]" title={connector.endpointUrl}>
                              {connector.endpointUrl}
                            </span>
                          </div>
                          {connector.lastError && (
                            <div className="rounded-lg bg-amber-500/10 border border-amber-300 p-2 text-[10px] text-amber-800">
                              ⚠️ {connector.lastError}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Controls */}
                      <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold">
                          <input
                            type="checkbox"
                            checked={connector.enabled}
                            onChange={() => handleToggleConnectorEnabled(connector.id)}
                            className="h-3.5 w-3.5 rounded accent-primary"
                          />
                          <span>{connector.enabled ? 'Enabled' : 'Disabled'}</span>
                        </label>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAtsLogs(connector)}
                            className="rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="View sync logs"
                          >
                            Logs
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingAtsConnector(connector)}
                            className="rounded-lg border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Configure connector"
                          >
                            Config
                          </button>
                          <button
                            type="button"
                            disabled={!connector.enabled || isSyncing}
                            onClick={() => handleSyncConnectorNow(connector.id)}
                            className="rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-[11px] font-bold hover:bg-primary/20 disabled:opacity-40 transition-colors flex items-center gap-1"
                          >
                            <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
                            {isSyncing ? 'Syncing' : 'Sync Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Combined Imports History Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Recent Ingestion Batches (ATS Connectors & Manual CSV)
                  </h4>
                  <span className="text-[11px] text-muted-foreground">Showing 4 recent feed executions</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[700px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
                        <th className="py-3 px-3">IMPORT ID</th>
                        <th className="py-3 px-3">FEED SOURCE</th>
                        <th className="py-3 px-3">TYPE</th>
                        <th className="py-3 px-3">JOBS INGESTED</th>
                        <th className="py-3 px-3">TIMESTAMP</th>
                        <th className="py-3 px-3">EXECUTION STATUS</th>
                        <th className="py-3 px-3 text-right">AUDIT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/75 text-xs">
                      <tr className="hover:bg-[#fbfaff]">
                        <td className="py-3 px-3 font-mono font-bold">IMP-1004</td>
                        <td className="py-3 px-3 font-semibold text-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Greenhouse Harvest API
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">Automated Feed</td>
                        <td className="py-3 px-3 font-bold text-foreground">12 jobs</td>
                        <td className="py-3 px-3 text-muted-foreground">Today at 05:30 PM</td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                            Success
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedAtsLogs(atsConnectors[0])}
                            className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#fbfaff]">
                        <td className="py-3 px-3 font-mono font-bold">IMP-1003</td>
                        <td className="py-3 px-3 font-semibold text-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span> Lever Postings Feed
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">Automated Feed</td>
                        <td className="py-3 px-3 font-bold text-foreground">8 jobs</td>
                        <td className="py-3 px-3 text-muted-foreground">Today at 04:45 PM</td>
                        <td className="py-3 px-3">
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                            Rate Warning
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedAtsLogs(atsConnectors[1])}
                            className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#fbfaff]">
                        <td className="py-3 px-3 font-mono font-bold">IMP-992</td>
                        <td className="py-3 px-3 font-semibold text-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-indigo-500"></span> Workday Enterprise Cloud
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">Automated Feed</td>
                        <td className="py-3 px-3 font-bold text-foreground">120 jobs</td>
                        <td className="py-3 px-3 text-muted-foreground">Today at 10:00 AM</td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                            Success
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedAtsLogs(atsConnectors[2])}
                            className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#fbfaff]">
                        <td className="py-3 px-3 font-mono font-bold">IMP-988</td>
                        <td className="py-3 px-3 font-semibold text-foreground flex items-center gap-1.5">
                          <FileSpreadsheet size={13} className="text-primary" /> bulk_batch_bangalore_q4.csv
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">Manual CSV Import</td>
                        <td className="py-3 px-3 font-bold text-foreground">45 jobs</td>
                        <td className="py-3 px-3 text-muted-foreground">Yesterday at 02:15 PM</td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                            Success
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setActionModal({
                                title: 'Manual CSV Import Log (IMP-988)',
                                subtitle: '45 jobs imported from CSV. Delimiter: comma, Auto-published: false.',
                                actionText: 'Close',
                                tone: 'primary',
                              })
                            }
                            className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {kind === 'jobs' && activeSection === 'Consistency checks' && (
            <ConsistencyChecksView
              issues={consistencyIssues}
              onInspect={(jobId) => {
                const job = jobs.find((j) => j.id === jobId);
                if (job) navigate(`/admin/jobs/${job.id}`);
              }}
              onResolve={(issueId) => {
                setConsistencyIssues((prev) =>
                  prev.map((i) =>
                    i.id === issueId
                      ? {
                          ...i,
                          status: i.status === 'Resolved' ? 'Unresolved' : 'Resolved',
                          resolvedAt: i.status === 'Resolved' ? undefined : 'Just now',
                        }
                      : i
                  )
                );
              }}
              onDismiss={(issue) => {
                setActionModal({
                  title: 'Dismiss Consistency Issue?',
                  subtitle: `Dismiss the "${issue.issueType}" alert for ${issue.jobTitle} at ${issue.company}? This flag will be cleared from active alerts.`,
                  actionText: 'Dismiss Issue',
                  tone: 'amber',
                  onConfirm: () => {
                    setConsistencyIssues((prev) =>
                      prev.map((i) => (i.id === issue.id ? { ...i, status: 'Dismissed' } : i))
                    );
                  },
                });
              }}
            />
          )}
        </section>
      ) : (
        <>
          {kind === 'candidates' ? (
            <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5 mt-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
                  <Filter size={15} className="text-primary" /> Filter Candidates
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {list.length} matches
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearCandidateFilters}
                    data-testid="button-reset-candidate-filters"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <RotateCcw size={12} /> Reset filters
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkExport}
                    data-testid="button-export-all-candidates"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                  >
                    <Download size={12} className="text-primary" /> Export all
                  </button>
                </div>
              </div>

              {/* Free-text Search Bar */}
              <div className="relative w-full">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  data-testid="input-candidate-search"
                  value={candidateQuery}
                  onChange={(e) => setCandidateQuery(e.target.value)}
                  placeholder="Search by candidate name, email, headline, skills (e.g. Figma, React, Kafka, Python)…"
                  className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-9 text-xs font-medium text-foreground outline-none focus:border-primary placeholder:text-muted-foreground transition-colors"
                />
                {candidateQuery && (
                  <button
                    type="button"
                    onClick={() => setCandidateQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* 8 Granular Filter Controls Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
                {/* 1. Status */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Status
                  </label>
                  <select
                    data-testid="select-candidate-status-filter"
                    value={candidateStatus}
                    onChange={(e) => setCandidateStatus(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Self-deactivated">Self-deactivated</option>
                  </select>
                </div>

                {/* 2. Location */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    City / Location
                  </label>
                  <select
                    data-testid="select-candidate-location-filter"
                    value={candidateLocation}
                    onChange={(e) => setCandidateLocation(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All locations</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Kochi">Kochi</option>
                  </select>
                </div>

                {/* 3. Signup Source */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Source
                  </label>
                  <select
                    data-testid="select-candidate-source-filter"
                    value={candidateSource}
                    onChange={(e) => setCandidateSource(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All sources</option>
                    <option value="Google">Google</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Email">Email</option>
                  </select>
                </div>

                {/* 4. Completion */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Profile %
                  </label>
                  <select
                    data-testid="select-candidate-completion-filter"
                    value={candidateCompletion}
                    onChange={(e) => setCandidateCompletion(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="All">All ranges</option>
                    <option value="<50%">&lt; 50%</option>
                    <option value="50-79%">50 - 79%</option>
                    <option value="80-99%">80 - 99%</option>
                    <option value="100%">100% Complete</option>
                  </select>
                </div>

                {/* 5. Pro Tier */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Pro Tier
                  </label>
                  <select
                    data-testid="select-candidate-pro-filter"
                    value={candidatePro}
                    onChange={(e) => setCandidatePro(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="All">All tiers</option>
                    <option value="Pro">Pro Subscribers</option>
                    <option value="Free">Standard Free</option>
                  </select>
                </div>

                {/* 6. Remote Ready */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Remote Ready
                  </label>
                  <select
                    data-testid="select-candidate-remote-filter"
                    value={candidateRemote}
                    onChange={(e) => setCandidateRemote(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="All">All</option>
                    <option value="Yes">Open to remote</option>
                    <option value="No">On-site / Hybrid only</option>
                  </select>
                </div>

                {/* 7. Employer Visibility */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Visibility
                  </label>
                  <select
                    data-testid="select-candidate-visibility-filter"
                    value={candidateVisible}
                    onChange={(e) => setCandidateVisible(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="All">All</option>
                    <option value="Yes">Visible to Employers</option>
                    <option value="No">Hidden from Search</option>
                  </select>
                </div>

                {/* 8. Email Verification */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Verification
                  </label>
                  <select
                    data-testid="select-candidate-verification-filter"
                    value={candidateVerification}
                    onChange={(e) => setCandidateVerification(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option value="All">All</option>
                    <option value="Verified">Verified Email</option>
                    <option value="Unverified">Unverified</option>
                    <option value="Pending">Pending Review</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <LockKeyhole size={12} className="text-muted-foreground" /> Personal contact details masked under DPDP Act 2023.
                </span>
                <span>Active filters: {[candidateStatus !== 'All statuses' && candidateStatus, candidateLocation !== 'All locations' && candidateLocation, candidateSource !== 'All sources' && candidateSource, candidateCompletion !== 'All' && candidateCompletion, candidatePro !== 'All' && candidatePro, candidateRemote !== 'All' && `Remote: ${candidateRemote}`, candidateVerification !== 'All' && `Verify: ${candidateVerification}`].filter(Boolean).length || 'None'}</span>
              </div>
            </section>
          ) : kind === 'employers' ? (
            <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5 mt-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
                  <Filter size={15} className="text-primary" /> Filter Employers
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {employerFilteredRows.length} matches
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearEmployerFilters}
                    data-testid="button-reset-employer-filters"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <RotateCcw size={12} /> Reset filters
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkExportEmployers}
                    data-testid="button-export-all-employers"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                  >
                    <Download size={12} className="text-primary" /> Export all
                  </button>
                </div>
              </div>

              {/* Free-text Search Bar */}
              <div className="relative w-full">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  data-testid="input-employer-search"
                  value={employerQuery}
                  onChange={(e) => setEmployerQuery(e.target.value)}
                  placeholder="Search by company name, contact person, email, city…"
                  className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-9 text-xs font-medium text-foreground outline-none focus:border-primary placeholder:text-muted-foreground transition-colors"
                />
                {employerQuery && (
                  <button
                    type="button"
                    onClick={() => setEmployerQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* 8 Granular Filter Controls Grid (EMP-1) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
                {/* 1. Status */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Status
                  </label>
                  <select
                    data-testid="select-employer-status-filter"
                    value={employerStatus}
                    onChange={(e) => setEmployerStatus(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* 2. Industry */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Industry
                  </label>
                  <select
                    data-testid="select-employer-industry-filter"
                    value={employerIndustry}
                    onChange={(e) => setEmployerIndustry(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All industries</option>
                    <option value="Technology">Technology</option>
                    <option value="SaaS">SaaS</option>
                    <option value="FinTech">FinTech</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>

                {/* 3. Location / HQ */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Location / HQ
                  </label>
                  <select
                    data-testid="select-employer-location-filter"
                    value={employerLocation}
                    onChange={(e) => setEmployerLocation(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All locations</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi">Delhi NCR</option>
                  </select>
                </div>

                {/* 4. Workforce Size */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Company Size
                  </label>
                  <select
                    data-testid="select-employer-size-filter"
                    value={employerSize}
                    onChange={(e) => setEmployerSize(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All sizes</option>
                    <option value="1-50">1-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>

                {/* 5. Subscription Plan */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Plan Tier
                  </label>
                  <select
                    data-testid="select-employer-plan-filter"
                    value={employerPlan}
                    onChange={(e) => setEmployerPlan(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All tiers</option>
                    <option value="Standard">Standard</option>
                    <option value="Scale">Scale</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Pilot">Pilot</option>
                  </select>
                </div>

                {/* 6. Verification Status */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Verification
                  </label>
                  <select
                    data-testid="select-employer-verification-filter"
                    value={employerVerification}
                    onChange={(e) => setEmployerVerification(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All states</option>
                    <option value="Verified">Verified</option>
                    <option value="Under review">Under review</option>
                    <option value="Need info">Need info</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* 7. Date Joined */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Joined Date
                  </label>
                  <select
                    data-testid="select-employer-joined-filter"
                    value={employerJoined}
                    onChange={(e) => setEmployerJoined(e.target.value)}
                    className="h-8 w-full rounded-lg border border-border bg-card px-2 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All time</option>
                    <option value="2026">Joined 2026</option>
                    <option value="2025">Joined 2025</option>
                  </select>
                </div>

                {/* 8. Summary Count */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Filtered
                  </label>
                  <div className="h-8 rounded-lg bg-muted/50 border border-border px-2 flex items-center text-[11px] font-bold text-foreground">
                    {employerFilteredRows.length} Accounts
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <LockKeyhole size={12} className="text-muted-foreground" /> Employer tax GSTIN/CIN records masked in list view.
                </span>
                <span>Active filters: {[employerStatus !== 'All statuses' && employerStatus, employerIndustry !== 'All industries' && employerIndustry, employerLocation !== 'All locations' && employerLocation, employerSize !== 'All sizes' && employerSize, employerPlan !== 'All tiers' && employerPlan, employerVerification !== 'All states' && employerVerification, employerJoined !== 'All time' && employerJoined].filter(Boolean).length || 'None'}</span>
              </div>
            </section>
          ) : (
            <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5 mt-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold">
                  <Filter size={15} className="text-primary" /> Refine jobs directory
                  <span className="ml-1 font-normal text-muted-foreground">
                    {busy ? 'Loading records…' : `${list.length} records`}
                  </span>
                </div>
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>Status</span>
                  <select
                    data-testid={`select-${kind}-status`}
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-9 min-w-[150px] rounded-lg border border-border bg-card px-3 text-[11px] font-medium text-foreground outline-none focus:border-primary"
                  >
                    <option>All statuses</option>
                    {statuses.slice(1).map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                <LockKeyhole size={13} /> Showing platform listings across all employers.
              </div>
            </section>
          )}

          {/* Contextual Bulk Actions Bar for Candidates (CAN-5) */}
          {kind === 'candidates' && selectedCandidateIds.size > 0 && (
            <div
              data-testid="toolbar-bulk-actions"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-[#f7f5ff] px-4 py-3 shadow-sm transition-all animate-in fade-in"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white">
                  {selectedCandidateIds.size}
                </span>
                <span className="text-xs font-bold text-foreground">
                  candidate{selectedCandidateIds.size > 1 ? 's' : ''} selected
                </span>
                <span className="text-[11px] text-muted-foreground">
                  (of {list.length} filtered)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  data-testid="button-bulk-export-selected"
                  onClick={handleBulkExport}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                >
                  <Download size={13} className="text-primary" /> Export CSV ({selectedCandidateIds.size})
                </button>
                <button
                  type="button"
                  data-testid="button-bulk-suspend-selected"
                  onClick={handleBulkSuspend}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                >
                  <UserX size={13} /> Bulk Suspend
                </button>
                <button
                  type="button"
                  data-testid="button-bulk-notify-selected"
                  onClick={() => setBulkNotifyModal(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:opacity-90 transition-opacity shadow-2xs"
                >
                  <Bell size={13} /> Send Notification
                </button>
                <button
                  type="button"
                  data-testid="button-clear-selection"
                  onClick={() => setSelectedCandidateIds(new Set())}
                  className="rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}

          {/* Contextual Bulk Actions Bar for Employers (EMP-12) */}
          {kind === 'employers' && selectedEmployerIds.size > 0 && (
            <div
              data-testid="toolbar-employer-bulk-actions"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-[#f7f5ff] px-4 py-3 shadow-sm transition-all animate-in fade-in"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white">
                  {selectedEmployerIds.size}
                </span>
                <span className="text-xs font-bold text-foreground">
                  employer{selectedEmployerIds.size > 1 ? 's' : ''} selected
                </span>
                <span className="text-[11px] text-muted-foreground">
                  (of {employerFilteredRows.length} filtered)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  data-testid="button-employer-bulk-verify"
                  onClick={handleBulkVerifyEmployers}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                >
                  <UserCheck size={13} /> Bulk Verify ({selectedEmployerIds.size})
                </button>
                <button
                  type="button"
                  data-testid="button-employer-bulk-suspend"
                  onClick={handleBulkSuspendEmployers}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                >
                  <UserX size={13} /> Bulk Suspend
                </button>
                <button
                  type="button"
                  data-testid="button-employer-bulk-export"
                  onClick={handleBulkExportEmployers}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                >
                  <Download size={13} className="text-primary" /> Export CSV ({selectedEmployerIds.size})
                </button>
                <button
                  type="button"
                  data-testid="button-employer-clear-selection"
                  onClick={() => setSelectedEmployerIds(new Set())}
                  className="rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}

          {/* Contextual Bulk Actions Bar for Jobs (JOB-13) */}
          {kind === 'jobs' && selectedJobIds.size > 0 && (
            <div
              data-testid="toolbar-job-bulk-actions"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-[#f7f5ff] px-4 py-3 shadow-sm transition-all animate-in fade-in"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white">
                  {selectedJobIds.size}
                </span>
                <span className="text-xs font-bold text-foreground">
                  job{selectedJobIds.size > 1 ? 's' : ''} selected
                </span>
                <span className="text-[11px] text-muted-foreground">
                  (of {list.length} filtered)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  data-testid="button-job-bulk-approve"
                  onClick={handleBulkApproveJobs}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                >
                  <CheckCircle2 size={13} /> Bulk Approve ({selectedJobIds.size})
                </button>
                <button
                  type="button"
                  data-testid="button-job-bulk-reject"
                  onClick={handleBulkRejectJobs}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                >
                  <XCircle size={13} /> Bulk Reject
                </button>
                <button
                  type="button"
                  data-testid="button-job-bulk-archive"
                  onClick={handleBulkArchiveJobs}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                >
                  <Archive size={13} /> Bulk Archive
                </button>
                <button
                  type="button"
                  data-testid="button-job-bulk-export"
                  onClick={handleBulkExportJobs}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                >
                  <Download size={13} className="text-primary" /> Export CSV ({selectedJobIds.size})
                </button>
                <button
                  type="button"
                  data-testid="button-job-clear-selection"
                  onClick={() => setSelectedJobIds(new Set())}
                  className="rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}

          {busy ? (
            <TableSkeleton />
          ) : !list.length ? (
            <EmptyState
              title={`No ${kind} to display`}
              detail="Records will appear here when they are available or adjust your filters."
            />
          ) : (
            <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                {kind === 'candidates' && (
                  <CandidatesTable
                    rows={list as AdminCandidate[]}
                    onRowClick={(candidate) => navigate(`/admin/candidates/${candidate.id}`)}
                    selectedIds={selectedCandidateIds}
                    onToggleSelect={handleToggleSelectCandidate}
                    onToggleSelectAll={handleToggleSelectAllCandidates}
                    isAllSelected={selectedCandidateIds.size === list.length && list.length > 0}
                  />
                )}
                {kind === 'employers' && (
                  <EmployersTable
                    rows={list as AdminEmployer[]}
                    onRowClick={(employer) => navigate(`/admin/employers/${employer.id}`)}
                    selectedIds={selectedEmployerIds}
                    onToggleSelect={handleToggleSelectEmployer}
                    onToggleSelectAll={handleToggleSelectAllEmployers}
                    isAllSelected={selectedEmployerIds.size === list.length && list.length > 0}
                  />
                )}
                {kind === 'jobs' && (
                  <JobsTable
                    rows={list as AdminJob[]}
                    onReview={(job, action) => {
                      setReviewTarget(job);
                      setDecision(action);
                      setReason('');
                    }}
                    onRowClick={(job) => navigate(`/admin/jobs/${job.id}`)}
                    selectedIds={selectedJobIds}
                    onToggleSelect={handleToggleSelectJob}
                    onToggleSelectAll={handleToggleSelectAllJobs}
                    isAllSelected={selectedJobIds.size === list.length && list.length > 0}
                    onConsolidate={handleOpenJobConsolidation}
                  />
                )}
              </div>
              <div className="pointer-events-none absolute right-0 top-0 bottom-12 w-6 bg-gradient-to-l from-card to-transparent sm:hidden" />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
                <span>
                  Showing {list.length} {kind}
                  {kind === 'candidates' && selectedCandidateIds.size > 0 && ` · ${selectedCandidateIds.size} selected`}
                  {kind === 'employers' && selectedEmployerIds.size > 0 && ` · ${selectedEmployerIds.size} selected`}
                  {kind === 'jobs' && selectedJobIds.size > 0 && ` · ${selectedJobIds.size} selected`}
                </span>
                <span className="rounded-md bg-muted px-2 py-1">All matching records</span>
              </div>
            </section>
          )}
        </>
      )}

      {/* JOB MODERATION CENTER MODAL */}
      <Modal
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        eyebrow="JOB MODERATION"
        title={
          decision === 'approve'
            ? 'Approve this listing?'
            : decision === 'reject'
            ? 'Reject this listing?'
            : 'Request edits?'
        }
        maxWidth="max-w-[460px]"
        footer={
          <>
            <button
              onClick={() => setReviewTarget(null)}
              className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              data-testid="button-confirm-review"
              disabled={decision !== 'approve' && !reason.trim()}
              onClick={submitReview}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90 disabled:opacity-60 ${
                decision === 'reject'
                  ? 'bg-rose-600'
                  : decision === 'request-edits'
                  ? 'bg-amber-600'
                  : 'bg-primary'
              }`}
            >
              {decision === 'approve'
                ? 'Approve listing'
                : decision === 'reject'
                ? 'Reject listing'
                : 'Request edits'}
            </button>
          </>
        }
      >
        {reviewTarget && (
          <>
            <div className="rounded-xl bg-muted/70 p-4 border border-border">
              <div className="text-[13px] font-bold">{reviewTarget.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {reviewTarget.company} · {reviewTarget.location}
              </div>
            </div>
            <label className="mt-5 block text-[11px] font-bold">
              Reason{' '}
              <span className="font-normal text-muted-foreground">
                {decision === 'approve' ? '(optional)' : '(required)'}
              </span>
              <textarea
                required={decision !== 'approve'}
                data-testid="input-review-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={3}
                placeholder={
                  decision === 'approve'
                    ? 'Add context for the audit trail…'
                    : 'Explain the decision for the employer and audit trail…'
                }
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background p-3 text-[12px] font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-shadow"
              />
            </label>
          </>
        )}
      </Modal>

      {/* ACTION / CONFIRMATION CENTER MODAL */}
      <Modal
        isOpen={Boolean(actionModal)}
        onClose={() => setActionModal(null)}
        title={actionModal?.title}
        subtitle={actionModal?.subtitle}
        maxWidth="max-w-[420px]"
        footer={
          <>
            <button
              onClick={() => setActionModal(null)}
              className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              data-testid="button-confirm-action-modal"
              onClick={() => {
                actionModal?.onConfirm?.();
                setActionModal(null);
              }}
              className={`rounded-xl px-4 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90 ${
                actionModal?.tone === 'rose'
                  ? 'bg-rose-600'
                  : actionModal?.tone === 'green'
                  ? 'bg-emerald-600'
                  : 'bg-primary'
              }`}
            >
              {actionModal?.actionText}
            </button>
          </>
        }
      />

      {/* Bulk Notification Modal (CAN-5) */}
      <Modal
        isOpen={bulkNotifyModal}
        onClose={() => setBulkNotifyModal(false)}
        title={`Send Broadcast to ${selectedCandidateIds.size} Candidate(s)`}
        subtitle="This broadcast message will be delivered via candidate inbox, email notification, and mobile push notification."
        dataTestId="modal-bulk-notification"
        footer={
          <>
            <button
              type="button"
              onClick={() => setBulkNotifyModal(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-bulk-notify"
              onClick={handleConfirmBulkNotify}
              disabled={!bulkNotifyTitle.trim()}
              className="rounded-xl bg-primary px-4 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              Dispatch Broadcast
            </button>
          </>
        }
      >
        <div className="space-y-3.5 py-2">
          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Broadcast Title / Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              data-testid="input-bulk-notify-title"
              value={bulkNotifyTitle}
              onChange={(e) => setBulkNotifyTitle(e.target.value)}
              placeholder="e.g. Special Interview Prep Guide for Shortlisted Candidates"
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Message Body
            </label>
            <textarea
              rows={4}
              data-testid="textarea-bulk-notify-message"
              value={bulkNotifyMessage}
              onChange={(e) => setBulkNotifyMessage(e.target.value)}
              placeholder="Enter announcement details, instructions or deadline reminders…"
              className="w-full rounded-xl border border-border bg-card p-3 text-xs font-medium text-foreground outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3 text-[11px] text-muted-foreground">
            Target Audience: <strong>{selectedCandidateIds.size} selected candidate accounts</strong>. Notifications adhere to DPDP communication preferences.
          </div>
        </div>
      </Modal>

      {/* JOB DUPLICATE CONSOLIDATION MODAL (JOB-11) */}
      <Modal
        isOpen={Boolean(duplicateJobMergeTarget)}
        onClose={() => setDuplicateJobMergeTarget(null)}
        eyebrow="DUPLICATE CONSOLIDATION"
        title="Consolidate Duplicate Job Listings"
        subtitle="Merge duplicate listings to protect applicant data, eliminate redundant postings, and consolidate candidate pipelines safely."
        maxWidth="max-w-[560px]"
        dataTestId="modal-duplicate-job-consolidation"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setDuplicateJobMergeTarget(null)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-job-consolidation"
              onClick={handleConfirmJobConsolidation}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <GitMerge size={14} /> Confirm Consolidation
            </button>
          </div>
        }
      >
        {duplicateJobMergeTarget && (
          <div className="space-y-4 py-1 text-xs">
            <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-amber-800 text-[11px] flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-amber-700" />
              <span>
                Matching duplicate signal detected ({duplicateJobMergeTarget.original.duplicateSignals?.similarityScore ?? 92}% title & employer similarity).
              </span>
            </div>

            <div className="text-[11px] font-bold text-foreground">
              Select Surviving Canonical Listing:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`rounded-xl border p-3 cursor-pointer transition-all ${
                  survivingJobId === duplicateJobMergeTarget.original.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="survivingJob"
                    checked={survivingJobId === duplicateJobMergeTarget.original.id}
                    onChange={() => setSurvivingJobId(duplicateJobMergeTarget.original.id)}
                    className="accent-primary"
                  />
                  <span className="font-bold text-[11px] text-foreground">Listing A (Primary)</span>
                  <span className="font-mono text-[9px] text-muted-foreground ml-auto">{duplicateJobMergeTarget.original.id}</span>
                </div>
                <div className="font-semibold text-foreground truncate">{duplicateJobMergeTarget.original.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{duplicateJobMergeTarget.original.company} · {duplicateJobMergeTarget.original.location}</div>
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                  <span>Applicants: <strong>{duplicateJobMergeTarget.original.applicants}</strong></span>
                  <StatusPill value={duplicateJobMergeTarget.original.status} />
                </div>
              </label>

              <label
                className={`rounded-xl border p-3 cursor-pointer transition-all ${
                  survivingJobId === duplicateJobMergeTarget.duplicate.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="survivingJob"
                    checked={survivingJobId === duplicateJobMergeTarget.duplicate.id}
                    onChange={() => setSurvivingJobId(duplicateJobMergeTarget.duplicate.id)}
                    className="accent-primary"
                  />
                  <span className="font-bold text-[11px] text-foreground">Listing B (Duplicate)</span>
                  <span className="font-mono text-[9px] text-muted-foreground ml-auto">{duplicateJobMergeTarget.duplicate.id}</span>
                </div>
                <div className="font-semibold text-foreground truncate">{duplicateJobMergeTarget.duplicate.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{duplicateJobMergeTarget.duplicate.company} · {duplicateJobMergeTarget.duplicate.location}</div>
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                  <span>Applicants: <strong>{duplicateJobMergeTarget.duplicate.applicants}</strong></span>
                  <StatusPill value={duplicateJobMergeTarget.duplicate.status} />
                </div>
              </label>
            </div>

            <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">Consolidation Safeguards:</div>
              <div>• Total applicants combined into surviving listing ({duplicateJobMergeTarget.original.applicants + duplicateJobMergeTarget.duplicate.applicants} applicants).</div>
              <div>• Non-surviving duplicate marked as Archived with canonical pointer.</div>
              <div>• Active candidate applications and interview rounds preserved without disruption.</div>
            </div>
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* BATCH 4: SIDE-BY-SIDE CANDIDATE DUPLICATE REVIEW MODAL (CAN-6)*/}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(selectedDuplicatePair)}
        onClose={() => setSelectedDuplicatePair(null)}
        eyebrow="DUPLICATE CANDIDATE RESOLUTION · CAN-6"
        title="Side-by-Side Candidate Identity Review"
        subtitle="Compare duplicate candidates side by side, review unmasked PII under audit governance, and select the surviving master record."
        maxWidth="max-w-[760px]"
        dataTestId="modal-duplicate-candidate-review"
        footer={
          selectedDuplicatePair && selectedDuplicatePair.status === 'Pending Review' ? (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => handleDismissDuplicatePair(selectedDuplicatePair.id)}
                className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
              >
                Dismiss as Distinct Profiles
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDuplicatePair(null)}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-testid="button-confirm-merge-candidates"
                  onClick={() => handleConfirmMergeCandidates(selectedDuplicatePair, survivingCandidateChoice)}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <GitMerge size={14} /> Merge Profiles into Candidate {survivingCandidateChoice}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end w-full">
              <button
                type="button"
                onClick={() => setSelectedDuplicatePair(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Close
              </button>
            </div>
          )
        }
      >
        {selectedDuplicatePair && (
          <div className="space-y-4 py-1 text-xs">
            {/* Match Confidence & Reasons Header */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary text-white px-2 py-0.5 text-[10px] font-bold">
                    {selectedDuplicatePair.matchConfidence}% Match
                  </span>
                  <span className="font-bold text-foreground">
                    {selectedDuplicatePair.matchConfidenceTier} Confidence Identity Alert
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">Pair ID: {selectedDuplicatePair.id}</span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                <strong>Algorithmic Triggers:</strong> {selectedDuplicatePair.matchReasons.join(' · ')}
              </div>
            </div>

            {/* Surviving Record Choice Selector */}
            {selectedDuplicatePair.status === 'Pending Review' && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-foreground">
                  Choose Master Record to Survive Consolidation:
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      survivingCandidateChoice === 'A'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border bg-card hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="survivingCandidate"
                        checked={survivingCandidateChoice === 'A'}
                        onChange={() => setSurvivingCandidateChoice('A')}
                        className="accent-primary"
                      />
                      <span className="font-bold text-xs text-foreground">Keep Candidate A as Master</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Consolidates {selectedDuplicatePair.candidateB.name}'s data & applications into {selectedDuplicatePair.candidateA.name} ({selectedDuplicatePair.candidateA.id})
                    </p>
                  </label>

                  <label
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      survivingCandidateChoice === 'B'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border bg-card hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="survivingCandidate"
                        checked={survivingCandidateChoice === 'B'}
                        onChange={() => setSurvivingCandidateChoice('B')}
                        className="accent-primary"
                      />
                      <span className="font-bold text-xs text-foreground">Keep Candidate B as Master</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Consolidates {selectedDuplicatePair.candidateA.name}'s data & applications into {selectedDuplicatePair.candidateB.name} ({selectedDuplicatePair.candidateB.id})
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* Side-by-Side Comparison Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Column A */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between border-b border-border/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={selectedDuplicatePair.candidateA.name} />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{selectedDuplicatePair.candidateA.name}</h4>
                      <span className="font-mono text-[10px] text-primary">{selectedDuplicatePair.candidateA.id}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">
                    Candidate A
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Headline</span>
                    <span className="font-medium text-foreground">{selectedDuplicatePair.candidateA.headline}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Location</span>
                    <span className="font-medium text-foreground">{selectedDuplicatePair.candidateA.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Experience</span>
                    <span className="font-medium text-foreground">{selectedDuplicatePair.candidateA.experienceYears} Years</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDuplicatePair.candidateA.skills.map((skill) => (
                        <span key={skill} className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Applications</span>
                    <span className="font-bold text-primary">{selectedDuplicatePair.candidateA.applicationsCount} Submitted</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Attached Resume</span>
                    <span className="font-mono text-[10px] text-foreground">{selectedDuplicatePair.candidateA.resumeFileName}</span>
                  </div>

                  {/* PII Masked / Unmasked Contact Details */}
                  <div className="rounded-xl border border-border/80 bg-background/60 p-2.5 space-y-1 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-foreground uppercase">Contact Info (PII)</span>
                      {!revealedCandidateIds.has(selectedDuplicatePair.candidateA.id) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPiiTargetCandidateId(selectedDuplicatePair.candidateA.id);
                            setPiiJustificationModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <LockKeyhole size={10} /> Reveal Contact (Audit Logged)
                        </button>
                      )}
                    </div>
                    <div className="text-[10px]">
                      Email:{' '}
                      <span className="font-mono text-foreground">
                        {revealedCandidateIds.has(selectedDuplicatePair.candidateA.id)
                          ? selectedDuplicatePair.candidateA.email
                          : `${selectedDuplicatePair.candidateA.email.slice(0, 3)}••••@${selectedDuplicatePair.candidateA.email.split('@')[1] || 'domain.com'}`}
                      </span>
                    </div>
                    <div className="text-[10px]">
                      Phone:{' '}
                      <span className="font-mono text-foreground">
                        {revealedCandidateIds.has(selectedDuplicatePair.candidateA.id)
                          ? selectedDuplicatePair.candidateA.phone
                          : `${selectedDuplicatePair.candidateA.phone.slice(0, 7)} *****`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column B */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between border-b border-border/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={selectedDuplicatePair.candidateB.name} />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{selectedDuplicatePair.candidateB.name}</h4>
                      <span className="font-mono text-[10px] text-amber-700">{selectedDuplicatePair.candidateB.id}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold px-2 py-0.5">
                    Candidate B
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Headline</span>
                    <span className="font-medium text-foreground">{selectedDuplicatePair.candidateB.headline}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Location</span>
                    <span className="font-medium text-foreground">{selectedDuplicatePair.candidateB.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Experience</span>
                    <span className="font-medium text-foreground">{selectedDuplicatePair.candidateB.experienceYears} Years</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Skills</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDuplicatePair.candidateB.skills.map((skill) => (
                        <span key={skill} className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Applications</span>
                    <span className="font-bold text-primary">{selectedDuplicatePair.candidateB.applicationsCount} Submitted</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Attached Resume</span>
                    <span className="font-mono text-[10px] text-foreground">{selectedDuplicatePair.candidateB.resumeFileName}</span>
                  </div>

                  {/* PII Masked / Unmasked Contact Details */}
                  <div className="rounded-xl border border-border/80 bg-background/60 p-2.5 space-y-1 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-foreground uppercase">Contact Info (PII)</span>
                      {!revealedCandidateIds.has(selectedDuplicatePair.candidateB.id) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPiiTargetCandidateId(selectedDuplicatePair.candidateB.id);
                            setPiiJustificationModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <LockKeyhole size={10} /> Reveal Contact (Audit Logged)
                        </button>
                      )}
                    </div>
                    <div className="text-[10px]">
                      Email:{' '}
                      <span className="font-mono text-foreground">
                        {revealedCandidateIds.has(selectedDuplicatePair.candidateB.id)
                          ? selectedDuplicatePair.candidateB.email
                          : `${selectedDuplicatePair.candidateB.email.slice(0, 3)}••••@${selectedDuplicatePair.candidateB.email.split('@')[1] || 'domain.com'}`}
                      </span>
                    </div>
                    <div className="text-[10px]">
                      Phone:{' '}
                      <span className="font-mono text-foreground">
                        {revealedCandidateIds.has(selectedDuplicatePair.candidateB.id)
                          ? selectedDuplicatePair.candidateB.phone
                          : `${selectedDuplicatePair.candidateB.phone.slice(0, 7)} *****`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* PII UNMASK JUSTIFICATION MODAL (DPDP GOVERNANCE)              */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={piiJustificationModalOpen}
        onClose={() => setPiiJustificationModalOpen(false)}
        eyebrow="PII GOVERNANCE · DPDP ACT 2023"
        title="Administrative PII Unmask Justification"
        subtitle="Unmasking candidate contact details requires a statutory business justification. This action is permanently recorded in the platform audit log."
        maxWidth="max-w-[480px]"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setPiiJustificationModalOpen(false)}
              className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmPiiReveal}
              className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
            >
              Confirm & Record Access
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-1 text-xs">
          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Reason for Unmasking Contact Info (Required)
            </label>
            <textarea
              rows={3}
              value={piiJustificationText}
              onChange={(e) => setPiiJustificationText(e.target.value)}
              placeholder="e.g. Validating identity duplication alert JR-DUP-101 prior to profile consolidation."
              className="w-full rounded-xl border border-border bg-card p-2.5 text-xs outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5 text-[10px] text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary shrink-0" />
            <span>Recorded fields: Operator ID, IP Address, Timestamp, Candidate ID, and Justification.</span>
          </div>
        </div>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* BATCH 4: CONFIGURE ATS CONNECTOR MODAL (JOB-7)                */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(editingAtsConnector)}
        onClose={() => setEditingAtsConnector(null)}
        eyebrow="ATS INTEGRATION SETTINGS · JOB-7"
        title={`Configure ${editingAtsConnector?.name || 'ATS Connector'}`}
        subtitle="Configure API endpoints, sync cadence, and department filter scopes for automated vacancy ingestion."
        maxWidth="max-w-[520px]"
        footer={
          editingAtsConnector && (
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setEditingAtsConnector(null)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveConnectorConfig(editingAtsConnector)}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
              >
                Save Configuration
              </button>
            </div>
          )
        }
      >
        {editingAtsConnector && (
          <div className="space-y-4 py-1 text-xs">
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Connector Name</label>
              <input
                type="text"
                value={editingAtsConnector.name}
                onChange={(e) => setEditingAtsConnector({ ...editingAtsConnector, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-card p-2 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">API Endpoint URL</label>
              <input
                type="text"
                value={editingAtsConnector.endpointUrl}
                onChange={(e) => setEditingAtsConnector({ ...editingAtsConnector, endpointUrl: e.target.value })}
                className="w-full rounded-xl border border-border bg-card p-2 font-mono text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Sync Frequency</label>
                <select
                  value={editingAtsConnector.syncFrequency}
                  onChange={(e) =>
                    setEditingAtsConnector({
                      ...editingAtsConnector,
                      syncFrequency: e.target.value as any,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs outline-none focus:border-primary"
                >
                  <option value="Every 15 min">Every 15 min</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Status State</label>
                <select
                  value={editingAtsConnector.status}
                  onChange={(e) =>
                    setEditingAtsConnector({
                      ...editingAtsConnector,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs outline-none focus:border-primary"
                >
                  <option value="Connected">Connected</option>
                  <option value="Syncing">Syncing</option>
                  <option value="Warning">Warning</option>
                  <option value="Failed">Failed</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Masked API Credential Token</label>
              <input
                type="text"
                value={editingAtsConnector.apiKeyMasked}
                onChange={(e) => setEditingAtsConnector({ ...editingAtsConnector, apiKeyMasked: e.target.value })}
                className="w-full rounded-xl border border-border bg-card p-2 font-mono text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Department Scope Filter</label>
              <input
                type="text"
                value={editingAtsConnector.departmentFilter || ''}
                onChange={(e) => setEditingAtsConnector({ ...editingAtsConnector, departmentFilter: e.target.value })}
                placeholder="e.g. Engineering, Product, Sales"
                className="w-full rounded-xl border border-border bg-card p-2 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* BATCH 4: ATS SYNC ACTIVITY LOGS DRAWER / MODAL (JOB-7)        */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(selectedAtsLogs)}
        onClose={() => setSelectedAtsLogs(null)}
        eyebrow="INGESTION AUDIT LOG · JOB-7"
        title={`${selectedAtsLogs?.name || 'ATS'} Synchronization History`}
        subtitle="Complete ledger of delta ingestion jobs, records imported, and system execution status."
        maxWidth="max-w-[620px]"
        footer={
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => setSelectedAtsLogs(null)}
              className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedAtsLogs && (
          <div className="space-y-4 py-1 text-xs">
            <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Records Synced</span>
                <div className="text-base font-extrabold text-foreground">{selectedAtsLogs.recordsImported} jobs</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Current State</span>
                <div className="text-xs font-bold text-emerald-600">{selectedAtsLogs.connectionState}</div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">INGESTED</th>
                    <th className="py-2.5 px-3">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/75">
                  {selectedAtsLogs.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/10">
                      <td className="py-2.5 px-3 text-[11px] text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            log.status === 'Success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : log.status === 'Warning'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-foreground">{log.recordsImported} jobs</td>
                      <td className="py-2.5 px-3 text-[11px] text-muted-foreground">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* BATCH 4: MANUAL CSV JOB IMPORT MODAL (JOB-7 PRESERVATION)      */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isCsvUploadModalOpen}
        onClose={() => setIsCsvUploadModalOpen(false)}
        eyebrow="MANUAL INGESTION · JOB-7"
        title="Manual CSV Job Import"
        subtitle="Upload bulk CSV files containing job postings. Column definitions and required employer metadata are validated prior to ingestion."
        maxWidth="max-w-[500px]"
        footer={
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] text-muted-foreground">UTF-8 Encoded CSV required</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCsvUploadModalOpen(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={csvUploadState.isUploading}
                onClick={handleExecuteCsvUpload}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
              >
                {csvUploadState.isUploading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Ingesting…
                  </>
                ) : (
                  <>
                    <UploadCloud size={13} /> Import Listings
                  </>
                )}
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4 py-1 text-xs">
          {/* File Drag & Drop Simulation Zone */}
          <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center hover:bg-primary/10 transition-colors cursor-pointer">
            <UploadCloud size={32} className="mx-auto text-primary mb-2" />
            <div className="font-bold text-xs text-foreground">
              {csvUploadState.fileName || 'Click to select CSV or drag file here'}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Supports standard format: Title, Company, Location, Type, Salary, Requirements (up to 20MB)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">CSV Delimiter</label>
              <select
                value={csvUploadState.delimiter}
                onChange={(e) => setCsvUploadState({ ...csvUploadState, delimiter: e.target.value })}
                className="w-full rounded-xl border border-border bg-card p-2 text-xs outline-none focus:border-primary"
              >
                <option value="comma">Comma separated (,)</option>
                <option value="semicolon">Semicolon separated (;)</option>
                <option value="tab">Tab delimited (\t)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Simulated Records</label>
              <input
                type="number"
                value={csvUploadState.rowCount}
                onChange={(e) => setCsvUploadState({ ...csvUploadState, rowCount: +e.target.value })}
                className="w-full rounded-xl border border-border bg-card p-2 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={csvUploadState.autoPublish}
              onChange={(e) => setCsvUploadState({ ...csvUploadState, autoPublish: e.target.checked })}
              className="h-4 w-4 rounded accent-primary"
            />
            <span className="text-[11px] text-foreground font-medium">
              Bypass moderation for verified enterprise employers
            </span>
          </label>
        </div>
      </Modal>
    </div>
  );
}

function CandidatesTable({
  rows,
  onRowClick,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
}: {
  rows: AdminCandidate[];
  onRowClick?: (candidate: AdminCandidate) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
}) {
  return (
    <table className="w-full min-w-[850px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase">
          <th className="w-10 px-4 py-3.5 text-center">
            <input
              type="checkbox"
              data-testid="checkbox-select-all-candidates"
              checked={isAllSelected}
              onChange={onToggleSelectAll}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
              aria-label="Select all candidates"
            />
          </th>
          {['CANDIDATE', 'LOCATION', 'STATUS', 'PROFILE', 'SOURCE', 'LAST ACTIVE'].map((label) => (
            <th key={label} className="px-4 py-3.5">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => {
          const isSelected = selectedIds?.has(row.id) ?? false;
          return (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              data-testid={`row-candidate-${row.id}`}
              className={`transition-colors cursor-pointer ${
                isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-[#fbfaff]'
              }`}
            >
              <td
                className="w-10 px-4 py-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  data-testid={`checkbox-candidate-${row.id}`}
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelect?.(row.id);
                  }}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  aria-label={`Select ${row.name}`}
                />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] font-bold text-foreground">{row.name}</span>
                      {row.pro && (
                        <span className="rounded-full bg-[#eee9fc] border border-[#d8cbf9] px-1.5 py-0.5 text-[9px] font-bold text-primary flex items-center gap-0.5">
                          <Sparkles size={9} /> PRO
                        </span>
                      )}
                      {row.isEmailVerified ? (
                        <span className="inline-flex items-center text-[10px] text-emerald-600 font-medium" title="Email Verified">
                          <CheckCircle2 size={11} className="mr-0.5" />
                        </span>
                      ) : (
                        <span className="rounded-md bg-amber-50 border border-amber-200 px-1 py-0.2 text-[8px] font-bold text-amber-700">
                          Unverified
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 max-w-[240px] truncate text-[10px] text-muted-foreground">
                      {row.headline} · {row.emailMasked}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-[11px] text-foreground font-medium">{row.location}</div>
                {row.openToRemote && (
                  <span className="inline-block mt-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.2 text-[8px] font-bold">
                    Remote Ready
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                <StatusPill value={row.status} />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-[58px] overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max(0, Math.min(100, row.completion))}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                    {row.completion}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-[11px] text-muted-foreground font-medium">{row.source}</td>
              <td className="px-4 py-4 text-[10px] text-muted-foreground font-medium">{row.lastActive}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function EmployersTable({
  rows,
  onRowClick,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
}: {
  rows: AdminEmployer[];
  onRowClick?: (employer: AdminEmployer) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
}) {
  return (
    <table className="w-full min-w-[900px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase">
          <th className="w-10 px-4 py-3.5 text-center">
            <input
              type="checkbox"
              data-testid="checkbox-select-all-employers"
              checked={isAllSelected}
              onChange={onToggleSelectAll}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
              aria-label="Select all employers"
            />
          </th>
          {['EMPLOYER / COMPANY', 'LOCATION', 'VERIFICATION', 'JOBS', 'PLAN', 'ACCOUNT', 'JOINED'].map(
            (label) => (
              <th key={label} className="px-4 py-3.5">
                {label}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => {
          const isSelected = selectedIds?.has(row.id) ?? false;
          return (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              data-testid={`row-employer-${row.id}`}
              className={`transition-colors cursor-pointer ${
                isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-[#fbfaff]'
              }`}
            >
              <td
                className="w-10 px-4 py-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  data-testid={`checkbox-employer-${row.id}`}
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelect?.(row.id);
                  }}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  aria-label={`Select ${row.company}`}
                />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={row.company} />
                  <div>
                    <div className="text-[12px] font-bold">{row.company}</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      {row.name} · {row.emailMasked}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-[11px] text-muted-foreground font-medium">{row.location}</td>
              <td className="px-4 py-4">
                <StatusPill value={row.verification} />
              </td>
              <td className="px-4 py-4 font-mono text-[11px] font-bold">{row.jobs}</td>
              <td className="px-4 py-4 text-[11px] font-semibold">{row.plan}</td>
              <td className="px-4 py-4">
                <StatusPill value={row.status} />
              </td>
              <td className="px-4 py-4 text-[10px] text-muted-foreground font-medium">{row.joined}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function JobsTable({
  rows,
  onReview,
  onRowClick,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  onConsolidate,
}: {
  rows: AdminJob[];
  onReview: (job: AdminJob, action: ReviewDecision) => void;
  onRowClick?: (job: AdminJob) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
  onConsolidate?: (job: AdminJob, duplicateTargetId: string) => void;
}) {
  return (
    <table className="w-full min-w-[930px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase">
          <th className="w-10 px-4 py-3.5 text-center">
            <input
              type="checkbox"
              data-testid="checkbox-select-all-jobs"
              checked={isAllSelected}
              onChange={onToggleSelectAll}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
              aria-label="Select all jobs"
            />
          </th>
          {['LISTING', 'LOCATION & MODE', 'TYPE', 'STATUS', 'POSTED', 'APPLICANTS', 'REVIEW'].map(
            (label) => (
              <th key={label} className="px-4 py-3.5">
                {label}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => {
          const isSelected = selectedIds?.has(row.id) ?? false;
          return (
            <tr
              key={row.id}
              data-testid={`row-job-${row.id}`}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors cursor-pointer ${
                isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-[#fbfaff]'
              }`}
            >
              <td
                className="w-10 px-4 py-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  data-testid={`checkbox-job-${row.id}`}
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelect?.(row.id);
                  }}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                  aria-label={`Select ${row.title}`}
                />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0edfa] text-primary">
                    💼
                  </div>
                  <div>
                    <div className="text-[12px] font-bold">
                      {row.title}
                      {row.flagged && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                          🚩 Flagged
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground font-medium">
                      {row.company}
                    </div>
                    {row.duplicateSignals && (
                      <button
                        type="button"
                        data-testid={`button-consolidate-job-${row.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onConsolidate?.(row, row.duplicateSignals!.potentialDuplicateJobId);
                        }}
                        className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9px] font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                      >
                        <GitMerge size={11} /> Duplicate Signal ({row.duplicateSignals.similarityScore}% match): Review & Consolidate
                      </button>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-[11px] font-medium">{row.location}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">{row.workMode}</div>
              </td>
              <td className="px-4 py-4 text-[11px] text-muted-foreground font-medium">{row.type}</td>
              <td className="px-4 py-4">
                <StatusPill value={row.status} />
              </td>
              <td className="px-4 py-4 text-[10px] text-muted-foreground font-medium">{row.posted}</td>
              <td className="px-4 py-4 font-mono text-[11px] font-bold">{row.applicants}</td>
              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                {row.status === 'Pending' ? (
                  <div className="flex items-center gap-1">
                    <button
                      data-testid={`button-approve-${row.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReview(row, 'approve');
                      }}
                      className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 text-[10px] font-bold transition-colors"
                      aria-label={`Approve ${row.title}`}
                    >
                      Approve
                    </button>
                    <button
                      data-testid={`button-reject-${row.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReview(row, 'reject');
                      }}
                      className="rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-1 text-[10px] font-bold transition-colors"
                      aria-label={`Reject ${row.title}`}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const ONBOARDING_STEPS: { step: OnboardingStepNumber; name: string; short: string }[] = [
  { step: 1, name: 'Company Profile', short: 'Profile' },
  { step: 2, name: 'Team & Billing', short: 'Team' },
  { step: 3, name: 'Verification', short: 'Verify' },
  { step: 4, name: 'Start Hiring', short: 'Hiring' },
];

function OnboardingProgressStepper({
  currentStep,
  stepStatus,
  stepsCompleted,
}: {
  currentStep: OnboardingStepNumber;
  stepStatus: OnboardingStepStatus;
  stepsCompleted: OnboardingStepNumber[];
}) {
  return (
    <div className="space-y-1.5 py-0.5">
      {/* Desktop / Tablet Stepper */}
      <div className="hidden sm:flex items-center gap-1">
        {ONBOARDING_STEPS.map((s, index) => {
          const isDone = stepsCompleted.includes(s.step);
          const isCurrent = currentStep === s.step;

          return (
            <div key={s.step} className="flex items-center">
              {index > 0 && (
                <div
                  className={`h-0.5 w-3 sm:w-5 rounded-full mr-1 transition-colors ${
                    isDone || (isCurrent && stepStatus === 'Completed')
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-primary/40'
                      : 'bg-border/80'
                  }`}
                />
              )}

              <div
                className="flex flex-col items-center gap-0.5"
                title={`${s.step}. ${s.name}`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : isCurrent
                      ? stepStatus === 'Stuck'
                        ? 'bg-rose-50 border-2 border-rose-500 text-rose-700 shadow-2xs'
                        : stepStatus === 'Completed'
                        ? 'bg-emerald-600 text-white'
                        : stepStatus === 'Draft'
                        ? 'bg-amber-50 border-2 border-amber-500 text-amber-800'
                        : 'bg-primary/10 border-2 border-primary text-primary shadow-2xs'
                      : 'bg-muted/70 border border-border/80 text-muted-foreground/60'
                  }`}
                >
                  {isDone ? (
                    <Check size={12} strokeWidth={2.8} />
                  ) : isCurrent && stepStatus === 'Stuck' ? (
                    <AlertCircle size={12} strokeWidth={2.5} />
                  ) : isCurrent && stepStatus === 'Completed' ? (
                    <Check size={12} strokeWidth={2.8} />
                  ) : (
                    s.step
                  )}
                </div>

                <span
                  className={`text-[9px] font-semibold tracking-tight whitespace-nowrap ${
                    isCurrent
                      ? 'text-foreground font-bold'
                      : isDone
                      ? 'text-emerald-700'
                      : 'text-muted-foreground/60'
                  }`}
                >
                  {s.short}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Progress Bar */}
      <div className="sm:hidden space-y-1">
        <div className="flex items-center gap-1 w-28">
          {ONBOARDING_STEPS.map((s) => {
            const isDone = stepsCompleted.includes(s.step);
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? stepStatus === 'Stuck'
                      ? 'bg-rose-500'
                      : stepStatus === 'Draft'
                      ? 'bg-amber-500'
                      : 'bg-primary'
                    : 'bg-muted'
                }`}
                title={`${s.step}. ${s.name}`}
              />
            );
          })}
        </div>
        <div className="text-[10px] text-muted-foreground font-medium">
          Step {currentStep}/4: {ONBOARDING_STEPS[currentStep - 1]?.short}
        </div>
      </div>
    </div>
  );
}

function OnboardingTrackerView({
  employers,
  onInspect,
  onNudge,
  onResetStep,
}: {
  employers: AdminEmployer[];
  onInspect: (emp: AdminEmployer) => void;
  onNudge: (emp: AdminEmployer) => void;
  onResetStep: (emp: AdminEmployer) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'stuck' | 'in-progress' | 'completed'>('all');

  const onboardingEmployers = employers.filter((e) => Boolean(e.onboarding));

  const filteredEmployers = onboardingEmployers.filter((e) => {
    if (!e.onboarding) return false;
    if (filter === 'stuck') return e.onboarding.stepStatus === 'Stuck';
    if (filter === 'in-progress') return e.onboarding.stepStatus === 'In progress' || e.onboarding.stepStatus === 'Draft';
    if (filter === 'completed') return e.onboarding.stepStatus === 'Completed';
    return true;
  });

  const total = onboardingEmployers.length;
  const completedCount = onboardingEmployers.filter((e) => e.onboarding?.stepStatus === 'Completed').length;
  const inProgressCount = onboardingEmployers.filter(
    (e) => e.onboarding?.stepStatus === 'In progress' || e.onboarding?.stepStatus === 'Draft'
  ).length;
  const stuckCount = onboardingEmployers.filter((e) => e.onboarding?.stepStatus === 'Stuck').length;

  return (
    <div className="space-y-6">
      {/* 1. Funnel KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total in Pipeline
          </div>
          <div className="font-display text-2xl font-extrabold text-foreground">{total}</div>
          <div className="text-[10px] text-muted-foreground">Employer accounts tracking</div>
        </div>

        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/30 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Completed & Hiring
          </div>
          <div className="font-display text-2xl font-extrabold text-emerald-700">{completedCount}</div>
          <div className="text-[10px] text-emerald-600/90">Step 4 cleared · Live on platform</div>
        </div>

        <div className="rounded-xl border border-blue-200/70 bg-blue-50/30 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
            In Progress
          </div>
          <div className="font-display text-2xl font-extrabold text-blue-700">{inProgressCount}</div>
          <div className="text-[10px] text-blue-600/90">Active profile & verification</div>
        </div>

        <div className="rounded-xl border border-rose-200/70 bg-rose-50/30 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
            Needs Action / Stuck
          </div>
          <div className="font-display text-2xl font-extrabold text-rose-700">{stuckCount}</div>
          <div className="text-[10px] text-rose-600/90">Drop-off warning or doc rejected</div>
        </div>
      </div>

      {/* 2. Filter Pills & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Filter:</span>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            All Employers ({total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('stuck')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'stuck'
                ? 'bg-rose-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            Stuck ({stuckCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('in-progress')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'in-progress'
                ? 'bg-blue-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <span className="text-[11px] text-muted-foreground">
          Showing {filteredEmployers.length} of {total} employers
        </span>
      </div>

      {/* 3. Onboarding Table */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table
          data-testid="onboarding-tracker-table"
          className="w-full min-w-[980px] border-collapse text-left"
        >
          <thead>
            <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase border-y border-border/80">
              <th className="px-3.5 py-3.5">COMPANY & CONTACT</th>
              <th className="px-3.5 py-3.5">CURRENT STEP</th>
              <th className="px-3.5 py-3.5">4-STEP PIPELINE PROGRESS</th>
              <th className="px-3.5 py-3.5">STATUS & ACTIVITY</th>
              <th className="px-3.5 py-3.5">DRAFT / PROGRESS SUMMARY</th>
              <th className="px-3.5 py-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/75">
            {filteredEmployers.map((emp) => {
              const ob = emp.onboarding!;
              return (
                <tr
                  key={emp.id}
                  data-testid={`row-onboarding-${emp.id}`}
                  className="transition-colors hover:bg-[#fbfaff]"
                >
                  {/* Company & Contact */}
                  <td className="px-3.5 py-4 align-top">
                    <div className="flex items-start gap-3">
                      <Avatar name={emp.company} />
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-foreground truncate">
                          {emp.company}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                          {emp.name} · <span className="font-mono">{emp.emailMasked}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {emp.location} · {emp.industry || 'Technology'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Current Step */}
                  <td className="px-3.5 py-4 align-top whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 border border-border/80 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      Step {ob.step} of 4
                    </div>
                    <div className="text-xs font-bold text-foreground mt-1.5">
                      {ob.stepName}
                    </div>
                  </td>

                  {/* 4-Step Pipeline Progress */}
                  <td className="px-3.5 py-4 align-top min-w-[240px]">
                    <OnboardingProgressStepper
                      currentStep={ob.step}
                      stepStatus={ob.stepStatus}
                      stepsCompleted={ob.stepsCompleted}
                    />
                  </td>

                  {/* Status & Activity */}
                  <td className="px-3.5 py-4 align-top min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <StatusPill value={ob.stepStatus} />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
                      <Clock size={11} className="shrink-0" />
                      <span>Active: {ob.lastActive}</span>
                    </div>

                    {ob.dropOffWarning && (
                      <div className="mt-2 flex items-start gap-1 rounded-lg bg-rose-50 border border-rose-200/80 p-1.5 text-[10px] text-rose-800 leading-snug">
                        <AlertCircle size={11} className="shrink-0 text-rose-600 mt-0.5" />
                        <span>{ob.dropOffWarning}</span>
                      </div>
                    )}

                    {ob.nudgeCount && ob.nudgeCount > 0 ? (
                      <div className="text-[10px] text-muted-foreground mt-1 font-medium">
                        Nudged {ob.nudgeCount}x · Last: {ob.lastNudgeDate}
                      </div>
                    ) : null}
                  </td>

                  {/* Draft / Progress Summary */}
                  <td className="px-3.5 py-4 align-top max-w-[240px]">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {ob.draftSummary}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-3.5 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        data-testid={`button-nudge-${emp.id}`}
                        onClick={() => onNudge(emp)}
                        className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted hover:border-primary/40 hover:text-primary transition-colors"
                        title="Nudge by email"
                      >
                        <Send size={11} className="text-primary" />
                        <span>Nudge</span>
                      </button>

                      <button
                        type="button"
                        data-testid={`button-reset-${emp.id}`}
                        onClick={() => onResetStep(emp)}
                        className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                        title="Reset step to draft"
                      >
                        <RotateCcw size={11} />
                        <span>Reset</span>
                      </button>

                      <button
                        type="button"
                        data-testid={`button-inspect-${emp.id}`}
                        onClick={() => onInspect(emp)}
                        className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
                        title="Inspect employer details"
                      >
                        <Eye size={11} />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConsistencyChecksView({
  issues,
  onInspect,
  onResolve,
  onDismiss,
}: {
  issues: JobConsistencyIssue[];
  onInspect: (jobId: string) => void;
  onResolve: (issueId: string) => void;
  onDismiss: (issue: JobConsistencyIssue) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'high' | 'unresolved' | 'work-mode' | 'salary' | 'expired'>('all');

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'high') return issue.severity === 'High';
    if (filter === 'unresolved') return issue.status === 'Unresolved';
    if (filter === 'work-mode') return issue.issueType === 'Work Mode Mismatch';
    if (filter === 'salary') return issue.issueType === 'Salary Formatting Anomaly';
    if (filter === 'expired') return issue.issueType === 'Expired Jobs';
    return true;
  });

  const total = issues.length;
  const highCount = issues.filter((i) => i.severity === 'High').length;
  const unresolvedCount = issues.filter((i) => i.status === 'Unresolved').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved' || i.status === 'Dismissed').length;

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Inconsistencies
          </div>
          <div className="font-display text-2xl font-extrabold text-foreground">{total}</div>
          <div className="text-[10px] text-muted-foreground">Automated rule checks flagged</div>
        </div>

        <div className="rounded-xl border border-rose-200/70 bg-rose-50/30 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
            High Severity
          </div>
          <div className="font-display text-2xl font-extrabold text-rose-700">{highCount}</div>
          <div className="text-[10px] text-rose-600/90">Work mode or expiry conflicts</div>
        </div>

        <div className="rounded-xl border border-amber-200/70 bg-amber-50/30 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Unresolved
          </div>
          <div className="font-display text-2xl font-extrabold text-amber-800">{unresolvedCount}</div>
          <div className="text-[10px] text-amber-700/90">Awaiting moderator action</div>
        </div>

        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/30 p-3.5 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Resolved / Dismissed
          </div>
          <div className="font-display text-2xl font-extrabold text-emerald-700">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-600/90">Reviewed and cleared</div>
        </div>
      </div>

      {/* 2. Filter Pills & Category Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Filter:</span>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            All Issues ({total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('high')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'high'
                ? 'bg-rose-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            High Severity ({highCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unresolved')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'unresolved'
                ? 'bg-amber-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            Unresolved ({unresolvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('work-mode')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'work-mode'
                ? 'bg-blue-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            Work Mode Mismatch
          </button>
          <button
            type="button"
            onClick={() => setFilter('salary')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'salary'
                ? 'bg-blue-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            Salary Anomaly
          </button>
          <button
            type="button"
            onClick={() => setFilter('expired')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
              filter === 'expired'
                ? 'bg-blue-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            Expired Jobs
          </button>
        </div>

        <span className="text-[11px] text-muted-foreground">
          Showing {filteredIssues.length} of {total} issues
        </span>
      </div>

      {/* 3. Consistency Checks Table */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table
          data-testid="consistency-checks-table"
          className="w-full min-w-[980px] border-collapse text-left"
        >
          <thead>
            <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase border-y border-border/80">
              <th className="px-3.5 py-3.5">JOB & COMPANY</th>
              <th className="px-3.5 py-3.5">ISSUE TYPE</th>
              <th className="px-3.5 py-3.5">CURRENT VALUE & PROBLEM DETAILS</th>
              <th className="px-3.5 py-3.5">SEVERITY / STATUS</th>
              <th className="px-3.5 py-3.5">DETECTED</th>
              <th className="px-3.5 py-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/75">
            {filteredIssues.map((issue) => (
              <tr
                key={issue.id}
                data-testid={`row-consistency-${issue.id}`}
                className="transition-colors hover:bg-[#fbfaff]"
              >
                {/* Job & Company */}
                <td className="px-3.5 py-4 align-top">
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-foreground">
                      {issue.jobTitle}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                      {issue.company}
                    </div>
                    <div className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
                      ID: {issue.jobId}
                    </div>
                  </div>
                </td>

                {/* Issue Type */}
                <td className="px-3.5 py-4 align-top whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 border border-border/80 px-2 py-0.5 text-[10px] font-bold text-foreground">
                    {issue.issueType}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">
                    {issue.fieldChecked}
                  </div>
                </td>

                {/* Current Value & Problem */}
                <td className="px-3.5 py-4 align-top max-w-[340px]">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                        Current:
                      </span>
                      <span className="font-mono text-[10px] bg-muted/70 px-1.5 py-0.5 rounded border border-border/60">
                        {issue.currentValue}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {issue.problemDescription}
                    </p>
                    {issue.resolutionNote && (
                      <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-1.5 py-0.5">
                        Note: {issue.resolutionNote}
                      </p>
                    )}
                  </div>
                </td>

                {/* Severity & Status */}
                <td className="px-3.5 py-4 align-top whitespace-nowrap min-w-[150px]">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Severity:</span>
                      <StatusPill value={issue.severity} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Status:</span>
                      <StatusPill value={issue.status} />
                    </div>
                  </div>
                </td>

                {/* Detected */}
                <td className="px-3.5 py-4 align-top whitespace-nowrap">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock size={11} />
                    <span>{issue.detectedDate}</span>
                  </div>
                  {issue.resolvedAt && (
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                      Resolved: {issue.resolvedAt}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-3.5 py-4 align-top text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      data-testid={`button-inspect-job-${issue.id}`}
                      onClick={() => onInspect(issue.jobId)}
                      className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
                      title="Inspect job listing"
                    >
                      <Eye size={11} />
                      <span>Inspect</span>
                    </button>

                    <button
                      type="button"
                      data-testid={`button-resolve-issue-${issue.id}`}
                      onClick={() => onResolve(issue.id)}
                      className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                        issue.status === 'Resolved'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'border-border bg-background text-foreground hover:bg-muted hover:border-emerald-300 hover:text-emerald-700'
                      }`}
                      title={issue.status === 'Resolved' ? 'Mark unresolved' : 'Mark reviewed and resolved'}
                    >
                      <CheckCircle2 size={11} className={issue.status === 'Resolved' ? 'text-emerald-600' : 'text-muted-foreground'} />
                      <span>{issue.status === 'Resolved' ? 'Resolved' : 'Resolve'}</span>
                    </button>

                    <button
                      type="button"
                      data-testid={`button-dismiss-issue-${issue.id}`}
                      disabled={issue.status === 'Dismissed'}
                      onClick={() => onDismiss(issue)}
                      className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 disabled:opacity-40 transition-colors"
                      title="Dismiss anomaly"
                    >
                      <XCircle size={11} />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
