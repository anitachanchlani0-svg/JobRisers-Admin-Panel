import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  User,
  Briefcase,
  FileText,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Clock,
  ArrowRight,
  XCircle,
  Award,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import type { AdminApplicationDetail } from '@/mock-data';
import { Drawer, Avatar, StatusPill } from '@/components/ui';

interface ApplicationDetailDrawerProps {
  application: AdminApplicationDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage?: (applicationId: string, newStage: string) => void;
}

const pipelineStages = ['Applied', 'Screening', 'Interview', 'Offered', 'Rejected'];

export function ApplicationDetailDrawer({
  application,
  isOpen,
  onClose,
  onUpdateStage,
}: ApplicationDetailDrawerProps) {
  const [currentStage, setCurrentStage] = useState<string>(application?.stage || 'Applied');

  useEffect(() => {
    if (application) {
      setCurrentStage(application.stage || 'Applied');
    }
  }, [application]);

  if (!application) return null;

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage);
    if (onUpdateStage) {
      onUpdateStage(application.id, newStage);
    }
  };

  const currentStageIndex = pipelineStages.indexOf(currentStage);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      dataTestId="application-detail-drawer"
      title={
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={application.candidateName} />
          <div className="min-w-0">
            <span className="font-display text-lg font-bold text-foreground sm:text-xl truncate block">
              {application.candidateName}
            </span>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5 truncate">
              <span>Applied for {application.jobTitle}</span>
              <span>·</span>
              <span className="text-primary font-semibold truncate">{application.company}</span>
            </p>
          </div>
        </div>
      }
      badge={<StatusPill value={currentStage} />}
      footer={
        <div className="flex items-center justify-between w-full flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Transition:
            </span>
            {currentStage !== 'Screening' && (
              <button
                type="button"
                onClick={() => handleStageChange('Screening')}
                className="rounded-lg bg-blue-50 border border-blue-200/70 px-2.5 py-1.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Screening
              </button>
            )}
            {currentStage !== 'Interview' && (
              <button
                type="button"
                onClick={() => handleStageChange('Interview')}
                className="rounded-lg bg-purple-50 border border-purple-200/70 px-2.5 py-1.5 text-[10px] font-bold text-purple-700 hover:bg-purple-100 transition-colors"
              >
                Interview
              </button>
            )}
            {currentStage !== 'Offered' && (
              <button
                type="button"
                onClick={() => handleStageChange('Offered')}
                className="rounded-lg bg-emerald-50 border border-emerald-200/70 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Offer
              </button>
            )}
            {currentStage !== 'Rejected' && (
              <button
                type="button"
                onClick={() => handleStageChange('Rejected')}
                className="rounded-lg bg-rose-50 border border-rose-200/70 px-2.5 py-1.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                Reject
              </button>
            )}
          </div>
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
            Current Stage
          </div>
          <div className="font-display text-base font-extrabold text-foreground truncate">
            {currentStage}
          </div>
          <div className="text-[10px] text-muted-foreground">Active funnel step</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Submission Date
          </div>
          <div className="font-display text-base font-extrabold text-foreground truncate">
            {application.appliedDate}
          </div>
          <div className="text-[10px] text-muted-foreground">Platform verified</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            ATS Match
          </div>
          <div className="font-display text-base font-extrabold text-emerald-700">
            {application.resume.atsScore}%
          </div>
          <div className="text-[10px] text-muted-foreground">Job keyword pairing</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Screening Qs
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {application.screeningQuestions?.length || 0} Answers
          </div>
          <div className="text-[10px] text-muted-foreground">Completed responses</div>
        </div>
      </section>

      {/* 2. Interactive Hiring Pipeline Stepper */}
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Hiring Pipeline Progress
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-primary">
            Step {Math.max(1, currentStageIndex + 1)} of 5
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {pipelineStages.map((stage, idx) => {
            const isCompleted = currentStage !== 'Rejected' && idx < currentStageIndex;
            const isCurrent = stage === currentStage;
            const isRejected = currentStage === 'Rejected' && stage === 'Rejected';

            return (
              <button
                key={stage}
                type="button"
                onClick={() => handleStageChange(stage)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center border transition-all last:col-span-2 sm:last:col-span-1 ${
                  isCurrent
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold'
                    : isRejected
                    ? 'border-rose-300 bg-rose-50 text-rose-700 font-bold'
                    : 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-[11px] sm:text-[10px] uppercase tracking-wider font-semibold">
                  {stage}
                </span>
                {isCompleted && <CheckCircle2 size={12} className="mt-1 text-emerald-600" />}
                {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />}
                {isRejected && <XCircle size={12} className="mt-1 text-rose-600" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Candidate & Job Summary */}
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Candidate Profile Info */}
          <div className="space-y-1.5 rounded-lg bg-muted/25 p-3 border border-border/50">
            <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] uppercase tracking-wider">
              <User size={13} /> Candidate Profile
            </div>
            <div className="text-xs font-bold text-foreground">{application.candidateName}</div>
            <div className="text-[11px] text-muted-foreground">{application.candidateHeadline}</div>
            <div className="text-[11px] text-muted-foreground font-mono pt-0.5">
              {application.candidateEmailMasked} · {application.candidateLocation}
            </div>
          </div>

          {/* Position Info */}
          <div className="space-y-1.5 rounded-lg bg-muted/25 p-3 border border-border/50">
            <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] uppercase tracking-wider">
              <Briefcase size={13} /> Position Target
            </div>
            <div className="text-xs font-bold text-foreground">{application.jobTitle}</div>
            <div className="text-[11px] text-primary font-semibold">{application.company}</div>
            <div className="text-[11px] text-muted-foreground pt-0.5">
              {application.jobLocation} ({application.workMode})
            </div>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-2.5 flex justify-between">
          <span>Application Timestamp:</span>
          <span className="font-semibold text-foreground">{application.appliedDate}</span>
        </div>
      </section>

      {/* 4. Candidate Resume & ATS Match */}
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Candidate Resume
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <Award size={11} /> ATS Match: {application.resume.atsScore}%
          </span>
        </div>

        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-foreground truncate">
                {application.resume.filename}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {application.resume.size} · PDF
              </div>
            </div>
          </div>
          <span className="rounded-md border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-foreground shrink-0">
            Verified ATS
          </span>
        </div>

        <div className="rounded-lg bg-background p-3 border border-border/60 text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Parsed Profile Summary: </span>
          {application.resume.summary}
        </div>
      </section>

      {/* 5. Screening Question Answers */}
      {application.screeningQuestions && application.screeningQuestions.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Screening Questions & Responses ({application.screeningQuestions.length})
          </h3>
          <div className="space-y-2">
            {application.screeningQuestions.map((q, idx) => (
              <div key={idx} className="rounded-lg bg-muted/20 p-2.5 border border-border/50 text-xs space-y-1">
                <div className="font-semibold text-foreground">{q.question}</div>
                <div className="text-primary font-medium pl-2 border-l-2 border-primary/40 mt-1">
                  {q.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Candidate Cover Letter */}
      {application.coverLetter && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Cover Letter
          </h3>
          <div className="rounded-lg bg-background p-3 border border-border/60 text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
            {application.coverLetter}
          </div>
        </section>
      )}

      {/* 7. Employer Feedback & Notes */}
      {application.feedbackNotes && application.feedbackNotes.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Employer Evaluation & Feedback
            </h3>
          </div>
          <div className="space-y-2">
            {application.feedbackNotes.map((note, idx) => (
              <div key={idx} className="rounded-lg bg-muted/25 p-3 border border-border/50 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    {note.author} ({note.role})
                  </span>
                  <span className="text-amber-600 font-bold">★ {note.rating}/5</span>
                </div>
                <div className="text-[10px] text-muted-foreground">{note.date}</div>
                <p className="text-muted-foreground leading-relaxed pt-0.5">{note.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Application Timeline & Audit */}
      {application.timeline && application.timeline.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Stage History & Timeline ({application.timeline.length})
            </h3>
          </div>
          <div className="space-y-2">
            {application.timeline.map((event, idx) => (
              <div key={idx} className="rounded-lg bg-muted/20 p-2.5 border border-border/40 text-[11px]">
                <div className="font-medium text-foreground">{event.event}</div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Actor: {event.actor}</span>
                  <span className="font-mono">{event.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </Drawer>
  );
}
