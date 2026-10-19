import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Receipt,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Send,
  Printer,
  ChevronDown,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  EmployerPlanTier,
  EmployerInvoice,
  EmployerJobPackage,
  EmployerBillingCreditEntry,
  EmployerRefundRequest,
  EmployerPaymentDispute,
  EmployerPaywallRules,
  adminEmployerPlans,
  adminEmployerInvoices,
  adminJobPackages,
  adminBillingCredits,
  adminRefundRequests,
  adminPaymentDisputes,
  adminPaywallRules,
} from '@/mock-data';
import { StatusPill } from '@/components/ui/StatusPill';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

const billingSections = [
  'Subscription tiers',
  'Job packages',
  'Invoices & GST',
  'Credits & refunds',
] as const;

type BillingSection = typeof billingSections[number];

export function EmployerBillingPage() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<BillingSection>('Subscription tiers');

  // --- TAB 1: Subscription Tiers State ---
  const [plans, setPlans] = useState<EmployerPlanTier[]>(adminEmployerPlans);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [editingPlan, setEditingPlan] = useState<EmployerPlanTier | null>(null);
  const [paywallRules, setPaywallRules] = useState<EmployerPaywallRules>(adminPaywallRules);
  const [planToast, setPlanToast] = useState<string | null>(null);

  // --- TAB 2: Job Packages State ---
  const [packages, setPackages] = useState<EmployerJobPackage[]>(adminJobPackages);
  const [packageSearch, setPackageSearch] = useState('');
  const [packageFilter, setPackageFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [editingPackage, setEditingPackage] = useState<EmployerJobPackage | null>(null);
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<Omit<EmployerJobPackage, 'id'>>({
    name: '',
    jobQuantity: 1,
    price: 4999,
    currency: 'INR',
    validityDays: 30,
    featuredCredits: 0,
    status: 'Active',
    description: '',
  });

  // --- TAB 3: Invoices & GST State ---
  const [invoices, setInvoices] = useState<EmployerInvoice[]>(adminEmployerInvoices);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState<string>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<EmployerInvoice | null>(null);
  const [invoiceNotice, setInvoiceNotice] = useState<string | null>(null);

  // --- TAB 4: Credits & Refunds State ---
  const [credits, setCredits] = useState<EmployerBillingCreditEntry[]>(adminBillingCredits);
  const [refunds, setRefunds] = useState<EmployerRefundRequest[]>(adminRefundRequests);
  const [disputes, setDisputes] = useState<EmployerPaymentDispute[]>(adminPaymentDisputes);
  const [selectedRefund, setSelectedRefund] = useState<EmployerRefundRequest | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<EmployerPaymentDispute | null>(null);
  const [isIssueCreditOpen, setIsIssueCreditOpen] = useState(false);
  const [newCredit, setNewCredit] = useState({
    companyName: 'Northstar Labs',
    creditType: 'Job Posting' as const,
    amountOrCredits: '1 Job Post',
    reason: 'Customer goodwill credit',
  });
  const [creditsNotice, setCreditsNotice] = useState<string | null>(null);

  // Show transient notice
  const triggerToast = (msg: string, setter: (val: string | null) => void) => {
    setter(msg);
    setTimeout(() => setter(null), 4000);
  };

  // --- Computed Metrics ---
  const totalSubscribers = useMemo(
    () => plans.reduce((acc, p) => acc + (p.status === 'Active' ? p.activeSubscribers : 0), 0),
    [plans]
  );

  const totalDisputesCount = useMemo(
    () => disputes.length,
    [disputes]
  );

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
        pkg.description.toLowerCase().includes(packageSearch.toLowerCase());
      const matchesStatus =
        packageFilter === 'All' ? true : pkg.status === packageFilter;
      return matchesSearch && matchesStatus;
    });
  }, [packages, packageSearch, packageFilter]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = invoiceSearch.toLowerCase();
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.companyName.toLowerCase().includes(q) ||
        inv.gstin.toLowerCase().includes(q) ||
        inv.billingContact.toLowerCase().includes(q);
      const matchesFilter =
        invoiceFilter === 'All' ? true : inv.status === invoiceFilter;
      return matchesSearch && matchesFilter;
    });
  }, [invoices, invoiceSearch, invoiceFilter]);

  // --- Handlers: Tab 1 (Plans) ---
  const handleSavePlan = () => {
    if (!editingPlan) return;
    setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? editingPlan : p)));
    setEditingPlan(null);
    triggerToast(`Plan "${editingPlan.name}" updated successfully.`, setPlanToast);
  };

  // --- Handlers: Tab 2 (Packages) ---
  const handleSavePackage = () => {
    if (!editingPackage) return;
    setPackages((prev) => prev.map((p) => (p.id === editingPackage.id ? editingPackage : p)));
    setEditingPackage(null);
    triggerToast(`Package "${editingPackage.name}" updated.`, setPlanToast);
  };

  const handleCreatePackage = () => {
    if (!newPackage.name.trim()) return;
    const created: EmployerJobPackage = {
      ...newPackage,
      id: `pkg-${Date.now()}`,
    };
    setPackages((prev) => [created, ...prev]);
    setIsAddPackageOpen(false);
    setNewPackage({
      name: '',
      jobQuantity: 1,
      price: 4999,
      currency: 'INR',
      validityDays: 30,
      featuredCredits: 0,
      status: 'Active',
      description: '',
    });
    triggerToast(`Package "${created.name}" created successfully.`, setPlanToast);
  };

  const handleTogglePackageStatus = (id: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === id
          ? { ...pkg, status: pkg.status === 'Active' ? 'Inactive' : 'Active' }
          : pkg
      )
    );
  };

  // --- Handlers: Tab 3 (Invoices) ---
  const handleRetryPayment = (invoiceNumber: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceNumber === invoiceNumber
          ? { ...inv, status: 'Paid', paidDate: 'Just now' }
          : inv
      )
    );
    triggerToast(
      `Payment gateway retry dispatched for ${invoiceNumber}. Settlement status updated to Paid.`,
      setInvoiceNotice
    );
  };

  const handleSendDunningNotice = (invoice: EmployerInvoice) => {
    triggerToast(
      `Formal dunning payment recovery notice emailed to ${invoice.billingEmail} (${invoice.companyName}).`,
      setInvoiceNotice
    );
  };

  // --- Handlers: Tab 4 (Credits & Refunds) ---
  const handleRefundAction = (decision: 'Approved' | 'Rejected') => {
    if (!selectedRefund) return;
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === selectedRefund.id
          ? {
              ...r,
              status: decision,
              notes: decision === 'Approved' ? 'Approved by Admin Finance; credit memo issued.' : 'Rejected per policy guidelines.',
            }
          : r
      )
    );
    if (decision === 'Approved') {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedRefund.invoiceId || inv.invoiceNumber === selectedRefund.invoiceId
            ? { ...inv, status: 'Refunded' }
            : inv
        )
      );
    }
    const id = selectedRefund.id;
    setSelectedRefund(null);
    triggerToast(`Refund request ${id} marked as ${decision}.`, setCreditsNotice);
  };

  const handleResolveDispute = (disputeId: string, resolution: 'Resolved' | 'Dispute Won') => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: resolution,
              resolutionNotes: `Case concluded as ${resolution}. Merchant evidence accepted by gateway.`,
            }
          : d
      )
    );
    setSelectedDispute(null);
    triggerToast(`Payment dispute ${disputeId} updated to ${resolution}.`, setCreditsNotice);
  };

  const handleIssueCredit = () => {
    const entry: EmployerBillingCreditEntry = {
      id: `crd-${Date.now()}`,
      employerId: 'emp-custom',
      companyName: newCredit.companyName,
      creditType: newCredit.creditType,
      amountOrCredits: newCredit.amountOrCredits,
      reason: newCredit.reason,
      date: 'Today',
      status: 'Available',
    };
    setCredits((prev) => [entry, ...prev]);
    setIsIssueCreditOpen(false);
    triggerToast(`Credit allocated to ${entry.companyName}.`, setCreditsNotice);
  };

  return (
    <div className="space-y-5">
      {/* Top Toast / Notice Notification */}
      {(planToast || invoiceNotice || creditsNotice) && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{planToast || invoiceNotice || creditsNotice}</span>
        </div>
      )}

      {/* Top 3 KPI Cards */}
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active billing accounts
          </div>
          <div className="mt-2 truncate font-display text-[22px] font-extrabold tracking-tight">
            {totalSubscribers.toLocaleString()}
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Employers on paid subscription tiers
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Billed this month
          </div>
          <div className="mt-2 truncate font-display text-[22px] font-extrabold tracking-tight">
            ₹18.4M
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Consolidated employer invoice volume
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Payment disputes
          </div>
          <div className="mt-2 truncate font-display text-[22px] font-extrabold tracking-tight text-amber-600">
            {totalDisputesCount}
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">
            Chargebacks or disputes requiring action
          </div>
        </article>
      </section>

      {/* Main Console Section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        {/* Module Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary">
              <CreditCard size={22} />
            </div>
            <div>
              <h2 className="font-display text-[18px] font-extrabold tracking-tight">
                Employer billing & monetization
              </h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Operate employer billing plans, manage job packages, generate GST invoices, and reconcile payment credits.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Tabs Bar */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
          {billingSections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              aria-pressed={selectedSection === section}
              className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[11px] font-bold transition-colors ${
                selectedSection === section
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* TAB 1: SUBSCRIPTION TIERS */}
        {selectedSection === 'Subscription tiers' && (
          <div className="mt-6 space-y-6">
            {/* Header + Monthly/Annual Cycle Toggle */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Employer Subscription Tiers (BIL-1)</h3>
                <p className="text-xs text-muted-foreground">
                  Tier definitions presented on public Pricing and in Employer Onboarding Step 2 ('Team & Billing').
                </p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    billingCycle === 'annual'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>Annual billing</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                    Save ~17%
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Canonical Plan Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => {
                const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
                const periodLabel = billingCycle === 'monthly' ? '/ month' : '/ year';
                return (
                  <div
                    key={plan.id}
                    className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                          {plan.tier}
                        </span>
                        <StatusPill value={plan.status} />
                      </div>

                      <h4 className="mt-3 text-base font-extrabold text-foreground">{plan.name}</h4>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-display text-2xl font-black text-foreground">
                          ₹{price.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">{periodLabel}</span>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <span><strong>{plan.activeSubscribers.toLocaleString()}</strong> active employer subscribers</span>
                      </div>

                      {/* Quotas & Features */}
                      <ul className="mt-5 space-y-2.5 border-t border-border pt-4 text-xs text-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span><strong>{plan.features.teamSeats}</strong> Team seats included</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>
                            <strong>
                              {typeof plan.features.jobPostingQuota === 'number'
                                ? `${plan.features.jobPostingQuota} Live jobs`
                                : 'Unlimited job postings'}
                            </strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>
                            <strong>{plan.features.featuredJobCredits}</strong> Featured spotlight credits/mo
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>
                            <strong>
                              {typeof plan.features.resumeSearchQuota === 'number'
                                ? `${plan.features.resumeSearchQuota} Candidate searches`
                                : 'Unlimited candidate searches'}
                            </strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Info size={14} className="shrink-0 text-primary" />
                          <span>{plan.features.supportSla}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 border-t border-border pt-4">
                      <button
                        onClick={() => navigate(`/admin/employer-billing/tiers/${plan.id}`)}
                        className="w-full rounded-lg border border-border bg-muted/40 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        Edit Plan Parameters
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paywall Rules & Restriction Governance (BIL-4 / EMP-6) */}
            <div className="rounded-xl border border-border bg-muted/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={18} className="text-amber-600" />
                    <h4 className="text-sm font-bold text-foreground">
                      Paywall Rules & Monetization Governance (BIL-4)
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enforce quota hard-stops and prevent unverified employers from publishing jobs without review.
                  </p>
                </div>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Enforcement Active
                </span>
              </div>

              {/* Policy Banner */}
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-700" />
                <div>
                  <strong>PRD Mandatory Rule:</strong> Unverified employers may draft job postings and set up their team profile, but cannot publish live jobs to the marketplace until verification credentials are fully approved by Trust & Safety.
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Job Posting Quota</div>
                    <div className="text-[10px] text-muted-foreground">Gate jobs when tier limit reached</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={paywallRules.enforceJobPostingQuota}
                    onChange={(e) =>
                      setPaywallRules((prev) => ({
                        ...prev,
                        enforceJobPostingQuota: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Resume Search Quota</div>
                    <div className="text-[10px] text-muted-foreground">Gate candidate contacts past search limit</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={paywallRules.enforceResumeSearchQuota}
                    onChange={(e) =>
                      setPaywallRules((prev) => ({
                        ...prev,
                        enforceResumeSearchQuota: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Block Unverified Publish</div>
                    <div className="text-[10px] text-muted-foreground">Only verified employers can publish</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={paywallRules.unverifiedEmployerPublishingRestricted}
                    onChange={(e) =>
                      setPaywallRules((prev) => ({
                        ...prev,
                        unverifiedEmployerPublishingRestricted: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded text-primary focus:ring-primary"
                  />
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Dunning grace period after payment failure: <strong>{paywallRules.gracePeriodDaysAfterFailure} days</strong></span>
                <button
                  onClick={() => triggerToast('Paywall policy configuration saved locally.', setPlanToast)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Save Paywall Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOB PACKAGES */}
        {selectedSection === 'Job packages' && (
          <div className="mt-6 space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search job packages by name..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
                  {(['All', 'Active', 'Inactive'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setPackageFilter(filter)}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                        packageFilter === filter
                          ? 'bg-card text-foreground shadow-sm font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setIsAddPackageOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} />
                <span>Add Package</span>
              </button>
            </div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <EmptyState
                title="No job packages found"
                detail="Try adjusting your search query or status filter."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {pkg.jobQuantity > 0 ? `${pkg.jobQuantity} Job Posts` : 'Spotlight Boost'}
                        </span>
                        <StatusPill value={pkg.status} />
                      </div>

                      <h4 className="mt-2 text-sm font-bold text-foreground">{pkg.name}</h4>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="mt-3">
                        <span className="font-display text-xl font-black text-foreground">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-1">/ {pkg.validityDays} days</span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-foreground">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Listing Validity:</span>
                          <span className="font-semibold text-foreground">{pkg.validityDays} Days</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Featured Credits:</span>
                          <span className="font-semibold text-foreground">{pkg.featuredCredits} Boosts</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                      <button
                        onClick={() => setEditingPackage({ ...pkg })}
                        className="flex-1 rounded border border-border bg-muted/30 py-1 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePackageStatus(pkg.id)}
                        className="rounded border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted"
                      >
                        {pkg.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVOICES & GST */}
        {selectedSection === 'Invoices & GST' && (
          <div className="mt-6 space-y-5">
            {/* Search and Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search invoice #, company, GSTIN, contact..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 overflow-x-auto">
                {['All', 'Paid', 'Pending', 'Failed', 'Refunded'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setInvoiceFilter(status)}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                      invoiceFilter === status
                        ? 'bg-card text-foreground shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoices Table */}
            {filteredInvoices.length === 0 ? (
              <EmptyState
                title="No invoices found"
                detail="No employer invoices matched your search and filter criteria."
              />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Invoice #</th>
                      <th className="px-4 py-3">Employer</th>
                      <th className="px-4 py-3">GSTIN</th>
                      <th className="px-4 py-3">Subtotal</th>
                      <th className="px-4 py-3">GST (18%)</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Payment Method</th>
                      <th className="px-4 py-3">Dates</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">{inv.companyName}</div>
                          <div className="text-[10px] text-muted-foreground">{inv.billingContact}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                          {inv.gstin}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-mono">
                          ₹{inv.amountSubtotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-mono">
                          ₹{inv.gstAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground font-mono">
                          ₹{inv.amountTotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill value={inv.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-[11px]">
                          {inv.paymentMethod}
                        </td>
                        <td className="px-4 py-3 text-[10px] text-muted-foreground">
                          <div>Issued: {inv.issueDate}</div>
                          <div>Due: {inv.dueDate}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/admin/employer-billing/invoices/${inv.id || inv.invoiceNumber}`)}
                              className="rounded border border-border bg-card px-2 py-1 text-[11px] font-semibold text-foreground hover:bg-muted"
                            >
                              View GST
                            </button>
                            {inv.status === 'Failed' && (
                              <button
                                onClick={() => handleRetryPayment(inv.invoiceNumber)}
                                className="rounded bg-rose-50 border border-rose-200 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Failed Payment Recovery Callout (BIL-2) */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>
                  <strong>Failed Invoice Notice:</strong> INV-2026-0895 (Vertex Works) failed corporate credit card settlement. Action required before account suspension.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleRetryPayment('INV-2026-0895')}
                  className="rounded bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Retry Payment Now
                </button>
                <button
                  onClick={() => {
                    const f = invoices.find((i) => i.invoiceNumber === 'INV-2026-0895');
                    if (f) handleSendDunningNotice(f);
                  }}
                  className="rounded border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Send Dunning Notice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CREDITS & REFUNDS */}
        {selectedSection === 'Credits & refunds' && (
          <div className="mt-6 space-y-6">
            {/* Top Bar for Credits Tab */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Credits, Refunds & Dispute Casework</h3>
                <p className="text-xs text-muted-foreground">
                  Audit manual goodwill credits, review employer refund requests, and respond to payment gateway disputes.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/employer-billing/adjustments/new')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <Plus size={14} />
                <span>Issue Goodwill Credit</span>
              </button>
            </div>

            {/* Subsection 1: Payment Disputes (3 Canonical Cases from KPI) */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-600" />
                  <h4 className="text-sm font-bold text-foreground">
                    Active Payment Disputes ({disputes.length} Cases)
                  </h4>
                </div>
                <span className="text-xs text-amber-800 font-semibold">
                  3 Cases Recorded in Monthly Audit KPI
                </span>
              </div>

              <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5">Dispute ID</th>
                      <th className="px-4 py-2.5">Employer</th>
                      <th className="px-4 py-2.5">Amount</th>
                      <th className="px-4 py-2.5">Reason</th>
                      <th className="px-4 py-2.5">Gateway</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {disputes.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-mono font-bold text-foreground">{d.id}</td>
                        <td className="px-4 py-2.5 font-semibold text-foreground">{d.companyName}</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-foreground">
                          ₹{d.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground max-w-xs truncate">{d.reason}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[11px]">{d.gateway}</td>
                        <td className="px-4 py-2.5">
                          <StatusPill value={d.status} />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => setSelectedDispute(d)}
                            className="rounded border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted"
                          >
                            Resolve Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 2: Refund Requests Queue */}
            <div>
              <h4 className="text-sm font-bold text-foreground">Employer Refund Requests Queue</h4>
              <p className="text-xs text-muted-foreground">
                Approve or reject invoice refunds within policy windows.
              </p>

              <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5">Request ID</th>
                      <th className="px-4 py-2.5">Invoice #</th>
                      <th className="px-4 py-2.5">Employer</th>
                      <th className="px-4 py-2.5">Amount</th>
                      <th className="px-4 py-2.5">Reason</th>
                      <th className="px-4 py-2.5">Requested Date</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {refunds.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-mono font-bold text-foreground">{r.id}</td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{r.invoiceId}</td>
                        <td className="px-4 py-2.5 font-semibold text-foreground">{r.companyName}</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-foreground">
                          ₹{r.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground max-w-xs truncate">{r.reason}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[11px]">{r.requestedDate}</td>
                        <td className="px-4 py-2.5">
                          <StatusPill value={r.status} />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {r.status === 'Pending Review' ? (
                            <button
                              onClick={() => setSelectedRefund(r)}
                              className="rounded bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                              Review
                            </button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">{r.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 3: Credits Ledger */}
            <div>
              <h4 className="text-sm font-bold text-foreground">Employer Credits Ledger</h4>
              <p className="text-xs text-muted-foreground">
                Historical record of promotional, bonus, and compensation credits issued to employer accounts.
              </p>

              <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5">Credit ID</th>
                      <th className="px-4 py-2.5">Employer</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Value / Credits</th>
                      <th className="px-4 py-2.5">Reason</th>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {credits.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-mono font-bold text-foreground">{c.id}</td>
                        <td className="px-4 py-2.5 font-semibold text-foreground">{c.companyName}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{c.creditType}</td>
                        <td className="px-4 py-2.5 font-semibold text-emerald-700">{c.amountOrCredits}</td>
                        <td className="px-4 py-2.5 text-muted-foreground max-w-sm truncate">{c.reason}</td>
                        <td className="px-4 py-2.5 text-[11px] text-muted-foreground">{c.date}</td>
                        <td className="px-4 py-2.5">
                          <StatusPill value={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== MODALS ===================== */}

      {/* 1. Edit Plan Modal */}
      {editingPlan && (
        <Modal
          isOpen={true}
          onClose={() => setEditingPlan(null)}
          title={`Edit Plan: ${editingPlan.name}`}
          subtitle="Configure pricing tiers, quotas, seats, and SLA guarantees in local state."
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Monthly Price (INR)</label>
                <input
                  type="number"
                  value={editingPlan.priceMonthly}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Annual Price (INR)</label>
                <input
                  type="number"
                  value={editingPlan.priceAnnual}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, priceAnnual: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Team Seats</label>
                <input
                  type="number"
                  value={editingPlan.features.teamSeats}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      features: { ...editingPlan.features, teamSeats: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Featured Job Credits</label>
                <input
                  type="number"
                  value={editingPlan.features.featuredJobCredits}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      features: {
                        ...editingPlan.features,
                        featuredJobCredits: Number(e.target.value),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Support SLA String</label>
              <input
                type="text"
                value={editingPlan.features.supportSla}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    features: { ...editingPlan.features, supportSla: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-muted-foreground">Status</span>
              <select
                value={editingPlan.status}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, status: e.target.value as 'Active' | 'Grandfathered' })
                }
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
              >
                <option value="Active">Active</option>
                <option value="Grandfathered">Grandfathered</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setEditingPlan(null)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Save Plan Parameters
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 2. Add / Edit Package Modal */}
      {(isAddPackageOpen || editingPackage) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddPackageOpen(false);
            setEditingPackage(null);
          }}
          title={editingPackage ? `Edit Package: ${editingPackage.name}` : 'Add New Job Package'}
          subtitle="Configure package pricing, job quotas, spotlight credits and validity period."
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground">Package Name</label>
              <input
                type="text"
                value={editingPackage ? editingPackage.name : newPackage.name}
                onChange={(e) => {
                  const val = e.target.value;
                  if (editingPackage) setEditingPackage({ ...editingPackage, name: val });
                  else setNewPackage({ ...newPackage, name: val });
                }}
                placeholder="e.g. 5-Job Growth Bundle"
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Job Post Quantity</label>
                <input
                  type="number"
                  value={editingPackage ? editingPackage.jobQuantity : newPackage.jobQuantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (editingPackage) setEditingPackage({ ...editingPackage, jobQuantity: val });
                    else setNewPackage({ ...newPackage, jobQuantity: val });
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Price (INR)</label>
                <input
                  type="number"
                  value={editingPackage ? editingPackage.price : newPackage.price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (editingPackage) setEditingPackage({ ...editingPackage, price: val });
                    else setNewPackage({ ...newPackage, price: val });
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Validity (Days)</label>
                <input
                  type="number"
                  value={editingPackage ? editingPackage.validityDays : newPackage.validityDays}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (editingPackage) setEditingPackage({ ...editingPackage, validityDays: val });
                    else setNewPackage({ ...newPackage, validityDays: val });
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground">Featured Spotlight Credits</label>
                <input
                  type="number"
                  value={editingPackage ? editingPackage.featuredCredits : newPackage.featuredCredits}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (editingPackage) setEditingPackage({ ...editingPackage, featuredCredits: val });
                    else setNewPackage({ ...newPackage, featuredCredits: val });
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Package Description</label>
              <textarea
                rows={2}
                value={editingPackage ? editingPackage.description : newPackage.description}
                onChange={(e) => {
                  const val = e.target.value;
                  if (editingPackage) setEditingPackage({ ...editingPackage, description: val });
                  else setNewPackage({ ...newPackage, description: val });
                }}
                placeholder="Brief description of the package bundle..."
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => {
                  setIsAddPackageOpen(false);
                  setEditingPackage(null);
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={editingPackage ? handleSavePackage : handleCreatePackage}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {editingPackage ? 'Save Package' : 'Create Package'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. GST Tax Invoice Details Modal (BIL-2) */}
      {selectedInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          title={`GST Tax Invoice: ${selectedInvoice.invoiceNumber}`}
          subtitle="Compliant tax invoice with employer GSTIN and itemized 18% GST tax summary."
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="rounded-lg border border-border bg-muted/20 p-3 flex justify-between">
              <div>
                <div className="font-bold text-foreground">JobRisers Technologies India Pvt. Ltd.</div>
                <div className="text-[10px] text-muted-foreground">GSTIN: 29AABCJ4499P1Z3 · Bengaluru, KA</div>
              </div>
              <div className="text-right">
                <StatusPill value={selectedInvoice.status} />
                <div className="text-[10px] text-muted-foreground mt-1">Issue Date: {selectedInvoice.issueDate}</div>
              </div>
            </div>

            {/* Billed to */}
            <div className="rounded-lg border border-border p-3">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Billed To</div>
              <div className="font-bold text-sm text-foreground mt-0.5">{selectedInvoice.companyName}</div>
              <div className="text-muted-foreground">Attn: {selectedInvoice.billingContact} ({selectedInvoice.billingEmail})</div>
              <div className="font-mono text-xs text-foreground mt-1">GSTIN: {selectedInvoice.gstin}</div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-right">Taxable Subtotal</th>
                  <th className="p-2.5 text-right">GST (18%)</th>
                  <th className="p-2.5 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-2.5">
                    <div className="font-semibold text-foreground">Employer Plan Subscription / Job Credits</div>
                    <div className="text-[10px] text-muted-foreground">Payment Method: {selectedInvoice.paymentMethod}</div>
                  </td>
                  <td className="p-2.5 text-right font-mono">₹{selectedInvoice.amountSubtotal.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-mono">₹{selectedInvoice.gstAmount.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-bold text-foreground font-mono">
                    ₹{selectedInvoice.amountTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Payment footer */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3">
              <div>Due Date: <strong>{selectedInvoice.dueDate}</strong></div>
              {selectedInvoice.paidDate && <div>Settled Date: <strong>{selectedInvoice.paidDate}</strong></div>}
            </div>

            <div className="flex justify-between items-center border-t border-border pt-4">
              <button
                onClick={() => {
                  triggerToast(
                    `Simulated GST Tax Invoice PDF (${selectedInvoice.invoiceNumber}) downloaded.`,
                    setInvoiceNotice
                  );
                  setSelectedInvoice(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Printer size={14} />
                <span>Print / Download Tax Invoice</span>
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. Refund Review Modal */}
      {selectedRefund && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRefund(null)}
          title={`Review Refund Request: ${selectedRefund.id}`}
          subtitle={`Employer: ${selectedRefund.companyName} · Invoice: ${selectedRefund.invoiceId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <div className="text-muted-foreground">Refund Claim Amount</div>
              <div className="font-display text-xl font-bold text-foreground mt-0.5">
                ₹{selectedRefund.amount.toLocaleString()}
              </div>
              <div className="mt-2 text-muted-foreground">
                <strong>Reason:</strong> {selectedRefund.reason}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Requested on: {selectedRefund.requestedDate}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => handleRefundAction('Rejected')}
                className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                Reject Refund
              </button>
              <button
                onClick={() => handleRefundAction('Approved')}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Approve & Credit Memo
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. Dispute Resolution Modal */}
      {selectedDispute && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDispute(null)}
          title={`Payment Dispute Casework: ${selectedDispute.id}`}
          subtitle={`Company: ${selectedDispute.companyName} · Disputed: ₹${selectedDispute.amount.toLocaleString()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Gateway: {selectedDispute.gateway}</span>
                <StatusPill value={selectedDispute.status} />
              </div>
              <div className="mt-2 text-muted-foreground">
                <strong>Dispute Reason:</strong> {selectedDispute.reason}
              </div>
              {selectedDispute.resolutionNotes && (
                <div className="mt-2 text-[11px] text-foreground border-t border-border/50 pt-2">
                  <strong>Notes:</strong> {selectedDispute.resolutionNotes}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setSelectedDispute(null)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
              <button
                onClick={() => handleResolveDispute(selectedDispute.id, 'Dispute Won')}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Mark Dispute Won
              </button>
              <button
                onClick={() => handleResolveDispute(selectedDispute.id, 'Resolved')}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Resolve Case
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. Issue Goodwill Credit Modal */}
      {isIssueCreditOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsIssueCreditOpen(false)}
          title="Issue Employer Goodwill Credit"
          subtitle="Allocate job posting or featured spotlight credits directly to an employer."
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-foreground">Select Employer</label>
              <select
                value={newCredit.companyName}
                onChange={(e) => setNewCredit({ ...newCredit, companyName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
              >
                <option value="Northstar Labs">Northstar Labs</option>
                <option value="Cloudframe">Cloudframe</option>
                <option value="Pioneer Talent">Pioneer Talent</option>
                <option value="Zenith HealthTech">Zenith HealthTech</option>
                <option value="BrightPath Careers">BrightPath Careers</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Credit Type</label>
                <select
                  value={newCredit.creditType}
                  onChange={(e) =>
                    setNewCredit({
                      ...newCredit,
                      creditType: e.target.value as any,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                >
                  <option value="Job Posting">Job Posting</option>
                  <option value="Featured Spotlight">Featured Spotlight</option>
                  <option value="Promotional Waiver">Promotional Waiver</option>
                  <option value="System Compensation">System Compensation</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-foreground">Value / Quantity</label>
                <input
                  type="text"
                  value={newCredit.amountOrCredits}
                  onChange={(e) =>
                    setNewCredit({ ...newCredit, amountOrCredits: e.target.value })
                  }
                  placeholder="e.g. 2 Job Posts or ₹5,000"
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-foreground">Reason for Allocation</label>
              <input
                type="text"
                value={newCredit.reason}
                onChange={(e) => setNewCredit({ ...newCredit, reason: e.target.value })}
                placeholder="Reason for operational credit..."
                className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                onClick={() => setIsIssueCreditOpen(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueCredit}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Issue Credit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
