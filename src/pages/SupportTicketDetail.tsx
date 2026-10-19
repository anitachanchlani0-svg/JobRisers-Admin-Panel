import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CircleHelp,
  Clock,
  User,
  ShieldAlert,
  Send,
  Lock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Layers,
  Tag,
} from 'lucide-react';
import {
  adminSupportTickets,
  type AdminSupportTicketDetail,
  type TicketMessage,
  type TicketInternalNote,
} from '@/mock-data';
import { Avatar, StatusPill } from '@/components/ui';

const agentsList = ['Devika Rao', 'Rahul Sharma', 'Maya Iyer', 'Unassigned'];

export function SupportTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticketsList, setTicketsList] = useState<AdminSupportTicketDetail[]>(adminSupportTickets);

  const ticket = ticketsList.find((t) => t.id === id) || ticketsList[0];

  const [ticketStatus, setTicketStatus] = useState<string>(ticket?.status || 'Open');
  const [assignedAgent, setAssignedAgent] = useState<string>(ticket?.assignedAgent || 'Devika Rao');
  const [messages, setMessages] = useState<TicketMessage[]>(ticket?.conversation || []);
  const [internalNotes, setInternalNotes] = useState<TicketInternalNote[]>(ticket?.internalNotes || []);
  const [composerMode, setComposerMode] = useState<'reply' | 'note'>('reply');
  const [replyText, setReplyText] = useState<string>('');

  useEffect(() => {
    if (ticket) {
      setTicketStatus(ticket.status || 'Open');
      setAssignedAgent(ticket.assignedAgent || 'Devika Rao');
      setMessages(ticket.conversation || []);
      setInternalNotes(ticket.internalNotes || []);
      setReplyText('');
    }
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/support"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Support
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Support ticket not found</h2>
          <p className="text-xs text-muted-foreground mt-1">No ticket matching ID "{id}".</p>
        </div>
      </div>
    );
  }

  const handleStatusTransition = (
    newStatus: 'Open' | 'In Progress' | 'Waiting on Customer' | 'Resolved' | 'Closed'
  ) => {
    setTicketStatus(newStatus);
    const systemMsg: TicketMessage = {
      id: `sys-${Date.now()}`,
      sender: 'System Auto',
      senderRole: 'system',
      timestamp: 'Just now',
      message: `Status transitioned to "${newStatus}" by ${assignedAgent}.`,
    };
    setMessages((prev) => [...prev, systemMsg]);
    setTicketsList((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: newStatus } : t))
    );
  };

  const handleInsertCanned = (content: string) => {
    setReplyText((prev) => (prev ? `${prev}\n\n${content}` : content));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (composerMode === 'reply') {
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        sender: assignedAgent,
        senderRole: 'agent',
        timestamp: 'Just now',
        message: replyText.trim(),
      };
      setMessages((prev) => [...prev, newMsg]);
      if (ticketStatus === 'Open') {
        setTicketStatus('In Progress');
      }
    } else {
      const newNote: TicketInternalNote = {
        id: `note-${Date.now()}`,
        author: assignedAgent,
        timestamp: 'Just now',
        note: replyText.trim(),
      };
      setInternalNotes((prev) => [...prev, newNote]);
    }

    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/support"
          data-testid="link-back-to-support"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Support
        </Link>
        <span className="text-[10px] font-mono text-muted-foreground">Ticket ID: {ticket.ticketId}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CircleHelp size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-primary bg-[#eeeafd] border border-[#d8cbf9] px-2.5 py-0.5 rounded-lg">
                  {ticket.ticketId}
                </span>
                <h1 className="font-display text-lg font-extrabold text-foreground sm:text-xl truncate">
                  {ticket.subject}
                </h1>
                <StatusPill value={ticketStatus} />
              </div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                <span>{ticket.requesterName} ({ticket.requesterEmail})</span>
                <span>·</span>
                <span className="font-semibold text-foreground/80">{ticket.requesterRole}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline mr-1">
              Update Status:
            </span>
            {ticketStatus !== 'In Progress' && ticketStatus !== 'Resolved' && (
              <button
                type="button"
                onClick={() => handleStatusTransition('In Progress')}
                className="rounded-xl bg-blue-50 border border-blue-200/70 px-3 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                In Progress
              </button>
            )}
            {ticketStatus !== 'Resolved' && (
              <button
                type="button"
                onClick={() => handleStatusTransition('Resolved')}
                className="rounded-xl bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                Mark Resolved
              </button>
            )}
            {ticketStatus === 'Resolved' && (
              <button
                type="button"
                onClick={() => handleStatusTransition('Closed')}
                className="rounded-xl bg-muted px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                Close Ticket
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Priority
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                ticket.priority === 'High' || ticket.priority === 'Urgent'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {ticket.priority}
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground">Queue escalation level</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            SLA Remaining
          </div>
          <div
            className={`font-display text-lg font-extrabold ${
              ticket.sla.breached ? 'text-rose-700' : 'text-emerald-700'
            }`}
          >
            {ticket.sla.timeLeft}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {ticket.sla.breached ? 'SLA Target Breached' : 'Within Target SLA'}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Assigned Agent
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {assignedAgent}
          </div>
          <div className="text-[10px] text-muted-foreground">Owner of ticket resolution</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Category
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {ticket.category}
          </div>
          <div className="text-[10px] text-muted-foreground">Classified casework</div>
        </div>
      </section>

      {/* 2. Response SLA & Ticket Governance */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className={ticket.sla.breached ? 'text-rose-600' : 'text-primary'} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Response SLA & Ticket Governance
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold ${
              ticket.sla.breached
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            Due: {ticket.sla.responseDue}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Priority</span>
            <div className="font-bold text-foreground mt-0.5">{ticket.priority}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Category</span>
            <div className="font-semibold text-foreground mt-0.5 truncate">{ticket.category}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Requester Type</span>
            <div className="font-semibold text-foreground mt-0.5">{ticket.requesterRole}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Assigned Agent</span>
            <select
              aria-label="Assigned Support Agent"
              value={assignedAgent}
              onChange={(e) => setAssignedAgent(e.target.value)}
              className="mt-0.5 w-full bg-transparent font-semibold text-foreground outline-none text-xs cursor-pointer"
            >
              {agentsList.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 3. Internal Staff Notes (if any) */}
      {internalNotes.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-amber-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Internal Staff Notes ({internalNotes.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {internalNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl bg-card p-3.5 border border-amber-200/60 text-xs space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{note.author}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{note.timestamp}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{note.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Conversation Thread */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Conversation Thread ({messages.length})
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">Timeline</span>
        </div>

        <div className="space-y-3.5">
          {messages.map((msg) => {
            if (msg.senderRole === 'system') {
              return (
                <div
                  key={msg.id}
                  className="rounded-xl bg-muted/40 px-4 py-2.5 text-center text-[11px] text-muted-foreground border border-border/50"
                >
                  <span className="font-semibold">{msg.sender}:</span> {msg.message}{' '}
                  <span className="font-mono text-[9px]">({msg.timestamp})</span>
                </div>
              );
            }

            const isAgent = msg.senderRole === 'agent';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
                  <span className="font-bold text-foreground">{msg.sender}</span>
                  {isAgent && (
                    <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded font-semibold text-[9px]">
                      Admin Staff
                    </span>
                  )}
                  <span className="font-mono">{msg.timestamp}</span>
                </div>
                <div
                  className={`rounded-2xl p-3.5 max-w-[85%] text-xs leading-relaxed whitespace-pre-line shadow-2xs ${
                    isAgent
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted/70 text-foreground border border-border rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Reply & Internal Note Composer */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-sm">
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setComposerMode('reply')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
                composerMode === 'reply'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Public Reply
            </button>
            <button
              type="button"
              onClick={() => setComposerMode('note')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
                composerMode === 'note'
                  ? 'bg-amber-600 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock size={12} /> Internal Note
            </button>
          </div>

          {/* Canned Responses Quick Insert */}
          {ticket.cannedResponses && ticket.cannedResponses.length > 0 && composerMode === 'reply' && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-muted-foreground font-medium hidden sm:inline">Canned:</span>
              <div className="flex gap-1.5 flex-wrap">
                {ticket.cannedResponses.map((cr) => (
                  <button
                    key={cr.id}
                    type="button"
                    onClick={() => handleInsertCanned(cr.content)}
                    className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[10px] font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {cr.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Area */}
        <form onSubmit={handleSendMessage} className="space-y-3">
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              composerMode === 'reply'
                ? 'Compose reply to requester…'
                : 'Write an internal staff note (visible to admins only)…'
            }
            className="w-full resize-none rounded-xl border border-border bg-card p-3.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {composerMode === 'reply'
                ? 'Will be sent to requester email.'
                : 'Encrypted and restricted to admin logs.'}
            </span>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-opacity disabled:opacity-50 ${
                composerMode === 'reply' ? 'bg-primary hover:opacity-90' : 'bg-amber-600 hover:opacity-90'
              }`}
            >
              <Send size={13} /> {composerMode === 'reply' ? 'Send Reply' : 'Add Note'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
