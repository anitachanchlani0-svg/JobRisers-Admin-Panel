import { useMemo, useState } from 'react';
import { Filter, LockKeyhole } from 'lucide-react';
import { adminCandidates, adminEmployers, adminJobs, filterDirectoryRecords, reviewStatus, type AdminCandidate, type AdminEmployer, type AdminJob, type DirectoryKind, type DirectoryRecord, type ReviewDecision } from '@/mock-data';
import { Avatar, StatusPill, TableSkeleton, EmptyState } from '@/components/ui';

type DirectoryPageProps = {
  kind: DirectoryKind;
  title: string;
  eyebrow: string;
  description: string;
};

const directorySections = {
  candidates: ['All candidates', 'Candidate detail', 'Deletion requests'],
  employers: ['Employer accounts', 'Companies', 'Verification queue'],
  jobs: ['All jobs', 'Moderation queue', 'Reported jobs', 'Imports'],
};

export function DirectoryPage({ kind, title, eyebrow, description }: DirectoryPageProps) {
  const sections = directorySections[kind];
  const [selected, setSelected] = useState(sections[0]);
  const [status, setStatus] = useState('All statuses');
  const [jobs, setJobs] = useState(adminJobs);
  const [reviewTarget, setReviewTarget] = useState<AdminJob | null>(null);
  const [decision, setDecision] = useState<ReviewDecision>('approve');
  const [reason, setReason] = useState('');

  const sourceRows: DirectoryRecord[] = kind === 'candidates' ? adminCandidates : kind === 'employers' ? adminEmployers : jobs;
  const list = useMemo(() => filterDirectoryRecords(kind, sourceRows, '', status), [kind, sourceRows, status]);
  const busy = false;

  const statuses = kind === 'candidates' ? ['All statuses', 'Active', 'Pending', 'Suspended'] : kind === 'employers' ? ['All statuses', 'Active', 'Suspended', 'Pending', 'Under review', 'Need info', 'Verified', 'Rejected'] : ['All statuses', 'Draft', 'Pending', 'Live', 'Paused', 'Expired', 'Rejected', 'Removed'];

  const submitReview = () => {
    if (!reviewTarget) return;
    setJobs((current) => current.map((job) => job.id === reviewTarget.id ? { ...job, status: reviewStatus(decision) } : job));
    setReviewTarget(null);
    setReason('');
  };

  return (
    <div className="space-y-5">
      <div className="mb-7">
        <div className="mb-2 text-[9px] font-bold tracking-[.18em] text-primary">{eyebrow}</div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[30px] font-extrabold leading-tight tracking-[-.045em]">{title}</h1>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-border">
        {sections.map((section) => (
          <button key={section} onClick={() => setSelected(section)} aria-pressed={selected === section} className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-[10px] font-semibold transition-colors ${selected === section ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {section}
          </button>
        ))}
      </div>

      {selected !== sections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 mt-5">
          <EmptyState title={`${selected} preview`} detail={`This section displays the ${selected.toLowerCase()} workflow.`} />
        </section>
      ) : (
        <>
          <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5 mt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <Filter size={15} className="text-primary" /> Refine directory
                <span className="ml-1 font-normal text-muted-foreground">{busy ? 'Loading records…' : `${list.length} records`}</span>
              </div>
              <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>Status</span>
                <select data-testid={`select-${kind}-status`} value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 min-w-[150px] rounded-lg border border-border bg-card px-3 text-[11px] font-medium text-foreground outline-none focus:border-primary">
                  <option>All statuses</option>
                  {statuses.slice(1).map((value) => <option key={value}>{value}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground"><LockKeyhole size={13} /> Sensitive personal information is masked in this directory.</div>
          </section>

          {busy ? <TableSkeleton /> : !list.length ? (
            <EmptyState title={`No ${kind} to display`} detail="Records will appear here when they are available." />
          ) : (
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                {kind === 'candidates' && <CandidatesTable rows={list as AdminCandidate[]} />}
                {kind === 'employers' && <EmployersTable rows={list as AdminEmployer[]} />}
                {kind === 'jobs' && <JobsTable rows={list as AdminJob[]} onReview={(job, action) => { setReviewTarget(job); setDecision(action); setReason(''); }} />}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
                <span>Showing {list.length} {kind}</span>
                <span className="rounded-md bg-muted px-2 py-1">All matching records</span>
              </div>
            </section>
          )}
        </>
      )}

      {reviewTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setReviewTarget(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="review-title" className="w-full max-w-[460px] rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold tracking-[.16em] text-primary">JOB MODERATION</p>
                <h2 id="review-title" className="mt-2 font-display text-xl font-extrabold tracking-tight">{decision === 'approve' ? 'Approve this listing?' : decision === 'reject' ? 'Reject this listing?' : 'Request edits?'}</h2>
              </div>
              <button aria-label="Close review dialog" onClick={() => setReviewTarget(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">×</button>
            </div>
            <div className="mt-4 rounded-xl bg-muted/70 p-3">
              <div className="text-[12px] font-semibold">{reviewTarget.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{reviewTarget.company} · {reviewTarget.location}</div>
            </div>
            <label className="mt-4 block text-[11px] font-semibold">
              Reason <span className="font-normal text-muted-foreground">{decision === 'approve' ? '(optional)' : '(required)'}</span>
              <textarea required={decision !== 'approve'} data-testid="input-review-reason" value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder={decision === 'approve' ? 'Add context for the audit trail…' : 'Explain the decision for the employer and audit trail…'} className="mt-2 w-full resize-none rounded-xl border border-border bg-background p-3 text-[12px] font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setReviewTarget(null)} className="rounded-lg border border-border px-4 py-2 text-[11px] font-semibold hover:bg-muted">Cancel</button>
              <button data-testid="button-confirm-review" disabled={decision !== 'approve' && !reason.trim()} onClick={submitReview} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60 ${decision === 'reject' ? 'bg-rose-600' : decision === 'request-edits' ? 'bg-amber-600' : 'bg-primary'}`}>
                {decision === 'approve' ? 'Approve listing' : decision === 'reject' ? 'Reject listing' : 'Request edits'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CandidatesTable({ rows }: { rows: AdminCandidate[] }) {
  return (
    <table className="w-full min-w-[780px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
          {['CANDIDATE', 'LOCATION', 'STATUS', 'PROFILE', 'SOURCE', 'LAST ACTIVE'].map((label) => <th key={label} className="px-4 py-3.5">{label}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => (
          <tr key={row.id} data-testid={`row-candidate-${row.id}`} className="transition-colors hover:bg-[#fbfaff]">
            <td className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={row.name} />
                <div>
                  <div className="text-[12px] font-semibold">{row.name}{row.pro && <span className="ml-2 rounded-full bg-[#eee9fc] px-1.5 py-0.5 text-[9px] font-semibold text-primary">PRO</span>}</div>
                  <div className="mt-0.5 max-w-[220px] truncate text-[10px] text-muted-foreground">{row.headline} · {row.emailMasked}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3.5 text-[11px] text-muted-foreground">{row.location}</td>
            <td className="px-4 py-3.5"><StatusPill value={row.status} /></td>
            <td className="px-4 py-3.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-[58px] overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, row.completion))}%` }} />
                </div>
                <span className="font-mono-ui text-[10px] text-muted-foreground">{row.completion}%</span>
              </div>
            </td>
            <td className="px-4 py-3.5 text-[11px] text-muted-foreground">{row.source}</td>
            <td className="px-4 py-3.5 text-[10px] text-muted-foreground">{row.lastActive}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmployersTable({ rows }: { rows: AdminEmployer[] }) {
  return (
    <table className="w-full min-w-[900px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
          {['EMPLOYER / COMPANY', 'LOCATION', 'VERIFICATION', 'JOBS', 'PLAN', 'ACCOUNT', 'JOINED'].map((label) => <th key={label} className="px-4 py-3.5">{label}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => (
          <tr key={row.id} data-testid={`row-employer-${row.id}`} className="transition-colors hover:bg-[#fbfaff]">
            <td className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={row.company} />
                <div>
                  <div className="text-[12px] font-semibold">{row.company}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{row.name} · {row.emailMasked}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3.5 text-[11px] text-muted-foreground">{row.location}</td>
            <td className="px-4 py-3.5"><StatusPill value={row.verification} /></td>
            <td className="px-4 py-3.5 font-mono-ui text-[11px]">{row.jobs}</td>
            <td className="px-4 py-3.5 text-[11px]">{row.plan}</td>
            <td className="px-4 py-3.5"><StatusPill value={row.status} /></td>
            <td className="px-4 py-3.5 text-[10px] text-muted-foreground">{row.joined}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function JobsTable({ rows, onReview }: { rows: AdminJob[]; onReview: (job: AdminJob, action: ReviewDecision) => void }) {
  return (
    <table className="w-full min-w-[930px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
          {['LISTING', 'LOCATION & MODE', 'TYPE', 'STATUS', 'POSTED', 'APPLICANTS', 'REVIEW'].map((label) => <th key={label} className="px-4 py-3.5">{label}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => (
          <tr key={row.id} data-testid={`row-job-${row.id}`} className="transition-colors hover:bg-[#fbfaff]">
            <td className="px-4 py-3.5">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0edfa] text-primary">💼</div>
                <div>
                  <div className="text-[12px] font-semibold">{row.title}{row.flagged && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-semibold text-rose-700">🚩 Flagged</span>}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{row.company}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3.5"><div className="text-[11px]">{row.location}</div><div className="mt-0.5 text-[10px] text-muted-foreground">{row.workMode}</div></td>
            <td className="px-4 py-3.5 text-[11px] text-muted-foreground">{row.type}</td>
            <td className="px-4 py-3.5"><StatusPill value={row.status} /></td>
            <td className="px-4 py-3.5 text-[10px] text-muted-foreground">{row.posted}</td>
            <td className="px-4 py-3.5 font-mono-ui text-[11px]">{row.applicants}</td>
            <td className="px-4 py-3.5">
              {row.status === 'Pending' ? (
                <div className="flex items-center gap-1">
                  <button data-testid={`button-approve-${row.id}`} onClick={() => onReview(row, 'approve')} className="rounded-md bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100" aria-label={`Approve ${row.title}`}>✓</button>
                  <button data-testid={`button-request-edits-${row.id}`} onClick={() => onReview(row, 'request-edits')} className="rounded-md bg-amber-50 p-1.5 text-amber-700 hover:bg-amber-100" aria-label={`Request edits for ${row.title}`}>✎</button>
                  <button data-testid={`button-reject-${row.id}`} onClick={() => onReview(row, 'reject')} className="rounded-md bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100" aria-label={`Reject ${row.title}`}>×</button>
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
