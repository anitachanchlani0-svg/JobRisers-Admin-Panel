import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle2,
  Receipt,
  Building2,
  Calendar,
  CreditCard,
  FileText,
} from 'lucide-react';
import { adminEmployerInvoices, type EmployerInvoice } from '@/mock-data';
import { StatusPill } from '@/components/ui/StatusPill';

export function EmployerBillingInvoiceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const invoice = useMemo(() => {
    return adminEmployerInvoices.find((inv) => inv.id === id || inv.invoiceNumber === id) || adminEmployerInvoices[0];
  }, [id]);

  const [toast, setToast] = useState<string | null>(null);

  const handlePrint = () => {
    setToast(`GST Tax Invoice (${invoice.invoiceNumber}) downloaded.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3.5 shadow-2xl text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground">{toast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/employer-billing')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Return to Employer Billing"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                EMPLOYER BILLING &bull; TAX INVOICE
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; BIL-2</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              GST Tax Invoice: {invoice.invoiceNumber}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/employer-billing')}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Return to Invoices
          </button>
        </div>
      </div>

      {/* Printable Invoice Card */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Receipt size={22} className="text-primary" />
              <h2 className="text-lg font-black text-foreground">JobRisers Technologies India Pvt. Ltd.</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Automated Marketplace Billing & Enterprise Employer Subscriptions
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              GSTIN: <span className="text-foreground font-semibold">29AABCJ4499P1Z3</span> &bull; Bengaluru, Karnataka, India
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <StatusPill value={invoice.status} />
            </div>
            <div className="text-base font-black text-foreground font-mono">{invoice.invoiceNumber}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Issue Date: {invoice.issueDate}</div>
          </div>
        </div>

        {/* Bill To Block */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Billed To
          </span>
          <div className="text-sm font-bold text-foreground">{invoice.companyName}</div>
          <div className="text-xs text-muted-foreground">
            Attn: {invoice.billingContact} ({invoice.billingEmail})
          </div>
          <div className="text-xs font-mono text-muted-foreground pt-1">
            Employer GSTIN: <span className="text-foreground font-semibold">{invoice.gstin}</span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 font-bold text-muted-foreground text-[10px] uppercase border-b border-border">
              <tr>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5 text-right">Taxable Subtotal</th>
                <th className="p-3.5 text-right">GST (18% IGST)</th>
                <th className="p-3.5 text-right">Total Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-3.5">
                  <div className="font-bold text-foreground">Employer Plan Subscription / Job Posting Credits</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Settlement Method: {invoice.paymentMethod} &bull; Transaction Token ID: {invoice.id}
                  </div>
                </td>
                <td className="p-3.5 text-right font-mono text-foreground">
                  ₹{invoice.amountSubtotal.toLocaleString()}
                </td>
                <td className="p-3.5 text-right font-mono text-foreground">
                  ₹{invoice.gstAmount.toLocaleString()}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-foreground text-sm">
                  ₹{invoice.amountTotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Details */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="space-y-0.5">
            <div>Payment Due: <strong className="text-foreground">{invoice.dueDate}</strong></div>
            {invoice.paidDate && (
              <div>Settled Date: <strong className="text-emerald-600 dark:text-emerald-400">{invoice.paidDate}</strong></div>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block">Invoice Grand Total</span>
            <span className="text-2xl font-black text-foreground font-mono">
              ₹{invoice.amountTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
