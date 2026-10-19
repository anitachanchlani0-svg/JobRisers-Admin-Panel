import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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
  Send,
  AlertCircle,
  Edit2,
  ListOrdered,
  HelpCircle,
  Sparkles,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Phone,
  Mail,
} from 'lucide-react';
import { adminApplications, type AdminApplicationDetail } from '@/mock-data';
import { Avatar, StatusPill } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';

const pipelineStages = ['Applied', 'Screening', 'Interview', 'Offered', 'Rejected'];

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [applicationsList, setApplicationsList] = useState<AdminApplicationDetail[]>(adminApplications);

  const application = applicationsList.find((a) => a.id === id) || applicationsList[0];
  const [currentStage, setCurrentStage] = useState<string>(application?.stage || 'Applied');

  // Step X of Y & Round X of Y state
  const [currentStep, setCurrentStep] = useState<number>(application?.currentStep || 1);
  const [totalSteps, setTotalSteps] = useState<number>(application?.totalSteps || 5);
  const [currentRound, setCurrentRound] = useState<number>(application?.currentRound || 1);
  const [totalRounds, setTotalRounds] = useState<number>(application?.totalRounds || 3);

  // Modals state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isEditStepModalOpen, setIsEditStepModalOpen] = useState(false);
  const [isEditRoundModalOpen, setIsEditRoundModalOpen] = useState(false);

  // Form temporary values
  const [tempStep, setTempStep] = useState<number>(1);
  const [tempTotalSteps, setTempTotalSteps] = useState<number>(5);
  const [stepError, setStepError] = useState<string | null>(null);

  const [tempRound, setTempRound] = useState<number>(1);
  const [tempTotalRounds, setTempTotalRounds] = useState<number>(3);
  const [roundError, setRoundError] = useState<string | null>(null);

  // Candidate PII Masking & Authorized Unmask Workflow (APP-10 / XMOD-3)
  const [isPiiUnmasked, setIsPiiUnmasked] = useState(false);
  const [unmaskModalOpen, setUnmaskModalOpen] = useState(false);
  const [unmaskJustification, setUnmaskJustification] = useState('');
  const [unmaskError, setUnmaskError] = useState('');
  const [piiAuditLogs, setPiiAuditLogs] = useState<
    { id: string; action: string; timestamp: string; actor: string; reason: string }[]
  >([]);

  // Toast / feedback notification
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const handleConfirmUnmask = () => {
    const trimmed = unmaskJustification.trim();
    if (!trimmed || trimmed.length < 5) {
      setUnmaskError('A valid business justification (min 5 characters) is required under DPDP Act 2023.');
      return;
    }
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    const newEntry = {
      id: `pii-aud-${Date.now()}`,
      action: 'Candidate PII Unmask Authorized',
      timestamp: `Today, ${timestamp}`,
      actor: 'Admin: Anita Chanchlani (Operations Admin)',
      reason: trimmed,
    };
    setPiiAuditLogs((prev) => [newEntry, ...prev]);
    setIsPiiUnmasked(true);
    setUnmaskModalOpen(false);
    setUnmaskJustification('');
    setUnmaskError('');
    showToast('Candidate contact details unmasked. Access event logged for DPDP compliance.');
  };

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  useEffect(() => {
    if (application) {
      setCurrentStage(application.stage || 'Applied');
      setCurrentStep(application.currentStep || 1);
      setTotalSteps(application.totalSteps || 5);
      setCurrentRound(application.currentRound || 1);
      setTotalRounds(application.totalRounds || 3);
    }
  }, [application]);

  if (!application) {
    return (
      <div className="space-y-4">
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Applications
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Application not found</h2>
          <p className="text-xs text-muted-foreground mt-1">No application matching ID "{id}".</p>
        </div>
      </div>
    );
  }

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage);
    setApplicationsList((prev) =>
      prev.map((app) =>
        app.id === application.id ? { ...app, stage: newStage, status: newStage } : app
      )
    );
    showToast(`Application stage changed to ${newStage}.`);
  };

  // Withdraw Action Handler
  const handleConfirmWithdraw = () => {
    const updatedStage = 'Withdrawn';
    setCurrentStage(updatedStage);

    const newTimelineEvent = {
      event: 'Application formally withdrawn by Admin for dispute resolution',
      timestamp: 'Just now',
      actor: 'Admin: Operations Caseworker',
    };

    setApplicationsList((prev) =>
      prev.map((app) =>
        app.id === application.id
          ? {
              ...app,
              stage: updatedStage,
              status: updatedStage,
              timeline: [newTimelineEvent, ...(app.timeline || [])],
            }
          : app
      )
    );

    setIsWithdrawModalOpen(false);
    showToast('Application has been successfully withdrawn. Parties notified.');
  };

  // Re-send Notification Action Handler
  const handleConfirmResendNotification = () => {
    const newTimelineEvent = {
      event: `Application milestone notification re-dispatched for stage: ${currentStage}`,
      timestamp: 'Just now',
      actor: 'Admin: Operations Caseworker',
    };

    setApplicationsList((prev) =>
      prev.map((app) =>
        app.id === application.id
          ? {
              ...app,
              timeline: [newTimelineEvent, ...(app.timeline || [])],
            }
          : app
      )
    );

    setIsResendModalOpen(false);
    showToast(`Milestone update notification re-sent to ${application.candidateEmailMasked}.`);
  };

  // Step X of Y Save Handler
  const handleSaveStep = () => {
    if (tempStep < 1 || tempTotalSteps < 1) {
      setStepError('Step values must be 1 or greater.');
      return;
    }
    if (tempStep > tempTotalSteps) {
      setStepError(`Current step (${tempStep}) cannot exceed total steps (${tempTotalSteps}).`);
      return;
    }

    setCurrentStep(tempStep);
    setTotalSteps(tempTotalSteps);

    const newTimelineEvent = {
      event: `Hiring pipeline progress corrected: Step ${tempStep} of ${tempTotalSteps}`,
      timestamp: 'Just now',
      actor: 'Admin: Operations Caseworker',
    };

    setApplicationsList((prev) =>
      prev.map((app) =>
        app.id === application.id
          ? {
              ...app,
              currentStep: tempStep,
              totalSteps: tempTotalSteps,
              timeline: [newTimelineEvent, ...(app.timeline || [])],
            }
          : app
      )
    );

    setIsEditStepModalOpen(false);
    setStepError(null);
    showToast(`Hiring pipeline progress updated to Step ${tempStep} of ${tempTotalSteps}.`);
  };

  // Round X of Y Save Handler
  const handleSaveRound = () => {
    if (tempRound < 1 || tempTotalRounds < 1) {
      setRoundError('Round values must be 1 or greater.');
      return;
    }
    if (tempRound > tempTotalRounds) {
      setRoundError(`Current round (${tempRound}) cannot exceed total rounds (${tempTotalRounds}).`);
      return;
    }

    setCurrentRound(tempRound);
    setTotalRounds(tempTotalRounds);

    const newTimelineEvent = {
      event: `Interview progress corrected: Round ${tempRound} of ${tempTotalRounds}`,
      timestamp: 'Just now',
      actor: 'Admin: Operations Caseworker',
    };

    setApplicationsList((prev) =>
      prev.map((app) =>
        app.id === application.id
          ? {
              ...app,
              currentRound: tempRound,
              totalRounds: tempTotalRounds,
              timeline: [newTimelineEvent, ...(app.timeline || [])],
            }
          : app
      )
    );

    setIsEditRoundModalOpen(false);
    setRoundError(null);
    showToast(`Interview progress updated to Round ${tempRound} of ${tempTotalRounds}.`);
  };

  const currentStageIndex = pipelineStages.indexOf(currentStage);

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/applications"
          data-testid="link-back-to-applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Applications
        </Link>
        <span className="text-[10px] font-mono text-muted-foreground">Application ID: {application.id}</span>
      </div>

      {/* Main Header Card with Dispute & Moderation Actions (APP-2) */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar name={application.candidateName} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                  {application.candidateName}
                </h1>
                <StatusPill value={currentStage} />
              </div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                <span>Applied for {application.jobTitle}</span>
                <span>·</span>
                <span className="text-primary font-semibold truncate">{application.company}</span>
              </p>
            </div>
          </div>

          {/* Dispute Handling Actions (APP-2) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsResendModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted transition-colors"
            >
              <Send size={13} className="text-primary" />
              <span>Re-send Notification</span>
            </button>

            {currentStage !== 'Withdrawn' ? (
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-100 transition-colors"
              >
                <XCircle size={13} />
                <span>Withdraw Application</span>
              </button>
            ) : (
              <span className="rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Application Withdrawn
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Step Pipeline Fields: Step X of Y & Round X of Y (APP-5) */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pipeline Milestones & Progress (APP-5)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Multi-step recruitment pipeline fields. Admins can view and correct values during dispute resolution.
            </p>
          </div>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            Dispute Correction Enabled
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Step X of Y: Overall Hiring Pipeline */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Overall Hiring Pipeline
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-extrabold text-primary">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-foreground">
                Recruitment Stage: Step {currentStep} of {totalSteps}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Represents candidate progress across the company's full recruitment lifecycle (Application → Screening → Interview → Offer → Hired).
              </p>

              {/* Visual Progress Bar */}
              <div className="mt-3 w-full bg-border rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentStep / totalSteps) * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Hiring lifecycle completion: {Math.round((currentStep / totalSteps) * 100)}%
              </span>
              <button
                onClick={() => {
                  setTempStep(currentStep);
                  setTempTotalSteps(totalSteps);
                  setStepError(null);
                  setIsEditStepModalOpen(true);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Edit2 size={12} className="text-primary" />
                <span>Correct Step</span>
              </button>
            </div>
          </div>

          {/* 2. Round X of Y: Interview Rounds */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Interview Stage Loop
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
                  Round {currentRound} of {totalRounds}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-foreground">
                Interview Phase: Round {currentRound} of {totalRounds}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Represents candidate progression across sequential technical interviews, live coding sessions, and hiring manager evaluation loops.
              </p>

              {/* Visual Progress Bar */}
              <div className="mt-3 w-full bg-border rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentRound / totalRounds) * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Interview panel completion: {Math.round((currentRound / totalRounds) * 100)}%
              </span>
              <button
                onClick={() => {
                  setTempRound(currentRound);
                  setTempTotalRounds(totalRounds);
                  setRoundError(null);
                  setIsEditRoundModalOpen(true);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Edit2 size={12} className="text-emerald-700" />
                <span>Correct Round</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Pipeline Stages Stepper */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Recruitment Funnel Stage
          </h2>
          <span className="text-xs text-muted-foreground">Click a stage to update status</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {pipelineStages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = stage === currentStage;
            const isRejected = stage === 'Rejected' && currentStage === 'Rejected';

            return (
              <button
                key={stage}
                type="button"
                onClick={() => handleStageChange(stage)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold'
                    : isRejected
                    ? 'border-rose-300 bg-rose-50 text-rose-800 font-bold'
                    : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                  Stage {idx + 1}
                </span>
                <span className="text-xs font-extrabold mt-0.5 truncate w-full">
                  {stage}
                </span>
                {isCompleted && <CheckCircle2 size={13} className="mt-1 text-emerald-600" />}
                {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />}
                {isRejected && <XCircle size={13} className="mt-1 text-rose-600" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Candidate & Job Summary */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Candidate Profile Info with PII Protection (APP-10) */}
          <div className="space-y-2 rounded-xl bg-muted/25 p-3.5 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-primary font-bold text-[11px] uppercase tracking-wider">
                <User size={13} /> Candidate Profile
              </div>
              {!isPiiUnmasked ? (
                <button
                  type="button"
                  data-testid="button-unmask-candidate-pii"
                  onClick={() => setUnmaskModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors shadow-2xs"
                >
                  <Lock size={11} /> Unmask PII
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    <ShieldCheck size={11} /> Unmasked (Audited)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPiiUnmasked(false)}
                    className="text-[10px] text-muted-foreground hover:text-foreground underline font-medium"
                  >
                    Re-mask
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs font-bold text-foreground">{application.candidateName}</div>
            <div className="text-[11px] text-muted-foreground">{application.candidateHeadline}</div>

            <div className="pt-1 space-y-1 text-[11px] border-t border-border/40">
              <div className="flex items-center justify-between text-muted-foreground font-mono">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                  <Mail size={11} /> Email:
                </span>
                <span className={isPiiUnmasked ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                  {isPiiUnmasked
                    ? `${application.candidateName.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@candidate.example.com`
                    : application.candidateEmailMasked}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground font-mono">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                  <Phone size={11} /> Phone:
                </span>
                <span className={isPiiUnmasked ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                  {isPiiUnmasked ? '+91 98765 43210' : '+91 98765 *****'}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                  <MapPin size={11} /> Location:
                </span>
                <span>{application.candidateLocation}</span>
              </div>
            </div>
          </div>

          {/* Position Info */}
          <div className="space-y-1.5 rounded-xl bg-muted/25 p-3.5 border border-border/50">
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

        <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-3 flex justify-between">
          <span>Application Timestamp:</span>
          <span className="font-semibold text-foreground">{application.appliedDate}</span>
        </div>
      </section>

      {/* 4. Candidate Resume & ATS Match */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Candidate Resume
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <Award size={11} /> ATS Match: {application.resume.atsScore}%
          </span>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText size={18} />
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
          <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-bold text-foreground shrink-0">
            Verified ATS
          </span>
        </div>

        <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60 text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Parsed Profile Summary: </span>
          {application.resume.summary}
        </div>
      </section>

      {/* 5. Screening Question Answers */}
      {application.screeningQuestions && application.screeningQuestions.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Screening Questions & Responses ({application.screeningQuestions.length})
          </h3>
          <div className="space-y-2.5">
            {application.screeningQuestions.map((q, idx) => (
              <div key={idx} className="rounded-xl bg-muted/20 p-3 border border-border/50 text-xs space-y-1">
                <div className="font-semibold text-foreground">{q.question}</div>
                <div className="text-primary font-medium pl-2.5 border-l-2 border-primary/40 mt-1">
                  {q.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Candidate Cover Letter */}
      {application.coverLetter && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Cover Letter
          </h3>
          <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60 text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
            {application.coverLetter}
          </div>
        </section>
      )}

      {/* 7. Employer Feedback & Notes */}
      {application.feedbackNotes && application.feedbackNotes.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquare size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Employer Evaluation & Feedback
            </h3>
          </div>
          <div className="space-y-2.5">
            {application.feedbackNotes.map((note, idx) => (
              <div key={idx} className="rounded-xl bg-muted/25 p-3.5 border border-border/50 text-xs space-y-1">
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
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Stage History & Timeline ({application.timeline.length})
            </h3>
          </div>
          <div className="space-y-2">
            {application.timeline.map((event, idx) => (
              <div key={idx} className="rounded-xl bg-muted/20 p-3 border border-border/40 text-[11px]">
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

      {/* ======================= MODALS ======================= */}

      {/* A. Withdraw Confirmation Modal (APP-2) */}
      {isWithdrawModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsWithdrawModalOpen(false)}
          title="Withdraw Application"
          subtitle={`Candidate: ${application.candidateName} · Role: ${application.jobTitle}`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-rose-900 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Dispute Casework Action:</strong>
                Are you sure you want to withdraw this application? This will set the application status to <strong>Withdrawn</strong> and log an administrative timeline record.
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* B. Re-send Notification Modal (APP-2) */}
      {isResendModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsResendModalOpen(false)}
          title="Re-send Application Notification"
          subtitle={`Candidate: ${application.candidateName} (${application.candidateEmailMasked})`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3.5 text-foreground flex items-start gap-2.5">
              <Send size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-primary">Notification Re-dispatch:</strong>
                This action simulates re-sending the candidate application status email and portal push notice for stage: <strong>{currentStage}</strong>.
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setIsResendModalOpen(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResendNotification}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Re-send Notification
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* C. Correct Step X of Y Modal (APP-5) */}
      {isEditStepModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditStepModalOpen(false)}
          title="Correct Hiring Pipeline Step"
          subtitle="Admin dispute correction for overall recruitment workflow progress."
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Current Step (X)</label>
                <input
                  type="number"
                  min="1"
                  value={tempStep}
                  onChange={(e) => {
                    setTempStep(Number(e.target.value));
                    setStepError(null);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Total Steps (Y)</label>
                <input
                  type="number"
                  min="1"
                  value={tempTotalSteps}
                  onChange={(e) => {
                    setTempTotalSteps(Number(e.target.value));
                    setStepError(null);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
            </div>

            {stepError && (
              <div className="text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle size={13} />
                <span>{stepError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setIsEditStepModalOpen(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStep}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Save Step Correction
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* D. Correct Round X of Y Modal (APP-5) */}
      {isEditRoundModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditRoundModalOpen(false)}
          title="Correct Interview Round"
          subtitle="Admin dispute correction for interview panel rounds."
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Current Round (X)</label>
                <input
                  type="number"
                  min="1"
                  value={tempRound}
                  onChange={(e) => {
                    setTempRound(Number(e.target.value));
                    setRoundError(null);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Total Rounds (Y)</label>
                <input
                  type="number"
                  min="1"
                  value={tempTotalRounds}
                  onChange={(e) => {
                    setTempTotalRounds(Number(e.target.value));
                    setRoundError(null);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
            </div>

            {roundError && (
              <div className="text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle size={13} />
                <span>{roundError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setIsEditRoundModalOpen(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRound}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Save Round Correction
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* E. PII Unmask Justification Modal (APP-10 / DPDP Act Compliance) */}
      {unmaskModalOpen && (
        <Modal
          isOpen={unmaskModalOpen}
          onClose={() => {
            setUnmaskModalOpen(false);
            setUnmaskError('');
            setUnmaskJustification('');
          }}
          title="Authorized PII Unmask Request"
          subtitle="Candidate contact information is protected under DPDP Act 2023."
          maxWidth="max-w-[480px]"
          dataTestId="modal-unmask-pii"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setUnmaskModalOpen(false);
                  setUnmaskError('');
                  setUnmaskJustification('');
                }}
                className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel (Keep Masked)
              </button>
              <button
                type="button"
                data-testid="button-confirm-unmask"
                onClick={handleConfirmUnmask}
                disabled={!unmaskJustification.trim() || unmaskJustification.trim().length < 5}
                className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Authorize & Unmask
              </button>
            </div>
          }
        >
          <div className="space-y-3.5 py-1 text-xs">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900 leading-relaxed text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldAlert size={14} /> Statutory DPDP Compliance Notice
              </div>
              <p>
                Unmasking personal email and phone numbers creates an immutable audit event. You must provide a valid casework or operational justification.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1">
                Business Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                data-testid="input-unmask-justification"
                rows={3}
                value={unmaskJustification}
                onChange={(e) => {
                  setUnmaskJustification(e.target.value);
                  if (unmaskError) setUnmaskError('');
                }}
                placeholder="State specific dispute, employer interview escalation, or fraud inquiry reason (minimum 5 characters)..."
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs outline-none focus:border-primary leading-relaxed"
              />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                <span>Actor: Operations Admin (Anita Chanchlani)</span>
                <span>{unmaskJustification.trim().length}/5 min characters</span>
              </div>
              {unmaskError && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{unmaskError}</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* PII Audit Trail Stream (Visible when unmask events exist) */}
      {piiAuditLogs.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Candidate PII Access Audit Log ({piiAuditLogs.length})
            </h3>
          </div>
          <div className="space-y-2">
            {piiAuditLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-border/70 bg-muted/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-foreground">{log.action}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Reason: <span className="italic text-foreground">"{log.reason}"</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-semibold text-foreground">{log.actor}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
