import { type ReactNode, useState, useMemo, useRef, useEffect } from 'react';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, BriefcaseBusiness, Building2, Calendar, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, Clock3, CreditCard, FileText, Filter, LayoutDashboard,
  ListFilter, LockKeyhole, Menu, MessageSquare, Search, Settings2, Shield,
  ShieldAlert, Sliders, Sparkles, Users, X, Eye, LogOut, UserCheck, Globe,
} from 'lucide-react';
import { Link, useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary, Modal } from '@/components/ui';
import { clearAuthSession, getAuthToken, getCurrentAdmin, setAuthSession } from '@/lib/api';
import { Overview } from '@/pages/Overview';
import { DirectoryPage } from '@/pages/Directory';
import { ModulePage } from '@/pages/Module';
import { NotFound } from '@/pages/NotFound';
import { InterviewsPage } from '@/pages/Interviews';
import { MessagingPage } from '@/pages/Messaging';
import { RecommendationsPage } from '@/pages/Recommendations';
import { EmployerBillingPage } from '@/pages/EmployerBilling';
import {
  CandidateDetailPage,
  EmployerDetailPage,
  JobDetailPage,
  ApplicationDetailPage,
  SupportTicketDetailPage,
  LoginPage,
  TalentNetworkPage,
  SalaryBenchmarkPage,
  AiCoverLetterPage,
  CurriculumBuilderView,
  AdminProfilePage,
  InterviewDetailPage,
  InterviewDisputeDetailPage,
  JobAlertDetailPage,
  JobAlertCreatePage,
  BroadcastCreatePage,
  BroadcastDetailPage,
  NotificationTriggerDetailPage,
  MasterDataCategoryFormPage,
  MasterDataRoleFormPage,
  MasterDataSkillFormPage,
  MasterDataIndustryFormPage,
  MasterDataLocationFormPage,
  MasterDataSalaryBucketFormPage,
  MasterDataBenefitFormPage,
  ContentArticleFormPage,
  ContentPolicyFormPage,
  ResumeProTemplateFormPage,
  ResumeProPlanFormPage,
  ResumeProSubscriptionDetailPage,
  ResumeProRefundDetailPage,
  EmployerBillingTierFormPage,
  EmployerBillingInvoiceDetailPage,
  EmployerBillingCreditFormPage,
  TrustSafetyReportDetailPage,
  TrustSafetyBlacklistFormPage,
} from '@/pages';
import {
  adminCandidates,
  adminEmployers,
  adminJobs,
  adminApplications,
  initialAdminViewAsUserAuditLogs,
  type AdminViewAsUserAuditLog,
  initialAdminRbacMatrix,
  type RbacPermissionLevel,
} from '@/mock-data';

export interface AdminRoleConfig {
  id: string;
  name: string;
  short: string;
  description: string;
  bg: string;
  text: string;
  badgeTone: string;
}

export const ADMIN_ROLES: AdminRoleConfig[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    short: 'SA',
    description: 'Root platform governance · Full system configuration & role management',
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    badgeTone: 'border-rose-200 bg-rose-50 text-rose-700',
  },
  {
    id: 'operations-admin',
    name: 'Operations Admin',
    short: 'OA',
    description: 'Day-to-day operations · Marketplace supervision & stage management',
    bg: 'bg-[#e4dcfb]',
    text: 'text-[#5842a7]',
    badgeTone: 'border-purple-200 bg-purple-50 text-purple-700',
  },
  {
    id: 'moderator',
    name: 'Moderator',
    short: 'MO',
    description: 'Content & account moderation · Trust, safety, fraud & reports oversight',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    badgeTone: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  {
    id: 'content-manager',
    name: 'Content Manager',
    short: 'CM',
    description: 'CMS publishing · Career advice articles, policies & email templates',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    badgeTone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    short: 'SU',
    description: 'Customer care · Support ticket queues & user casework resolution',
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    badgeTone: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  {
    id: 'finance',
    name: 'Finance',
    short: 'FI',
    description: 'Billing & monetization · Subscriptions, packages, invoices & refunds',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    badgeTone: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    id: 'analyst',
    name: 'Analyst',
    short: 'AN',
    description: 'Read-only analytics · Reporting, marketplace metrics & funnel audits',
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    badgeTone: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  },
];

const navGroups = [
  { label: 'WORKSPACE', links: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Candidates', href: '/admin/candidates', icon: Users },
    { name: 'Employers', href: '/admin/employers', icon: Building2 },
    { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseBusiness },
    { name: 'Applications', href: '/admin/applications', icon: ClipboardList },
    { name: 'Interviews', href: '/admin/interviews', icon: Calendar },
  ] },
  { label: 'OPERATIONS', links: [
    { name: 'Master data', href: '/admin/master-data', icon: ListFilter },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Resume Pro', href: '/admin/resume-pro', icon: Sparkles },
    { name: 'Talent Network', href: '/admin/talent-network', icon: Globe },
    { name: 'Employer billing', href: '/admin/employer-billing', icon: CreditCard },
    { name: 'Communication', href: '/admin/communication', icon: Bell },
    { name: 'Messaging', href: '/admin/messaging', icon: MessageSquare },
  ] },
  { label: 'PROTECTION', links: [
    { name: 'Trust & safety', href: '/admin/trust-safety', icon: ShieldAlert },
    { name: 'Support', href: '/admin/support', icon: CircleHelp },
  ] },
  { label: 'INSIGHTS & ACCESS', links: [
    { name: 'Salary Benchmark', href: '/admin/salary-benchmark', icon: Sliders },
    { name: 'AI Cover Letter', href: '/admin/ai-cover-letter', icon: Sparkles },
    { name: 'Interview Prep', href: '/admin/interview-prep', icon: Calendar },
    { name: 'Recommendations', href: '/admin/recommendations', icon: Sliders },
    { name: 'Analytics', href: '/admin/analytics', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings2 },
  ] },
];

const pageMeta: Record<string, { title: string; eyebrow: string; description: string }> = {
  '/admin/dashboard': { title: 'Dashboard', eyebrow: 'OPERATIONS / TODAY', description: 'A clear view of marketplace health and the work that needs attention.' },
  '/admin': { title: 'Dashboard', eyebrow: 'OPERATIONS / TODAY', description: 'A clear view of marketplace health and the work that needs attention.' },
  '/admin/candidates': { title: 'Candidates', eyebrow: 'MARKETPLACE / PEOPLE', description: 'Candidate directory · personal details remain masked by default.' },
  '/admin/employers': { title: 'Employers', eyebrow: 'MARKETPLACE / ACCOUNTS', description: 'Review company accounts, verification and employer standing.' },
  '/admin/jobs': { title: 'Jobs', eyebrow: 'MARKETPLACE / MODERATION', description: 'Keep listings accurate, safe and useful for candidates.' },
  '/admin/applications': { title: 'Applications', eyebrow: 'MARKETPLACE / OVERSIGHT', description: 'Application oversight for the two-sided marketplace.' },
  '/admin/interviews': { title: 'Interviews', eyebrow: 'MARKETPLACE / SCHEDULING', description: 'Track interview coordination, status and candidate scheduling across employers.' },
  '/admin/master-data': { title: 'Master data', eyebrow: 'PLATFORM / TAXONOMY', description: 'Manage the shared categories that keep marketplace data consistent.' },
  '/admin/content': { title: 'Content', eyebrow: 'PLATFORM / CONTENT', description: 'Manage CMS content and transactional email templates.' },
  '/admin/resume-pro': { title: 'Resume Pro', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: 'Operate templates, plans, subscriptions and refund workflows.' },
  '/admin/employer-billing': { title: 'Employer billing', eyebrow: 'MONETIZATION / ACCOUNTS', description: 'Manage employer subscription tiers, job packages, invoices and credits.' },
  '/admin/communication': { title: 'Communication', eyebrow: 'PLATFORM / DELIVERY', description: 'Coordinate alerts and broadcasts, then monitor delivery.' },
  '/admin/messaging': { title: 'Messaging', eyebrow: 'PLATFORM / OVERSIGHT', description: 'Monitor communication threads, flagged messages and user interaction safety.' },
  '/admin/trust-safety': { title: 'Trust & safety', eyebrow: 'PROTECTION / CASEWORK', description: 'Review reports, blacklist records and fraud signals.' },
  '/admin/support': { title: 'Support', eyebrow: 'CUSTOMER CARE / QUEUE', description: 'Keep candidate and employer support requests moving.' },
  '/admin/recommendations': { title: 'Recommendations', eyebrow: 'INTELLIGENCE / MATCHING', description: 'Monitor and tune matching algorithms, recommendation quality and scoring.' },
  '/admin/analytics': { title: 'Analytics', eyebrow: 'INTELLIGENCE / REPORTS', description: 'Growth, funnel, search and revenue reporting.' },
  '/admin/settings': { title: 'Settings', eyebrow: 'PLATFORM / GOVERNANCE', description: 'Platform controls, role access, compliance and audit history.' },
  '/login': { title: 'Admin Console Sign In', eyebrow: 'SECURITY GATEWAY', description: 'Internal administrative access gateway.' },
  '/admin-login': { title: 'Admin Console Sign In', eyebrow: 'SECURITY GATEWAY', description: 'Internal administrative access gateway.' },
  '/admin/profile': { title: 'Admin Profile & Security', eyebrow: 'PLATFORM / GOVERNANCE', description: 'Manage administrator credentials, persona allocations, and review platform audit trails.' },
  '/admin-profile': { title: 'Admin Profile & Security', eyebrow: 'PLATFORM / GOVERNANCE', description: 'Manage administrator credentials, persona allocations, and review platform audit trails.' },
  '/admin/talent-network': { title: 'Talent Network', eyebrow: 'EXTERNAL PORTALS / TALENT NETWORK', description: 'Configure candidate discovery, public visibility, and verified hiring partner access.' },
  '/admin/salary-benchmark': { title: 'Salary Benchmark', eyebrow: 'DATA PRODUCTS / BENCHMARKS', description: 'Govern compensation percentiles, regional salary brackets, and public salary transparency tools.' },
  '/admin/interview-prep': { title: 'Interview Prep Builder', eyebrow: 'INTERVIEWS / CURRICULUM', description: 'Build structured interview preparation curricula, learning modules, and technical challenges.' },
  '/admin/ai-cover-letter': { title: 'AI Cover Letter Fine-Tuner', eyebrow: 'AI ENGINE / PRO BOOSTER', description: 'Configure system directives, dynamic context variables, tone, and quality rules for the Cover Letter Generator.' },
  // Backward compatibility keys:
  '/': { title: 'Dashboard', eyebrow: 'OPERATIONS / TODAY', description: 'A clear view of marketplace health and the work that needs attention.' },
  '/candidates': { title: 'Candidates', eyebrow: 'MARKETPLACE / PEOPLE', description: 'Candidate directory · personal details remain masked by default.' },
  '/employers': { title: 'Employers', eyebrow: 'MARKETPLACE / ACCOUNTS', description: 'Review company accounts, verification and employer standing.' },
  '/jobs': { title: 'Jobs', eyebrow: 'MARKETPLACE / MODERATION', description: 'Keep listings accurate, safe and useful for candidates.' },
  '/applications': { title: 'Applications', eyebrow: 'MARKETPLACE / OVERSIGHT', description: 'Application oversight for the two-sided marketplace.' },
  '/interviews': { title: 'Interviews', eyebrow: 'MARKETPLACE / SCHEDULING', description: 'Track interview coordination, status and candidate scheduling across employers.' },
  '/master-data': { title: 'Master data', eyebrow: 'PLATFORM / TAXONOMY', description: 'Manage the shared categories that keep marketplace data consistent.' },
  '/content': { title: 'Content', eyebrow: 'PLATFORM / CONTENT', description: 'Manage CMS content and transactional email templates.' },
  '/resume-pro': { title: 'Resume Pro', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: 'Operate templates, plans, subscriptions and refund workflows.' },
  '/employer-billing': { title: 'Employer billing', eyebrow: 'MONETIZATION / ACCOUNTS', description: 'Manage employer subscription tiers, job packages, invoices and credits.' },
  '/communication': { title: 'Communication', eyebrow: 'PLATFORM / DELIVERY', description: 'Coordinate alerts and broadcasts, then monitor delivery.' },
  '/messaging': { title: 'Messaging', eyebrow: 'PLATFORM / OVERSIGHT', description: 'Monitor communication threads, flagged messages and user interaction safety.' },
  '/trust-safety': { title: 'Trust & safety', eyebrow: 'PROTECTION / CASEWORK', description: 'Review reports, blacklist records and fraud signals.' },
  '/support': { title: 'Support', eyebrow: 'CUSTOMER CARE / QUEUE', description: 'Keep candidate and employer support requests moving.' },
  '/recommendations': { title: 'Recommendations', eyebrow: 'INTELLIGENCE / MATCHING', description: 'Monitor and tune matching algorithms, recommendation quality and scoring.' },
  '/analytics': { title: 'Analytics', eyebrow: 'INTELLIGENCE / REPORTS', description: 'Growth, funnel, search and revenue reporting.' },
  '/settings': { title: 'Settings', eyebrow: 'PLATFORM / GOVERNANCE', description: 'Platform controls, role access, compliance and audit history.' },
  '/talent-network': { title: 'Talent Network', eyebrow: 'EXTERNAL PORTALS / TALENT NETWORK', description: 'Configure candidate discovery, public visibility, and verified hiring partner access.' },
  '/salary-benchmark': { title: 'Salary Benchmark', eyebrow: 'DATA PRODUCTS / BENCHMARKS', description: 'Govern compensation percentiles, regional salary brackets, and public salary transparency tools.' },
  '/interview-prep': { title: 'Interview Prep Builder', eyebrow: 'INTERVIEWS / CURRICULUM', description: 'Build structured interview preparation curricula, learning modules, and technical challenges.' },
  '/ai-cover-letter': { title: 'AI Cover Letter Fine-Tuner', eyebrow: 'AI ENGINE / PRO BOOSTER', description: 'Configure system directives, dynamic context variables, tone, and quality rules for the Cover Letter Generator.' },
};

export const ROUTE_TO_RBAC_MODULE: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin': 'Dashboard',
  '/admin/candidates': 'Candidates',
  '/admin/employers': 'Employers',
  '/admin/jobs': 'Jobs',
  '/admin/applications': 'Applications',
  '/admin/interviews': 'Interviews',
  '/admin/master-data': 'Master Data',
  '/admin/content': 'CMS / Content',
  '/admin/resume-pro': 'Resume Pro',
  '/admin/talent-network': 'Talent Network',
  '/admin/employer-billing': 'Employer Billing',
  '/admin/communication': 'Communication',
  '/admin/messaging': 'Messaging',
  '/admin/trust-safety': 'Trust & Safety',
  '/admin/support': 'Support',
  '/admin/salary-benchmark': 'Salary Benchmark',
  '/admin/ai-cover-letter': 'AI Cover Letter',
  '/admin/interview-prep': 'Interview Prep',
  '/admin/recommendations': 'Recommendations',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
  '/admin/profile': 'Admin Profile',
  // Backward compatibility keys:
  '/': 'Dashboard',
  '/candidates': 'Candidates',
  '/employers': 'Employers',
  '/jobs': 'Jobs',
  '/applications': 'Applications',
  '/interviews': 'Interviews',
  '/master-data': 'Master Data',
  '/content': 'CMS / Content',
  '/resume-pro': 'Resume Pro',
  '/talent-network': 'Talent Network',
  '/employer-billing': 'Employer Billing',
  '/communication': 'Communication',
  '/messaging': 'Messaging',
  '/trust-safety': 'Trust & Safety',
  '/support': 'Support',
  '/salary-benchmark': 'Salary Benchmark',
  '/ai-cover-letter': 'AI Cover Letter',
  '/interview-prep': 'Interview Prep',
  '/recommendations': 'Recommendations',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/admin-profile': 'Admin Profile',
};

export function getPermissionForPath(roleName: string, path: string): RbacPermissionLevel {
  if (roleName === 'Super Admin') return 'Full';

  let base = path;
  if (base.startsWith('/admin')) {
    const parts = base.split('/').filter(Boolean);
    if (parts.length <= 1) {
      base = '/admin/dashboard';
    } else {
      base = `/admin/${parts[1]}`;
    }
  } else if (base !== '/' && base.includes('/', 1)) {
    base = '/' + base.split('/')[1];
  }
  const moduleName = ROUTE_TO_RBAC_MODULE[base];
  if (!moduleName) return 'Full';

  const row = initialAdminRbacMatrix.find((r) => r.moduleName === moduleName);
  if (!row) return 'Full';

  return row.permissions[roleName] || 'None';
}

function AccessRestricted({
  roleName,
  path,
  onSwitchRole,
}: {
  roleName: string;
  path: string;
  onSwitchRole: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-inner">
        <LockKeyhole size={30} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Access Restricted &bull; RBAC Preview Active (XMOD-2)
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 tracking-tight">
          Module Restricted for {roleName}
        </h2>
        <p className="text-xs text-muted-foreground mt-2.5 max-w-md mx-auto leading-relaxed">
          The selected administrative persona (<strong>{roleName}</strong>) does not have access permissions for <code className="font-mono text-foreground bg-muted/60 px-1.5 py-0.5 rounded">{path}</code> under the platform governance matrix.
        </p>
      </div>
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          &larr; Return to Dashboard
        </button>
        <button
          type="button"
          data-testid="btn-restricted-switch-role"
          onClick={onSwitchRole}
          className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
        >
          Switch Administrative Persona &rarr;
        </button>
      </div>
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on every route change so content never appears scrolled under the header
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<AdminRoleConfig>(
    ADMIN_ROLES.find((r) => r.id === 'operations-admin') || ADMIN_ROLES[0]
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [roleToast, setRoleToast] = useState<string | null>(null);

  // Authentication & Session State
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(() => {
    return !!getAuthToken();
  });

  // Session restoration from verified backend token on mount
  useEffect(() => {
    let isMounted = true;

    async function restoreAdminSession() {
      const token = getAuthToken();
      if (!token) {
        setIsAdminAuth(false);
        setIsAuthChecking(false);
        return;
      }

      try {
        const data = await getCurrentAdmin();
        if (!isMounted) return;

        if (data && data.success && data.admin) {
          setIsAdminAuth(true);
          const roleKey = data.admin.role;
          const match = ADMIN_ROLES.find((r) => r.id === roleKey || r.name === roleKey);
          if (match) {
            setActiveRole(match);
          }
          setAuthSession(token, {
            id: data.admin.id,
            name: data.admin.name,
            email: data.admin.email,
            role: match ? match.name : roleKey,
          });
        } else {
          clearAuthSession();
          setIsAdminAuth(false);
        }
      } catch {
        if (!isMounted) return;
        clearAuthSession();
        setIsAdminAuth(false);
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    }

    restoreAdminSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // AUTH-7: Safe Read-Only "View as User" State
  const [viewingUser, setViewingUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'Candidate' | 'Employer';
  } | null>(null);
  const [viewAsUserStartTime, setViewAsUserStartTime] = useState<string | null>(null);
  const [isSelectUserModalOpen, setIsSelectUserModalOpen] = useState(false);
  const [isConfirmViewAsUserModalOpen, setIsConfirmViewAsUserModalOpen] = useState(false);
  const [pendingUserToPreview, setPendingUserToPreview] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'Candidate' | 'Employer';
  } | null>(null);
  const [previewJustification, setPreviewJustification] = useState('');
  const [justificationError, setJustificationError] = useState<string | null>(null);

  // Listen for view-as-user events from CandidateDetail, EmployerDetail, etc.
  useEffect(() => {
    const handleViewAsUserEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        id: string;
        name: string;
        email: string;
        role: 'Candidate' | 'Employer';
      }>;
      if (customEvent.detail) {
        setPendingUserToPreview(customEvent.detail);
        setPreviewJustification('');
        setJustificationError(null);
        setIsConfirmViewAsUserModalOpen(true);
      }
    };
    window.addEventListener('jobrisers-view-as-user', handleViewAsUserEvent);
    return () => window.removeEventListener('jobrisers-view-as-user', handleViewAsUserEvent);
  }, []);

  const handleStartViewAsUser = (target: {
    id: string;
    name: string;
    email: string;
    role: 'Candidate' | 'Employer';
  }) => {
    setPendingUserToPreview(target);
    setPreviewJustification('');
    setJustificationError(null);
    setIsSelectUserModalOpen(false);
    setIsConfirmViewAsUserModalOpen(true);
  };

  const handleConfirmStartViewAsUser = () => {
    if (!pendingUserToPreview) return;
    const trimmed = previewJustification.trim();
    if (!trimmed || trimmed.length < 8) {
      setJustificationError('A valid administrative reason (minimum 8 characters) is required under DPDP Act 2023.');
      return;
    }

    const newAuditLog: AdminViewAsUserAuditLog = {
      id: `vau-${Date.now()}`,
      adminName: 'Sourabh Jhajharia',
      adminRole: activeRole.name,
      targetUserId: pendingUserToPreview.id,
      targetUserName: pendingUserToPreview.name,
      targetUserRole: pendingUserToPreview.role,
      startTime: 'Just now',
      endTime: 'In progress',
      reason: trimmed,
      ipAddress: '14.143.32.90',
    };
    initialAdminViewAsUserAuditLogs.unshift(newAuditLog);

    setViewingUser(pendingUserToPreview);
    setViewAsUserStartTime('Just now');
    setIsConfirmViewAsUserModalOpen(false);
    setPendingUserToPreview(null);
    setRoleToast(`Started Safe Read-Only Preview as ${pendingUserToPreview.name}. Destructive actions are blocked.`);
  };

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dismiss toast after 3.5s
  useEffect(() => {
    if (roleToast) {
      const timer = setTimeout(() => setRoleToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [roleToast]);

  // XMOD-1: Universal Global Search across Candidates, Employers, Jobs, Applications
  const searchQuery = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];

    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Candidate' | 'Employer' | 'Job' | 'Application';
      path: string;
      meta?: string;
    }> = [];

    const match = (val?: string) => Boolean(val && typeof val === 'string' && val.toLowerCase().includes(searchQuery));

    // 1. Candidates (PII Protected: only masked identifier/metadata shown)
    for (const c of adminCandidates) {
      if (match(c.name) || match(c.headline) || match(c.location) || match(c.id)) {
        list.push({
          id: c.id,
          title: c.name || 'Candidate',
          subtitle: `${c.headline || 'Profile'} · ${c.location || 'India'}`,
          category: 'Candidate',
          path: `/admin/candidates/${c.id}`,
          meta: `Status: ${c.status || 'Active'}`,
        });
        if (list.length >= 10) break;
      }
    }

    // 2. Employers
    for (const e of adminEmployers) {
      if (match(e.company) || match(e.name) || match(e.location) || match(e.industry) || match(e.id)) {
        list.push({
          id: e.id,
          title: e.company || e.name || 'Company',
          subtitle: `${e.industry || 'Technology'} · ${e.location || 'India'}`,
          category: 'Employer',
          path: `/admin/employers/${e.id}`,
          meta: `Verification: ${e.verification || 'Verified'}`,
        });
        if (list.length >= 20) break;
      }
    }

    // 3. Jobs
    for (const j of adminJobs) {
      if (match(j.title) || match(j.company) || match(j.location) || match(j.id)) {
        list.push({
          id: j.id,
          title: j.title || 'Job Listing',
          subtitle: `${j.company || 'JobRisers Partner'} · ${j.location || 'Remote'}`,
          category: 'Job',
          path: `/admin/jobs/${j.id}`,
          meta: `Status: ${j.status || 'Active'}`,
        });
        if (list.length >= 30) break;
      }
    }

    // 4. Applications
    for (const a of adminApplications) {
      if (match(a.candidateName) || match(a.roleTitle) || match(a.companyName) || match(a.id)) {
        list.push({
          id: a.id,
          title: `${a.candidateName || 'Candidate'} → ${a.roleTitle || 'Role'}`,
          subtitle: `${a.companyName || 'Company'} · Stage: ${a.stage || 'Applied'}`,
          category: 'Application',
          path: `/admin/applications/${a.id}`,
          meta: `Score: ${a.screeningScore || a.resume?.atsScore || 'N/A'}%`,
        });
        if (list.length >= 40) break;
      }
    }

    return list;
  }, [searchQuery]);

  const getPageMeta = (pathname: string) => {
    if (pageMeta[pathname]) return pageMeta[pathname];
    if (pathname.startsWith('/admin/candidates/') || pathname.startsWith('/candidates/')) {
      return { title: 'Candidate Profile', eyebrow: 'MARKETPLACE / PEOPLE', description: 'Comprehensive candidate record, verification status, and application history.' };
    }
    if (pathname.startsWith('/admin/employers/') || pathname.startsWith('/employers/')) {
      return { title: 'Employer Account', eyebrow: 'MARKETPLACE / ACCOUNTS', description: 'Employer company profile, verification standing, posted jobs, and billing.' };
    }
    if (pathname.startsWith('/admin/jobs/') || pathname.startsWith('/jobs/')) {
      return { title: 'Job Listing Detail', eyebrow: 'MARKETPLACE / MODERATION', description: 'Review job requirements, compensation, moderation status, and applicant flow.' };
    }
    if (pathname.startsWith('/admin/applications/') || pathname.startsWith('/applications/')) {
      return { title: 'Application Detail', eyebrow: 'MARKETPLACE / OVERSIGHT', description: 'Candidate application details, screening responses, resume, and ATS pipeline stage.' };
    }
    if (pathname.startsWith('/admin/support/') || pathname.startsWith('/support/')) {
      return { title: 'Support Ticket Detail', eyebrow: 'CUSTOMER CARE / QUEUE', description: 'Review support inquiry thread, requester information, and customer care resolution.' };
    }
    if (pathname.startsWith('/admin/interviews/disputes/')) {
      return { title: 'Interview Dispute Casework', eyebrow: 'ESCALATIONS / DISPUTES', description: 'Mediate interview no-show and quality disputes, with refund authorization.' };
    }
    if (pathname.startsWith('/admin/interviews/')) {
      return { title: 'Interview Details', eyebrow: 'MARKETPLACE / SCHEDULING', description: 'Review interview logistics, meeting room, and candidate coordination.' };
    }
    if (pathname.startsWith('/admin/communication/alerts/new')) {
      return { title: 'Create Job Alert Query', eyebrow: 'PLATFORM / DELIVERY', description: 'Simulate candidate search queries, delivery channels, and automated dispatch cadence.' };
    }
    if (pathname.startsWith('/admin/communication/alerts/')) {
      return { title: 'Job Alert Details', eyebrow: 'PLATFORM / DELIVERY', description: 'Inspect alert parameters, transport channels, subscriber volume, and health metrics.' };
    }
    if (pathname.startsWith('/admin/communication/broadcasts/new')) {
      return { title: 'Compose Broadcast Campaign', eyebrow: 'PLATFORM / DELIVERY', description: 'Draft announcements, configure target audience segments, and schedule cross-channel dispatch.' };
    }
    if (pathname.startsWith('/admin/communication/broadcasts/')) {
      return { title: 'Broadcast Campaign Telemetry', eyebrow: 'PLATFORM / DELIVERY', description: 'Multi-channel broadcast delivery logs, open rate analytics, and campaign metrics.' };
    }
    if (pathname.startsWith('/admin/communication/triggers/')) {
      return { title: 'Configure Notification Trigger', eyebrow: 'PLATFORM / DELIVERY', description: 'Event-driven trigger rules, priority routing, rate limits, and template variable mapping.' };
    }
    if (pathname === '/admin/master-data/categories/new') {
      return { title: 'Add Category', eyebrow: 'PLATFORM / TAXONOMY', description: 'Create category naming, slug identifier, color swatch, and active marketplace status.' };
    }
    if (pathname.startsWith('/admin/master-data/categories/')) {
      return { title: 'Edit Category', eyebrow: 'PLATFORM / TAXONOMY', description: 'Configure category naming, slug identifier, color swatch, and active marketplace status.' };
    }
    if (pathname === '/admin/master-data/roles/new') {
      return { title: 'Add Role', eyebrow: 'PLATFORM / TAXONOMY', description: 'Configure job title, parent category taxonomy mapping, and onboarding inclusion.' };
    }
    if (pathname.startsWith('/admin/master-data/roles/')) {
      return { title: 'Edit Role', eyebrow: 'PLATFORM / TAXONOMY', description: 'Configure job title, parent category taxonomy mapping, and onboarding inclusion.' };
    }
    if (pathname === '/admin/master-data/skills/new') {
      return { title: 'Add Skill', eyebrow: 'PLATFORM / TAXONOMY', description: 'Maintain standardized skill names, synonym aliases, and approval status.' };
    }
    if (pathname.startsWith('/admin/master-data/skills/')) {
      return { title: 'Edit Skill', eyebrow: 'PLATFORM / TAXONOMY', description: 'Maintain standardized skill names, synonym aliases, and approval status.' };
    }
    if (pathname === '/admin/master-data/industries/new') {
      return { title: 'Add Industry', eyebrow: 'PLATFORM / TAXONOMY', description: 'Standard industry sector taxonomy mapped to employer accounts.' };
    }
    if (pathname.startsWith('/admin/master-data/industries/')) {
      return { title: 'Edit Industry', eyebrow: 'PLATFORM / TAXONOMY', description: 'Standard industry sector taxonomy mapped to employer accounts.' };
    }
    if (pathname === '/admin/master-data/locations/new') {
      return { title: 'Add Location', eyebrow: 'PLATFORM / TAXONOMY', description: 'Hub cities, state regions, active toggles, and live jobs mapped across metro centers.' };
    }
    if (pathname.startsWith('/admin/master-data/locations/')) {
      return { title: 'Edit Location', eyebrow: 'PLATFORM / TAXONOMY', description: 'Hub cities, state regions, active toggles, and live jobs mapped across metro centers.' };
    }
    if (pathname.startsWith('/admin/master-data/salary-buckets/')) {
      return { title: 'Edit Salary Bucket', eyebrow: 'PLATFORM / TAXONOMY', description: 'Salary range intervals and contiguity validators.' };
    }
    if (pathname === '/admin/master-data/benefits/new') {
      return { title: 'Add Benefit', eyebrow: 'PLATFORM / TAXONOMY', description: 'Standard benefit perks available to employers when creating job postings.' };
    }
    if (pathname.startsWith('/admin/master-data/benefits/')) {
      return { title: 'Edit Benefit', eyebrow: 'PLATFORM / TAXONOMY', description: 'Standard benefit perks available to employers when creating job postings.' };
    }
    if (pathname === '/admin/content/articles/new') {
      return { title: 'Write New Article', eyebrow: 'PLATFORM / CONTENT', description: 'Draft career guides, technical interview strategies, and SEO metadata.' };
    }
    if (pathname.startsWith('/admin/content/articles/')) {
      return { title: 'Edit Article', eyebrow: 'PLATFORM / CONTENT', description: 'Draft career guides, technical interview strategies, and SEO metadata.' };
    }
    if (pathname === '/admin/content/policies/new') {
      return { title: 'Add Legal Page', eyebrow: 'PLATFORM / CONTENT', description: 'Version-tracked legal agreements, privacy charters, and user re-consent triggers.' };
    }
    if (pathname.startsWith('/admin/content/policies/')) {
      return { title: 'Edit Legal Policy', eyebrow: 'PLATFORM / CONTENT', description: 'Version-tracked legal agreements, privacy charters, and user re-consent triggers.' };
    }
    if (pathname === '/admin/resume-pro/templates/new') {
      return { title: 'Add Resume Template', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: 'Configure typographic tone, layout structure, and ATS compliance badges.' };
    }
    if (pathname.startsWith('/admin/resume-pro/templates/')) {
      return { title: 'Edit Resume Template', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: 'Configure typographic tone, layout structure, and ATS compliance badges.' };
    }
    if (pathname.startsWith('/admin/resume-pro/plans/')) {
      return { title: 'Edit Subscription Plan', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: 'Pricing tiers, quotas, refund guarantees, and search boost entitlements.' };
    }
    if (pathname.startsWith('/admin/resume-pro/subscriptions/')) {
      return { title: 'Manage Subscription', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: 'Subscriber lifecycle, feature overrides, and recruiter spotlight controls.' };
    }
    if (pathname.startsWith('/admin/resume-pro/refunds/')) {
      return { title: 'Refund Casework', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: '7-day money-back guarantee eligibility and approval workflows.' };
    }
    if (pathname.startsWith('/admin/employer-billing/tiers/')) {
      return { title: 'Edit Employer Tier', eyebrow: 'MONETIZATION / ACCOUNTS', description: 'Configure job limits, featured credits, pricing, and recruiter tool access.' };
    }
    if (pathname.startsWith('/admin/employer-billing/invoices/')) {
      return { title: 'GST Tax Invoice', eyebrow: 'MONETIZATION / ACCOUNTS', description: 'Compliant tax invoice with employer GSTIN and itemized 18% GST tax summary.' };
    }
    if (pathname === '/admin/employer-billing/adjustments/new' || pathname === '/admin/employer-billing/credits/new') {
      return { title: 'Issue Goodwill Credit', eyebrow: 'MONETIZATION / ACCOUNTS', description: 'Allocate job posting or featured spotlight credits directly to an employer.' };
    }
    if (pathname.startsWith('/admin/trust-safety/reports/')) {
      return { title: 'Incident Casework', eyebrow: 'PROTECTION / CASEWORK', description: 'Safety incident investigation, evidence evaluation, and enforcement actions.' };
    }
    if (pathname === '/admin/trust-safety/blacklist/new') {
      return { title: 'Add Blacklist Rule', eyebrow: 'PROTECTION / CASEWORK', description: 'Real-time domain, VoIP, IP/CIDR, and keyword threat filtering.' };
    }
    if (pathname.startsWith('/admin/trust-safety/blacklist/')) {
      return { title: 'Edit Blacklist Rule', eyebrow: 'PROTECTION / CASEWORK', description: 'Real-time domain, VoIP, IP/CIDR, and keyword threat filtering.' };
    }
    return pageMeta['/admin/dashboard'] || pageMeta['/admin'] || pageMeta['/'];
  };

  const current = getPageMeta(location.pathname);
  const activeLink = navGroups.flatMap((group) => group.links).find((item) => {
    if (item.href === '/admin/dashboard') return location.pathname === '/admin/dashboard' || location.pathname === '/admin' || location.pathname === '/';
    return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  });
  const activeGroup = activeLink?.name ?? 'Dashboard';

  // Dynamic RBAC Filtered Navigation: only show modules permitted for current role
  const filteredNavGroups = useMemo(() => {
    return navGroups
      .map((group) => {
        const links = group.links.filter((link) => {
          const perm = getPermissionForPath(activeRole.name, link.href);
          return perm !== 'None';
        });
        return { ...group, links };
      })
      .filter((group) => group.links.length > 0);
  }, [activeRole.name]);

  // Loading state while verifying backend session
  if (isAuthChecking) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background text-muted-foreground text-xs font-medium">
        <div className="flex items-center gap-2.5">
          <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <span>Verifying administrative session...</span>
        </div>
      </div>
    );
  }

  // Dedicated Clean Admin Login Page View (without dashboard shell)
  if (location.pathname === '/admin-login') {
    return (
      <LoginPage
        onLoginSuccess={(email, role) => {
          setIsAdminAuth(true);
          const match = ADMIN_ROLES.find((r) => r.name === role || r.id === role);
          if (match) {
            setActiveRole(match);
          }
          setRoleToast(`Signed in as ${role} (${email}).`);
        }}
      />
    );
  }

  // Compatibility redirect: /login redirects to canonical /admin-login
  if (location.pathname === '/login') {
    return <Navigate to="/admin-login" replace />;
  }

  // Redirect to admin login if unauthenticated
  if (!isAdminAuth) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      {/* AUTH-7: Persistent Safe Read-Only Preview Banner */}
      {viewingUser && (
        <div
          data-testid="banner-viewing-as-user"
          className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/40 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 py-2.5 text-xs text-white font-medium shadow-md"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <ShieldAlert size={16} className="text-amber-950 shrink-0" />
            <span className="font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-100 text-[10px]">
              READ-ONLY PREVIEW (AUTH-7)
            </span>
            <span className="text-white font-semibold">
              Viewing as <strong className="underline underline-offset-2">{viewingUser.name}</strong> ({viewingUser.role} &bull; {viewingUser.email})
            </span>
            <span className="text-amber-100/90 text-[11px]">
              &bull; Started {viewAsUserStartTime || 'moments ago'} &bull; Destructive & State-Changing Actions Blocked
            </span>
          </div>
          <button
            type="button"
            data-testid="btn-exit-view-as-user"
            onClick={() => {
              const userName = viewingUser.name;
              setViewingUser(null);
              setViewAsUserStartTime(null);
              setRoleToast(`Exited read-only preview for ${userName}. Returned to administrative console.`);
            }}
            className="rounded-lg bg-amber-950 px-3 py-1 text-xs font-bold text-amber-100 hover:bg-black transition-colors shadow-xs cursor-pointer"
          >
            Exit Preview
          </button>
        </div>
      )}

      {mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[78px] items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><span className="font-display text-lg font-extrabold">J</span></div>
          <div className="leading-tight">
            <div className="font-display text-[17px] font-extrabold tracking-[-.04em] text-foreground">jobrisers</div>
            <div className="mt-1 text-[9px] font-bold tracking-[.18em] text-muted-foreground">ADMIN CONSOLE</div>
          </div>
          <button onClick={() => setMobileNav(false)} aria-label="Close navigation" className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-accent lg:hidden"><X size={18} /></button>
        </div>
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 pb-5 pt-5">
          {filteredNavGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[9px] font-bold tracking-[.16em] text-muted-foreground/80">{group.label}</p>
              <div className="space-y-1">
                {group.links.map(({ name, href, icon: Icon }) => {
                  const selected = href === '/admin/dashboard'
                    ? location.pathname === '/admin/dashboard' || location.pathname === '/admin' || location.pathname === '/'
                    : location.pathname === href || location.pathname.startsWith(href + '/');
                  return (
                    <Link
                      key={href}
                      to={href}
                      data-testid={`link-nav-${name.toLowerCase().replaceAll(' ', '-')}`}
                      aria-current={selected ? 'page' : undefined}
                      onClick={() => setMobileNav(false)}
                      className={`group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-primary shadow-sm' : 'text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-foreground'}`}
                    >
                      <Icon size={17} strokeWidth={selected ? 2.2 : 1.8} /><span>{name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* XMOD-2: Active Admin Role in Sidebar */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <div className="rounded-xl border border-sidebar-border bg-white/45 p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2"><Shield size={14} className="text-primary" /> Internal workspace</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Preview</span>
            </div>
            <div className="mt-1 pl-[22px] text-[10px] text-muted-foreground">Marketplace operations</div>
          </div>
          
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(true)}
            data-testid="text-admin-role"
            title="Click to preview different admin roles (XMOD-2)"
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-sidebar-accent/60 transition-colors border border-transparent hover:border-sidebar-border group"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activeRole.bg} text-[11px] font-bold ${activeRole.text} shadow-sm shrink-0`}>
              {activeRole.short}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{activeRole.name}</span>
                <ChevronDown size={12} className="text-muted-foreground group-hover:text-foreground shrink-0" />
              </div>
              <div className="text-[10px] text-muted-foreground truncate">{activeRole.description}</div>
            </div>
          </button>
        </div>
      </aside>

      <div className="min-h-[100dvh] lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center gap-2.5 sm:gap-3 border-b border-border/80 bg-background/95 px-3 sm:px-7 lg:px-10 backdrop-blur-md">
          <button className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={19} /></button>
          <div className="hidden min-w-0 items-center gap-2 text-[12px] text-muted-foreground lg:flex"><span>Admin</span><ChevronRight size={13} /><span className="font-semibold text-foreground">{activeGroup}</span></div>
          
          {/* XMOD-1: Universal Global Search Container */}
          <div ref={searchContainerRef} className="relative ml-auto min-w-0 flex-1 max-w-[420px]">
            <Search size={16} className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground shrink-0" />
            <input
              aria-label="Search current directory or global entities"
              data-testid="input-global-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search candidates, employers, jobs, applications…"
              className="h-9 sm:h-10 w-full min-w-0 rounded-xl border border-border bg-card pl-8 sm:pl-9 pr-8 sm:pr-9 text-[11px] sm:text-[12px] outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

            {/* XMOD-1 Global Search Results Surface */}
            {isSearchOpen && searchQuery.length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-3.5 py-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  <span>Global Search Results</span>
                  <span>{searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    <AlertCircle size={24} className="mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-medium text-foreground">No matching records found</p>
                    <p className="mt-1 text-[11px]">No matches across Candidates, Employers, Jobs, or Applications.</p>
                  </div>
                ) : (
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50">
                    {searchResults.map((item) => {
                      const categoryBadgeColor =
                        item.category === 'Candidate'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : item.category === 'Employer'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : item.category === 'Job'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200';

                      return (
                        <button
                          key={`${item.category}-${item.id}`}
                          type="button"
                          onClick={() => {
                            navigate(item.path);
                            setIsSearchOpen(false);
                          }}
                          className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-muted/60 transition-colors group"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${categoryBadgeColor} shrink-0 uppercase tracking-wider`}>
                                {item.category}
                              </span>
                              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {item.title}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
                              {item.subtitle}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {item.meta && (
                              <div className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                                {item.meta}
                              </div>
                            )}
                            <div className="text-[9px] font-mono text-muted-foreground/70 mt-0.5">
                              {item.id}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="border-t border-border/80 bg-muted/30 px-3.5 py-1.5 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Press ESC to close</span>
                  <span className="font-semibold text-primary">Direct Entity Routing</span>
                </div>
              </div>
            )}
          </div>

          <span className="hidden whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold tracking-wide text-amber-800 sm:inline-flex">SAMPLE DATA</span>
          <Link aria-label="Open communication workspace" title="Open communication workspace" data-testid="link-notifications" to="/admin/communication" className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-accent hover:text-primary"><Bell size={17} /></Link>
          
          {/* Unified Admin Profile & Governance Menu Trigger */}
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              aria-label="Admin Profile and Governance Menu"
              data-testid="btn-admin-profile-menu"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-accent/60 border border-transparent hover:border-border cursor-pointer"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activeRole.bg} text-[11px] font-bold ${activeRole.text} shadow-sm shrink-0`}>
                {activeRole.short}
              </div>
              <div className="hidden sm:block leading-tight text-left pr-1">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>Sourabh J.</span>
                  <ChevronDown size={12} className="text-muted-foreground" />
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className="font-semibold text-primary">{activeRole.name}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.1 rounded border border-primary/20 bg-primary/10">PREVIEW</span>
                </div>
              </div>
            </button>

            {/* Unified Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl z-50 p-2.5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Identity Header Card */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/80">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activeRole.bg} text-xs font-bold ${activeRole.text} shadow-sm shrink-0`}>
                    SJ
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-foreground truncate">Sourabh Jhajharia</div>
                    <div className="text-[11px] text-muted-foreground truncate">sourabh@jobrisers.com</div>
                    <div className="text-[9px] font-bold text-primary mt-0.5">{activeRole.name} &bull; Staff ID: JR-EXEC-0042</div>
                  </div>
                </div>

                {/* Navigation Actions */}
                <div className="space-y-1">
                  <Link
                    to="/admin/profile"
                    data-testid="link-menu-admin-profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <UserCheck size={15} className="text-primary" />
                      <span>Admin Profile & Settings</span>
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </Link>

                  <button
                    type="button"
                    data-testid="btn-menu-view-as-user"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsSelectUserModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-muted/70 transition-colors text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Eye size={15} className="text-amber-600" />
                      <span>View as User (AUTH-7)</span>
                    </span>
                    <span className="text-[9px] font-bold bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded">Safe Preview</span>
                  </button>
                </div>

                {/* RBAC Persona Preview Section */}
                <div className="border-t border-border/80 pt-2">
                  <div className="px-2 pb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Switch Preview Role (XMOD-2)</span>
                    <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded">7 Roles</span>
                  </div>
                  <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                    {ADMIN_ROLES.map((role) => {
                      const isCurrent = activeRole.id === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setActiveRole(role);
                            setIsProfileMenuOpen(false);
                            setRoleToast(`Switched active preview role to ${role.name}. UI permissions updated.`);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-primary/10 border border-primary/20 text-foreground font-bold'
                              : 'hover:bg-muted/70 text-foreground/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${role.bg} text-[10px] font-bold ${role.text} shrink-0`}>
                              {role.short}
                            </div>
                            <div className="truncate">
                              <div className="font-semibold text-foreground text-xs">{role.name}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{role.description}</div>
                            </div>
                          </div>
                          {isCurrent && <Check size={14} className="text-primary font-bold shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logout Divider & Action */}
                <div className="border-t border-border/80 pt-1.5">
                  <button
                    type="button"
                    data-testid="btn-admin-logout"
                    onClick={() => {
                      clearAuthSession();
                      setIsAdminAuth(false);
                      setIsProfileMenuOpen(false);
                      navigate('/admin-login');
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out of Console</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Floating Role Switch Toast */}
        {roleToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3 shadow-2xl text-xs animate-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span className="font-semibold text-foreground">{roleToast}</span>
            <button onClick={() => setRoleToast(null)} className="ml-2 text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
        )}
        <main className="mx-auto max-w-[1600px] px-4 pb-12 pt-10 sm:px-7 sm:pt-11 lg:px-10 lg:pt-12">
          <div className="mb-7">
            <div className="mb-2 text-[9px] font-bold tracking-[.18em] text-primary">{current.eyebrow}</div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><h1 className="font-display text-[30px] font-extrabold leading-tight tracking-[-.045em] text-foreground sm:text-[34px]">{current.title}</h1><p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{current.description}</p></div>
              {(location.pathname === '/admin/dashboard' || location.pathname === '/admin' || location.pathname === '/') && <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground"><Clock3 size={14} /> Updated moments ago</div>}
            </div>
          </div>
          <div className="app-enter">
            {/* RBAC Route Guard: If role permission is None, display Access Restricted notice */}
            {getPermissionForPath(activeRole.name, location.pathname) === 'None' &&
            location.pathname !== '/admin/dashboard' &&
            location.pathname !== '/admin' &&
            location.pathname !== '/' &&
            location.pathname !== '/admin/profile' &&
            location.pathname !== '/admin-profile' ? (
              <AccessRestricted
                roleName={activeRole.name}
                path={location.pathname}
                onSwitchRole={() => setIsProfileMenuOpen(true)}
              />
            ) : (
              <Routes>
                {/* ROOT ROUTE & COMPATIBILITY REDIRECTS */}
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                {/* CANONICAL ADMIN ROUTES */}
                <Route path="/admin/dashboard" element={<Overview />} />
                <Route path="/admin/candidates" element={<DirectoryPage key="candidates" kind="candidates" title="Candidates" eyebrow="MARKETPLACE / PEOPLE" description="Candidate directory · personal details remain masked by default." />} />
                <Route path="/admin/candidates/:id" element={<CandidateDetailPage />} />
                <Route path="/admin/employers" element={<DirectoryPage key="employers" kind="employers" title="Employers" eyebrow="MARKETPLACE / ACCOUNTS" description="Review company accounts, verification and employer standing." />} />
                <Route path="/admin/employers/:id" element={<EmployerDetailPage />} />
                <Route path="/admin/jobs" element={<DirectoryPage key="jobs" kind="jobs" title="Jobs" eyebrow="MARKETPLACE / MODERATION" description="Keep listings accurate, safe and useful for candidates." />} />
                <Route path="/admin/jobs/:id" element={<JobDetailPage />} />
                <Route path="/admin/applications" element={<ModulePage key="applications" module="applications" title="Applications" eyebrow="MARKETPLACE / OVERSIGHT" description="Application oversight for the two-sided marketplace." />} />
                <Route path="/admin/applications/:id" element={<ApplicationDetailPage />} />
                <Route path="/admin/interviews" element={<InterviewsPage />} />
                <Route path="/admin/interviews/disputes/:id" element={<InterviewDisputeDetailPage />} />
                <Route path="/admin/interviews/:id" element={<InterviewDetailPage />} />
                <Route path="/admin/messaging" element={<MessagingPage />} />
                <Route path="/admin/recommendations" element={<RecommendationsPage />} />
                <Route path="/admin/employer-billing" element={<EmployerBillingPage />} />
                <Route path="/admin/employer-billing/tiers/:id" element={<EmployerBillingTierFormPage />} />
                <Route path="/admin/employer-billing/invoices/:id" element={<EmployerBillingInvoiceDetailPage />} />
                <Route path="/admin/employer-billing/adjustments/new" element={<EmployerBillingCreditFormPage />} />
                <Route path="/admin/employer-billing/credits/new" element={<EmployerBillingCreditFormPage />} />
                <Route path="/admin/master-data" element={<ModulePage key="master-data" module="master-data" title="Master data" eyebrow="PLATFORM / TAXONOMY" description="Manage the shared categories that keep marketplace data consistent." />} />
                <Route path="/admin/master-data/categories/new" element={<MasterDataCategoryFormPage />} />
                <Route path="/admin/master-data/categories/:id" element={<MasterDataCategoryFormPage />} />
                <Route path="/admin/master-data/roles/new" element={<MasterDataRoleFormPage />} />
                <Route path="/admin/master-data/roles/:id" element={<MasterDataRoleFormPage />} />
                <Route path="/admin/master-data/skills/new" element={<MasterDataSkillFormPage />} />
                <Route path="/admin/master-data/skills/:id" element={<MasterDataSkillFormPage />} />
                <Route path="/admin/master-data/industries/new" element={<MasterDataIndustryFormPage />} />
                <Route path="/admin/master-data/industries/:id" element={<MasterDataIndustryFormPage />} />
                <Route path="/admin/master-data/locations/new" element={<MasterDataLocationFormPage />} />
                <Route path="/admin/master-data/locations/:id" element={<MasterDataLocationFormPage />} />
                <Route path="/admin/master-data/salary-buckets/new" element={<MasterDataSalaryBucketFormPage />} />
                <Route path="/admin/master-data/salary-buckets/:id" element={<MasterDataSalaryBucketFormPage />} />
                <Route path="/admin/master-data/benefits/new" element={<MasterDataBenefitFormPage />} />
                <Route path="/admin/master-data/benefits/:id" element={<MasterDataBenefitFormPage />} />
                <Route path="/admin/content" element={<ModulePage key="content" module="content" title="Content" eyebrow="PLATFORM / CONTENT" description="Manage CMS content and transactional email templates." />} />
                <Route path="/admin/content/articles/new" element={<ContentArticleFormPage />} />
                <Route path="/admin/content/articles/:id" element={<ContentArticleFormPage />} />
                <Route path="/admin/content/policies/new" element={<ContentPolicyFormPage />} />
                <Route path="/admin/content/policies/:id" element={<ContentPolicyFormPage />} />
                <Route path="/admin/resume-pro" element={<ModulePage key="resume-pro" module="resume-pro" title="Resume Pro" eyebrow="PRODUCT / SUBSCRIPTIONS" description="Operate templates, plans, subscriptions and refund workflows." />} />
                <Route path="/admin/resume-pro/templates/new" element={<ResumeProTemplateFormPage />} />
                <Route path="/admin/resume-pro/templates/:id" element={<ResumeProTemplateFormPage />} />
                <Route path="/admin/resume-pro/plans/:id" element={<ResumeProPlanFormPage />} />
                <Route path="/admin/resume-pro/subscriptions/:id" element={<ResumeProSubscriptionDetailPage />} />
                <Route path="/admin/resume-pro/refunds/:id" element={<ResumeProRefundDetailPage />} />
                <Route path="/admin/talent-network" element={<TalentNetworkPage />} />
                <Route path="/admin/communication" element={<ModulePage key="communication" module="communication" title="Communication" eyebrow="PLATFORM / DELIVERY" description="Coordinate alerts and broadcasts, then monitor delivery." />} />
                <Route path="/admin/communication/alerts/new" element={<JobAlertCreatePage />} />
                <Route path="/admin/communication/alerts/:id" element={<JobAlertDetailPage />} />
                <Route path="/admin/communication/broadcasts/new" element={<BroadcastCreatePage />} />
                <Route path="/admin/communication/broadcasts/:id" element={<BroadcastDetailPage />} />
                <Route path="/admin/communication/triggers/:id" element={<NotificationTriggerDetailPage />} />
                <Route path="/admin/trust-safety" element={<ModulePage key="trust-safety" module="trust-safety" title="Trust & safety" eyebrow="PROTECTION / CASEWORK" description="Review reports, blacklist records and fraud signals." />} />
                <Route path="/admin/trust-safety/reports/:id" element={<TrustSafetyReportDetailPage />} />
                <Route path="/admin/trust-safety/blacklist/new" element={<TrustSafetyBlacklistFormPage />} />
                <Route path="/admin/trust-safety/blacklist/:id" element={<TrustSafetyBlacklistFormPage />} />
                <Route path="/admin/support" element={<ModulePage key="support" module="support" title="Support" eyebrow="CUSTOMER CARE / QUEUE" description="Keep candidate and employer support requests moving." />} />
                <Route path="/admin/support/:id" element={<SupportTicketDetailPage />} />
                <Route path="/admin/analytics" element={<ModulePage key="analytics" module="analytics" title="Analytics" eyebrow="INTELLIGENCE / REPORTS" description="Growth, funnel, search and revenue reporting." />} />
                <Route path="/admin/settings" element={<ModulePage key="settings" module="settings" title="Settings" eyebrow="PLATFORM / GOVERNANCE" description="Platform controls, role access, compliance and audit history." />} />
                
                {/* BATCH 5 & PROFILE ROUTES */}
                <Route path="/admin/salary-benchmark" element={<SalaryBenchmarkPage />} />
                <Route path="/admin/interview-prep" element={<CurriculumBuilderView />} />
                <Route path="/admin/ai-cover-letter" element={<AiCoverLetterPage />} />
                <Route path="/admin/profile" element={<AdminProfilePage currentRoleName={activeRole.name} />} />

                {/* COMPATIBILITY ALIASES & REDIRECTS */}
                <Route path="/admin/cms" element={<Navigate to="/admin/content" replace />} />
                <Route path="/admin/integrations" element={<Navigate to="/admin/settings" replace />} />
                <Route path="/module/analytics" element={<Navigate to="/admin/analytics" replace />} />
                <Route path="/admin-profile" element={<Navigate to="/admin/profile" replace />} />

                {/* BACKWARD COMPATIBILITY FOR PREVIOUS ROOT-LEVEL ADMIN ROUTES */}
                <Route path="/candidates" element={<Navigate to="/admin/candidates" replace />} />
                <Route path="/candidates/:id" element={<Navigate to="/admin/candidates" replace />} />
                <Route path="/employers" element={<Navigate to="/admin/employers" replace />} />
                <Route path="/employers/:id" element={<Navigate to="/admin/employers" replace />} />
                <Route path="/jobs" element={<Navigate to="/admin/jobs" replace />} />
                <Route path="/jobs/:id" element={<Navigate to="/admin/jobs" replace />} />
                <Route path="/applications" element={<Navigate to="/admin/applications" replace />} />
                <Route path="/applications/:id" element={<Navigate to="/admin/applications" replace />} />
                <Route path="/interviews" element={<Navigate to="/admin/interviews" replace />} />
                <Route path="/messaging" element={<Navigate to="/admin/messaging" replace />} />
                <Route path="/recommendations" element={<Navigate to="/admin/recommendations" replace />} />
                <Route path="/employer-billing" element={<Navigate to="/admin/employer-billing" replace />} />
                <Route path="/master-data" element={<Navigate to="/admin/master-data" replace />} />
                <Route path="/content" element={<Navigate to="/admin/content" replace />} />
                <Route path="/resume-pro" element={<Navigate to="/admin/resume-pro" replace />} />
                <Route path="/talent-network" element={<Navigate to="/admin/talent-network" replace />} />
                <Route path="/communication" element={<Navigate to="/admin/communication" replace />} />
                <Route path="/trust-safety" element={<Navigate to="/admin/trust-safety" replace />} />
                <Route path="/support" element={<Navigate to="/admin/support" replace />} />
                <Route path="/support/:id" element={<Navigate to="/admin/support" replace />} />
                <Route path="/analytics" element={<Navigate to="/admin/analytics" replace />} />
                <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
                <Route path="/salary-benchmark" element={<Navigate to="/admin/salary-benchmark" replace />} />
                <Route path="/interview-prep" element={<Navigate to="/admin/interview-prep" replace />} />
                <Route path="/ai-cover-letter" element={<Navigate to="/admin/ai-cover-letter" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </div>
        </main>

        {/* AUTH-7: User Selection Modal */}
        {isSelectUserModalOpen && (
          <Modal
            isOpen={true}
            onClose={() => setIsSelectUserModalOpen(false)}
            eyebrow="AUTH-7 · SAFE IMPERSONATION PREVIEW"
            title="Select User to Preview"
            maxWidth="max-w-[540px]"
            footer={
              <div className="flex justify-end gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setIsSelectUserModalOpen(false)}
                  className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            }
          >
            <div className="space-y-4 py-1 text-xs">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-foreground text-xs leading-relaxed">
                Choose an active marketplace user to start an authorized, read-only perspective session. All state-changing operations will be disabled.
              </div>

              <div>
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Sample Candidates
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'can-1001', name: 'Aarav Mehta', email: 'aarav.mehta@designflow.io', role: 'Candidate' as const, headline: 'Senior Frontend Engineer · React 19' },
                    { id: 'can-1002', name: 'Priya Sharma', email: 'priya.sharma@fintechcloud.in', role: 'Candidate' as const, headline: 'Fintech Product Lead · Core Banking' },
                    { id: 'can-1003', name: 'Rohan Verma', email: 'rohan.verma@cloudnative.dev', role: 'Candidate' as const, headline: 'Cloud SRE & DevOps Architect' },
                  ].map((cand) => (
                    <button
                      key={cand.id}
                      type="button"
                      onClick={() => handleStartViewAsUser(cand)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/60 transition-colors text-left group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          <span>{cand.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-700">
                            Candidate
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{cand.headline}</div>
                      </div>
                      <span className="text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                        Select &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Sample Employers / Hiring Partners
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'emp-2001', name: 'Northstar Labs', email: 'recruiter@northstarlabs.io', role: 'Employer' as const, headline: 'Developer Productivity · 18 Open Roles' },
                    { id: 'emp-2002', name: 'Cloudframe Systems', email: 'talent@cloudframe.in', role: 'Employer' as const, headline: 'Cloud Infrastructure & Kubernetes' },
                  ].map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => handleStartViewAsUser(emp)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/60 transition-colors text-left group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          <span>{emp.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-700">
                            Employer
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{emp.headline}</div>
                      </div>
                      <span className="text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                        Select &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* AUTH-7: DPDP Compliance Confirmation Modal */}
        {isConfirmViewAsUserModalOpen && pendingUserToPreview && (
          <Modal
            isOpen={true}
            onClose={() => {
              setIsConfirmViewAsUserModalOpen(false);
              setPendingUserToPreview(null);
            }}
            eyebrow="AUTH-7 · SECURITY JUSTIFICATION REQUIRED"
            title={`Confirm Safe Read-Only Preview: ${pendingUserToPreview.name}`}
            maxWidth="max-w-[500px]"
            footer={
              <div className="flex justify-end gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmViewAsUserModalOpen(false);
                    setPendingUserToPreview(null);
                  }}
                  className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-testid="btn-confirm-start-view-as-user"
                  onClick={handleConfirmStartViewAsUser}
                  className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
                >
                  Authorize & Start Preview
                </button>
              </div>
            }
          >
            <div className="space-y-3.5 py-1 text-xs">
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs space-y-1.5 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                  <ShieldAlert size={16} className="text-amber-600 shrink-0" />
                  READ-ONLY PREVIEW RESTRICTIONS ACTIVE
                </div>
                <p className="text-[11px] leading-relaxed">
                  During preview mode, account deletion, password resets, financial changes, and sending communications as the user are <strong>strictly disabled</strong>. This session is logged in compliance with DPDP Act 2023.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target User:</span>
                  <span className="font-bold text-foreground">{pendingUserToPreview.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Type:</span>
                  <span className="font-semibold text-foreground">{pendingUserToPreview.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-muted-foreground">{pendingUserToPreview.id}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Administrative Purpose / Casework Justification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  data-testid="input-view-as-user-justification"
                  value={previewJustification}
                  onChange={(e) => {
                    setPreviewJustification(e.target.value);
                    if (justificationError) setJustificationError(null);
                  }}
                  placeholder="e.g. Investigating application flow rendering discrepancy on ticket JR-T1004..."
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  autoFocus
                />
                {justificationError && (
                  <p className="text-rose-600 text-[10px] mt-1 font-semibold">{justificationError}</p>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <RoutedErrorBoundary>
      <Shell />
    </RoutedErrorBoundary>
  );
}

export default App;