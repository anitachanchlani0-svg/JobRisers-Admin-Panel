import { ClipboardList, ListFilter, FileText, Sparkles, Bell, ShieldAlert, CircleHelp, Activity, Settings2 } from 'lucide-react';

export type AdminActivityTone = 'blue' | 'violet' | 'amber' | 'red' | 'green';
export type AdminMetricDirection = 'up' | 'down' | 'flat';
export type DirectoryKind = 'candidates' | 'employers' | 'jobs';
export type ReviewDecision = 'approve' | 'reject' | 'request-edits';

export interface AdminMetric {
  label: string;
  value: string;
  change: string;
  direction: AdminMetricDirection;
}

export interface TrendPoint {
  label: string;
  signups: number;
  jobs: number;
  applications: number;
}

export interface AdminQueue {
  label: string;
  count: number;
  description: string;
  tone: AdminActivityTone;
}

export interface AdminOverview {
  metrics: AdminMetric[];
  trend: TrendPoint[];
  queues: AdminQueue[];
}

export interface AdminActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  tone: AdminActivityTone;
  time: string;
}

export interface DirectoryRecord {
  id: string;
}

export interface CandidateExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface CandidateEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface CandidateResume {
  filename: string;
  uploadedAt: string;
  size: string;
  atsScore: number;
  summary: string;
}

export interface CandidateApplicationHistory {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: string;
}

export interface CandidateAuditLog {
  action: string;
  timestamp: string;
  actor: string;
}

export interface CandidateSocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

export interface CandidateOnboarding {
  careerGoal?: string;
  targetRoles?: string[];
  preferredLocations?: string[];
  workMode?: string;
  wizardVersion?: string;
  completedSteps?: number;
  totalSteps?: number;
}

export interface CandidateNotificationPreferences {
  jobAlerts: boolean;
  applicationUpdates: boolean;
  interviewReminders: boolean;
  messages: boolean;
  productUpdates: boolean;
  promotionalEmails: boolean;
  emailChannel: boolean;
  pushChannel: boolean;
  smsChannel: boolean;
}

export interface CandidateConsentRecord {
  id: string;
  purpose: string;
  version: string;
  consentedAt: string;
  ipAddress: string;
  status: 'Granted' | 'Revoked';
}

export interface CandidatePrivacySettings {
  publicProfile: boolean;
  visibleToEmployers: boolean;
  allowSearchIndexing: boolean;
  publicProfileSlug: string;
  dataDownloadStatus: 'Available' | 'Generating' | 'None';
}

export interface CandidateResumeVersion {
  id: string;
  filename: string;
  uploadedAt: string;
  size: string;
  atsScore: number;
  templateId: string;
  templateName: string;
  isDefault: boolean;
  atsValidated: boolean;
  summary?: string;
}

export interface CandidateOAuthAccount {
  provider: 'Google' | 'LinkedIn' | 'Apple' | 'Native';
  email: string;
  linkedAt: string;
  status: 'Connected' | 'Unlinked';
}

export interface CandidateLoginHistory {
  id: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  location: string;
}

export interface CandidateStaffNote {
  id: string;
  author: string;
  note: string;
  createdAt: string;
}

export interface CandidateDuplicateSignal {
  duplicateCandidateId: string;
  duplicateCandidateName: string;
  matchScore: number;
  reason: string;
}

export interface AdminCandidate extends DirectoryRecord {
  name: string;
  headline: string;
  emailMasked: string;
  emailFull?: string;
  phoneMasked?: string;
  phoneFull?: string;
  isUnmasked?: boolean;
  location: string;
  status: string;
  completion: number;
  source: string;
  lastActive: string;
  pro?: boolean;
  skills?: string[];
  experience?: CandidateExperience[];
  education?: CandidateEducation[];
  resume?: CandidateResume;
  applicationsHistory?: CandidateApplicationHistory[];
  auditLog?: CandidateAuditLog[];

  // PRD Additions
  createdAt?: string;
  isEmailVerified?: boolean;
  openToRemote?: boolean;
  visibleToEmployers?: boolean;
  socialLinks?: CandidateSocialLinks;
  onboarding?: CandidateOnboarding;
  notificationPreferences?: CandidateNotificationPreferences;
  consentRecords?: CandidateConsentRecord[];
  privacySettings?: CandidatePrivacySettings;
  recruiterViewsCount?: number;
  savedJobIds?: string[];
  resumeVersions?: CandidateResumeVersion[];
  linkedOAuthAccounts?: CandidateOAuthAccount[];
  loginHistory?: CandidateLoginHistory[];
  staffNotes?: CandidateStaffNote[];
  duplicateSignals?: CandidateDuplicateSignal[];
  isFakeProfileFlagged?: boolean;
  fakeProfileReason?: string;
  deletionRequest?: {
    requestedAt: string;
    slaDueDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    reason: string;
  };
}

export interface EmployerDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'Verified' | 'Under review' | 'Rejected' | 'Pending';
  size: string;
}

export interface EmployerTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Invited';
}

export interface EmployerRelatedJob {
  id: string;
  title: string;
  location: string;
  workMode: string;
  status: string;
  applicants: number;
  posted: string;
}

export type OnboardingStepNumber = 1 | 2 | 3 | 4;
export type OnboardingStepName =
  | 'Company Profile'
  | 'Team & Billing'
  | 'Verification'
  | 'Start Hiring';
export type OnboardingStepStatus = 'Completed' | 'In progress' | 'Stuck' | 'Draft';

export interface EmployerOnboardingRecord {
  step: OnboardingStepNumber;
  stepName: OnboardingStepName;
  stepStatus: OnboardingStepStatus;
  lastActive: string;
  dropOffWarning?: string;
  isStalled?: boolean;
  draftSummary: string;
  stepsCompleted: OnboardingStepNumber[];
  nudgeCount?: number;
  lastNudgeDate?: string;
}

export interface AdminEmployer extends DirectoryRecord {
  company: string;
  name: string;
  emailMasked: string;
  emailFull?: string;
  phoneMasked?: string;
  location: string;
  verification: string;
  jobs: number;
  plan: string;
  status: string;
  joined: string;
  website?: string;
  industry?: string;
  size?: string;
  about?: string;
  cin?: string;
  gst?: string;
  documents?: EmployerDocument[];
  teamMembers?: EmployerTeamMember[];
  relatedJobs?: EmployerRelatedJob[];
  subscriptionStanding?: {
    plan: string;
    status: string;
    renewalDate: string;
    billingCycle: string;
    amount: string;
  };
  onboarding?: EmployerOnboardingRecord;
  staffNotes?: { id: string; author: string; note: string; createdAt: string }[];
  auditLog?: { id: string; actor: string; timestamp: string; action: string; reason?: string }[];
  duplicateSignals?: { id: string; matchedCompany: string; matchConfidence: number; matchedField: string; targetId: string }[];
  logoUrl?: string;
  logoStatus?: 'Verified' | 'Pending Review' | 'Flagged';
}

export interface JobModerationLog {
  date: string;
  reviewer: string;
  decision: string;
  note: string;
}

export interface AdminJob extends DirectoryRecord {
  title: string;
  company: string;
  location: string;
  workMode: string;
  type: string;
  status: string;
  posted: string;
  applicants: number;
  flagged?: boolean;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  salaryRange?: string;
  benefits?: string[];
  applicantBreakdown?: {
    applied: number;
    screening: number;
    interview: number;
    offered: number;
    rejected: number;
  };
  moderationHistory?: JobModerationLog[];
  duplicateSignals?: { id: string; matchedJobId: string; matchedTitle: string; matchedCompany: string; matchConfidence: number }[];
  sponsoredConfig?: { isSponsored: boolean; startDate?: string; endDate?: string; durationDays?: number; impressionCap?: number; impressionsServed?: number };
  atsFeed?: { feedId: string; source: string; lastSync: string; syncStatus: 'Success' | 'Errors'; errorCount: number; errorLog?: string[] };
}

// Job Consistency Check Types
export type ConsistencyIssueType =
  | 'Work Mode Mismatch'
  | 'Salary Formatting Anomaly'
  | 'Expired Jobs'
  | 'Location Conflict'
  | 'Seniority Discrepancy';

export type ConsistencySeverity = 'High' | 'Medium' | 'Low';
export type ConsistencyStatus = 'Unresolved' | 'Under review' | 'Resolved' | 'Dismissed';

export interface JobConsistencyIssue {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  issueType: ConsistencyIssueType;
  currentValue: string;
  problemDescription: string;
  fieldChecked: string;
  severity: ConsistencySeverity;
  status: ConsistencyStatus;
  detectedDate: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

// Application Stage Mapping Types

export interface ApplicationPolicySettings {
  dailyApplicationCap: number;
  requireResumeFor1Click: boolean;
  blockDisposableEmails: boolean;
  throttleMassApplyThreshold: number;
  enable1ClickApplyGlobally: boolean;
  perEmployer1ClickAllowed: boolean;
  perJob1ClickAllowed: boolean;
}

export const adminApplicationPolicySettings: ApplicationPolicySettings = {
  dailyApplicationCap: 25,
  requireResumeFor1Click: true,
  blockDisposableEmails: true,
  throttleMassApplyThreshold: 30,
  enable1ClickApplyGlobally: true,
  perEmployer1ClickAllowed: true,
  perJob1ClickAllowed: true,
};

export interface ApplicationStageMapping {
  id: string;
  order: number;
  candidateStage: string;
  adminStatus: string;
  description: string;
  candidateDescription: string;
  notifyCandidate: boolean;
  portalVisible: boolean;
  status: 'Active' | 'Paused';
  lastUpdated: string;
}

// Application Detail Types
export interface ApplicationTimelineEvent {
  event: string;
  timestamp: string;
  actor: string;
}

export interface ScreeningAnswer {
  question: string;
  answer: string;
}

export interface EmployerFeedback {
  author: string;
  role: string;
  date: string;
  rating: number;
  note: string;
}

export interface AdminApplicationDetail {
  id: string;
  recordTitle: string;
  candidateName: string;
  candidateHeadline: string;
  candidateEmailMasked: string;
  candidatePhoneMasked: string;
  candidateLocation: string;
  jobTitle: string;
  company: string;
  jobLocation: string;
  workMode: string;
  appliedDate: string;
  status: string;
  stage: string;
  currentStep?: number;
  totalSteps?: number;
  currentRound?: number;
  totalRounds?: number;
  resume: {
    filename: string;
    size: string;
    atsScore: number;
    summary: string;
  };
  coverLetter?: string;
  screeningQuestions: ScreeningAnswer[];
  feedbackNotes?: EmployerFeedback[];
  timeline: ApplicationTimelineEvent[];
}

// Support Ticket Detail Types
export interface TicketMessage {
  id: string;
  sender: string;
  senderRole: 'requester' | 'agent' | 'system';
  timestamp: string;
  message: string;
}

export interface TicketInternalNote {
  id: string;
  author: string;
  timestamp: string;
  note: string;
}

export interface AdminSupportTicketDetail {
  id: string;
  recordTitle: string;
  ticketId: string;
  subject: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: 'Candidate' | 'Employer';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  category: string;
  status: 'Open' | 'In Progress' | 'Waiting on Customer' | 'Resolved' | 'Closed';
  sla: {
    responseDue: string;
    timeLeft: string;
    breached: boolean;
  };
  assignedAgent: string;
  conversation: TicketMessage[];
  internalNotes: TicketInternalNote[];
  cannedResponses: Array<{ id: string; title: string; content: string }>;
}

// Interview Oversight Types
export interface AdminInterviewRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  companyId: string;
  companyName: string;
  jobId: string;
  jobTitle: string;
  dateTime: string;
  timezone: string;
  duration: string;
  provider: 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'In-person';
  format: 'Video call' | 'On-site' | 'Phone';
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Feedback Pending' | 'No-show' | 'Cancelled';
  meetingLink?: string;
  location?: string;
  interviewerName: string;
  interviewerTitle: string;
  notes?: string;
}


export interface AdminInterviewDispute {
  id: string;
  interviewId: string;
  candidateId: string;
  candidateName: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  filingParty: 'Candidate' | 'Employer';
  filerName: string;
  reason: 'Candidate No-show' | 'Employer / Recruiter No-show' | 'Invalid / Expired Meeting Link' | 'Off-platform Fee Demand / Fraud' | 'Technical Failure';
  description: string;
  filingDate: string;
  scheduledTime: string;
  status: 'Pending Review' | 'Investigating' | 'Resolved' | 'Dismissed';
  resolutionNotes?: string;
}

export interface AdminMeetingLinkRules {
  allowedProviders: {
    googleMeet: boolean;
    zoom: boolean;
    microsoftTeams: boolean;
    webex: boolean;
  };
  allowCustomDomains: boolean;
  blockUrlShorteners: boolean;
  blockedShortenersList: string[];
  joinWindowMinutesBefore: number;
  linkExpiryMinutesAfter: number;
  autoGenerateCalendarInvite: boolean;
  enforceHostValidation: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export interface AdminInterviewPrepLink {
  id: string;
  title: string;
  targetCategory: string;
  targetRole: string;
  deliveryTrigger: 'Interview confirmation email' | 'Candidate dashboard / in-app banner' | '24-hour reminder';
  status: 'Active' | 'Draft' | 'Archived';
  articleSlug: string;
  estimatedReadTime: string;
  summary: string;
  keyTopics: string[];
  lastUpdated: string;
}

// Messaging Oversight Types
export interface AdminConversationMetadata {
  id: string;
  candidateId: string;
  candidateName: string;
  employerId: string;
  companyName: string;
  employerContactName: string;
  jobId: string;
  jobTitle: string;
  startedDate: string;
  lastActivity: string;
  messageCount: number;
  status: 'Active' | 'Archived' | 'Locked';
  isUnread: boolean;
  isFlagged: boolean;
  flagReason?: string;
}

export interface AdminFlaggedContextMessage {
  sender: string;
  isOffender: boolean;
  text: string;
  time: string;
}

export interface AdminFlaggedThread {
  id: string;
  threadId: string;
  candidateName: string;
  candidateId: string;
  employerContactName: string;
  companyName: string;
  jobTitle: string;
  jobId: string;
  triggerRule: string;
  matchedKeyword: string;
  triggerSnippet: string;
  surroundingContext: AdminFlaggedContextMessage[];
  riskScore: number;
  severity: 'Medium' | 'High' | 'Critical';
  timestamp: string;
  status: 'Under Review' | 'Investigating' | 'Resolved' | 'Dismissed';
  resolutionNote?: string;
}

export interface AdminKeywordRule {
  id: string;
  keyword: string;
  category: 'Fee Solicitation' | 'Off-Platform Contact' | 'Spam / Phishing' | 'Harassment' | 'Security Risk';
  severity: 'Medium' | 'High' | 'Critical';
  action: 'Auto-flag & Notify' | 'Block Message' | 'Warning Banner' | 'Review Queue';
  isActive: boolean;
  hitCount: number;
  lastTriggered: string;
}

export interface AdminMessagingPolicies {
  dailyOutreachLimit: number;
  unresponsiveCooldownHours: number;
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  blockExecutableScripts: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export interface AdminReportedMessage {
  id: string;
  sender: string;
  senderRole: 'Candidate' | 'Employer';
  isOffender: boolean;
  text: string;
  timestamp: string;
  isReportedViolation?: boolean;
}

export interface AdminReportedThread {
  id: string;
  threadId: string;
  reportedBy: string;
  reporterRole: 'Candidate' | 'Employer';
  offendingUser: string;
  offendingRole: 'Candidate' | 'Employer';
  organization: string;
  violationReason: string;
  reportedAt: string;
  status: 'Under Review' | 'Investigating' | 'Action Taken' | 'Dismissed';
  evidenceCount: number;
  messages: AdminReportedMessage[];
  resolutionNotes?: string;
}


// Recommendation & Matching Types
export interface RecommendationBoostItem {
  id: string;
  type: 'Job' | 'Company';
  targetId: string;
  targetTitle: string;
  companyName: string;
  status: 'Pinned' | 'Boosted' | 'Suppressed';
  boostWeight: string;
  reason: string;
  updatedBy: string;
  updatedAt: string;
}

export interface RecommendationAuditEntry {
  id: string;
  model: string;
  metric: string;
  score: string;
  status: 'Healthy' | 'Monitoring' | 'Alert';
  details: string;
  evaluatedAt: string;
}

export interface MatchScoreSample {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  matchScore: number;
  factors: {
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    salaryFit: number;
  };
}

export interface AdminMatchFactorWeights {
  skills: number;
  role: number;
  location: number;
  workMode: number;
  salary: number;
  experience: number;
}

export interface AdminAlgorithmVersionEntry {
  version: string;
  releaseDate: string;
  releasedBy: string;
  weights: AdminMatchFactorWeights;
  minMatchScore: number;
  changeSummary: string;
  isActive: boolean;
}

export interface AdminMatchAlgorithmConfig {
  activeVersion: string;
  modelName: string;
  modelDescription: string;
  weights: AdminMatchFactorWeights;
  minMatchScore: number;
  killSwitchActive: boolean;
  topRecommendationsCount: number;
  refreshCadenceHours: number;
  matchBadgeThreshold: number;
  versionHistory: AdminAlgorithmVersionEntry[];
}

export interface AdminProfileStrengthTier {
  tier: 'Beginner' | 'Intermediate' | 'Advanced' | 'All-Star';
  minScore: number;
  tipText: string;
}

export interface AdminProfileStrengthFormula {
  sectionWeights: {
    photo: number;
    skills: number;
    experience: number;
    education: number;
    resume: number;
    summary: number;
  };
  tiers: AdminProfileStrengthTier[];
}

export interface AdminAlgorithmAuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  changeType: string;
  previousValue: string;
  newValue: string;
  status: 'Applied' | 'Reverted';
}


// Employer Billing & Plans Types
export interface EmployerPlanTier {
  id: string;
  name: string;
  tier: 'Starter' | 'Growth' | 'Scale Enterprise';
  priceMonthly: number;
  priceAnnual: number;
  currency: string;
  activeSubscribers: number;
  features: {
    jobPostingQuota: number | string;
    featuredJobCredits: number;
    teamSeats: number;
    resumeSearchQuota: number | string;
    supportSla: string;
  };
  status: 'Active' | 'Grandfathered';
}

export interface EmployerInvoice {
  id: string;
  invoiceNumber: string;
  employerId: string;
  companyName: string;
  billingContact: string;
  billingEmail: string;
  gstin: string;
  amountSubtotal: number;
  gstAmount: number;
  amountTotal: number;
  currency: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  paymentMethod: 'Corporate Credit Card' | 'Stripe Auto-debit' | 'Razorpay UPI' | 'Net Banking';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

export interface EmployerJobPackage {
  id: string;
  name: string;
  jobQuantity: number;
  price: number;
  currency: string;
  validityDays: number;
  featuredCredits: number;
  status: 'Active' | 'Inactive';
  description: string;
}

export interface EmployerBillingCreditEntry {
  id: string;
  employerId: string;
  companyName: string;
  creditType: 'Job Posting' | 'Featured Spotlight' | 'Promotional Waiver' | 'System Compensation';
  amountOrCredits: string;
  reason: string;
  date: string;
  status: 'Available' | 'Redeemed' | 'Expired';
}

export interface EmployerRefundRequest {
  id: string;
  invoiceId: string;
  employerId: string;
  companyName: string;
  amount: number;
  currency: string;
  reason: string;
  requestedDate: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Processed';
  notes?: string;
}

export interface EmployerPaymentDispute {
  id: string;
  invoiceId: string;
  employerId: string;
  companyName: string;
  amount: number;
  currency: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Dispute Won';
  reason: string;
  filingDate: string;
  gateway: string;
  resolutionNotes?: string;
}

export interface EmployerPaywallRules {
  enforceJobPostingQuota: boolean;
  enforceResumeSearchQuota: boolean;
  unverifiedEmployerPublishingRestricted: boolean;
  allowDraftsForUnverified: boolean;
  gracePeriodDaysAfterFailure: number;
}


export const adminActivities: AdminActivity[] = [
  { id: 'act-1', actor: 'Devika Rao', action: 'approved job listing', target: 'Senior Product Designer', tone: 'green', time: 'Just now' },
  { id: 'act-2', actor: 'System Auto', action: 'flagged candidate profile', target: 'Bulk sign-up pattern', tone: 'red', time: '12 min ago' },
  { id: 'act-3', actor: 'Rahul Sharma', action: 'verified employer', target: 'Cloudframe', tone: 'blue', time: '45 min ago' },
  { id: 'act-4', actor: 'Maya Iyer', action: 'published CMS page', target: 'Candidate Rights v2.1', tone: 'violet', time: '2 hr ago' },
  { id: 'act-5', actor: 'Devika Rao', action: 'resolved ticket', target: 'JR-C10451', tone: 'green', time: '3 hr ago' },
  { id: 'act-6', actor: 'System Auto', action: 'sent broadcast', target: 'New templates promo', tone: 'amber', time: 'Yesterday' },
];

export const adminOverview: AdminOverview = {
  metrics: [
    { label: 'Total Candidates', value: '1.24M', change: '+12.4K', direction: 'up' },
    { label: 'Active Employers', value: '14,802', change: '+342', direction: 'up' },
    { label: 'Live Jobs', value: '52,190', change: '+1.2K', direction: 'up' },
    { label: 'Monthly Recurring Revenue', value: '₹4.2M', change: '+8.4%', direction: 'up' },
  ],
  trend: [
    { label: 'Mon', signups: 1200, jobs: 450, applications: 8400 },
    { label: 'Tue', signups: 1450, jobs: 520, applications: 9200 },
    { label: 'Wed', signups: 1300, jobs: 490, applications: 8900 },
    { label: 'Thu', signups: 1600, jobs: 610, applications: 10500 },
    { label: 'Fri', signups: 1550, jobs: 580, applications: 9800 },
    { label: 'Sat', signups: 800, jobs: 200, applications: 4500 },
    { label: 'Sun', signups: 950, jobs: 250, applications: 5100 },
  ],
  queues: [
    { label: 'Job Moderation', count: 42, description: 'Listings pending approval or flagged', tone: 'amber' },
    { label: 'Employer Verification', count: 18, description: 'Accounts awaiting identity check', tone: 'blue' },
    { label: 'Safety Reports', count: 7, description: 'User reports requiring casework', tone: 'red' },
    { label: 'Support Tickets', count: 124, description: 'Open candidate and employer queries', tone: 'violet' },
  ],
};

export const adminCandidates: AdminCandidate[] = [
  {
    id: 'can-1001',
    name: 'Aarav Mehta',
    headline: 'Senior Product Designer',
    emailMasked: 'aa***@mail.com',
    emailFull: 'aarav.mehta@designflow.io',
    phoneMasked: '+91 98765 *****',
    phoneFull: '+91 98765 43210',
    location: 'Bengaluru, KA',
    status: 'Active',
    completion: 96,
    source: 'Google',
    lastActive: '12 min ago',
    pro: true,
    createdAt: '2026-03-15',
    isEmailVerified: true,
    openToRemote: true,
    visibleToEmployers: true,
    recruiterViewsCount: 42,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aarav-mehta',
      portfolio: 'https://aaravmehta.design',
      github: 'https://github.com/aaravmehta',
    },
    onboarding: {
      careerGoal: 'Lead product design architecture at high-growth fintech scale-ups.',
      targetRoles: ['Lead Product Designer', 'Design Systems Specialist', 'Staff UX Architect'],
      preferredLocations: ['Bengaluru, KA', 'Remote India'],
      workMode: 'Hybrid',
      wizardVersion: 'v2.1',
      completedSteps: 4,
      totalSteps: 4,
    },
    notificationPreferences: {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      productUpdates: false,
      promotionalEmails: false,
      emailChannel: true,
      pushChannel: true,
      smsChannel: true,
    },
    consentRecords: [
      {
        id: 'cst-101',
        purpose: 'DPDP Act 2023 Consent & Platform Terms of Service',
        version: 'v2.0',
        consentedAt: 'Mar 15, 2026, 10:30 AM',
        ipAddress: '157.48.12.90',
        status: 'Granted',
      },
      {
        id: 'cst-102',
        purpose: 'Direct Employer Recruiter Discovery & Profile Indexing',
        version: 'v1.4',
        consentedAt: 'Apr 02, 2026, 03:15 PM',
        ipAddress: '157.48.12.90',
        status: 'Granted',
      },
    ],
    privacySettings: {
      publicProfile: true,
      visibleToEmployers: true,
      allowSearchIndexing: true,
      publicProfileSlug: 'aarav-mehta-design',
      dataDownloadStatus: 'Available',
    },
    savedJobIds: ['job-3001', 'job-3006'],
    linkedOAuthAccounts: [
      { provider: 'Google', email: 'aarav.mehta@designflow.io', linkedAt: 'Mar 15, 2026', status: 'Connected' },
      { provider: 'LinkedIn', email: 'aarav.mehta@linkedin.com', linkedAt: 'Apr 10, 2026', status: 'Connected' },
    ],
    loginHistory: [
      { id: 'log-101', timestamp: 'Today, 10:14 AM', ipAddress: '49.207.214.12', device: 'Chrome 128 / macOS 15.0', location: 'Bengaluru, India' },
      { id: 'log-102', timestamp: 'Yesterday, 04:30 PM', ipAddress: '49.207.214.12', device: 'Chrome 128 / macOS 15.0', location: 'Bengaluru, India' },
      { id: 'log-103', timestamp: 'Oct 11, 2026', ipAddress: '49.207.214.12', device: 'Safari Mobile / iOS 18.0', location: 'Bengaluru, India' },
    ],
    staffNotes: [
      { id: 'sn-101', author: 'Rahul Sharma (Admin)', note: 'Candidate verified portfolio credentials. High match for design systems leadership roles.', createdAt: 'Oct 1, 2026' },
      { id: 'sn-102', author: 'Devika Rao (Talent Ops)', note: 'Requested Pro portfolio showcase feedback; resolved via canned help guide.', createdAt: 'Sep 29, 2026' },
    ],
    skills: ['Figma', 'UI/UX Architecture', 'Design Systems', 'User Research', 'Prototyping', 'Design Tokens', 'Micro-interactions'],
    experience: [
      {
        role: 'Lead Product Designer',
        company: 'FinStack Technologies',
        duration: '2023 - Present · 2 yrs',
        description: 'Led end-to-end design of the merchant onboarding portal, boosting verification conversion by 34%. Built and scaled the enterprise DS tokens.',
      },
      {
        role: 'Senior UX Designer',
        company: 'UrbanKite Mobility',
        duration: '2020 - 2023 · 3 yrs',
        description: 'Designed cross-platform ride-booking flows and rider support hubs. Managed junior designer reviews and ran iterative usability labs.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Design (Interaction Design)',
        institution: 'National Institute of Design (NID), Ahmedabad',
        year: '2016 - 2020',
      },
    ],
    resume: {
      filename: 'Aarav_Mehta_Product_Designer_CV.pdf',
      uploadedAt: 'Sep 28, 2026',
      size: '1.4 MB',
      atsScore: 94,
      summary: 'Senior Product Designer with 6+ years designing consumer & fintech products. Proven expertise in Figma systems, user research, and cross-functional leadership.',
    },
    resumeVersions: [
      {
        id: 'res-v1',
        filename: 'Aarav_Mehta_Product_Designer_CV.pdf',
        uploadedAt: 'Sep 28, 2026',
        size: '1.4 MB',
        atsScore: 94,
        templateId: 'tmpl-1',
        templateName: 'Modern Split v2.4',
        isDefault: true,
        atsValidated: true,
        summary: 'Primary executive design CV with complete portfolio links and tokenized DS case studies.',
      },
      {
        id: 'res-v2',
        filename: 'Aarav_Mehta_DesignSystems_Focus.pdf',
        uploadedAt: 'Aug 10, 2026',
        size: '1.1 MB',
        atsScore: 91,
        templateId: 'tmpl-2',
        templateName: 'Tech Mono v1.8',
        isDefault: false,
        atsValidated: true,
        summary: 'Specialized systems design resume focusing on multi-brand tokens and cross-platform design-to-code pipelines.',
      },
    ],
    applicationsHistory: [
      { id: 'app-901', jobTitle: 'Senior Product Designer', company: 'Northstar Labs', appliedDate: 'Today, 10:14 AM', status: 'Applied' },
      { id: 'app-902', jobTitle: 'Lead Design Systems Specialist', company: 'HyperTrack Solutions', appliedDate: 'Oct 3, 2026', status: 'Interview' },
      { id: 'app-903', jobTitle: 'Staff UX Strategist', company: 'Cloudframe', appliedDate: 'Sep 19, 2026', status: 'Shortlisted' },
    ],
    auditLog: [
      { action: 'Profile updated with new portfolio case study', timestamp: 'Yesterday, 4:10 PM', actor: 'Candidate (Self)' },
      { action: 'Job alert enabled: Design Lead Bengaluru', timestamp: 'Oct 4, 2026', actor: 'Candidate (Self)' },
      { action: 'Admin Rahul Sharma viewed candidate profile', timestamp: 'Oct 1, 2026', actor: 'Admin: Rahul Sharma' },
    ],
  },
  {
    id: 'can-1002',
    name: 'Priya Nair',
    headline: 'Frontend Engineer',
    emailMasked: 'pr***@mail.com',
    emailFull: 'priya.nair@devcraft.in',
    phoneMasked: '+91 97451 *****',
    phoneFull: '+91 97451 88421',
    location: 'Kochi, KL',
    status: 'Pending',
    completion: 78,
    source: 'LinkedIn',
    lastActive: '46 min ago',
    pro: false,
    createdAt: '2026-10-08',
    isEmailVerified: false,
    openToRemote: true,
    visibleToEmployers: true,
    recruiterViewsCount: 18,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priya-nair-dev',
      github: 'https://github.com/priyanair-frontend',
    },
    onboarding: {
      careerGoal: 'Join modern product team shipping web applications with React & TypeScript.',
      targetRoles: ['Frontend Engineer', 'React Developer', 'UI Engineer'],
      preferredLocations: ['Kochi, KL', 'Bengaluru, KA', 'Remote India'],
      workMode: 'Remote',
      wizardVersion: 'v2.1',
      completedSteps: 3,
      totalSteps: 4,
    },
    notificationPreferences: {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      productUpdates: true,
      promotionalEmails: false,
      emailChannel: true,
      pushChannel: false,
      smsChannel: false,
    },
    consentRecords: [
      {
        id: 'cst-201',
        purpose: 'DPDP Act 2023 Consent & Platform Terms',
        version: 'v2.0',
        consentedAt: 'Oct 08, 2026, 09:12 AM',
        ipAddress: '117.214.88.19',
        status: 'Granted',
      },
    ],
    privacySettings: {
      publicProfile: true,
      visibleToEmployers: true,
      allowSearchIndexing: false,
      publicProfileSlug: 'priya-nair-frontend',
      dataDownloadStatus: 'None',
    },
    savedJobIds: ['job-3002', 'job-3005'],
    linkedOAuthAccounts: [
      { provider: 'LinkedIn', email: 'priya.nair@devcraft.in', linkedAt: 'Oct 08, 2026', status: 'Connected' },
    ],
    loginHistory: [
      { id: 'log-201', timestamp: '46 min ago', ipAddress: '117.214.88.19', device: 'Firefox 130 / Ubuntu Linux', location: 'Kochi, India' },
      { id: 'log-202', timestamp: 'Oct 08, 2026', ipAddress: '117.214.88.19', device: 'Firefox 130 / Ubuntu Linux', location: 'Kochi, India' },
    ],
    staffNotes: [],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'Jest', 'Web Performance'],
    experience: [
      {
        role: 'Frontend Developer',
        company: 'WaveByte Solutions',
        duration: '2022 - Present · 3 yrs',
        description: 'Engineered responsive dashboard modules with React & TypeScript. Cut initial page load time by 42% through lazy loading and bundle splitting.',
      },
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Model Engineering College, Kochi',
        year: '2018 - 2022',
      },
    ],
    resume: {
      filename: 'Priya_Nair_Frontend_Dev.pdf',
      uploadedAt: 'Oct 8, 2026',
      size: '890 KB',
      atsScore: 86,
      summary: 'Frontend Engineer with 3 years building modern web apps in React and TypeScript. Passionate about accessibility, responsive design, and core web vitals.',
    },
    resumeVersions: [
      {
        id: 'res-v3',
        filename: 'Priya_Nair_Frontend_Dev.pdf',
        uploadedAt: 'Oct 8, 2026',
        size: '890 KB',
        atsScore: 86,
        templateId: 'tmpl-4',
        templateName: 'Minimalist Clean v2.0',
        isDefault: true,
        atsValidated: false,
        summary: 'Clean modern resume targeting React frontend positions with project portfolio links.',
      },
    ],
    applicationsHistory: [
      { id: 'app-904', jobTitle: 'Frontend Engineer', company: 'Cloudframe', appliedDate: 'Today, 9:20 AM', status: 'Shortlisted' },
      { id: 'app-905', jobTitle: 'UI Engineer (React)', company: 'Pioneer Talent', appliedDate: 'Sep 27, 2026', status: 'Interview' },
    ],
    auditLog: [
      { action: 'Account created via LinkedIn OAuth', timestamp: 'Oct 8, 2026', actor: 'System Auto' },
      { action: 'Uploaded resume v1.1', timestamp: 'Oct 8, 2026', actor: 'Candidate (Self)' },
    ],
  },
  {
    id: 'can-1003',
    name: 'Rohan Kapoor',
    headline: 'Data Platform Engineer',
    emailMasked: 'ro***@mail.com',
    emailFull: 'rohan.kapoor@clouddata.org',
    phoneMasked: '+91 98230 *****',
    phoneFull: '+91 98230 11982',
    location: 'Pune, MH',
    status: 'Active',
    completion: 88,
    source: 'Referral',
    lastActive: 'Today',
    pro: true,
    createdAt: '2026-06-12',
    isEmailVerified: true,
    openToRemote: false,
    visibleToEmployers: true,
    recruiterViewsCount: 35,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rohan-kapoor-data',
      github: 'https://github.com/rohankapoor-streaming',
    },
    onboarding: {
      careerGoal: 'Build distributed big data ingestion and streaming infrastructure for fintech platforms.',
      targetRoles: ['Data Platform Engineer', 'Senior Data Engineer', 'Kafka Systems Specialist'],
      preferredLocations: ['Pune, MH', 'Mumbai, MH'],
      workMode: 'On-site',
      wizardVersion: 'v2.1',
      completedSteps: 4,
      totalSteps: 4,
    },
    notificationPreferences: {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      productUpdates: true,
      promotionalEmails: false,
      emailChannel: true,
      pushChannel: true,
      smsChannel: false,
    },
    consentRecords: [
      {
        id: 'cst-301',
        purpose: 'DPDP Act 2023 Consent & Platform Terms',
        version: 'v2.0',
        consentedAt: 'Jun 12, 2026, 02:40 PM',
        ipAddress: '103.21.144.60',
        status: 'Granted',
      },
    ],
    privacySettings: {
      publicProfile: true,
      visibleToEmployers: true,
      allowSearchIndexing: true,
      publicProfileSlug: 'rohan-kapoor-data',
      dataDownloadStatus: 'Available',
    },
    savedJobIds: ['job-3003'],
    linkedOAuthAccounts: [
      { provider: 'Native', email: 'rohan.kapoor@clouddata.org', linkedAt: 'Jun 12, 2026', status: 'Connected' },
    ],
    loginHistory: [
      { id: 'log-301', timestamp: 'Today, 08:15 AM', ipAddress: '103.21.144.60', device: 'Chrome 128 / Windows 11', location: 'Pune, India' },
    ],
    staffNotes: [
      { id: 'sn-301', author: 'Devika Rao (Ops)', note: 'Identity verification completed with PAN card.', createdAt: 'Oct 3, 2026' },
    ],
    skills: ['Python', 'Apache Kafka', 'Spark', 'PostgreSQL', 'Airflow', 'AWS EMR', 'Snowflake', 'Docker'],
    experience: [
      {
        role: 'Senior Data Engineer',
        company: 'StreamScale Analytics',
        duration: '2021 - Present · 4 yrs',
        description: 'Maintained real-time Kafka streaming pipelines ingesting 100M+ events daily. Architected automated ETL DAGs in Airflow with zero data loss.',
      },
    ],
    education: [
      {
        degree: 'M.Sc. Data Science',
        institution: 'Pune Institute of Computer Technology',
        year: '2019 - 2021',
      },
    ],
    resume: {
      filename: 'Rohan_Kapoor_DataEngineer.pdf',
      uploadedAt: 'Oct 2, 2026',
      size: '1.1 MB',
      atsScore: 91,
      summary: 'Data Platform Engineer specializing in high-throughput distributed systems, Kafka streaming, and data lake architecture.',
    },
    resumeVersions: [
      {
        id: 'res-v4',
        filename: 'Rohan_Kapoor_DataEngineer.pdf',
        uploadedAt: 'Oct 2, 2026',
        size: '1.1 MB',
        atsScore: 91,
        templateId: 'tmpl-5',
        templateName: 'Compact Engineering v1.5',
        isDefault: true,
        atsValidated: true,
        summary: 'Dense engineering CV formatted for automated technical screeners with Spark & Kafka metrics.',
      },
    ],
    applicationsHistory: [
      { id: 'app-906', jobTitle: 'Data Platform Engineer', company: 'Cloudframe', appliedDate: 'Today, 8:15 AM', status: 'Interview' },
    ],
    auditLog: [
      { action: 'Upgraded to Resume Pro tier', timestamp: 'Oct 2, 2026', actor: 'Candidate (Self)' },
      { action: 'Identity verified with Govt ID', timestamp: 'Oct 3, 2026', actor: 'Admin: Devika Rao' },
    ],
  },
  {
    id: 'can-1004',
    name: 'Meera Iyer',
    headline: 'Customer Success Lead',
    emailMasked: 'me***@mail.com',
    emailFull: 'meera.iyer@connectcrm.in',
    phoneMasked: '+91 94440 *****',
    phoneFull: '+91 94440 76231',
    location: 'Chennai, TN',
    status: 'Suspended',
    completion: 64,
    source: 'Email',
    lastActive: 'Yesterday',
    pro: false,
    createdAt: '2026-08-14',
    isEmailVerified: true,
    openToRemote: false,
    visibleToEmployers: false,
    recruiterViewsCount: 8,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/meera-iyer-cs',
    },
    onboarding: {
      careerGoal: 'Direct customer success operations and customer retention in B2B SaaS.',
      targetRoles: ['Customer Success Manager', 'Customer Success Lead', 'Account Director'],
      preferredLocations: ['Chennai, TN', 'Bengaluru, KA'],
      workMode: 'Hybrid',
      wizardVersion: 'v2.0',
      completedSteps: 2,
      totalSteps: 4,
    },
    notificationPreferences: {
      jobAlerts: false,
      applicationUpdates: true,
      interviewReminders: true,
      messages: false,
      productUpdates: false,
      promotionalEmails: false,
      emailChannel: true,
      pushChannel: false,
      smsChannel: false,
    },
    consentRecords: [
      {
        id: 'cst-401',
        purpose: 'DPDP Act 2023 Consent & Platform Terms',
        version: 'v2.0',
        consentedAt: 'Aug 14, 2026',
        ipAddress: '122.178.44.10',
        status: 'Granted',
      },
    ],
    privacySettings: {
      publicProfile: false,
      visibleToEmployers: false,
      allowSearchIndexing: false,
      publicProfileSlug: 'meera-iyer-cs',
      dataDownloadStatus: 'Available',
    },
    deletionRequest: {
      requestedAt: 'Oct 10, 2026',
      slaDueDate: 'Nov 09, 2026 (24 days remaining)',
      status: 'Pending',
      reason: 'Candidate filed statutory DPDP Right to Erasure / GDPR Article 17 request.',
    },
    savedJobIds: ['job-3004'],
    linkedOAuthAccounts: [
      { provider: 'Native', email: 'meera.iyer@connectcrm.in', linkedAt: 'Aug 14, 2026', status: 'Connected' },
    ],
    loginHistory: [
      { id: 'log-401', timestamp: 'Yesterday, 11:20 AM', ipAddress: '122.178.44.10', device: 'Chrome 127 / Windows 10', location: 'Chennai, India' },
    ],
    staffNotes: [
      { id: 'sn-401', author: 'System Sentinel', note: 'Account suspended following flagged message report flg-701.', createdAt: 'Oct 9, 2026' },
      { id: 'sn-402', author: 'Privacy Officer', note: 'Statutory DSR export generated and awaiting final deletion confirmation.', createdAt: 'Oct 11, 2026' },
    ],
    skills: ['Customer Retention', 'SaaS Onboarding', 'Zendesk', 'HubSpot', 'Executive Escalations', 'NPS Analysis'],
    experience: [
      {
        role: 'Customer Success Manager',
        company: 'SaaSBridge Corp',
        duration: '2021 - 2025 · 4 yrs',
        description: 'Managed enterprise portfolios worth $2.4M ARR. Reduced churn by 18% through proactive quarterly business reviews.',
      },
    ],
    education: [
      {
        degree: 'BBA in Marketing',
        institution: 'Loyola College, Chennai',
        year: '2017 - 2020',
      },
    ],
    resume: {
      filename: 'Meera_Iyer_CS_Lead.pdf',
      uploadedAt: 'Aug 14, 2026',
      size: '620 KB',
      atsScore: 79,
      summary: 'Customer Success leader with 5 years experience driving enterprise retention, onboarding workflows, and client advocacy in B2B SaaS.',
    },
    resumeVersions: [
      {
        id: 'res-v5',
        filename: 'Meera_Iyer_CS_Lead.pdf',
        uploadedAt: 'Aug 14, 2026',
        size: '620 KB',
        atsScore: 79,
        templateId: 'tmpl-4',
        templateName: 'Minimalist Clean v2.0',
        isDefault: true,
        atsValidated: false,
        summary: 'Standard single-column customer advocacy resume.',
      },
    ],
    applicationsHistory: [
      { id: 'app-909', jobTitle: 'Customer Success Lead', company: 'BrightPath Careers', appliedDate: 'Oct 1, 2026', status: 'Rejected' },
    ],
    auditLog: [
      { action: 'Account suspended due to policy investigation flag', timestamp: 'Oct 9, 2026', actor: 'Admin: System Auto' },
      { action: 'Candidate filed GDPR deletion request', timestamp: 'Oct 10, 2026', actor: 'Candidate (Self)' },
    ],
  },
  {
    id: 'can-1005',
    name: 'Kabir Shah',
    headline: 'Growth Marketer',
    emailMasked: 'ka***@mail.com',
    emailFull: 'kabir.shah@growthpulse.co',
    phoneMasked: '+91 98670 *****',
    phoneFull: '+91 98670 99412',
    location: 'Mumbai, MH',
    status: 'Active',
    completion: 91,
    source: 'Google',
    lastActive: '2 hr ago',
    pro: false,
    createdAt: '2026-09-12',
    isEmailVerified: true,
    openToRemote: true,
    visibleToEmployers: true,
    recruiterViewsCount: 56,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/kabir-shah-growth',
      twitter: 'https://x.com/kabir_growth',
    },
    onboarding: {
      careerGoal: 'Drive full-funnel digital growth, paid acquisition, and product-led onboarding in Series A/B startups.',
      targetRoles: ['Growth Marketing Manager', 'Head of Performance', 'Demand Generation Lead'],
      preferredLocations: ['Mumbai, MH', 'Remote India'],
      workMode: 'Remote',
      wizardVersion: 'v2.1',
      completedSteps: 4,
      totalSteps: 4,
    },
    notificationPreferences: {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      productUpdates: true,
      promotionalEmails: true,
      emailChannel: true,
      pushChannel: true,
      smsChannel: true,
    },
    consentRecords: [
      {
        id: 'cst-501',
        purpose: 'DPDP Act 2023 Consent & Platform Terms',
        version: 'v2.0',
        consentedAt: 'Sep 12, 2026',
        ipAddress: '14.139.112.4',
        status: 'Granted',
      },
    ],
    privacySettings: {
      publicProfile: true,
      visibleToEmployers: true,
      allowSearchIndexing: true,
      publicProfileSlug: 'kabir-shah-growth',
      dataDownloadStatus: 'Available',
    },
    savedJobIds: ['job-3001', 'job-3006'],
    linkedOAuthAccounts: [
      { provider: 'Google', email: 'kabir.shah@growthpulse.co', linkedAt: 'Sep 12, 2026', status: 'Connected' },
    ],
    loginHistory: [
      { id: 'log-501', timestamp: '2 hr ago', ipAddress: '14.139.112.4', device: 'Chrome 128 / macOS 14.5', location: 'Mumbai, India' },
    ],
    staffNotes: [],
    skills: ['Paid Acquisition', 'SEO & SEM', 'Google Analytics 4', 'Mixpanel', 'Conversion Rate Optimization', 'Lifecycle Marketing'],
    experience: [
      {
        role: 'Growth Marketing Lead',
        company: 'ScaleRapid Ventures',
        duration: '2022 - Present · 3 yrs',
        description: 'Scaled monthly inbound pipeline by 140% while maintaining sub-$45 CAC across Meta and Google ads.',
      },
    ],
    education: [
      {
        degree: 'B.Com & Digital Marketing Certification',
        institution: 'Mithibai College, Mumbai',
        year: '2018 - 2021',
      },
    ],
    resume: {
      filename: 'Kabir_Shah_Growth_Marketer.pdf',
      uploadedAt: 'Sep 12, 2026',
      size: '950 KB',
      atsScore: 89,
      summary: 'Data-driven growth marketer experienced in B2B & consumer performance marketing, product analytics, and automated onboarding funnels.',
    },
    resumeVersions: [
      {
        id: 'res-v6',
        filename: 'Kabir_Shah_Growth_Marketer.pdf',
        uploadedAt: 'Sep 12, 2026',
        size: '950 KB',
        atsScore: 89,
        templateId: 'tmpl-1',
        templateName: 'Modern Split v2.4',
        isDefault: true,
        atsValidated: true,
        summary: 'Growth CV highlighting $80k-$120k ad-spend campaigns and multi-channel attribution setups.',
      },
    ],
    applicationsHistory: [
      { id: 'app-907', jobTitle: 'Growth Marketing Manager', company: 'Northstar Labs', appliedDate: 'Sep 28, 2026', status: 'Offered' },
    ],
    auditLog: [
      { action: 'Updated profile bio and portfolio links', timestamp: 'Oct 5, 2026', actor: 'Candidate (Self)' },
      { action: 'Profile reached 91% completion milestone', timestamp: 'Sep 14, 2026', actor: 'System Auto' },
    ],
  },
  {
    id: 'can-1006',
    name: 'Ananya Sen',
    headline: 'Staff Cloud Architect & DevOps Lead',
    emailMasked: 'an***@cloudscale.net',
    emailFull: 'ananya.sen@cloudscale.net',
    phoneMasked: '+91 99801 *****',
    phoneFull: '+91 99801 77210',
    location: 'Hyderabad, TS',
    status: 'Active',
    completion: 94,
    source: 'LinkedIn',
    lastActive: '34 min ago',
    pro: true,
    createdAt: '2026-09-30',
    isEmailVerified: true,
    openToRemote: true,
    visibleToEmployers: true,
    recruiterViewsCount: 68,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/ananya-sen-cloud',
      github: 'https://github.com/ananyasen-k8s',
    },
    onboarding: {
      careerGoal: 'Lead enterprise multi-region Kubernetes deployments, SRE architecture and zero-trust cloud transformations.',
      targetRoles: ['Staff Cloud Architect', 'Principal DevOps Architect', 'Head of Infrastructure'],
      preferredLocations: ['Hyderabad, TS', 'Bengaluru, KA', 'Remote'],
      workMode: 'Hybrid',
      wizardVersion: 'v2.1',
      completedSteps: 4,
      totalSteps: 4,
    },
    notificationPreferences: {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      productUpdates: false,
      promotionalEmails: false,
      emailChannel: true,
      pushChannel: true,
      smsChannel: true,
    },
    consentRecords: [
      {
        id: 'cst-601',
        purpose: 'DPDP Act 2023 Consent & Platform Terms',
        version: 'v2.0',
        consentedAt: 'Sep 30, 2026',
        ipAddress: '182.72.68.91',
        status: 'Granted',
      },
    ],
    privacySettings: {
      publicProfile: true,
      visibleToEmployers: true,
      allowSearchIndexing: true,
      publicProfileSlug: 'ananya-sen-cloud',
      dataDownloadStatus: 'Available',
    },
    savedJobIds: ['job-3007'],
    linkedOAuthAccounts: [
      { provider: 'LinkedIn', email: 'ananya.sen@cloudscale.net', linkedAt: 'Sep 30, 2026', status: 'Connected' },
    ],
    loginHistory: [
      { id: 'log-601', timestamp: '34 min ago', ipAddress: '182.72.68.91', device: 'Chrome 128 / macOS 14.5', location: 'Hyderabad, India' },
    ],
    staffNotes: [
      { id: 'sn-601', author: 'Rahul Sharma (Admin)', note: 'Completed GitHub & AWS credential verification.', createdAt: 'Oct 8, 2026' },
    ],
    skills: ['AWS Cloud', 'Terraform', 'Kubernetes', 'Microservices Architecture', 'Golang', 'SRE', 'CI/CD Pipelines'],
    experience: [
      {
        role: 'Lead Cloud Architect',
        company: 'CloudScale Labs',
        duration: '2022 - Present · 3 yrs',
        description: 'Architected multi-region Kubernetes clusters with 99.99% SLA. Automated immutable infrastructure provisioning with Terraform and GitOps.',
      },
      {
        role: 'Senior DevOps Engineer',
        company: 'InfoEdge India',
        duration: '2019 - 2022 · 3 yrs',
        description: 'Migrated monolithic workloads to microservices on AWS EKS, reducing cloud compute expenditures by $120,000 annually.',
      },
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Madras',
        year: '2015 - 2019',
      },
    ],
    resume: {
      filename: 'Ananya_Sen_Staff_Cloud_Architect.pdf',
      uploadedAt: 'Sep 30, 2026',
      size: '1.2 MB',
      atsScore: 96,
      summary: 'Staff Cloud Architect with 7+ years architecting enterprise distributed cloud architectures, Kubernetes clusters, and zero-trust security postures.',
    },
    resumeVersions: [
      {
        id: 'res-v7',
        filename: 'Ananya_Sen_Staff_Cloud_Architect.pdf',
        uploadedAt: 'Sep 30, 2026',
        size: '1.2 MB',
        atsScore: 96,
        templateId: 'tmpl-5',
        templateName: 'Compact Engineering v1.5',
        isDefault: true,
        atsValidated: true,
        summary: 'Production SRE & Cloud Architect CV verified across Workday and Taleo ATS parsers.',
      },
    ],
    applicationsHistory: [
      { id: 'app-908', jobTitle: 'Staff Cloud Architect', company: 'Zenith HealthTech', appliedDate: 'Oct 8, 2026', status: 'Interview' },
    ],
    auditLog: [
      { action: 'Completed identity & GitHub credentials verification', timestamp: 'Oct 8, 2026', actor: 'Admin: Rahul Sharma' },
      { action: 'Opted in to priority recruiter indexing', timestamp: 'Oct 1, 2026', actor: 'Candidate (Self)' },
    ],
  },
  {
    id: 'can-1007',
    name: 'Vikram Malhotra',
    headline: 'AI / Machine Learning Engineer',
    emailMasked: 'vi***@neuralbridge.ai',
    emailFull: 'vikram.malhotra@neuralbridge.ai',
    phoneMasked: '+91 98110 *****',
    phoneFull: '+91 98110 44521',
    location: 'Delhi NCR, DL',
    status: 'Pending',
    completion: 82,
    source: 'Google',
    lastActive: '1 day ago',
    pro: false,
    createdAt: '2026-10-05',
    isEmailVerified: true,
    openToRemote: true,
    visibleToEmployers: true,
    recruiterViewsCount: 22,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/vikram-malhotra-ai',
      github: 'https://github.com/v-malhotra-ml',
    },
    onboarding: {
      careerGoal: 'Develop production RAG agents, LLM inference backends, and distributed model pipelines.',
      targetRoles: ['AI / Machine Learning Engineer', 'MLOps Specialist', 'LLM Engineer'],
      preferredLocations: ['Delhi NCR, DL', 'Bengaluru, KA', 'Remote'],
      workMode: 'Hybrid',
      wizardVersion: 'v2.1',
      completedSteps: 3,
      totalSteps: 4,
    },
    notificationPreferences: {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      productUpdates: false,
      promotionalEmails: false,
      emailChannel: true,
      pushChannel: true,
      smsChannel: false,
    },
    consentRecords: [
      {
        id: 'cst-701',
        purpose: 'DPDP Act 2023 Consent & Platform Terms',
        version: 'v2.0',
        consentedAt: 'Oct 05, 2026',
        ipAddress: '182.68.21.14',
        status: 'Granted',
      },
    ],
    privacySettings: {
      publicProfile: true,
      visibleToEmployers: true,
      allowSearchIndexing: true,
      publicProfileSlug: 'vikram-malhotra-ai',
      dataDownloadStatus: 'Available',
    },
    duplicateSignals: [
      {
        duplicateCandidateId: 'can-1094',
        duplicateCandidateName: 'Vikram M. (Unverified)',
        matchScore: 92,
        reason: 'Identical phone hash (+91 98110 *****) & matching Delhi IP subnet (182.68.21.x)',
      },
    ],
    savedJobIds: ['job-3005'],
    linkedOAuthAccounts: [
      { provider: 'Google', email: 'vikram.malhotra@neuralbridge.ai', linkedAt: 'Oct 05, 2026', status: 'Connected' },
    ],
    loginHistory: [
      { id: 'log-701', timestamp: '1 day ago', ipAddress: '182.68.21.14', device: 'Chrome 128 / Windows 11', location: 'Delhi, India' },
    ],
    staffNotes: [
      { id: 'sn-701', author: 'Trust & Safety Caseworker', note: 'Potential duplicate profile flagged against can-1094. Review before verifying.', createdAt: 'Oct 6, 2026' },
    ],
    skills: ['Python', 'PyTorch', 'Large Language Models', 'FastAPI', 'MLOps', 'Vector Databases', 'LangChain'],
    experience: [
      {
        role: 'Machine Learning Engineer',
        company: 'NeuralBridge AI',
        duration: '2023 - Present · 2 yrs',
        description: 'Fine-tuned open-source LLMs for domain-specific contract analysis. Built low-latency inference endpoints serving 2M daily requests.',
      },
    ],
    education: [
      {
        degree: 'M.Tech in Artificial Intelligence',
        institution: 'IIT Delhi',
        year: '2021 - 2023',
      },
    ],
    resume: {
      filename: 'Vikram_Malhotra_MLEngineer.pdf',
      uploadedAt: 'Oct 5, 2026',
      size: '1.0 MB',
      atsScore: 89,
      summary: 'Machine learning engineer with hands-on expertise fine-tuning transformers, building RAG systems, and scaling MLOps pipelines on GPU clusters.',
    },
    resumeVersions: [
      {
        id: 'res-v8',
        filename: 'Vikram_Malhotra_MLEngineer.pdf',
        uploadedAt: 'Oct 5, 2026',
        size: '1.0 MB',
        atsScore: 89,
        templateId: 'tmpl-2',
        templateName: 'Tech Mono v1.8',
        isDefault: true,
        atsValidated: true,
        summary: 'AI / ML CV emphasizing GPU cluster inference latency benchmarks and open-weight model fine-tuning.',
      },
    ],
    applicationsHistory: [
      { id: 'app-905', jobTitle: 'Junior Product Analyst', company: 'Pioneer Talent', appliedDate: 'Oct 6, 2026', status: 'Applied' },
    ],
    auditLog: [
      { action: 'Submitted profile for review', timestamp: 'Oct 5, 2026', actor: 'Candidate (Self)' },
    ],
  },
];

export const adminEmployers: AdminEmployer[] = [
  {
    id: 'emp-2001',
    company: 'Northstar Labs',
    name: 'Isha Menon',
    emailMasked: 'is***@northstar.example',
    emailFull: 'isha.menon@northstarlabs.example',
    phoneMasked: '+91 80 4123 ****',
    location: 'Bengaluru, KA',
    verification: 'Verified',
    jobs: 18,
    plan: 'Scale',
    status: 'Active',
    joined: 'May 12',
    website: 'https://northstarlabs.example',
    industry: 'Technology & Cloud',
    size: '51-200 employees',
    about: 'Northstar Labs builds next-generation collaborative infrastructure and workflow automation tools for modern high-growth software teams.',
    cin: 'U72900KA2021PTC145620',
    gst: '29ABCDE1234F1Z5',
    documents: [
      { id: 'doc-1', name: 'Certificate_of_Incorporation_2021.pdf', type: 'Certificate of Incorporation', uploadDate: 'May 12, 2026', status: 'Verified', size: '2.4 MB' },
      { id: 'doc-2', name: 'GST_Registration_Certificate.pdf', type: 'GST Registration', uploadDate: 'May 12, 2026', status: 'Verified', size: '1.1 MB' },
      { id: 'doc-3', name: 'Authorized_Signatory_ID_Isha.pdf', type: 'Director Identity Proof', uploadDate: 'May 14, 2026', status: 'Verified', size: '840 KB' },
    ],
    teamMembers: [
      { id: 'tm-1', name: 'Isha Menon', role: 'Head of People & Ops', email: 'isha.menon@northstarlabs.example', status: 'Active' },
      { id: 'tm-2', name: 'Aditya Sen', role: 'Technical Recruiter', email: 'aditya.sen@northstarlabs.example', status: 'Active' },
      { id: 'tm-3', name: 'Pooja Hegde', role: 'Hiring Manager (Design)', email: 'pooja.hegde@northstarlabs.example', status: 'Active' },
    ],
    relatedJobs: [
      { id: 'job-3001', title: 'Senior Product Designer', location: 'Bengaluru, KA', workMode: 'Hybrid', status: 'Live', applicants: 84, posted: 'Today' },
      { id: 'job-3006', title: 'Growth Marketing Manager', location: 'Remote India', workMode: 'Remote', status: 'Expired', applicants: 112, posted: 'Sep 28' },
      { id: 'job-3011', title: 'Staff Backend Architect', location: 'Bengaluru, KA', workMode: 'Hybrid', status: 'Live', applicants: 45, posted: 'Oct 2' },
    ],
    subscriptionStanding: {
      plan: 'Scale Enterprise (Annual)',
      status: 'Active · Auto-renewing',
      renewalDate: 'May 12, 2027',
      billingCycle: 'Annual',
      amount: '₹3,40,000 / year',
    },
    onboarding: {
      step: 4,
      stepName: 'Start Hiring',
      stepStatus: 'Completed',
      lastActive: '25 min ago',
      dropOffWarning: undefined,
      draftSummary: 'All steps verified. ATS integration active, career portal published, Scale Enterprise plan active.',
      stepsCompleted: [1, 2, 3, 4],
      nudgeCount: 0,
    },
    logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=128&q=80',
    logoStatus: 'Verified',
    duplicateSignals: [
      { id: 'sig-1', matchedCompany: 'Northstar Labs India Pvt Ltd', matchConfidence: 94, matchedField: 'Corporate Domain & CIN', targetId: 'emp-2005' },
    ],
    staffNotes: [
      { id: 'sn-1', author: 'Rahul Sharma (Super Admin)', note: 'Completed MCA Certificate validation. Verified director DIN with MCA database.', createdAt: 'May 14, 2026' },
      { id: 'sn-2', author: 'Devika Rao (Talent Ops)', note: 'Assigned 5 complimentary job posting credits as part of Scale annual onboarding.', createdAt: 'May 16, 2026' },
    ],
    auditLog: [
      { id: 'al-1', actor: 'Admin: Rahul Sharma', timestamp: 'May 14, 2026, 11:30 AM', action: 'Employer Account Verified', reason: 'MCA and GSTIN documents approved' },
      { id: 'al-2', actor: 'System Auto', timestamp: 'May 12, 2026, 09:15 AM', action: 'Account Created & Onboarding Step 1 Completed' },
    ],
  },
  {
    id: 'emp-2002',
    company: 'Cloudframe',
    name: 'Vikram Sethi',
    emailMasked: 'vi***@cloudframe.example',
    emailFull: 'vikram.sethi@cloudframe.example',
    phoneMasked: '+91 20 6712 ****',
    location: 'Pune, MH',
    verification: 'Under review',
    jobs: 7,
    plan: 'Growth',
    status: 'Pending',
    joined: 'Aug 4',
    website: 'https://cloudframe.example',
    industry: 'Enterprise SaaS',
    size: '1-50 employees',
    about: 'Cloudframe provides automated compliance and vulnerability mapping software for multi-cloud enterprise deployments.',
    cin: 'U72200PN2023PTC189211',
    gst: '27AABCC5544K1ZR',
    documents: [
      { id: 'doc-4', name: 'Cloudframe_CIN_Incorporation.pdf', type: 'Certificate of Incorporation', uploadDate: 'Aug 4, 2026', status: 'Under review', size: '1.8 MB' },
      { id: 'doc-5', name: 'Tax_Registration_GST_Certificate.pdf', type: 'GST Registration', uploadDate: 'Aug 4, 2026', status: 'Under review', size: '920 KB' },
    ],
    teamMembers: [
      { id: 'tm-4', name: 'Vikram Sethi', role: 'Co-founder & CEO', email: 'vikram.sethi@cloudframe.example', status: 'Active' },
      { id: 'tm-5', name: 'Sonal Verma', role: 'Talent Lead', email: 'sonal.verma@cloudframe.example', status: 'Invited' },
    ],
    relatedJobs: [
      { id: 'job-3002', title: 'Frontend Engineer', location: 'Remote India', workMode: 'Remote', status: 'Pending', applicants: 12, posted: '46 min ago' },
      { id: 'job-3003', title: 'Data Platform Engineer', location: 'Pune, MH', workMode: 'Hybrid', status: 'Pending', applicants: 27, posted: '2 hr ago' },
    ],
    subscriptionStanding: {
      plan: 'Growth Tier (Monthly)',
      status: 'Active (Trial Period)',
      renewalDate: 'Nov 4, 2026',
      billingCycle: 'Monthly',
      amount: '₹24,999 / month',
    },
    onboarding: {
      step: 3,
      stepName: 'Verification',
      stepStatus: 'In progress',
      lastActive: 'Yesterday, 4:15 PM',
      dropOffWarning: 'Awaiting admin review: 2 statutory documents submitted.',
      draftSummary: 'CIN incorporation & GST certificate uploaded. Team seats allocated; awaiting compliance review.',
      stepsCompleted: [1, 2],
      nudgeCount: 0,
    },
  },
  {
    id: 'emp-2003',
    company: 'Pioneer Talent',
    name: 'Neha Arora',
    emailMasked: 'ne***@pioneer.example',
    emailFull: 'neha.arora@pioneer.example',
    phoneMasked: '+91 11 4981 ****',
    location: 'Delhi, DL',
    verification: 'Need info',
    jobs: 3,
    plan: 'Starter',
    status: 'Active',
    joined: 'Sep 18',
    website: 'https://pioneertalent.example',
    industry: 'Recruitment & Staffing',
    size: '11-50 employees',
    about: 'Boutique talent advisory and recruitment partner connecting tier-1 tech talent with fast-growing venture backed startups.',
    cin: 'U74999DL2022PTC199812',
    gst: '07AAECP1122D1Z9',
    documents: [
      { id: 'doc-6', name: 'Pioneer_Incorporation_Doc.pdf', type: 'Certificate of Incorporation', uploadDate: 'Sep 18, 2026', status: 'Verified', size: '1.2 MB' },
      { id: 'doc-7', name: 'Bank_Statement_Verification.pdf', type: 'Bank Statement / Address Proof', uploadDate: 'Sep 20, 2026', status: 'Rejected', size: '1.4 MB' },
    ],
    teamMembers: [
      { id: 'tm-6', name: 'Neha Arora', role: 'Managing Partner', email: 'neha.arora@pioneer.example', status: 'Active' },
    ],
    relatedJobs: [
      { id: 'job-3005', title: 'Junior Product Analyst', location: 'Delhi, DL', workMode: 'Hybrid', status: 'Draft', applicants: 0, posted: 'Oct 5' },
    ],
    subscriptionStanding: {
      plan: 'Starter Plan',
      status: 'Active',
      renewalDate: 'Oct 18, 2026',
      billingCycle: 'Monthly',
      amount: '₹9,999 / month',
    },
    onboarding: {
      step: 3,
      stepName: 'Verification',
      stepStatus: 'Stuck',
      lastActive: '4 days ago',
      dropOffWarning: 'Stall alert: Bank statement proof rejected on Oct 10. Resubmission pending for 4 days.',
      isStalled: true,
      draftSummary: 'Incorporation cert passed. Registered address utility bill rejected due to name mismatch. Action needed from employer.',
      stepsCompleted: [1, 2],
      nudgeCount: 1,
      lastNudgeDate: 'Oct 11, 2026',
    },
  },
  {
    id: 'emp-2004',
    company: 'Vertex Works',
    name: 'Amit Rao',
    emailMasked: 'am***@vertex.example',
    emailFull: 'amit.rao@vertex.example',
    phoneMasked: '+91 40 4012 ****',
    location: 'Hyderabad, TS',
    verification: 'Rejected',
    jobs: 0,
    plan: 'Starter',
    status: 'Suspended',
    joined: 'Oct 1',
    website: 'https://vertexworks.example',
    industry: 'Business Process Outsourcing',
    size: '1-10 employees',
    about: 'Back-office operations and tele-outreach provider.',
    cin: 'U72900TG2024PTC192001',
    gst: '36AAECV9988C1Z1',
    documents: [
      { id: 'doc-8', name: 'Submitted_Trade_License.pdf', type: 'Trade License', uploadDate: 'Oct 1, 2026', status: 'Rejected', size: '750 KB' },
    ],
    teamMembers: [
      { id: 'tm-7', name: 'Amit Rao', role: 'Founder', email: 'amit.rao@vertex.example', status: 'Active' },
    ],
    relatedJobs: [],
    subscriptionStanding: {
      plan: 'Starter Plan (Suspended)',
      status: 'Suspended / Action Required',
      renewalDate: 'N/A',
      billingCycle: 'Monthly',
      amount: '₹0 (Frozen)',
    },
    onboarding: {
      step: 1,
      stepName: 'Company Profile',
      stepStatus: 'Stuck',
      lastActive: '11 days ago',
      dropOffWarning: 'Drop-off warning: Inactive for 11 days after business trade license failed validation. Corporate domain unverified.',
      isStalled: true,
      draftSummary: 'Basic company info saved (168/1000 char bio). Trade license upload rejected; GSTIN unconfirmed.',
      stepsCompleted: [],
      nudgeCount: 2,
      lastNudgeDate: 'Oct 7, 2026',
    },
  },
  {
    id: 'emp-2005',
    company: 'BrightPath Careers',
    name: 'Sana Qureshi',
    emailMasked: 'sa***@brightpath.example',
    emailFull: 'sana.qureshi@brightpath.example',
    phoneMasked: '+91 22 2890 ****',
    location: 'Remote India',
    verification: 'Verified',
    jobs: 11,
    plan: 'Scale',
    status: 'Active',
    joined: 'Jun 22',
    website: 'https://brightpath.example',
    industry: 'EdTech & Career Advisory',
    size: '100-300 employees',
    about: 'Empowering fresh graduates and early career professionals with tailored vocational programs, interview bootcamps, and career placement.',
    cin: 'U80900MH2020PTC132994',
    gst: '27AABCB9123M1Z2',
    documents: [
      { id: 'doc-9', name: 'BrightPath_Registration_Certificate.pdf', type: 'Certificate of Incorporation', uploadDate: 'Jun 22, 2026', status: 'Verified', size: '2.1 MB' },
      { id: 'doc-10', name: 'GST_Certificate_Certified.pdf', type: 'GST Registration', uploadDate: 'Jun 22, 2026', status: 'Verified', size: '1.3 MB' },
    ],
    teamMembers: [
      { id: 'tm-8', name: 'Sana Qureshi', role: 'VP of Talent Acquisition', email: 'sana.qureshi@brightpath.example', status: 'Active' },
      { id: 'tm-9', name: 'Kunal Jain', role: 'Senior Recruiter', email: 'kunal.jain@brightpath.example', status: 'Active' },
    ],
    relatedJobs: [
      { id: 'job-3004', title: 'Customer Success Lead', location: 'Mumbai, MH', workMode: 'On site', status: 'Paused', applicants: 49, posted: 'Yesterday' },
    ],
    subscriptionStanding: {
      plan: 'Scale Enterprise (Annual)',
      status: 'Active · Good standing',
      renewalDate: 'Jun 22, 2027',
      billingCycle: 'Annual',
      amount: '₹2,80,000 / year',
    },
    onboarding: {
      step: 4,
      stepName: 'Start Hiring',
      stepStatus: 'Completed',
      lastActive: 'Yesterday, 11:30 AM',
      dropOffWarning: undefined,
      draftSummary: 'All verification checks cleared. Team workspace initialized with 2 recruiters active.',
      stepsCompleted: [1, 2, 3, 4],
      nudgeCount: 0,
    },
  },
  {
    id: 'emp-2006',
    company: 'Zenith HealthTech',
    name: 'Dr. Arishta Saxena',
    emailMasked: 'ar***@zenithhealth.example',
    emailFull: 'arishta.saxena@zenithhealth.example',
    phoneMasked: '+91 80 2899 ****',
    location: 'Bengaluru, KA',
    verification: 'Verified',
    jobs: 5,
    plan: 'Growth',
    status: 'Active',
    joined: 'Jul 19',
    website: 'https://zenithhealth.example',
    industry: 'Healthcare & Biotech',
    size: '201-500 employees',
    about: 'Zenith HealthTech develops interoperable electronic health records, AI-assisted clinical diagnostic workflows, and tele-consultation infrastructure.',
    cin: 'U85100KA2021PTC152890',
    gst: '29AAACZ9876Q1Z0',
    documents: [
      { id: 'doc-11', name: 'Zenith_Health_Incorporation.pdf', type: 'Certificate of Incorporation', uploadDate: 'Jul 19, 2026', status: 'Verified', size: '2.8 MB' },
      { id: 'doc-12', name: 'Medical_Devices_Compliance_ISO13485.pdf', type: 'Quality & Regulatory Certificate', uploadDate: 'Jul 20, 2026', status: 'Verified', size: '3.4 MB' },
      { id: 'doc-13', name: 'GST_Certificate_KA.pdf', type: 'GST Registration', uploadDate: 'Jul 19, 2026', status: 'Verified', size: '1.2 MB' },
    ],
    teamMembers: [
      { id: 'tm-10', name: 'Dr. Arishta Saxena', role: 'VP of Technology & Talent', email: 'arishta.saxena@zenithhealth.example', status: 'Active' },
      { id: 'tm-11', name: 'Devendra Joshi', role: 'Senior Talent Partner', email: 'devendra.joshi@zenithhealth.example', status: 'Active' },
    ],
    relatedJobs: [
      { id: 'job-3007', title: 'Staff Cloud Architect', location: 'Bengaluru, KA', workMode: 'Hybrid', status: 'Live', applicants: 38, posted: 'Oct 8' },
    ],
    subscriptionStanding: {
      plan: 'Growth Tier (Annual)',
      status: 'Active · Good standing',
      renewalDate: 'Jul 19, 2027',
      billingCycle: 'Annual',
      amount: '₹2,49,990 / year',
    },
    onboarding: {
      step: 2,
      stepName: 'Team & Billing',
      stepStatus: 'In progress',
      lastActive: '3 hours ago',
      dropOffWarning: undefined,
      draftSummary: 'Company profile verified. 2 recruiter seats configured; pending payment gateway mandate approval.',
      stepsCompleted: [1],
      nudgeCount: 0,
    },
  },
];

export const adminJobs: AdminJob[] = [
  {
    id: 'job-3001',
    title: 'Senior Product Designer',
    company: 'Northstar Labs',
    location: 'Bengaluru, KA',
    workMode: 'Hybrid',
    type: 'Full time',
    status: 'Live',
    posted: 'Today',
    applicants: 84,
    salaryRange: '₹24,00,000 - ₹34,00,000 PA',
    description: 'We are seeking an experienced Senior Product Designer to spearhead the user experience for Northstar Labs enterprise workflow automation suite. You will partner directly with engineering leaders and product directors to craft seamless, responsive experiences across desktop and mobile.',
    responsibilities: [
      'Lead product discovery and translate complex business processes into clear, intuitive interaction patterns.',
      'Maintain, evolve, and document the Northstar design system token library in Figma.',
      'Conduct generative user interviews and rapid prototype testing with global enterprise customers.',
      'Collaborate closely with frontend engineers to ensure design fidelity and responsive polish.',
    ],
    requirements: [
      '5+ years of demonstrable product design experience in B2B SaaS or developer tools.',
      'Deep expertise in Figma, modern design systems, wireframing, and interactive prototyping.',
      'Strong portfolio showcasing problem definition, UX research, and shipped business outcomes.',
      'Excellent verbal and written communication skills with experience presenting to leadership.',
    ],
    benefits: [
      'Comprehensive Health & Family Insurance (₹10L coverage)',
      'Flexible Hybrid Working (2 days in-office in Indiranagar, Bengaluru)',
      'Annual Learning & Conference Stipend (₹75,000)',
      'Ergonomic Home Office Setup Allowance (₹40,000)',
      'Competitive Stock Options (ESOPs)',
    ],
    applicantBreakdown: {
      applied: 48,
      screening: 21,
      interview: 11,
      offered: 3,
      rejected: 1,
    },
    moderationHistory: [
      { date: 'Today, 10:00 AM', reviewer: 'Devika Rao', decision: 'Approved', note: 'Verified company credentials, compensation range meets guidelines, no compliance red flags.' },
      { date: 'Yesterday, 6:30 PM', reviewer: 'System Auto', decision: 'Auto-scanned', note: 'Passed automated duplicate check and zero prohibited keywords.' },
    ],
    duplicateSignals: [
      { id: 'dsig-1', matchedJobId: 'job-3011', matchedTitle: 'Senior UX / Product Designer (Design Systems)', matchedCompany: 'Northstar Labs', matchConfidence: 91 },
    ],
    sponsoredConfig: {
      isSponsored: true,
      startDate: 'Oct 10, 2026',
      endDate: 'Oct 24, 2026',
      durationDays: 14,
      impressionCap: 50000,
      impressionsServed: 32410,
    },
    atsFeed: {
      feedId: 'IMP-992',
      source: 'Workday API (Enterprise Sync)',
      lastSync: 'Today, 10:00 AM',
      syncStatus: 'Success',
      errorCount: 0,
      errorLog: [
        '[10:00:12] Initiating Workday XML sync for Northstar Labs',
        '[10:00:15] Validated 18 requisitions against PRD compensation rules',
        '[10:00:18] Sync completed with 0 mapping conflicts',
      ],
    },
  },
  {
    id: 'job-3002',
    title: 'Frontend Engineer',
    company: 'Cloudframe',
    location: 'Remote India',
    workMode: 'Remote',
    type: 'Full time',
    status: 'Pending',
    posted: '46 min ago',
    applicants: 12,
    salaryRange: '₹16,00,000 - ₹22,00,000 PA',
    description: 'Cloudframe is looking for a skilled Frontend Engineer to architect high-performance dashboards, real-time alerting interfaces, and cloud security monitoring consoles using React 19, TypeScript, and Tailwind CSS.',
    responsibilities: [
      'Build reusable, accessible, and performant UI components using React and TypeScript.',
      'Integrate with GraphQL and REST APIs with optimistic state updates and cache invalidation.',
      'Optimize web performance, Core Web Vitals, and client-side rendering speeds.',
      'Write comprehensive unit and integration tests using Jest and Playwright.',
    ],
    requirements: [
      '3+ years of professional web application engineering with React and TypeScript.',
      'Solid command of CSS architecture, Tailwind, and responsive layout primitives.',
      'Experience with state management libraries (Redux Toolkit, Zustand, or TanStack Query).',
      'Familiarity with CI/CD deployment pipelines and git workflows.',
    ],
    benefits: [
      '100% Remote-first work culture anywhere in India',
      'MacBook Pro M3 provided upon joining',
      'Monthly High-speed Internet Reimbursement',
      'Group Medical & Accidental Insurance coverage',
    ],
    applicantBreakdown: {
      applied: 8,
      screening: 3,
      interview: 1,
      offered: 0,
      rejected: 0,
    },
    moderationHistory: [
      { date: '46 min ago', reviewer: 'System Auto', decision: 'Pending Review', note: 'Held in moderation queue awaiting first manual admin approval since employer is Under review.' },
    ],
  },
  {
    id: 'job-3003',
    title: 'Data Platform Engineer',
    company: 'Cloudframe',
    location: 'Pune, MH',
    workMode: 'Hybrid',
    type: 'Full time',
    status: 'Pending',
    posted: '2 hr ago',
    applicants: 27,
    flagged: true,
    salaryRange: '₹20,00,000 - ₹28,00,000 PA',
    description: 'We need an experienced Data Platform Engineer to design and scale our real-time streaming pipelines, Kafka clusters, and data warehouse infrastructure powering enterprise audit logs.',
    responsibilities: [
      'Design, construct, and maintain scalable streaming data pipelines using Apache Kafka and Spark.',
      'Manage data warehouse models in Snowflake and ClickHouse for low-latency queries.',
      'Implement data governance, role-based access control, and schema registry standards.',
    ],
    requirements: [
      '4+ years of data engineering experience with Python, Scala, or Java.',
      'Hands-on experience with Kafka, Spark, and cloud data warehouses.',
      'Strong SQL querying and query optimization skills.',
    ],
    benefits: [
      'Health Insurance for self and dependents',
      'Performance-linked annual bonus',
      'Catered meals at Pune Innovation Center',
    ],
    applicantBreakdown: {
      applied: 16,
      screening: 7,
      interview: 3,
      offered: 1,
      rejected: 0,
    },
    moderationHistory: [
      { date: '2 hr ago', reviewer: 'Safety Casework Filter', decision: 'Flagged for Review', note: 'Flagged: external link in job description redirected to third-party form. Requires moderator check.' },
    ],
  },
  {
    id: 'job-3004',
    title: 'Customer Success Lead',
    company: 'BrightPath Careers',
    location: 'Mumbai, MH',
    workMode: 'On site',
    type: 'Full time',
    status: 'Paused',
    posted: 'Yesterday',
    applicants: 49,
    salaryRange: '₹14,00,000 - ₹18,00,000 PA',
    description: 'BrightPath Careers is hiring a Customer Success Lead to champion student outcomes, corporate client onboarding, and candidate career satisfaction.',
    responsibilities: [
      'Oversee the post-enrollment lifecycle for enrolled students and enterprise hiring partners.',
      'Lead a team of 4 student success specialists handling daily queries and interview preparations.',
      'Drive customer NPS, satisfaction scores, and referral rates.',
    ],
    requirements: [
      '4+ years in customer success, account management, or educational operations.',
      'Demonstrated experience handling VIP customer escalations and executive communications.',
      'Proficiency with Zendesk, HubSpot, and Google Workspace.',
    ],
    benefits: [
      'Annual Performance Incentives',
      'Mediclaim Policy for family',
      'Centrally located Bandra Kurla Complex office',
    ],
    applicantBreakdown: {
      applied: 24,
      screening: 15,
      interview: 7,
      offered: 2,
      rejected: 1,
    },
    moderationHistory: [
      { date: 'Yesterday, 3:00 PM', reviewer: 'Rahul Sharma', decision: 'Approved', note: 'Listing approved and published.' },
      { date: 'Today, 8:00 AM', reviewer: 'Employer (Sana Qureshi)', decision: 'Paused', note: 'Employer paused listing due to applicant interview backlog.' },
    ],
  },
  {
    id: 'job-3005',
    title: 'Junior Product Analyst',
    company: 'Pioneer Talent',
    location: 'Delhi, DL',
    workMode: 'Hybrid',
    type: 'Internship',
    status: 'Draft',
    posted: 'Oct 5',
    applicants: 0,
    salaryRange: '₹35,000 - ₹45,000 / month Stipend',
    description: 'Looking for an enthusiastic Junior Product Analyst intern with strong analytical aptitude and passion for tech recruiting metrics.',
    responsibilities: [
      'Analyze hiring pipeline data and generate weekly candidate conversion dashboards.',
      'Assist senior recruiters in sourcing and market mapping.',
    ],
    requirements: [
      'Graduate in Business, Statistics, or Computer Science.',
      'Proficiency in Microsoft Excel / Google Sheets and basic SQL.',
    ],
    benefits: [
      'Pre-Placement Offer (PPO) opportunity upon successful internship completion',
      'Mentorship from seasoned talent partners',
    ],
    applicantBreakdown: {
      applied: 0,
      screening: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
    },
    moderationHistory: [
      { date: 'Oct 5, 2026', reviewer: 'Employer (Draft)', decision: 'Draft Saved', note: 'Saved as draft by Neha Arora. Not yet submitted for moderation.' },
    ],
  },
  {
    id: 'job-3006',
    title: 'Growth Marketing Manager',
    company: 'Northstar Labs',
    location: 'Remote India',
    workMode: 'Remote',
    type: 'Contract',
    status: 'Expired',
    posted: 'Sep 28',
    applicants: 112,
    salaryRange: '₹18,00,000 - ₹25,00,000 PA',
    description: 'Northstar Labs 6-month contract role for an aggressive Growth Marketing Manager to scale our self-serve product trials globally.',
    responsibilities: [
      'Manage paid search and social campaigns across Google Ads, LinkedIn, and Meta.',
      'A/B test landing page copy and user conversion funnels.',
    ],
    requirements: [
      '4+ years B2B SaaS growth marketing experience.',
      'Expertise in GA4, Mixpanel, and HubSpot.',
    ],
    benefits: [
      'Flexible working hours',
      'Contract completion bonus',
    ],
    applicantBreakdown: {
      applied: 68,
      screening: 28,
      interview: 12,
      offered: 2,
      rejected: 2,
    },
    moderationHistory: [
      { date: 'Sep 28, 2026', reviewer: 'Devika Rao', decision: 'Approved', note: 'Verified and approved.' },
      { date: 'Oct 12, 2026', reviewer: 'System Auto', decision: 'Expired', note: 'Posting expired after 30-day listing duration.' },
    ],
  },
  {
    id: 'job-3007',
    title: 'Staff Cloud Architect',
    company: 'Zenith HealthTech',
    location: 'Bengaluru, KA',
    workMode: 'Hybrid',
    type: 'Full time',
    status: 'Live',
    posted: 'Oct 8',
    applicants: 38,
    salaryRange: '₹32,00,000 - ₹45,00,000 PA',
    description: 'Zenith HealthTech is looking for an experienced Staff Cloud Architect to guide our HIPAA & ISO-compliant healthcare data platforms on AWS and Kubernetes.',
    responsibilities: [
      'Lead infrastructure architecture for mission-critical, HIPAA-compliant patient health records services.',
      'Design automated multi-account AWS Landing Zone architecture using Terraform.',
      'Mentor senior DevOps engineers in site reliability engineering best practices and chaos engineering.',
    ],
    requirements: [
      '7+ years of hands-on cloud architecture and DevOps engineering experience.',
      'Expertise in AWS, Terraform, Docker, Kubernetes, and Golang or Python.',
      'Previous experience with healthcare compliance (HIPAA, DISHA, or GDPR) is strongly preferred.',
    ],
    benefits: [
      'Comprehensive Medical Cover including dependent parents (₹15L coverage)',
      'Flexible hybrid schedule (2 days in office at Electronic City, Bengaluru)',
      'Quarterly executive retention bonuses',
      'Continuous education and cloud certification sponsorship',
    ],
    applicantBreakdown: {
      applied: 20,
      screening: 10,
      interview: 6,
      offered: 2,
      rejected: 0,
    },
    moderationHistory: [
      { date: 'Oct 8, 2026', reviewer: 'Rahul Sharma', decision: 'Approved', note: 'Verified healthcare credentials and compensation scale. Listing cleared for production.' },
    ],
  },
];

export const adminJobConsistencyIssues: JobConsistencyIssue[] = [
  {
    id: 'chk-101',
    jobId: 'job-3002',
    jobTitle: 'Frontend Engineer',
    company: 'Cloudframe',
    issueType: 'Work Mode Mismatch',
    currentValue: 'Remote',
    problemDescription: 'Job header states "Remote India", but description mandates "In-person Pune office presence 3 days/week for sprint planning and physical architecture reviews".',
    fieldChecked: 'workMode vs. description',
    severity: 'High',
    status: 'Unresolved',
    detectedDate: 'Today, 10:15 AM',
  },
  {
    id: 'chk-102',
    jobId: 'job-3005',
    jobTitle: 'Junior Product Analyst',
    company: 'Pioneer Talent',
    issueType: 'Salary Formatting Anomaly',
    currentValue: '₹35,000 - ₹45,000 / month Stipend',
    problemDescription: 'Monthly stipend entered under annual CTC database column. Breaks platform salary filter and search ranking (expected standardized LPA range: ₹4.2L - ₹5.4L PA).',
    fieldChecked: 'salaryRange format',
    severity: 'Medium',
    status: 'Unresolved',
    detectedDate: 'Oct 6, 2026',
  },
  {
    id: 'chk-103',
    jobId: 'job-3007',
    jobTitle: 'Staff Cloud Architect',
    company: 'Zenith HealthTech',
    issueType: 'Expired Jobs',
    currentValue: 'Status: Live (Expired Oct 11)',
    problemDescription: 'Configured application cutoff date (Oct 11, 2026) has lapsed, but job listing remains in "Live" status accepting active submissions.',
    fieldChecked: 'status vs. expiryDeadline',
    severity: 'High',
    status: 'Unresolved',
    detectedDate: 'Yesterday, 11:30 PM',
  },
  {
    id: 'chk-104',
    jobId: 'job-3003',
    jobTitle: 'Data Platform Engineer',
    company: 'Cloudframe',
    issueType: 'Location Conflict',
    currentValue: 'Location: Pune, MH',
    problemDescription: 'Location listed as "Pune, MH (Hybrid)", but section 3 requirements state candidates must reside in Karnataka or Telangana for client compliance.',
    fieldChecked: 'location vs. requirements',
    severity: 'Medium',
    status: 'Under review',
    detectedDate: 'Yesterday, 3:45 PM',
  },
  {
    id: 'chk-105',
    jobId: 'job-3001',
    jobTitle: 'Senior Product Designer',
    company: 'Northstar Labs',
    issueType: 'Salary Formatting Anomaly',
    currentValue: '₹24,00,000 - ₹34,00,000 PA',
    problemDescription: 'Upper bound exceeds benchmark band for "Senior Product Designer" (indiranagar tier-1) by 42% without executive compensation badge.',
    fieldChecked: 'salaryRange vs. marketBenchmark',
    severity: 'Low',
    status: 'Unresolved',
    detectedDate: 'Oct 12, 2026',
  },
  {
    id: 'chk-106',
    jobId: 'job-3004',
    jobTitle: 'Customer Success Lead',
    company: 'BrightPath Careers',
    issueType: 'Seniority Discrepancy',
    currentValue: 'Title: Lead vs Exp: Entry-level',
    problemDescription: 'Job title denotes leadership role ("Lead"), but requirements specify "0-1 years fresh graduate" entry qualification.',
    fieldChecked: 'title vs. experienceRequirements',
    severity: 'Medium',
    status: 'Resolved',
    detectedDate: 'Oct 10, 2026',
    resolvedAt: 'Oct 11, 2026',
    resolutionNote: 'Employer updated requirements to 4+ years experience.',
  },
];

export const adminApplications: AdminApplicationDetail[] = [
  {
    id: 'app-901',
    recordTitle: 'Aarav Mehta → Senior Product Designer',
    candidateName: 'Aarav Mehta',
    candidateHeadline: 'Senior Product Designer',
    candidateEmailMasked: 'aa***@mail.com',
    candidatePhoneMasked: '+91 98765 *****',
    candidateLocation: 'Bengaluru, KA',
    jobTitle: 'Senior Product Designer',
    company: 'Northstar Labs',
    jobLocation: 'Bengaluru, KA (Hybrid)',
    workMode: 'Hybrid',
    appliedDate: 'Today, 10:14 AM (2 hours ago)',
    status: 'Applied',
    stage: 'Applied',
    currentStep: 1,
    totalSteps: 5,
    currentRound: 1,
    totalRounds: 3,
    resume: {
      filename: 'Aarav_Mehta_Product_Designer_CV.pdf',
      size: '1.4 MB',
      atsScore: 94,
      summary: '6+ years leading B2B product UX, design systems, and rapid prototyping in high-growth tech environments.',
    },
    coverLetter: 'Dear Northstar Labs Hiring Team,\n\nI have followed Northstar Labs journey in building developer-centric workflow tools and am excited to apply for the Senior Product Designer role. Having scaled the design system at FinStack Technologies from scratch and boosted merchant onboarding conversion by 34%, I would love to bring my systems thinking and user-centric approach to your team.',
    screeningQuestions: [
      { question: 'What is your current notice period?', answer: '15 days (negotiable)' },
      { question: 'Do you have experience managing enterprise Figma tokens and component libraries?', answer: 'Yes, I led our cross-platform design token migration across Web and iOS.' },
      { question: 'Are you comfortable working 2 days/week from the Indiranagar, Bengaluru office?', answer: 'Yes, I am locally based in Indiranagar, Bengaluru.' },
    ],
    feedbackNotes: [
      { author: 'Isha Menon', role: 'Head of People', date: 'Today, 11:30 AM', rating: 5, note: 'Strong portfolio presentation. High ATS match score. Recommend advancing to Screening call.' },
    ],
    timeline: [
      { event: 'Application submitted through JobRisers portal', timestamp: 'Today, 10:14 AM', actor: 'Candidate: Aarav Mehta' },
      { event: 'Automated ATS parsing score calculated: 94%', timestamp: 'Today, 10:15 AM', actor: 'System Auto' },
      { event: 'Application viewed by Northstar Labs hiring team', timestamp: 'Today, 11:20 AM', actor: 'Recruiter: Isha Menon' },
    ],
  },
  {
    id: 'app-904',
    recordTitle: 'Priya Nair → Frontend Engineer',
    candidateName: 'Priya Nair',
    candidateHeadline: 'Frontend Engineer',
    candidateEmailMasked: 'pr***@mail.com',
    candidatePhoneMasked: '+91 97451 *****',
    candidateLocation: 'Kochi, KL',
    jobTitle: 'Frontend Engineer',
    company: 'Cloudframe',
    jobLocation: 'Remote India',
    workMode: 'Remote',
    appliedDate: 'Today, 9:20 AM (46 min ago)',
    status: 'Shortlisted',
    stage: 'Screening',
    currentStep: 2,
    totalSteps: 4,
    currentRound: 1,
    totalRounds: 2,
    resume: {
      filename: 'Priya_Nair_Frontend_Dev.pdf',
      size: '890 KB',
      atsScore: 86,
      summary: '3 years experience building responsive, fast web interfaces in React, TypeScript, and modern CSS.',
    },
    coverLetter: 'Hi Cloudframe Team,\n\nI am applying for the Frontend Engineer position. I have been building data-heavy interfaces in React & TypeScript at WaveByte Solutions and cut initial bundle load by 42%. I am eager to contribute to Cloudframe security dashboards.',
    screeningQuestions: [
      { question: 'How many years of commercial experience do you have with TypeScript?', answer: '3 years' },
      { question: 'Have you worked with remote agile teams previously?', answer: 'Yes, fully remote for the last 2 years across Indian and APAC timezones.' },
    ],
    feedbackNotes: [
      { author: 'Vikram Sethi', role: 'Co-founder', date: 'Today, 9:50 AM', rating: 4, note: 'Promising engineering background. Good GitHub contributions.' },
    ],
    timeline: [
      { event: 'Application submitted by candidate', timestamp: 'Today, 9:20 AM', actor: 'Candidate: Priya Nair' },
      { event: 'Candidate shortlisted by Recruiter', timestamp: 'Today, 9:50 AM', actor: 'Recruiter: Vikram Sethi' },
    ],
  },
  {
    id: 'app-906',
    recordTitle: 'Rohan Kapoor → Data Platform Engineer',
    candidateName: 'Rohan Kapoor',
    candidateHeadline: 'Data Platform Engineer',
    candidateEmailMasked: 'ro***@mail.com',
    candidatePhoneMasked: '+91 98230 *****',
    candidateLocation: 'Pune, MH',
    jobTitle: 'Data Platform Engineer',
    company: 'Cloudframe',
    jobLocation: 'Pune, MH (Hybrid)',
    workMode: 'Hybrid',
    appliedDate: 'Today, 8:15 AM',
    status: 'Interview',
    stage: 'Interview',
    resume: {
      filename: 'Rohan_Kapoor_DataEngineer.pdf',
      size: '1.1 MB',
      atsScore: 91,
      summary: 'Data engineer with deep specialization in Kafka streaming, Airflow orchestration, and distributed Spark clusters.',
    },
    coverLetter: 'Hello Hiring Team,\n\nI would love to help scale Cloudframes real-time security event telemetry pipelines. With experience managing 100M+ events daily on Kafka and Airflow at StreamScale Analytics, I am well versed in high-throughput reliability.',
    screeningQuestions: [
      { question: 'What is your current notice period?', answer: '30 days (can buyout to 15 days)' },
      { question: 'Which streaming frameworks have you managed in production?', answer: 'Apache Kafka, Apache Flink, AWS Kinesis.' },
    ],
    feedbackNotes: [
      { author: 'Vikram Sethi', role: 'Co-founder', date: 'Today, 11:00 AM', rating: 5, note: 'Round 1 technical deep dive scheduled for tomorrow 2:00 PM.' },
    ],
    timeline: [
      { event: 'Application received', timestamp: 'Today, 8:15 AM', actor: 'Candidate: Rohan Kapoor' },
      { event: 'Moved to Screening', timestamp: 'Today, 9:00 AM', actor: 'System Auto' },
      { event: 'Technical interview round scheduled', timestamp: 'Today, 11:00 AM', actor: 'Recruiter: Vikram Sethi' },
    ],
  },
  {
    id: 'app-907',
    recordTitle: 'Kabir Shah → Growth Marketing Manager',
    candidateName: 'Kabir Shah',
    candidateHeadline: 'Growth Marketer',
    candidateEmailMasked: 'ka***@mail.com',
    candidatePhoneMasked: '+91 98670 *****',
    candidateLocation: 'Mumbai, MH',
    jobTitle: 'Growth Marketing Manager',
    company: 'Northstar Labs',
    jobLocation: 'Remote India',
    workMode: 'Remote',
    appliedDate: 'Sep 28, 2026',
    status: 'Offered',
    stage: 'Offered',
    resume: {
      filename: 'Kabir_Shah_Growth_Marketer.pdf',
      size: '950 KB',
      atsScore: 89,
      summary: 'Data-driven growth marketer experienced in B2B & consumer performance marketing, product analytics, and automated onboarding funnels.',
    },
    coverLetter: 'Dear Hiring Team,\n\nI am thrilled to apply for the Growth Marketing Manager position at Northstar Labs. Having driven 140% pipeline growth at ScaleRapid Ventures, I am eager to apply my experience in multi-channel paid acquisition to scale Northstar self-serve product trials globally.',
    screeningQuestions: [
      { question: 'What is your experience managing monthly paid ad budgets over $50k?', answer: 'Managed $80k-$120k/month across Google Search and LinkedIn B2B campaigns.' },
      { question: 'Are you comfortable in a fully remote setup?', answer: 'Yes, I have worked remotely for over 3 years.' },
    ],
    feedbackNotes: [
      { author: 'Isha Menon', role: 'Head of People', date: 'Oct 8, 2026', rating: 5, note: 'Outstanding case study presentation on CAC reduction. Formal offer letter issued with ₹24 LPA base + performance bonus.' },
    ],
    timeline: [
      { event: 'Application submitted', timestamp: 'Sep 28, 2026', actor: 'Candidate: Kabir Shah' },
      { event: 'Screening interview completed with HR', timestamp: 'Oct 2, 2026', actor: 'Recruiter: Aditya Sen' },
      { event: 'Final hiring manager presentation', timestamp: 'Oct 6, 2026', actor: 'Interviewer: Pooja Hegde' },
      { event: 'Formal offer extended', timestamp: 'Oct 8, 2026', actor: 'Head of People: Isha Menon' },
    ],
  },
  {
    id: 'app-908',
    recordTitle: 'Ananya Sen → Staff Cloud Architect',
    candidateName: 'Ananya Sen',
    candidateHeadline: 'Staff Cloud Architect & DevOps Lead',
    candidateEmailMasked: 'an***@cloudscale.net',
    candidatePhoneMasked: '+91 99801 *****',
    candidateLocation: 'Hyderabad, TS',
    jobTitle: 'Staff Cloud Architect',
    company: 'Zenith HealthTech',
    jobLocation: 'Bengaluru, KA (Hybrid)',
    workMode: 'Hybrid',
    appliedDate: 'Oct 8, 2026',
    status: 'Interview',
    stage: 'Interview',
    currentStep: 3,
    totalSteps: 5,
    currentRound: 2,
    totalRounds: 3,
    resume: {
      filename: 'Ananya_Sen_Staff_Cloud_Architect.pdf',
      size: '1.2 MB',
      atsScore: 96,
      summary: 'Staff Cloud Architect with 7+ years architecting enterprise distributed cloud architectures, Kubernetes clusters, and zero-trust security postures.',
    },
    coverLetter: 'Hi Dr. Saxena and Zenith HealthTech Team,\n\nWith extensive experience architecting highly available, HIPAA-compliant Kubernetes environments and multi-cloud Landing Zones, I am keen to lead Zenith HealthTech cloud infrastructure roadmap.',
    screeningQuestions: [
      { question: 'Do you have direct experience with healthcare compliance standards?', answer: 'Yes, architected HIPAA and ISO-27001 compliant infrastructures at CloudScale Labs.' },
      { question: 'Can you work hybrid out of the Bengaluru innovation center?', answer: 'Yes, open to relocation / 2 days weekly in Bengaluru.' },
    ],
    feedbackNotes: [
      { author: 'Dr. Arishta Saxena', role: 'VP of Technology & Talent', date: 'Oct 11, 2026', rating: 5, note: 'Exceptional system design depth. Advancing to architecture review panel.' },
    ],
    timeline: [
      { event: 'Application received', timestamp: 'Oct 8, 2026', actor: 'Candidate: Ananya Sen' },
      { event: 'Profile verified and matched to role', timestamp: 'Oct 9, 2026', actor: 'System Auto' },
      { event: 'Technical screening passed', timestamp: 'Oct 11, 2026', actor: 'Recruiter: Devendra Joshi' },
      { event: 'Architecture panel interview scheduled for Oct 16', timestamp: 'Oct 12, 2026', actor: 'Admin: Rahul Sharma' },
    ],
  },
  {
    id: 'app-909',
    recordTitle: 'Meera Iyer → Customer Success Lead',
    candidateName: 'Meera Iyer',
    candidateHeadline: 'Customer Success Lead',
    candidateEmailMasked: 'me***@mail.com',
    candidatePhoneMasked: '+91 94440 *****',
    candidateLocation: 'Chennai, TN',
    jobTitle: 'Customer Success Lead',
    company: 'BrightPath Careers',
    jobLocation: 'Mumbai, MH (On site)',
    workMode: 'On site',
    appliedDate: 'Oct 1, 2026',
    status: 'Rejected',
    stage: 'Rejected',
    currentStep: 2,
    totalSteps: 4,
    currentRound: 1,
    totalRounds: 2,
    resume: {
      filename: 'Meera_Iyer_CS_Lead.pdf',
      size: '620 KB',
      atsScore: 79,
      summary: 'Customer Success leader with 5 years experience driving enterprise retention, onboarding workflows, and client advocacy in B2B SaaS.',
    },
    coverLetter: 'Dear Sana Qureshi,\n\nI am writing to express my interest in the Customer Success Lead position at BrightPath Careers. I have led SaaS customer success teams and handled enterprise escalations.',
    screeningQuestions: [
      { question: 'Are you open to full-time relocation to Mumbai for this on-site role?', answer: 'Prefer hybrid or remote; relocation requires relocation assistance.' },
    ],
    feedbackNotes: [
      { author: 'Sana Qureshi', role: 'VP of Talent Acquisition', date: 'Oct 3, 2026', rating: 3, note: 'Strong customer skills but candidate cannot relocate full-time to Mumbai as required by this on-site role.' },
    ],
    timeline: [
      { event: 'Application submitted', timestamp: 'Oct 1, 2026', actor: 'Candidate: Meera Iyer' },
      { event: 'Initial resume screening completed', timestamp: 'Oct 2, 2026', actor: 'Recruiter: Kunal Jain' },
      { event: 'Application rejected due to relocation preference mismatch', timestamp: 'Oct 3, 2026', actor: 'Recruiter: Sana Qureshi' },
    ],
  },
  {
    id: 'app-999',
    recordTitle: 'Mass-apply pattern detected',
    candidateName: 'Rajesh Verma (Flagged ID can-1094)',
    candidateHeadline: 'Software Developer',
    candidateEmailMasked: 'rv***@tempmail.org',
    candidatePhoneMasked: '+91 99999 *****',
    candidateLocation: 'Unknown',
    jobTitle: 'Multiple Listings (400 Jobs)',
    company: 'Multiple Employers',
    jobLocation: 'Pan India',
    workMode: 'Various',
    appliedDate: '15 min ago',
    status: 'Flagged',
    stage: 'Rejected',
    resume: {
      filename: 'resume_generic_template.docx',
      size: '120 KB',
      atsScore: 12,
      summary: 'Automated script bot mass application submission detected across multiple job listings.',
    },
    screeningQuestions: [
      { question: 'Verification challenge', answer: 'Failed captcha verification check.' },
    ],
    timeline: [
      { event: 'Automated bot trigger detected by Trust & Safety', timestamp: '15 min ago', actor: 'System Abuse Sentinel' },
      { event: 'IP rate limited and account flagged for review', timestamp: '14 min ago', actor: 'System Auto' },
    ],
  },
];

export const adminApplicationStageMappings: ApplicationStageMapping[] = [
  {
    id: 'stage-map-1',
    order: 1,
    candidateStage: 'Applied',
    adminStatus: 'Applied',
    description: 'Initial candidate application receipt, profile indexing, and automated ATS parsing.',
    candidateDescription: 'Your application has been received and forwarded to the hiring team for initial review.',
    notifyCandidate: true,
    portalVisible: true,
    status: 'Active',
    lastUpdated: 'Oct 12, 2026',
  },
  {
    id: 'stage-map-2',
    order: 2,
    candidateStage: 'Under Review',
    adminStatus: 'Screening',
    description: 'Hiring team and recruiters evaluating candidate resume, portfolio, and screening answers.',
    candidateDescription: 'Your profile and application materials are currently being reviewed by the hiring manager.',
    notifyCandidate: true,
    portalVisible: true,
    status: 'Active',
    lastUpdated: 'Oct 11, 2026',
  },
  {
    id: 'stage-map-3',
    order: 3,
    candidateStage: 'Interview Scheduled',
    adminStatus: 'Interview',
    description: 'Candidate shortlisted for interview round (technical, cultural, or hiring manager loop).',
    candidateDescription: 'Congratulations! The company has invited you for an interview. Check your inbox for the calendar link.',
    notifyCandidate: true,
    portalVisible: true,
    status: 'Active',
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'stage-map-4',
    order: 4,
    candidateStage: 'Offer Received',
    adminStatus: 'Offered',
    description: 'Employer extended formal offer letter; salary package and contract under candidate consideration.',
    candidateDescription: 'An official employment offer has been extended! Review the offer documents in your candidate portal.',
    notifyCandidate: true,
    portalVisible: true,
    status: 'Active',
    lastUpdated: 'Oct 9, 2026',
  },
  {
    id: 'stage-map-5',
    order: 5,
    candidateStage: 'Not Selected',
    adminStatus: 'Rejected',
    description: 'Hiring decision concluded without offer; polite notification sent to candidate pool.',
    candidateDescription: 'The team has decided to proceed with other candidates whose experience more closely matches the current requirements.',
    notifyCandidate: true,
    portalVisible: true,
    status: 'Active',
    lastUpdated: 'Oct 8, 2026',
  },
  {
    id: 'stage-map-6',
    order: 6,
    candidateStage: 'Withdrawn',
    adminStatus: 'Closed',
    description: 'Application voluntarily withdrawn by candidate or role requisition closed by company.',
    candidateDescription: 'This application is closed. You have withdrawn or the job opening has been filled.',
    notifyCandidate: false,
    portalVisible: true,
    status: 'Active',
    lastUpdated: 'Oct 5, 2026',
  },
];

export const adminSupportTickets: AdminSupportTicketDetail[] = [
  {
    id: 'tkt-1',
    recordTitle: 'Resume export is missing a page',
    ticketId: 'JR-C10451',
    subject: 'Resume export is missing a page in PDF download',
    requesterName: 'Aarav Mehta',
    requesterEmail: 'aarav.mehta@designflow.io',
    requesterRole: 'Candidate',
    priority: 'High',
    category: 'Resume Pro',
    status: 'Open',
    sla: {
      responseDue: 'Within 4 hours',
      timeLeft: '2h 14m remaining',
      breached: false,
    },
    assignedAgent: 'Devika Rao',
    conversation: [
      {
        id: 'msg-1',
        sender: 'Aarav Mehta',
        senderRole: 'requester',
        timestamp: 'Today, 11:42 AM (26 min ago)',
        message: 'Hi Support Team,\n\nI just purchased JobRisers Pro and customized the "Modern Split v2.4" resume template. When I export to PDF, my second page containing Education and Certifications is cut off and completely blank. Can you please check why the pagination breaks during download?',
      },
      {
        id: 'msg-2',
        sender: 'System Auto',
        senderRole: 'system',
        timestamp: 'Today, 11:42 AM',
        message: 'Ticket received and assigned ticket ID JR-C10451. SLA tier: Pro Candidate Support (Priority Response).',
      },
      {
        id: 'msg-3',
        sender: 'Devika Rao',
        senderRole: 'agent',
        timestamp: 'Today, 11:55 AM (13 min ago)',
        message: 'Hello Aarav,\n\nThanks for reaching out! We are currently investigating this. It looks like an overflow issue when custom margins are set below 0.5 inches on the Modern Split layout. Our engineering team has deployed a patch, could you try re-exporting now?',
      },
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Devika Rao',
        timestamp: 'Today, 11:50 AM',
        note: 'Checked candidate profile can-1001. Active Pro subscriber. Known Chrome print-to-PDF margin quirk. Notified frontend team.',
      },
    ],
    cannedResponses: [
      {
        id: 'cr-1',
        title: 'PDF Export Troubleshooting',
        content: 'Hi there,\n\nPlease try clearing your browser cache and setting margins to "Default" in the print dialog before exporting. If the issue persists, please let us know your operating system and browser version.',
      },
      {
        id: 'cr-2',
        title: 'Refund Policy Explanation',
        content: 'Hi,\n\nJobRisers Pro subscriptions include a 7-day unconditional money-back guarantee. If you would like a full refund, our finance team can process it within 2 business days.',
      },
      {
        id: 'cr-3',
        title: 'Document Upload Guidelines',
        content: 'Hi,\n\nPlease ensure your document is in PDF or DOCX format and under 10MB in file size with standard font encodings.',
      },
    ],
  },
  {
    id: 'tkt-2',
    recordTitle: 'Company verification documents',
    ticketId: 'JR-E2081',
    subject: 'Additional incorporation documents for Cloudframe verification',
    requesterName: 'Vikram Sethi',
    requesterEmail: 'vikram.sethi@cloudframe.example',
    requesterRole: 'Employer',
    priority: 'Medium',
    category: 'Verification',
    status: 'Resolved',
    sla: {
      responseDue: 'Resolved within SLA',
      timeLeft: 'Completed',
      breached: false,
    },
    assignedAgent: 'Rahul Sharma',
    conversation: [
      {
        id: 'msg-4',
        sender: 'Vikram Sethi',
        senderRole: 'requester',
        timestamp: 'Today, 9:00 AM (2 hr ago)',
        message: 'Good morning,\n\nOur company Cloudframe is currently marked "Under review" in the employer directory. We uploaded our Certificate of Incorporation and updated GST tax registration docs. Could an admin verify these so our pending job listings can go live?',
      },
      {
        id: 'msg-5',
        sender: 'Rahul Sharma',
        senderRole: 'agent',
        timestamp: 'Today, 9:45 AM (1 hr ago)',
        message: 'Hi Vikram,\n\nThank you for providing the updated incorporation certificates. We have validated your MCA registration and GST certificates. Your account status has been updated and your listings have been approved for publishing.',
      },
      {
        id: 'msg-6',
        sender: 'Vikram Sethi',
        senderRole: 'requester',
        timestamp: 'Today, 10:05 AM (45 min ago)',
        message: 'Thank you for the quick turnaround Rahul! Much appreciated.',
      },
    ],
    internalNotes: [
      {
        id: 'note-2',
        author: 'Rahul Sharma',
        timestamp: 'Today, 9:40 AM',
        note: 'Cross-checked MCA portal with CIN U72200PN2023PTC189211. Active company, directors match. Verification marked complete.',
      },
    ],
    cannedResponses: [
      {
        id: 'cr-1',
        title: 'Verification Complete Notice',
        content: 'Hello,\n\nWe are pleased to inform you that your employer organization verification has been completed successfully.',
      },
      {
        id: 'cr-2',
        title: 'Request Additional Business Docs',
        content: 'Hello,\n\nTo complete your employer verification, please upload your latest GST filing receipt or audited financial summary.',
      },
    ],
  },
  {
    id: 'tkt-3',
    recordTitle: 'Refund Policy Explanation',
    ticketId: 'JR-C10452',
    subject: 'Inquiry regarding Pro subscription refund terms',
    requesterName: 'Meera Iyer',
    requesterEmail: 'meera.iyer@connectcrm.in',
    requesterRole: 'Candidate',
    priority: 'Low',
    category: 'Billing',
    status: 'Open',
    sla: {
      responseDue: 'Within 24 hours',
      timeLeft: '18h 30m remaining',
      breached: false,
    },
    assignedAgent: 'Devika Rao',
    conversation: [
      {
        id: 'msg-7',
        sender: 'Meera Iyer',
        senderRole: 'requester',
        timestamp: 'Yesterday, 4:20 PM',
        message: 'Hello, could you explain how the 7-day money back guarantee applies if I subscribed through the annual plan?',
      },
    ],
    internalNotes: [
      {
        id: 'note-3',
        author: 'Devika Rao',
        timestamp: 'Yesterday, 5:10 PM',
        note: 'Candidate account suspended under casework; check before issuing any refund or account modifications.',
      },
    ],
    cannedResponses: [
      {
        id: 'cr-2',
        title: 'Refund Policy Explanation',
        content: 'Hi,\n\nJobRisers Pro subscriptions include a 7-day unconditional money-back guarantee. If you would like a full refund, our finance team can process it within 2 business days.',
      },
    ],
  },
  {
    id: 'tkt-4',
    recordTitle: 'Calendar sync integration failing with Google Meet room links',
    ticketId: 'JR-E2085',
    subject: 'Calendar sync integration failing with Google Meet room links',
    requesterName: 'Isha Menon',
    requesterEmail: 'isha.menon@northstarlabs.example',
    requesterRole: 'Employer',
    priority: 'High',
    category: 'Interview Sync',
    status: 'In Progress',
    sla: {
      responseDue: 'Within 4 hours',
      timeLeft: '1h 05m remaining',
      breached: false,
    },
    assignedAgent: 'Rahul Sharma',
    conversation: [
      {
        id: 'msg-8',
        sender: 'Isha Menon',
        senderRole: 'requester',
        timestamp: 'Today, 10:15 AM (1 hr ago)',
        message: 'Hello Support,\n\nWhen our recruiters schedule candidate interviews, the automated Google Calendar invite generates an invalid conference link error for external candidates on Safari. Could someone check our OAuth integration settings?',
      },
      {
        id: 'msg-9',
        sender: 'Rahul Sharma',
        senderRole: 'agent',
        timestamp: 'Today, 10:40 AM (35 min ago)',
        message: 'Hi Isha,\n\nThanks for alerting us. We are currently verifying your Google Workspace OAuth domain token and will renew the calendar refresh token. One moment while engineering checks the logs.',
      },
    ],
    internalNotes: [
      {
        id: 'note-4',
        author: 'Rahul Sharma',
        timestamp: 'Today, 10:35 AM',
        note: 'Investigating Google Calendar API token expiry for Northstar Labs tenant. Escalated to integrations team.',
      },
    ],
    cannedResponses: [
      {
        id: 'cr-4',
        title: 'OAuth Integration Reconnect Guide',
        content: 'Hi,\n\nPlease navigate to Settings > Integrations > Calendar and click "Reconnect Google Workspace" to refresh your tenant OAuth grant tokens.',
      },
    ],
  },
  {
    id: 'tkt-5',
    recordTitle: 'DPDP statutory data deletion and erasure request',
    ticketId: 'JR-C10458',
    subject: 'DPDP statutory data deletion and erasure request',
    requesterName: 'Rohan Kapoor',
    requesterEmail: 'rohan.kapoor@clouddata.org',
    requesterRole: 'Candidate',
    priority: 'Urgent',
    category: 'Privacy & GDPR',
    status: 'Waiting on Customer',
    sla: {
      responseDue: '30-day statutory SLA',
      timeLeft: '24 days remaining',
      breached: false,
    },
    assignedAgent: 'Maya Iyer',
    conversation: [
      {
        id: 'msg-10',
        sender: 'Rohan Kapoor',
        senderRole: 'requester',
        timestamp: 'Oct 11, 2026',
        message: 'To the Data Protection Officer,\n\nPursuant to Section 12 of the Digital Personal Data Protection Act, I formally request complete erasure of my candidate profile, uploaded resumes, and search history from JobRisers servers.',
      },
      {
        id: 'msg-11',
        sender: 'Maya Iyer',
        senderRole: 'agent',
        timestamp: 'Oct 12, 2026',
        message: 'Hello Rohan,\n\nWe have received your erasure request and initiated the statutory verification procedure. To safeguard your account, please confirm identity verification via the secure authentication link sent to your registered mobile number.',
      },
    ],
    internalNotes: [
      {
        id: 'note-5',
        author: 'Maya Iyer',
        timestamp: 'Oct 12, 2026',
        note: 'Candidate identity verification OTP dispatched. Statutory 30-day clock active under DPDP Act schedule.',
      },
    ],
    cannedResponses: [
      {
        id: 'cr-5',
        title: 'Data Subject Erasure Confirmation',
        content: 'Hello,\n\nWe confirm receipt of your data erasure request. In accordance with DPDP Act & GDPR compliance, all personal identifiers and uploaded documents will be irreversibly purged within 30 days.',
      },
    ],
  },
];

export const adminInterviews: AdminInterviewRecord[] = [
  {
    id: 'int-401',
    candidateId: 'can-1001',
    candidateName: 'Aarav Mehta',
    companyId: 'emp-2001',
    companyName: 'Northstar Labs',
    jobId: 'job-3001',
    jobTitle: 'Senior Product Designer',
    dateTime: 'Oct 14, 2026 · 11:00 AM IST',
    timezone: 'IST (UTC+5:30)',
    duration: '60 min',
    provider: 'Google Meet',
    format: 'Video call',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/qwe-rtyu-iop',
    interviewerName: 'Isha Menon',
    interviewerTitle: 'Head of People & Ops',
    notes: 'System design portfolio walk-through and interactive design system exercises.',
  },
  {
    id: 'int-402',
    candidateId: 'can-1002',
    candidateName: 'Priya Nair',
    companyId: 'emp-2002',
    companyName: 'Cloudframe',
    jobId: 'job-3002',
    jobTitle: 'Frontend Engineer',
    dateTime: 'Oct 15, 2026 · 2:30 PM IST',
    timezone: 'IST (UTC+5:30)',
    duration: '45 min',
    provider: 'Zoom',
    format: 'Video call',
    status: 'Scheduled',
    meetingLink: 'https://zoom.us/j/8492019381',
    interviewerName: 'Vikram Sethi',
    interviewerTitle: 'Co-founder & CEO',
    notes: 'Introductory cultural fit and technical background screen.',
  },
  {
    id: 'int-403',
    candidateId: 'can-1003',
    candidateName: 'Rohan Kapoor',
    companyId: 'emp-2002',
    companyName: 'Cloudframe',
    jobId: 'job-3003',
    jobTitle: 'Data Platform Engineer',
    dateTime: 'Oct 13, 2026 · 10:00 AM IST',
    timezone: 'IST (UTC+5:30)',
    duration: '60 min',
    provider: 'Google Meet',
    format: 'Video call',
    status: 'Feedback Pending',
    meetingLink: 'https://meet.google.com/asd-fghj-klz',
    interviewerName: 'Aditya Sen',
    interviewerTitle: 'Technical Architect',
    notes: 'Distributed streaming architecture round completed; awaiting scorecard submission.',
  },
  {
    id: 'int-404',
    candidateId: 'can-1005',
    candidateName: 'Kabir Shah',
    companyId: 'emp-2001',
    companyName: 'Northstar Labs',
    jobId: 'job-3006',
    jobTitle: 'Growth Marketing Manager',
    dateTime: 'Oct 10, 2026 · 4:00 PM IST',
    timezone: 'IST (UTC+5:30)',
    duration: '45 min',
    provider: 'Google Meet',
    format: 'Video call',
    status: 'Completed',
    meetingLink: 'https://meet.google.com/zxc-vbnm-qwe',
    interviewerName: 'Pooja Hegde',
    interviewerTitle: 'Director of Growth',
    notes: 'Candidate passed with unanimous hire recommendation. Offer extended.',
  },
  {
    id: 'int-405',
    candidateId: 'can-1006',
    candidateName: 'Ananya Sen',
    companyId: 'emp-2006',
    companyName: 'Zenith HealthTech',
    jobId: 'job-3007',
    jobTitle: 'Staff Cloud Architect',
    dateTime: 'Oct 16, 2026 · 3:00 PM IST',
    timezone: 'IST (UTC+5:30)',
    duration: '90 min',
    provider: 'Microsoft Teams',
    format: 'Video call',
    status: 'Confirmed',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/199201',
    interviewerName: 'Dr. Arishta Saxena',
    interviewerTitle: 'VP of Technology & Talent',
    notes: 'HIPAA healthcare compliance architecture panel with engineering directors.',
  },
  {
    id: 'int-406',
    candidateId: 'can-1007',
    candidateName: 'Vikram Malhotra',
    companyId: 'emp-2003',
    companyName: 'Pioneer Talent',
    jobId: 'job-3005',
    jobTitle: 'Junior Product Analyst',
    dateTime: 'Oct 12, 2026 · 11:30 AM IST',
    timezone: 'IST (UTC+5:30)',
    duration: '30 min',
    provider: 'Google Meet',
    format: 'Video call',
    status: 'No-show',
    meetingLink: 'https://meet.google.com/mnb-vcxz-lkj',
    interviewerName: 'Neha Arora',
    interviewerTitle: 'Managing Partner',
    notes: 'Candidate did not attend scheduled video call; automated reschedule nudge dispatched.',
  },
  {
    id: 'int-407',
    candidateId: 'can-1004',
    candidateName: 'Meera Iyer',
    companyId: 'emp-2005',
    companyName: 'BrightPath Careers',
    jobId: 'job-3004',
    jobTitle: 'Customer Success Lead',
    dateTime: 'Oct 8, 2026 · 1:00 PM IST',
    timezone: 'IST (UTC+5:30)',
    duration: '45 min',
    provider: 'In-person',
    format: 'On-site',
    status: 'Cancelled',
    location: 'Bandra Kurla Complex, Mumbai',
    interviewerName: 'Sana Qureshi',
    interviewerTitle: 'VP of Talent Acquisition',
    notes: 'Interview cancelled due to candidate relocation constraint.',
  },
];


export const adminInterviewDisputes: AdminInterviewDispute[] = [
  {
    id: 'dsp-601',
    interviewId: 'int-406',
    candidateId: 'can-1007',
    candidateName: 'Vikram Malhotra',
    companyId: 'emp-2003',
    companyName: 'Pioneer Talent',
    jobTitle: 'Junior Product Analyst',
    filingParty: 'Employer',
    filerName: 'Neha Arora (Managing Partner)',
    reason: 'Candidate No-show',
    description: 'Candidate did not connect to the Google Meet session after 15 minutes of waiting. Recruiter sent two reminder emails with no response.',
    filingDate: 'Oct 12, 2026 · 12:15 PM',
    scheduledTime: 'Oct 12, 2026 · 11:30 AM IST',
    status: 'Pending Review',
  },
  {
    id: 'dsp-602',
    interviewId: 'int-402',
    candidateId: 'can-1002',
    candidateName: 'Priya Nair',
    companyId: 'emp-2002',
    companyName: 'Cloudframe',
    jobTitle: 'Frontend Engineer',
    filingParty: 'Candidate',
    filerName: 'Priya Nair',
    reason: 'Invalid / Expired Meeting Link',
    description: 'The provided Zoom link returned "Meeting passcode incorrect or meeting expired" when attempting to join. Candidate reached out via in-app chat.',
    filingDate: 'Oct 13, 2026 · 3:00 PM',
    scheduledTime: 'Oct 15, 2026 · 2:30 PM IST',
    status: 'Investigating',
  },
  {
    id: 'dsp-603',
    interviewId: 'int-407',
    candidateId: 'can-1004',
    candidateName: 'Meera Iyer',
    companyId: 'emp-2005',
    companyName: 'BrightPath Careers',
    jobTitle: 'Customer Success Lead',
    filingParty: 'Candidate',
    filerName: 'Meera Iyer',
    reason: 'Employer / Recruiter No-show',
    description: 'Candidate arrived at the designated Mumbai office location on Oct 8, but the receptionist stated the hiring manager was out of town. Relocation conflict noted.',
    filingDate: 'Oct 8, 2026 · 2:30 PM',
    scheduledTime: 'Oct 8, 2026 · 1:00 PM IST',
    status: 'Resolved',
    resolutionNotes: 'Interview marked cancelled without candidate penalty. Candidate issued priority reschedule voucher.',
  },
  {
    id: 'dsp-604',
    interviewId: 'int-401',
    candidateId: 'can-1001',
    candidateName: 'Aarav Mehta',
    companyId: 'emp-2001',
    companyName: 'Northstar Labs',
    jobTitle: 'Senior Product Designer',
    filingParty: 'Candidate',
    filerName: 'Aarav Mehta',
    reason: 'Off-platform Fee Demand / Fraud',
    description: 'External recruiting agency panelist requested a ₹2,500 "assessment processing fee" prior to sending the Figma design challenge link.',
    filingDate: 'Oct 11, 2026 · 5:45 PM',
    scheduledTime: 'Oct 14, 2026 · 11:00 AM IST',
    status: 'Resolved',
    resolutionNotes: 'Employer account received Strike 1 warning. External agency recruiter credentials suspended pending audit. Candidate notified.',
  },
];

export const adminMeetingLinkRules: AdminMeetingLinkRules = {
  allowedProviders: {
    googleMeet: true,
    zoom: true,
    microsoftTeams: true,
    webex: false,
  },
  allowCustomDomains: false,
  blockUrlShorteners: true,
  blockedShortenersList: ['bit.ly', 'tinyurl.com', 't.co', 'rebrand.ly', 'is.gd', 'cutt.ly'],
  joinWindowMinutesBefore: 15,
  linkExpiryMinutesAfter: 60,
  autoGenerateCalendarInvite: true,
  enforceHostValidation: true,
  lastUpdated: 'Oct 12, 2026 · 4:30 PM IST',
  updatedBy: 'Operations Admin (Rahul Sharma)',
};

export const adminInterviewPrepLinks: AdminInterviewPrepLink[] = [
  {
    id: 'prep-801',
    title: 'Mastering the Remote Technical Video Interview',
    targetCategory: 'Engineering & Tech',
    targetRole: 'Software & Frontend Engineers',
    deliveryTrigger: 'Interview confirmation email',
    status: 'Active',
    articleSlug: 'mastering-remote-technical-interview',
    estimatedReadTime: '8 min read',
    summary: 'Best practices for audio setup, IDE live-coding environments, whiteboard walk-throughs, and answering architectural trade-off questions.',
    keyTopics: ['Audio/Video Setup', 'Live Coding Etiquette', 'Handling Syntax Errors Calmly', 'Asking Clarifying Questions'],
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'prep-802',
    title: 'System Design Interview Primer: From Monolith to Microservices',
    targetCategory: 'Engineering & Architecture',
    targetRole: 'Data & Cloud Architects',
    deliveryTrigger: '24-hour reminder',
    status: 'Active',
    articleSlug: 'system-design-interview-primer',
    estimatedReadTime: '12 min read',
    summary: 'A structured blueprint for framing requirements, estimating scale (QPS, storage), designing data flows, and discussing failure modes.',
    keyTopics: ['Functional vs Non-functional', 'Capacity Estimation', 'Database Sharding', 'Cache Strategies'],
    lastUpdated: 'Oct 12, 2026',
  },
  {
    id: 'prep-803',
    title: 'STAR Method Behavioral Interview Playbook',
    targetCategory: 'Product & Leadership',
    targetRole: 'Product Designers & Managers',
    deliveryTrigger: 'Candidate dashboard / in-app banner',
    status: 'Active',
    articleSlug: 'star-method-behavioral-interview',
    estimatedReadTime: '6 min read',
    summary: 'How to structure impactful narratives for stakeholder conflict, prioritization under ambiguity, and measuring success metrics.',
    keyTopics: ['Situation & Task Framing', 'Action Verb Specificity', 'Quantified Results', 'Cross-functional Collaboration'],
    lastUpdated: 'Oct 8, 2026',
  },
  {
    id: 'prep-804',
    title: 'Customer Success & Client Scenarios Quick Guide',
    targetCategory: 'Sales & Support',
    targetRole: 'Customer Success Leads',
    deliveryTrigger: 'Interview confirmation email',
    status: 'Draft',
    articleSlug: 'customer-success-scenarios-guide',
    estimatedReadTime: '5 min read',
    summary: 'Handling de-escalation roleplays, demonstrating product adoption value, and communicating churn reduction strategies.',
    keyTopics: ['Active Listening', 'De-escalation Roleplay', 'Customer Retention Metrics', 'Executive Presentations'],
    lastUpdated: 'Oct 4, 2026',
  },
];

export const adminConversations: AdminConversationMetadata[] = [
  {
    id: 'conv-501',
    candidateId: 'can-1001',
    candidateName: 'Aarav Mehta',
    employerId: 'emp-2001',
    companyName: 'Northstar Labs',
    employerContactName: 'Isha Menon',
    jobId: 'job-3001',
    jobTitle: 'Senior Product Designer',
    startedDate: 'Oct 10, 2026',
    lastActivity: '25 min ago',
    messageCount: 14,
    status: 'Active',
    isUnread: false,
    isFlagged: false,
  },
  {
    id: 'conv-502',
    candidateId: 'can-1002',
    candidateName: 'Priya Nair',
    employerId: 'emp-2002',
    companyName: 'Cloudframe',
    employerContactName: 'Vikram Sethi',
    jobId: 'job-3002',
    jobTitle: 'Frontend Engineer',
    startedDate: 'Oct 11, 2026',
    lastActivity: '46 min ago',
    messageCount: 8,
    status: 'Active',
    isUnread: true,
    isFlagged: false,
  },
  {
    id: 'conv-503',
    candidateId: 'can-1003',
    candidateName: 'Rohan Kapoor',
    employerId: 'emp-2002',
    companyName: 'Cloudframe',
    employerContactName: 'Vikram Sethi',
    jobId: 'job-3003',
    jobTitle: 'Data Platform Engineer',
    startedDate: 'Oct 12, 2026',
    lastActivity: '2 hr ago',
    messageCount: 19,
    status: 'Active',
    isUnread: false,
    isFlagged: true,
    flagReason: 'Third-party URL redirect detected in chat',
  },
  {
    id: 'conv-504',
    candidateId: 'can-1005',
    candidateName: 'Kabir Shah',
    employerId: 'emp-2001',
    companyName: 'Northstar Labs',
    employerContactName: 'Aditya Sen',
    jobId: 'job-3006',
    jobTitle: 'Growth Marketing Manager',
    startedDate: 'Sep 29, 2026',
    lastActivity: '3 days ago',
    messageCount: 22,
    status: 'Archived',
    isUnread: false,
    isFlagged: false,
  },
  {
    id: 'conv-505',
    candidateId: 'can-1004',
    candidateName: 'Meera Iyer',
    employerId: 'emp-2004',
    companyName: 'Vertex Works',
    employerContactName: 'Amit Rao',
    jobId: 'job-3004',
    jobTitle: 'Customer Success / Tele-ops',
    startedDate: 'Oct 1, 2026',
    lastActivity: 'Oct 2, 2026',
    messageCount: 5,
    status: 'Locked',
    isUnread: false,
    isFlagged: true,
    flagReason: 'Employer requested upfront training processing deposit',
  },
  {
    id: 'conv-506',
    candidateId: 'can-1006',
    candidateName: 'Ananya Sen',
    employerId: 'emp-2006',
    companyName: 'Zenith HealthTech',
    employerContactName: 'Dr. Arishta Saxena',
    jobId: 'job-3007',
    jobTitle: 'Staff Cloud Architect',
    startedDate: 'Oct 8, 2026',
    lastActivity: '5 hr ago',
    messageCount: 11,
    status: 'Active',
    isUnread: true,
    isFlagged: false,
  },
];

export const adminFlaggedThreads: AdminFlaggedThread[] = [
  {
    id: 'flg-701',
    threadId: 'conv-505',
    candidateName: 'Meera Iyer',
    candidateId: 'can-1004',
    employerContactName: 'Amit Rao',
    companyName: 'Vertex Works',
    jobTitle: 'Customer Success / Tele-ops',
    jobId: 'job-3004',
    triggerRule: 'Upfront Fee / Deposit Solicitation',
    matchedKeyword: 'training fee deposit',
    triggerSnippet: 'Please deposit $150 to our account for training materials before we proceed.',
    surroundingContext: [
      { sender: 'Amit Rao', isOffender: true, text: 'We reviewed your resume and are excited to move forward.', time: 'Oct 1, 10:14 AM' },
      { sender: 'Meera Iyer', isOffender: false, text: 'Thank you! What are the next steps for onboarding?', time: 'Oct 1, 10:20 AM' },
      { sender: 'Amit Rao', isOffender: true, text: 'Please deposit $150 to our account for training materials before we proceed.', time: 'Oct 1, 10:25 AM' },
      { sender: 'Meera Iyer', isOffender: false, text: 'I thought JobRisers policy forbids employers from charging fees?', time: 'Oct 1, 10:30 AM' },
    ],
    riskScore: 96,
    severity: 'Critical',
    timestamp: 'Oct 1, 2026, 10:25 AM',
    status: 'Under Review',
  },
  {
    id: 'flg-702',
    threadId: 'conv-503',
    candidateName: 'Rohan Kapoor',
    candidateId: 'can-1003',
    employerContactName: 'Vikram Sethi',
    companyName: 'Cloudframe',
    jobTitle: 'Data Platform Engineer',
    jobId: 'job-3003',
    triggerRule: 'Unverified URL / Phishing Redirect',
    matchedKeyword: 'bit.ly/cloud-apply',
    triggerSnippet: 'Please submit your direct bank details on our external onboarding portal: bit.ly/cloud-apply',
    surroundingContext: [
      { sender: 'Vikram Sethi', isOffender: true, text: 'Hi Rohan, your interview went well.', time: 'Oct 12, 01:10 PM' },
      { sender: 'Rohan Kapoor', isOffender: false, text: 'Glad to hear! When can I expect the paperwork?', time: 'Oct 12, 01:15 PM' },
      { sender: 'Vikram Sethi', isOffender: true, text: 'Please submit your direct bank details on our external onboarding portal: bit.ly/cloud-apply', time: 'Oct 12, 01:18 PM' },
    ],
    riskScore: 88,
    severity: 'High',
    timestamp: 'Oct 12, 2026, 01:18 PM',
    status: 'Investigating',
  },
  {
    id: 'flg-703',
    threadId: 'conv-507',
    candidateName: 'Aanya Sharma',
    candidateId: 'can-1007',
    employerContactName: 'Rajat Varma',
    companyName: 'Apex Logistics',
    jobTitle: 'Supply Chain Analyst',
    jobId: 'job-3008',
    triggerRule: 'Off-Platform Contact Redirect',
    matchedKeyword: 'WhatsApp',
    triggerSnippet: 'Lets skip the platform chat and connect on WhatsApp directly at +91 98200 44123.',
    surroundingContext: [
      { sender: 'Rajat Varma', isOffender: true, text: 'Are you open for an unscheduled screening call right now?', time: 'Oct 13, 11:05 AM' },
      { sender: 'Aanya Sharma', isOffender: false, text: 'I am available after 2 PM today on the platform video link.', time: 'Oct 13, 11:10 AM' },
      { sender: 'Rajat Varma', isOffender: true, text: 'Lets skip the platform chat and connect on WhatsApp directly at +91 98200 44123.', time: 'Oct 13, 11:12 AM' },
    ],
    riskScore: 74,
    severity: 'Medium',
    timestamp: 'Oct 13, 2026, 11:12 AM',
    status: 'Under Review',
  },
  {
    id: 'flg-704',
    threadId: 'conv-508',
    candidateName: 'Kunal Joshi',
    candidateId: 'can-1008',
    employerContactName: 'Sunil Rao',
    companyName: 'FinScale Solutions',
    jobTitle: 'Financial Analyst',
    jobId: 'job-3009',
    triggerRule: 'Off-Platform Payment / Wire Transfer',
    matchedKeyword: 'wire transfer',
    triggerSnippet: 'You need to execute an immediate wire transfer of $250 for identity verification fees.',
    surroundingContext: [
      { sender: 'Sunil Rao', isOffender: true, text: 'Congratulations on qualifying for the final round.', time: 'Oct 09, 03:00 PM' },
      { sender: 'Sunil Rao', isOffender: true, text: 'You need to execute an immediate wire transfer of $250 for identity verification fees.', time: 'Oct 09, 03:02 PM' },
    ],
    riskScore: 94,
    severity: 'Critical',
    timestamp: 'Oct 09, 2026, 03:02 PM',
    status: 'Resolved',
    resolutionNote: 'Employer account locked; security team alerted.',
  },
];

export const adminKeywordMonitors: AdminKeywordRule[] = [
  {
    id: 'kw-101',
    keyword: 'deposit',
    category: 'Fee Solicitation',
    severity: 'Critical',
    action: 'Auto-flag & Notify',
    isActive: true,
    hitCount: 19,
    lastTriggered: '2 hours ago',
  },
  {
    id: 'kw-102',
    keyword: 'wire transfer',
    category: 'Fee Solicitation',
    severity: 'Critical',
    action: 'Block Message',
    isActive: true,
    hitCount: 14,
    lastTriggered: '5 hours ago',
  },
  {
    id: 'kw-103',
    keyword: 'WhatsApp',
    category: 'Off-Platform Contact',
    severity: 'Medium',
    action: 'Warning Banner',
    isActive: true,
    hitCount: 42,
    lastTriggered: '25 min ago',
  },
  {
    id: 'kw-104',
    keyword: 'Telegram',
    category: 'Off-Platform Contact',
    severity: 'High',
    action: 'Auto-flag & Notify',
    isActive: true,
    hitCount: 28,
    lastTriggered: '1 day ago',
  },
  {
    id: 'kw-105',
    keyword: 'bit.ly',
    category: 'Spam / Phishing',
    severity: 'High',
    action: 'Block Message',
    isActive: true,
    hitCount: 31,
    lastTriggered: '3 hours ago',
  },
  {
    id: 'kw-106',
    keyword: 'cash fee',
    category: 'Fee Solicitation',
    severity: 'Critical',
    action: 'Auto-flag & Notify',
    isActive: true,
    hitCount: 9,
    lastTriggered: '2 days ago',
  },
  {
    id: 'kw-107',
    keyword: 'training fee',
    category: 'Fee Solicitation',
    severity: 'Critical',
    action: 'Auto-flag & Notify',
    isActive: true,
    hitCount: 12,
    lastTriggered: 'Yesterday',
  },
  {
    id: 'kw-108',
    keyword: 'crypto / usdt',
    category: 'Fee Solicitation',
    severity: 'Critical',
    action: 'Block Message',
    isActive: false,
    hitCount: 6,
    lastTriggered: '5 days ago',
  },
];

export const adminMessagingPolicies: AdminMessagingPolicies = {
  dailyOutreachLimit: 50,
  unresponsiveCooldownHours: 24,
  allowedFileTypes: ['PDF', 'DOCX'],
  maxFileSizeMb: 5,
  blockExecutableScripts: true,
  lastUpdated: 'Oct 12, 2026, 05:40 PM',
  updatedBy: 'Admin Security Policy Engine',
};

export const adminReportedThreads: AdminReportedThread[] = [
  {
    id: 'rep-901',
    threadId: 'conv-505',
    reportedBy: 'Meera Iyer',
    reporterRole: 'Candidate',
    offendingUser: 'Amit Rao',
    offendingRole: 'Employer',
    organization: 'Vertex Works',
    violationReason: 'Demanding upfront onboarding & training deposit ($150) before contract issuance',
    reportedAt: 'Oct 02, 2026, 11:45 AM',
    status: 'Under Review',
    evidenceCount: 4,
    messages: [
      { id: 'm-1', sender: 'Amit Rao', senderRole: 'Employer', isOffender: true, text: 'Hi Meera, congratulations! The hiring committee has approved your candidacy for Customer Success.', timestamp: 'Oct 01, 10:14 AM' },
      { id: 'm-2', sender: 'Meera Iyer', senderRole: 'Candidate', isOffender: false, text: 'Thank you Amit! I am very excited. Could you share the written offer and next onboarding steps?', timestamp: 'Oct 01, 10:20 AM' },
      { id: 'm-3', sender: 'Amit Rao', senderRole: 'Employer', isOffender: true, text: 'Before releasing the official offer letter and equipment bundle, all new hires are required to remit a refundable $150 onboarding materials deposit via direct account transfer.', timestamp: 'Oct 01, 10:25 AM', isReportedViolation: true },
      { id: 'm-4', sender: 'Meera Iyer', senderRole: 'Candidate', isOffender: false, text: 'JobRisers clearly states that candidates should never be asked to pay upfront fees. Can this be waived or billed through platform billing?', timestamp: 'Oct 01, 10:30 AM' },
      { id: 'm-5', sender: 'Amit Rao', senderRole: 'Employer', isOffender: true, text: 'If you cannot pay the deposit by 5 PM today, your conditional offer will be revoked and offered to the backup candidate.', timestamp: 'Oct 01, 10:35 AM', isReportedViolation: true },
      { id: 'm-6', sender: 'Meera Iyer', senderRole: 'Candidate', isOffender: false, text: 'I am not comfortable with this arrangement and am submitting this transcript for Trust & Safety investigation.', timestamp: 'Oct 01, 10:40 AM' },
    ],
    resolutionNotes: '',
  },
  {
    id: 'rep-902',
    threadId: 'conv-503',
    reportedBy: 'Rohan Kapoor',
    reporterRole: 'Candidate',
    offendingUser: 'Vikram Sethi',
    offendingRole: 'Employer',
    organization: 'Cloudframe',
    violationReason: 'Third-party phishing link requesting personal banking information',
    reportedAt: 'Oct 12, 2026, 02:15 PM',
    status: 'Investigating',
    evidenceCount: 3,
    messages: [
      { id: 'm-11', sender: 'Vikram Sethi', senderRole: 'Employer', isOffender: true, text: 'Hi Rohan, we would like to accelerate your technical round.', timestamp: 'Oct 12, 01:10 PM' },
      { id: 'm-12', sender: 'Rohan Kapoor', senderRole: 'Candidate', isOffender: false, text: 'Sounds great. Let me know the calendar invite details.', timestamp: 'Oct 12, 01:14 PM' },
      { id: 'm-13', sender: 'Vikram Sethi', senderRole: 'Employer', isOffender: true, text: 'Please fill out your verified direct deposit information and tax ID on this form prior to call: http://bit.ly/cloud-apply-tax', timestamp: 'Oct 12, 01:18 PM', isReportedViolation: true },
      { id: 'm-14', sender: 'Rohan Kapoor', senderRole: 'Candidate', isOffender: false, text: 'That shortened link triggered my browser malware alert. Is this an official Cloudframe domain?', timestamp: 'Oct 12, 01:25 PM' },
    ],
    resolutionNotes: 'Security review pending domain lookup on bit.ly link.',
  },
  {
    id: 'rep-903',
    threadId: 'conv-509',
    reportedBy: 'Isha Menon',
    reporterRole: 'Employer',
    offendingUser: 'Karan Batra',
    offendingRole: 'Candidate',
    organization: 'Northstar Labs',
    violationReason: 'Abusive language and hostile threats following interview schedule change',
    reportedAt: 'Oct 13, 2026, 06:10 PM',
    status: 'Action Taken',
    evidenceCount: 3,
    messages: [
      { id: 'm-21', sender: 'Isha Menon', senderRole: 'Employer', isOffender: false, text: 'Hi Karan, our VP has an urgent customer emergency and needs to reschedule tomorrow interview to Thursday 3 PM. Apologies for the inconvenience.', timestamp: 'Oct 13, 05:45 PM' },
      { id: 'm-22', sender: 'Karan Batra', senderRole: 'Candidate', isOffender: true, text: 'Are you kidding me? You people have zero respect for candidates. You are incompetent fraudsters wasting my time.', timestamp: 'Oct 13, 05:52 PM', isReportedViolation: true },
      { id: 'm-23', sender: 'Karan Batra', senderRole: 'Candidate', isOffender: true, text: 'I am going to blast your company all over LinkedIn and make sure your recruiters get fired.', timestamp: 'Oct 13, 05:55 PM', isReportedViolation: true },
      { id: 'm-24', sender: 'Isha Menon', senderRole: 'Employer', isOffender: false, text: 'We understand your frustration, but hostile communication violates JobRisers Code of Conduct. Reporting to administration.', timestamp: 'Oct 13, 06:05 PM' },
    ],
    resolutionNotes: 'Candidate account warned and temporary 14-day messaging cooldown applied.',
  },
  {
    id: 'rep-904',
    threadId: 'conv-510',
    reportedBy: 'Priya Nair',
    reporterRole: 'Candidate',
    offendingUser: 'Rajat Varma',
    offendingRole: 'Employer',
    organization: 'Apex Logistics',
    violationReason: 'Aggressive attempts to coerce off-platform communication on WhatsApp',
    reportedAt: 'Oct 14, 2026, 09:30 AM',
    status: 'Under Review',
    evidenceCount: 2,
    messages: [
      { id: 'm-31', sender: 'Rajat Varma', senderRole: 'Employer', isOffender: true, text: 'Hello Priya, quick question. Can you share your personal cell and WhatsApp number immediately?', timestamp: 'Oct 14, 09:05 AM' },
      { id: 'm-32', sender: 'Priya Nair', senderRole: 'Candidate', isOffender: false, text: 'Hi Rajat, I prefer keeping all job discussions within the JobRisers messaging portal.', timestamp: 'Oct 14, 09:12 AM' },
      { id: 'm-33', sender: 'Rajat Varma', senderRole: 'Employer', isOffender: true, text: 'Platform chat is too slow and tracked by management. If you want this offer you need to message me privately on WhatsApp +91 98200 44123 right now.', timestamp: 'Oct 14, 09:15 AM', isReportedViolation: true },
    ],
    resolutionNotes: '',
  },
];


export const adminRecommendations: RecommendationBoostItem[] = [
  {
    id: 'rec-boost-1',
    type: 'Job',
    targetId: 'job-3001',
    targetTitle: 'Senior Product Designer',
    companyName: 'Northstar Labs',
    status: 'Pinned',
    boostWeight: '+35% Score Boost',
    reason: 'Enterprise tier hiring partner priority spotlight',
    updatedBy: 'Devika Rao',
    updatedAt: 'Oct 10, 2026',
  },
  {
    id: 'rec-boost-2',
    type: 'Job',
    targetId: 'job-3007',
    targetTitle: 'Staff Cloud Architect',
    companyName: 'Zenith HealthTech',
    status: 'Boosted',
    boostWeight: '+20% Score Boost',
    reason: 'High talent scarcity category (HealthTech Cloud)',
    updatedBy: 'Rahul Sharma',
    updatedAt: 'Oct 9, 2026',
  },
  {
    id: 'rec-boost-3',
    type: 'Job',
    targetId: 'job-3002',
    targetTitle: 'Frontend Engineer',
    companyName: 'Cloudframe',
    status: 'Boosted',
    boostWeight: '+15% Score Boost',
    reason: 'Verified remote-first listing organic boost',
    updatedBy: 'System Auto',
    updatedAt: 'Today',
  },
  {
    id: 'rec-boost-4',
    type: 'Company',
    targetId: 'emp-2004',
    targetTitle: 'All Active Listings',
    companyName: 'Vertex Works',
    status: 'Suppressed',
    boostWeight: '-100% (Excluded)',
    reason: 'Employer account suspended under safety investigation',
    updatedBy: 'System Auto',
    updatedAt: 'Oct 2, 2026',
  },
  {
    id: 'rec-boost-5',
    type: 'Job',
    targetId: 'job-3005',
    targetTitle: 'Junior Product Analyst',
    companyName: 'Pioneer Talent',
    status: 'Suppressed',
    boostWeight: '-50% Penalty',
    reason: 'Draft listing with incomplete compensation parameters',
    updatedBy: 'Devika Rao',
    updatedAt: 'Oct 6, 2026',
  },
  {
    id: 'rec-boost-6',
    type: 'Company',
    targetId: 'emp-2005',
    targetTitle: 'Featured Employer Spotlight',
    companyName: 'BrightPath Careers',
    status: 'Pinned',
    boostWeight: '+25% Score Boost',
    reason: 'Scale tier annual subscriber placement benefit',
    updatedBy: 'Maya Iyer',
    updatedAt: 'Oct 1, 2026',
  },
];

export const adminRecommendationAudits: RecommendationAuditEntry[] = [
  {
    id: 'aud-rec-1',
    model: 'v2.4-hybrid',
    metric: 'AUC-ROC Ranking Fidelity',
    score: '0.912',
    status: 'Healthy',
    details: 'Evaluated against 42,000 historical candidate apply interactions',
    evaluatedAt: 'Today, 4:00 AM',
  },
  {
    id: 'aud-rec-2',
    model: 'v2.4-hybrid',
    metric: 'Demographic Parity Check',
    score: '100% Compliant',
    status: 'Healthy',
    details: 'Zero protected attribute inputs; gender and age blindness audited',
    evaluatedAt: 'Yesterday',
  },
  {
    id: 'aud-rec-3',
    model: 'v2.4-hybrid',
    metric: 'Recency Decay Factor',
    score: '0.85 per 7 days',
    status: 'Monitoring',
    details: 'Jobs older than 14 days receive progressive score damping',
    evaluatedAt: 'Oct 8, 2026',
  },
  {
    id: 'aud-rec-4',
    model: 'v2.4-hybrid',
    metric: 'Click-Through Rate (CTR)',
    score: '28.4%',
    status: 'Healthy',
    details: 'Exceeds baseline threshold of 22% across top 5 recommendations',
    evaluatedAt: 'Today',
  },
];

export const adminMatchScoreSamples: MatchScoreSample[] = [
  {
    candidateId: 'can-1001',
    candidateName: 'Aarav Mehta',
    jobId: 'job-3001',
    jobTitle: 'Senior Product Designer',
    matchScore: 96,
    factors: { skillsMatch: 98, experienceMatch: 94, locationMatch: 95, salaryFit: 96 },
  },
  {
    candidateId: 'can-1002',
    candidateName: 'Priya Nair',
    jobId: 'job-3002',
    jobTitle: 'Frontend Engineer',
    matchScore: 88,
    factors: { skillsMatch: 92, experienceMatch: 85, locationMatch: 100, salaryFit: 84 },
  },
  {
    candidateId: 'can-1003',
    candidateName: 'Rohan Kapoor',
    jobId: 'job-3003',
    jobTitle: 'Data Platform Engineer',
    matchScore: 92,
    factors: { skillsMatch: 95, experienceMatch: 90, locationMatch: 92, salaryFit: 90 },
  },
  {
    candidateId: 'can-1006',
    candidateName: 'Ananya Sen',
    jobId: 'job-3007',
    jobTitle: 'Staff Cloud Architect',
    matchScore: 97,
    factors: { skillsMatch: 99, experienceMatch: 96, locationMatch: 94, salaryFit: 98 },
  },
];

export const adminMatchAlgorithmConfig: AdminMatchAlgorithmConfig = {
  activeVersion: 'v2.4-hybrid',
  modelName: 'Production Candidate-Job Hybrid Recommender',
  modelDescription:
    'Two-stage hybrid ranking architecture: dense neural embedding retrieval with deterministic multi-factor weighted scoring.',
  weights: {
    skills: 35,
    role: 25,
    location: 15,
    workMode: 10,
    salary: 10,
    experience: 5,
  },
  minMatchScore: 65,
  killSwitchActive: false,
  topRecommendationsCount: 5,
  refreshCadenceHours: 24,
  matchBadgeThreshold: 90,
  versionHistory: [
    {
      version: 'v2.4-hybrid',
      releaseDate: 'Oct 10, 2026',
      releasedBy: 'Devika Rao (ML Ops Lead)',
      weights: { skills: 35, role: 25, location: 15, workMode: 10, salary: 10, experience: 5 },
      minMatchScore: 65,
      changeSummary: 'Increased skills weight from 30% to 35%; boosted salary fit sensitivity.',
      isActive: true,
    },
    {
      version: 'v2.3-dense',
      releaseDate: 'Sep 24, 2026',
      releasedBy: 'Rahul Sharma (Data Platform)',
      weights: { skills: 30, role: 30, location: 15, workMode: 10, salary: 10, experience: 5 },
      minMatchScore: 60,
      changeSummary: 'Baseline release with equal skills and role relevance weighting.',
      isActive: false,
    },
    {
      version: 'v2.2-baseline',
      releaseDate: 'Aug 15, 2026',
      releasedBy: 'System Engine',
      weights: { skills: 25, role: 25, location: 20, workMode: 15, salary: 10, experience: 5 },
      minMatchScore: 55,
      changeSummary: 'Initial v2.0 matching configuration with heavy remote/work-mode weighting.',
      isActive: false,
    },
  ],
};

export const adminProfileStrengthFormula: AdminProfileStrengthFormula = {
  sectionWeights: {
    photo: 10,
    skills: 25,
    experience: 30,
    education: 15,
    resume: 10,
    summary: 10,
  },
  tiers: [
    {
      tier: 'Beginner',
      minScore: 0,
      tipText: 'Upload a professional profile photo and list at least 3 core technical skills.',
    },
    {
      tier: 'Intermediate',
      minScore: 40,
      tipText: 'Add detailed work experience bullet points and verify your highest degree credentials.',
    },
    {
      tier: 'Advanced',
      minScore: 75,
      tipText: 'Attach a verified ATS-compliant resume and write a concise career summary to reach All-Star.',
    },
    {
      tier: 'All-Star',
      minScore: 90,
      tipText: 'Profile is fully optimized! You receive highest visibility in recruiter search and feed spotlights.',
    },
  ],
};

export const adminAlgorithmAuditLogs: AdminAlgorithmAuditLogEntry[] = [
  {
    id: 'log-alg-101',
    timestamp: 'Oct 10, 2026, 04:30 PM',
    adminName: 'Devika Rao',
    changeType: 'Weight Adjustment',
    previousValue: 'Skills: 30%, Role: 30%',
    newValue: 'Skills: 35%, Role: 25%',
    status: 'Applied',
  },
  {
    id: 'log-alg-102',
    timestamp: 'Oct 08, 2026, 11:15 AM',
    adminName: 'Super Admin',
    changeType: 'Minimum Match Threshold',
    previousValue: '60%',
    newValue: '65%',
    status: 'Applied',
  },
  {
    id: 'log-alg-103',
    timestamp: 'Oct 02, 2026, 02:45 PM',
    adminName: 'Safety Caseworker',
    changeType: 'Entity Suppression',
    previousValue: 'Vertex Works (Active)',
    newValue: 'Vertex Works (-100% Excluded)',
    status: 'Applied',
  },
  {
    id: 'log-alg-104',
    timestamp: 'Sep 24, 2026, 09:00 AM',
    adminName: 'Rahul Sharma',
    changeType: 'Model Deployment',
    previousValue: 'v2.3-dense',
    newValue: 'v2.4-hybrid',
    status: 'Applied',
  },
];


export const adminEmployerPlans: EmployerPlanTier[] = [
  {
    id: 'plan-starter',
    name: 'Starter Plan',
    tier: 'Starter',
    priceMonthly: 9999,
    priceAnnual: 99990,
    currency: 'INR',
    activeSubscribers: 420,
    features: {
      jobPostingQuota: 3,
      featuredJobCredits: 1,
      teamSeats: 2,
      resumeSearchQuota: 50,
      supportSla: 'Standard email (48 hours)',
    },
    status: 'Active',
  },
  {
    id: 'plan-growth',
    name: 'Growth Tier',
    tier: 'Growth',
    priceMonthly: 24999,
    priceAnnual: 249990,
    currency: 'INR',
    activeSubscribers: 680,
    features: {
      jobPostingQuota: 15,
      featuredJobCredits: 5,
      teamSeats: 5,
      resumeSearchQuota: 250,
      supportSla: 'Priority chat & email (12 hours)',
    },
    status: 'Active',
  },
  {
    id: 'plan-scale',
    name: 'Scale Enterprise',
    tier: 'Scale Enterprise',
    priceMonthly: 69999,
    priceAnnual: 699990,
    currency: 'INR',
    activeSubscribers: 320,
    features: {
      jobPostingQuota: 'Unlimited',
      featuredJobCredits: 20,
      teamSeats: 25,
      resumeSearchQuota: 'Unlimited',
      supportSla: 'Dedicated Account Manager & 4h SLA',
    },
    status: 'Active',
  },
];

export const adminEmployerInvoices: EmployerInvoice[] = [
  {
    id: 'inv-891',
    invoiceNumber: 'INV-2026-0891',
    employerId: 'emp-2001',
    companyName: 'Northstar Labs',
    billingContact: 'Isha Menon',
    billingEmail: 'isha.menon@northstarlabs.example',
    gstin: '29ABCDE1234F1Z5',
    amountSubtotal: 340000,
    gstAmount: 61200,
    amountTotal: 401200,
    currency: 'INR',
    status: 'Paid',
    paymentMethod: 'Corporate Credit Card',
    issueDate: 'May 12, 2026',
    dueDate: 'May 26, 2026',
    paidDate: 'May 12, 2026',
  },
  {
    id: 'inv-892',
    invoiceNumber: 'INV-2026-0892',
    employerId: 'emp-2002',
    companyName: 'Cloudframe',
    billingContact: 'Vikram Sethi',
    billingEmail: 'vikram.sethi@cloudframe.example',
    gstin: '27AABCC5544K1ZR',
    amountSubtotal: 24999,
    gstAmount: 4499.82,
    amountTotal: 29498.82,
    currency: 'INR',
    status: 'Paid',
    paymentMethod: 'Razorpay UPI',
    issueDate: 'Aug 4, 2026',
    dueDate: 'Aug 18, 2026',
    paidDate: 'Aug 4, 2026',
  },
  {
    id: 'inv-893',
    invoiceNumber: 'INV-2026-0893',
    employerId: 'emp-2006',
    companyName: 'Zenith HealthTech',
    billingContact: 'Dr. Arishta Saxena',
    billingEmail: 'arishta.saxena@zenithhealth.example',
    gstin: '29AAACZ9876Q1Z0',
    amountSubtotal: 249990,
    gstAmount: 44998.2,
    amountTotal: 294988.2,
    currency: 'INR',
    status: 'Paid',
    paymentMethod: 'Net Banking',
    issueDate: 'Jul 19, 2026',
    dueDate: 'Aug 2, 2026',
    paidDate: 'Jul 19, 2026',
  },
  {
    id: 'inv-894',
    invoiceNumber: 'INV-2026-0894',
    employerId: 'emp-2003',
    companyName: 'Pioneer Talent',
    billingContact: 'Neha Arora',
    billingEmail: 'neha.arora@pioneer.example',
    gstin: '07AAECP1122D1Z9',
    amountSubtotal: 9999,
    gstAmount: 1799.82,
    amountTotal: 11798.82,
    currency: 'INR',
    status: 'Pending',
    paymentMethod: 'Stripe Auto-debit',
    issueDate: 'Sep 18, 2026',
    dueDate: 'Oct 18, 2026',
  },
  {
    id: 'inv-895',
    invoiceNumber: 'INV-2026-0895',
    employerId: 'emp-2004',
    companyName: 'Vertex Works',
    billingContact: 'Amit Rao',
    billingEmail: 'amit.rao@vertex.example',
    gstin: '36AAECV9988C1Z1',
    amountSubtotal: 9999,
    gstAmount: 1799.82,
    amountTotal: 11798.82,
    currency: 'INR',
    status: 'Failed',
    paymentMethod: 'Corporate Credit Card',
    issueDate: 'Oct 1, 2026',
    dueDate: 'Oct 15, 2026',
  },
];

export const adminJobPackages: EmployerJobPackage[] = [
  {
    id: 'pkg-1',
    name: '1-Job Listing Pack',
    jobQuantity: 1,
    price: 4999,
    currency: 'INR',
    validityDays: 30,
    featuredCredits: 0,
    status: 'Active',
    description: 'Single standard job posting credit valid for 30 days. Perfect for urgent one-off specialist hiring.',
  },
  {
    id: 'pkg-2',
    name: '5-Job Growth Bundle',
    jobQuantity: 5,
    price: 19999,
    currency: 'INR',
    validityDays: 60,
    featuredCredits: 1,
    status: 'Active',
    description: 'Bulk listing bundle for scaling teams. Includes 1 complimentary Featured Job Spotlight boost.',
  },
  {
    id: 'pkg-3',
    name: '10-Job Scale Bundle',
    jobQuantity: 10,
    price: 34999,
    currency: 'INR',
    validityDays: 90,
    featuredCredits: 3,
    status: 'Active',
    description: 'Maximum volume recruiting package with 3 Featured Spotlight boosts and 90-day validity.',
  },
  {
    id: 'pkg-4',
    name: '3-Featured Spotlight Pack',
    jobQuantity: 0,
    price: 7499,
    currency: 'INR',
    validityDays: 45,
    featuredCredits: 3,
    status: 'Active',
    description: 'Standalone spotlight boost pack. Pins live job posts to the top of search rankings and recommendations.',
  },
];

export const adminBillingCredits: EmployerBillingCreditEntry[] = [
  {
    id: 'crd-301',
    employerId: 'emp-2001',
    companyName: 'Northstar Labs',
    creditType: 'Featured Spotlight',
    amountOrCredits: '2 Boosts',
    reason: 'Enterprise annual tier renewal loyalty bonus',
    date: 'Oct 11, 2026',
    status: 'Available',
  },
  {
    id: 'crd-302',
    employerId: 'emp-2002',
    companyName: 'Cloudframe',
    creditType: 'Job Posting',
    amountOrCredits: '1 Job Post',
    reason: 'Goodwill compensation for scheduled maintenance window',
    date: 'Oct 04, 2026',
    status: 'Redeemed',
  },
  {
    id: 'crd-303',
    employerId: 'emp-2003',
    companyName: 'Pioneer Talent',
    creditType: 'Promotional Waiver',
    amountOrCredits: '₹2,500 Fee Offset',
    reason: 'Welcome onboarding completion promotional rebate',
    date: 'Sep 25, 2026',
    status: 'Available',
  },
  {
    id: 'crd-304',
    employerId: 'emp-2006',
    companyName: 'Zenith HealthTech',
    creditType: 'Featured Spotlight',
    amountOrCredits: '5 Boosts',
    reason: 'High-volume healthcare talent scarcity partnership allocation',
    date: 'Aug 14, 2026',
    status: 'Available',
  },
];

export const adminRefundRequests: EmployerRefundRequest[] = [
  {
    id: 'ref-901',
    invoiceId: 'inv-894',
    employerId: 'emp-2003',
    companyName: 'Pioneer Talent',
    amount: 11798.82,
    currency: 'INR',
    reason: 'Accidental duplicate plan upgrade initiated by secondary team administrator',
    requestedDate: 'Oct 12, 2026',
    status: 'Pending Review',
  },
  {
    id: 'ref-902',
    invoiceId: 'inv-892',
    employerId: 'emp-2002',
    companyName: 'Cloudframe',
    amount: 4499.82,
    currency: 'INR',
    reason: 'GST input credit pass-through recalculation adjustment',
    requestedDate: 'Sep 28, 2026',
    status: 'Approved',
    notes: 'Approved by Finance; credited back via Razorpay gateway.',
  },
  {
    id: 'ref-903',
    invoiceId: 'inv-889',
    employerId: 'emp-2004',
    companyName: 'Vertex Works',
    amount: 9999.00,
    currency: 'INR',
    reason: 'Requested refund past 30-day window following account safety suspension',
    requestedDate: 'Oct 03, 2026',
    status: 'Rejected',
    notes: 'Rejected by Finance: Employer account suspended under fraud investigation.',
  },
];

export const adminPaymentDisputes: EmployerPaymentDispute[] = [
  {
    id: 'disp-701',
    invoiceId: 'inv-895',
    employerId: 'emp-2004',
    companyName: 'Vertex Works',
    amount: 11798.82,
    currency: 'INR',
    status: 'Open',
    reason: 'Chargeback filed: unauthorized recurring charge claim following safety suspension',
    filingDate: 'Oct 05, 2026',
    gateway: 'Stripe Chargeback',
    resolutionNotes: 'Under review with acquiring bank; merchant evidence packet submitted.',
  },
  {
    id: 'disp-702',
    invoiceId: 'inv-893',
    employerId: 'emp-2006',
    companyName: 'Zenith HealthTech',
    amount: 44998.20,
    currency: 'INR',
    status: 'Under Investigation',
    reason: 'Corporate Net Banking double-debit inquiry logged by treasury',
    filingDate: 'Oct 09, 2026',
    gateway: 'HDFC Corporate NetBanking',
    resolutionNotes: 'Awaiting bank clearance confirmation ledger from payment operations.',
  },
  {
    id: 'disp-703',
    invoiceId: 'inv-890',
    employerId: 'emp-2005',
    companyName: 'BrightPath Careers',
    amount: 29498.82,
    currency: 'INR',
    status: 'Resolved',
    reason: 'Bank gateway timeout during auto-debit reconciled via credit note',
    filingDate: 'Sep 22, 2026',
    gateway: 'Razorpay Auto-debit',
    resolutionNotes: 'Resolved: Credit memo issued and duplicate charge neutralized.',
  },
];

export const adminPaywallRules: EmployerPaywallRules = {
  enforceJobPostingQuota: true,
  enforceResumeSearchQuota: true,
  unverifiedEmployerPublishingRestricted: true,
  allowDraftsForUnverified: true,
  gracePeriodDaysAfterFailure: 7,
};


export function filterDirectoryRecords(
  kind: DirectoryKind,
  rows: DirectoryRecord[],
  query: string,
  status: string,
) {
  const search = query.trim().toLowerCase();
  const selectedStatus = status.toLowerCase();

  return rows.filter((row) => {
    const haystack = Object.values(row).join(' ').toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const statusText =
      kind === 'employers'
        ? `${(row as AdminEmployer).status} ${(row as AdminEmployer).verification}`
        : (row as AdminCandidate | AdminJob).status;
    const matchesStatus =
      status === 'All statuses' || statusText.toLowerCase().includes(selectedStatus);

    return matchesSearch && matchesStatus;
  });
}

export interface CandidateFilterOptions {
  query?: string;
  status?: string;
  location?: string;
  source?: string;
  completionRange?: string; // 'All' | '<50%' | '50-79%' | '80-99%' | '100%'
  proStatus?: string; // 'All' | 'Pro' | 'Free'
  openToRemote?: string; // 'All' | 'Yes' | 'No'
  visibleToEmployers?: string; // 'All' | 'Yes' | 'No'
  verificationStatus?: string; // 'All' | 'Verified' | 'Pending' | 'Unverified'
  signupDateRange?: string; // 'All time' | 'Last 7 days' | 'Last 30 days' | 'Last 90 days'
}

export function filterCandidateRecords(
  candidates: AdminCandidate[],
  filters: CandidateFilterOptions
): AdminCandidate[] {
  return candidates.filter((c) => {
    // Search query on name, email, headline, skills
    if (filters.query?.trim()) {
      const q = filters.query.trim().toLowerCase();
      const inName = c.name?.toLowerCase().includes(q);
      const inEmail = (c.emailFull || c.emailMasked)?.toLowerCase().includes(q);
      const inHeadline = c.headline?.toLowerCase().includes(q);
      const inSkills = c.skills?.some((s) => s.toLowerCase().includes(q));
      if (!inName && !inEmail && !inHeadline && !inSkills) return false;
    }

    // Status
    if (filters.status && filters.status !== 'All statuses') {
      if (c.status.toLowerCase() !== filters.status.toLowerCase()) return false;
    }

    // Location
    if (filters.location && filters.location !== 'All locations') {
      if (!c.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    }

    // Source
    if (filters.source && filters.source !== 'All sources') {
      if (c.source?.toLowerCase() !== filters.source.toLowerCase()) return false;
    }

    // Completion range
    if (filters.completionRange && filters.completionRange !== 'All') {
      const comp = c.completion || 0;
      if (filters.completionRange === '<50%' && comp >= 50) return false;
      if (filters.completionRange === '50-79%' && (comp < 50 || comp > 79)) return false;
      if (filters.completionRange === '80-99%' && (comp < 80 || comp > 99)) return false;
      if (filters.completionRange === '100%' && comp !== 100) return false;
    }

    // Pro status
    if (filters.proStatus && filters.proStatus !== 'All') {
      if (filters.proStatus === 'Pro' && !c.pro) return false;
      if (filters.proStatus === 'Free' && c.pro) return false;
    }

    // Open to remote
    if (filters.openToRemote && filters.openToRemote !== 'All') {
      if (filters.openToRemote === 'Yes' && !c.openToRemote) return false;
      if (filters.openToRemote === 'No' && c.openToRemote) return false;
    }

    // Visible to employers
    if (filters.visibleToEmployers && filters.visibleToEmployers !== 'All') {
      if (filters.visibleToEmployers === 'Yes' && !c.visibleToEmployers) return false;
      if (filters.visibleToEmployers === 'No' && c.visibleToEmployers) return false;
    }

    // Verification status
    if (filters.verificationStatus && filters.verificationStatus !== 'All') {
      const isVer = c.isEmailVerified;
      if (filters.verificationStatus === 'Verified' && !isVer) return false;
      if (filters.verificationStatus === 'Pending' && c.status !== 'Pending') return false;
      if (filters.verificationStatus === 'Unverified' && isVer) return false;
    }

    return true;
  });
}

export function reviewStatus(decision: ReviewDecision) {
  if (decision === 'approve') return 'Live';
  if (decision === 'reject') return 'Rejected';
  return 'Draft';
}

export const moduleDetails: Record<string, { icon: typeof ClipboardList; title: string; hint: string; sections: string[] }> = {
  applications: { icon: ClipboardList, title: 'Applications oversight', hint: 'Monitor application activity and keep candidate and employer workflows visible.', sections: ['All applications', 'Abuse monitor', 'Stage mapping'] },
  'master-data': { icon: ListFilter, title: 'Shared marketplace taxonomy', hint: 'Maintain categories, roles, skills, industries, locations and filters.', sections: ['Categories', 'Roles', 'Skills', 'Industries', 'Locations', 'Filters', 'Benefits'] },
  content: { icon: FileText, title: 'Content operations', hint: 'Manage CMS pages alongside transactional email templates.', sections: ['Landing page', 'Career advice', 'Static pages', 'Banners and cards', 'Email templates', 'Media library'] },
  'resume-pro': { icon: Sparkles, title: 'Resume Pro operations', hint: 'Operate templates, plans, subscriptions and refund workflows.', sections: ['Templates', 'Plans and pricing', 'Subscriptions', 'Invoices and refunds', 'Coupons'] },
  communication: { icon: Bell, title: 'Communication operations', hint: 'Coordinate platform alerts and broadcasts, with delivery visibility.', sections: ['Job alerts', 'Broadcasts', 'Notification triggers', 'Delivery logs'] },
  'trust-safety': { icon: ShieldAlert, title: 'Safety casework', hint: 'Review reports, blacklist records and fraud signals.', sections: ['Reports', 'Flagged messages', 'Blacklists', 'Fraud signals'] },
  support: { icon: CircleHelp, title: 'Support queue', hint: 'Keep candidate and employer support requests moving with clear ownership.', sections: ['Tickets', 'Canned responses'] },
  analytics: { icon: Activity, title: 'Marketplace reporting', hint: 'Track growth, funnel movement, search and revenue reports.', sections: ['Growth', 'Funnel', 'Search insights', 'Revenue', 'Scheduled reports'] },
  settings: { icon: Settings2, title: 'Platform governance', hint: 'Manage platform controls, role access, compliance and audit history.', sections: ['Platform', 'Auth providers', 'Roles and admins', 'Feature flags', 'Compliance', 'Integrations', 'Audit log'] },
};

export type WorkspaceRecord = { section: string; title: string; detail: string; status: string; updated: string };

export const moduleRecords: Record<string, WorkspaceRecord[]> = {
  applications: [
    { section: 'All applications', title: 'Aarav Mehta → Senior Product Designer', detail: 'Northstar Labs · applied 2 hours ago', status: 'Applied', updated: '2 hr ago' },
    { section: 'All applications', title: 'Priya Nair → Frontend Engineer', detail: 'Cloudframe · shortlisted for screening', status: 'Shortlisted', updated: '46 min ago' },
    { section: 'All applications', title: 'Rohan Kapoor → Data Platform Engineer', detail: 'Cloudframe · technical interview scheduled', status: 'Interview', updated: 'Today' },
    { section: 'All applications', title: 'Kabir Shah → Growth Marketing Manager', detail: 'Northstar Labs · compensation offer extended', status: 'Offered', updated: 'Oct 8' },
    { section: 'All applications', title: 'Ananya Sen → Staff Cloud Architect', detail: 'Zenith HealthTech · architecture panel review', status: 'Interview', updated: 'Oct 12' },
    { section: 'All applications', title: 'Meera Iyer → Customer Success Lead', detail: 'BrightPath Careers · closed following relocation constraint', status: 'Rejected', updated: 'Oct 3' },
    { section: 'Abuse monitor', title: 'Mass-apply pattern detected', detail: 'Candidate ID can-1094 applied to 400 jobs via script', status: 'Flagged', updated: '15 min ago' },
    { section: 'Abuse monitor', title: 'Duplicate resume payload spam', detail: 'Candidate ID can-1102 submitted identical resume 45 times in 10 mins', status: 'Blocked', updated: '2 hr ago' },
    { section: 'Abuse monitor', title: 'Disposable temporary domain cluster', detail: '28 signups originating from 10minutemail.de gateway', status: 'Rate limited', updated: 'Today' },
    { section: 'Abuse monitor', title: 'Rapid-fire recruiter profile scraper', detail: 'Automated crawler detected scraping candidate emails at 60 req/min', status: 'Banned', updated: 'Yesterday' },
    { section: 'Abuse monitor', title: 'Unverified agency bulk posting', detail: 'Account attempting to bypass employer verification checks with duplicate CIN', status: 'Investigating', updated: 'Oct 11' },
    { section: 'Stage mapping', title: 'Applied → Applied', detail: 'Step 1 · Candidate receipt confirmation & ATS parsing · Email notification enabled', status: 'Active', updated: 'Oct 12' },
    { section: 'Stage mapping', title: 'Under Review → Screening', detail: 'Step 2 · Recruiter qualification evaluation & CV review · Email notification enabled', status: 'Active', updated: 'Oct 11' },
    { section: 'Stage mapping', title: 'Interview Scheduled → Interview', detail: 'Step 3 · Technical & hiring manager interview rounds · Calendar invites enabled', status: 'Active', updated: 'Oct 10' },
    { section: 'Stage mapping', title: 'Offer Received → Offered', detail: 'Step 4 · Formal compensation & employment contract stage · High priority trigger', status: 'Active', updated: 'Oct 9' },
    { section: 'Stage mapping', title: 'Not Selected → Rejected', detail: 'Step 5 · Polite candidate feedback loop · Respectful notification enabled', status: 'Active', updated: 'Oct 8' },
    { section: 'Stage mapping', title: 'Withdrawn → Closed', detail: 'Step 6 · Candidate withdrawal or job expiration · Archived record', status: 'Active', updated: 'Oct 5' },
  ],
  'master-data': [
    { section: 'Categories', title: 'Technology & Software', detail: 'Category · 1,486 live jobs · 12,400 candidates mapped', status: 'Active', updated: '42 min ago' },
    { section: 'Categories', title: 'Marketing & Growth', detail: 'Category · 452 live jobs · 4,200 candidates mapped', status: 'Active', updated: 'Yesterday' },
    { section: 'Categories', title: 'Finance & Accounting', detail: 'Category · 318 live jobs · 3,100 candidates mapped', status: 'Active', updated: 'Oct 10' },
    { section: 'Categories', title: 'Healthcare & Life Sciences', detail: 'Category · 210 live jobs · 1,850 candidates mapped', status: 'Active', updated: 'Oct 8' },
    { section: 'Categories', title: 'Design & Creative', detail: 'Category · 184 live jobs · 2,400 candidates mapped', status: 'Active', updated: 'Sep 29' },
    { section: 'Roles', title: 'Product Designer', detail: 'Role · maps to Design & Creative · 84 live jobs', status: 'Active', updated: 'Yesterday' },
    { section: 'Roles', title: 'Frontend Engineer', detail: 'Role · maps to Technology & Software · 214 live jobs', status: 'Active', updated: '2 hr ago' },
    { section: 'Roles', title: 'Data Platform Engineer', detail: 'Role · maps to Technology & Software · 96 live jobs', status: 'Active', updated: 'Today' },
    { section: 'Roles', title: 'Customer Success Lead', detail: 'Role · maps to Operations & Support · 62 live jobs', status: 'Active', updated: 'Oct 11' },
    { section: 'Roles', title: 'Staff Cloud Architect', detail: 'Role · maps to Technology & Software · 45 live jobs', status: 'Active', updated: 'Oct 9' },
    { section: 'Skills', title: 'Product analytics', detail: 'Skill · 1,209 profiles · suggested by users', status: 'Review suggested', updated: '18 min ago' },
    { section: 'Skills', title: 'Apache Kafka & Streaming', detail: 'Skill · 842 profiles · 68 job requirements', status: 'Active', updated: 'Oct 10' },
    { section: 'Skills', title: 'React 19 & Next.js', detail: 'Skill · 2,410 profiles · 190 job requirements', status: 'Active', updated: 'Oct 8' },
    { section: 'Skills', title: 'Figma Design Tokens', detail: 'Skill · 620 profiles · 34 job requirements', status: 'Active', updated: 'Oct 4' },
    { section: 'Skills', title: 'HIPAA & Health Data Compliance', detail: 'Skill · 112 profiles · 14 job requirements', status: 'Active', updated: 'Oct 1' },
    { section: 'Industries', title: 'SaaS & Enterprise Cloud', detail: 'Industry · 840 companies mapped', status: 'Active', updated: 'Oct 3' },
    { section: 'Industries', title: 'EdTech & Vocational Training', detail: 'Industry · 290 companies mapped', status: 'Active', updated: 'Oct 5' },
    { section: 'Industries', title: 'FinTech & Digital Payments', detail: 'Industry · 610 companies mapped', status: 'Active', updated: 'Sep 28' },
    { section: 'Industries', title: 'Healthcare & HealthTech', detail: 'Industry · 340 companies mapped', status: 'Active', updated: 'Oct 7' },
    { section: 'Industries', title: 'Recruitment & Staffing', detail: 'Industry · 180 companies mapped', status: 'Active', updated: 'Sep 22' },
    { section: 'Locations', title: 'Bengaluru, KA', detail: 'Tier 1 Metro · 4,200 jobs mapped · Hub Indiranagar/Koramangala', status: 'Active', updated: 'Oct 1' },
    { section: 'Locations', title: 'Pune, MH', detail: 'Tier 1 Metro · 1,840 jobs mapped · Hinjewadi / Magarpatta', status: 'Active', updated: 'Oct 4' },
    { section: 'Locations', title: 'Mumbai, MH', detail: 'Tier 1 Metro · 2,100 jobs mapped · BKC / Andheri', status: 'Active', updated: 'Oct 2' },
    { section: 'Locations', title: 'Delhi NCR, DL/HR', detail: 'Tier 1 Metro · 3,450 jobs mapped · Cyber City / Noida', status: 'Active', updated: 'Sep 30' },
    { section: 'Locations', title: 'Hyderabad, TS', detail: 'Tier 1 Metro · 2,680 jobs mapped · HITEC City / Gachibowli', status: 'Active', updated: 'Oct 6' },
    { section: 'Filters', title: 'Salary range (LPA)', detail: 'Filter config · buckets 0-3, 3-6, 6-12, 12-25, 25+ LPA · defaults INR', status: 'Visible', updated: 'Sep 28' },
    { section: 'Filters', title: 'Work Mode (Remote / Hybrid / On site)', detail: 'Filter config · multi-select enabled · facet counts active', status: 'Visible', updated: 'Oct 2' },
    { section: 'Filters', title: 'Experience Level', detail: 'Filter config · Entry (0-2y), Mid (2-5y), Senior (5-8y), Lead (8+y)', status: 'Visible', updated: 'Oct 4' },
    { section: 'Filters', title: 'Job Type', detail: 'Filter config · Full time, Part time, Contract, Internship', status: 'Visible', updated: 'Sep 25' },
    { section: 'Filters', title: 'Date Posted', detail: 'Filter config · Past 24h, Past week, Past month, Any time', status: 'Visible', updated: 'Oct 1' },
    { section: 'Benefits', title: 'Comprehensive Health Insurance', detail: 'Benefit icon + label · 84% employer adoption', status: 'Active', updated: 'Sep 15' },
    { section: 'Benefits', title: 'Flexible Hybrid Work', detail: 'Benefit icon + label · 92% employer adoption', status: 'Active', updated: 'Oct 1' },
    { section: 'Benefits', title: 'Annual Learning & Conference Stipend', detail: 'Benefit icon + label · 48% employer adoption', status: 'Active', updated: 'Oct 6' },
    { section: 'Benefits', title: 'Ergonomic Home Office Allowance', detail: 'Benefit icon + label · 52% employer adoption', status: 'Active', updated: 'Sep 20' },
    { section: 'Benefits', title: 'Employee Stock Options (ESOPs)', detail: 'Benefit icon + label · 38% employer adoption', status: 'Active', updated: 'Oct 3' },
  ],
  content: [
    { section: 'Landing page', title: 'Hero Headline & Tagline', detail: 'CMS block · "Better jobs. Brighter futures." · highlighted words config', status: 'Published', updated: 'Oct 6' },
    { section: 'Landing page', title: 'Search Chip Taxonomy', detail: 'Chips: Remote, Software Engineer, Product Manager, Data Analyst, Design', status: 'Published', updated: 'Oct 8' },
    { section: 'Landing page', title: 'Platform Counters Banner', detail: 'Stats: 50K+ Active Jobs, 10K+ Companies, 1M+ Job Seekers, 95% Success Stories', status: 'Published', updated: 'Today' },
    { section: 'Landing page', title: 'Trusted By Enterprise Logos Strip', detail: 'Logos: Amazon, Adobe, Microsoft, Infosys, Tata · permission flags verified', status: 'Published', updated: 'Sep 28' },
    { section: 'Career advice', title: 'How to stand out in a competitive job market', detail: 'Article · author Maya Iyer · featured placement · 12.4K views', status: 'Published', updated: 'Today' },
    { section: 'Career advice', title: 'Transitioning from Senior to Staff Engineer', detail: 'Article · author Rahul Sharma · career guide · 8.2K views', status: 'Published', updated: 'Oct 10' },
    { section: 'Career advice', title: 'Negotiating tech compensation in Indian tech hubs', detail: 'Article · author Devika Rao · salary guide · 15.1K views', status: 'Published', updated: 'Oct 7' },
    { section: 'Career advice', title: 'Mastering the async remote technical interview', detail: 'Article · author Maya Iyer · interview prep · draft revision', status: 'Draft', updated: 'Oct 12' },
    { section: 'Static pages', title: 'Candidate Rights & Privacy Charter', detail: 'Version 2.1 · DPDP Act compliance · mandatory re-consent enabled', status: 'Published', updated: 'Oct 6' },
    { section: 'Static pages', title: 'Terms of Service', detail: 'Version 3.0 · employer billing and refund terms incorporated', status: 'Published', updated: 'Sep 15' },
    { section: 'Static pages', title: 'Privacy & Cookie Policy', detail: 'Version 2.4 · third-party telemetry disclosure updated', status: 'Published', updated: 'Oct 1' },
    { section: 'Static pages', title: 'Employer Code of Conduct & Anti-Scam Rules', detail: 'Version 1.8 · prohibits recruitment fees and off-platform contact', status: 'Published', updated: 'Sep 22' },
    { section: 'Banners and cards', title: 'Resume upload prompt card', detail: 'Target: Candidates with <50% completion · India region', status: 'Scheduled', updated: 'Oct 8' },
    { section: 'Banners and cards', title: 'Candidate Pro early-access banner', detail: 'Target: Active job seekers without Pro subscription', status: 'Published', updated: 'Oct 10' },
    { section: 'Banners and cards', title: 'Employer verification badge spotlight', detail: 'Target: Newly registered companies on step 2', status: 'Published', updated: 'Oct 4' },
    { section: 'Banners and cards', title: 'Mobile browser app installation nudge', detail: 'Target: iOS & Android mobile web sessions', status: 'Paused', updated: 'Sep 18' },
    { section: 'Email templates', title: 'Application viewed notification', detail: 'Transactional · 4 variables · trigger on employer review', status: 'Active', updated: 'Oct 5' },
    { section: 'Email templates', title: 'Interview invite & calendar attachment', detail: 'Transactional · 6 variables · ICS calendar attachment included', status: 'Active', updated: 'Oct 8' },
    { section: 'Email templates', title: 'Employer verification outcome', detail: 'Transactional · 3 variables · includes approval or rejection note', status: 'Active', updated: 'Oct 11' },
    { section: 'Email templates', title: 'Password reset & 2FA recovery link', detail: 'Transactional · 2 variables · 15-minute token expiry', status: 'Active', updated: 'Sep 14' },
    { section: 'Email templates', title: 'Weekly personalized job recommendations digest', detail: 'Marketing digest · 8 variables · respects user notification consent', status: 'Active', updated: 'Today' },
    { section: 'Media library', title: 'hero-bg-v3.jpg', detail: 'Image · 1.2MB · 1920x1080 · hero background banner', status: 'Active', updated: 'Oct 1' },
    { section: 'Media library', title: 'company-placeholder-logo.svg', detail: 'Vector SVG · 14KB · default avatar for unbranded employers', status: 'Active', updated: 'Aug 20' },
    { section: 'Media library', title: 'resume-pro-preview-badge.png', detail: 'Image · 240KB · 600x400 · ATS score certification badge', status: 'Active', updated: 'Sep 12' },
    { section: 'Media library', title: 'trust-shield-verified.svg', detail: 'Vector SVG · 8KB · verification checkmark for company cards', status: 'Active', updated: 'Aug 15' },
    { section: 'Media library', title: 'og-marketplace-preview.png', detail: 'Image · 850KB · 1200x630 · OpenGraph meta share image', status: 'Active', updated: 'Oct 4' },
  ],
  'resume-pro': [
    { section: 'Templates', title: 'Modern Split · v2.4', detail: 'ATS validated · 2-column sidebar · display order 1', status: 'Published', updated: 'Oct 6' },
    { section: 'Templates', title: 'Tech Mono · v1.8', detail: 'Pro tier · monospace developer emphasis · compact layout', status: 'Published', updated: 'Oct 4' },
    { section: 'Templates', title: 'Executive Serif · v3.1', detail: 'Pro tier · traditional executive leadership typography', status: 'Published', updated: 'Oct 2' },
    { section: 'Templates', title: 'Minimalist Clean · v2.0', detail: 'Standard Free tier · clean single-column layout', status: 'Published', updated: 'Sep 28' },
    { section: 'Templates', title: 'Compact Engineering · v1.5', detail: 'ATS validated · dense technical skills matrix', status: 'Published', updated: 'Sep 15' },
    { section: 'Plans and pricing', title: 'JobRisers Pro · Monthly', detail: 'USD 9.99/mo · 7-day money-back guarantee · unmetered downloads', status: 'Active', updated: 'Oct 1' },
    { section: 'Plans and pricing', title: 'JobRisers Pro · Annual', detail: 'USD 79.99/yr · 33% discount · priority recruiter indexing included', status: 'Active', updated: 'Oct 1' },
    { section: 'Plans and pricing', title: 'Standard Free Tier', detail: 'USD 0 · 1 watermarked export · basic templates access', status: 'Active', updated: 'Aug 10' },
    { section: 'Plans and pricing', title: 'Premium Career Booster', detail: 'USD 14.99/mo · includes AI bullet rewriter and mock interview prep', status: 'Draft', updated: 'Oct 12' },
    { section: 'Subscriptions', title: 'sub_1P8xYz99120', detail: 'Aarav Mehta · Pro Monthly · Auto-renews Nov 2 · Stripe gateway', status: 'Active', updated: 'Today' },
    { section: 'Subscriptions', title: 'sub_1Q4wRt88231', detail: 'Rohan Kapoor · Pro Annual · Auto-renews Oct 2027 · Razorpay gateway', status: 'Active', updated: 'Oct 2' },
    { section: 'Subscriptions', title: 'sub_1R9mKl77112', detail: 'Priya Nair · 7-Day Trial · Expires in 4 days', status: 'Active', updated: 'Oct 8' },
    { section: 'Subscriptions', title: 'sub_1T2pVx66543', detail: 'Meera Iyer · Pro Monthly · Account suspended · Renewal paused', status: 'Suspended', updated: 'Yesterday' },
    { section: 'Invoices and refunds', title: 'RF-2281 · Candidate refund request', detail: 'USD 9.99 · Meera Iyer · within 7-day guarantee window', status: 'Needs approval', updated: '31 min ago' },
    { section: 'Invoices and refunds', title: 'INV-PRO-8941 · Aarav Mehta', detail: 'USD 9.99 · Paid via Stripe · Invoice PDF generated', status: 'Paid', updated: 'Today' },
    { section: 'Invoices and refunds', title: 'RF-2280 · Duplicate charge refund', detail: 'USD 9.99 · Approved by Finance · credit note issued', status: 'Resolved', updated: 'Yesterday' },
    { section: 'Invoices and refunds', title: 'INV-PRO-8938 · Rohan Kapoor', detail: 'USD 79.99 · Paid via Razorpay UPI · GST credit pass-through', status: 'Paid', updated: 'Oct 2' },
    { section: 'Invoices and refunds', title: 'RF-2279 · Dispute out of policy', detail: 'USD 9.99 · Requested past 30 days · rejected by Finance', status: 'Rejected', updated: 'Sep 29' },
    { section: 'Coupons', title: 'WINTER25', detail: '25% off first 3 months · 100 redemptions left · Pro Monthly', status: 'Active', updated: 'Oct 2' },
    { section: 'Coupons', title: 'NEWCAREER50', detail: '50% off first month · first-time candidate promotion', status: 'Active', updated: 'Oct 5' },
    { section: 'Coupons', title: 'CAMPUS2026', detail: 'Free 60-day Pro access for verified university student emails', status: 'Active', updated: 'Sep 1' },
    { section: 'Coupons', title: 'FLASHPRO10', detail: '10% recurring discount · expired promotional flash campaign', status: 'Expired', updated: 'Aug 30' },
  ],
  communication: [
    { section: 'Job alerts', title: 'Senior Product Designer · Bengaluru', detail: '1,284 subscribers · daily digest frequency · 94% delivery rate', status: 'Active', updated: 'Today' },
    { section: 'Job alerts', title: 'Frontend Engineer (React) · Remote India', detail: '3,410 subscribers · instant alert frequency · 97% delivery rate', status: 'Active', updated: 'Today' },
    { section: 'Job alerts', title: 'Data Platform Engineer · Pune / Hybrid', detail: '890 subscribers · weekly digest frequency', status: 'Active', updated: 'Yesterday' },
    { section: 'Job alerts', title: 'Growth Marketing Lead · Mumbai', detail: '640 subscribers · daily digest frequency', status: 'Active', updated: 'Oct 11' },
    { section: 'Job alerts', title: 'Staff Cloud Architect · Hyderabad', detail: '420 subscribers · daily digest frequency', status: 'Active', updated: 'Oct 10' },
    { section: 'Broadcasts', title: 'New resume templates are here', detail: 'Email campaign · 14,200 Pro subscribers · 42% open rate', status: 'Scheduled', updated: 'Oct 8' },
    { section: 'Broadcasts', title: 'Platform update: 1-Click Apply is live', detail: 'In-app & push notification · all candidates · 89K recipients', status: 'Published', updated: 'Oct 1' },
    { section: 'Broadcasts', title: 'Scheduled system maintenance announcement', detail: 'Email banner · all active employers · 2 hr window on Sunday', status: 'Scheduled', updated: 'Yesterday' },
    { section: 'Broadcasts', title: 'Quarterly career insights newsletter', detail: 'Email · opt-in candidate newsletter audience', status: 'Draft', updated: 'Oct 12' },
    { section: 'Notification triggers', title: 'Application status changed', detail: 'Trigger: employer moves candidate stage · Email & In-app', status: 'Active', updated: 'Sep 10' },
    { section: 'Notification triggers', title: 'Interview invitation scheduled', detail: 'Trigger: interview confirmed · Email + ICS + SMS reminder', status: 'Active', updated: 'Sep 18' },
    { section: 'Notification triggers', title: 'Employer verification decision', detail: 'Trigger: admin decision in queue · Email to company owner', status: 'Active', updated: 'Oct 2' },
    { section: 'Notification triggers', title: 'Job listing expiring in 48 hours', detail: 'Trigger: cron job reaches deadline-48h · Email to employer', status: 'Active', updated: 'Oct 5' },
    { section: 'Notification triggers', title: 'Subscription payment successful', detail: 'Trigger: Stripe/Razorpay webhook · Invoice receipt email', status: 'Active', updated: 'Today' },
    { section: 'Notification triggers', title: 'Safety scam keyword warning', detail: 'Trigger: prohibited payment request detected · In-app warning banner', status: 'Active', updated: 'Today' },
    { section: 'Delivery logs', title: 'Payment failure dunning notifications', detail: 'Email · 286 sent · 9 retries in progress · SES provider', status: 'Monitoring', updated: 'Today' },
    { section: 'Delivery logs', title: 'Application status push alerts', detail: 'Push · 4,120 sent · 98.4% delivered · FCM gateway', status: 'Operational', updated: '12 min ago' },
    { section: 'Delivery logs', title: 'Interview confirmation SMS messages', detail: 'SMS · 340 sent · 99.1% delivered · Twilio gateway', status: 'Operational', updated: '1 hr ago' },
    { section: 'Delivery logs', title: 'Password reset token emails', detail: 'Email · 182 sent · 0 bounces · SES priority pool', status: 'Operational', updated: '15 min ago' },
    { section: 'Delivery logs', title: 'Weekly job alert digest batch', detail: 'Email · 48,200 sent · 24 bounces suppressed', status: 'Operational', updated: '4 hr ago' },
    { section: 'Delivery logs', title: 'Marketing campaign: Resume upgrade promo', detail: 'Email · 12,000 sent · 14 unsubscribes recorded', status: 'Operational', updated: 'Yesterday' },
  ],
  'trust-safety': [
    { section: 'Reports', title: 'JR-J5830 · Suspicious external contact link in listing', detail: 'Reported by 2 candidates · Cloudframe job listing · assigned to Maya', status: 'High priority', updated: '12 min ago' },
    { section: 'Reports', title: 'JR-E2094 · Fake employer domain impersonating MNC', detail: 'Reported by Trust Bot · domain info-tcs-careers.net · assigned to Rahul', status: 'Investigating', updated: '45 min ago' },
    { section: 'Reports', title: 'JR-C1094 · Candidate mass-apply bot script abuse', detail: 'Candidate ID can-1094 applied to 400 listings in 3 minutes', status: 'Suspended', updated: '2 hr ago' },
    { section: 'Reports', title: 'JR-M8812 · Abusive recruiter asking for upfront training fee', detail: 'Reported by Meera Iyer against Vertex Works · transcript locked', status: 'High priority', updated: 'Yesterday' },
    { section: 'Reports', title: 'JR-J5835 · Job listing demanding security deposit', detail: 'Listing ID job-2994 removed · employer suspended', status: 'Resolved', updated: 'Oct 9' },
    { section: 'Flagged messages', title: 'Thread #84920 · Request for payment in chat', detail: 'Vertex Works ↔ Meera Iyer · auto-flagged on keyword "deposit"', status: 'Under review', updated: '34 min ago' },
    { section: 'Flagged messages', title: 'Thread #84928 · External WhatsApp redirect attempt', detail: 'Unverified employer attempted off-platform phone exchange', status: 'Investigating', updated: '2 hr ago' },
    { section: 'Flagged messages', title: 'Thread #84935 · Telegram link shared in message', detail: 'Trigger: blocked shortener domain bit.ly/tele-job-chat', status: 'Under review', updated: 'Today' },
    { section: 'Flagged messages', title: 'Thread #84941 · Obscene / Harassing language trigger', detail: 'Automated sentiment classifier score 0.94 toxicity', status: 'High priority', updated: 'Yesterday' },
    { section: 'Flagged messages', title: 'Thread #84912 · Verified candidate dispute inquiry', detail: 'Interview cancellation dispute reviewed and dismissed', status: 'Resolved', updated: 'Oct 10' },
    { section: 'Blacklists', title: 'Disposable email domains blacklist', detail: 'Sign-up rule · 1,842 domains · updated weekly via threat feed', status: 'Active', updated: 'Oct 2' },
    { section: 'Blacklists', title: 'Known scam company registry names', detail: 'Verification check · 120 shell company names flagged', status: 'Active', updated: 'Sep 24' },
    { section: 'Blacklists', title: 'Blocked VoIP phone number ranges', detail: 'OTP abuse prevention · blocks non-fixed virtual numbers', status: 'Active', updated: 'Oct 4' },
    { section: 'Blacklists', title: 'Banned IP CIDR blocks', detail: 'WAF level block · 14 compromised botnet proxy ranges', status: 'Active', updated: 'Today' },
    { section: 'Fraud signals', title: 'Bulk sign-ups from one IP range', detail: '17 candidate profiles created in 8 minutes with identical canvas fingerprints', status: 'Investigating', updated: '7 min ago' },
    { section: 'Fraud signals', title: 'Duplicate corporate CIN registration attempt', detail: 'Vertex Works subsidiary attempted re-registration under new name', status: 'Blocked', updated: '3 hr ago' },
    { section: 'Fraud signals', title: 'Rapid-fire job posting spike', detail: 'Unverified employer attempted publishing 12 listings simultaneously', status: 'Rate limited', updated: 'Yesterday' },
    { section: 'Fraud signals', title: 'Payment method mismatch signal', detail: 'Credit card country (US) differs from employer billing country (IN)', status: 'Monitoring', updated: 'Oct 11' },
  ],
  support: [
    { section: 'Tickets', title: 'Resume export is missing a page', detail: 'Candidate · JR-C10451 · High priority · Aarav Mehta', status: 'Open', updated: '26 min ago' },
    { section: 'Tickets', title: 'Company verification documents', detail: 'Employer · JR-E2081 · Medium priority · Vikram Sethi (Cloudframe)', status: 'Resolved', updated: '1 hr ago' },
    { section: 'Tickets', title: 'Inquiry regarding Pro subscription refund terms', detail: 'Candidate · JR-C10452 · Low priority · Meera Iyer', status: 'Open', updated: 'Yesterday' },
    { section: 'Tickets', title: 'Calendar sync integration failing with Google Meet room links', detail: 'Employer · JR-E2085 · High priority · Isha Menon (Northstar Labs)', status: 'In progress', updated: '35 min ago' },
    { section: 'Tickets', title: 'DPDP statutory data deletion and erasure request', detail: 'Candidate · JR-C10458 · Urgent priority · Rohan Kapoor', status: 'Waiting on customer', updated: 'Oct 12' },
    { section: 'Canned responses', title: 'Refund Policy Explanation', detail: 'Used 45 times this week · 7-day money-back guarantee explanation', status: 'Active', updated: 'Aug 12' },
    { section: 'Canned responses', title: 'Verification Complete Notice', detail: 'Used 82 times this week · Notifies employer of verified credentials', status: 'Active', updated: 'Sep 10' },
    { section: 'Canned responses', title: 'PDF Export Troubleshooting', detail: 'Used 29 times this week · Browser margin and print settings advice', status: 'Active', updated: 'Oct 4' },
    { section: 'Canned responses', title: 'OAuth Integration Reconnect Guide', detail: 'Used 18 times this week · Google / Outlook calendar token refresh', status: 'Active', updated: 'Oct 8' },
    { section: 'Canned responses', title: 'Data Subject Erasure Confirmation', detail: 'Used 12 times this week · Statutory DPDP compliance acknowledgment', status: 'Active', updated: 'Oct 11' },
  ],
  analytics: [
    { section: 'Growth', title: 'Candidate sign-ups by source', detail: 'Google 42% · Email 31% · LinkedIn 19% · Referral 8%', status: 'Updated today', updated: '+12.8%' },
    { section: 'Growth', title: 'Employer onboarding registration WoW', detail: '142 new employers this week · 68% verification submission rate', status: 'Updated today', updated: '+9.4%' },
    { section: 'Growth', title: 'Daily Active Users (DAU) / MAU Ratio', detail: '34.2% stickiness ratio across active job seekers', status: 'Updated today', updated: '+2.1%' },
    { section: 'Growth', title: 'Candidate 30-Day Retention Cohort', detail: '48.5% returning within 30 days to check application states', status: 'Updated today', updated: '+4.3%' },
    { section: 'Growth', title: 'Employer Hiring Activation Velocity', detail: 'Average 4.2 days from account verification to first live job', status: 'Updated today', updated: '-18%' },
    { section: 'Funnel', title: 'Profile completion → first application', detail: '41.6% conversion · major drop-off point: resume PDF upload', status: 'Needs attention', updated: '41.6%' },
    { section: 'Funnel', title: 'Job search view → apply click rate', detail: '18.2% click-to-apply rate across all active listings', status: 'Healthy', updated: '18.2%' },
    { section: 'Funnel', title: 'Employer onboarding step completion', detail: 'Step 1 (Profile) 88% → Step 2 (Billing) 64% → Step 3 (Verify) 52%', status: 'Needs attention', updated: '52.0%' },
    { section: 'Funnel', title: 'Application screening to interview conversion', detail: '14.8% of screened applications proceed to formal video interview', status: 'Healthy', updated: '14.8%' },
    { section: 'Funnel', title: 'Interview to offer acceptance rate', detail: '68.4% of extended offers accepted by candidates', status: 'Healthy', updated: '68.4%' },
    { section: 'Search insights', title: 'Zero-result search queries', detail: 'Top unmatched query: "junior product designer remote" (284 hits)', status: 'Review taxonomy', updated: '284 today' },
    { section: 'Search insights', title: 'Top search keywords volume', detail: 'React Developer (14.2K), Product Designer (9.8K), Data Engineer (8.1K)', status: 'Updated today', updated: '52.4K queries' },
    { section: 'Search insights', title: 'Popular location filter queries', detail: 'Bengaluru (38%), Remote (31%), Pune (14%), Mumbai (11%), Hyderabad (6%)', status: 'Updated today', updated: '38% Bengaluru' },
    { section: 'Search insights', title: 'Work mode preference distribution', detail: 'Remote (54%), Hybrid (38%), On-site (8%)', status: 'Updated today', updated: '54% Remote' },
    { section: 'Search insights', title: 'Salary range filter usage', detail: '10-20 LPA bucket used in 42% of all filtered searches', status: 'Updated today', updated: '42% in 10-20 LPA' },
    { section: 'Revenue', title: 'Candidate Pro MRR Growth', detail: 'USD 42K total MRR · 8.4% monthly expansion · 4.8% churn', status: 'Updated today', updated: '+8.4%' },
    { section: 'Revenue', title: 'Employer Billing Gross Volume', detail: '₹18.4M billed this month across Starter, Growth, and Scale plans', status: 'Updated today', updated: '+14.2%' },
    { section: 'Revenue', title: 'Average Revenue Per Employer (ARPU)', detail: '₹12,840 / month across active paying employer accounts', status: 'Updated today', updated: '+6.1%' },
    { section: 'Revenue', title: 'Gross refund and dispute volume', detail: '0.4% refund rate · well within 1.5% gateway risk tolerance', status: 'Healthy', updated: '0.4% rate' },
    { section: 'Revenue', title: 'Coupon redemption impact', detail: 'WINTER25 and NEWCAREER50 contributed to ₹480K discounted GMV', status: 'Updated today', updated: '6.2% of GMV' },
    { section: 'Scheduled reports', title: 'Weekly Marketplace Health Digest', detail: 'Consolidated report emailed to founders and ops lead every Monday 8 AM', status: 'Active', updated: 'Oct 5' },
    { section: 'Scheduled reports', title: 'Monthly GST Tax & Invoicing Summary', detail: 'Financial reconciliation report dispatched to finance@jobrisers.example', status: 'Active', updated: 'Oct 1' },
    { section: 'Scheduled reports', title: 'Trust & Safety Weekly Incident Log', detail: 'Case reports, blacklist updates and dispute outcomes summary', status: 'Active', updated: 'Oct 8' },
    { section: 'Scheduled reports', title: 'Employer Hiring Velocity & Recruiter Index', detail: 'Metrics on time-to-hire and interview completion benchmarks', status: 'Active', updated: 'Oct 4' },
    { section: 'Scheduled reports', title: 'Candidate Drop-off & Funnel Friction Audit', detail: 'UX analytics report tracking onboarding drop-off by step', status: 'Active', updated: 'Sep 28' },
  ],
  settings: [
    { section: 'Platform', title: 'Candidate photo uploads policy', detail: 'JPG/PNG · max 5 MB · automated NSFW & virus check enabled', status: 'Configured', updated: 'Sep 30' },
    { section: 'Platform', title: 'Employer corporate logo guidelines', detail: 'PNG, JPG or SVG · max 2 MB · SVG sanitization active', status: 'Configured', updated: 'Oct 4' },
    { section: 'Platform', title: 'Default platform currency & format', detail: 'INR (Indian Rupee) · LPA formatting default for jobs', status: 'Configured', updated: 'Sep 12' },
    { section: 'Platform', title: 'Session timeout & re-authentication', detail: '30-minute idle session timeout for admin console', status: 'Configured', updated: 'Oct 1' },
    { section: 'Platform', title: 'Password complexity requirements', detail: 'Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special symbol', status: 'Configured', updated: 'Sep 24' },
    { section: 'Auth providers', title: 'Google OAuth SSO', detail: 'Client ID & secrets configured · active for candidates and employers', status: 'Active', updated: 'Sep 28' },
    { section: 'Auth providers', title: 'LinkedIn OAuth', detail: 'Candidate sign-up and profile auto-fill enabled', status: 'Active', updated: 'Sep 20' },
    { section: 'Auth providers', title: 'Apple Sign-In', detail: 'Private Relay support active for candidate logins', status: 'Active', updated: 'Sep 15' },
    { section: 'Auth providers', title: 'Admin Console Two-Factor Auth (TOTP)', detail: 'Enforced for all admin roles · Google Authenticator / 1Password', status: 'Active', updated: 'Aug 1' },
    { section: 'Roles and admins', title: 'Super Admin', detail: 'Full privileges across all 17 modules, roles and data purging · 2 users', status: 'Active', updated: 'Sep 1' },
    { section: 'Roles and admins', title: 'Operations Admin', detail: 'Manages users, employers, jobs, applications, and master data · 4 users', status: 'Active', updated: 'Sep 10' },
    { section: 'Roles and admins', title: 'Moderator (Trust & Safety)', detail: 'Job review queue, flagged messages, report casework · 6 users', status: 'Active', updated: 'Oct 2' },
    { section: 'Roles and admins', title: 'Support Agent', detail: 'Support ticket resolution, canned replies, PII masked view · 8 users', status: 'Active', updated: 'Oct 4' },
    { section: 'Roles and admins', title: 'Analyst (Read-Only)', detail: 'Marketplace reports and BI dashboards · PII masked by default · 3 users', status: 'Active', updated: 'Yesterday' },
    { section: 'Feature flags', title: 'AI Bullet Rewriter in Resume Pro', detail: 'Pro tier users only · 50% canary rollout · OpenAI GPT-4o backend', status: 'Active', updated: 'Oct 1' },
    { section: 'Feature flags', title: '1-Click Apply for Complete Profiles', detail: 'Enabled for candidates with 90%+ profile completion', status: 'Active', updated: 'Oct 6' },
    { section: 'Feature flags', title: 'Employer Live Video Calling in Chat', detail: 'WebRTC video room integration · currently in beta staging', status: 'Disabled', updated: 'Oct 10' },
    { section: 'Feature flags', title: 'Recruiter Profile Views Counter', detail: 'Candidate cockpit widget showing profile visit counts', status: 'Active', updated: 'Sep 22' },
    { section: 'Feature flags', title: 'Automated Job Risk Scoring Sentinel', detail: 'Scans new listings for suspicious off-platform contact links', status: 'Active', updated: 'Today' },
    { section: 'Compliance', title: 'DPDP Act 2023 Consent Logs', detail: 'Immutable consent registry with timestamp, source IP and purpose', status: 'Active', updated: 'May 1' },
    { section: 'Compliance', title: 'GDPR Data Subject Request SLA Tracker', detail: 'Enforces 30-day resolution timeline on data export & deletion', status: 'Active', updated: 'Jun 15' },
    { section: 'Compliance', title: 'Cookie & Tracking Banner Configuration', detail: 'Granular consent for analytics and promotional cookies', status: 'Active', updated: 'Sep 18' },
    { section: 'Compliance', title: 'Statutory Data Retention & Purge Rules', detail: 'Anonymizes deactivated accounts after 90-day grace period', status: 'Active', updated: 'Oct 5' },
    { section: 'Integrations', title: 'Stripe Payment Gateway', detail: 'Live mode · Webhook listener active · handles Candidate Pro USD', status: 'Active', updated: 'Jan 15' },
    { section: 'Integrations', title: 'Razorpay Payment Gateway', detail: 'Live mode · UPI, Net Banking, GST invoices for Indian employers', status: 'Active', updated: 'Mar 10' },
    { section: 'Integrations', title: 'Amazon Simple Email Service (SES)', detail: 'Transactional email pool · 99.4% inbox delivery rate', status: 'Active', updated: 'Feb 20' },
    { section: 'Integrations', title: 'Google Workspace Calendar API', detail: 'OAuth token refreshed · synchronizes employer interview rooms', status: 'Active', updated: 'Oct 12' },
    { section: 'Integrations', title: 'AWS S3 Asset Storage', detail: 'Encrypted bucket for resumes, certificates and media files', status: 'Active', updated: 'Jan 10' },
    { section: 'Audit log', title: 'Export candidate dataset to CSV', detail: 'Admin: Rahul Sharma · 1,240 records · reason: Quarterly audit', status: 'Logged', updated: '2 hr ago' },
    { section: 'Audit log', title: 'Unmasked candidate contact info', detail: 'Admin: Devika Rao · Aarav Mehta · reason: Support ticket resolution', status: 'Logged', updated: '4 hr ago' },
    { section: 'Audit log', title: 'Suspended employer account: Vertex Works', detail: 'Admin: System Auto · Reason: Upfront training fee extortion report', status: 'Logged', updated: 'Yesterday' },
    { section: 'Audit log', title: 'Approved employer verification: Northstar Labs', detail: 'Admin: Rahul Sharma · MCA & GST documents validated', status: 'Logged', updated: 'Oct 10' },
    { section: 'Audit log', title: 'Updated recommendation model weights', detail: 'Admin: Super Admin · Increased skills match weight to 0.45', status: 'Logged', updated: 'Oct 8' },
  ],
};


// ==========================================
// MASTER DATA TAXONOMY & CONFIGURATION (MST)
// ==========================================

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  active: boolean;
  jobCount: number;
  order: number;
}

export interface AdminRole {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  inOnboarding: boolean;
  active: boolean;
}

export interface AdminSkill {
  id: string;
  name: string;
  aliases: string[];
  usageCount: number;
  status: 'Approved' | 'Suggested';
  suggestedBy?: string;
  suggestedAt?: string;
}

export interface AdminIndustry {
  id: string;
  name: string;
  active: boolean;
  companyCount: number;
}

export interface AdminLocation {
  id: string;
  city: string;
  state: string;
  active: boolean;
  jobCount: number;
}

export interface AdminFilterConfig {
  id: string;
  name: string;
  type: 'range' | 'multi-select' | 'single-select' | 'date';
  active: boolean;
  defaultState: string;
  displayOrder: number;
  options?: string[];
}

export interface AdminSalaryBucket {
  id: string;
  label: string;
  minLpa: number;
  maxLpa: number;
}

export interface AdminBenefit {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  adoptionPercent?: number;
}

export const adminCategories: AdminCategory[] = [
  { id: 'cat-1', name: 'Technology & Software', slug: 'tech-software', icon: 'Laptop', color: '#3b82f6', active: true, jobCount: 1486, order: 1 },
  { id: 'cat-2', name: 'Marketing & Growth', slug: 'marketing-growth', icon: 'TrendingUp', color: '#10b981', active: true, jobCount: 452, order: 2 },
  { id: 'cat-3', name: 'Finance & Accounting', slug: 'finance-accounting', icon: 'Wallet', color: '#f59e0b', active: true, jobCount: 318, order: 3 },
  { id: 'cat-4', name: 'Healthcare & Life Sciences', slug: 'healthcare-sciences', icon: 'HeartPulse', color: '#ec4899', active: true, jobCount: 210, order: 4 },
  { id: 'cat-5', name: 'Design & Creative', slug: 'design-creative', icon: 'Palette', color: '#8b5cf6', active: true, jobCount: 184, order: 5 },
  { id: 'cat-6', name: 'Operations & Customer Support', slug: 'operations-support', icon: 'Headphones', color: '#06b6d4', active: true, jobCount: 142, order: 6 },
];

export const adminRoles: AdminRole[] = [
  { id: 'role-1', title: 'Product Designer', categoryId: 'cat-5', categoryName: 'Design & Creative', inOnboarding: true, active: true },
  { id: 'role-2', title: 'Frontend Engineer', categoryId: 'cat-1', categoryName: 'Technology & Software', inOnboarding: true, active: true },
  { id: 'role-3', title: 'Data Platform Engineer', categoryId: 'cat-1', categoryName: 'Technology & Software', inOnboarding: true, active: true },
  { id: 'role-4', title: 'Growth Marketing Manager', categoryId: 'cat-2', categoryName: 'Marketing & Growth', inOnboarding: true, active: true },
  { id: 'role-5', title: 'Staff Cloud Architect', categoryId: 'cat-1', categoryName: 'Technology & Software', inOnboarding: false, active: true },
  { id: 'role-6', title: 'Customer Success Lead', categoryId: 'cat-6', categoryName: 'Operations & Customer Support', inOnboarding: true, active: true },
  { id: 'role-7', title: 'Financial Analyst', categoryId: 'cat-3', categoryName: 'Finance & Accounting', inOnboarding: false, active: true },
  { id: 'role-8', title: 'Bioinformatics Research Associate', categoryId: 'cat-4', categoryName: 'Healthcare & Life Sciences', inOnboarding: false, active: false },
];

export const adminSkills: AdminSkill[] = [
  { id: 'sk-1', name: 'React 19 & Next.js', aliases: ['React', 'NextJS', 'Next.js 14'], usageCount: 2410, status: 'Approved' },
  { id: 'sk-2', name: 'Apache Kafka & Streaming', aliases: ['Kafka', 'Event Streaming', 'Flink'], usageCount: 842, status: 'Approved' },
  { id: 'sk-3', name: 'Figma Design Tokens', aliases: ['Figma', 'UI Design', 'Design Systems'], usageCount: 620, status: 'Approved' },
  { id: 'sk-4', name: 'HIPAA & Health Data Compliance', aliases: ['HIPAA', 'HL7', 'HealthTech Security'], usageCount: 112, status: 'Approved' },
  { id: 'sk-5', name: 'Product Analytics & Mixpanel', aliases: ['Mixpanel', 'Amplitude', 'PostHog'], usageCount: 1209, status: 'Suggested', suggestedBy: 'Candidate: Aarav Mehta', suggestedAt: '18 min ago' },
  { id: 'sk-6', name: 'Kubernetes Multi-Cloud Orchestration', aliases: ['K8s', 'EKS', 'GKE'], usageCount: 430, status: 'Suggested', suggestedBy: 'Recruiter: Vikram Sethi', suggestedAt: '2 hr ago' },
  { id: 'sk-7', name: 'B2B Performance Marketing', aliases: ['Paid Ads', 'Google Ads', 'LinkedIn B2B'], usageCount: 512, status: 'Approved' },
];

export const adminIndustries: AdminIndustry[] = [
  { id: 'ind-1', name: 'SaaS & Enterprise Cloud', active: true, companyCount: 840 },
  { id: 'ind-2', name: 'FinTech & Digital Payments', active: true, companyCount: 610 },
  { id: 'ind-3', name: 'Healthcare & HealthTech', active: true, companyCount: 340 },
  { id: 'ind-4', name: 'EdTech & Vocational Training', active: true, companyCount: 290 },
  { id: 'ind-5', name: 'Recruitment & Staffing', active: true, companyCount: 180 },
  { id: 'ind-6', name: 'Gaming & Metaverse', active: false, companyCount: 45 },
];

export const adminLocations: AdminLocation[] = [
  { id: 'loc-1', city: 'Bengaluru', state: 'Karnataka (KA)', active: true, jobCount: 4200 },
  { id: 'loc-2', city: 'Delhi NCR', state: 'Delhi / Haryana (DL/HR)', active: true, jobCount: 3450 },
  { id: 'loc-3', city: 'Hyderabad', state: 'Telangana (TS)', active: true, jobCount: 2680 },
  { id: 'loc-4', city: 'Mumbai', state: 'Maharashtra (MH)', active: true, jobCount: 2100 },
  { id: 'loc-5', city: 'Pune', state: 'Maharashtra (MH)', active: true, jobCount: 1840 },
  { id: 'loc-6', city: 'Chennai', state: 'Tamil Nadu (TN)', active: true, jobCount: 960 },
  { id: 'loc-7', city: 'Kolkata', state: 'West Bengal (WB)', active: false, jobCount: 410 },
];

export const adminFiltersConfig: AdminFilterConfig[] = [
  { id: 'flt-1', name: 'Salary Range (LPA)', type: 'range', active: true, defaultState: 'All Salary Ranges (₹0 - ₹25+ LPA)', displayOrder: 1, options: ['₹0 - ₹3 LPA', '₹3 - ₹6 LPA', '₹6 - ₹12 LPA', '₹12 - ₹25 LPA', '₹25+ LPA'] },
  { id: 'flt-2', name: 'Work Mode', type: 'multi-select', active: true, defaultState: 'All (Remote, Hybrid, On-site)', displayOrder: 2, options: ['Remote', 'Hybrid', 'On-site'] },
  { id: 'flt-3', name: 'Experience Level', type: 'multi-select', active: true, defaultState: 'All Experience Tiers', displayOrder: 3, options: ['Entry (0-2y)', 'Mid (2-5y)', 'Senior (5-8y)', 'Lead (8+y)'] },
  { id: 'flt-4', name: 'Job Type', type: 'multi-select', active: true, defaultState: 'Full-time Only', displayOrder: 4, options: ['Full time', 'Part time', 'Contract', 'Internship'] },
  { id: 'flt-5', name: 'Date Posted', type: 'single-select', active: true, defaultState: 'Any time', displayOrder: 5, options: ['Past 24h', 'Past week', 'Past month', 'Any time'] },
];

export const adminSalaryBuckets: AdminSalaryBucket[] = [
  { id: 'sb-1', label: '₹0 - ₹3 LPA', minLpa: 0, maxLpa: 3 },
  { id: 'sb-2', label: '₹3 - ₹6 LPA', minLpa: 3, maxLpa: 6 },
  { id: 'sb-3', label: '₹6 - ₹12 LPA', minLpa: 6, maxLpa: 12 },
  { id: 'sb-4', label: '₹12 - ₹25 LPA', minLpa: 12, maxLpa: 25 },
  { id: 'sb-5', label: '₹25+ LPA', minLpa: 25, maxLpa: 999 },
];

export const adminBenefits: AdminBenefit[] = [
  { id: 'ben-1', label: 'Flexible Hybrid Work', icon: 'Laptop', active: true, adoptionPercent: 92 },
  { id: 'ben-2', label: 'Comprehensive Health Insurance', icon: 'ShieldCheck', active: true, adoptionPercent: 84 },
  { id: 'ben-3', label: 'Ergonomic Home Office Allowance', icon: 'Armchair', active: true, adoptionPercent: 52 },
  { id: 'ben-4', label: 'Annual Learning & Conference Stipend', icon: 'GraduationCap', active: true, adoptionPercent: 48 },
  { id: 'ben-5', label: 'Employee Stock Options (ESOPs)', icon: 'Coins', active: true, adoptionPercent: 38 },
  { id: 'ben-6', label: 'Mental Wellness & Counseling Subsidy', icon: 'Heart', active: true, adoptionPercent: 31 },
];


// ==========================================
// CONTENT (CMS) TYPED SCHEMAS & DATA (CMS-1 TO CMS-18)
// ==========================================

export interface AdminCmsHeroConfig {
  eyebrow: string;
  headline: string;
  highlightedWords: string[];
  supportingText: string;
  searchPlaceholder: string;
  ctaText: string;
}

export interface AdminCmsSearchChip {
  id: string;
  label: string;
  active: boolean;
  order: number;
}

export interface AdminCmsPlatformStat {
  id: string;
  label: string;
  count: string;
  autoValue: string;
  isAuto: boolean;
}

export interface AdminCmsTrustedLogo {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  active: boolean;
  order: number;
}

export interface AdminCmsCategoryTile {
  id: string;
  name: string;
  icon: string;
  jobCount: number;
  active: boolean;
}

export interface AdminCmsFooterLink {
  id: string;
  label: string;
  url: string;
  active: boolean;
  order: number;
}

export interface AdminCmsFooterGroup {
  id: string;
  groupName: string;
  links: AdminCmsFooterLink[];
}

export interface AdminCmsTestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatar: string;
  consentStatus: 'Consented' | 'Pending' | 'Revoked';
  verified: boolean;
  expiryDate: string;
  active: boolean;
}

export interface AdminCmsNavItem {
  id: string;
  section: 'Visitor Header' | 'Candidate Sidebar' | 'Employer Header';
  label: string;
  url: string;
  active: boolean;
  order: number;
}

export interface AdminCmsAuthPageConfig {
  id: string;
  page: 'Sign In' | 'Candidate Sign Up' | 'Employer Sign Up' | 'Forgot Password';
  heading: string;
  supportingText: string;
  benefitBullets: string[];
  socialProofText: string;
  floatingTags: string[];
  statsStrip: string;
}

export interface AdminCmsPricingMarketingItem {
  id: string;
  title: string;
  pageType: 'Public Pricing' | 'Resources & Guides';
  supportingCopy: string;
  ctaText: string;
  ctaUrl: string;
  status: 'Published' | 'Draft';
}

export interface AdminCmsSupportHelpConfig {
  helpCenterLabel: string;
  helpCenterUrl: string;
  supportEmail: string;
  supportCtaText: string;
  placement: string;
}

export interface AdminCmsOnboardingCopy {
  id: string;
  wizardType: 'Candidate Wizard' | 'Employer Wizard';
  stepNumber: number;
  stepTitle: string;
  heading: string;
  supportingCopy: string;
  benefitTicks: string[];
  illustration: string;
}

export interface AdminCmsMicrocopy {
  id: string;
  key: string;
  copy: string;
  placement: string;
  active: boolean;
}

export interface AdminCmsBrandTokens {
  brandName: string;
  primaryLogo: string;
  alternateLogo: string;
  updatedBy: string;
}

export interface AdminCmsLandingConfig {
  hero: AdminCmsHeroConfig;
  searchChips: AdminCmsSearchChip[];
  platformStats: AdminCmsPlatformStat[];
  trustedLogos: AdminCmsTrustedLogo[];
  categoryTiles: AdminCmsCategoryTile[];
  footerLinkGroups: AdminCmsFooterGroup[];
  footerMeta: {
    operationalBadge: boolean;
    copyrightYear: number;
    closingTagline: string;
  };
  testimonials: AdminCmsTestimonial[];
  navManager: AdminCmsNavItem[];
  authPages: AdminCmsAuthPageConfig[];
  pricingMarketing: AdminCmsPricingMarketingItem[];
  supportHelpConfig: AdminCmsSupportHelpConfig;
  onboardingCopy: AdminCmsOnboardingCopy[];
  microcopyList: AdminCmsMicrocopy[];
  brandTokens: AdminCmsBrandTokens;
}

export interface AdminCmsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  coverImage: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  views: number;
  publishedDate: string;
  status: 'Draft' | 'Published' | 'Scheduled';
  featured: boolean;
  scheduledPublishDate?: string;
  revisions?: {
    id: string;
    version: string;
    date: string;
    author: string;
    title: string;
    excerpt: string;
    content: string;
    notes: string;
  }[];
}

export interface AdminPolicyChangelog {
  version: string;
  date: string;
  publisher: string;
  notes: string;
}

export interface AdminStaticPolicy {
  id: string;
  title: string;
  slug: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  complianceTag: string;
  mandatoryReconsent: boolean;
  status: 'Published' | 'Draft';
  content: string;
  changelog: AdminPolicyChangelog[];
}

export interface AdminPromoBanner {
  id: string;
  title: string;
  copy: string;
  ctaText: string;
  destinationUrl: string;
  targetAudience: 'All' | 'Job Seekers' | 'Employers' | 'Non-Pro Candidates' | 'Unverified Employers';
  placement: 'Candidate Dashboard' | 'Jobs List' | 'Settings' | 'Onboarding';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Paused';
}

export interface AdminPremiumUpgradeCardConfig {
  title: string;
  copy: string;
  ctaText: string;
  targetPlan: string;
  placements: {
    settings: boolean;
    interviews: boolean;
    resumes: boolean;
    messages: boolean;
  };
}

export interface AdminEmailTemplate {
  id: string;
  name: string;
  type: 'Transactional' | 'Marketing';
  triggerEvent: string;
  subject: string;
  senderName: string;
  body: string;
  variables: string[];
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

export interface AdminMediaAsset {
  id: string;
  filename: string;
  fileType: 'Image' | 'Vector SVG' | 'Document';
  format: 'PNG' | 'JPG' | 'SVG';
  dimensions: string;
  fileSize: string;
  url: string;
  status: 'Active' | 'Archived';
  usageCount: number;
  usedIn: string[];
  uploadedAt: string;
}

// Initial CMS Data Collections
export const initialAdminCmsLandingConfig: AdminCmsLandingConfig = {
  hero: {
    eyebrow: 'Better jobs. Brighter futures.',
    headline: 'Find the job that is right for you',
    highlightedWords: ['right', 'for you'],
    supportingText: 'Search thousands of curated roles at high-growth tech companies, verified employers, and leading enterprises across India.',
    searchPlaceholder: 'Job title, skill, or enterprise name...',
    ctaText: 'Explore Opportunities',
  },
  searchChips: [
    { id: 'sc-1', label: 'Remote', active: true, order: 1 },
    { id: 'sc-2', label: 'Software Engineer', active: true, order: 2 },
    { id: 'sc-3', label: 'Product Manager', active: true, order: 3 },
    { id: 'sc-4', label: 'Data Analyst', active: true, order: 4 },
    { id: 'sc-5', label: 'Design', active: true, order: 5 },
  ],
  platformStats: [
    { id: 'st-1', label: 'Active Jobs', count: '50K+', autoValue: '12,490 live', isAuto: false },
    { id: 'st-2', label: 'Companies', count: '10K+', autoValue: '312 verified', isAuto: false },
    { id: 'st-3', label: 'Job Seekers', count: '1M+', autoValue: '85,420 registered', isAuto: false },
    { id: 'st-4', label: 'Success Stories', count: '95%', autoValue: '96.2% hired', isAuto: true },
  ],
  trustedLogos: [
    { id: 'tl-1', name: 'Amazon', logo: 'amazon-logo.svg', verified: true, active: true, order: 1 },
    { id: 'tl-2', name: 'Adobe', logo: 'adobe-logo.svg', verified: true, active: true, order: 2 },
    { id: 'tl-3', name: 'Microsoft', logo: 'microsoft-logo.svg', verified: true, active: true, order: 3 },
    { id: 'tl-4', name: 'Infosys', logo: 'infosys-logo.svg', verified: true, active: true, order: 4 },
    { id: 'tl-5', name: 'Tata', logo: 'tata-logo.svg', verified: true, active: true, order: 5 },
  ],
  categoryTiles: [
    { id: 'cat-1', name: 'Technology', icon: 'Code', jobCount: 12400, active: true },
    { id: 'cat-2', name: 'Marketing', icon: 'TrendingUp', jobCount: 4500, active: true },
    { id: 'cat-3', name: 'Finance', icon: 'Briefcase', jobCount: 6800, active: true },
    { id: 'cat-4', name: 'Healthcare', icon: 'Activity', jobCount: 5200, active: true },
    { id: 'cat-5', name: 'Design', icon: 'Layers', jobCount: 3900, active: true },
    { id: 'cat-6', name: 'Human Resources', icon: 'Users', jobCount: 2300, active: true },
  ],
  footerLinkGroups: [
    {
      id: 'flg-1',
      groupName: 'Platform',
      links: [
        { id: 'fl-1', label: 'Find Jobs', url: '/jobs', active: true, order: 1 },
        { id: 'fl-2', label: 'Featured Companies', url: '/companies', active: true, order: 2 },
        { id: 'fl-3', label: 'Talent Network', url: '/talent-network', active: true, order: 3 },
        { id: 'fl-4', label: 'Salary Benchmark', url: '/salary-benchmark', active: true, order: 4 },
      ],
    },
    {
      id: 'flg-2',
      groupName: 'Career Tools',
      links: [
        { id: 'fl-5', label: 'Resume Builder', url: '/resume-builder', active: true, order: 1 },
        { id: 'fl-6', label: 'Career Advice', url: '/career-advice', active: true, order: 2 },
        { id: 'fl-7', label: 'Interview Prep', url: '/interview-prep', active: true, order: 3 },
        { id: 'fl-8', label: 'AI Cover Letters', url: '/ai-cover-letter', active: true, order: 4 },
      ],
    },
    {
      id: 'flg-3',
      groupName: 'Legal & Trust',
      links: [
        { id: 'fl-9', label: 'Privacy Policy', url: '/privacy', active: true, order: 1 },
        { id: 'fl-10', label: 'Terms of Service', url: '/terms', active: true, order: 2 },
        { id: 'fl-11', label: 'Security & Compliance', url: '/security', active: true, order: 3 },
        { id: 'fl-12', label: 'Candidate Rights', url: '/candidate-rights', active: true, order: 4 },
      ],
    },
  ],
  footerMeta: {
    operationalBadge: true,
    copyrightYear: 2026,
    closingTagline: 'Institutional-grade career infrastructure for India’s fastest growing builders.',
  },
  testimonials: [
    {
      id: 'tst-1',
      quote: 'JobRisers connected me with Cloudframe in less than 2 weeks. The ATS score preview gave me instant confidence in my application.',
      authorName: 'Priya Sharma',
      authorRole: 'Senior Product Designer at Cloudframe',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      consentStatus: 'Consented',
      verified: true,
      expiryDate: '2027-10-15',
      active: true,
    },
    {
      id: 'tst-2',
      quote: 'Finding vetted Staff-level engineers in Bengaluru was a massive struggle before JobRisers verified employer pipeline.',
      authorName: 'Kunal Kapoor',
      authorRole: 'VP of Engineering at Northstar Labs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
      consentStatus: 'Consented',
      verified: true,
      expiryDate: '2027-06-30',
      active: true,
    },
    {
      id: 'tst-3',
      quote: 'The structured interview stage tracker and salary transparency make this the most respectful job board in India.',
      authorName: 'Aarav Mehta',
      authorRole: 'Full Stack Engineer at Zepto',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
      consentStatus: 'Pending',
      verified: false,
      expiryDate: '2026-12-31',
      active: false,
    },
  ],
  navManager: [
    { id: 'nav-1', section: 'Visitor Header', label: 'Jobs', url: '/jobs', active: true, order: 1 },
    { id: 'nav-2', section: 'Visitor Header', label: 'Companies', url: '/companies', active: true, order: 2 },
    { id: 'nav-3', section: 'Visitor Header', label: 'Career Advice', url: '/career-advice', active: true, order: 3 },
    { id: 'nav-4', section: 'Visitor Header', label: 'For Employers', url: '/for-employers', active: true, order: 4 },
    { id: 'nav-5', section: 'Candidate Sidebar', label: 'Profile', url: '/candidate/profile', active: true, order: 1 },
    { id: 'nav-6', section: 'Candidate Sidebar', label: 'Applications', url: '/candidate/applications', active: true, order: 2 },
    { id: 'nav-7', section: 'Candidate Sidebar', label: 'Interviews', url: '/candidate/interviews', active: true, order: 3 },
    { id: 'nav-8', section: 'Candidate Sidebar', label: 'Messages', url: '/candidate/messages', active: true, order: 4 },
    { id: 'nav-9', section: 'Employer Header', label: 'Post a Job', url: '/employer/post-job', active: true, order: 1 },
    { id: 'nav-10', section: 'Employer Header', label: 'Candidates', url: '/employer/candidates', active: true, order: 2 },
    { id: 'nav-11', section: 'Employer Header', label: 'Pricing', url: '/pricing', active: true, order: 3 },
  ],
  authPages: [
    {
      id: 'auth-1',
      page: 'Sign In',
      heading: 'Welcome back to JobRisers',
      supportingText: 'Continue discovering high-growth careers across vetted tech teams.',
      benefitBullets: [
        'Discover verified jobs with transparent CTC',
        '1-Click application tracking with stage visibility',
        'Direct interview scheduling with verified hiring leads',
      ],
      socialProofText: 'Joined by 85,000+ top engineers and designers',
      floatingTags: ['Good Jobs Brighter Tomorrows', '98% ATS Parse Rate'],
      statsStrip: '50K+ Active Listings · 10K+ Companies',
    },
    {
      id: 'auth-2',
      page: 'Candidate Sign Up',
      heading: 'Build your career on JobRisers',
      supportingText: 'Create your verified candidate profile in less than 2 minutes.',
      benefitBullets: [
        'Never get ghosted with real-time application trackers',
        'Access confidential recruiter matchmaking',
        'Built-in ATS resume validation & compliance score',
      ],
      socialProofText: '4.9/5 satisfaction from verified job seekers',
      floatingTags: ['Your Future Starts Here', 'Zero Spam Listings'],
      statsStrip: 'Free forever for job seekers',
    },
    {
      id: 'auth-3',
      page: 'Employer Sign Up',
      heading: 'Hire exceptional talent faster',
      supportingText: 'Connect directly with pre-screened, verified tech talent.',
      benefitBullets: [
        'Cut time-to-hire by 50% with verified profiles',
        'Structured candidate pipeline with custom ATS stages',
        'Zero recruitment commissions — simple transparent plans',
      ],
      socialProofText: 'Trusted by 10,000+ high-growth companies',
      floatingTags: ['Fast-lane Verification', 'Verified Employer Badge'],
      statsStrip: '1M+ Active Candidates across India',
    },
    {
      id: 'auth-4',
      page: 'Forgot Password',
      heading: 'Reset your password',
      supportingText: 'Enter your registered email address to receive a secure 15-minute reset token.',
      benefitBullets: [
        'Encrypted one-time link delivered instantly',
        '2FA device backup code recovery support',
        'Account locked during recovery for maximum security',
      ],
      socialProofText: 'Enterprise-grade DPDP & SOC2 data protection',
      floatingTags: ['15-Minute Expiry', 'Automated Security Guard'],
      statsStrip: '24/7 Support Escalation Available',
    },
  ],
  pricingMarketing: [
    {
      id: 'pm-1',
      title: 'Employer Hiring Plans & Pricing',
      pageType: 'Public Pricing',
      supportingCopy: 'Transparent subscription tiers for startups, growth teams, and large enterprises. Post jobs, search candidate directories, and schedule interviews with zero hidden fees.',
      ctaText: 'Compare Plans & Start Hiring',
      ctaUrl: '/pricing#employers',
      status: 'Published',
    },
    {
      id: 'pm-2',
      title: 'JobRisers Pro Candidate Membership',
      pageType: 'Public Pricing',
      supportingCopy: 'Accelerate your job hunt with ATS Pro resume templates, priority recruiter indexing, and salary benchmarking insights for just ₹799/month.',
      ctaText: 'Unlock JobRisers Pro',
      ctaUrl: '/pricing#pro',
      status: 'Published',
    },
    {
      id: 'pm-3',
      title: 'Indian Tech Salary Benchmark Report 2026',
      pageType: 'Resources & Guides',
      supportingCopy: 'Comprehensive analysis of CTC, equity bands, and remote allowances across 15,000+ live verified tech postings in Bengaluru, NCR, and Hyderabad.',
      ctaText: 'Download Benchmark Report',
      ctaUrl: '/resources/salary-benchmark-2026',
      status: 'Published',
    },
  ],
  supportHelpConfig: {
    helpCenterLabel: 'JobRisers Help Center',
    helpCenterUrl: 'https://support.jobrisers.com',
    supportEmail: 'help@jobrisers.com',
    supportCtaText: 'Contact Support 24/7',
    placement: 'Settings, Interview Detail, Messages, Footer',
  },
  onboardingCopy: [
    {
      id: 'onb-1',
      wizardType: 'Candidate Wizard',
      stepNumber: 1,
      stepTitle: 'Your Goals',
      heading: 'Let’s get you started',
      supportingCopy: 'Tell us what you want to achieve next in your career so we can curate your recommendations feed.',
      benefitTicks: [
        'Personalized match scoring on every job',
        'Tailored daily alert digest',
        'Hide profile from current employer',
      ],
      illustration: 'onboarding-goals.svg',
    },
    {
      id: 'onb-2',
      wizardType: 'Candidate Wizard',
      stepNumber: 2,
      stepTitle: 'Job Role & Skills',
      heading: 'What roles are you aiming for?',
      supportingCopy: 'Pick up to 3 target roles to help recruiters discover your profile.',
      benefitTicks: [
        'Automated role synonym mapping',
        'Highlight matching skills instantly',
        'Pre-filtered search shortcuts',
      ],
      illustration: 'onboarding-roles.svg',
    },
    {
      id: 'onb-3',
      wizardType: 'Employer Wizard',
      stepNumber: 1,
      stepTitle: 'Company Profile',
      heading: 'Set up your employer brand',
      supportingCopy: 'Build trust with candidates by providing authentic company details and verified domain proof.',
      benefitTicks: [
        'Unlock Verified Employer badge',
        'Direct message verified job seekers',
        'Higher application conversion rate',
      ],
      illustration: 'employer-setup.svg',
    },
  ],
  microcopyList: [
    {
      id: 'mc-1',
      key: 'interview_pro_tip',
      copy: 'Pro tip: Test your camera and microphone in the test room 5 minutes before your scheduled interview slot.',
      placement: 'Interviews Page (S15)',
      active: true,
    },
    {
      id: 'mc-2',
      key: 'chat_safety_banner',
      copy: 'Stay safe: JobRisers verified employers will never ask for interview fees, registration deposits, or bank OTPs.',
      placement: 'Messaging Thread (S16)',
      active: true,
    },
    {
      id: 'mc-3',
      key: 'password_rule_hint',
      copy: 'Must contain at least 8 characters, one numeric digit, and one special symbol.',
      placement: 'Account Sign Up & Password Reset (S02, S03, S06)',
      active: true,
    },
    {
      id: 'mc-4',
      key: 'empty_resumes_notice',
      copy: 'You haven’t created a resume yet. Choose from our 12 ATS-compliant templates to stand out.',
      placement: 'My Resumes Tab (S17)',
      active: true,
    },
    {
      id: 'mc-5',
      key: 'save_share_tooltip',
      copy: 'Saved jobs are stored in your private dashboard for quick application before the deadline.',
      placement: 'Job Detail Page (S13)',
      active: true,
    },
  ],
  brandTokens: {
    brandName: 'JobRisers',
    primaryLogo: 'jobrisers-logo-primary.svg',
    alternateLogo: 'jobrisers-logo-dark.svg',
    updatedBy: 'Admin Ops (SuperAdmin)',
  },
};

export const initialAdminCmsArticles: AdminCmsArticle[] = [
  {
    id: 'art-1',
    title: 'How to stand out in a competitive job market',
    slug: 'stand-out-competitive-job-market',
    category: 'Career Strategy',
    author: 'Maya Iyer',
    excerpt: 'Key strategies for tech job seekers navigating senior engineering and design hiring cycles.',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop',
    content: 'In 2026, tech recruiting has shifted towards deep domain specialization and verified delivery. Highlighting quantified impact in your project milestones and maintaining an ATS-parseable portfolio format significantly elevates recruiter response rates.',
    seoTitle: 'How to Stand Out in Tech Hiring | JobRisers Career Guide',
    seoDescription: 'Proven techniques from industry hiring managers on portfolio structuring, ATS optimization, and compensation benchmarks.',
    views: 12400,
    publishedDate: '2026-10-15',
    status: 'Published',
    featured: true,
    revisions: [
      {
        id: 'rev-3',
        version: 'v1.2 (Current)',
        date: 'Oct 15, 2026',
        author: 'Maya Iyer',
        title: 'How to stand out in a competitive job market',
        excerpt: 'Key strategies for tech job seekers navigating senior engineering and design hiring cycles.',
        content: 'In 2026, tech recruiting has shifted towards deep domain specialization and verified delivery. Highlighting quantified impact in your project milestones and maintaining an ATS-parseable portfolio format significantly elevates recruiter response rates.',
        notes: 'Updated 2026 hiring benchmarks and ATS scoring criteria.',
      },
      {
        id: 'rev-2',
        version: 'v1.1',
        date: 'Oct 10, 2026',
        author: 'Devika Rao',
        title: 'How to standout in modern tech hiring',
        excerpt: 'Strategies for tech candidates looking for senior engineering roles.',
        content: 'Technical hiring cycles require candidates to show specific quantified output. Highlighting project milestones and maintaining clean resume formats increases response rates.',
        notes: 'Copy edit for conciseness and headline revision.',
      },
      {
        id: 'rev-1',
        version: 'v1.0',
        date: 'Oct 01, 2026',
        author: 'Maya Iyer',
        title: 'Draft: Navigating the job market',
        excerpt: 'Initial draft covering senior hiring and recruiter reachout.',
        content: 'Initial notes and survey data regarding engineering job searches across Indian tech hubs.',
        notes: 'Initial publication draft.',
      },
    ],
  },
  {
    id: 'art-2',
    title: 'Transitioning from Senior to Staff Engineer',
    slug: 'transitioning-senior-to-staff-engineer',
    category: 'Engineering Leadership',
    author: 'Rahul Sharma',
    excerpt: 'Frameworks for broadening organizational influence, technical strategy, and architectural cross-collaboration.',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop',
    content: 'The journey from Senior to Staff Engineer is less about writing more code and fundamentally about force multiplying your engineering organization through system design, documentation, and technical alignment.',
    seoTitle: 'Transitioning to Staff Engineer | JobRisers Advice',
    seoDescription: 'Learn how to demonstrate multi-team impact and master the behavioral expectations of Staff+ engineering roles.',
    views: 8200,
    publishedDate: '2026-10-10',
    status: 'Published',
    featured: true,
  },
  {
    id: 'art-3',
    title: 'Negotiating tech compensation in Indian tech hubs',
    slug: 'negotiating-tech-compensation-india',
    category: 'Compensation',
    author: 'Devika Rao',
    excerpt: 'Demystifying CTC components, joining bonuses, ESOP cliff periods, and location tier allowances.',
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop',
    content: 'Understanding the split between fixed gross salary, performance incentives, and vesting equity is essential when comparing multiple offers in Bengaluru, Gurugram, or Hyderabad tech markets.',
    seoTitle: 'Tech Salary Negotiation in India | JobRisers Benchmarks',
    seoDescription: 'A realistic guide to market compensation bands, variable pay formulas, and retention allowances.',
    views: 15100,
    publishedDate: '2026-10-07',
    status: 'Published',
    featured: false,
  },
  {
    id: 'art-4',
    title: 'Mastering the async remote technical interview',
    slug: 'mastering-async-remote-interview',
    category: 'Interview Prep',
    author: 'Maya Iyer',
    excerpt: 'Preparation checklist for live pair programming sessions, take-home system exercises, and communication etiquette.',
    coverImage: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&auto=format&fit=crop',
    content: 'Remote technical screens test clarity of thought as much as syntactic proficiency. Articulating trade-offs and writing clear unit tests during the problem breakdown establishes strong senior seniority signals.',
    seoTitle: 'Async Remote Interview Mastery | JobRisers Guide',
    seoDescription: 'How to excel in video screens, remote pairing tests, and collaborative whiteboard challenges.',
    views: 3200,
    publishedDate: '2026-10-12',
    status: 'Draft',
    featured: false,
  },
  {
    id: 'art-5',
    title: 'Top AI Engineering Tools Vetted for Enterprise Production in 2026',
    slug: 'top-ai-engineering-tools-2026',
    category: 'Engineering Leadership',
    author: 'Rahul Sharma',
    excerpt: 'Comprehensive audit of local LLM orchestration libraries, evaluation suites, and agentic frameworks.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop',
    content: 'Enterprise production deployment of LLMs requires rigorous evaluations for drift, latency budgets, and security sandbox boundaries. Here are the top vetted stacks.',
    seoTitle: 'Top AI Tools 2026 | JobRisers Tech Insights',
    seoDescription: 'Guide to production LLM toolchains and developer productivity frameworks.',
    views: 0,
    publishedDate: '2026-10-25',
    scheduledPublishDate: '2026-10-25 · 09:00 AM IST',
    status: 'Scheduled',
    featured: true,
    revisions: [
      {
        id: 'rev-5-1',
        version: 'v1.0 (Scheduled)',
        date: 'Oct 16, 2026',
        author: 'Rahul Sharma',
        title: 'Top AI Engineering Tools Vetted for Enterprise Production in 2026',
        excerpt: 'Comprehensive audit of local LLM orchestration libraries, evaluation suites, and agentic frameworks.',
        content: 'Enterprise production deployment of LLMs requires rigorous evaluations for drift, latency budgets, and security sandbox boundaries. Here are the top vetted stacks.',
        notes: 'Scheduled for release on Oct 25.',
      },
    ],
  },
];

export const initialAdminStaticPolicies: AdminStaticPolicy[] = [
  {
    id: 'pol-1',
    title: 'Candidate Rights & Privacy Charter',
    slug: 'candidate-rights',
    version: 'v2.1',
    effectiveDate: '2026-10-06',
    lastUpdated: '2026-10-06',
    complianceTag: 'India DPDP Act 2023',
    mandatoryReconsent: true,
    status: 'Published',
    content: '# Candidate Rights Charter\n\nAt JobRisers, candidate privacy and data sovereignty are paramount. Candidates retain the legal right to inspect, download, anonymize, or permanently erase their personal resumes and profile metadata at any time.\n\n### Key Protections\n1. Direct Recruiter Unmasking is consent-gated.\n2. Right to erasure completed within 30 days under India DPDP SLA.\n3. No third-party data broker sharing.',
    changelog: [
      { version: 'v2.1', date: '2026-10-06', publisher: 'Compliance Lead', notes: 'Incorporated DPDP Act 2023 consent withdrawal stipulations and 30-day deletion SLA.' },
      { version: 'v2.0', date: '2026-08-15', publisher: 'Legal Counsel', notes: 'Initial public candidate rights framework.' },
    ],
  },
  {
    id: 'pol-2',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    version: 'v3.0',
    effectiveDate: '2026-09-15',
    lastUpdated: '2026-09-15',
    complianceTag: 'Commercial Billing Terms',
    mandatoryReconsent: false,
    status: 'Published',
    content: '# Terms of Service\n\nThese terms govern the platform usage for both Job Seekers and Employers. By creating an account or posting jobs, parties agree to abide by non-discriminatory hiring principles, fair interview scheduling, and verified identity requirements.',
    changelog: [
      { version: 'v3.0', date: '2026-09-15', publisher: 'Legal Counsel', notes: 'Added employer billing terms, refund dispute windows, and recruiter seat licensing rules.' },
      { version: 'v2.5', date: '2026-05-10', publisher: 'Ops Admin', notes: 'Updated service availability and platform uptime definitions.' },
    ],
  },
  {
    id: 'pol-3',
    title: 'Privacy & Cookie Policy',
    slug: 'privacy-policy',
    version: 'v2.4',
    effectiveDate: '2026-10-01',
    lastUpdated: '2026-10-01',
    complianceTag: 'GDPR & DPDP Ready',
    mandatoryReconsent: false,
    status: 'Published',
    content: '# Privacy & Cookie Policy\n\nWe transparently detail the collection of user telemetry, session storage, and cookie tokens strictly necessary for secure authentication, application tracking, and fraud prevention.',
    changelog: [
      { version: 'v2.4', date: '2026-10-01', publisher: 'Data Protection Officer', notes: 'Detailed third-party telemetry disclosures and cookie banner preference settings.' },
    ],
  },
  {
    id: 'pol-4',
    title: 'Employer Code of Conduct & Anti-Scam Rules',
    slug: 'employer-conduct',
    version: 'v1.8',
    effectiveDate: '2026-09-22',
    lastUpdated: '2026-09-22',
    complianceTag: 'Zero-Fee Candidate Guarantee',
    mandatoryReconsent: true,
    status: 'Published',
    content: '# Employer Code of Conduct\n\nEmployers registered on JobRisers strictly agree that under NO circumstances shall any applicant be charged fees for interviews, testing, onboarding materials, or security deposits. Violations result in immediate permanent domain ban and regulatory reporting.',
    changelog: [
      { version: 'v1.8', date: '2026-09-22', publisher: 'Trust & Safety Director', notes: 'Mandatory suspension triggers for off-platform communication and registration fee solicitations.' },
    ],
  },
];

export const initialAdminPromoBanners: AdminPromoBanner[] = [
  {
    id: 'ban-1',
    title: 'Resume upload prompt card',
    copy: 'Upload your latest CV to unlock instant ATS scoring and direct recruiter matching.',
    ctaText: 'Upload Resume & Check Score',
    destinationUrl: '/resume-builder',
    targetAudience: 'Non-Pro Candidates',
    placement: 'Jobs List',
    startDate: '2026-10-08',
    endDate: '2026-12-31',
    status: 'Scheduled',
  },
  {
    id: 'ban-2',
    title: 'Candidate Pro early-access banner',
    copy: 'Get priority recruiter indexing, verified badges, and unlimited resume exports.',
    ctaText: 'Upgrade to JobRisers Pro',
    destinationUrl: '/pricing#pro',
    targetAudience: 'Job Seekers',
    placement: 'Candidate Dashboard',
    startDate: '2026-10-10',
    endDate: '2026-11-30',
    status: 'Active',
  },
  {
    id: 'ban-3',
    title: 'Employer verification badge spotlight',
    copy: 'Submit company tax registration and domain proof to get your Verified checkmark.',
    ctaText: 'Submit Verification Documents',
    destinationUrl: '/employer/verify',
    targetAudience: 'Unverified Employers',
    placement: 'Onboarding',
    startDate: '2026-10-04',
    endDate: '2026-12-15',
    status: 'Active',
  },
  {
    id: 'ban-4',
    title: 'Mobile browser app installation nudge',
    copy: 'Install JobRisers PWA to receive immediate push notifications when recruiters view your application.',
    ctaText: 'Add Shortcut to Home Screen',
    destinationUrl: '/pwa-install',
    targetAudience: 'All',
    placement: 'Settings',
    startDate: '2026-09-18',
    endDate: '2026-10-31',
    status: 'Paused',
  },
];

export const initialAdminPremiumUpgradeConfig: AdminPremiumUpgradeCardConfig = {
  title: 'Upgrade to JobRisers Pro',
  copy: 'Unlock early access to top high-growth tech roles, ATS score benchmarking, and direct recruiter discovery.',
  ctaText: 'Get Pro for ₹799/mo',
  targetPlan: 'Candidate Pro Monthly',
  placements: {
    settings: true,
    interviews: true,
    resumes: true,
    messages: true,
  },
};

export const initialAdminEmailTemplates: AdminEmailTemplate[] = [
  {
    id: 'emt-1',
    name: 'Application viewed notification',
    type: 'Transactional',
    triggerEvent: 'employer_view_application',
    subject: '{{company_name}} viewed your application for {{job_title}}',
    senderName: 'JobRisers Notifications <notifications@jobrisers.com>',
    body: 'Hi {{candidate_name}},\n\nGreat news! The hiring team at {{company_name}} just viewed your application for the {{job_title}} role.\n\nYou can track the progress of your application and any upcoming interview requests directly in your dashboard.\n\nBest regards,\nThe JobRisers Team',
    variables: ['{{candidate_name}}', '{{company_name}}', '{{job_title}}', '{{dashboard_url}}'],
    status: 'Active',
    lastUpdated: '2026-10-05',
  },
  {
    id: 'emt-2',
    name: 'Interview invite & calendar attachment',
    type: 'Transactional',
    triggerEvent: 'interview_scheduled',
    subject: 'Interview invitation from {{company_name}} for {{job_title}}',
    senderName: 'JobRisers Interviews <interviews@jobrisers.com>',
    body: 'Hi {{candidate_name}},\n\n{{company_name}} has scheduled an interview with you for {{job_title}}.\n\nDate & Time: {{interview_date}}\nMeeting Link: {{meeting_link}}\n\nA calendar invitation (.ics) is attached for your convenience. Please test your camera and audio in advance.\n\nBest regards,\nJobRisers Scheduling',
    variables: ['{{candidate_name}}', '{{company_name}}', '{{job_title}}', '{{interview_date}}', '{{meeting_link}}', '{{calendar_ics}}'],
    status: 'Active',
    lastUpdated: '2026-10-08',
  },
  {
    id: 'emt-3',
    name: 'Employer verification outcome',
    type: 'Transactional',
    triggerEvent: 'employer_verification_decision',
    subject: 'Your JobRisers employer account has been {{verification_status}}',
    senderName: 'JobRisers Trust & Safety <verify@jobrisers.com>',
    body: 'Hello {{company_name}} Team,\n\nYour employer registration and corporate verification request has been evaluated.\n\nStatus: {{verification_status}}\nReviewer Notes: {{decision_notes}}\n\nPlease log in to your employer portal to manage active job listings and team permissions.\n\nBest regards,\nTrust & Safety Operations',
    variables: ['{{company_name}}', '{{verification_status}}', '{{decision_notes}}', '{{dashboard_url}}'],
    status: 'Active',
    lastUpdated: '2026-10-11',
  },
  {
    id: 'emt-4',
    name: 'Password reset & 2FA recovery link',
    type: 'Transactional',
    triggerEvent: 'user_password_reset',
    subject: 'Reset your JobRisers security credentials',
    senderName: 'JobRisers Security <security@jobrisers.com>',
    body: 'Hi {{candidate_name}},\n\nWe received a request to reset your password. Click the secure link below to proceed:\n\n{{reset_link}}\n\nThis link expires in {{expiry_minutes}} minutes. If you did not request this, please contact security immediately.\n\nIP Address: {{ip_address}}\n\nJobRisers Security Team',
    variables: ['{{candidate_name}}', '{{reset_link}}', '{{expiry_minutes}}', '{{ip_address}}'],
    status: 'Active',
    lastUpdated: '2026-09-14',
  },
  {
    id: 'emt-5',
    name: 'Weekly personalized job recommendations digest',
    type: 'Marketing',
    triggerEvent: 'weekly_digest_cron',
    subject: '{{match_count}} new roles matching your profile this week',
    senderName: 'JobRisers Opportunities <digest@jobrisers.com>',
    body: 'Hi {{candidate_name}},\n\nHere are this week\'s top matched opportunities based on your skills and preferences:\n\n{{top_jobs_list}}\n\nLog in to apply with 1-click or update your career goals.\n\nUnsubscribe: {{unsubscribe_link}}\n\nBest,\nThe JobRisers Team',
    variables: ['{{candidate_name}}', '{{match_count}}', '{{top_jobs_list}}', '{{unsubscribe_link}}'],
    status: 'Active',
    lastUpdated: 'Today',
  },
];

export const initialAdminMediaAssets: AdminMediaAsset[] = [
  {
    id: 'med-1',
    filename: 'hero-bg-v3.jpg',
    fileType: 'Image',
    format: 'JPG',
    dimensions: '1920x1080',
    fileSize: '1.2 MB',
    status: 'Active',
    url: 'https://assets.jobrisers.com/landing/hero-bg-v3.jpg',
    usageCount: 2,
    usedIn: ['Landing Hero', 'Jobs Hero Banner'],
    uploadedAt: '2026-10-01',
  },
  {
    id: 'med-2',
    filename: 'company-placeholder-logo.svg',
    fileType: 'Vector SVG',
    format: 'SVG',
    dimensions: '256x256',
    fileSize: '14 KB',
    status: 'Active',
    url: 'https://assets.jobrisers.com/brand/company-placeholder-logo.svg',
    usageCount: 42,
    usedIn: ['Company Cards', 'Job Cards', 'Application History'],
    uploadedAt: '2026-08-20',
  },
  {
    id: 'med-3',
    filename: 'resume-pro-preview-badge.png',
    fileType: 'Image',
    format: 'PNG',
    dimensions: '600x400',
    fileSize: '240 KB',
    status: 'Active',
    url: 'https://assets.jobrisers.com/badges/resume-pro-preview-badge.png',
    usageCount: 4,
    usedIn: ['Candidate Dashboard', 'Resume Builder', 'Pro Upgrade Card'],
    uploadedAt: '2026-09-12',
  },
  {
    id: 'med-4',
    filename: 'trust-shield-verified.svg',
    fileType: 'Vector SVG',
    format: 'SVG',
    dimensions: '64x64',
    fileSize: '8 KB',
    status: 'Active',
    url: 'https://assets.jobrisers.com/icons/trust-shield-verified.svg',
    usageCount: 120,
    usedIn: ['Verified Company Pill', 'Chat Header', 'Job Detail'],
    uploadedAt: '2026-08-15',
  },
  {
    id: 'med-5',
    filename: 'og-marketplace-preview.png',
    fileType: 'Image',
    format: 'PNG',
    dimensions: '1200x630',
    fileSize: '850 KB',
    status: 'Active',
    url: 'https://assets.jobrisers.com/meta/og-marketplace-preview.png',
    usageCount: 1,
    usedIn: ['OpenGraph HTML Meta'],
    uploadedAt: '2026-10-04',
  },
];


// ============================================================================
// RESUME & PRO MODULE ADMIN MODELS & MOCK DATA (PRD Section 5.11, PRO-1 - PRO-17)
// ============================================================================

export type ResumeTemplateTier = 'Standard' | 'ATS Pro' | 'Pro';
export type ResumeTemplateLayout = 'single-column' | 'two-column-sidebar' | 'dense-grid';
export type ResumeTemplateStatus = 'Published' | 'Draft' | 'Archived';

export interface AdminResumeTemplate {
  id: string;
  name: string;
  version: string;
  tier: ResumeTemplateTier;
  atsValidated: boolean;
  status: ResumeTemplateStatus;
  displayOrder: number;
  description: string;
  layout: ResumeTemplateLayout;
  thumbnailBadge: string;
  isRestricted: boolean; // PRO-13 lock indicator
  tags: string[];
}

export interface AdminResumeDesignConfig {
  accentColor: string; // Hex color
  colorName: string;
  typography: 'Plus Jakarta Sans + Inter' | 'Inter + Roboto' | 'Playfair + Source Serif' | 'Fira Code + JetBrains';
  density: 'Compact' | 'Balanced' | 'Roomy';
}

export interface AdminResumeSectionItem {
  id: string;
  name: string;
  key: string;
  isEnabled: boolean;
  order: number;
  description: string;
  isCustomizable: boolean;
}

export interface AdminAtsValidationSettings {
  scoringMethod: string;
  validationAuthority: string;
  isVerifiedBadgeEnabled: boolean;
  legalDisclaimer: string;
  supportedAtsList: string[];
}

export interface AdminFailedExportLog {
  id: string;
  candidateName: string;
  candidateEmail: string;
  templateName: string;
  exportType: 'Clean PDF/A' | 'Word .docx' | 'Watermarked PDF' | 'Vector PDF';
  failureReason: string;
  timestamp: string;
  status: 'Failed' | 'Retrying' | 'Resolved';
}

export interface AdminResumeUsageMetrics {
  totalResumesCreated: number;
  successfulPdfExports: number;
  failedPdfExports: number;
  watermarkedExports: number;
  cleanExports: number;
  tokenConsumption: number;
  estimatedTokenCostUsd: number;
  monthlyCostCapUsd: number;
  timeRange: string;
}

export interface AdminCandidatePlanTier {
  id: string;
  name: string;
  badge: string;
  priceUsdMonthly: number;
  priceUsdAnnual: number;
  priceInrMonthly: number;
  billingCycle: 'Monthly' | 'Annual' | 'Free' | 'Custom';
  trialDays: number;
  hasMoneyBackGuarantee: boolean;
  status: 'Active' | 'Draft' | 'Archived';
  resumeQuota: string;
  exportEntitlements: string[];
  customizationEntitlements: string[];
  aiFeatures: string[];
  recruiterIndexingEntitlement: boolean;
  productLine: 'JobRisers Pro' | 'Premium Career Booster' | 'Standard Free';
  description: string;
}

export interface AdminResumeWatermarkConfig {
  watermarkText: string;
  opacity: number; // 0 to 100
  position: 'Bottom margin' | 'Subtle diagonal';
  fontFamily: string;
}

export interface AdminResumeFeatureGating {
  removeWatermark: boolean;
  customAccentColors: boolean;
  typographySelection: boolean;
  lineDensityControl: boolean;
  perCandidateOverrideEnabled: boolean;
}

export interface AdminProPurchaseCardConfig {
  headline: string;
  monthlyDisplayPrice: string;
  annualDisplayPrice: string;
  billingCycleText: string;
  ctaText: string;
  perks: string[];
  trustLine: string;
  accentBadge: string;
}

export interface AdminCandidateSubscription {
  id: string; // e.g. sub_1P8xYz99120
  candidateName: string;
  candidateEmail: string;
  planId: string;
  planName: string;
  gateway: 'Stripe' | 'Razorpay';
  status: 'Active' | 'Trial' | 'Past due' | 'Cancelled' | 'Suspended';
  amount: number;
  currency: 'USD' | 'INR';
  startDate: string;
  renewalDate: string;
  priorityRecruiterIndexing: boolean;
  entitlements: {
    cleanExports: boolean;
    unlimitedVariations: boolean;
    advancedThemes: boolean;
    aiBulletRewriter: boolean;
  };
}

export interface AdminRecruiterIndexingAudit {
  id: string;
  subscriberId: string;
  subscriberName: string;
  previousState: boolean;
  newState: boolean;
  action: string;
  timestamp: string;
  adminUser: string;
}

export interface AdminCandidateInvoice {
  id: string; // e.g. INV-PRO-8941
  candidateName: string;
  candidateEmail: string;
  planName: string;
  amount: number;
  currency: 'USD' | 'INR';
  gateway: 'Stripe' | 'Razorpay UPI';
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  invoiceDate: string;
  gstAmount: number;
  totalAmount: number;
  billingAddress: string;
  paymentMethod: string;
}

export interface AdminCandidateRefundRequest {
  id: string; // e.g. RF-2281
  invoiceId: string;
  candidateName: string;
  candidateEmail: string;
  amount: number;
  currency: 'USD' | 'INR';
  reason: string;
  requestDate: string;
  subscriptionStartDate: string;
  eligibilityStatus: 'Eligible' | 'Outside window' | 'Needs review';
  status: 'Needs approval' | 'Resolved' | 'Rejected';
  creditNoteId?: string;
  rejectionReason?: string;
  timeline: { action: string; timestamp: string; note: string }[];
}

export interface AdminCandidateDunningCase {
  id: string;
  candidateName: string;
  candidateEmail: string;
  planName: string;
  amount: number;
  currency: 'USD';
  retryCount: number;
  maxRetries: number;
  lastRetry: string;
  nextRetry: string;
  dunningState: 'Grace period active' | 'Retry 2 of 3' | 'Subscription suspended';
  status: 'Retrying' | 'Resolved' | 'Failed';
}

export interface AdminCandidateCoupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Flat amount' | 'Free trial days';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  redemptions: number;
  maxRedemptions: number;
  planScope: 'JobRisers Pro Monthly' | 'JobRisers Pro Annual' | 'All Pro Plans';
  status: 'Active' | 'Expired' | 'Scheduled';
  description: string;
}

// ----------------------------------------------------------------------------
// INITIAL MOCK COLLECTIONS FOR RESUME & PRO
// ----------------------------------------------------------------------------

export const initialAdminResumeTemplates: AdminResumeTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Modern Split',
    version: 'v2.4',
    tier: 'ATS Pro',
    atsValidated: true,
    status: 'Published',
    displayOrder: 1,
    description: 'Two-column layout with left sidebar for skills, metadata and contact info. Highly rated for product & design roles.',
    layout: 'two-column-sidebar',
    thumbnailBadge: 'ATS Verified',
    isRestricted: false,
    tags: ['Sidebar', 'Designers', 'Product Managers', 'Modern'],
  },
  {
    id: 'tmpl-2',
    name: 'Tech Mono',
    version: 'v1.8',
    tier: 'Pro',
    atsValidated: false,
    status: 'Published',
    displayOrder: 2,
    description: 'Developer-oriented layout with monospace font accents, terminal headers and compact skill badge matrices.',
    layout: 'dense-grid',
    thumbnailBadge: 'Pro Only',
    isRestricted: true,
    tags: ['Monospace', 'Full Stack', 'DevOps', 'Cloud Engineers'],
  },
  {
    id: 'tmpl-3',
    name: 'Executive Serif',
    version: 'v3.1',
    tier: 'Pro',
    atsValidated: false,
    status: 'Published',
    displayOrder: 3,
    description: 'Traditional executive leadership typography with elegant serif headers, executive summaries and board credentials.',
    layout: 'single-column',
    thumbnailBadge: 'Pro Only',
    isRestricted: true,
    tags: ['Executive', 'Leadership', 'Director', 'Traditional'],
  },
  {
    id: 'tmpl-4',
    name: 'Minimalist Clean',
    version: 'v2.0',
    tier: 'Standard',
    atsValidated: false,
    status: 'Published',
    displayOrder: 4,
    description: 'Standard single-column clean resume with generous whitespace, crisp bullet hierarchies and zero formatting clutter.',
    layout: 'single-column',
    thumbnailBadge: 'Free Tier',
    isRestricted: false,
    tags: ['Clean', 'Minimalist', 'Standard', 'Entry Level'],
  },
  {
    id: 'tmpl-5',
    name: 'Compact Engineering',
    version: 'v1.5',
    tier: 'ATS Pro',
    atsValidated: true,
    status: 'Published',
    displayOrder: 5,
    description: 'Dense technical skills matrix and structured timeline designed for high-density engineering career histories.',
    layout: 'single-column',
    thumbnailBadge: 'ATS Verified',
    isRestricted: false,
    tags: ['Engineering', 'Dense Matrix', 'ATS Compliant'],
  },
];

export const initialAdminResumeDesignConfig: AdminResumeDesignConfig = {
  accentColor: '#6366f1',
  colorName: 'JobRisers Purple',
  typography: 'Plus Jakarta Sans + Inter',
  density: 'Balanced',
};

export const initialAdminResumeSections: AdminResumeSectionItem[] = [
  { id: 'sec-1', name: 'Profile Summary', key: 'summary', isEnabled: true, order: 1, description: 'Executive bio and value proposition', isCustomizable: true },
  { id: 'sec-2', name: 'Core Proficiencies', key: 'skills', isEnabled: true, order: 2, description: 'Key skills, tooling and domain knowledge', isCustomizable: true },
  { id: 'sec-3', name: 'Work Experience', key: 'experience', isEnabled: true, order: 3, description: 'Reverse-chronological career history and metrics', isCustomizable: true },
  { id: 'sec-4', name: 'Education', key: 'education', isEnabled: true, order: 4, description: 'Academic degrees, university honors, coursework', isCustomizable: true },
  { id: 'sec-5', name: 'Credentials & Certs', key: 'credentials', isEnabled: true, order: 5, description: 'AWS, PMP, CFA, GCP official certifications', isCustomizable: true },
  { id: 'sec-6', name: 'Featured Projects', key: 'projects', isEnabled: true, order: 6, description: 'Key portfolio projects with live URLs', isCustomizable: true },
  { id: 'sec-7', name: 'Open to Global Remote badge', key: 'remote_badge', isEnabled: true, order: 7, description: 'Header badge indicating remote readiness', isCustomizable: false },
  { id: 'sec-8', name: 'Portfolio Link', key: 'portfolio_link', isEnabled: true, order: 8, description: 'Direct clickable URL to candidate portfolio', isCustomizable: true },
  { id: 'sec-9', name: 'JobRisers DOC-ID', key: 'doc_id', isEnabled: true, order: 9, description: 'Unique cryptographic document fingerprint', isCustomizable: false },
  { id: 'sec-10', name: 'Page Count Indicator', key: 'page_count', isEnabled: false, order: 10, description: 'Bottom footer page counter (e.g. Page 1 of 2)', isCustomizable: true },
];

export const initialAdminAtsValidationSettings: AdminAtsValidationSettings = {
  scoringMethod: 'Keyword Density + Structural Semantic Tagging v3.4',
  validationAuthority: 'JobRisers ATS Certification Engine & Parser Lab',
  isVerifiedBadgeEnabled: true,
  legalDisclaimer: 'Multi-ATS compatibility claims (including Workday, Greenhouse, Lever, and Taleo) are subject to platform validation rules and ATS parser versions. Standard layouts optimize semantic parse rates.',
  supportedAtsList: ['Workday HCM', 'Greenhouse', 'Lever', 'Oracle Taleo', 'SAP SuccessFactors', 'iCIMS'],
};

export const initialAdminFailedExportLogs: AdminFailedExportLog[] = [
  {
    id: 'exp-log-1',
    candidateName: 'Vikram Sethi',
    candidateEmail: 'vikram.sethi@example.com',
    templateName: 'Tech Mono v1.8',
    exportType: 'Clean PDF/A',
    failureReason: 'Headless Chromium render timeout on complex SVG font rendering',
    timestamp: 'Today at 10:42 AM',
    status: 'Failed',
  },
  {
    id: 'exp-log-2',
    candidateName: 'Shreya Das',
    candidateEmail: 'shreya.das@example.com',
    templateName: 'Modern Split v2.4',
    exportType: 'Word .docx',
    failureReason: 'Docx XML table margin boundary exceeded 8.5in limit',
    timestamp: 'Yesterday at 04:15 PM',
    status: 'Failed',
  },
  {
    id: 'exp-log-3',
    candidateName: 'Arjun Verma',
    candidateEmail: 'arjun.verma@example.com',
    templateName: 'Executive Serif v3.1',
    exportType: 'Clean PDF/A',
    failureReason: 'Font subset embedding failed for custom serif glyph',
    timestamp: 'Oct 12 at 02:20 PM',
    status: 'Resolved',
  },
];

export const initialAdminResumeUsageMetrics: AdminResumeUsageMetrics = {
  totalResumesCreated: 14820,
  successfulPdfExports: 12450,
  failedPdfExports: 42,
  watermarkedExports: 8310,
  cleanExports: 4140,
  tokenConsumption: 1420500,
  estimatedTokenCostUsd: 42.61,
  monthlyCostCapUsd: 100.00,
  timeRange: 'Current Billing Cycle (Oct 1 - Oct 31, 2026)',
};

export const initialAdminCandidatePlanTiers: AdminCandidatePlanTier[] = [
  {
    id: 'plan-pro-monthly',
    name: 'JobRisers Pro · Monthly',
    badge: 'Popular',
    priceUsdMonthly: 9.99,
    priceUsdAnnual: 119.88,
    priceInrMonthly: 799,
    billingCycle: 'Monthly',
    trialDays: 7,
    hasMoneyBackGuarantee: true,
    status: 'Active',
    resumeQuota: 'Unlimited Variations',
    exportEntitlements: ['Clean Vector PDF/A (300 DPI)', 'Watermark-free', 'Editable Word .docx'],
    customizationEntitlements: ['5 Accent Colors', 'Custom Typography Pairing', 'Adjustable Line Density', 'ATS Score Breakdown'],
    aiFeatures: ['AI Bullet Rewriter (50 uses/mo)', 'Action Verb Enhancer'],
    recruiterIndexingEntitlement: true,
    productLine: 'JobRisers Pro',
    description: 'Comprehensive toolkit for active job seekers looking for clean unmetered exports and tailored variations.',
  },
  {
    id: 'plan-pro-annual',
    name: 'JobRisers Pro · Annual',
    badge: 'Best Value (33% Off)',
    priceUsdMonthly: 6.67,
    priceUsdAnnual: 79.99,
    priceInrMonthly: 541,
    billingCycle: 'Annual',
    trialDays: 7,
    hasMoneyBackGuarantee: true,
    status: 'Active',
    resumeQuota: 'Unlimited Variations',
    exportEntitlements: ['Clean Vector PDF/A (300 DPI)', 'Watermark-free', 'Editable Word .docx', 'Priority Processing'],
    customizationEntitlements: ['5 Accent Colors', 'Custom Typography Pairing', 'Adjustable Line Density', 'ATS Score Breakdown', 'DOC-ID Fingerprint'],
    aiFeatures: ['AI Bullet Rewriter (Unlimited)', 'AI Cover Letter Generator', 'Action Verb Enhancer'],
    recruiterIndexingEntitlement: true,
    productLine: 'JobRisers Pro',
    description: 'Annual commitment with priority recruiter indexing and high-limit AI credits.',
  },
  {
    id: 'plan-standard-free',
    name: 'Standard Free Tier',
    badge: 'Default',
    priceUsdMonthly: 0,
    priceUsdAnnual: 0,
    priceInrMonthly: 0,
    billingCycle: 'Free',
    trialDays: 0,
    hasMoneyBackGuarantee: false,
    status: 'Active',
    resumeQuota: '1 Default Resume',
    exportEntitlements: ['Watermarked PDF only'],
    customizationEntitlements: ['Standard Minimalist Template', 'Default Purple Accent', 'Balanced Spacing'],
    aiFeatures: ['Basic Keyword Match Preview'],
    recruiterIndexingEntitlement: false,
    productLine: 'Standard Free',
    description: 'Free forever candidate builder with basic single-column export and bottom watermark.',
  },
  {
    id: 'plan-career-booster',
    name: 'Premium Career Booster',
    badge: 'Draft New Product',
    priceUsdMonthly: 14.99,
    priceUsdAnnual: 149.99,
    priceInrMonthly: 1199,
    billingCycle: 'Monthly',
    trialDays: 3,
    hasMoneyBackGuarantee: true,
    status: 'Draft',
    resumeQuota: 'Unlimited Variations',
    exportEntitlements: ['Clean Vector PDF/A', 'Direct Recruiter Send Link'],
    customizationEntitlements: ['All Premium Templates', 'Custom Branding'],
    aiFeatures: ['AI Bullet Rewriter', 'AI Mock Interview Prep', '1-on-1 Recruiter Spotlight'],
    recruiterIndexingEntitlement: true,
    productLine: 'Premium Career Booster',
    description: 'Separate premium accelerator product with early access to top verified jobs and interview preparation modules.',
  },
];

export const initialAdminResumeWatermarkConfig: AdminResumeWatermarkConfig = {
  watermarkText: 'Created with JobRisers',
  opacity: 25,
  position: 'Bottom margin',
  fontFamily: 'Inter, system-ui, sans-serif',
};

export const initialAdminResumeFeatureGating: AdminResumeFeatureGating = {
  removeWatermark: true,
  customAccentColors: true,
  typographySelection: true,
  lineDensityControl: true,
  perCandidateOverrideEnabled: true,
};

export const initialAdminProPurchaseCardConfig: AdminProPurchaseCardConfig = {
  headline: 'Upgrade to JobRisers Pro',
  monthlyDisplayPrice: '$9.99',
  annualDisplayPrice: '$79.99/year',
  billingCycleText: 'Billed monthly or annually. Cancel anytime in 1 click.',
  ctaText: 'Subscribe & Remove Watermark',
  perks: [
    'Clean unmetered PDF/A & Word .docx exports',
    'Unlimited resume variations for every role',
    'Full access to all 5 accent colors & custom typography',
    'Priority recruiter indexing across verified employers',
  ],
  trustLine: 'Instant activation, cancel anytime in 1-click, 7-day money-back guarantee',
  accentBadge: '7-Day Guarantee',
};

export const initialAdminCandidateSubscriptions: AdminCandidateSubscription[] = [
  {
    id: 'sub_1P8xYz99120',
    candidateName: 'Aarav Mehta',
    candidateEmail: 'aarav.mehta@example.com',
    planId: 'plan-pro-monthly',
    planName: 'JobRisers Pro · Monthly',
    gateway: 'Stripe',
    status: 'Active',
    amount: 9.99,
    currency: 'USD',
    startDate: '2026-10-02',
    renewalDate: '2026-11-02',
    priorityRecruiterIndexing: true,
    entitlements: {
      cleanExports: true,
      unlimitedVariations: true,
      advancedThemes: true,
      aiBulletRewriter: true,
    },
  },
  {
    id: 'sub_1Q4wRt88231',
    candidateName: 'Rohan Kapoor',
    candidateEmail: 'rohan.kapoor@example.com',
    planId: 'plan-pro-annual',
    planName: 'JobRisers Pro · Annual',
    gateway: 'Razorpay',
    status: 'Active',
    amount: 79.99,
    currency: 'USD',
    startDate: '2026-10-02',
    renewalDate: '2027-10-02',
    priorityRecruiterIndexing: true,
    entitlements: {
      cleanExports: true,
      unlimitedVariations: true,
      advancedThemes: true,
      aiBulletRewriter: true,
    },
  },
  {
    id: 'sub_1R9mKl77112',
    candidateName: 'Priya Nair',
    candidateEmail: 'priya.nair@example.com',
    planId: 'plan-pro-monthly',
    planName: '7-Day Trial (Pro Monthly)',
    gateway: 'Stripe',
    status: 'Trial',
    amount: 0.00,
    currency: 'USD',
    startDate: '2026-10-08',
    renewalDate: '2026-10-15',
    priorityRecruiterIndexing: false,
    entitlements: {
      cleanExports: true,
      unlimitedVariations: true,
      advancedThemes: false,
      aiBulletRewriter: true,
    },
  },
  {
    id: 'sub_1T2pVx66543',
    candidateName: 'Meera Iyer',
    candidateEmail: 'meera.iyer@example.com',
    planId: 'plan-pro-monthly',
    planName: 'JobRisers Pro · Monthly',
    gateway: 'Razorpay',
    status: 'Suspended',
    amount: 9.99,
    currency: 'USD',
    startDate: '2026-09-14',
    renewalDate: '2026-10-14',
    priorityRecruiterIndexing: false,
    entitlements: {
      cleanExports: false,
      unlimitedVariations: true,
      advancedThemes: false,
      aiBulletRewriter: false,
    },
  },
];

export const initialAdminRecruiterIndexingAudits: AdminRecruiterIndexingAudit[] = [
  {
    id: 'idx-aud-1',
    subscriberId: 'sub_1P8xYz99120',
    subscriberName: 'Aarav Mehta',
    previousState: false,
    newState: true,
    action: 'Auto-enabled upon Pro Annual activation',
    timestamp: '2026-10-02 11:30 AM',
    adminUser: 'System (Billing Webhook)',
  },
  {
    id: 'idx-aud-2',
    subscriberId: 'sub_1T2pVx66543',
    subscriberName: 'Meera Iyer',
    previousState: true,
    newState: false,
    action: 'Paused due to account suspension and payment failure',
    timestamp: 'Yesterday at 03:40 PM',
    adminUser: 'System (Dunning Engine)',
  },
];

export const initialAdminCandidateInvoices: AdminCandidateInvoice[] = [
  {
    id: 'INV-PRO-8941',
    candidateName: 'Aarav Mehta',
    candidateEmail: 'aarav.mehta@example.com',
    planName: 'JobRisers Pro · Monthly',
    amount: 9.99,
    currency: 'USD',
    gateway: 'Stripe',
    status: 'Paid',
    invoiceDate: '2026-10-02',
    gstAmount: 1.52,
    totalAmount: 9.99,
    billingAddress: '42 Indiranagar 100ft Rd, Bengaluru, KA 560038, India',
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'INV-PRO-8938',
    candidateName: 'Rohan Kapoor',
    candidateEmail: 'rohan.kapoor@example.com',
    planName: 'JobRisers Pro · Annual',
    amount: 79.99,
    currency: 'USD',
    gateway: 'Razorpay UPI',
    status: 'Paid',
    invoiceDate: '2026-10-02',
    gstAmount: 12.20,
    totalAmount: 79.99,
    billingAddress: '88 Cyber City DLF Phase 2, Gurugram, HR 122002, India',
    paymentMethod: 'UPI / rohan@okhdfcbank',
  },
  {
    id: 'INV-PRO-8920',
    candidateName: 'Meera Iyer',
    candidateEmail: 'meera.iyer@example.com',
    planName: 'JobRisers Pro · Monthly',
    amount: 9.99,
    currency: 'USD',
    gateway: 'Razorpay UPI',
    status: 'Paid',
    invoiceDate: '2026-09-14',
    gstAmount: 1.52,
    totalAmount: 9.99,
    billingAddress: '15 Anna Nagar West, Chennai, TN 600040, India',
    paymentMethod: 'Mastercard ending in 9012',
  },
];

export const initialAdminCandidateRefunds: AdminCandidateRefundRequest[] = [
  {
    id: 'RF-2281',
    invoiceId: 'INV-PRO-8920',
    candidateName: 'Meera Iyer',
    candidateEmail: 'meera.iyer@example.com',
    amount: 9.99,
    currency: 'USD',
    reason: 'Candidate did not require resume export after securing role; requested refund within guarantee window.',
    requestDate: '2026-10-15',
    subscriptionStartDate: '2026-10-12',
    eligibilityStatus: 'Eligible',
    status: 'Needs approval',
    timeline: [
      { action: 'Refund requested by user', timestamp: '31 min ago', note: 'Selected reason: Found a job' },
      { action: 'Automated policy check', timestamp: '30 min ago', note: 'Within 7-day money-back guarantee window (Day 3)' },
    ],
  },
  {
    id: 'RF-2280',
    invoiceId: 'INV-PRO-8899',
    candidateName: 'Devika Sharma',
    candidateEmail: 'devika.s@example.com',
    amount: 9.99,
    currency: 'USD',
    reason: 'Duplicate payment processed during network glitch.',
    requestDate: '2026-10-14',
    subscriptionStartDate: '2026-10-14',
    eligibilityStatus: 'Eligible',
    status: 'Resolved',
    creditNoteId: 'CN-8820',
    timeline: [
      { action: 'Refund requested', timestamp: 'Yesterday 09:12 AM', note: 'Duplicate gateway charge' },
      { action: 'Approved by Finance Admin', timestamp: 'Yesterday 11:45 AM', note: 'Credit note CN-8820 issued to card' },
    ],
  },
  {
    id: 'RF-2279',
    invoiceId: 'INV-PRO-8812',
    candidateName: 'Anil Gupta',
    candidateEmail: 'anil.gupta@example.com',
    amount: 9.99,
    currency: 'USD',
    reason: 'Candidate requested refund after 35 days of active usage.',
    requestDate: '2026-09-29',
    subscriptionStartDate: '2026-08-25',
    eligibilityStatus: 'Outside window',
    status: 'Rejected',
    rejectionReason: 'Request submitted 35 days post-activation, which exceeds the platform 7-day guarantee policy.',
    timeline: [
      { action: 'Refund requested', timestamp: 'Sep 29', note: 'Claimed dissatisfaction after 5 weeks' },
      { action: 'Rejected by Finance Admin', timestamp: 'Sep 29', note: 'Outside 7-day guarantee window' },
    ],
  },
];

export const initialAdminCandidateDunningCases: AdminCandidateDunningCase[] = [
  {
    id: 'dun-1',
    candidateName: 'Meera Iyer',
    candidateEmail: 'meera.iyer@example.com',
    planName: 'JobRisers Pro · Monthly',
    amount: 9.99,
    currency: 'USD',
    retryCount: 2,
    maxRetries: 3,
    lastRetry: 'Yesterday at 03:30 PM',
    nextRetry: 'Tomorrow at 09:00 AM',
    dunningState: 'Grace period active',
    status: 'Retrying',
  },
  {
    id: 'dun-2',
    candidateName: 'Karan Malhotra',
    candidateEmail: 'karan.m@example.com',
    planName: 'JobRisers Pro · Monthly',
    amount: 9.99,
    currency: 'USD',
    retryCount: 3,
    maxRetries: 3,
    lastRetry: 'Oct 11 at 12:00 PM',
    nextRetry: 'None (Suspended)',
    dunningState: 'Subscription suspended',
    status: 'Failed',
  },
];

export const initialAdminCandidateCoupons: AdminCandidateCoupon[] = [
  {
    id: 'coup-1',
    code: 'WINTER25',
    discountType: 'Percentage',
    discountValue: 25,
    validFrom: '2026-10-01',
    validUntil: '2026-12-31',
    redemptions: 400,
    maxRedemptions: 500,
    planScope: 'JobRisers Pro Monthly',
    status: 'Active',
    description: '25% off first 3 months · 100 redemptions left · Pro Monthly',
  },
  {
    id: 'coup-2',
    code: 'NEWCAREER50',
    discountType: 'Percentage',
    discountValue: 50,
    validFrom: '2026-10-01',
    validUntil: '2026-11-15',
    redemptions: 88,
    maxRedemptions: 200,
    planScope: 'JobRisers Pro Monthly',
    status: 'Active',
    description: '50% off first month · first-time candidate promotion',
  },
  {
    id: 'coup-3',
    code: 'CAMPUS2026',
    discountType: 'Free trial days',
    discountValue: 60,
    validFrom: '2026-09-01',
    validUntil: '2027-06-30',
    redemptions: 312,
    maxRedemptions: 1000,
    planScope: 'All Pro Plans',
    status: 'Active',
    description: 'Free 60-day Pro access for verified university student emails',
  },
  {
    id: 'coup-4',
    code: 'FLASHPRO10',
    discountType: 'Percentage',
    discountValue: 10,
    validFrom: '2026-08-01',
    validUntil: '2026-08-30',
    redemptions: 150,
    maxRedemptions: 150,
    planScope: 'JobRisers Pro Annual',
    status: 'Expired',
    description: '10% recurring discount · expired promotional flash campaign',
  },
];


// ============================================================================
// COMMUNICATION MODULE ADMIN MODELS & MOCK DATA (PRD Section 5.13, COM-1 - COM-10)
// ============================================================================

export interface AdminJobAlertQuery {
  id: string;
  title: string;
  role: string;
  location: string;
  subscribersCount: number;
  frequency: 'Instant' | 'Daily' | 'Weekly';
  sendSuccessRate: number;
  failuresCount: number;
  status: 'Active' | 'Paused';
  lastRun: string;
  channel: 'Email' | 'Push' | 'Email & Push';
}

export interface AdminJobAlertPolicy {
  maxAlertsPerUser: number;
  allowedFrequencies: ('Instant' | 'Daily' | 'Weekly')[];
  allowedChannels: ('Email' | 'Push')[];
  isGloballyPaused: boolean;
}

export interface AdminBroadcastCampaign {
  id: string;
  title: string;
  channels: ('Email' | 'In-App' | 'Push')[];
  targetSegment: 'All Candidates' | 'All Employers' | 'City: Bengaluru' | 'City: Mumbai' | 'Category: Engineering' | 'Category: Design' | 'Pro Users';
  classification: 'Product Update' | 'Marketing Promotion';
  scheduledAt: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  subject: string;
  messageBody: string;
  recipientCount: number;
  deliveryRate: number;
  openRate: number;
}

export interface AdminNotificationTriggerRule {
  id: string;
  eventKey: string;
  eventName: string;
  description: string;
  isEnabled: boolean;
  channels: { email: boolean; inApp: boolean; push: boolean; sms: boolean };
  templateRef: string;
  rateLimit: string;
  priority: 'High' | 'Normal' | 'Low';
}

export interface AdminInAppNotificationConfig {
  retentionDays: 30 | 60 | 90;
  unreadBadgeEnabled: boolean;
  autoMarkReadOnClick: boolean;
  enabledTypes: string[];
}

export interface AdminPreferencePolicy {
  id: string;
  category: string;
  description: string;
  defaultOptIn: boolean;
  isTransactionalExempt: boolean; // Security, Legal, Payment are locked to Always Send
  status: 'Enforced' | 'Active';
}

export interface AdminConsentAuditRecord {
  id: string;
  candidateName: string;
  email: string;
  consentStatus: 'Opted In' | 'Unsubscribed' | 'Pending';
  timestamp: string;
  source: string;
  region: 'India' | 'European Union' | 'United States' | 'Global';
  complianceTag: 'DPDP Act 2023 Validated' | 'GDPR Art. 7 Consent' | 'CAN-SPAM Verified';
}

export interface AdminDeliveryLogItem {
  id: string;
  dispatchId: string;
  recipient: string;
  channel: 'Email' | 'Push' | 'SMS';
  provider: 'SES' | 'FCM' | 'Twilio' | 'APNs';
  event: string;
  status: 'Delivered' | 'Bounced' | 'Complained' | 'Suppressed';
  timestamp: string;
  errorReason?: string;
}

export interface AdminSuppressionRecord {
  id: string;
  recipient: string;
  reason: 'Hard Bounce' | 'Spam Complaint' | 'User Unsubscribe';
  dateAdded: string;
  provider: 'SES' | 'FCM' | 'Twilio' | 'APNs';
}

export interface AdminPushMonitoring {
  fcmStatus: string;
  apnsStatus: string;
  activeTokensCount: number;
  deliveredCount: number;
  clickedCount: number;
  failedCount: number;
  invalidatedTokensCount: number;
  perConversationPushEnabled: boolean;
}

// ----------------------------------------------------------------------------
// INITIAL MOCK COLLECTIONS FOR COMMUNICATION
// ----------------------------------------------------------------------------

export const initialAdminJobAlerts: AdminJobAlertQuery[] = [
  {
    id: 'alt-1',
    title: 'Senior Product Designer · Bengaluru',
    role: 'Senior Product Designer',
    location: 'Bengaluru, India',
    subscribersCount: 1284,
    frequency: 'Daily',
    sendSuccessRate: 94.0,
    failuresCount: 77,
    status: 'Active',
    lastRun: 'Today at 08:00 AM',
    channel: 'Email & Push',
  },
  {
    id: 'alt-2',
    title: 'Frontend Engineer (React) · Remote India',
    role: 'Frontend Engineer (React)',
    location: 'Remote India',
    subscribersCount: 3410,
    frequency: 'Instant',
    sendSuccessRate: 97.0,
    failuresCount: 102,
    status: 'Active',
    lastRun: 'Today at 11:30 AM',
    channel: 'Email & Push',
  },
  {
    id: 'alt-3',
    title: 'Data Platform Engineer · Pune / Hybrid',
    role: 'Data Platform Engineer',
    location: 'Pune / Hybrid',
    subscribersCount: 890,
    frequency: 'Weekly',
    sendSuccessRate: 98.2,
    failuresCount: 16,
    status: 'Active',
    lastRun: 'Yesterday at 09:00 AM',
    channel: 'Email',
  },
  {
    id: 'alt-4',
    title: 'Growth Marketing Lead · Mumbai',
    role: 'Growth Marketing Lead',
    location: 'Mumbai, India',
    subscribersCount: 640,
    frequency: 'Daily',
    sendSuccessRate: 95.8,
    failuresCount: 27,
    status: 'Active',
    lastRun: 'Oct 11 at 08:00 AM',
    channel: 'Email',
  },
  {
    id: 'alt-5',
    title: 'Staff Cloud Architect · Hyderabad',
    role: 'Staff Cloud Architect',
    location: 'Hyderabad, India',
    subscribersCount: 420,
    frequency: 'Daily',
    sendSuccessRate: 99.1,
    failuresCount: 4,
    status: 'Active',
    lastRun: 'Oct 10 at 08:00 AM',
    channel: 'Email & Push',
  },
];

export const initialAdminJobAlertPolicy: AdminJobAlertPolicy = {
  maxAlertsPerUser: 5,
  allowedFrequencies: ['Instant', 'Daily', 'Weekly'],
  allowedChannels: ['Email', 'Push'],
  isGloballyPaused: false,
};

export const initialAdminBroadcasts: AdminBroadcastCampaign[] = [
  {
    id: 'bc-1',
    title: 'New resume templates are here',
    channels: ['Email'],
    targetSegment: 'Pro Users',
    classification: 'Product Update',
    scheduledAt: '2026-10-08 14:00',
    status: 'Scheduled',
    subject: 'Unlock 3 Brand New ATS-Optimized Templates in Resume Builder',
    messageBody: 'We have just added Modern Split, Tech Mono, and Executive Serif templates to JobRisers Pro with 100% verified parser pass rates.',
    recipientCount: 14200,
    deliveryRate: 99.4,
    openRate: 42.0,
  },
  {
    id: 'bc-2',
    title: 'Platform update: 1-Click Apply is live',
    channels: ['In-App', 'Push'],
    targetSegment: 'All Candidates',
    classification: 'Product Update',
    scheduledAt: '2026-10-01 10:00',
    status: 'Published',
    subject: 'Apply to verified engineering roles in 1 tap',
    messageBody: 'Skip redundant application questionnaires with JobRisers 1-Click Apply using your verified profile data.',
    recipientCount: 89000,
    deliveryRate: 98.7,
    openRate: 54.3,
  },
  {
    id: 'bc-3',
    title: 'Scheduled system maintenance announcement',
    channels: ['Email'],
    targetSegment: 'All Employers',
    classification: 'Product Update',
    scheduledAt: '2026-10-18 02:00',
    status: 'Scheduled',
    subject: 'Scheduled Database & Queue Maintenance this Sunday at 2 AM IST',
    messageBody: 'JobRisers will perform database clustering upgrades for 2 hours on Sunday. Employer dashboards will enter read-only mode during this window.',
    recipientCount: 3200,
    deliveryRate: 99.8,
    openRate: 68.2,
  },
  {
    id: 'bc-4',
    title: 'Quarterly career insights newsletter',
    channels: ['Email'],
    targetSegment: 'All Candidates',
    classification: 'Marketing Promotion',
    scheduledAt: '2026-10-25 11:00',
    status: 'Draft',
    subject: 'Q4 2026 Tech Hiring Trends & Salary Benchmark Digest',
    messageBody: 'Discover which tech skills saw 40%+ demand surges in Q3, median compensation brackets across tier-1 startups, and interview prep guides.',
    recipientCount: 52000,
    deliveryRate: 0.0,
    openRate: 0.0,
  },
];

export const initialAdminNotificationTriggers: AdminNotificationTriggerRule[] = [
  {
    id: 'trig-1',
    eventKey: 'app_stage_changed',
    eventName: 'Application status changed',
    description: 'Triggered when an employer advances or updates candidate application stage in the pipeline.',
    isEnabled: true,
    channels: { email: true, inApp: true, push: true, sms: false },
    templateRef: 'tmpl_app_stage_updated',
    rateLimit: 'Instant (1 per stage move)',
    priority: 'High',
  },
  {
    id: 'trig-2',
    eventKey: 'interview_invitation_scheduled',
    eventName: 'Interview invitation scheduled',
    description: 'Triggered when an employer confirms an interview slot with candidate.',
    isEnabled: true,
    channels: { email: true, inApp: true, push: true, sms: true },
    templateRef: 'tmpl_interview_confirmation',
    rateLimit: 'Instant (+ calendar ICS)',
    priority: 'High',
  },
  {
    id: 'trig-3',
    eventKey: 'employer_verification_decision',
    eventName: 'Employer verification decision',
    description: 'Triggered when Trust & Safety approves or denies an employer company verification request.',
    isEnabled: true,
    channels: { email: true, inApp: true, push: false, sms: false },
    templateRef: 'tmpl_company_verified_notice',
    rateLimit: 'Instant',
    priority: 'High',
  },
  {
    id: 'trig-4',
    eventKey: 'job_listing_expiring',
    eventName: 'Job listing expiring in 48 hours',
    description: 'Triggered when active job posting reaches 48 hours prior to auto-expiry deadline.',
    isEnabled: true,
    channels: { email: true, inApp: true, push: false, sms: false },
    templateRef: 'tmpl_job_expiring_48h',
    rateLimit: 'Once per job posting',
    priority: 'Normal',
  },
  {
    id: 'trig-5',
    eventKey: 'subscription_payment_successful',
    eventName: 'Subscription payment successful',
    description: 'Triggered upon successful Stripe or Razorpay webhook billing event.',
    isEnabled: true,
    channels: { email: true, inApp: true, push: false, sms: false },
    templateRef: 'tmpl_invoice_receipt_pdf',
    rateLimit: 'Once per billing cycle',
    priority: 'High',
  },
  {
    id: 'trig-6',
    eventKey: 'safety_scam_keyword_warning',
    eventName: 'Safety scam keyword warning',
    description: 'Triggered when automated safety engine flags suspicious fee solicitation or off-platform payment request.',
    isEnabled: true,
    channels: { email: false, inApp: true, push: true, sms: false },
    templateRef: 'tmpl_scam_safety_warning',
    rateLimit: 'Instant banner upon trigger',
    priority: 'High',
  },
  {
    id: 'trig-7',
    eventKey: 'application_shortlisted',
    eventName: 'Candidate application shortlisted',
    description: 'Triggered when recruiter moves applicant to shortlisted candidate pool.',
    isEnabled: true,
    channels: { email: true, inApp: true, push: true, sms: false },
    templateRef: 'tmpl_app_shortlisted_notice',
    rateLimit: 'Max 1 per 24 hours per candidate',
    priority: 'Normal',
  },
  {
    id: 'trig-8',
    eventKey: 'new_direct_message',
    eventName: 'New recruiter direct message',
    description: 'Triggered when recruiter sends an initial direct reachout or reply message.',
    isEnabled: true,
    channels: { email: true, inApp: true, push: true, sms: false },
    templateRef: 'tmpl_new_chat_message',
    rateLimit: 'Batched if > 3 within 15 min',
    priority: 'Normal',
  },
];

export const initialAdminInAppNotificationConfig: AdminInAppNotificationConfig = {
  retentionDays: 30,
  unreadBadgeEnabled: true,
  autoMarkReadOnClick: true,
  enabledTypes: ['Application Updates', 'Interview Invites', 'Job Alert Digests', 'Security Alerts', 'System Notices'],
};

export const initialAdminPreferencePolicies: AdminPreferencePolicy[] = [
  {
    id: 'pref-1',
    category: 'Job Recommendations',
    description: 'Algorithmically matched job recommendations based on candidate resume and search history.',
    defaultOptIn: true,
    isTransactionalExempt: false,
    status: 'Enforced',
  },
  {
    id: 'pref-2',
    category: 'Application Updates',
    description: 'Real-time pipeline stage advancement, recruiter view timestamps, and interview invitations.',
    defaultOptIn: true,
    isTransactionalExempt: false,
    status: 'Enforced',
  },
  {
    id: 'pref-3',
    category: 'Interview Invites & Reminders',
    description: 'Interview calendar invitations, ICS attachments, meeting link updates, and 1-hour SMS reminders.',
    defaultOptIn: true,
    isTransactionalExempt: false,
    status: 'Enforced',
  },
  {
    id: 'pref-4',
    category: 'Marketing & Promotional Campaigns',
    description: 'Promotional discount codes, resume template upgrade announcements, and feature spotlights.',
    defaultOptIn: false,
    isTransactionalExempt: false,
    status: 'Enforced',
  },
  {
    id: 'pref-5',
    category: 'Career Insights Newsletter',
    description: 'Monthly and quarterly industry salary benchmark digests and hiring trend whitepapers.',
    defaultOptIn: false,
    isTransactionalExempt: false,
    status: 'Enforced',
  },
  {
    id: 'pref-6',
    category: 'Platform Updates',
    description: 'Significant product changelog notices and scheduled maintenance alerts.',
    defaultOptIn: true,
    isTransactionalExempt: false,
    status: 'Enforced',
  },
  // TRANSACTIONAL EXEMPTIONS (ALWAYS SEND - Cannot be switched off)
  {
    id: 'pref-7',
    category: 'Security Alerts (ALWAYS SEND)',
    description: 'Password reset links, two-factor OTP codes, new device login notifications, and account suspension alerts.',
    defaultOptIn: true,
    isTransactionalExempt: true,
    status: 'Enforced',
  },
  {
    id: 'pref-8',
    category: 'Legal & Compliance (ALWAYS SEND)',
    description: 'Terms of Service updates, Privacy Policy amendments, data deletion confirmations, and law enforcement disclosures.',
    defaultOptIn: true,
    isTransactionalExempt: true,
    status: 'Enforced',
  },
  {
    id: 'pref-9',
    category: 'Billing & Invoices (ALWAYS SEND)',
    description: 'Subscription payment receipts, credit notes, payment failure dunning notices, and refund approval confirmations.',
    defaultOptIn: true,
    isTransactionalExempt: true,
    status: 'Enforced',
  },
];

export const initialAdminConsentAuditRecords: AdminConsentAuditRecord[] = [
  {
    id: 'cns-1',
    candidateName: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    consentStatus: 'Opted In',
    timestamp: '2026-10-02 09:14 AM',
    source: 'Candidate Onboarding Step 2 Checkbox',
    region: 'India',
    complianceTag: 'DPDP Act 2023 Validated',
  },
  {
    id: 'cns-2',
    candidateName: 'Priya Nair',
    email: 'priya.nair@example.com',
    consentStatus: 'Opted In',
    timestamp: '2026-10-08 14:22 PM',
    source: 'Account Settings Notification Center',
    region: 'India',
    complianceTag: 'DPDP Act 2023 Validated',
  },
  {
    id: 'cns-3',
    candidateName: 'Sophie Dubois',
    email: 'sophie.d@example.com',
    consentStatus: 'Unsubscribed',
    timestamp: '2026-10-11 18:05 PM',
    source: '1-Click Unsubscribe Header (RFC 8058)',
    region: 'European Union',
    complianceTag: 'GDPR Art. 7 Consent',
  },
  {
    id: 'cns-4',
    candidateName: 'Rohan Kapoor',
    email: 'rohan.kapoor@example.com',
    consentStatus: 'Opted In',
    timestamp: '2026-10-02 11:30 AM',
    source: 'Candidate Pro Upgrade Flow',
    region: 'India',
    complianceTag: 'DPDP Act 2023 Validated',
  },
  {
    id: 'cns-5',
    candidateName: 'Marcus Vance',
    email: 'marcus.v@example.com',
    consentStatus: 'Opted In',
    timestamp: '2026-09-24 16:45 PM',
    source: 'Public Job Alert Creation Modal',
    region: 'United States',
    complianceTag: 'CAN-SPAM Verified',
  },
];

export const initialAdminDeliveryLogs: AdminDeliveryLogItem[] = [
  {
    id: 'log-1',
    dispatchId: 'DSP-99214',
    recipient: 'meera.iyer@example.com',
    channel: 'Email',
    provider: 'SES',
    event: 'Payment failure dunning notifications',
    status: 'Bounced',
    timestamp: 'Today at 09:12 AM',
    errorReason: '550 5.1.1 Recipient mailbox temporarily full / rejected',
  },
  {
    id: 'log-2',
    dispatchId: 'DSP-99213',
    recipient: 'priya.nair@example.com',
    channel: 'Push',
    provider: 'FCM',
    event: 'Application status push alerts',
    status: 'Delivered',
    timestamp: '12 min ago',
  },
  {
    id: 'log-3',
    dispatchId: 'DSP-99212',
    recipient: '+91 98765 43210',
    channel: 'SMS',
    provider: 'Twilio',
    event: 'Interview confirmation SMS messages',
    status: 'Delivered',
    timestamp: '1 hr ago',
  },
  {
    id: 'log-4',
    dispatchId: 'DSP-99211',
    recipient: 'aarav.mehta@example.com',
    channel: 'Email',
    provider: 'SES',
    event: 'Password reset token emails',
    status: 'Delivered',
    timestamp: '15 min ago',
  },
  {
    id: 'log-5',
    dispatchId: 'DSP-99210',
    recipient: 'digest-subscribers@jobrisers.com (Batch)',
    channel: 'Email',
    provider: 'SES',
    event: 'Weekly job alert digest batch',
    status: 'Delivered',
    timestamp: '4 hr ago',
  },
  {
    id: 'log-6',
    dispatchId: 'DSP-99209',
    recipient: 'marketing-pool-q3@jobrisers.com',
    channel: 'Email',
    provider: 'SES',
    event: 'Marketing campaign: Resume upgrade promo',
    status: 'Delivered',
    timestamp: 'Yesterday at 04:30 PM',
  },
  {
    id: 'log-7',
    dispatchId: 'DSP-99208',
    recipient: 'fake.user.bounced@spamdomain.net',
    channel: 'Email',
    provider: 'SES',
    event: 'Job alert match',
    status: 'Bounced',
    timestamp: 'Yesterday at 02:15 PM',
    errorReason: '550 5.1.2 Host or domain name not found',
  },
  {
    id: 'log-8',
    dispatchId: 'DSP-99207',
    recipient: 'unhappy.user@example.com',
    channel: 'Email',
    provider: 'SES',
    event: 'Marketing promotion',
    status: 'Complained',
    timestamp: 'Oct 12 at 11:20 AM',
    errorReason: 'Spam complaint registered via ISP Feedback Loop',
  },
  {
    id: 'log-9',
    dispatchId: 'DSP-99206',
    recipient: 'suppressed.candidate@example.com',
    channel: 'Email',
    provider: 'SES',
    event: 'Application status changed',
    status: 'Suppressed',
    timestamp: 'Oct 11 at 10:00 AM',
    errorReason: 'Recipient is present on hard-bounce suppression list',
  },
];

export const initialAdminSuppressionRecords: AdminSuppressionRecord[] = [
  {
    id: 'sup-1',
    recipient: 'fake.user.bounced@spamdomain.net',
    reason: 'Hard Bounce',
    dateAdded: '2026-10-14',
    provider: 'SES',
  },
  {
    id: 'sup-2',
    recipient: 'unhappy.user@example.com',
    reason: 'Spam Complaint',
    dateAdded: '2026-10-12',
    provider: 'SES',
  },
  {
    id: 'sup-3',
    recipient: 'suppressed.candidate@example.com',
    reason: 'Hard Bounce',
    dateAdded: '2026-10-09',
    provider: 'SES',
  },
  {
    id: 'sup-4',
    recipient: 'old.unsub.contact@example.org',
    reason: 'User Unsubscribe',
    dateAdded: '2026-09-28',
    provider: 'SES',
  },
];

export const initialAdminPushMonitoring: AdminPushMonitoring = {
  fcmStatus: 'Operational (99.8% Uptime)',
  apnsStatus: 'Operational (99.9% Uptime)',
  activeTokensCount: 48250,
  deliveredCount: 47410,
  clickedCount: 18920,
  failedCount: 840,
  invalidatedTokensCount: 145,
  perConversationPushEnabled: true,
};


// ============================================================================
// TRUST & SAFETY MODULE DATA (PRD v2.0 Section 5.14, TNS-1 to TNS-10)
// ============================================================================

export interface AdminSafetyIncidentReport {
  id: string;
  caseId: string;
  entityType: 'Job Listing' | 'Employer' | 'Candidate' | 'Conversation';
  entityName: string;
  reason: string;
  description: string;
  reporter: string;
  reporterEmail: string;
  reporterNotified: boolean;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'High priority' | 'Investigating' | 'Suspended' | 'Resolved' | 'Under review';
  assignee: string;
  createdAt: string;
  slaRemainingMinutes: number; // positive = time left, negative = breached
  slaStatus: 'Within SLA' | 'At risk' | 'Breached';
  evidence: {
    type: string;
    details: string;
    externalUrl?: string;
    whoisInfo?: string;
    botVelocity?: string;
    transcriptMessages?: Array<{ sender: string; text: string; timestamp: string; isOffending?: boolean }>;
  };
  timeline: Array<{ event: string; actor: string; timestamp: string; note?: string }>;
  resolutionNote?: string;
  actionOutcome?: 'Dismissed' | 'Warning Issued' | 'Content Removed' | 'Account Suspended' | 'Thread Locked';
}

export interface AdminBlacklistRule {
  id: string;
  pattern: string;
  category: 'Email Domains' | 'VoIP Numbers' | 'IP/CIDR' | 'Scam Companies' | 'Keywords';
  matchType: 'Exact' | 'Wildcard' | 'Regex' | 'Fuzzy';
  enforcementScope: Array<'Candidate signup' | 'Employer signup' | 'Job posting' | 'Messaging' | 'All surfaces'>;
  reason: string;
  status: 'Active' | 'Inactive';
  hitCount: number;
  dateAdded: string;
  lastTriggered: string;
}

export interface AdminFlaggedMessageCasework {
  id: string;
  threadId: string;
  participants: string;
  triggerReason: string;
  toxicityScore: number;
  keywordHighlights: string[];
  flaggedSnippet: string;
  status: 'Under review' | 'Investigating' | 'High priority' | 'Resolved';
  updated: string;
  isUnmasked: boolean;
  unmaskedJustification?: string;
  unmaskedBy?: string;
  messages: Array<{
    id: string;
    sender: string;
    role: 'Employer' | 'Candidate' | 'System';
    timestamp: string;
    text: string;
    isOffender?: boolean;
  }>;
  auditLog: Array<{
    admin: string;
    timestamp: string;
    action: string;
    justification: string;
  }>;
}

export interface AdminBrandMisuseItem {
  id: string;
  brandName: string;
  officialDomain: string;
  submittedCompanyName: string;
  trademarkMatchConfidence: number;
  logoStatus: 'Protected Trademark' | 'Unauthorized Copy' | 'Pending Verification' | 'Stripped';
  reviewStatus: 'Verified License' | 'Pending Manual Review' | 'Impersonation Flagged';
  notes: string;
  lastEvaluated: string;
}

export interface AdminMeetingLinkScanRecord {
  id: string;
  url: string;
  domain: string;
  status: 'Allowed' | 'Blocked' | 'Suspicious';
  reason: string;
  riskLevel: 'Safe' | 'Medium' | 'High' | 'Critical';
  detectedIn: string;
  timestamp: string;
}

export interface AdminPiiSentinelLog {
  id: string;
  detectionType: 'Phone Number' | 'Bank Account / IFSC' | 'OTP Request' | 'Aadhaar / National ID';
  triggerPattern: string;
  threadId: string;
  source: string;
  timestamp: string;
  warningStatus: 'Proactive Banner Shown' | 'Redacted' | 'Auto-Blocked';
  hitCount: number;
  cmsMicrocopyKey: string;
}

export interface AdminFraudSignalItem {
  id: string;
  canonicalTitle: string;
  detectionSurface: 'Jobs' | 'Messages' | 'Interview Invites' | 'Candidate Signup' | 'Employer Signup' | 'Payments';
  riskScore: number;
  confidence: number;
  triggerPattern: string;
  targetEntity: string;
  details: string;
  timestamp: string;
  status: 'Investigating' | 'Blocked' | 'Rate limited' | 'Monitoring' | 'Resolved';
  automatedAction: string;
}

export interface AdminEmployerScreeningRecord {
  id: string;
  companyName: string;
  workEmail: string;
  website: string;
  emailDomain: string;
  websiteDomain: string;
  matchResult: 'Free-mail Prohibited' | 'Domain Mismatch Anomaly' | 'Duplicate Name Detected' | 'Verified Corporate Match';
  riskScore: number;
  reviewStatus: 'Approved' | 'Flagged' | 'Blocked';
  date: string;
}

export interface AdminRecruiterVelocityAlert {
  id: string;
  recruiterName: string;
  recruiterEmail: string;
  company: string;
  candidateViewsToday: number;
  dailyThreshold: number;
  hourlyVelocity: number;
  scrapingAnomalyScore: number;
  alertStatus: 'Active Alert' | 'Enforced' | 'Normal';
  lastActionTaken?: string;
  timestamp: string;
}

// ----------------------------------------------------------------------------
// INITIAL MOCK COLLECTIONS FOR TRUST & SAFETY
// ----------------------------------------------------------------------------

export const initialAdminSafetyIncidentReports: AdminSafetyIncidentReport[] = [
  {
    id: 'rep-1',
    caseId: 'JR-J5830',
    entityType: 'Job Listing',
    entityName: 'Cloudframe: Senior Product Designer (#job-8812)',
    reason: 'Suspicious external contact link in listing',
    description: 'Job listing description contains hidden link redirecting to unverified external Telegram recruitment portal soliciting registration payments.',
    reporter: '2 Candidates (Aarav Mehta & Priya Nair)',
    reporterEmail: 'aarav.mehta@designflow.io',
    reporterNotified: true,
    severity: 'High',
    status: 'High priority',
    assignee: 'Maya',
    createdAt: '12 min ago',
    slaRemainingMinutes: 48,
    slaStatus: 'At risk',
    evidence: {
      type: 'External URL Redirection',
      details: 'Shortened link bit.ly/tele-job-chat found hidden inside markdown job requirements bullet point 4.',
      externalUrl: 'https://bit.ly/tele-job-chat',
      whoisInfo: 'Redirect target: t.me/quick_hire_india (Unregistered channel)',
    },
    timeline: [
      { event: 'Report filed by Candidate Aarav Mehta', actor: 'Candidate', timestamp: '12 min ago', note: 'Flagged suspicious off-platform communication request' },
      { event: 'Secondary report filed by Priya Nair', actor: 'Candidate', timestamp: '10 min ago', note: 'Confirmed external telegram link' },
      { event: 'Automated triage: Escalated to High Priority', actor: 'System Triage Sentinel', timestamp: '9 min ago' },
      { event: 'Assigned to Maya (Senior T&S Caseworker)', actor: 'Maya', timestamp: '8 min ago' },
    ],
  },
  {
    id: 'rep-2',
    caseId: 'JR-E2094',
    entityType: 'Employer',
    entityName: 'Tata Consultancy Services (Impersonator: info-tcs-careers.net)',
    reason: 'Fake employer domain impersonating MNC',
    description: 'Fraudulent employer account registered with domain info-tcs-careers.net claiming to be Tata Consultancy Services. Attempting to harvest applicant PAN and banking documents.',
    reporter: 'Trust Bot Sentinel (DNS & WHOIS Anomaly)',
    reporterEmail: 'bot-sentinel@jobrisers.internal',
    reporterNotified: false,
    severity: 'Critical',
    status: 'Investigating',
    assignee: 'Rahul',
    createdAt: '45 min ago',
    slaRemainingMinutes: -15,
    slaStatus: 'Breached',
    evidence: {
      type: 'Domain Impersonation & Trademark Misuse',
      details: 'Domain registered 3 days ago via NameCheap privacy proxy. Company CIN matches real TCS but work email MX records point to disposable Russian host.',
      externalUrl: 'https://info-tcs-careers.net',
      whoisInfo: 'Registrar: PrivacyGuardian, Creation Date: 2026-10-12, Registrant Org: Withheld for Privacy',
    },
    timeline: [
      { event: 'Automated bot trigger: WHOIS registration age < 7 days', actor: 'Trust Bot', timestamp: '45 min ago' },
      { event: 'Trademark collision with protected brand "TCS"', actor: 'System Abuse Sentinel', timestamp: '44 min ago' },
      { event: 'Assigned to Rahul (Fraud Specialist)', actor: 'Rahul', timestamp: '40 min ago' },
      { event: 'Outreach email verification bounced', actor: 'System Mailer', timestamp: '30 min ago' },
    ],
  },
  {
    id: 'rep-3',
    caseId: 'JR-C1094',
    entityType: 'Candidate',
    entityName: 'Rohit K. (Candidate ID: can-1094)',
    reason: 'Candidate mass-apply bot script abuse',
    description: 'Automated Headless Chrome script detected dispatching 400 applications in 180 seconds using identical resume payload across multiple unrelated industry sectors.',
    reporter: 'System Abuse Sentinel (Velocity Engine)',
    reporterEmail: 'sentinel@jobrisers.internal',
    reporterNotified: true,
    severity: 'High',
    status: 'Suspended',
    assignee: 'System Sentinel',
    createdAt: '2 hr ago',
    slaRemainingMinutes: 180,
    slaStatus: 'Within SLA',
    evidence: {
      type: 'Application Velocity Anomaly',
      details: '400 applications dispatched in 3 minutes. Request headers reveal HeadlessChrome/124.0.0.0 and canvas fingerprint collision with known scraping proxy.',
      botVelocity: 'Velocity: 2.22 applications/sec (Human maximum threshold: 0.15/sec)',
    },
    timeline: [
      { event: 'Velocity threshold breached (>50 apps / min)', actor: 'System Abuse Sentinel', timestamp: '2 hr ago' },
      { event: 'Temporary IP rate limit applied for 60 minutes', actor: 'System Auto', timestamp: '2 hr ago' },
      { event: 'Account suspended and 400 active applications quarantined', actor: 'System Sentinel', timestamp: '1 hr 55 min ago', note: 'Automated compliance suspension' },
    ],
  },
  {
    id: 'rep-4',
    caseId: 'JR-M8812',
    entityType: 'Conversation',
    entityName: 'Vertex Works ↔ Meera Iyer (Thread #84920)',
    reason: 'Abusive recruiter asking for upfront training fee',
    description: 'Recruiter demanded Rs. 4,500 "Mandatory Onboarding & Hardware Insurance Fee" before scheduling technical interview. Candidate refused and filed report with screenshot.',
    reporter: 'Meera Iyer (Candidate)',
    reporterEmail: 'meera.iyer@example.com',
    reporterNotified: true,
    severity: 'Critical',
    status: 'High priority',
    assignee: 'Maya',
    createdAt: 'Yesterday',
    slaRemainingMinutes: -90,
    slaStatus: 'Breached',
    evidence: {
      type: 'Direct Chat Transcript Snapshot (TNS-4)',
      details: 'Chronological snapshot captured at 2026-10-14 14:22 IST. Prohibited payment keywords detected: "deposit", "Rs 4500", "GPay UPI".',
      transcriptMessages: [
        { sender: 'Meera Iyer', text: 'Hello, thank you for shortlisting my profile for the Frontend Engineer position.', timestamp: 'Yesterday 14:10' },
        { sender: 'Vertex Works (Recruiter)', text: 'Hi Meera. Before we can release the interview link, you need to pay a refundable security deposit of Rs. 4,500 for the take-home test equipment.', timestamp: 'Yesterday 14:15', isOffending: true },
        { sender: 'Meera Iyer', text: 'JobRisers policy states that no employer can charge any fees. I will not pay this.', timestamp: 'Yesterday 14:18' },
        { sender: 'Vertex Works (Recruiter)', text: 'If you do not transfer to our UPI ID vertex-onboarding@oksbi immediately, your application will be cancelled.', timestamp: 'Yesterday 14:20', isOffending: true },
        { sender: 'Meera Iyer', text: 'I am reporting this conversation to Trust & Safety.', timestamp: 'Yesterday 14:22' },
      ],
    },
    timeline: [
      { event: 'Report filed by Meera Iyer with conversation screenshot', actor: 'Meera Iyer', timestamp: 'Yesterday 14:25' },
      { event: 'TNS-3 Caseworker Maya unmasked chat transcript pursuant to safety investigation', actor: 'Maya', timestamp: 'Yesterday 15:00' },
      { event: 'Automated notice sent to reporter acknowledging active investigation', actor: 'System Mailer', timestamp: 'Yesterday 15:02' },
      { event: 'Thread marked for employer suspension review', actor: 'Maya', timestamp: 'Yesterday 15:30' },
    ],
  },
  {
    id: 'rep-5',
    caseId: 'JR-J5835',
    entityType: 'Job Listing',
    entityName: 'Global Remote Services: Data Entry Clerk (#job-2994)',
    reason: 'Job listing demanding security deposit',
    description: 'Listing required candidates to purchase software license key from third party before commencing work. Employer account suspended and listing permanently removed.',
    reporter: 'Community Flag (Multiple Job Seekers)',
    reporterEmail: 'community-reports@jobrisers.com',
    reporterNotified: true,
    severity: 'High',
    status: 'Resolved',
    assignee: 'Rahul',
    createdAt: 'Oct 9',
    slaRemainingMinutes: 0,
    slaStatus: 'Within SLA',
    evidence: {
      type: 'Prohibited Fee Solicitation in Job Description',
      details: 'Section 3 of job description explicitly mandated $75 software package purchase.',
    },
    timeline: [
      { event: 'Listing flagged by 4 job seekers', actor: 'Community', timestamp: 'Oct 9 10:15' },
      { event: 'Assigned to Rahul', actor: 'Rahul', timestamp: 'Oct 9 10:30' },
      { event: 'Listing removed from public marketplace', actor: 'Rahul', timestamp: 'Oct 9 11:00' },
      { event: 'Employer account suspended permanently', actor: 'Rahul', timestamp: 'Oct 9 11:15', note: 'Zero-tolerance violation of PRD Section 5.14 scam rules' },
    ],
    resolutionNote: 'Employer permanently banned. All applicants notified of fraudulent listing.',
    actionOutcome: 'Account Suspended',
  },
];

export const initialAdminBlacklistRules: AdminBlacklistRule[] = [
  {
    id: 'blk-1',
    pattern: '@mailinator.com',
    category: 'Email Domains',
    matchType: 'Wildcard',
    enforcementScope: ['Candidate signup', 'Employer signup'],
    reason: 'Disposable temporary email service known for spam and bot registration abuse',
    status: 'Active',
    hitCount: 1842,
    dateAdded: '2026-10-02',
    lastTriggered: '14 min ago',
  },
  {
    id: 'blk-2',
    pattern: '@tempmail.ninja',
    category: 'Email Domains',
    matchType: 'Wildcard',
    enforcementScope: ['Candidate signup', 'Employer signup'],
    reason: 'Disposable burner domain used by automated application scripts',
    status: 'Active',
    hitCount: 620,
    dateAdded: '2026-09-18',
    lastTriggered: '2 hr ago',
  },
  {
    id: 'blk-3',
    pattern: 'info-tcs-careers.net',
    category: 'Scam Companies',
    matchType: 'Exact',
    enforcementScope: ['Employer signup', 'Job posting'],
    reason: 'Known impersonation domain mimicking Tata Consultancy Services',
    status: 'Active',
    hitCount: 14,
    dateAdded: '2026-09-24',
    lastTriggered: '45 min ago',
  },
  {
    id: 'blk-4',
    pattern: 'Apex Tech Global Solutions Pvt Ltd',
    category: 'Scam Companies',
    matchType: 'Fuzzy',
    enforcementScope: ['Employer signup', 'Job posting'],
    reason: 'Unregistered entity with duplicate corporate identity claims',
    status: 'Active',
    hitCount: 38,
    dateAdded: '2026-08-30',
    lastTriggered: 'Yesterday',
  },
  {
    id: 'blk-5',
    pattern: '+1 (201) 555-XXXX [Twilio/Bandwidth]',
    category: 'VoIP Numbers',
    matchType: 'Regex',
    enforcementScope: ['Candidate signup', 'Employer signup', 'Messaging'],
    reason: 'Non-fixed virtual VoIP phone number range used for mass OTP harvesting',
    status: 'Active',
    hitCount: 412,
    dateAdded: '2026-10-04',
    lastTriggered: '3 hr ago',
  },
  {
    id: 'blk-6',
    pattern: '185.220.101.0/24',
    category: 'IP/CIDR',
    matchType: 'Exact',
    enforcementScope: ['All surfaces'],
    reason: 'Known malicious Tor exit node / proxy network associated with credential stuffing',
    status: 'Active',
    hitCount: 890,
    dateAdded: '2026-10-15',
    lastTriggered: '7 min ago',
  },
  {
    id: 'blk-7',
    pattern: '"security deposit"',
    category: 'Keywords',
    matchType: 'Exact',
    enforcementScope: ['Job posting', 'Messaging'],
    reason: 'Mandatory prohibited fee-demand phrase (PRD TNS-5)',
    status: 'Active',
    hitCount: 156,
    dateAdded: '2026-07-15',
    lastTriggered: 'Yesterday',
  },
  {
    id: 'blk-8',
    pattern: '"registration fee"',
    category: 'Keywords',
    matchType: 'Exact',
    enforcementScope: ['Job posting', 'Messaging'],
    reason: 'Prohibited advance payment solicitation',
    status: 'Active',
    hitCount: 204,
    dateAdded: '2026-07-15',
    lastTriggered: 'Oct 9',
  },
];

export const initialAdminFlaggedMessageCasework: AdminFlaggedMessageCasework[] = [
  {
    id: 'flg-1',
    threadId: 'Thread #84920',
    participants: 'Vertex Works (Recruiter) ↔ Meera Iyer (Candidate)',
    triggerReason: 'Request for payment in chat',
    toxicityScore: 0.94,
    keywordHighlights: ['deposit', 'Rs 4500', 'refundable security deposit', 'vertex-onboarding@oksbi'],
    flaggedSnippet: 'Before we can release the interview link, you need to pay a refundable security deposit of Rs. 4,500...',
    status: 'Under review',
    updated: '34 min ago',
    isUnmasked: true,
    unmaskedJustification: 'Investigating fee-solicitation complaint JR-M8812 filed by candidate.',
    unmaskedBy: 'Maya (T&S Moderator)',
    messages: [
      { id: 'm-1', sender: 'Meera Iyer', role: 'Candidate', timestamp: 'Yesterday 14:10', text: 'Hello, thank you for shortlisting my profile for the Frontend Engineer position.' },
      { id: 'm-2', sender: 'Vertex Works (Recruiter)', role: 'Employer', timestamp: 'Yesterday 14:15', text: 'Hi Meera. Before we can release the interview link, you need to pay a refundable security deposit of Rs. 4,500 for the take-home test equipment.', isOffender: true },
      { id: 'm-3', sender: 'Meera Iyer', role: 'Candidate', timestamp: 'Yesterday 14:18', text: 'JobRisers policy states that no employer can charge any fees. I will not pay this.' },
      { id: 'm-4', sender: 'Vertex Works (Recruiter)', role: 'Employer', timestamp: 'Yesterday 14:20', text: 'If you do not transfer to our UPI ID vertex-onboarding@oksbi immediately, your application will be cancelled.', isOffender: true },
      { id: 'm-5', sender: 'Meera Iyer', role: 'Candidate', timestamp: 'Yesterday 14:22', text: 'I am reporting this conversation to Trust & Safety.' },
    ],
    auditLog: [
      { admin: 'Maya', timestamp: '2026-10-14 15:00', action: 'Unmasked Full Transcript', justification: 'Active fee-fraud investigation JR-M8812' },
    ],
  },
  {
    id: 'flg-2',
    threadId: 'Thread #84928',
    participants: 'Apex Staffing ↔ Rohan Kapoor (Candidate)',
    triggerReason: 'External WhatsApp redirect attempt',
    toxicityScore: 0.78,
    keywordHighlights: ['WhatsApp', 'call me on 9876543210', 'off-platform'],
    flaggedSnippet: 'Our company conducts all final round questions on WhatsApp. Add me at +91 98765 43210 right now.',
    status: 'Investigating',
    updated: '2 hr ago',
    isUnmasked: false,
    messages: [
      { id: 'm-21', sender: 'Rohan Kapoor', role: 'Candidate', timestamp: 'Today 11:30', text: 'Hi, I received your email regarding the Python Developer role.' },
      { id: 'm-22', sender: 'Apex Staffing', role: 'Employer', timestamp: 'Today 11:34', text: 'Our company conducts all final round questions on WhatsApp. Add me at +91 98765 43210 right now.', isOffender: true },
    ],
    auditLog: [],
  },
  {
    id: 'flg-3',
    threadId: 'Thread #84935',
    participants: 'CloudScale Hiring ↔ Ananya Sharma (Candidate)',
    triggerReason: 'Telegram link shared in message',
    toxicityScore: 0.88,
    keywordHighlights: ['bit.ly/tele-job-chat', 'Telegram', 'direct HR channel'],
    flaggedSnippet: 'Please join our private telegram room bit.ly/tele-job-chat to get the test question files.',
    status: 'Under review',
    updated: 'Today',
    isUnmasked: false,
    messages: [
      { id: 'm-31', sender: 'CloudScale Hiring', role: 'Employer', timestamp: 'Today 09:12', text: 'Please join our private telegram room bit.ly/tele-job-chat to get the test question files.', isOffender: true },
    ],
    auditLog: [],
  },
  {
    id: 'flg-4',
    threadId: 'Thread #84941',
    participants: 'Delta Tech Recruiter ↔ Vikram Sen (Candidate)',
    triggerReason: 'Obscene / Harassing language trigger',
    toxicityScore: 0.94,
    keywordHighlights: ['abusive language', 'unprofessional conduct', 'threat of blacklisting'],
    flaggedSnippet: 'Automated sentiment classifier score 0.94 toxicity: Recruiter used threatening and abusive expletives after candidate declined reschedule.',
    status: 'High priority',
    updated: 'Yesterday',
    isUnmasked: false,
    messages: [
      { id: 'm-41', sender: 'Delta Tech Recruiter', role: 'Employer', timestamp: 'Yesterday 17:02', text: 'You wasted our time and we will make sure you never get a job anywhere in Bangalore!', isOffender: true },
    ],
    auditLog: [],
  },
  {
    id: 'flg-5',
    threadId: 'Thread #84912',
    participants: 'Northstar Labs ↔ Aarav Mehta (Candidate)',
    triggerReason: 'Verified candidate dispute inquiry',
    toxicityScore: 0.42,
    keywordHighlights: ['interview reschedule', 'cancellation dispute'],
    flaggedSnippet: 'Candidate inquired why interview was cancelled 10 minutes prior to call. Reviewed and dismissed as legitimate calendar conflict.',
    status: 'Resolved',
    updated: 'Oct 10',
    isUnmasked: true,
    unmaskedJustification: 'Dispute triage completed and dismissed.',
    unmaskedBy: 'Rahul (T&S Moderator)',
    messages: [
      { id: 'm-51', sender: 'Aarav Mehta', role: 'Candidate', timestamp: 'Oct 10 11:00', text: 'Hello, the Google Meet link showed host was absent.' },
      { id: 'm-52', sender: 'Northstar Labs', role: 'Employer', timestamp: 'Oct 10 11:05', text: 'Apologies Aarav, our lead interviewer had an urgent medical emergency. We are rescheduling for tomorrow.' },
    ],
    auditLog: [
      { admin: 'Rahul', timestamp: '2026-10-10 12:15', action: 'Unmasked Full Transcript', justification: 'Candidate dispute resolution' },
    ],
  },
];

export const initialAdminBrandMisuseItems: AdminBrandMisuseItem[] = [
  {
    id: 'bnd-1',
    brandName: 'Google',
    officialDomain: 'google.com',
    submittedCompanyName: 'Google Cloud Solutions India Private Ltd',
    trademarkMatchConfidence: 96,
    logoStatus: 'Unauthorized Copy',
    reviewStatus: 'Impersonation Flagged',
    notes: 'Entity claiming direct subsidiary status of Google LLC with unauthorized use of Google "G" logo. Work email is on generic domain.',
    lastEvaluated: '1 hr ago',
  },
  {
    id: 'bnd-2',
    brandName: 'Tata Consultancy Services (TCS)',
    officialDomain: 'tcs.com',
    submittedCompanyName: 'info-tcs-careers.net',
    trademarkMatchConfidence: 98,
    logoStatus: 'Unauthorized Copy',
    reviewStatus: 'Impersonation Flagged',
    notes: 'Phishing domain mimicking official TCS recruitment brand. CIN stolen from public filings.',
    lastEvaluated: '45 min ago',
  },
  {
    id: 'bnd-3',
    brandName: 'Microsoft',
    officialDomain: 'microsoft.com',
    submittedCompanyName: 'Micro-Soft Tech Staffing Solutions',
    trademarkMatchConfidence: 89,
    logoStatus: 'Pending Verification',
    reviewStatus: 'Pending Manual Review',
    notes: 'Staffing agency using Microsoft four-color quad logo in job banner without partner certification ID.',
    lastEvaluated: 'Yesterday',
  },
  {
    id: 'bnd-4',
    brandName: 'Amazon',
    officialDomain: 'amazon.com',
    submittedCompanyName: 'Cloudframe Systems (AWS Enterprise Partner)',
    trademarkMatchConfidence: 62,
    logoStatus: 'Protected Trademark',
    reviewStatus: 'Verified License',
    notes: 'Legitimate AWS Partner Network credential verified via APN partner ID APN-849201.',
    lastEvaluated: 'Oct 12',
  },
  {
    id: 'bnd-5',
    brandName: 'Infosys',
    officialDomain: 'infosys.com',
    submittedCompanyName: 'Infosys Careers Talent Hub LLP',
    trademarkMatchConfidence: 94,
    logoStatus: 'Stripped',
    reviewStatus: 'Impersonation Flagged',
    notes: 'Logo removed from public listing after employer failed trademark authorization audit.',
    lastEvaluated: 'Oct 8',
  },
];

export const initialAdminMeetingLinkScanRecords: AdminMeetingLinkScanRecord[] = [
  {
    id: 'mls-1',
    url: 'https://meet.google.com/xyz-abcd-efg',
    domain: 'meet.google.com',
    status: 'Allowed',
    reason: 'Verified trusted video meeting provider (Google Meet)',
    riskLevel: 'Safe',
    detectedIn: 'Interview Invite #INT-4091',
    timestamp: '15 min ago',
  },
  {
    id: 'mls-2',
    url: 'https://zoom.us/j/98765432100?pwd=xyz',
    domain: 'zoom.us',
    status: 'Allowed',
    reason: 'Verified trusted video meeting provider (Zoom Video)',
    riskLevel: 'Safe',
    detectedIn: 'Interview Invite #INT-4088',
    timestamp: '42 min ago',
  },
  {
    id: 'mls-3',
    url: 'https://bit.ly/tele-job-chat',
    domain: 'bit.ly',
    status: 'Blocked',
    reason: 'Prohibited URL shortener masking external messaging redirect (PRD TNS-7)',
    riskLevel: 'High',
    detectedIn: 'Message Thread #84935',
    timestamp: '1 hr ago',
  },
  {
    id: 'mls-4',
    url: 'https://wa.me/919876543210',
    domain: 'wa.me',
    status: 'Blocked',
    reason: 'Direct off-platform WhatsApp chat bypass link',
    riskLevel: 'Critical',
    detectedIn: 'Message Thread #84928',
    timestamp: '2 hr ago',
  },
  {
    id: 'mls-5',
    url: 'https://t.me/quick_recruitment_bot',
    domain: 't.me',
    status: 'Blocked',
    reason: 'Unverified external Telegram bot link soliciting payments',
    riskLevel: 'Critical',
    detectedIn: 'Job Post #JOB-2994',
    timestamp: 'Yesterday',
  },
];

export const initialAdminPiiSentinelLogs: AdminPiiSentinelLog[] = [
  {
    id: 'pii-1',
    detectionType: 'Phone Number',
    triggerPattern: '+91 98765 43210',
    threadId: 'Thread #84928',
    source: 'Apex Staffing (Recruiter)',
    timestamp: '2 hr ago',
    warningStatus: 'Proactive Banner Shown',
    hitCount: 42,
    cmsMicrocopyKey: 'chat_safety_banner',
  },
  {
    id: 'pii-2',
    detectionType: 'Bank Account / IFSC',
    triggerPattern: 'UPI: vertex-onboarding@oksbi / Rs. 4,500',
    threadId: 'Thread #84920',
    source: 'Vertex Works (Recruiter)',
    timestamp: 'Yesterday',
    warningStatus: 'Auto-Blocked',
    hitCount: 18,
    cmsMicrocopyKey: 'chat_safety_banner',
  },
  {
    id: 'pii-3',
    detectionType: 'OTP Request',
    triggerPattern: '"Send me the 6-digit SMS code you received"',
    threadId: 'Thread #84892',
    source: 'Suspicious Recruiter Account',
    timestamp: 'Oct 11',
    warningStatus: 'Auto-Blocked',
    hitCount: 9,
    cmsMicrocopyKey: 'chat_safety_banner',
  },
];

export const initialAdminFraudSignalItems: AdminFraudSignalItem[] = [
  {
    id: 'sig-1',
    canonicalTitle: 'Bulk sign-ups from one IP range',
    detectionSurface: 'Candidate Signup',
    riskScore: 92,
    confidence: 98,
    triggerPattern: '17 candidate profiles created in 8 minutes with identical canvas fingerprints',
    targetEntity: 'IP 185.220.101.42 (Proxy Network)',
    details: 'Automated script bypassed standard captcha with pre-generated Gmail variations. Identical browser viewport 1920x1080 and hardware concurrency.',
    timestamp: '7 min ago',
    status: 'Investigating',
    automatedAction: 'IP CIDR 185.220.101.0/24 rate-limited at Cloudflare edge',
  },
  {
    id: 'sig-2',
    canonicalTitle: 'Duplicate corporate CIN registration attempt',
    detectionSurface: 'Employer Signup',
    riskScore: 88,
    confidence: 95,
    triggerPattern: 'Vertex Works subsidiary attempted re-registration under new name',
    targetEntity: 'CIN U72200KA2021PTC148920',
    details: 'Previously suspended corporate entity attempted creating new profile as "Vertex NextGen Solutions" using identical MCA registration certificate.',
    timestamp: '3 hr ago',
    status: 'Blocked',
    automatedAction: 'Corporate CIN added to permanent enforcement blacklist',
  },
  {
    id: 'sig-3',
    canonicalTitle: 'Rapid-fire job posting spike',
    detectionSurface: 'Jobs',
    riskScore: 78,
    confidence: 89,
    triggerPattern: 'Unverified employer attempted publishing 12 listings simultaneously',
    targetEntity: 'Employer: Apex Tech Global (#emp-4091)',
    details: 'Employer created account 20 minutes prior and automated API published 12 duplicate "Remote Entry Level" listings across multiple metro locations.',
    timestamp: 'Yesterday',
    status: 'Rate limited',
    automatedAction: 'Posting queue paused; manual identity review required before publication',
  },
  {
    id: 'sig-4',
    canonicalTitle: 'Payment method mismatch signal',
    detectionSurface: 'Payments',
    riskScore: 65,
    confidence: 82,
    triggerPattern: 'Credit card country (US) differs from employer billing country (IN)',
    targetEntity: 'Employer: Cloudframe Systems (#emp-2081)',
    details: 'Corporate registration is in Karnataka, India, but recurring Pro job slot package was paid using US Chase Visa with foreign billing address.',
    timestamp: 'Oct 11',
    status: 'Monitoring',
    automatedAction: 'Flagged for payment verification; subscription active in grace period',
  },
  {
    id: 'sig-5',
    canonicalTitle: 'Scam fee demand pattern detected in job post',
    detectionSurface: 'Jobs',
    riskScore: 95,
    confidence: 99,
    triggerPattern: 'Prohibited keyword combination: "security deposit" + "bank transfer"',
    targetEntity: 'Job Listing: Data Operations Clerk (#job-2994)',
    details: 'Automated NLP scanner flagged mandatory advance fee payment requirement in job description markdown.',
    timestamp: 'Oct 9',
    status: 'Resolved',
    automatedAction: 'Listing quarantined immediately and recruiter account frozen',
  },
];

export const initialAdminEmployerScreeningRecords: AdminEmployerScreeningRecord[] = [
  {
    id: 'scr-1',
    companyName: 'Tata Consultancy Services (Claimed)',
    workEmail: 'recruiter@info-tcs-careers.net',
    website: 'https://tcs.com',
    emailDomain: 'info-tcs-careers.net',
    websiteDomain: 'tcs.com',
    matchResult: 'Domain Mismatch Anomaly',
    riskScore: 98,
    reviewStatus: 'Blocked',
    date: '45 min ago',
  },
  {
    id: 'scr-2',
    companyName: 'Apex Staffing Solutions',
    workEmail: 'apexjobs2026@gmail.com',
    website: 'https://apexstaffing.in',
    emailDomain: 'gmail.com',
    websiteDomain: 'apexstaffing.in',
    matchResult: 'Free-mail Prohibited',
    riskScore: 84,
    reviewStatus: 'Flagged',
    date: '2 hr ago',
  },
  {
    id: 'scr-3',
    companyName: 'Northstar Labs Private Limited',
    workEmail: 'hiring@northstarlabs.io',
    website: 'https://northstarlabs.io',
    emailDomain: 'northstarlabs.io',
    websiteDomain: 'northstarlabs.io',
    matchResult: 'Verified Corporate Match',
    riskScore: 4,
    reviewStatus: 'Approved',
    date: 'Yesterday',
  },
  {
    id: 'scr-4',
    companyName: 'Vertex NextGen Solutions',
    workEmail: 'careers@vertexnextgen.co',
    website: 'https://vertexworks.com',
    emailDomain: 'vertexnextgen.co',
    websiteDomain: 'vertexworks.com',
    matchResult: 'Duplicate Name Detected',
    riskScore: 92,
    reviewStatus: 'Blocked',
    date: '3 hr ago',
  },
];

export const initialAdminRecruiterVelocityAlerts: AdminRecruiterVelocityAlert[] = [
  {
    id: 'rcv-1',
    recruiterName: 'Vikram Sethi',
    recruiterEmail: 'vikram.sethi@apexstaffing.in',
    company: 'Apex Staffing',
    candidateViewsToday: 184,
    dailyThreshold: 150,
    hourlyVelocity: 48,
    scrapingAnomalyScore: 0.91,
    alertStatus: 'Active Alert',
    timestamp: '22 min ago',
  },
  {
    id: 'rcv-2',
    recruiterName: 'Kunal Deshmukh',
    recruiterEmail: 'kunal@cloudframe.io',
    company: 'Cloudframe Systems',
    candidateViewsToday: 82,
    dailyThreshold: 150,
    hourlyVelocity: 14,
    scrapingAnomalyScore: 0.12,
    alertStatus: 'Normal',
    timestamp: '1 hr ago',
  },
  {
    id: 'rcv-3',
    recruiterName: 'Suspicious Recruiter Account #4092',
    recruiterEmail: 'bot-harvest@recruitnow.biz',
    company: 'RecruitNow Biz',
    candidateViewsToday: 240,
    dailyThreshold: 150,
    hourlyVelocity: 95,
    scrapingAnomalyScore: 0.98,
    alertStatus: 'Enforced',
    lastActionTaken: 'Directory Access Frozen for 48 Hours',
    timestamp: 'Yesterday',
  },
];


// ============================================================================
// SUPPORT MODULE DATA (PRD v2.0 Section 5.14 / 5.15, SUP-1 to SUP-4)
// ============================================================================

export interface AdminCannedResponseItem {
  id: string;
  title: string;
  shortcut: string;
  category: 'Billing & Subscriptions' | 'Verification' | 'Technical & Export' | 'Integrations & Interviews' | 'Privacy & Legal';
  responseBody: string;
  usageCount: number;
  lastUsed: string;
  status: 'Active' | 'Inactive';
}

export interface AdminHelpCenterLinkItem {
  id: string;
  label: string;
  destinationUrl: string;
  destinationType: 'Contextual Link' | 'Knowledge Base Article';
  surface: 'Interview Room Help Card' | 'Messaging Safety Card' | 'Candidate Privacy Settings' | 'Employer Billing Help' | 'Platform Help Center';
  active: boolean;
  clicks: number;
  redirects: number;
  deflectedTickets: number;
  deflectionRate: number;
}

export interface AdminExternalHelpdeskConfig {
  mode: 'In-House JobRisers Helpdesk' | 'External Helpdesk Sync';
  provider: 'Zendesk Support' | 'Freshdesk';
  subdomain: string;
  connectionStatus: 'Not Connected' | 'Connected' | 'Token Verified';
  twoWaySyncEnabled: boolean;
  lastSyncTimestamp: string;
  syncedTicketsCount: number;
}

export interface AdminSupportQueueStats {
  openQueue: number;
  slaCompliance: number;
  avgFirstResponseMinutes: number;
  resolutionRatePercent: number;
}

// ----------------------------------------------------------------------------
// INITIAL MOCK COLLECTIONS FOR SUPPORT
// ----------------------------------------------------------------------------

export const initialAdminCannedResponses: AdminCannedResponseItem[] = [
  {
    id: 'can-1',
    title: 'Refund Policy Explanation',
    shortcut: '/refund',
    category: 'Billing & Subscriptions',
    responseBody: 'Hello {{user_name}},\n\nThank you for reaching out regarding our refund policy. JobRisers Pro offers a 7-day money-back guarantee for initial subscriptions if fewer than 3 template exports have been generated. We have evaluated your account (Ticket ID: {{ticket_id}}) and initiated your request.',
    usageCount: 45,
    lastUsed: 'Aug 12',
    status: 'Active',
  },
  {
    id: 'can-2',
    title: 'Verification Complete Notice',
    shortcut: '/verify',
    category: 'Verification',
    responseBody: 'Hello {{user_name}},\n\nGreat news! Your corporate employer verification documents have been reviewed and approved by our Trust & Verification team. Your company profile now displays the Verified Employer trust badge and job posting slot limits have been unlocked.',
    usageCount: 82,
    lastUsed: 'Sep 10',
    status: 'Active',
  },
  {
    id: 'can-3',
    title: 'PDF Export Troubleshooting',
    shortcut: '/pdf',
    category: 'Technical & Export',
    responseBody: 'Hello {{user_name}},\n\nIf your exported resume PDF has broken pagination or missing sections, please ensure your browser print dialog has "Margins" set to "Default" and "Background graphics" checked. We have also refreshed your server-side PDF render cache for template {{template_id}}.',
    usageCount: 29,
    lastUsed: 'Oct 4',
    status: 'Active',
  },
  {
    id: 'can-4',
    title: 'OAuth Integration Reconnect Guide',
    shortcut: '/oauth',
    category: 'Integrations & Interviews',
    responseBody: 'Hello {{user_name}},\n\nTo resolve interview video room synchronization failures with Google Meet or Microsoft Teams, please navigate to Settings > Integrations, click "Disconnect Account", and complete the OAuth re-authorization flow to refresh your expired room tokens.',
    usageCount: 18,
    lastUsed: 'Oct 8',
    status: 'Active',
  },
  {
    id: 'can-5',
    title: 'Data Subject Erasure Confirmation',
    shortcut: '/dpdp',
    category: 'Privacy & Legal',
    responseBody: 'Hello {{user_name}},\n\nIn accordance with Section 12 of the Digital Personal Data Protection (DPDP) Act 2023, your statutory data erasure request has been processed. All personally identifiable information (PII), resume uploads, and contact records have been permanently redacted under reference {{ticket_id}}.',
    usageCount: 12,
    lastUsed: 'Oct 11',
    status: 'Active',
  },
];

export const initialAdminHelpCenterLinks: AdminHelpCenterLinkItem[] = [
  {
    id: 'hcl-1',
    label: 'Interview Room Video Sync Guide',
    destinationUrl: '/help/interviews-video-sync',
    destinationType: 'Contextual Link',
    surface: 'Interview Room Help Card',
    active: true,
    clicks: 1420,
    redirects: 1180,
    deflectedTickets: 980,
    deflectionRate: 82.5,
  },
  {
    id: 'hcl-2',
    label: 'Direct Messaging & Scam Prevention Policy',
    destinationUrl: '/help/messaging-safety-rules',
    destinationType: 'Contextual Link',
    surface: 'Messaging Safety Card',
    active: true,
    clicks: 2100,
    redirects: 1650,
    deflectedTickets: 1290,
    deflectionRate: 78.4,
  },
  {
    id: 'hcl-3',
    label: 'Candidate DPDP Data Rights & Privacy FAQ',
    destinationUrl: '/help/privacy-dpdp-rights',
    destinationType: 'Contextual Link',
    surface: 'Candidate Privacy Settings',
    active: true,
    clicks: 890,
    redirects: 580,
    deflectedTickets: 375,
    deflectionRate: 65.0,
  },
  {
    id: 'hcl-4',
    label: 'Employer Tax Invoicing & GST Reconciliation',
    destinationUrl: '/help/billing-invoices-gst',
    destinationType: 'Contextual Link',
    surface: 'Employer Billing Help',
    active: true,
    clicks: 1340,
    redirects: 960,
    deflectedTickets: 690,
    deflectionRate: 71.8,
  },
  {
    id: 'hcl-5',
    label: 'Candidate Getting Started & Profile Guide',
    destinationUrl: '/resources/candidate-handbook',
    destinationType: 'Knowledge Base Article',
    surface: 'Platform Help Center',
    active: true,
    clicks: 3450,
    redirects: 3040,
    deflectedTickets: 2680,
    deflectionRate: 88.0,
  },
  {
    id: 'hcl-6',
    label: 'Employer Verification & MCA CIN Standards',
    destinationUrl: '/resources/employer-onboarding',
    destinationType: 'Knowledge Base Article',
    surface: 'Platform Help Center',
    active: true,
    clicks: 1890,
    redirects: 1590,
    deflectedTickets: 1340,
    deflectionRate: 84.1,
  },
];

export const initialAdminExternalHelpdeskConfig: AdminExternalHelpdeskConfig = {
  mode: 'In-House JobRisers Helpdesk',
  provider: 'Zendesk Support',
  subdomain: 'jobrisers-care.zendesk.com',
  connectionStatus: 'Connected',
  twoWaySyncEnabled: true,
  lastSyncTimestamp: '12 min ago',
  syncedTicketsCount: 148,
};

export const initialAdminSupportQueueStats: AdminSupportQueueStats = {
  openQueue: 5,
  slaCompliance: 94.2,
  avgFirstResponseMinutes: 24,
  resolutionRatePercent: 88.5,
};

// ============================================================================
// ANALYTICS & MARKETPLACE REPORTING DATA (PRD Section 5.16, ANA-1 to ANA-10)
// ============================================================================

export interface AdminAnalyticsTimePoint {
  date: string;
  label: string;
  candidates: number;
  employers: number;
  jobs: number;
  applications: number;
  interviews: number;
  proMrrUsd: number;
  employerGmvInrLakhs: number;
}

export interface AdminAnalyticsAcquisitionChannel {
  id: string;
  channel: string;
  candidatesCount: number;
  employersCount: number;
  sharePercentage: number;
  trendPercentage: string;
  direction: 'up' | 'down' | 'flat';
  cpaEstimate: string;
  description: string;
}

export interface AdminAnalyticsRetentionCohort {
  cohort: string;
  signupsCount: number;
  day1Percent: number;
  day7Percent: number;
  day14Percent: number;
  day30Percent: number;
  day60Percent: number;
}

export interface AdminAnalyticsFunnelStep {
  id: string;
  stageName: string;
  category: 'Acquisition' | 'Activation' | 'Screening' | 'Evaluation' | 'Conversion';
  volume: number;
  conversionFromPrev: number;
  overallConversion: number;
  dropOffRate: number;
  dropOffCount: number;
  deltaWoW: string;
  frictionNote?: string;
  isBenchmarkWarning?: boolean;
}

export interface AdminAnalyticsVelocityBenchmark {
  id: string;
  metricName: string;
  currentValue: string;
  benchmarkTarget: string;
  status: 'Healthy' | 'Needs attention' | 'Optimal';
  delta: string;
  unit: string;
  description: string;
}

export interface AdminAnalyticsSearchKeyword {
  id: string;
  keyword: string;
  volume: number;
  sharePercentage: number;
  trend: string;
  avgResultsPerQuery: number;
  health: 'High' | 'Good' | 'Fair';
  primaryCategory: string;
}

export interface AdminAnalyticsZeroResultQuery {
  id: string;
  query: string;
  searchHits: number;
  category: string;
  suggestedTaxonomy: string;
  firstReported: string;
  status: 'Review suggested' | 'Taxonomy mapped' | 'Dismissed';
}

export interface AdminAnalyticsGeoDistribution {
  location: string;
  searchSharePercent: number;
  activeCandidatesPercent: number;
  liveJobsCount: number;
  growthWoW: string;
}

export interface AdminAnalyticsWorkModeDistribution {
  mode: 'Remote' | 'Hybrid' | 'On-site';
  percentage: number;
  trend: string;
  activeSearches: number;
}

export interface AdminAnalyticsSalaryBucketDistribution {
  bucket: string;
  minLpa: number;
  maxLpa: number;
  searchSharePercent: number;
  trend: string;
}

export interface AdminAnalyticsRevenueStreamPoint {
  period: string;
  candidateProMrrUsd: number;
  employerBillingGmvInr: number;
  jobPackagesGmvInr: number;
  totalGrossInr: number;
  arpuInr: number;
  refundsInr: number;
  refundRatePercent: number;
}

export interface AdminAnalyticsPlanDistribution {
  segment: 'Candidate' | 'Employer';
  planName: string;
  subscribersCount: number;
  sharePercent: number;
  mrrContribution: string;
  growthWoW: string;
  churnRate: string;
}

export interface AdminAnalyticsScheduledReportConfig {
  id: string;
  canonicalTitle: string;
  scope: string;
  frequency: 'Weekly' | 'Monthly' | 'Bi-weekly' | 'Daily';
  recipients: string[];
  format: 'Executive PDF Digest' | 'Detailed CSV' | 'Consolidated Brief';
  lastDispatched: string;
  nextScheduled: string;
  status: 'Active' | 'Paused';
  owner: string;
}

export const initialAdminAnalyticsTimePoints: AdminAnalyticsTimePoint[] = [
  { date: '2026-10-03', label: 'Oct 3', candidates: 1420, employers: 38, jobs: 180, applications: 4890, interviews: 340, proMrrUsd: 38200, employerGmvInrLakhs: 15.4 },
  { date: '2026-10-04', label: 'Oct 4', candidates: 1560, employers: 42, jobs: 195, applications: 5120, interviews: 360, proMrrUsd: 38900, employerGmvInrLakhs: 15.8 },
  { date: '2026-10-05', label: 'Oct 5', candidates: 1680, employers: 46, jobs: 210, applications: 5440, interviews: 385, proMrrUsd: 39400, employerGmvInrLakhs: 16.2 },
  { date: '2026-10-06', label: 'Oct 6', candidates: 1840, employers: 52, jobs: 235, applications: 5890, interviews: 410, proMrrUsd: 40100, employerGmvInrLakhs: 16.9 },
  { date: '2026-10-07', label: 'Oct 7', candidates: 1920, employers: 49, jobs: 220, applications: 6110, interviews: 430, proMrrUsd: 40700, employerGmvInrLakhs: 17.1 },
  { date: '2026-10-08', label: 'Oct 8', candidates: 2040, employers: 55, jobs: 250, applications: 6420, interviews: 450, proMrrUsd: 41200, employerGmvInrLakhs: 17.6 },
  { date: '2026-10-09', label: 'Oct 9', candidates: 2180, employers: 58, jobs: 270, applications: 6780, interviews: 475, proMrrUsd: 41600, employerGmvInrLakhs: 17.9 },
  { date: '2026-10-10', label: 'Oct 10', candidates: 2290, employers: 62, jobs: 290, applications: 7040, interviews: 495, proMrrUsd: 41800, employerGmvInrLakhs: 18.1 },
  { date: '2026-10-11', label: 'Oct 11', candidates: 2410, employers: 65, jobs: 310, applications: 7350, interviews: 510, proMrrUsd: 42000, employerGmvInrLakhs: 18.4 },
  { date: '2026-10-12', label: 'Oct 12', candidates: 2530, employers: 68, jobs: 325, applications: 7620, interviews: 530, proMrrUsd: 42200, employerGmvInrLakhs: 18.6 },
  { date: '2026-10-13', label: 'Oct 13', candidates: 2680, employers: 71, jobs: 340, applications: 7980, interviews: 555, proMrrUsd: 42400, employerGmvInrLakhs: 18.9 },
  { date: '2026-10-14', label: 'Oct 14', candidates: 2790, employers: 74, jobs: 360, applications: 8240, interviews: 570, proMrrUsd: 42600, employerGmvInrLakhs: 19.2 },
  { date: '2026-10-15', label: 'Oct 15', candidates: 2910, employers: 79, jobs: 380, applications: 8590, interviews: 595, proMrrUsd: 42800, employerGmvInrLakhs: 19.5 },
  { date: '2026-10-16', label: 'Today', candidates: 3040, employers: 84, jobs: 405, applications: 8940, interviews: 620, proMrrUsd: 43100, employerGmvInrLakhs: 19.8 },
];

export const initialAdminAnalyticsAcquisitionChannels: AdminAnalyticsAcquisitionChannel[] = [
  {
    id: 'ac-1',
    channel: 'Google Organic & SEO',
    candidatesCount: 5208,
    employersCount: 142,
    sharePercentage: 42.0,
    trendPercentage: '+12.8%',
    direction: 'up',
    cpaEstimate: '₹0 (Organic)',
    description: 'High-intent search traffic targeting job keywords, location-specific pages, and career guides.',
  },
  {
    id: 'ac-2',
    channel: 'Direct & Email Digests',
    candidatesCount: 3844,
    employersCount: 96,
    sharePercentage: 31.0,
    trendPercentage: '+8.4%',
    direction: 'up',
    cpaEstimate: '₹24 / lead',
    description: 'Daily/weekly job alerts, newsletter dispatches, and return candidate sessions.',
  },
  {
    id: 'ac-3',
    channel: 'LinkedIn & Social Referrals',
    candidatesCount: 2356,
    employersCount: 78,
    sharePercentage: 19.0,
    trendPercentage: '+18.2%',
    direction: 'up',
    cpaEstimate: '₹185 / verified',
    description: 'Recruiter network shares, hiring manager posts, and company job broadcast syndication.',
  },
  {
    id: 'ac-4',
    channel: 'Candidate & Recruiter Referral',
    candidatesCount: 992,
    employersCount: 26,
    sharePercentage: 8.0,
    trendPercentage: '+4.1%',
    direction: 'up',
    cpaEstimate: '₹120 / signup',
    description: 'Peer candidate referrals rewarded via Pro coupon codes and hiring manager word-of-mouth.',
  },
];

export const initialAdminAnalyticsRetentionCohorts: AdminAnalyticsRetentionCohort[] = [
  { cohort: 'Sep 08 – Sep 14', signupsCount: 8420, day1Percent: 78.4, day7Percent: 62.1, day14Percent: 54.8, day30Percent: 49.2, day60Percent: 44.5 },
  { cohort: 'Sep 15 – Sep 21', signupsCount: 9150, day1Percent: 79.2, day7Percent: 63.8, day14Percent: 56.2, day30Percent: 48.5, day60Percent: 43.8 },
  { cohort: 'Sep 22 – Sep 28', signupsCount: 9840, day1Percent: 81.0, day7Percent: 65.4, day14Percent: 58.1, day30Percent: 50.4, day60Percent: 45.2 },
  { cohort: 'Sep 29 – Oct 05', signupsCount: 10420, day1Percent: 82.5, day7Percent: 67.2, day14Percent: 60.4, day30Percent: 52.1, day60Percent: 46.8 },
];

export const initialAdminAnalyticsFunnelSteps: AdminAnalyticsFunnelStep[] = [
  {
    id: 'fn-1',
    stageName: '1. Unique Visitors / Search Views',
    category: 'Acquisition',
    volume: 124000,
    conversionFromPrev: 100.0,
    overallConversion: 100.0,
    dropOffRate: 0.0,
    dropOffCount: 0,
    deltaWoW: '+14.2%',
    frictionNote: 'Organic search landing volume across desktop and mobile browsers.',
  },
  {
    id: 'fn-2',
    stageName: '2. Profile Completed (Candidate & Employer)',
    category: 'Activation',
    volume: 51584,
    conversionFromPrev: 41.6,
    overallConversion: 41.6,
    dropOffRate: 58.4,
    dropOffCount: 72416,
    deltaWoW: '+2.4%',
    frictionNote: 'Major drop-off point: Resume PDF upload & parsing latency (PRD friction notice).',
    isBenchmarkWarning: true,
  },
  {
    id: 'fn-3',
    stageName: '3. Application Submitted / Click to Apply',
    category: 'Activation',
    volume: 22593,
    conversionFromPrev: 43.8,
    overallConversion: 18.2,
    dropOffRate: 56.2,
    dropOffCount: 28991,
    deltaWoW: '+6.1%',
    frictionNote: '18.2% click-to-apply rate across all active marketplace listings.',
  },
  {
    id: 'fn-4',
    stageName: '4. Recruiter Screening & Shortlisted',
    category: 'Screening',
    volume: 11296,
    conversionFromPrev: 50.0,
    overallConversion: 9.1,
    dropOffRate: 50.0,
    dropOffCount: 11297,
    deltaWoW: '+8.3%',
    frictionNote: 'Applications passing auto-screening rules and reviewed by employer recruiters.',
  },
  {
    id: 'fn-5',
    stageName: '5. Formal Video Interview Scheduled',
    category: 'Evaluation',
    volume: 1672,
    conversionFromPrev: 14.8,
    overallConversion: 1.35,
    dropOffRate: 85.2,
    dropOffCount: 9624,
    deltaWoW: '+3.9%',
    frictionNote: '14.8% of screened candidates proceed to live or asynchronous video interviews.',
  },
  {
    id: 'fn-6',
    stageName: '6. Formal Offer Extended',
    category: 'Conversion',
    volume: 924,
    conversionFromPrev: 55.3,
    overallConversion: 0.75,
    dropOffRate: 44.7,
    dropOffCount: 748,
    deltaWoW: '+5.4%',
    frictionNote: 'Written compensation packages delivered through JobRisers portal.',
  },
  {
    id: 'fn-7',
    stageName: '7. Offer Accepted & Hired',
    category: 'Conversion',
    volume: 632,
    conversionFromPrev: 68.4,
    overallConversion: 0.51,
    dropOffRate: 31.6,
    dropOffCount: 292,
    deltaWoW: '+7.8%',
    frictionNote: '68.4% offer acceptance rate, exceeding industry benchmark of 62%.',
  },
];

export const initialAdminAnalyticsVelocityBenchmarks: AdminAnalyticsVelocityBenchmark[] = [
  {
    id: 'vb-1',
    metricName: 'Employer Account Activation Velocity',
    currentValue: '4.2 Days',
    benchmarkTarget: '< 5.0 Days',
    status: 'Optimal',
    delta: '-18% faster',
    unit: 'Days',
    description: 'Average duration from account verification submission to first live job listing.',
  },
  {
    id: 'vb-2',
    metricName: 'Application Screening Response Latency',
    currentValue: '18.4 Hours',
    benchmarkTarget: '< 24.0 Hours',
    status: 'Healthy',
    delta: '-4.2 hrs',
    unit: 'Hours',
    description: 'Median time from candidate application submission to first recruiter screening action.',
  },
  {
    id: 'vb-3',
    metricName: 'Screening to Video Interview Coordination',
    currentValue: '3.2 Days',
    benchmarkTarget: '< 4.0 Days',
    status: 'Healthy',
    delta: '-0.8 days',
    unit: 'Days',
    description: 'Turnaround duration to align calendars and send verified meeting link.',
  },
  {
    id: 'vb-4',
    metricName: 'Marketplace Hiring Turnaround (TTF)',
    currentValue: '21.6 Days',
    benchmarkTarget: '< 28.0 Days',
    status: 'Optimal',
    delta: '-3.1 days',
    unit: 'Days',
    description: 'Full cycle from job publication to formal signed offer acceptance.',
  },
  {
    id: 'vb-5',
    metricName: 'Recruiter 7-Day Active Response Index',
    currentValue: '76.4%',
    benchmarkTarget: '> 70.0%',
    status: 'Healthy',
    delta: '+5.2%',
    unit: '% Active',
    description: 'Percentage of verified hiring managers who review pipeline candidates within 7 days.',
  },
];

export const initialAdminAnalyticsSearchKeywords: AdminAnalyticsSearchKeyword[] = [
  { id: 'skw-1', keyword: 'React Developer', volume: 14200, sharePercentage: 27.1, trend: '+14.2%', avgResultsPerQuery: 1240, health: 'High', primaryCategory: 'Technology' },
  { id: 'skw-2', keyword: 'Product Designer', volume: 9800, sharePercentage: 18.7, trend: '+9.8%', avgResultsPerQuery: 820, health: 'High', primaryCategory: 'Product & Design' },
  { id: 'skw-3', keyword: 'Data Platform Engineer', volume: 8100, sharePercentage: 15.5, trend: '+22.4%', avgResultsPerQuery: 640, health: 'High', primaryCategory: 'Data & AI' },
  { id: 'skw-4', keyword: 'DevOps & AWS Cloud', volume: 6400, sharePercentage: 12.2, trend: '+11.0%', avgResultsPerQuery: 510, health: 'Good', primaryCategory: 'Technology' },
  { id: 'skw-5', keyword: 'Product Manager', volume: 5200, sharePercentage: 9.9, trend: '+6.4%', avgResultsPerQuery: 380, health: 'Good', primaryCategory: 'Product & Design' },
  { id: 'skw-6', keyword: 'Java Spring Boot Lead', volume: 4700, sharePercentage: 9.0, trend: '+3.8%', avgResultsPerQuery: 420, health: 'Good', primaryCategory: 'Technology' },
  { id: 'skw-7', keyword: 'Full Stack Node.js', volume: 4000, sharePercentage: 7.6, trend: '+8.1%', avgResultsPerQuery: 350, health: 'Good', primaryCategory: 'Technology' },
];

export const initialAdminAnalyticsZeroResultQueries: AdminAnalyticsZeroResultQuery[] = [
  { id: 'zrq-1', query: 'junior product designer remote', searchHits: 284, category: 'Product & Design', suggestedTaxonomy: 'Map to Product Designer with 0-1 yr exp filter', firstReported: 'Today 09:15', status: 'Review suggested' },
  { id: 'zrq-2', query: 'golang web3 rust engineer', searchHits: 192, category: 'Technology', suggestedTaxonomy: 'Add Blockchain / Web3 niche skill tags', firstReported: 'Today 10:40', status: 'Review suggested' },
  { id: 'zrq-3', query: 'biomedical equipment sales lead hyderabad', searchHits: 145, category: 'Healthcare', suggestedTaxonomy: 'Create Medical Devices sub-industry category', firstReported: 'Yesterday', status: 'Review suggested' },
  { id: 'zrq-4', query: 'part-time react intern stipend', searchHits: 118, category: 'Technology', suggestedTaxonomy: 'Add Paid Internship employment type filter', firstReported: 'Oct 14', status: 'Taxonomy mapped' },
  { id: 'zrq-5', query: 'chief artificial intelligence officer remote', searchHits: 94, category: 'Executive', suggestedTaxonomy: 'Add CAIO / VP AI executive leadership role', firstReported: 'Oct 12', status: 'Review suggested' },
];

export const initialAdminAnalyticsGeoDistributions: AdminAnalyticsGeoDistribution[] = [
  { location: 'Bengaluru', searchSharePercent: 38.0, activeCandidatesPercent: 36.4, liveJobsCount: 4200, growthWoW: '+14.8%' },
  { location: 'Remote (Pan-India / Global)', searchSharePercent: 31.0, activeCandidatesPercent: 34.2, liveJobsCount: 3450, growthWoW: '+18.4%' },
  { location: 'Pune', searchSharePercent: 14.0, activeCandidatesPercent: 13.8, liveJobsCount: 1540, growthWoW: '+8.2%' },
  { location: 'Mumbai', searchSharePercent: 11.0, activeCandidatesPercent: 10.5, liveJobsCount: 1220, growthWoW: '+6.1%' },
  { location: 'Hyderabad', searchSharePercent: 6.0, activeCandidatesPercent: 5.1, liveJobsCount: 890, growthWoW: '+9.5%' },
];

export const initialAdminAnalyticsWorkModes: AdminAnalyticsWorkModeDistribution[] = [
  { mode: 'Remote', percentage: 54.0, trend: '+4.2% WoW', activeSearches: 28296 },
  { mode: 'Hybrid', percentage: 38.0, trend: '-1.8% WoW', activeSearches: 19912 },
  { mode: 'On-site', percentage: 8.0, trend: '-2.4% WoW', activeSearches: 4192 },
];

export const initialAdminAnalyticsSalaryBuckets: AdminAnalyticsSalaryBucketDistribution[] = [
  { bucket: '10 – 20 LPA', minLpa: 10, maxLpa: 20, searchSharePercent: 42.0, trend: '+5.4%' },
  { bucket: '20 – 35 LPA', minLpa: 20, maxLpa: 35, searchSharePercent: 28.0, trend: '+8.1%' },
  { bucket: '5 – 10 LPA', minLpa: 5, maxLpa: 10, searchSharePercent: 18.0, trend: '-2.4%' },
  { bucket: '35+ LPA', minLpa: 35, maxLpa: 999, searchSharePercent: 12.0, trend: '+14.6%' },
];

export const initialAdminAnalyticsRevenueStreams: AdminAnalyticsRevenueStreamPoint[] = [
  { period: 'May 2026', candidateProMrrUsd: 28400, employerBillingGmvInr: 12200000, jobPackagesGmvInr: 1450000, totalGrossInr: 16010000, arpuInr: 10400, refundsInr: 48000, refundRatePercent: 0.30 },
  { period: 'Jun 2026', candidateProMrrUsd: 31200, employerBillingGmvInr: 13400000, jobPackagesGmvInr: 1620000, totalGrossInr: 17610000, arpuInr: 10900, refundsInr: 52000, refundRatePercent: 0.29 },
  { period: 'Jul 2026', candidateProMrrUsd: 34500, employerBillingGmvInr: 14800000, jobPackagesGmvInr: 1780000, totalGrossInr: 19450000, arpuInr: 11450, refundsInr: 58000, refundRatePercent: 0.31 },
  { period: 'Aug 2026', candidateProMrrUsd: 37800, employerBillingGmvInr: 16100000, jobPackagesGmvInr: 1940000, totalGrossInr: 21180000, arpuInr: 12100, refundsInr: 64000, refundRatePercent: 0.33 },
  { period: 'Sep 2026', candidateProMrrUsd: 40500, employerBillingGmvInr: 17300000, jobPackagesGmvInr: 2050000, totalGrossInr: 22710000, arpuInr: 12500, refundsInr: 72000, refundRatePercent: 0.36 },
  { period: 'Oct 2026 (MTD)', candidateProMrrUsd: 43100, employerBillingGmvInr: 18400000, jobPackagesGmvInr: 2180000, totalGrossInr: 24160000, arpuInr: 12840, refundsInr: 74000, refundRatePercent: 0.40 },
];

export const initialAdminAnalyticsPlanDistributions: AdminAnalyticsPlanDistribution[] = [
  { segment: 'Candidate', planName: 'JobRisers Free', subscribersCount: 42800, sharePercent: 88.0, mrrContribution: '$0', growthWoW: '+11.2%', churnRate: 'N/A' },
  { segment: 'Candidate', planName: 'JobRisers Pro ($9.99/mo)', subscribersCount: 4314, sharePercent: 12.0, mrrContribution: '$43,100', growthWoW: '+8.4%', churnRate: '4.8%' },
  { segment: 'Employer', planName: 'Starter (₹4,999/mo)', subscribersCount: 488, sharePercent: 34.0, mrrContribution: '₹2.44M', growthWoW: '+6.2%', churnRate: '5.1%' },
  { segment: 'Employer', planName: 'Growth (₹14,999/mo)', subscribersCount: 688, sharePercent: 48.0, mrrContribution: '₹10.32M', growthWoW: '+14.6%', churnRate: '3.4%' },
  { segment: 'Employer', planName: 'Scale Enterprise (₹29,999/mo)', subscribersCount: 257, sharePercent: 18.0, mrrContribution: '₹7.71M', growthWoW: '+18.9%', churnRate: '1.8%' },
];

export const initialAdminScheduledReports: AdminAnalyticsScheduledReportConfig[] = [
  {
    id: 'srep-1',
    canonicalTitle: 'Weekly Marketplace Health Digest',
    scope: 'Consolidated report emailed to founders and ops lead every Monday 8 AM',
    frequency: 'Weekly',
    recipients: ['founders@jobrisers.example', 'ops-lead@jobrisers.example', 'analytics@jobrisers.example'],
    format: 'Executive PDF Digest',
    lastDispatched: 'Oct 5, 2026 at 08:00 AM',
    nextScheduled: 'Oct 19, 2026 at 08:00 AM',
    status: 'Active',
    owner: 'Rahul Sharma (Platform Ops)',
  },
  {
    id: 'srep-2',
    canonicalTitle: 'Monthly GST Tax & Invoicing Summary',
    scope: 'Financial reconciliation report dispatched to finance@jobrisers.example',
    frequency: 'Monthly',
    recipients: ['finance@jobrisers.example', 'billing-audit@jobrisers.example'],
    format: 'Detailed CSV',
    lastDispatched: 'Oct 1, 2026 at 00:00 AM',
    nextScheduled: 'Nov 1, 2026 at 00:00 AM',
    status: 'Active',
    owner: 'Devika Rao (Finance Controller)',
  },
  {
    id: 'srep-3',
    canonicalTitle: 'Trust & Safety Weekly Incident Log',
    scope: 'Case reports, blacklist updates and dispute outcomes summary',
    frequency: 'Weekly',
    recipients: ['compliance@jobrisers.example', 'legal@jobrisers.example', 'trust@jobrisers.example'],
    format: 'Executive PDF Digest',
    lastDispatched: 'Oct 8, 2026 at 09:30 AM',
    nextScheduled: 'Oct 15, 2026 at 09:30 AM',
    status: 'Active',
    owner: 'Maya Iyer (Trust & Safety Lead)',
  },
  {
    id: 'srep-4',
    canonicalTitle: 'Employer Hiring Velocity & Recruiter Index',
    scope: 'Metrics on time-to-hire and interview completion benchmarks',
    frequency: 'Bi-weekly',
    recipients: ['talent-partners@jobrisers.example', 'enterprise-sales@jobrisers.example'],
    format: 'Consolidated Brief',
    lastDispatched: 'Oct 4, 2026 at 11:00 AM',
    nextScheduled: 'Oct 18, 2026 at 11:00 AM',
    status: 'Active',
    owner: 'Aarav Mehta (Employer Relations)',
  },
  {
    id: 'srep-5',
    canonicalTitle: 'Candidate Drop-off & Funnel Friction Audit',
    scope: 'UX analytics report tracking onboarding drop-off by step',
    frequency: 'Monthly',
    recipients: ['product@jobrisers.example', 'design@jobrisers.example', 'growth@jobrisers.example'],
    format: 'Executive PDF Digest',
    lastDispatched: 'Sep 28, 2026 at 17:00 PM',
    nextScheduled: 'Oct 28, 2026 at 17:00 PM',
    status: 'Active',
    owner: 'Kiran Patel (Product Growth)',
  },
];

// ============================================================
// ANALYTICS WORKSPACE EXTENSIONS (ANL-2, ANL-6, ANL-7, ANL-8, ANL-9, ANL-10)
// ============================================================

export interface AdminAnalyticsSupplyDemandCategory {
  id: string;
  category: string;
  candidateSupply: number;
  jobDemand: number;
  ratio: number;
  health: 'Balanced' | 'Healthy' | 'High Supply' | 'Oversupplied' | 'Undersupplied';
  trendWoW: string;
}

export const initialAdminAnalyticsSupplyDemandCategories: AdminAnalyticsSupplyDemandCategory[] = [
  { id: 'sd-cat-1', category: 'IT & Software Engineering', candidateSupply: 28400, jobDemand: 3450, ratio: 8.2, health: 'Balanced', trendWoW: '+5.4%' },
  { id: 'sd-cat-2', category: 'Sales & Business Development', candidateSupply: 14200, jobDemand: 2100, ratio: 6.8, health: 'Healthy', trendWoW: '+8.1%' },
  { id: 'sd-cat-3', category: 'Product & Design', candidateSupply: 9800, jobDemand: 1150, ratio: 8.5, health: 'Balanced', trendWoW: '+4.2%' },
  { id: 'sd-cat-4', category: 'Marketing & Content', candidateSupply: 11800, jobDemand: 1150, ratio: 10.3, health: 'High Supply', trendWoW: '+2.8%' },
  { id: 'sd-cat-5', category: 'Finance & Accounting', candidateSupply: 9600, jobDemand: 980, ratio: 9.8, health: 'Balanced', trendWoW: '+3.1%' },
  { id: 'sd-cat-6', category: 'Human Resources & Talent', candidateSupply: 8400, jobDemand: 620, ratio: 13.5, health: 'Oversupplied', trendWoW: '-1.4%' },
];

export interface AdminAnalyticsSupplyDemandGeo {
  id: string;
  region: string;
  candidateSupply: number;
  jobDemand: number;
  ratio: number;
  health: 'Optimal' | 'Balanced' | 'Tight Supply';
  topSkill: string;
}

export const initialAdminAnalyticsSupplyDemandGeos: AdminAnalyticsSupplyDemandGeo[] = [
  { id: 'sd-geo-1', region: 'Bengaluru', candidateSupply: 42000, jobDemand: 5200, ratio: 8.1, health: 'Optimal', topSkill: 'React / Node.js' },
  { id: 'sd-geo-2', region: 'Remote (Pan-India)', candidateSupply: 38500, jobDemand: 4100, ratio: 9.4, health: 'Optimal', topSkill: 'Full Stack & DevOps' },
  { id: 'sd-geo-3', region: 'Delhi-NCR', candidateSupply: 21200, jobDemand: 2300, ratio: 9.2, health: 'Balanced', topSkill: 'Sales & Tech' },
  { id: 'sd-geo-4', region: 'Pune', candidateSupply: 16400, jobDemand: 1850, ratio: 8.9, health: 'Balanced', topSkill: 'Java / Cloud' },
  { id: 'sd-geo-5', region: 'Mumbai', candidateSupply: 14800, jobDemand: 1600, ratio: 9.3, health: 'Balanced', topSkill: 'Fintech & Marketing' },
  { id: 'sd-geo-6', region: 'Hyderabad', candidateSupply: 12900, jobDemand: 1450, ratio: 8.9, health: 'Balanced', topSkill: 'Data & AI' },
];

export interface AdminAnalyticsEmployerFunnelStep {
  id: string;
  stageName: string;
  volume: number;
  conversionFromPrev: number;
  overallConversion: number;
  dropOffRate: number;
  dropOffCount: number;
  frictionNote?: string;
  isBenchmarkWarning?: boolean;
}

export const initialAdminAnalyticsEmployerFunnelSteps: AdminAnalyticsEmployerFunnelStep[] = [
  { id: 'efn-1', stageName: '1. Recruiter / Employer Registration', volume: 1420, conversionFromPrev: 100.0, overallConversion: 100.0, dropOffRate: 0.0, dropOffCount: 0, frictionNote: 'Initial corporate domain or work email signup.' },
  { id: 'efn-2', stageName: '2. Company Profile & Details Setup', volume: 1255, conversionFromPrev: 88.4, overallConversion: 88.4, dropOffRate: 11.6, dropOffCount: 165, frictionNote: 'Logo upload and location setup completed.' },
  { id: 'efn-3', stageName: '3. Verification Documents Submitted', volume: 968, conversionFromPrev: 77.1, overallConversion: 68.2, dropOffRate: 22.9, dropOffCount: 287, frictionNote: 'GSTIN / CIN certificate upload friction.', isBenchmarkWarning: true },
  { id: 'efn-4', stageName: '4. First Job Published (Live Listing)', volume: 774, conversionFromPrev: 80.0, overallConversion: 54.5, dropOffRate: 20.0, dropOffCount: 194, frictionNote: 'Salary and JD creation step.' },
  { id: 'efn-5', stageName: '5. First Candidate Application Received', volume: 684, conversionFromPrev: 88.4, overallConversion: 48.2, dropOffRate: 11.6, dropOffCount: 90, frictionNote: 'Full activation achieved within 4.2 days median.' },
];

export interface AdminAnalyticsRecommendationsMetric {
  generatedCount: number;
  viewedCount: number;
  viewRatePercent: number;
  clicksCount: number;
  ctrPercent: number;
  applicationsCount: number;
  conversionPercent: number;
  positiveFeedbackPercent: number;
  fairnessIndex: number;
}

export const initialAdminAnalyticsRecommendationsMetric: AdminAnalyticsRecommendationsMetric = {
  generatedCount: 284500,
  viewedCount: 182080,
  viewRatePercent: 64.0,
  clicksCount: 44790,
  ctrPercent: 24.6,
  applicationsCount: 8150,
  conversionPercent: 18.2,
  positiveFeedbackPercent: 88.4,
  fairnessIndex: 98.2,
};

export interface AdminAnalyticsMessagingConversionMetric {
  messagesSent: number;
  responseRatePercent: number;
  conversationsStarted: number;
  interviewsGenerated: number;
  interviewConversionRatePercent: number;
  avgResponseTimeHours: number;
  hiredFromChat: number;
}

export const initialAdminAnalyticsMessagingConversion: AdminAnalyticsMessagingConversionMetric = {
  messagesSent: 48200,
  responseRatePercent: 78.4,
  conversationsStarted: 12450,
  interviewsGenerated: 2840,
  interviewConversionRatePercent: 22.8,
  avgResponseTimeHours: 4.2,
  hiredFromChat: 480,
};

export interface AdminAnalyticsResumeBuilderMetric {
  resumesCreated: number;
  resumesExported: number;
  exportRatePercent: number;
  pdfExportPercent: number;
  docxExportPercent: number;
  txtExportPercent: number;
  freeCreationVolume: number;
  proPreviewVolume: number;
  proUpgradeClicks: number;
  paidProUpgrades: number;
  popularTemplates: Array<{
    name: string;
    creations: number;
    sharePercent: number;
    tier: 'Free' | 'Pro';
  }>;
}

export const initialAdminAnalyticsResumeMetrics: AdminAnalyticsResumeBuilderMetric = {
  resumesCreated: 64200,
  resumesExported: 38400,
  exportRatePercent: 59.8,
  pdfExportPercent: 74.0,
  docxExportPercent: 19.0,
  txtExportPercent: 7.0,
  freeCreationVolume: 64200,
  proPreviewVolume: 28400,
  proUpgradeClicks: 7200,
  paidProUpgrades: 4314,
  popularTemplates: [
    { name: 'Modern Clean', creations: 24800, sharePercent: 38.6, tier: 'Pro' },
    { name: 'Tech Minimalist', creations: 16200, sharePercent: 25.2, tier: 'Free' },
    { name: 'Executive Sleek', creations: 11400, sharePercent: 17.8, tier: 'Pro' },
    { name: 'Creative Portfolio', creations: 7600, sharePercent: 11.8, tier: 'Pro' },
    { name: 'Simple Classic', creations: 4200, sharePercent: 6.5, tier: 'Free' },
  ],
};

export interface AdminAnalyticsDataIntegrityIssue {
  id: string;
  entity: string;
  issueDescription: string;
  affectedCount: number;
  severity: 'Healthy' | 'Warning' | 'Critical';
  status: 'In Auto-Cleanup' | 'Flagged for Review' | 'Verification Pending' | 'Resolved' | 'Queued in Master Data';
  lastScanned: string;
  remediationAction: string;
}

export const initialAdminAnalyticsDataIntegrityIssues: AdminAnalyticsDataIntegrityIssue[] = [
  {
    id: 'int-1',
    entity: 'Candidate Resumes',
    issueDescription: 'Orphaned parsed resume text chunks without parent candidate entity',
    affectedCount: 14,
    severity: 'Warning',
    status: 'In Auto-Cleanup',
    lastScanned: 'Today at 06:00 AM',
    remediationAction: 'Prune orphaned parser blobs older than 7 days',
  },
  {
    id: 'int-2',
    entity: 'Job Listings',
    issueDescription: 'Active postings missing explicit salary transparency flag',
    affectedCount: 8,
    severity: 'Warning',
    status: 'Flagged for Review',
    lastScanned: 'Today at 08:30 AM',
    remediationAction: 'Prompt employer recruiter on next edit',
  },
  {
    id: 'int-3',
    entity: 'Employer Accounts',
    issueDescription: 'Unverified corporate domains with pending draft listings',
    affectedCount: 5,
    severity: 'Warning',
    status: 'Verification Pending',
    lastScanned: 'Oct 15, 2026',
    remediationAction: 'Escalate to verification queue',
  },
  {
    id: 'int-4',
    entity: 'Salary Bands',
    issueDescription: 'Salary band contiguity check across all 4 configured brackets',
    affectedCount: 0,
    severity: 'Healthy',
    status: 'Resolved',
    lastScanned: 'Today at 00:00 AM',
    remediationAction: 'Continuous automated validation active',
  },
  {
    id: 'int-5',
    entity: 'Master Taxonomy',
    issueDescription: 'Unmapped user-suggested skill aliases exceeding 10 uses',
    affectedCount: 3,
    severity: 'Warning',
    status: 'Queued in Master Data',
    lastScanned: 'Oct 14, 2026',
    remediationAction: 'Merge into canonical taxonomy via Master Data',
  },
];



// ============================================================
// SETTINGS & PLATFORM GOVERNANCE TYPED SCHEMAS & DATA (SET-1 to SET-16, AUTH-1 to AUTH-8)
// ============================================================

export interface AdminPlatformGeneralConfig {
  brandName: string;
  supportEmail: string;
  primaryCurrency: string;
  secondaryCurrency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  seoTitleDefault: string;
  seoDescriptionDefault: string;
  dataIntegrityStatus: string;
  flaggedPlaceholderCount: number;
}

export interface AdminUploadPolicyConfig {
  candidatePhotoMaxMb: number;
  candidatePhotoAllowedFormats: string[];
  employerLogoMaxMb: number;
  employerLogoAllowedFormats: string[];
  svgSanitizationEnforced: boolean;
  resumeMaxMb: number;
  resumeAllowedFormats: string[];
  messageAttachmentMaxMb: number;
  messageAttachmentAllowedFormats: string[];
  automatedVirusScan: boolean;
}

export interface AdminPasswordPolicyConfig {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  resetLinkExpiryHours: number;
  maxFailedAttemptsBeforeLockout: number;
  lockoutDurationMinutes: number;
}

export interface AdminSessionGovernanceConfig {
  idleTimeoutMinutes: number;
  maxKeepSignedInDays: number;
  requireReauthForSensitiveActions: boolean;
  activeSessions: {
    id: string;
    adminName: string;
    role: string;
    ipAddress: string;
    device: string;
    location: string;
    loginTime: string;
    current: boolean;
  }[];
}

export interface AdminAuthProviderConfig {
  id: string;
  provider: 'Google' | 'LinkedIn' | 'Apple' | 'Email/Password';
  allowedForCandidates: boolean;
  allowedForEmployers: boolean;
  clientIdMasked: string;
  clientSecretMasked: string;
  status: 'Active' | 'Configured' | 'Disabled';
  lastTested: string;
}

export interface AdminSecurityPolicyConfig {
  mandatoryAdmin2Fa: boolean;
  totpProvider: string;
  googleWorkspaceSsoDomain: string;
  googleWorkspaceSsoEnabled: boolean;
  superAdminIpAllowlist: string;
  piiMaskingDefaultEnforced: boolean;
}

export interface AdminStaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations Admin' | 'Moderator' | 'Content Manager' | 'Support Agent' | 'Finance' | 'Analyst';
  twoFactorEnabled: boolean;
  lastLogin: string;
  status: 'Active' | 'Suspended';
}

export type RbacPermissionLevel = 'Full' | 'View' | 'View (masked)' | 'Flagged only' | 'Edit copy only' | 'None';

export interface RbacModuleRow {
  moduleId: string;
  moduleName: string;
  category: 'Workspace' | 'Operations' | 'Protection' | 'Insights & Access';
  permissions: Record<string, RbacPermissionLevel>;
}

export interface AdminFeatureFlagConfig {
  id: string;
  name: string;
  key: string;
  description: string;
  targetAudience: string;
  rolloutPercentage: number;
  enabled: boolean;
  status: 'Active' | 'Beta' | 'Disabled';
  lastUpdated: string;
}

export interface AdminMaintenanceModeConfig {
  maintenanceActive: boolean;
  bannerMessage: string;
  allowAdminBypass: boolean;
  scheduledWindow: string;
}

export interface AdminCompliancePolicyConfig {
  dataRetentionCandidateMonths: number;
  dataRetentionEmployerMonths: number;
  deactivatedAccountGraceDays: number;
  permanentDeletionGraceDays: number;
  auditLogRetentionMonths: number;
  dpdpConsentRegistryActive: boolean;
  gdprDsrSlaDays: number;
  cookieConsentBannerEnforced: boolean;
  legalVersions: {
    id: string;
    title: string;
    cmsVersion: string;
    publishedDate: string;
    reconsentRequired: boolean;
  }[];
}

export interface AdminIntegrationItem {
  id: string;
  category: 'Payments' | 'Email & SMS' | 'Storage' | 'Calendar & Video' | 'Helpdesk';
  serviceName: string;
  identifierMasked: string;
  secretMasked: string;
  endpointUrl: string;
  status: 'Connected' | 'Healthy' | 'Degraded' | 'Draft';
  lastSync: string;
  notes: string;
}

export interface AdminAuditTrailEntry {
  id: string;
  actorName: string;
  actorRole: string;
  actionCategory: 'Data Export' | 'PII Reveal' | 'Account Suspension' | 'Verification' | 'Algorithm Config' | 'Role Change' | 'Security Policy';
  actionTitle: string;
  targetEntity: string;
  ipAddress: string;
  device: string;
  timestamp: string;
  reason?: string;
  beforeValue?: string;
  afterValue?: string;
}

// ============================================================
// INITIAL DATASETS
// ============================================================

export const initialAdminPlatformGeneral: AdminPlatformGeneralConfig = {
  brandName: 'JobRisers',
  supportEmail: 'support@jobrisers.example',
  primaryCurrency: 'INR (₹)',
  secondaryCurrency: 'USD ($) for International Pro',
  timezone: 'Asia/Kolkata (IST · UTC+5:30)',
  dateFormat: 'DD MMM YYYY (e.g. 16 Oct 2026)',
  timeFormat: '12-hour with IST label (e.g. 11:45 AM IST)',
  seoTitleDefault: 'JobRisers — Premium Career Intelligence & Tech Hiring Platform',
  seoDescriptionDefault: 'Connect with verified top-tier tech employers and high-growth opportunities across India and Remote.',
  dataIntegrityStatus: 'Active Sentinel · 0 Leaks Detected',
  flaggedPlaceholderCount: 0,
};

export const initialAdminUploadPolicy: AdminUploadPolicyConfig = {
  candidatePhotoMaxMb: 5,
  candidatePhotoAllowedFormats: ['image/jpeg', 'image/png'],
  employerLogoMaxMb: 2,
  employerLogoAllowedFormats: ['image/png', 'image/jpeg', 'image/svg+xml'],
  svgSanitizationEnforced: true,
  resumeMaxMb: 10,
  resumeAllowedFormats: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  messageAttachmentMaxMb: 5,
  messageAttachmentAllowedFormats: ['application/pdf', 'image/jpeg', 'image/png'],
  automatedVirusScan: true,
};

export const initialAdminPasswordPolicy: AdminPasswordPolicyConfig = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  resetLinkExpiryHours: 24,
  maxFailedAttemptsBeforeLockout: 5,
  lockoutDurationMinutes: 30,
};

export const initialAdminSessionGovernance: AdminSessionGovernanceConfig = {
  idleTimeoutMinutes: 30,
  maxKeepSignedInDays: 30,
  requireReauthForSensitiveActions: true,
  activeSessions: [
    {
      id: 'sess-101',
      adminName: 'Operations Admin (Current User)',
      role: 'Operations Admin',
      ipAddress: '103.21.244.18',
      device: 'Chrome 129 / macOS (Apple Silicon)',
      location: 'Bengaluru, KA, India',
      loginTime: 'Today at 09:15 AM IST',
      current: true,
    },
    {
      id: 'sess-102',
      adminName: 'Rahul Sharma',
      role: 'Operations Admin',
      ipAddress: '14.143.32.90',
      device: 'Edge 128 / Windows 11 Enterprise',
      location: 'Pune, MH, India',
      loginTime: 'Today at 10:42 AM IST',
      current: false,
    },
    {
      id: 'sess-103',
      adminName: 'Devika Rao',
      role: 'Finance Controller',
      ipAddress: '49.207.211.5',
      device: 'Safari 18 / macOS Sonoma',
      location: 'Mumbai, MH, India',
      loginTime: 'Yesterday at 04:30 PM IST',
      current: false,
    },
    {
      id: 'sess-104',
      adminName: 'Maya Iyer',
      role: 'Trust & Safety Lead',
      ipAddress: '122.179.84.12',
      device: 'Firefox 131 / Ubuntu Linux',
      location: 'Bengaluru, KA, India',
      loginTime: 'Oct 14 at 11:20 AM IST',
      current: false,
    },
  ],
};

export const initialAdminAuthProviders: AdminAuthProviderConfig[] = [
  {
    id: 'auth-google',
    provider: 'Google',
    allowedForCandidates: true,
    allowedForEmployers: true,
    clientIdMasked: '892184910284-g7k••••••••••••.apps.googleusercontent.com',
    clientSecretMasked: 'GOCSPX-••••••••••••••••••••••••••••',
    status: 'Active',
    lastTested: 'Today, 08:30 AM IST',
  },
  {
    id: 'auth-linkedin',
    provider: 'LinkedIn',
    allowedForCandidates: true,
    allowedForEmployers: false, // Per PRD S04: Employer signup is Google only
    clientIdMasked: '78lk92m••••••••',
    clientSecretMasked: 'WPL_AP1_••••••••••••••••••••••••',
    status: 'Active',
    lastTested: 'Oct 14, 2026',
  },
  {
    id: 'auth-apple',
    provider: 'Apple',
    allowedForCandidates: true,
    allowedForEmployers: false,
    clientIdMasked: 'com.jobrisers.identity.web',
    clientSecretMasked: 'APPLE_SECRET_••••••••••••••••',
    status: 'Active',
    lastTested: 'Oct 12, 2026',
  },
  {
    id: 'auth-email',
    provider: 'Email/Password',
    allowedForCandidates: true,
    allowedForEmployers: true,
    clientIdMasked: 'Internal Argon2id Gateway',
    clientSecretMasked: '••••••••••••••••••••••••••••',
    status: 'Active',
    lastTested: 'Always Active',
  },
];

export const initialAdminSecurityPolicy: AdminSecurityPolicyConfig = {
  mandatoryAdmin2Fa: true,
  totpProvider: 'RFC 6238 TOTP (Google Authenticator / 1Password / Authy)',
  googleWorkspaceSsoDomain: 'jobrisers.example',
  googleWorkspaceSsoEnabled: true,
  superAdminIpAllowlist: '103.21.244.0/24, 14.143.32.0/24, 49.207.211.0/24',
  piiMaskingDefaultEnforced: true,
};

export const initialAdminStaffUsers: AdminStaffUser[] = [
  { id: 'usr-1', name: 'Sourabh Jhajharia', email: 'sourabh@jobrisers.example', role: 'Super Admin', twoFactorEnabled: true, lastLogin: 'Today, 11:20 AM', status: 'Active' },
  { id: 'usr-2', name: 'Platform Operations Admin', email: 'ops-lead@jobrisers.example', role: 'Operations Admin', twoFactorEnabled: true, lastLogin: 'Just now', status: 'Active' },
  { id: 'usr-3', name: 'Rahul Sharma', email: 'rahul.sharma@jobrisers.example', role: 'Operations Admin', twoFactorEnabled: true, lastLogin: 'Today, 10:42 AM', status: 'Active' },
  { id: 'usr-4', name: 'Maya Iyer', email: 'maya.iyer@jobrisers.example', role: 'Moderator', twoFactorEnabled: true, lastLogin: 'Yesterday, 05:15 PM', status: 'Active' },
  { id: 'usr-5', name: 'Kunal Sen', email: 'kunal.sen@jobrisers.example', role: 'Moderator', twoFactorEnabled: true, lastLogin: 'Oct 14, 02:30 PM', status: 'Active' },
  { id: 'usr-6', name: 'Neha Arora', email: 'neha.arora@jobrisers.example', role: 'Content Manager', twoFactorEnabled: true, lastLogin: 'Today, 09:00 AM', status: 'Active' },
  { id: 'usr-7', name: 'Vikram Malhotra', email: 'vikram.m@jobrisers.example', role: 'Content Manager', twoFactorEnabled: true, lastLogin: 'Oct 11, 04:00 PM', status: 'Active' },
  { id: 'usr-8', name: 'Devika Rao', email: 'devika.rao@jobrisers.example', role: 'Finance', twoFactorEnabled: true, lastLogin: 'Today, 11:00 AM', status: 'Active' },
  { id: 'usr-9', name: 'Aditya Joshi', email: 'aditya.joshi@jobrisers.example', role: 'Finance', twoFactorEnabled: true, lastLogin: 'Oct 12, 10:00 AM', status: 'Active' },
  { id: 'usr-10', name: 'Pooja Hegde', email: 'pooja.hegde@jobrisers.example', role: 'Support Agent', twoFactorEnabled: true, lastLogin: 'Today, 11:35 AM', status: 'Active' },
  { id: 'usr-11', name: 'Kiran Patel', email: 'kiran.patel@jobrisers.example', role: 'Analyst', twoFactorEnabled: true, lastLogin: 'Yesterday, 06:00 PM', status: 'Active' },
];

export const initialAdminRbacMatrix: RbacModuleRow[] = [
  {
    moduleId: 'mod-1',
    moduleName: 'Dashboard',
    category: 'Workspace',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'Full',
      'Content Manager': 'View',
      'Support Agent': 'View',
      Finance: 'View',
      Analyst: 'View',
    },
  },
  {
    moduleId: 'mod-2',
    moduleName: 'Candidates',
    category: 'Workspace',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'View',
      'Content Manager': 'None',
      'Support Agent': 'View (masked)',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-3',
    moduleName: 'Employers',
    category: 'Workspace',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'Full',
      'Content Manager': 'None',
      'Support Agent': 'View',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-4',
    moduleName: 'Employer Billing',
    category: 'Operations',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'View',
      Moderator: 'None',
      'Content Manager': 'None',
      'Support Agent': 'View',
      Finance: 'Full',
      Analyst: 'View',
    },
  },
  {
    moduleId: 'mod-5',
    moduleName: 'Jobs',
    category: 'Workspace',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'Full',
      'Content Manager': 'None',
      'Support Agent': 'View',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-6',
    moduleName: 'Applications',
    category: 'Workspace',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'View',
      'Content Manager': 'None',
      'Support Agent': 'View',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-7',
    moduleName: 'Interviews',
    category: 'Workspace',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'View (reported only)',
      'Content Manager': 'None',
      'Support Agent': 'View',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-8',
    moduleName: 'Messaging',
    category: 'Operations',
    permissions: {
      'Super Admin': 'Flagged only',
      'Operations Admin': 'None',
      Moderator: 'Flagged only',
      'Content Manager': 'None',
      'Support Agent': 'Flagged only (masked)',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-9',
    moduleName: 'Master Data',
    category: 'Operations',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'None',
      'Content Manager': 'View',
      'Support Agent': 'None',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-10',
    moduleName: 'Recommendations',
    category: 'Insights & Access',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'None',
      'Content Manager': 'Edit copy only',
      'Support Agent': 'None',
      Finance: 'None',
      Analyst: 'View',
    },
  },
  {
    moduleId: 'mod-11',
    moduleName: 'CMS / Content',
    category: 'Operations',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'View',
      Moderator: 'None',
      'Content Manager': 'Full',
      'Support Agent': 'None',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-12',
    moduleName: 'Resume Pro',
    category: 'Operations',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'View',
      Moderator: 'None',
      'Content Manager': 'None',
      'Support Agent': 'View',
      Finance: 'Full',
      Analyst: 'View',
    },
  },
  {
    moduleId: 'mod-13',
    moduleName: 'Communication',
    category: 'Operations',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'None',
      'Content Manager': 'Full',
      'Support Agent': 'None',
      Finance: 'None',
      Analyst: 'View',
    },
  },
  {
    moduleId: 'mod-14',
    moduleName: 'Trust & Safety',
    category: 'Protection',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'Full',
      'Content Manager': 'None',
      'Support Agent': 'View',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-15',
    moduleName: 'Support',
    category: 'Protection',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'None',
      'Content Manager': 'None',
      'Support Agent': 'Full',
      Finance: 'None',
      Analyst: 'None',
    },
  },
  {
    moduleId: 'mod-16',
    moduleName: 'Analytics',
    category: 'Insights & Access',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'Full',
      Moderator: 'View',
      'Content Manager': 'View',
      'Support Agent': 'None',
      Finance: 'Full',
      Analyst: 'Full',
    },
  },
  {
    moduleId: 'mod-17',
    moduleName: 'Settings',
    category: 'Insights & Access',
    permissions: {
      'Super Admin': 'Full',
      'Operations Admin': 'None',
      Moderator: 'None',
      'Content Manager': 'None',
      'Support Agent': 'None',
      Finance: 'None',
      Analyst: 'None',
    },
  },
];

export const initialAdminFeatureFlags: AdminFeatureFlagConfig[] = [
  {
    id: 'ff-1',
    name: 'AI Bullet Rewriter in Resume Pro',
    key: 'feat_resume_ai_rewriter',
    description: 'Enables OpenAI GPT-4o bullet point optimization and career impact suggestions inside Resume Pro builder.',
    targetAudience: 'Candidate Pro Tier Subscribers',
    rolloutPercentage: 50,
    enabled: true,
    status: 'Beta',
    lastUpdated: 'Oct 1, 2026',
  },
  {
    id: 'ff-2',
    name: '1-Click Apply for Complete Profiles',
    key: 'feat_1click_apply_global',
    description: 'Allows candidates with profile strength >= 90% and verified ATS resume to bypass screening form questionnaires.',
    targetAudience: 'All Candidates with 90%+ Profile Strength',
    rolloutPercentage: 100,
    enabled: true,
    status: 'Active',
    lastUpdated: 'Oct 6, 2026',
  },
  {
    id: 'ff-3',
    name: 'Employer Live Video Calling in Chat',
    key: 'feat_chat_webrtc_calling',
    description: 'Integrates peer-to-peer browser video rooms directly inside recruiter-candidate messaging thread.',
    targetAudience: 'Beta Staging Testers Only',
    rolloutPercentage: 0,
    enabled: false,
    status: 'Disabled',
    lastUpdated: 'Oct 10, 2026',
  },
  {
    id: 'ff-4',
    name: 'Recruiter Profile Views Counter',
    key: 'feat_candidate_profile_impressions',
    description: 'Candidate dashboard widget displaying real-time counts of recruiter profile views and search impressions.',
    targetAudience: 'All Active Candidates',
    rolloutPercentage: 100,
    enabled: true,
    status: 'Active',
    lastUpdated: 'Sep 22, 2026',
  },
  {
    id: 'ff-5',
    name: 'Automated Job Risk Scoring Sentinel',
    key: 'feat_tns_job_risk_scoring',
    description: 'Heuristic NLP scanner checking newly submitted job listings for suspicious off-platform contact links and fee solicitations.',
    targetAudience: 'Platform-wide Listing Moderation Queue',
    rolloutPercentage: 100,
    enabled: true,
    status: 'Active',
    lastUpdated: 'Today at 08:00 AM',
  },
  {
    id: 'ff-6',
    name: 'Statutory DPDP Erasure Fast-Track',
    key: 'feat_dpdp_erasure_automation',
    description: 'Automates candidate data anonymization workflows upon statutory identity OTP verification.',
    targetAudience: 'Compliance & Legal Queue',
    rolloutPercentage: 100,
    enabled: true,
    status: 'Active',
    lastUpdated: 'Oct 12, 2026',
  },
];

export const initialAdminMaintenanceMode: AdminMaintenanceModeConfig = {
  maintenanceActive: false,
  bannerMessage: 'JobRisers is undergoing scheduled maintenance. Candidate applications and job search remain active.',
  allowAdminBypass: true,
  scheduledWindow: 'Sundays 02:00 AM - 04:00 AM IST',
};

export const initialAdminCompliance: AdminCompliancePolicyConfig = {
  dataRetentionCandidateMonths: 24,
  dataRetentionEmployerMonths: 36,
  deactivatedAccountGraceDays: 90,
  permanentDeletionGraceDays: 30,
  auditLogRetentionMonths: 24,
  dpdpConsentRegistryActive: true,
  gdprDsrSlaDays: 30,
  cookieConsentBannerEnforced: true,
  legalVersions: [
    { id: 'leg-1', title: 'Terms of Service', cmsVersion: 'v2.4', publishedDate: 'Oct 1, 2026', reconsentRequired: true },
    { id: 'leg-2', title: 'Privacy Policy (DPDP 2023 & GDPR)', cmsVersion: 'v2.1', publishedDate: 'Sep 28, 2026', reconsentRequired: true },
    { id: 'leg-3', title: 'Candidate Rights & Fair Sourcing Charter', cmsVersion: 'v1.8', publishedDate: 'Oct 5, 2026', reconsentRequired: false },
    { id: 'leg-4', title: 'Employer Code of Conduct & Anti-Spam Policy', cmsVersion: 'v2.0', publishedDate: 'Sep 15, 2026', reconsentRequired: true },
  ],
};

export const initialAdminIntegrations: AdminIntegrationItem[] = [
  {
    id: 'int-stripe',
    category: 'Payments',
    serviceName: 'Stripe Payment Gateway',
    identifierMasked: 'pk_live_51Oz••••••••••••••••••••••••',
    secretMasked: 'sk_live_••••••••••••••••••••••••',
    endpointUrl: 'https://api.jobrisers.example/webhooks/stripe',
    status: 'Connected',
    lastSync: 'Today at 11:15 AM IST',
    notes: 'Handles Candidate Pro subscription USD billing and automated credit card lifecycle.',
  },
  {
    id: 'int-razorpay',
    category: 'Payments',
    serviceName: 'Razorpay Payment Gateway',
    identifierMasked: 'rzp_live_••••••••••••••••',
    secretMasked: 'rzp_sec_••••••••••••••••••••••••',
    endpointUrl: 'https://api.jobrisers.example/webhooks/razorpay',
    status: 'Connected',
    lastSync: 'Today at 11:22 AM IST',
    notes: 'Handles Employer Billing in INR, GST invoicing, UPI mandates and Net Banking.',
  },
  {
    id: 'int-ses',
    category: 'Email & SMS',
    serviceName: 'Amazon Simple Email Service (SES)',
    identifierMasked: 'AKIA••••••••••••••••',
    secretMasked: 'AWS_SES_SECRET_••••••••••••••••••••••••',
    endpointUrl: 'email-smtp.ap-south-1.amazonaws.com',
    status: 'Healthy',
    lastSync: '99.4% Delivery (0.12% bounce rate)',
    notes: 'Primary transactional email engine for verification, password resets and interview invites.',
  },
  {
    id: 'int-twilio',
    category: 'Email & SMS',
    serviceName: 'Twilio SMS Gateway',
    identifierMasked: 'AC••••••••••••••••••••••••••••••••',
    secretMasked: 'AUTH_TOKEN_••••••••••••••••••••••••',
    endpointUrl: 'https://api.twilio.com/2010-04-01',
    status: 'Connected',
    lastSync: 'Today at 08:00 AM IST',
    notes: 'Dispatches 2FA authentication OTPs and urgent interview reminder SMS to candidates.',
  },
  {
    id: 'int-s3',
    category: 'Storage',
    serviceName: 'AWS S3 Asset Vault',
    identifierMasked: 'arn:aws:s3:::jobrisers-prod-assets-vault',
    secretMasked: 'KMS_KEY_••••••••••••••••••••••••••••',
    endpointUrl: 's3.ap-south-1.amazonaws.com/jobrisers-prod-assets',
    status: 'Connected',
    lastSync: 'Continuous sync (AES-256 KMS encryption)',
    notes: 'Secure object storage for candidate resumes, employer verification certificates, and media assets.',
  },
  {
    id: 'int-google-calendar',
    category: 'Calendar & Video',
    serviceName: 'Google Workspace Calendar API',
    identifierMasked: 'google-cal-oauth-client-id',
    secretMasked: 'REFRESH_TOKEN_••••••••••••••••••••',
    endpointUrl: 'https://www.googleapis.com/calendar/v3',
    status: 'Connected',
    lastSync: 'Token refreshed 2 hours ago',
    notes: 'Synchronizes employer interview rounds and generates Google Meet video conference links.',
  },
  {
    id: 'int-zoom',
    category: 'Calendar & Video',
    serviceName: 'Zoom Video Communications',
    identifierMasked: 'ZOOM_CLIENT_ID_••••••••',
    secretMasked: 'ZOOM_SECRET_••••••••••••••••',
    endpointUrl: 'https://api.zoom.us/v2/users/me/meetings',
    status: 'Connected',
    lastSync: 'Oct 12, 2026',
    notes: 'Fallback video conferencing provider for enterprise employers using Zoom rooms.',
  },
  {
    id: 'int-helpdesk',
    category: 'Helpdesk',
    serviceName: 'Zendesk / Freshdesk Dual Connector',
    identifierMasked: 'support-agent-oauth',
    secretMasked: 'HELPDESK_BEARER_••••••••••••••••',
    endpointUrl: 'https://jobrisers.zendesk.com/api/v2',
    status: 'Healthy',
    lastSync: 'Operating Mode: In-House Desk (External standby)',
    notes: 'Configures external helpdesk two-way sync for ticket escalation and deflection analytics (SUP-2).',
  },
];

export const initialAdminAuditTrail: AdminAuditTrailEntry[] = [
  {
    id: 'aud-001',
    actorName: 'Rahul Sharma',
    actorRole: 'Operations Admin',
    actionCategory: 'Data Export',
    actionTitle: 'Export candidate dataset to CSV',
    targetEntity: 'Candidate Directory (1,240 records)',
    ipAddress: '14.143.32.90',
    device: 'Edge 128 / Windows 11 Enterprise',
    timestamp: 'Today at 09:30 AM IST',
    reason: 'Quarterly compliance audit and regional recruiter index review.',
    beforeValue: '{"export_state": "idle", "records_count": 0}',
    afterValue: '{"export_state": "downloaded", "records_count": 1240, "format": "CSV", "columns": ["ID", "Name", "Location", "Headline"]}',
  },
  {
    id: 'aud-002',
    actorName: 'Devika Rao',
    actorRole: 'Support Agent',
    actionCategory: 'PII Reveal',
    actionTitle: 'Unmasked candidate contact info',
    targetEntity: 'Candidate: Aarav Mehta (can-1001)',
    ipAddress: '49.207.211.5',
    device: 'Safari 18 / macOS Sonoma',
    timestamp: 'Today at 07:15 AM IST',
    reason: 'Investigating support ticket JR-C10451: PDF margin truncation issue.',
    beforeValue: '{"phone": "+91 98765 *****", "email": "aa***@mail.com"}',
    afterValue: '{"phone": "+91 98765 43210", "email": "aarav.mehta@designflow.io", "unmasked_until": "2026-10-16T12:00:00Z"}',
  },
  {
    id: 'aud-003',
    actorName: 'System Auto Sentinel',
    actorRole: 'Automated Governance',
    actionCategory: 'Account Suspension',
    actionTitle: 'Suspended employer account: Vertex Works',
    targetEntity: 'Employer: Vertex Works (emp-2009)',
    ipAddress: '127.0.0.1 (Internal Worker)',
    device: 'JobRisers Automated Sentinel v2.4',
    timestamp: 'Yesterday at 04:45 PM IST',
    reason: 'Trust & Safety report TNS-901 confirmed upfront training fee solicitation in violation of platform policy.',
    beforeValue: '{"account_status": "Active", "live_jobs": 3, "messaging_enabled": true}',
    afterValue: '{"account_status": "Suspended", "live_jobs": 0, "messaging_enabled": false, "reason": "Fee extortion report TNS-901"}',
  },
  {
    id: 'aud-004',
    actorName: 'Rahul Sharma',
    actorRole: 'Operations Admin',
    actionCategory: 'Verification',
    actionTitle: 'Approved employer verification: Northstar Labs',
    targetEntity: 'Company: Northstar Labs (emp-2001)',
    ipAddress: '14.143.32.90',
    device: 'Edge 128 / Windows 11 Enterprise',
    timestamp: 'Oct 10, 2026 at 11:30 AM IST',
    reason: 'Validated MCA Certificate of Incorporation and active GST registration documents.',
    beforeValue: '{"verification_status": "Pending", "verified_badge": false}',
    afterValue: '{"verification_status": "Verified", "verified_badge": true, "cin": "U72200KA2022PTC159012"}',
  },
  {
    id: 'aud-005',
    actorName: 'Sourabh Jhajharia',
    actorRole: 'Super Admin',
    actionCategory: 'Algorithm Config',
    actionTitle: 'Updated recommendation model weights',
    targetEntity: 'Algorithm Config: v2.4-hybrid',
    ipAddress: '103.21.244.18',
    device: 'Chrome 129 / macOS (Apple Silicon)',
    timestamp: 'Oct 8, 2026 at 04:30 PM IST',
    reason: 'Increased technical skills matching weight from 30% to 35% based on hiring manager feedback.',
    beforeValue: '{"skills_weight": 0.30, "role_weight": 0.30, "min_match_score": 60}',
    afterValue: '{"skills_weight": 0.35, "role_weight": 0.25, "min_match_score": 65}',
  },
  {
    id: 'aud-006',
    actorName: 'Sourabh Jhajharia',
    actorRole: 'Super Admin',
    actionCategory: 'Role Change',
    actionTitle: 'Promoted Neha Arora to Content Manager',
    targetEntity: 'Admin Staff: Neha Arora (usr-6)',
    ipAddress: '103.21.244.18',
    device: 'Chrome 129 / macOS (Apple Silicon)',
    timestamp: 'Oct 5, 2026 at 02:15 PM IST',
    reason: 'Assigned editorial responsibility for CMS pages, SEO metadata and email templates.',
    beforeValue: '{"role": "Analyst", "assigned_modules": ["Analytics"]}',
    afterValue: '{"role": "Content Manager", "assigned_modules": ["CMS", "Communication"]}',
  },
  {
    id: 'aud-007',
    actorName: 'Platform Operations Admin',
    actorRole: 'Operations Admin',
    actionCategory: 'Security Policy',
    actionTitle: 'Enforced 30-minute idle session timeout',
    targetEntity: 'Platform Governance Policy',
    ipAddress: '103.21.244.18',
    device: 'Chrome 129 / macOS (Apple Silicon)',
    timestamp: 'Oct 1, 2026 at 10:00 AM IST',
    reason: 'Compliance with DPDP Act 2023 administrative access security guidelines.',
    beforeValue: '{"idle_timeout_minutes": 60, "two_factor_mandatory": true}',
    afterValue: '{"idle_timeout_minutes": 30, "two_factor_mandatory": true}',
  },
];

// ==========================================
// BATCH 4: ADVANCED INTEGRATIONS & CONNECTORS
// ==========================================

export interface AtsSyncLog {
  id: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Failed';
  recordsImported: number;
  durationSeconds: number;
  message: string;
}

export interface AdminAtsConnector {
  id: string;
  name: string;
  provider: 'Greenhouse' | 'Lever' | 'Workday';
  status: 'Connected' | 'Syncing' | 'Warning' | 'Failed' | 'Disabled';
  lastSync: string;
  nextSync: string;
  recordsImported: number;
  syncFrequency: 'Every 15 min' | 'Hourly' | 'Daily';
  connectionState: 'Active' | 'Degraded' | 'Offline';
  enabled: boolean;
  endpointUrl: string;
  apiKeyMasked: string;
  departmentFilter?: string;
  lastError?: string;
  logs: AtsSyncLog[];
}

export const initialAdminAtsConnectors: AdminAtsConnector[] = [
  {
    id: 'ats-greenhouse',
    name: 'Greenhouse Enterprise Connector',
    provider: 'Greenhouse',
    status: 'Connected',
    lastSync: '12 minutes ago',
    nextSync: 'in 3 minutes',
    recordsImported: 418,
    syncFrequency: 'Every 15 min',
    connectionState: 'Active',
    enabled: true,
    endpointUrl: 'https://harvest.greenhouse.io/v1/jobs',
    apiKeyMasked: 'gh_live_••••••••••••••••••••••••••••••••',
    departmentFilter: 'Engineering, Product, Design',
    logs: [
      { id: 'log-gh-1', timestamp: 'Today at 05:30 PM', status: 'Success', recordsImported: 12, durationSeconds: 4.2, message: 'Delta sync complete: 12 new openings ingested, 3 closed.' },
      { id: 'log-gh-2', timestamp: 'Today at 05:15 PM', status: 'Success', recordsImported: 0, durationSeconds: 2.1, message: 'Sync check completed. No new updates found.' },
      { id: 'log-gh-3', timestamp: 'Today at 05:00 PM', status: 'Success', recordsImported: 4, durationSeconds: 3.5, message: 'Imported 4 listings from Bangalore engineering division.' },
    ],
  },
  {
    id: 'ats-lever',
    name: 'Lever Production Feed',
    provider: 'Lever',
    status: 'Warning',
    lastSync: '1 hour ago',
    nextSync: 'in 55 minutes',
    recordsImported: 182,
    syncFrequency: 'Hourly',
    connectionState: 'Degraded',
    enabled: true,
    endpointUrl: 'https://api.lever.co/v1/postings',
    apiKeyMasked: 'lev_sec_••••••••••••••••••••••••••••••••',
    departmentFilter: 'Operations, Sales, Customer Success',
    lastError: 'Rate limit warning: 85% quota consumed on Lever API plan.',
    logs: [
      { id: 'log-lev-1', timestamp: 'Today at 04:45 PM', status: 'Warning', recordsImported: 8, durationSeconds: 6.8, message: 'Ingestion completed with rate throttling warning.' },
      { id: 'log-lev-2', timestamp: 'Today at 03:45 PM', status: 'Success', recordsImported: 15, durationSeconds: 5.1, message: 'Full posting sync completed successfully.' },
    ],
  },
  {
    id: 'ats-workday',
    name: 'Workday Enterprise Cloud Sync',
    provider: 'Workday',
    status: 'Disabled',
    lastSync: 'Yesterday at 11:30 PM',
    nextSync: 'Scheduled on enable',
    recordsImported: 890,
    syncFrequency: 'Daily',
    connectionState: 'Offline',
    enabled: false,
    endpointUrl: 'https://wd2-services.workday.com/ccx/service/jobrisers/Staffing/v39',
    apiKeyMasked: 'wday_is_••••••••••••••••••••••••••••••••',
    departmentFilter: 'All Platform Business Units',
    logs: [
      { id: 'log-wd-1', timestamp: 'Yesterday at 11:30 PM', status: 'Success', recordsImported: 32, durationSeconds: 14.5, message: 'Daily bulk reconciliation completed.' },
    ],
  },
];

export interface CandidateSnapshot {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  experienceYears: number;
  skills: string[];
  applicationsCount: number;
  resumeFileName: string;
  createdAt: string;
}

export interface AdminDuplicateCandidatePair {
  id: string;
  candidateA: CandidateSnapshot;
  candidateB: CandidateSnapshot;
  matchConfidence: number; // 0 - 100
  matchConfidenceTier: 'High' | 'Medium' | 'Low';
  matchReasons: string[];
  suggestedAction: string;
  status: 'Pending Review' | 'Dismissed' | 'Merged';
  detectedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export const initialAdminDuplicateCandidatePairs: AdminDuplicateCandidatePair[] = [
  {
    id: 'dup-101',
    matchConfidence: 96,
    matchConfidenceTier: 'High',
    matchReasons: [
      'Identical normalized email address (aarav.mehta@domain vs aarav.m+work@domain)',
      'Exact matching phone number (+91 98765 43210)',
      'High name phonetic match (Soundex 0.98)',
      'Identical primary skill stack: React, TypeScript, Next.js',
    ],
    suggestedAction: 'Merge Candidate B into Candidate A (preserve 8 applications)',
    status: 'Pending Review',
    detectedAt: 'Today at 08:30 AM IST',
    candidateA: {
      id: 'can-1001',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@designflow.io',
      phone: '+91 98765 43210',
      location: 'Bengaluru, KA',
      headline: 'Senior Frontend Engineer | React & Design Systems',
      experienceYears: 6.5,
      skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Redux', 'Jest'],
      applicationsCount: 8,
      resumeFileName: 'Aarav_Mehta_Lead_Frontend_2026.pdf',
      createdAt: 'Jan 14, 2026',
    },
    candidateB: {
      id: 'can-1089',
      name: 'Aarav M.',
      email: 'aarav.m+work@designflow.io',
      phone: '+91 98765 43210',
      location: 'Bangalore Urban, Karnataka',
      headline: 'Lead UI Developer & Design Technologist',
      experienceYears: 6.0,
      skills: ['React', 'TypeScript', 'Next.js', 'Storybook', 'Figma Tokens'],
      applicationsCount: 2,
      resumeFileName: 'Aarav_Resume_Update_v2.pdf',
      createdAt: 'Oct 02, 2026',
    },
  },
  {
    id: 'dup-102',
    matchConfidence: 88,
    matchConfidenceTier: 'Medium',
    matchReasons: [
      'Matching phone number without international country code (+91 97112 33445)',
      'High name fuzzy similarity (Priya Sharma vs P. Sharma)',
      'Overlapping educational institution (BITS Pilani 2020)',
      'Same current employer stated (Razorpay / Razorpay Tech)',
    ],
    suggestedAction: 'Review profile details before merging',
    status: 'Pending Review',
    detectedAt: 'Yesterday at 04:12 PM IST',
    candidateA: {
      id: 'can-1002',
      name: 'Priya Sharma',
      email: 'priya.sharma@fintechcloud.in',
      phone: '+91 97112 33445',
      location: 'Gurugram, HR',
      headline: 'Fintech Product Manager | Core Banking & UPI APIs',
      experienceYears: 5.0,
      skills: ['Product Strategy', 'UPI Switch', 'Agile', 'SQL', 'Mixpanel', 'Jira'],
      applicationsCount: 4,
      resumeFileName: 'Priya_Sharma_PM_Resume.pdf',
      createdAt: 'Mar 18, 2026',
    },
    candidateB: {
      id: 'can-1094',
      name: 'P. Sharma',
      email: 'sharma.priya.careers@gmail.com',
      phone: '+91 97112 33445',
      location: 'Delhi NCR',
      headline: 'Product Owner - Payment Gateways & Settlement',
      experienceYears: 4.8,
      skills: ['Payments', 'Product Discovery', 'SQL', 'Fintech APIs', 'PRD Authoring'],
      applicationsCount: 1,
      resumeFileName: 'Priya_ProductManager_2026.pdf',
      createdAt: 'Oct 08, 2026',
    },
  },
  {
    id: 'dup-103',
    matchConfidence: 74,
    matchConfidenceTier: 'Low',
    matchReasons: [
      'Name match (Rohan Verma)',
      'Identical city (Hyderabad)',
      'Similar graduation year (2022)',
      'Different email and phone numbers detected',
    ],
    suggestedAction: 'Manual verification recommended; possible distinct persons',
    status: 'Pending Review',
    detectedAt: 'Oct 12, 2026 at 11:20 AM IST',
    candidateA: {
      id: 'can-1003',
      name: 'Rohan Verma',
      email: 'rohan.verma@cloudnative.dev',
      phone: '+91 98100 12345',
      location: 'Hyderabad, TS',
      headline: 'DevOps & Site Reliability Engineer | AWS & Kubernetes',
      experienceYears: 4.0,
      skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'Prometheus', 'CI/CD'],
      applicationsCount: 5,
      resumeFileName: 'Rohan_Verma_SRE_CV.pdf',
      createdAt: 'Feb 10, 2026',
    },
    candidateB: {
      id: 'can-1099',
      name: 'Rohan Verma',
      email: 'r.verma.cloud@outlook.com',
      phone: '+91 98450 67890',
      location: 'Hyderabad, Telangana',
      headline: 'Cloud Infrastructure Associate | GCP & Python',
      experienceYears: 3.5,
      skills: ['Google Cloud', 'Python', 'Docker', 'Linux Administration'],
      applicationsCount: 2,
      resumeFileName: 'Resume_Rohan_Verma.pdf',
      createdAt: 'Sep 25, 2026',
    },
  },
];

export interface AdminIpAllowlistEntry {
  id: string;
  cidr: string;
  description: string;
  status: 'Active' | 'Disabled';
  addedBy: string;
  addedAt: string;
  lastActive: string;
}

export const initialAdminIpAllowlist: AdminIpAllowlistEntry[] = [
  {
    id: 'ip-1',
    cidr: '14.143.32.90/32',
    description: 'Bengaluru HQ Primary Gateway (Operations & Super Admin)',
    status: 'Active',
    addedBy: 'Sourabh Jhajharia (Super Admin)',
    addedAt: 'Jan 10, 2026',
    lastActive: 'Active now (Current Session)',
  },
  {
    id: 'ip-2',
    cidr: '49.207.211.0/24',
    description: 'Support Center Static VPN Subnet (Hyderabad Facility)',
    status: 'Active',
    addedBy: 'Platform Operations Admin',
    addedAt: 'Feb 04, 2026',
    lastActive: 'Today at 07:15 AM',
  },
  {
    id: 'ip-3',
    cidr: '103.21.244.18/32',
    description: 'Executive Management Secure Outpost (Mumbai Office)',
    status: 'Active',
    addedBy: 'Sourabh Jhajharia (Super Admin)',
    addedAt: 'Mar 15, 2026',
    lastActive: 'Yesterday at 04:30 PM',
  },
];

export interface AdminSsoConfig {
  provider: 'Google Workspace';
  protocol: 'SAML 2.0' | 'OIDC';
  domain: string;
  clientIdOrEntityId: string;
  ssoUrlOrIssuer: string;
  certificateOrSecretMasked: string;
  enforced: boolean;
  status: 'Configured' | 'Testing' | 'Disabled';
  lastVerified: string;
}

export const initialAdminSsoConfig: AdminSsoConfig = {
  provider: 'Google Workspace',
  protocol: 'SAML 2.0',
  domain: 'jobrisers.com',
  clientIdOrEntityId: 'https://accounts.google.com/o/saml2?idpid=C03jobrisers',
  ssoUrlOrIssuer: 'https://accounts.google.com/o/saml2/idp?idpid=C03jobrisers',
  certificateOrSecretMasked: 'MIIDdDCCAlygAwIBAgIGAYz4••••••••••••••••••••••••••••••••••••••••',
  enforced: false,
  status: 'Configured',
  lastVerified: 'Oct 14, 2026 at 02:45 PM IST',
};

