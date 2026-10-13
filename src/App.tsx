import { type ReactNode, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, BriefcaseBusiness, Building2, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, Clock3, FileText, Filter, LayoutDashboard,
  ListFilter, LockKeyhole, Menu, Search, Settings2, Shield,
  ShieldAlert, Sparkles, Users, X,
} from 'lucide-react';
import { Link, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui';
import { Overview } from '@/pages/Overview';
import { DirectoryPage } from '@/pages/Directory';
import { ModulePage } from '@/pages/Module';
import { NotFound } from '@/pages/NotFound';

const navGroups = [
  { label: 'WORKSPACE', links: [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Candidates', href: '/candidates', icon: Users },
    { name: 'Employers', href: '/employers', icon: Building2 },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseBusiness },
    { name: 'Applications', href: '/applications', icon: ClipboardList },
  ] },
  { label: 'OPERATIONS', links: [
    { name: 'Master data', href: '/master-data', icon: ListFilter },
    { name: 'Content', href: '/content', icon: FileText },
    { name: 'Resume Pro', href: '/resume-pro', icon: Sparkles },
    { name: 'Communication', href: '/communication', icon: Bell },
  ] },
  { label: 'PROTECTION', links: [
    { name: 'Trust & safety', href: '/trust-safety', icon: ShieldAlert },
    { name: 'Support', href: '/support', icon: CircleHelp },
  ] },
  { label: 'INSIGHTS & ACCESS', links: [
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
  '/master-data': { title: 'Master data', eyebrow: 'PLATFORM / TAXONOMY', description: 'Manage the shared categories that keep marketplace data consistent.' },
  '/content': { title: 'Content', eyebrow: 'PLATFORM / CONTENT', description: 'Manage CMS content and transactional email templates.' },
  '/resume-pro': { title: 'Resume Pro', eyebrow: 'PRODUCT / SUBSCRIPTIONS', description: 'Operate templates, plans, subscriptions and refund workflows.' },
  '/communication': { title: 'Communication', eyebrow: 'PLATFORM / DELIVERY', description: 'Coordinate alerts and broadcasts, then monitor delivery.' },
  '/trust-safety': { title: 'Trust & safety', eyebrow: 'PROTECTION / CASEWORK', description: 'Review reports, blacklist records and fraud signals.' },
  '/support': { title: 'Support', eyebrow: 'CUSTOMER CARE / QUEUE', description: 'Keep candidate and employer support requests moving.' },
  '/analytics': { title: 'Analytics', eyebrow: 'INTELLIGENCE / REPORTS', description: 'Growth, funnel, search and revenue reporting.' },
  '/settings': { title: 'Settings', eyebrow: 'PLATFORM / GOVERNANCE', description: 'Platform controls, role access, compliance and audit history.' },
};

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');

  const current = pageMeta[location.pathname] ?? pageMeta['/'];
  const activeLink = navGroups.flatMap((group) => group.links).find((item) => item.href === location.pathname);
  const activeGroup = activeLink?.name ?? 'Overview';

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      {mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-slate-950/30 md:hidden" />}
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
                  const selected = location.pathname === href;
                  return (
                    <Link
                      key={href}
                      to={href}
                      data-testid={`link-nav-${name.toLowerCase().replaceAll(' ', '-')}`}
                      aria-current={selected ? 'page' : undefined}
                      onClick={() => setMobileNav(false)}
                      className={`group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_hsl(var(--primary))]' : 'text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-foreground'}`}
                    >
                      <Icon size={17} strokeWidth={selected ? 2.2 : 1.8} /><span>{name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl border border-sidebar-border bg-white/45 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold"><Shield size={14} className="text-primary" /> Internal workspace</div>
            <div className="mt-1.5 pl-[22px] text-[10px] text-muted-foreground">Marketplace operations</div>
          </div>
          <div className="flex w-full items-center gap-3 rounded-lg p-2 text-left" data-testid="text-admin-role">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4dcfb] text-[11px] font-bold text-[#5842a7]">OA</div>
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">Operations admin</div><div className="text-[10px] text-muted-foreground">Platform administrator</div></div>
          </div>
        </div>
      </aside>
      <div className="min-h-[100dvh] lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center gap-3 border-b border-border/80 bg-background/95 px-4 backdrop-blur-md sm:px-7 lg:px-10">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={19} /></button>
          <div className="hidden min-w-0 items-center gap-2 text-[12px] text-muted-foreground lg:flex"><span>Admin</span><ChevronRight size={13} /><span className="font-semibold text-foreground">{activeGroup}</span></div>
          <div className="relative ml-auto w-full max-w-[370px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input aria-label="Search current directory" data-testid="input-global-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeGroup.toLowerCase()}…`} className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-12 text-[12px] outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10" />
          </div>
          <span className="hidden whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold tracking-wide text-amber-800 sm:inline-flex">SAMPLE DATA</span>
          <Link aria-label="Open communication workspace" title="Open communication workspace" data-testid="link-notifications" to="/communication" className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-accent hover:text-primary"><Bell size={17} /></Link>
          <div className="hidden h-8 w-px bg-border sm:block" />
          <div aria-label="Administrator profile" className="hidden items-center gap-2 rounded-lg p-1.5 text-left sm:flex"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4dcfb] text-[11px] font-bold text-[#5842a7]">OA</div><ChevronDown size={14} className="text-muted-foreground" /></div>
        </header>
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
              <Route path="/candidates" element={<DirectoryPage kind="candidates" title="Candidates" eyebrow="MARKETPLACE / PEOPLE" description="Candidate directory · personal details remain masked by default." />} />
              <Route path="/employers" element={<DirectoryPage kind="employers" title="Employers" eyebrow="MARKETPLACE / ACCOUNTS" description="Review company accounts, verification and employer standing." />} />
              <Route path="/jobs" element={<DirectoryPage kind="jobs" title="Jobs" eyebrow="MARKETPLACE / MODERATION" description="Keep listings accurate, safe and useful for candidates." />} />
              <Route path="/applications" element={<ModulePage module="applications" title="Applications" eyebrow="MARKETPLACE / OVERSIGHT" description="Application oversight for the two-sided marketplace." />} />
              <Route path="/master-data" element={<ModulePage module="master-data" title="Master data" eyebrow="PLATFORM / TAXONOMY" description="Manage the shared categories that keep marketplace data consistent." />} />
              <Route path="/content" element={<ModulePage module="content" title="Content" eyebrow="PLATFORM / CONTENT" description="Manage CMS content and transactional email templates." />} />
              <Route path="/resume-pro" element={<ModulePage module="resume-pro" title="Resume Pro" eyebrow="PRODUCT / SUBSCRIPTIONS" description="Operate templates, plans, subscriptions and refund workflows." />} />
              <Route path="/communication" element={<ModulePage module="communication" title="Communication" eyebrow="PLATFORM / DELIVERY" description="Coordinate alerts and broadcasts, then monitor delivery." />} />
              <Route path="/trust-safety" element={<ModulePage module="trust-safety" title="Trust & safety" eyebrow="PROTECTION / CASEWORK" description="Review reports, blacklist records and fraud signals." />} />
              <Route path="/support" element={<ModulePage module="support" title="Support" eyebrow="CUSTOMER CARE / QUEUE" description="Keep candidate and employer support requests moving." />} />
              <Route path="/analytics" element={<ModulePage module="analytics" title="Analytics" eyebrow="INTELLIGENCE / REPORTS" description="Growth, funnel, search and revenue reporting." />} />
              <Route path="/settings" element={<ModulePage module="settings" title="Settings" eyebrow="PLATFORM / GOVERNANCE" description="Platform controls, role access, compliance and audit history." />} />
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
  return (
    <RoutedErrorBoundary>
      <Shell />
    </RoutedErrorBoundary>
  );
}

export default App;