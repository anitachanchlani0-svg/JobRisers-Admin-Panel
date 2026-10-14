import React from 'react';
import {
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
import type { AdminCandidate } from '@/mock-data';
import { Drawer, Avatar, StatusPill } from '@/components/ui';

interface CandidateDetailDrawerProps {
  candidate: AdminCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onUnmask: (candidate: AdminCandidate) => void;
  onSuspend: (candidate: AdminCandidate) => void;
  isUnmasked?: boolean;
}

export function CandidateDetailDrawer({
  candidate,
  isOpen,
  onClose,
  onUnmask,
  onSuspend,
  isUnmasked = false,
}: CandidateDetailDrawerProps) {
  if (!candidate) return null;

  const experienceCount = candidate.experience?.length || 0;
  const applicationsCount = candidate.applicationsHistory?.length || 0;
  const skillsCount = candidate.skills?.length || 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      dataTestId="candidate-detail-drawer"
      title={
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={candidate.name} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-lg font-bold text-foreground sm:text-xl truncate">
                {candidate.name}
              </span>
              {candidate.pro && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eee9fc] border border-[#d8cbf9] px-2 py-0.5 text-[9px] font-bold text-primary">
                  <Sparkles size={10} /> PRO
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5 truncate">
              <span>{candidate.headline}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} className="text-muted-foreground" />
                {candidate.location}
              </span>
            </p>
          </div>
        </div>
      }
      badge={<StatusPill value={candidate.status} />}
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            data-testid="button-drawer-suspend-candidate"
            onClick={() => onSuspend(candidate)}
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
            Experience
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {experienceCount > 0 ? `${experienceCount} Roles` : 'Entry Level'}
          </div>
          <div className="text-[10px] text-muted-foreground truncate">
            {candidate.experience?.[0]?.company || 'Looking for work'}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Applications
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {applicationsCount} Active
          </div>
          <div className="text-[10px] text-muted-foreground">Submitted on platform</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Skills
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {skillsCount} Listed
          </div>
          <div className="text-[10px] text-muted-foreground">Verified competencies</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Profile
            </span>
            <span className="font-mono text-[10px] font-bold text-primary">
              {candidate.completion}%
            </span>
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
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
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LockKeyhole size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Contact & Identity
            </h3>
          </div>
          {isUnmasked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={11} /> Unmasked (Audit Logged)
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Masked PII
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50 space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Email Address</span>
            <div className="font-mono text-xs font-medium text-foreground truncate">
              {isUnmasked ? candidate.emailFull || candidate.emailMasked : candidate.emailMasked}
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50 space-y-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Phone Number</span>
            <div className="font-mono text-xs font-medium text-foreground truncate">
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
              data-testid="button-drawer-unmask-candidate"
              onClick={() => onUnmask(candidate)}
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
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Skills & Competencies ({candidate.skills.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-[#eeeafd] border border-[#ded5fb] px-2.5 py-1 text-[11px] font-semibold text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 4. Resume & ATS Profile */}
      {candidate.resume && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-primary" />
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

          <div className="rounded-lg border border-border/70 bg-muted/20 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText size={18} />
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
            <span className="rounded-md border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-foreground shrink-0">
              PDF
            </span>
          </div>

          {candidate.resume.summary && (
            <div className="rounded-lg bg-background p-3 border border-border/60 text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Parsed Summary: </span>
              {candidate.resume.summary}
            </div>
          )}
        </section>
      )}

      {/* 5. Work Experience Timeline */}
      {candidate.experience && candidate.experience.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Work Experience Timeline
            </h3>
          </div>
          <div className="relative pl-4 space-y-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/25">
            {candidate.experience.map((exp, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
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
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Education & Credentials
            </h3>
          </div>
          <div className="space-y-2">
            {candidate.education.map((edu, idx) => (
              <div key={idx} className="rounded-lg bg-muted/20 p-2.5 border border-border/50">
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
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send size={14} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Platform Applications ({candidate.applicationsHistory.length})
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">History</span>
          </div>
          <div className="divide-y divide-border/60">
            {candidate.applicationsHistory.map((app) => (
              <div key={app.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
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
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Activity & Compliance Audit Log
            </h3>
          </div>
          <div className="space-y-2">
            {candidate.auditLog.map((log, idx) => (
              <div key={idx} className="rounded-lg bg-muted/20 p-2.5 border border-border/40 text-[11px]">
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
    </Drawer>
  );
}
