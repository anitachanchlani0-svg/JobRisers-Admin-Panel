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
