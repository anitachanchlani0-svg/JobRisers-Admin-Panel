import React, { useState } from 'react';
import {
  Building2,
  Globe,
  FileCheck,
  Users,
  Briefcase,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  FileText,
  Eye,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';
import type { AdminEmployer, EmployerDocument } from '@/mock-data';
import { Drawer, Avatar, StatusPill } from '@/components/ui';

interface EmployerDetailDrawerProps {
  employer: AdminEmployer | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (employer: AdminEmployer) => void;
  onReject: (employer: AdminEmployer) => void;
  onRequestInfo: (employer: AdminEmployer) => void;
  onSuspend: (employer: AdminEmployer) => void;
}

export function EmployerDetailDrawer({
  employer,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  onSuspend,
}: EmployerDetailDrawerProps) {
  const [previewDoc, setPreviewDoc] = useState<EmployerDocument | null>(null);

  if (!employer) return null;

  const docsCount = employer.documents?.length || 0;
  const teamCount = employer.teamMembers?.length || 0;
  const jobsCount = employer.jobs || 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      dataTestId="employer-detail-drawer"
      title={
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={employer.company} />
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-foreground sm:text-xl truncate">
              {employer.company}
            </h2>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5 truncate">
              <span>{employer.industry || 'Technology'}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} className="text-muted-foreground" />
                {employer.location}
              </span>
            </p>
          </div>
        </div>
      }
      badge={
        <div className="flex items-center gap-1.5 shrink-0">
          <StatusPill value={employer.verification} />
          <StatusPill value={employer.status} />
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            data-testid="button-drawer-suspend-employer"
            onClick={() => onSuspend(employer)}
            className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200/80 px-3.5 py-2 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <ShieldAlert size={14} /> Suspend Account
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      {/* 1. Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-border/80 bg-muted/30 p-3">
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Jobs
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {jobsCount} Listings
          </div>
          <div className="text-[10px] text-muted-foreground">Live marketplace posts</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Workforce Size
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {employer.size || '51-200'}
          </div>
          <div className="text-[10px] text-muted-foreground">Reported employee count</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Plan Tier
          </div>
          <div className="font-display text-base font-extrabold text-foreground truncate">
            {employer.subscriptionStanding?.plan || employer.plan || 'Standard'}
          </div>
          <div className="text-[10px] text-muted-foreground">Active monetization</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Standing
          </div>
          <div className="font-display text-base font-extrabold text-foreground truncate">
            {employer.verification}
          </div>
          <div className="text-[10px] text-muted-foreground">{docsCount} Docs reviewed</div>
        </div>
      </section>

      {/* 2. Verification Decisions Banner */}
      <section className="rounded-xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Verification Decisions
            </h3>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            Current: <strong className="text-foreground">{employer.verification}</strong>
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Verify corporate registration, MCA incorporation filings, and tax records before granting full hiring privileges.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
          <button
            type="button"
            data-testid="button-drawer-approve-employer"
            onClick={() => onApprove(employer)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <CheckCircle2 size={13} /> Approve Verification
          </button>
          <button
            type="button"
            data-testid="button-drawer-reject-employer"
            onClick={() => onReject(employer)}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <XCircle size={13} /> Reject
          </button>
          <button
            type="button"
            data-testid="button-drawer-request-info-employer"
            onClick={() => onRequestInfo(employer)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
          >
            <HelpCircle size={13} className="text-amber-600" /> Request Information
          </button>
        </div>
      </section>

      {/* 3. Company Profile & Registration */}
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Company Profile & Credentials
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Primary Contact</span>
            <div className="font-semibold text-foreground mt-0.5 truncate">{employer.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono truncate">{employer.emailMasked}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">CIN / Reg No</span>
            <div className="font-mono font-semibold text-foreground mt-0.5 text-[11px] truncate">
              {employer.cin || 'U72900KA2021PTC'}
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">GSTIN</span>
            <div className="font-mono font-semibold text-foreground mt-0.5 text-[11px] truncate">
              {employer.gst || '29ABCDE1234F1Z5'}
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Industry</span>
            <div className="font-semibold text-foreground mt-0.5">{employer.industry || 'Technology'}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Headquarters</span>
            <div className="font-semibold text-foreground mt-0.5">{employer.location}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Member Since</span>
            <div className="font-semibold text-foreground mt-0.5">{employer.joined}</div>
          </div>
        </div>

        {employer.website && (
          <div className="flex items-center gap-2 pt-0.5 text-xs">
            <Globe size={13} className="text-muted-foreground" />
            <a
              href={employer.website}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              {employer.website} <ExternalLink size={11} />
            </a>
          </div>
        )}

        {employer.about && (
          <div className="rounded-lg bg-background p-3 border border-border/60 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Company Overview: </span>
            {employer.about}
          </div>
        )}
      </section>

      {/* 4. Verification Documents */}
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Verification Documents ({docsCount})
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Statutory records</span>
        </div>

        {employer.documents && employer.documents.length > 0 ? (
          <div className="space-y-2">
            {employer.documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg border border-border/70 bg-muted/20 p-2.5 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{doc.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {doc.type} · {doc.uploadDate} · {doc.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : doc.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(previewDoc?.id === doc.id ? null : doc)}
                    aria-label={`Preview document ${doc.name}`}
                    className="rounded-lg border border-border p-1 text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                  >
                    <Eye size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No verification documents uploaded yet.</p>
        )}

        {previewDoc && (
          <div className="rounded-lg border border-primary/30 bg-primary/[0.03] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                <FileCheck size={12} className="text-primary" /> Certificate: {previewDoc.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
              >
                Close Preview
              </button>
            </div>
            <div className="rounded-md bg-card p-2.5 border border-border text-[11px] space-y-0.5">
              <div><strong>Document Type:</strong> {previewDoc.type}</div>
              <div><strong>Upload Timestamp:</strong> {previewDoc.uploadDate}</div>
              <div><strong>Verification Status:</strong> {previewDoc.status}</div>
              <div className="font-mono text-[10px] text-muted-foreground pt-0.5">
                Digital Hash: SHA256: 9b2d8f...41ae (Verified MCA Seal)
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Team & Recruiter Seats */}
      {employer.teamMembers && employer.teamMembers.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Team & Recruiter Seats ({teamCount})
            </h3>
          </div>
          <div className="divide-y divide-border/60">
            {employer.teamMembers.map((member) => (
              <div key={member.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={member.name} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{member.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{member.role} · {member.email}</div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 ${
                    member.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Active / Related Job Listings */}
      {employer.relatedJobs && employer.relatedJobs.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Related Job Listings ({employer.relatedJobs.length})
            </h3>
          </div>
          <div className="space-y-2">
            {employer.relatedJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-lg border border-border/70 bg-muted/20 p-2.5 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">{job.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {job.location} · {job.workMode} · {job.applicants} applicants
                  </div>
                </div>
                <StatusPill value={job.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Subscription & Billing Standing */}
      {employer.subscriptionStanding && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Subscription & Monetization Standing
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Plan Tier</span>
              <div className="font-bold text-foreground mt-0.5">{employer.subscriptionStanding.plan}</div>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Billing Rate</span>
              <div className="font-semibold text-foreground mt-0.5">{employer.subscriptionStanding.amount}</div>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Billing Cycle</span>
              <div className="font-semibold text-foreground mt-0.5">{employer.subscriptionStanding.billingCycle}</div>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Next Renewal</span>
              <div className="font-semibold text-foreground mt-0.5">{employer.subscriptionStanding.renewalDate}</div>
            </div>
          </div>
        </section>
      )}
    </Drawer>
  );
}
