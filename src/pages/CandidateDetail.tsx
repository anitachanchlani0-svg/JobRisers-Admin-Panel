import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  LockKeyhole,
  ShieldAlert,
  FileText,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle2,
  MapPin,
  Sparkles,
  Award,
  Layers,
  Send,
  Calendar,
} from 'lucide-react';
import { adminCandidates, type AdminCandidate } from '@/mock-data';
import { Avatar, StatusPill, Modal } from '@/components/ui';

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidatesList, setCandidatesList] = useState<AdminCandidate[]>(adminCandidates);
  const [unmaskedCandidateIds, setUnmaskedCandidateIds] = useState<Set<string>>(new Set());

  // Center Confirmation/Action Modal
  const [actionModal, setActionModal] = useState<{
    title: string;
    subtitle: string;
    actionText: string;
    tone: string;
    onConfirm?: () => void;
  } | null>(null);

  const candidate = candidatesList.find((c) => c.id === id) || candidatesList[0];
  const isUnmasked = candidate ? unmaskedCandidateIds.has(candidate.id) : false;

  if (!candidate) {
    return (
      <div className="space-y-4">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidates
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Candidate not found</h2>
          <p className="text-xs text-muted-foreground mt-1">No candidate matching ID "{id}".</p>
        </div>
      </div>
    );
  }

  const experienceCount = candidate.experience?.length || 0;
  const applicationsCount = candidate.applicationsHistory?.length || 0;
  const skillsCount = candidate.skills?.length || 0;

  const handleUnmask = () => {
    setActionModal({
      title: 'Unmask Personal Contact Info?',
      subtitle: `Viewing unmasked contact information for ${candidate.name} will be logged in the immutable security audit trail for GDPR & DPDP compliance.`,
      actionText: 'Confirm Unmask (Logged)',
      tone: 'violet',
      onConfirm: () => {
        setUnmaskedCandidateIds((prev) => new Set(prev).add(candidate.id));
      },
    });
  };

  const handleSuspend = () => {
    setActionModal({
      title: 'Suspend Candidate Account?',
      subtitle: `Are you sure you want to suspend ${candidate.name}? Suspended candidates will be blocked from applying to open positions and accessing JobRisers Pro services.`,
      actionText: 'Suspend Account',
      tone: 'rose',
      onConfirm: () => {
        setCandidatesList((prev) =>
          prev.map((c) => (c.id === candidate.id ? { ...c, status: 'Suspended' } : c))
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/candidates"
          data-testid="link-back-to-candidates"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Candidates
        </Link>
        <span className="text-[10px] font-mono text-muted-foreground">Candidate ID: {candidate.id}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar name={candidate.name} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                  {candidate.name}
                </h1>
                {candidate.pro && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eee9fc] border border-[#d8cbf9] px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    <Sparkles size={11} /> PRO
                  </span>
                )}
                <StatusPill value={candidate.status} />
              </div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                <span>{candidate.headline}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-muted-foreground" />
                  {candidate.location}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              data-testid="button-suspend-candidate"
              onClick={handleSuspend}
              className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200/80 px-3.5 py-2 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <ShieldAlert size={14} /> Suspend Account
            </button>
          </div>
        </div>
      </div>

      {/* 1. Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Experience
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {experienceCount > 0 ? `${experienceCount} Roles` : 'Entry Level'}
          </div>
          <div className="text-[10px] text-muted-foreground truncate">
            {candidate.experience?.[0]?.company || 'Looking for work'}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Applications
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {applicationsCount} Active
          </div>
          <div className="text-[10px] text-muted-foreground">Submitted on platform</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Skills
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {skillsCount} Listed
          </div>
          <div className="text-[10px] text-muted-foreground">Verified competencies</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Profile
            </span>
            <span className="font-mono text-[10px] font-bold text-primary">
              {candidate.completion}%
            </span>
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {candidate.completion >= 80 ? 'High' : 'Moderate'}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mt-1">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.max(0, Math.min(100, candidate.completion))}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. Contact Information & Identity */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LockKeyhole size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Contact & Identity
            </h3>
          </div>
          {isUnmasked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={11} /> Unmasked (Audit Logged)
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Masked PII
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50 space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Email Address</span>
            <div className="font-mono text-xs font-semibold text-foreground truncate">
              {isUnmasked ? candidate.emailFull || candidate.emailMasked : candidate.emailMasked}
            </div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50 space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Phone Number</span>
            <div className="font-mono text-xs font-semibold text-foreground truncate">
              {isUnmasked
                ? candidate.phoneFull || candidate.phoneMasked || '+91 98765 00000'
                : candidate.phoneMasked || '+91 98765 *****'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-[11px]">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Sign-up Source</div>
            <div className="font-semibold text-foreground mt-0.5">{candidate.source}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Last Active</div>
            <div className="font-semibold text-foreground mt-0.5">{candidate.lastActive}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Platform Tier</div>
            <div className="font-semibold text-foreground mt-0.5">
              {candidate.pro ? 'Resume Pro' : 'Free Tier'}
            </div>
          </div>
        </div>

        {!isUnmasked && (
          <div className="pt-1">
            <button
              type="button"
              data-testid="button-unmask-candidate"
              onClick={handleUnmask}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              <LockKeyhole size={13} /> Request Unmask (Audit Logged)
            </button>
            <p className="mt-1.5 text-[10px] text-center text-muted-foreground">
              Viewing sensitive personal contact info requires confirmation and is recorded in audit logs.
            </p>
          </div>
        )}
      </section>

      {/* 3. Skills & Competencies */}
      {candidate.skills && candidate.skills.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Skills & Competencies ({candidate.skills.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-[#eeeafd] border border-[#ded5fb] px-3 py-1.5 text-[11px] font-semibold text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 4. Resume & ATS Profile */}
      {candidate.resume && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Resume & ATS Profile
              </h3>
            </div>
            {candidate.resume.atsScore && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <Award size={11} /> ATS Score: {candidate.resume.atsScore}%
              </span>
            )}
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate">
                  {candidate.resume.filename}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Uploaded {candidate.resume.uploadedAt} · {candidate.resume.size}
                </div>
              </div>
            </div>
            <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-bold text-foreground shrink-0">
              PDF
            </span>
          </div>

          {candidate.resume.summary && (
            <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60 text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Parsed Summary: </span>
              {candidate.resume.summary}
            </div>
          )}
        </section>
      )}

      {/* 5. Work Experience Timeline */}
      {candidate.experience && candidate.experience.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Briefcase size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Work Experience Timeline
            </h3>
          </div>
          <div className="relative pl-5 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/25">
            {candidate.experience.map((exp, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                <div className="flex items-baseline justify-between flex-wrap gap-1">
                  <h4 className="text-xs font-bold text-foreground">{exp.role}</h4>
                  <span className="text-[10px] font-medium text-muted-foreground">{exp.duration}</span>
                </div>
                <div className="text-[11px] font-semibold text-primary">{exp.company}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Education */}
      {candidate.education && candidate.education.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <GraduationCap size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Education & Credentials
            </h3>
          </div>
          <div className="space-y-2.5">
            {candidate.education.map((edu, idx) => (
              <div key={idx} className="rounded-xl bg-muted/20 p-3 border border-border/50">
                <div className="text-xs font-bold text-foreground">{edu.degree}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {edu.institution} · <span className="font-mono">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Applications History */}
      {candidate.applicationsHistory && candidate.applicationsHistory.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send size={15} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Platform Applications ({candidate.applicationsHistory.length})
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">History</span>
          </div>
          <div className="divide-y divide-border/60">
            {candidate.applicationsHistory.map((app) => (
              <div key={app.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">{app.jobTitle}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {app.company} · {app.appliedDate}
                  </div>
                </div>
                <StatusPill value={app.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Account Activity & Audit Trail */}
      {candidate.auditLog && candidate.auditLog.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Activity & Compliance Audit Log
            </h3>
          </div>
          <div className="space-y-2">
            {candidate.auditLog.map((log, idx) => (
              <div key={idx} className="rounded-xl bg-muted/20 p-3 border border-border/40 text-[11px]">
                <div className="font-medium text-foreground">{log.action}</div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Actor: {log.actor}</span>
                  <span className="font-mono">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirmation / Action Center Modal */}
      <Modal
        isOpen={Boolean(actionModal)}
        onClose={() => setActionModal(null)}
        title={actionModal?.title}
        subtitle={actionModal?.subtitle}
        dataTestId="modal-action-confirm"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setActionModal(null)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-modal-action"
              onClick={() => {
                if (actionModal?.onConfirm) actionModal.onConfirm();
                setActionModal(null);
              }}
              className={`rounded-xl px-4 py-2 text-[11px] font-bold text-white shadow-sm transition-opacity hover:opacity-90 ${
                actionModal?.tone === 'rose'
                  ? 'bg-rose-600'
                  : actionModal?.tone === 'violet'
                  ? 'bg-primary'
                  : 'bg-emerald-600'
              }`}
            >
              {actionModal?.actionText}
            </button>
          </div>
        }
      />
    </div>
  );
}
