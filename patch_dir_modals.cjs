const fs = require('fs');

let code = `import { useMemo, useState } from 'react';
import { Filter, LockKeyhole, CheckCircle2, ShieldAlert } from 'lucide-react';
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
  
  // Job Moderation (from List)
  const [reviewTarget, setReviewTarget] = useState<AdminJob | null>(null);
  const [decision, setDecision] = useState<ReviewDecision>('approve');
  const [reason, setReason] = useState('');

  // Generic Action Modal for sub-tabs
  const [actionModal, setActionModal] = useState<{ title: string; subtitle: string; actionText: string; tone: string } | null>(null);

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
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-border">
        {sections.map((section) => (
          <button key={section} onClick={() => setSelected(section)} aria-pressed={selected === section} className={\`whitespace-nowrap border-b-2 px-3 py-2.5 text-[10px] font-semibold transition-colors \${selected === section ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}\`}>
            {section}
          </button>
        ))}
      </div>

      {selected !== sections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 mt-5 overflow-x-auto">
          {kind === 'candidates' && selected === 'Candidate detail' && (
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0edfa] text-primary text-2xl font-bold">AM</div>
                  <div>
                    <h2 className="text-xl font-bold">Aarav Mehta</h2>
                    <p className="text-sm text-muted-foreground">Senior Product Designer · Bengaluru, KA</p>
                    <div className="flex gap-2 mt-2">
                       <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-semibold">Active</span>
                       <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Profile 96% Complete</span>
                    </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <h3 className="text-sm font-semibold mb-2">Contact Information (Masked)</h3>
                   <p className="text-xs text-muted-foreground">Email: aa***@mail.com</p>
                   <p className="text-xs text-muted-foreground">Phone: +91 98765 *****</p>
                   <button onClick={() => setActionModal({ title: 'Unmask Contact Info', subtitle: 'Aarav Mehta', actionText: 'Confirm Unmask', tone: 'primary' })} className="mt-3 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-primary/20 transition-colors">Request Unmask (Audit Logged)</button>
                 </div>
                 <div>
                   <h3 className="text-sm font-semibold mb-2">Account Activity</h3>
                   <p className="text-xs text-muted-foreground">Last active: 12 min ago</p>
                   <p className="text-xs text-muted-foreground">Sign-up source: Google</p>
                   <p className="text-xs text-muted-foreground">Subscription: Pro (Active)</p>
                   <button onClick={() => setActionModal({ title: 'Suspend Account', subtitle: 'Aarav Mehta', actionText: 'Suspend', tone: 'rose' })} className="mt-3 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-colors">Suspend Account</button>
                 </div>
               </div>
            </div>
          )}
          {kind === 'candidates' && selected === 'Deletion requests' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>CANDIDATE</th><th>REQUEST DATE</th><th>STATUS</th><th>SLA</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-semibold">Meera Iyer</td><td className="py-4 px-2 text-xs text-muted-foreground">Oct 1, 2026</td><td className="py-4 px-2"><span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-amber-200">Pending Review</span></td><td className="py-4 px-2 text-xs font-semibold text-rose-600">3 Days left</td><td className="py-4 px-2"><button onClick={() => setActionModal({ title: 'Process Deletion', subtitle: 'Meera Iyer (Data Subject Request)', actionText: 'Permanently Delete', tone: 'rose' })} className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg">Process</button></td></tr>
              </tbody>
            </table>
          )}

          {kind === 'employers' && selected === 'Companies' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>COMPANY</th><th>INDUSTRY</th><th>SIZE</th><th>HQ</th><th>VERIFIED</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-semibold">Northstar Labs</td><td className="py-4 px-2 text-xs text-muted-foreground">Technology</td><td className="py-4 px-2 text-xs text-muted-foreground">51-200</td><td className="py-4 px-2 text-xs text-muted-foreground">Bengaluru</td><td className="py-4 px-2 text-xs text-emerald-600 font-bold">Yes</td><td className="py-4 px-2"><button onClick={() => setActionModal({ title: 'Edit Company', subtitle: 'Northstar Labs', actionText: 'Save Changes', tone: 'primary' })} className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg">Manage</button></td></tr>
                <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-semibold">Cloudframe</td><td className="py-4 px-2 text-xs text-muted-foreground">SaaS</td><td className="py-4 px-2 text-xs text-muted-foreground">1-50</td><td className="py-4 px-2 text-xs text-muted-foreground">Pune</td><td className="py-4 px-2 text-xs text-amber-600 font-bold">No</td><td className="py-4 px-2"><button onClick={() => setActionModal({ title: 'Edit Company', subtitle: 'Cloudframe', actionText: 'Save Changes', tone: 'primary' })} className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg">Manage</button></td></tr>
              </tbody>
            </table>
          )}
          {kind === 'employers' && selected === 'Verification queue' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>COMPANY</th><th>REQUESTER</th><th>DOCUMENTS</th><th>STATUS</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-semibold">Cloudframe</td><td className="py-4 px-2 text-xs text-muted-foreground">Vikram Sethi</td><td className="py-4 px-2 text-xs text-primary font-medium hover:underline cursor-pointer" onClick={() => setActionModal({ title: 'View Documents', subtitle: 'Cloudframe Incorporation Docs', actionText: 'Close', tone: 'primary' })}>2 Attachments</td><td className="py-4 px-2"><span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-semibold">Under review</span></td><td className="py-4 px-2 flex gap-2"><button onClick={() => setActionModal({ title: 'Approve Verification', subtitle: 'Cloudframe', actionText: 'Approve', tone: 'green' })} className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors px-3 py-1.5 rounded-lg text-[10px] font-bold">Approve</button><button onClick={() => setActionModal({ title: 'Reject Verification', subtitle: 'Cloudframe', actionText: 'Reject', tone: 'rose' })} className="text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors px-3 py-1.5 rounded-lg text-[10px] font-bold">Reject</button></td></tr>
              </tbody>
            </table>
          )}

          {kind === 'jobs' && selected === 'Moderation queue' && (
             <div className="overflow-x-auto"><JobsTable rows={list.filter(j => (j as AdminJob).status === 'Pending') as AdminJob[]} onReview={(job, action) => { setReviewTarget(job); setDecision(action); setReason(''); }} /></div>
          )}
          {kind === 'jobs' && selected === 'Reported jobs' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>JOB</th><th>REPORT REASON</th><th>REPORTS</th><th>STATUS</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-semibold">Data Platform Engineer</td><td className="py-4 px-2 text-xs text-muted-foreground">Suspicious links</td><td className="py-4 px-2 text-xs text-rose-600 font-bold">14</td><td className="py-4 px-2"><span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-semibold">Pending Review</span></td><td className="py-4 px-2 flex gap-2"><button onClick={() => setActionModal({ title: 'Remove Job', subtitle: 'Data Platform Engineer', actionText: 'Remove Listing', tone: 'rose' })} className="text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors">Remove</button></td></tr>
              </tbody>
            </table>
          )}
          {kind === 'jobs' && selected === 'Imports' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>IMPORT ID</th><th>SOURCE</th><th>JOBS CREATED</th><th>DATE</th><th>STATUS</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-bold font-mono">IMP-992</td><td className="py-4 px-2 text-xs text-muted-foreground">Workday API</td><td className="py-4 px-2 text-xs">120</td><td className="py-4 px-2 text-xs text-muted-foreground">Today, 10:00 AM</td><td className="py-4 px-2"><span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-semibold">Success</span></td><td className="py-4 px-2"><button onClick={() => setActionModal({ title: 'View Import Logs', subtitle: 'IMP-992 (Workday API)', actionText: 'Close', tone: 'primary' })} className="border border-border hover:border-primary hover:text-primary transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg">Logs</button></td></tr>
              </tbody>
            </table>
          )}
        </section>
      ) : (
        <>
          <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5 mt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <Filter size={15} className="text-primary" /> Refine directory
                <span className="ml-1 font-normal text-muted-foreground">{busy ? 'Loading records…' : \`\${list.length} records\`}</span>
              </div>
              <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>Status</span>
                <select data-testid={\`select-\${kind}-status\`} value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 min-w-[150px] rounded-lg border border-border bg-card px-3 text-[11px] font-medium text-foreground outline-none focus:border-primary">
                  <option>All statuses</option>
                  {statuses.slice(1).map((value) => <option key={value}>{value}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground"><LockKeyhole size={13} /> Sensitive personal information is masked in this directory.</div>
          </section>

          {busy ? <TableSkeleton /> : !list.length ? (
            <EmptyState title={\`No \${kind} to display\`} detail="Records will appear here when they are available." />
          ) : (
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-x-auto">
                {kind === 'candidates' && <CandidatesTable rows={list as AdminCandidate[]} onRowClick={() => setActionModal({ title: 'Candidate Quick View', subtitle: 'Directory Record', actionText: 'Close', tone: 'primary'})} />}
                {kind === 'employers' && <EmployersTable rows={list as AdminEmployer[]} onRowClick={() => setActionModal({ title: 'Employer Quick View', subtitle: 'Directory Record', actionText: 'Close', tone: 'primary'})} />}
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setReviewTarget(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="review-title" className="w-full max-w-[460px] rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold tracking-[.16em] text-primary">JOB MODERATION</p>
                <h2 id="review-title" className="mt-2 font-display text-xl font-extrabold tracking-tight">{decision === 'approve' ? 'Approve this listing?' : decision === 'reject' ? 'Reject this listing?' : 'Request edits?'}</h2>
              </div>
              <button aria-label="Close review dialog" onClick={() => setReviewTarget(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">×</button>
            </div>
            <div className="mt-4 rounded-xl bg-muted/70 p-4 border border-border">
              <div className="text-[13px] font-bold">{reviewTarget.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{reviewTarget.company} · {reviewTarget.location}</div>
            </div>
            <label className="mt-5 block text-[11px] font-bold">
              Reason <span className="font-normal text-muted-foreground">{decision === 'approve' ? '(optional)' : '(required)'}</span>
              <textarea required={decision !== 'approve'} data-testid="input-review-reason" value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder={decision === 'approve' ? 'Add context for the audit trail…' : 'Explain the decision for the employer and audit trail…'} className="mt-2 w-full resize-none rounded-xl border border-border bg-background p-3 text-[12px] font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-shadow" />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setReviewTarget(null)} className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors">Cancel</button>
              <button data-testid="button-confirm-review" disabled={decision !== 'approve' && !reason.trim()} onClick={submitReview} className={\`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90 disabled:opacity-60 \${decision === 'reject' ? 'bg-rose-600' : decision === 'request-edits' ? 'bg-amber-600' : 'bg-primary'}\`}>
                {decision === 'approve' ? 'Approve listing' : decision === 'reject' ? 'Reject listing' : 'Request edits'}
              </button>
            </div>
          </div>
        </div>
      )}

      {actionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActionModal(null); }}>
          <div role="dialog" aria-modal="true" className="w-full max-w-[400px] rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight">{actionModal.title}</h2>
                <p className="mt-1 text-[12px] text-muted-foreground">{actionModal.subtitle}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setActionModal(null)} className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => setActionModal(null)} className={\`rounded-xl px-4 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90 \${actionModal.tone === 'rose' ? 'bg-rose-600' : actionModal.tone === 'green' ? 'bg-emerald-600' : 'bg-primary'}\`}>
                {actionModal.actionText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CandidatesTable({ rows, onRowClick }: { rows: AdminCandidate[]; onRowClick?: () => void }) {
  return (
    <table className="w-full min-w-[780px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
          {['CANDIDATE', 'LOCATION', 'STATUS', 'PROFILE', 'SOURCE', 'LAST ACTIVE'].map((label) => <th key={label} className="px-4 py-3.5">{label}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => (
          <tr key={row.id} onClick={onRowClick} data-testid={\`row-candidate-\${row.id}\`} className="transition-colors hover:bg-[#fbfaff] cursor-pointer">
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar name={row.name} />
                <div>
                  <div className="text-[12px] font-bold">{row.name}{row.pro && <span className="ml-2 rounded-full bg-[#eee9fc] px-1.5 py-0.5 text-[9px] font-bold text-primary">PRO</span>}</div>
                  <div className="mt-0.5 max-w-[220px] truncate text-[10px] text-muted-foreground">{row.headline} · {row.emailMasked}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-4 text-[11px] text-muted-foreground font-medium">{row.location}</td>
            <td className="px-4 py-4"><StatusPill value={row.status} /></td>
            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-[58px] overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: \`\${Math.max(0, Math.min(100, row.completion))}%\` }} />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground font-semibold">{row.completion}%</span>
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

function EmployersTable({ rows, onRowClick }: { rows: AdminEmployer[]; onRowClick?: () => void }) {
  return (
    <table className="w-full min-w-[900px] border-collapse text-left">
      <thead>
        <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground">
          {['EMPLOYER / COMPANY', 'LOCATION', 'VERIFICATION', 'JOBS', 'PLAN', 'ACCOUNT', 'JOINED'].map((label) => <th key={label} className="px-4 py-3.5">{label}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/75">
        {rows.map((row) => (
          <tr key={row.id} onClick={onRowClick} data-testid={\`row-employer-\${row.id}\`} className="transition-colors hover:bg-[#fbfaff] cursor-pointer">
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar name={row.company} />
                <div>
                  <div className="text-[12px] font-bold">{row.company}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{row.name} · {row.emailMasked}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-4 text-[11px] text-muted-foreground font-medium">{row.location}</td>
            <td className="px-4 py-4"><StatusPill value={row.verification} /></td>
            <td className="px-4 py-4 font-mono text-[11px] font-bold">{row.jobs}</td>
            <td className="px-4 py-4 text-[11px] font-semibold">{row.plan}</td>
            <td className="px-4 py-4"><StatusPill value={row.status} /></td>
            <td className="px-4 py-4 text-[10px] text-muted-foreground font-medium">{row.joined}</td>
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
          <tr key={row.id} data-testid={\`row-job-\${row.id}\`} className="transition-colors hover:bg-[#fbfaff]">
            <td className="px-4 py-4">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0edfa] text-primary">💼</div>
                <div>
                  <div className="text-[12px] font-bold">{row.title}{row.flagged && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">🚩 Flagged</span>}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground font-medium">{row.company}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-4"><div className="text-[11px] font-medium">{row.location}</div><div className="mt-0.5 text-[10px] text-muted-foreground">{row.workMode}</div></td>
            <td className="px-4 py-4 text-[11px] text-muted-foreground font-medium">{row.type}</td>
            <td className="px-4 py-4"><StatusPill value={row.status} /></td>
            <td className="px-4 py-4 text-[10px] text-muted-foreground font-medium">{row.posted}</td>
            <td className="px-4 py-4 font-mono text-[11px] font-bold">{row.applicants}</td>
            <td className="px-4 py-4">
              {row.status === 'Pending' ? (
                <div className="flex items-center gap-1">
                  <button data-testid={\`button-approve-\${row.id}\`} onClick={() => onReview(row, 'approve')} className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 text-[10px] font-bold transition-colors" aria-label={\`Approve \${row.title}\`}>Approve</button>
                  <button data-testid={\`button-reject-\${row.id}\`} onClick={() => onReview(row, 'reject')} className="rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-1 text-[10px] font-bold transition-colors" aria-label={\`Reject \${row.title}\`}>Reject</button>
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
`;

fs.writeFileSync('src/pages/Directory.tsx', code);
