const fs = require('fs');

const content = `import { ClipboardList, ListFilter, FileText, Sparkles, Bell, ShieldAlert, CircleHelp, Activity, Settings2 } from 'lucide-react';

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

export interface AdminCandidate extends DirectoryRecord {
  name: string;
  headline: string;
  emailMasked: string;
  location: string;
  status: string;
  completion: number;
  source: string;
  lastActive: string;
  pro?: boolean;
}

export interface AdminEmployer extends DirectoryRecord {
  company: string;
  name: string;
  emailMasked: string;
  location: string;
  verification: string;
  jobs: number;
  plan: string;
  status: string;
  joined: string;
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
  { id: 'can-1001', name: 'Aarav Mehta', headline: 'Senior Product Designer', emailMasked: 'aa***@mail.com', location: 'Bengaluru, KA', status: 'Active', completion: 96, source: 'Google', lastActive: '12 min ago', pro: true },
  { id: 'can-1002', name: 'Priya Nair', headline: 'Frontend Engineer', emailMasked: 'pr***@mail.com', location: 'Kochi, KL', status: 'Pending', completion: 78, source: 'LinkedIn', lastActive: '46 min ago' },
  { id: 'can-1003', name: 'Rohan Kapoor', headline: 'Data Platform Engineer', emailMasked: 'ro***@mail.com', location: 'Pune, MH', status: 'Active', completion: 88, source: 'Referral', lastActive: 'Today', pro: true },
  { id: 'can-1004', name: 'Meera Iyer', headline: 'Customer Success Lead', emailMasked: 'me***@mail.com', location: 'Chennai, TN', status: 'Suspended', completion: 64, source: 'Email', lastActive: 'Yesterday' },
  { id: 'can-1005', name: 'Kabir Shah', headline: 'Growth Marketer', emailMasked: 'ka***@mail.com', location: 'Mumbai, MH', status: 'Active', completion: 91, source: 'Google', lastActive: '2 hr ago' },
];

export const adminEmployers: AdminEmployer[] = [
  { id: 'emp-2001', company: 'Northstar Labs', name: 'Isha Menon', emailMasked: 'is***@northstar.example', location: 'Bengaluru, KA', verification: 'Verified', jobs: 18, plan: 'Scale', status: 'Active', joined: 'May 12' },
  { id: 'emp-2002', company: 'Cloudframe', name: 'Vikram Sethi', emailMasked: 'vi***@cloudframe.example', location: 'Pune, MH', verification: 'Under review', jobs: 7, plan: 'Growth', status: 'Pending', joined: 'Aug 4' },
  { id: 'emp-2003', company: 'Pioneer Talent', name: 'Neha Arora', emailMasked: 'ne***@pioneer.example', location: 'Delhi, DL', verification: 'Need info', jobs: 3, plan: 'Starter', status: 'Active', joined: 'Sep 18' },
  { id: 'emp-2004', company: 'Vertex Works', name: 'Amit Rao', emailMasked: 'am***@vertex.example', location: 'Hyderabad, TS', verification: 'Rejected', jobs: 0, plan: 'Starter', status: 'Suspended', joined: 'Oct 1' },
  { id: 'emp-2005', company: 'BrightPath Careers', name: 'Sana Qureshi', emailMasked: 'sa***@brightpath.example', location: 'Remote India', verification: 'Verified', jobs: 11, plan: 'Scale', status: 'Active', joined: 'Jun 22' },
];

export const adminJobs: AdminJob[] = [
  { id: 'job-3001', title: 'Senior Product Designer', company: 'Northstar Labs', location: 'Bengaluru, KA', workMode: 'Hybrid', type: 'Full time', status: 'Live', posted: 'Today', applicants: 84 },
  { id: 'job-3002', title: 'Frontend Engineer', company: 'Cloudframe', location: 'Remote India', workMode: 'Remote', type: 'Full time', status: 'Pending', posted: '46 min ago', applicants: 12 },
  { id: 'job-3003', title: 'Data Platform Engineer', company: 'Cloudframe', location: 'Pune, MH', workMode: 'Hybrid', type: 'Full time', status: 'Pending', posted: '2 hr ago', applicants: 27, flagged: true },
  { id: 'job-3004', title: 'Customer Success Lead', company: 'BrightPath Careers', location: 'Mumbai, MH', workMode: 'On site', type: 'Full time', status: 'Paused', posted: 'Yesterday', applicants: 49 },
  { id: 'job-3005', title: 'Junior Product Analyst', company: 'Pioneer Talent', location: 'Delhi, DL', workMode: 'Hybrid', type: 'Internship', status: 'Draft', posted: 'Oct 5', applicants: 0 },
  { id: 'job-3006', title: 'Growth Marketing Manager', company: 'Northstar Labs', location: 'Remote India', workMode: 'Remote', type: 'Contract', status: 'Expired', posted: 'Sep 28', applicants: 112 },
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
        ? \`\${(row as AdminEmployer).status} \${(row as AdminEmployer).verification}\`
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
  applications: { icon: ClipboardList, title: 'Applications oversight', hint: 'Monitor application activity and keep candidate and employer workflows visible.', sections: ['All applications', 'Abuse monitor'] },
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
    { section: 'All applications', title: 'Priya Nair → Frontend Engineer', detail: 'Cloudframe · shortlisted', status: 'Shortlisted', updated: '46 min ago' },
    { section: 'All applications', title: 'Rohan Kapoor → Data Platform Engineer', detail: 'Cloudframe · employer updated stage', status: 'Interview', updated: 'Today' },
    { section: 'Abuse monitor', title: 'Mass-apply pattern detected', detail: 'Candidate ID can-1094 applied to 400 jobs', status: 'Flagged', updated: '15 min ago' },
  ],
  'master-data': [
    { section: 'Categories', title: 'Technology', detail: 'Category · 1,486 live jobs', status: 'Active', updated: '42 min ago' },
    { section: 'Roles', title: 'Product Designer', detail: 'Role · maps to Technology', status: 'Active', updated: 'Yesterday' },
    { section: 'Skills', title: 'Product analytics', detail: 'Skill · 1,209 profiles · suggested by users', status: 'Review suggested', updated: '18 min ago' },
    { section: 'Filters', title: 'Salary range', detail: 'Filter config · defaults INR LPA', status: 'Visible', updated: 'Sep 28' },
    { section: 'Locations', title: 'Bengaluru', detail: 'City · 4,200 jobs mapped', status: 'Active', updated: 'Oct 1' },
    { section: 'Industries', title: 'SaaS', detail: 'Industry · 840 companies', status: 'Active', updated: 'Oct 3' },
    { section: 'Benefits', title: 'Health Insurance', detail: 'Benefit icon + label', status: 'Active', updated: 'Sep 15' },
  ],
  content: [
    { section: 'Landing page', title: 'Hero Headline', detail: 'CMS block · "Find your next big thing"', status: 'Published', updated: 'Oct 6' },
    { section: 'Career advice', title: 'How to stand out in a competitive job market', detail: 'Article · featured placement', status: 'Published', updated: 'Today' },
    { section: 'Static pages', title: 'Candidate Rights', detail: 'Version 2.1 · consent refresh enabled', status: 'Published', updated: 'Oct 6' },
    { section: 'Banners and cards', title: 'Resume upload card', detail: 'Target: India · candidate audience', status: 'Scheduled', updated: 'Oct 8' },
    { section: 'Email templates', title: 'Application viewed', detail: 'Transactional · 4 variables', status: 'Active', updated: 'Oct 5' },
    { section: 'Media library', title: 'hero-bg-v3.jpg', detail: 'Image · 1.2MB · 1920x1080', status: 'Active', updated: 'Oct 1' },
  ],
  'resume-pro': [
    { section: 'Templates', title: 'Modern Split · v2.4', detail: 'ATS validated · display order 1', status: 'Published', updated: 'Oct 6' },
    { section: 'Templates', title: 'Tech Mono · v1.8', detail: 'Pro tier · compact layout', status: 'Published', updated: 'Oct 4' },
    { section: 'Plans and pricing', title: 'JobRisers Pro · monthly', detail: 'USD 9.99/mo · 7-day money-back', status: 'Active', updated: 'Oct 1' },
    { section: 'Subscriptions', title: 'sub_1P8xYz...', detail: 'Aarav Mehta · active · auto-renews', status: 'Active', updated: 'Today' },
    { section: 'Invoices and refunds', title: 'RF-2281 · candidate request', detail: 'USD 9.99 · awaiting finance approval', status: 'Needs approval', updated: '31 min ago' },
    { section: 'Coupons', title: 'WINTER25', detail: '25% off first 3 months · 100 redemptions left', status: 'Active', updated: 'Oct 2' },
  ],
  communication: [
    { section: 'Job alerts', title: 'Senior product designer · Bengaluru', detail: '1,284 subscribers · daily digest', status: 'Active', updated: 'Today' },
    { section: 'Broadcasts', title: 'New resume templates are here', detail: 'Email · Pro subscribers', status: 'Scheduled', updated: 'Oct 8' },
    { section: 'Notification triggers', title: 'Application Rejected', detail: 'Trigger: employer status change', status: 'Active', updated: 'Sep 10' },
    { section: 'Delivery logs', title: 'Payment failure notifications', detail: 'Email · 286 sent · 9 retries in progress', status: 'Monitoring', updated: 'Today' },
  ],
  'trust-safety': [
    { section: 'Reports', title: 'JR-J5830 · suspicious external contact', detail: 'Reported by 2 candidates · assigned to Maya', status: 'High priority', updated: '12 min ago' },
    { section: 'Flagged messages', title: 'Thread #84920', detail: 'Trigger: request for payment', status: 'Under review', updated: '34 min ago' },
    { section: 'Blacklists', title: 'Disposable email domains', detail: 'Sign-up rule · 1,842 domains', status: 'Active', updated: 'Oct 2' },
    { section: 'Fraud signals', title: 'Bulk sign-ups from one IP range', detail: '17 profiles · same device fingerprint', status: 'Investigating', updated: '7 min ago' },
  ],
  support: [
    { section: 'Tickets', title: 'Resume export is missing a page', detail: 'Candidate · JR-C10451', status: 'Open', updated: '26 min ago' },
    { section: 'Tickets', title: 'Company verification documents', detail: 'Employer · JR-E2081', status: 'Resolved', updated: '1 hr ago' },
    { section: 'Canned responses', title: 'Refund Policy Explanation', detail: 'Used 45 times this week', status: 'Active', updated: 'Aug 12' },
  ],
  analytics: [
    { section: 'Growth', title: 'Candidate sign-ups by source', detail: 'Google 42% · Email 31% · LinkedIn 19%', status: 'Updated today', updated: '+12.8%' },
    { section: 'Funnel', title: 'Profile completion → first application', detail: 'Drop-off: resume upload', status: 'Needs attention', updated: '41.6%' },
    { section: 'Search insights', title: 'Zero-result searches', detail: 'Top query: "junior product designer remote"', status: 'Review taxonomy', updated: '284 today' },
    { section: 'Revenue', title: 'MRR Growth', detail: 'USD 42K total · 5% churn', status: 'Updated today', updated: '+8.4%' },
    { section: 'Scheduled reports', title: 'Weekly Marketplace Health', detail: 'Emailed to Founders list every Monday', status: 'Active', updated: 'Oct 5' },
  ],
  settings: [
    { section: 'Platform', title: 'Candidate photo uploads', detail: 'JPG/PNG · max 5 MB', status: 'Configured', updated: 'Sep 30' },
    { section: 'Auth providers', title: 'Google OAuth', detail: 'Keys configured · active', status: 'Active', updated: 'Sep 28' },
    { section: 'Roles and admins', title: 'Analyst · read-only', detail: 'Reports and dashboards · PII masked', status: '2 admins', updated: 'Yesterday' },
    { section: 'Feature flags', title: 'AI Bullet Rewriter', detail: 'Pro users only · 50% rollout', status: 'Active', updated: 'Oct 1' },
    { section: 'Compliance', title: 'Cookie Banner Config', detail: 'GDPR/DPDP compliant mode', status: 'Active', updated: 'May 1' },
    { section: 'Integrations', title: 'Stripe Gateway', detail: 'Live mode · Webhooks active', status: 'Active', updated: 'Jan 15' },
    { section: 'Audit log', title: 'Export candidate data', detail: 'Action by Admin: Rahul', status: 'Logged', updated: '2 hr ago' },
  ],
};
`;

fs.writeFileSync('src/mock-data.ts', content);
console.log('mock-data.ts updated!');
