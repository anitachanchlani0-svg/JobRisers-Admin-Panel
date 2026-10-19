import { type ReactNode, useState, useMemo, useRef, useEffect } from 'react';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, BriefcaseBusiness, Building2, Calendar, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, Clock3, CreditCard, FileText, Filter, LayoutDashboard,
  ListFilter, LockKeyhole, Menu, MessageSquare, Search, Settings2, Shield,
  ShieldAlert, Sliders, Sparkles, Users, X,
} from 'lucide-react';
import { Link, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui';
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
  AdminLogin,
} from '@/pages';
import { adminCandidates, adminEmployers, adminJobs, adminApplications } from '@/mock-data';

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
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Candidates', href: '/candidates', icon: Users },
    { name: 'Employers', href: '/employers', icon: Building2 },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseBusiness },
    { name: 'Applications', href: '/applications', icon: ClipboardList },
    { name: 'Interviews', href: '/interviews', icon: Calendar },
  ] },
  { label: 'OPERATIONS', links: [
    { name: 'Master data', href: '/master-data', icon: ListFilter },
    { name: 'Content', href: '/content', icon: FileText },
    { name: 'Resume Pro', href: '/resume-pro', icon: Sparkles },
    { name: 'Employer billing', href: '/employer-billing', icon: CreditCard },
    { name: 'Communication', href: '/communication', icon: Bell },
    { name: 'Messaging', href: '/messaging', icon: MessageSquare },
  ] },
  { label: 'PROTECTION', links: [
    { name: 'Trust & safety', href: '/trust-safety', icon: ShieldAlert },
    { name: 'Support', href: '/support', icon: CircleHelp },
  ] },
  { label: 'INSIGHTS & ACCESS', links: [
    { name: 'Recommendations', href: '/recommendations', icon: Sliders },
    { name: 'Analytics', href: '/analytics', icon: Activity },
    { name: 'Settings', href: '/settings', icon: Settings2 },
  ] },
];

const pageMeta: Record<string, { title: string; eyebrow: string; description: string }> = {
  '/': { title: 'Overview', eyebrow: 'OPERATIONS / TODAY', description: 'A clear view of marketplace health and the work that needs attention.' },
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
};

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<AdminRoleConfig>(
    ADMIN_ROLES.find((r) => r.id === 'operations-admin') || ADMIN_ROLES[0]
  );
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [roleToast, setRoleToast] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsRoleMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
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
          path: `/candidates/${c.id}`,
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
          path: `/employers/${e.id}`,
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
          path: `/jobs/${j.id}`,
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
          path: `/applications/${a.id}`,
          meta: `Score: ${a.screeningScore || a.resume?.atsScore || 'N/A'}%`,
        });
        if (list.length >= 40) break;
      }
    }

    return list;
  }, [searchQuery]);

  const getPageMeta = (pathname: string) => {
    if (pageMeta[pathname]) return pageMeta[pathname];
    if (pathname.startsWith('/candidates/')) {
      return { title: 'Candidate Profile', eyebrow: 'MARKETPLACE / PEOPLE', description: 'Comprehensive candidate record, verification status, and application history.' };
    }
    if (pathname.startsWith('/employers/')) {
      return { title: 'Employer Account', eyebrow: 'MARKETPLACE / ACCOUNTS', description: 'Employer company profile, verification standing, posted jobs, and billing.' };
    }
    if (pathname.startsWith('/jobs/')) {
      return { title: 'Job Listing Detail', eyebrow: 'MARKETPLACE / MODERATION', description: 'Review job requirements, compensation, moderation status, and applicant flow.' };
    }
    if (pathname.startsWith('/applications/')) {
      return { title: 'Application Detail', eyebrow: 'MARKETPLACE / OVERSIGHT', description: 'Candidate application details, screening responses, resume, and ATS pipeline stage.' };
    }
    if (pathname.startsWith('/support/')) {
      return { title: 'Support Ticket Detail', eyebrow: 'CUSTOMER CARE / QUEUE', description: 'Review support inquiry thread, requester information, and customer care resolution.' };
    }
    return pageMeta['/'];
  };

  const current = getPageMeta(location.pathname);
  const activeLink = navGroups.flatMap((group) => group.links).find((item) => {
    if (item.href === '/') return location.pathname === '/';
    return location.pathname === item.href || location.pathname.startsWith(item.href + '/');
  });
  const activeGroup = activeLink?.name ?? 'Overview';

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
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
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[9px] font-bold tracking-[.16em] text-muted-foreground/80">{group.label}</p>
              <div className="space-y-1">
                {group.links.map(({ name, href, icon: Icon }) => {
                  const selected = location.pathname === href || (href !== '/' && location.pathname.startsWith(href + '/'));
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
            onClick={() => setIsRoleMenuOpen(true)}
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
          <Link aria-label="Open communication workspace" title="Open communication workspace" data-testid="link-notifications" to="/communication" className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-accent hover:text-primary"><Bell size={17} /></Link>
          
          <div className="hidden h-8 w-px bg-border sm:block" />

          {/* XMOD-2: Active Admin Role / RBAC Preview Profile Trigger */}
          <div ref={roleMenuRef} className="relative">
            <button
              type="button"
              aria-label="Active Admin Role Switcher"
              data-testid="btn-role-switcher"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-accent/60 border border-transparent hover:border-border"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activeRole.bg} text-[11px] font-bold ${activeRole.text} shadow-sm`}>
                {activeRole.short}
              </div>
              <div className="hidden sm:block leading-tight text-left pr-1">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>{activeRole.name}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border border-primary/20 bg-primary/10 text-primary">
                    Preview
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">RBAC Switcher</div>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>

            {/* XMOD-2 Role Switcher Menu */}
            {isRoleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-border/80">
                  <div className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Admin Role / RBAC Preview</span>
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">XMOD-2</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    Preview UI and governance permissions under different administrative personas.
                  </p>
                </div>

                <div className="space-y-1 py-1 max-h-[320px] overflow-y-auto">
                  {ADMIN_ROLES.map((role) => {
                    const isCurrent = activeRole.id === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setActiveRole(role);
                          setIsRoleMenuOpen(false);
                          setRoleToast(`Switched active preview role to ${role.name}. UI permissions updated.`);
                        }}
                        className={`w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-all ${
                          isCurrent
                            ? 'bg-primary/10 border border-primary/30 text-foreground'
                            : 'hover:bg-muted/70 text-foreground/90 border border-transparent'
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${role.bg} text-[11px] font-bold ${role.text} shrink-0 mt-0.5 shadow-sm`}>
                          {role.short}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">{role.name}</span>
                            {isCurrent && <Check size={14} className="text-primary font-bold" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{role.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-border/80 px-3 py-1.5 bg-muted/20 rounded-xl text-[9px] text-muted-foreground text-center">
                  Frontend RBAC Preview Environment · DPDP Act 2023 Compliant
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
        <main className="mx-auto max-w-[1600px] px-4 pb-12 pt-8 sm:px-7 lg:px-10">
          <div className="mb-7">
            <div className="mb-2 text-[9px] font-bold tracking-[.18em] text-primary">{current.eyebrow}</div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><h1 className="font-display text-[30px] font-extrabold leading-tight tracking-[-.045em] text-foreground sm:text-[34px]">{current.title}</h1><p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{current.description}</p></div>
              {location.pathname === '/' && <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground"><Clock3 size={14} /> Updated moments ago</div>}
            </div>
          </div>
          <div className="app-enter">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/candidates" element={<DirectoryPage key="candidates" kind="candidates" title="Candidates" eyebrow="MARKETPLACE / PEOPLE" description="Candidate directory · personal details remain masked by default." />} />
              <Route path="/candidates/:id" element={<CandidateDetailPage />} />
              <Route path="/employers" element={<DirectoryPage key="employers" kind="employers" title="Employers" eyebrow="MARKETPLACE / ACCOUNTS" description="Review company accounts, verification and employer standing." />} />
              <Route path="/employers/:id" element={<EmployerDetailPage />} />
              <Route path="/jobs" element={<DirectoryPage key="jobs" kind="jobs" title="Jobs" eyebrow="MARKETPLACE / MODERATION" description="Keep listings accurate, safe and useful for candidates." />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/applications" element={<ModulePage key="applications" module="applications" title="Applications" eyebrow="MARKETPLACE / OVERSIGHT" description="Application oversight for the two-sided marketplace." />} />
              <Route path="/applications/:id" element={<ApplicationDetailPage />} />
              <Route path="/interviews" element={<InterviewsPage />} />
              <Route path="/messaging" element={<MessagingPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/employer-billing" element={<EmployerBillingPage />} />
              <Route path="/master-data" element={<ModulePage key="master-data" module="master-data" title="Master data" eyebrow="PLATFORM / TAXONOMY" description="Manage the shared categories that keep marketplace data consistent." />} />
              <Route path="/content" element={<ModulePage key="content" module="content" title="Content" eyebrow="PLATFORM / CONTENT" description="Manage CMS content and transactional email templates." />} />
              <Route path="/resume-pro" element={<ModulePage key="resume-pro" module="resume-pro" title="Resume Pro" eyebrow="PRODUCT / SUBSCRIPTIONS" description="Operate templates, plans, subscriptions and refund workflows." />} />
              <Route path="/communication" element={<ModulePage key="communication" module="communication" title="Communication" eyebrow="PLATFORM / DELIVERY" description="Coordinate alerts and broadcasts, then monitor delivery." />} />
              <Route path="/trust-safety" element={<ModulePage key="trust-safety" module="trust-safety" title="Trust & safety" eyebrow="PROTECTION / CASEWORK" description="Review reports, blacklist records and fraud signals." />} />
              <Route path="/support" element={<ModulePage key="support" module="support" title="Support" eyebrow="CUSTOMER CARE / QUEUE" description="Keep candidate and employer support requests moving." />} />
              <Route path="/support/:id" element={<SupportTicketDetailPage />} />
              <Route path="/analytics" element={<ModulePage key="analytics" module="analytics" title="Analytics" eyebrow="INTELLIGENCE / REPORTS" description="Growth, funnel, search and revenue reporting." />} />
              <Route path="/module/analytics" element={<ModulePage key="module-analytics" module="analytics" title="Analytics" eyebrow="INTELLIGENCE / REPORTS" description="Growth, funnel, search and revenue reporting." />} />
              <Route path="/settings" element={<ModulePage key="settings" module="settings" title="Settings" eyebrow="PLATFORM / GOVERNANCE" description="Platform controls, role access, compliance and audit history." />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
}

function App() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return (
      <RoutedErrorBoundary>
        <AdminLogin />
      </RoutedErrorBoundary>
    );
  }

  return (
    <RoutedErrorBoundary>
      <Shell />
    </RoutedErrorBoundary>
  );
}

export default App;