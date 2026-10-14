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
} from 'lucide-react';
import {
  adminCandidates,
  adminEmployers,
  adminJobs,
  adminJobConsistencyIssues,
  filterDirectoryRecords,
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
} from '@/mock-data';
import { Avatar, StatusPill, TableSkeleton, EmptyState, Modal } from '@/components/ui';

type DirectoryPageProps = {
  kind: DirectoryKind;
  title: string;
  eyebrow: string;
  description: string;
};

const directorySections = {
  candidates: ['All candidates', 'Candidate detail', 'Deletion requests'],
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

  const sourceRows: DirectoryRecord[] =
    kind === 'candidates' ? candidates : kind === 'employers' ? employers : jobs;
  const list = useMemo(
    () => filterDirectoryRecords(kind, sourceRows, '', status),
    [kind, sourceRows, status]
  );
  const busy = false;

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
                  onClick={() => navigate(`/candidates/${activeCandidate.id}`)}
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
                        navigate(`/employers/${emp.id}`);
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
                        navigate(`/employers/${emp.id}`);
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
                      navigate(`/employers/${emp.id}`);
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
              onInspect={(emp) => navigate(`/employers/${emp.id}`)}
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
                onRowClick={(job) => navigate(`/jobs/${job.id}`)}
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
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
                  <th>IMPORT ID</th>
                  <th>SOURCE</th>
                  <th>JOBS CREATED</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]">
                  <td className="py-4 px-2 text-[12px] font-bold font-mono">IMP-992</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Workday API</td>
                  <td className="py-4 px-2 text-xs">120</td>
                  <td className="py-4 px-2 text-xs text-muted-foreground">Today, 10:00 AM</td>
                  <td className="py-4 px-2">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      Success
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() =>
                        setActionModal({
                          title: 'View Import Logs',
                          subtitle: 'IMP-992 (Workday API)',
                          actionText: 'Close',
                          tone: 'primary',
                        })
                      }
                      className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Logs
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {kind === 'jobs' && activeSection === 'Consistency checks' && (
            <ConsistencyChecksView
              issues={consistencyIssues}
              onInspect={(jobId) => {
                const job = jobs.find((j) => j.id === jobId);
                if (job) navigate(`/jobs/${job.id}`);
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
          <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5 mt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <Filter size={15} className="text-primary" /> Refine directory
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
              <LockKeyhole size={13} /> Sensitive personal information is masked in this directory.
            </div>
          </section>

          {busy ? (
            <TableSkeleton />
          ) : !list.length ? (
            <EmptyState
              title={`No ${kind} to display`}
              detail="Records will appear here when they are available."
            />
          ) : (
            <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                {kind === 'candidates' && (
                  <CandidatesTable
                    rows={list as AdminCandidate[]}
                    onRowClick={(candidate) => navigate(`/candidates/${candidate.id}`)}
                  />
                )}
                {kind === 'employers' && (
                  <EmployersTable
                    rows={list as AdminEmployer[]}
                    onRowClick={(employer) => navigate(`/employers/${employer.id}`)}
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
                    onRowClick={(job) => navigate(`/jobs/${job.id}`)}
                  />
                )}
              </div>
              <div className="pointer-events-none absolute right-0 top-0 bottom-12 w-6 bg-gradient-to-l from-card to-transparent sm:hidden" />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
                <span>
                  Showing {list.length} {kind}
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
    </div>
  );
}

function CandidatesTable({
  rows,
  onRowClick,
}: {
  rows: AdminCandidate[];
  onRowClick?: (candidate: AdminCandidate) => void;
}) {
  return (
    <table className="w-full min-w-[780px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase">
          {['CANDIDATE', 'LOCATION', 'STATUS', 'PROFILE', 'SOURCE', 'LAST ACTIVE'].map((label) => (
            <th key={label} className="px-4 py-3.5">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => (
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row)}
            data-testid={`row-candidate-${row.id}`}
            className="transition-colors hover:bg-[#fbfaff] cursor-pointer"
          >
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar name={row.name} />
                <div>
                  <div className="text-[12px] font-bold">
                    {row.name}
                    {row.pro && (
                      <span className="ml-2 rounded-full bg-[#eee9fc] px-1.5 py-0.5 text-[9px] font-bold text-primary">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 max-w-[220px] truncate text-[10px] text-muted-foreground">
                    {row.headline} · {row.emailMasked}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-4 py-4 text-[11px] text-muted-foreground font-medium">{row.location}</td>
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
        ))}
      </tbody>
    </table>
  );
}

function EmployersTable({
  rows,
  onRowClick,
}: {
  rows: AdminEmployer[];
  onRowClick?: (employer: AdminEmployer) => void;
}) {
  return (
    <table className="w-full min-w-[900px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase">
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
        {rows.map((row) => (
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row)}
            data-testid={`row-employer-${row.id}`}
            className="transition-colors hover:bg-[#fbfaff] cursor-pointer"
          >
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
        ))}
      </tbody>
    </table>
  );
}

function JobsTable({
  rows,
  onReview,
  onRowClick,
}: {
  rows: AdminJob[];
  onReview: (job: AdminJob, action: ReviewDecision) => void;
  onRowClick?: (job: AdminJob) => void;
}) {
  return (
    <table className="w-full min-w-[930px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase">
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
        {rows.map((row) => (
          <tr
            key={row.id}
            data-testid={`row-job-${row.id}`}
            onClick={() => onRowClick?.(row)}
            className="transition-colors hover:bg-[#fbfaff] cursor-pointer"
          >
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
        ))}
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
