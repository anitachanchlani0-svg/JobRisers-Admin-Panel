import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  ListFilter,
  FileText,
  Sparkles,
  Bell,
  ShieldAlert,
  CircleHelp,
  Activity,
  Settings2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Edit2,
  RotateCcw,
  Eye,
  CheckCircle2,
  Mail,
  Globe,
  Search,
  Info,
} from 'lucide-react';
import {
  moduleDetails,
  moduleRecords,
  adminApplications,
  adminSupportTickets,
  adminApplicationStageMappings,
  type WorkspaceRecord,
  type AdminApplicationDetail,
  type AdminSupportTicketDetail,
  type ApplicationStageMapping,
} from '@/mock-data';
import { StatusPill, EmptyState, EmptyInline, Modal } from '@/components/ui';

type ModulePageProps = {
  module: string;
  title: string;
  eyebrow: string;
  description: string;
};

export function ModulePage({ module, title, eyebrow, description }: ModulePageProps) {
  const navigate = useNavigate();
  const config = moduleDetails[module];
  const Icon = config.icon;
  const [selected, setSelected] = useState(config.sections[0]);
  const [selectedRecord, setSelectedRecord] = useState<WorkspaceRecord | null>(null);

  useEffect(() => {
    setSelected(config.sections[0]);
  }, [module, config.sections]);

  const activeSection = config.sections.includes(selected) ? selected : config.sections[0];

  const [applicationsList] = useState<AdminApplicationDetail[]>(adminApplications);
  const [ticketsList] = useState<AdminSupportTicketDetail[]>(adminSupportTickets);
  const [stageMappings, setStageMappings] = useState<ApplicationStageMapping[]>(adminApplicationStageMappings);

  const records = moduleRecords[module].filter((record) => record.section === activeSection);

  const handleInspect = (record: WorkspaceRecord) => {
    if (module === 'applications') {
      const match =
        applicationsList.find((app) => app.recordTitle === record.title) ||
        applicationsList[0];
      navigate(`/applications/${match.id}`);
      return;
    }

    if (module === 'support') {
      const match =
        ticketsList.find((t) => t.recordTitle === record.title || t.subject.includes(record.title)) ||
        ticketsList[0];
      navigate(`/support/${match.id}`);
      return;
    }

    // Default inspection modal for all other modules
    setSelectedRecord(record);
  };

  const renderLayout = () => {
    // Applications: Dedicated Stage Mapping View
    if (module === 'applications' && activeSection === 'Stage mapping') {
      return (
        <StageMappingView
          mappings={stageMappings}
          onUpdateMapping={(updated) => {
            setStageMappings((prev) =>
              prev.map((m) => (m.id === updated.id ? updated : m))
            );
          }}
          onResetDefaults={() => {
            setStageMappings(adminApplicationStageMappings);
          }}
          onToggleStatus={(mappingId) => {
            setStageMappings((prev) =>
              prev.map((m) =>
                m.id === mappingId
                  ? { ...m, status: m.status === 'Active' ? 'Paused' : 'Active' }
                  : m
              )
            );
          }}
        />
      );
    }

    if (!records.length) {
      return (
        <EmptyState
          title={`No ${activeSection.toLowerCase()} records`}
          detail="No sample records are available in this section."
        />
      );
    }

    // Analytics Layout (Metrics Cards)
    if (module === 'analytics') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {records.map((record) => (
            <div
              key={record.title}
              className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {record.section}
                </div>
                <StatusPill value={record.status} />
              </div>
              <h3 className="text-lg font-bold mb-1">{record.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{record.detail}</p>
              <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-border">
                <span className="text-emerald-600 flex items-center gap-1">
                  <Activity size={14} /> {record.updated}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Settings / Master Data Layout (List with Toggle/Action)
    if (module === 'settings' || module === 'master-data') {
      return (
        <div className="mt-5 border border-border rounded-2xl overflow-hidden bg-card divide-y divide-border/75">
          {records.map((record) => (
            <div
              key={record.title}
              className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div>
                <h3 className="text-sm font-bold">{record.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{record.detail}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground">{record.updated}</div>
                <StatusPill value={record.status} />
                <button
                  type="button"
                  aria-label="More options"
                  onClick={() => setSelectedRecord(record)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-border"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Content / Resume Pro Layout (Grid Cards)
    if (module === 'content' || module === 'resume-pro') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {records.map((record) => (
            <div
              key={record.title}
              className="group relative rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="h-24 bg-muted flex items-center justify-center text-muted-foreground border-b border-border">
                <Icon
                  size={24}
                  className="opacity-20 group-hover:opacity-50 transition-opacity group-hover:scale-110 duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="text-xs font-bold line-clamp-2 leading-tight mb-1">{record.title}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug mb-2">{record.detail}</p>
                <div className="flex justify-between items-center">
                  <StatusPill value={record.status} />
                  <span className="text-[9px] text-muted-foreground">{record.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default Table Layout (Applications, Comm, Trust, Support)
    return (
      <table className="w-full min-w-[650px] border-collapse text-left mt-5">
        <thead>
          <tr className="text-[9px] font-bold tracking-[.12em] text-muted-foreground bg-[#faf9fd] uppercase">
            <th className="py-3.5 px-4 rounded-tl-lg">RECORD</th>
            <th className="px-4 py-3.5">STATUS</th>
            <th className="px-4 py-3.5">UPDATED</th>
            <th className="py-3.5 px-4 text-right rounded-tr-lg">DETAILS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/75">
          {records.map((record) => (
            <tr
              key={record.title}
              data-testid={`row-module-${module}-${record.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}
              className="transition-colors hover:bg-[#fbfaff] cursor-pointer"
              onClick={() => handleInspect(record)}
            >
              <td className="max-w-[480px] py-4 px-4">
                <div className="text-[12px] font-semibold">{record.title}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {record.detail}
                </div>
              </td>
              <td className="px-4 py-4">
                <StatusPill value={record.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-[11px] text-muted-foreground">
                {record.updated}
              </td>
              <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  data-testid={`button-inspect-${module}-${record.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInspect(record);
                  }}
                  className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold transition-colors hover:border-primary/30 hover:bg-[#f7f5fd] hover:text-primary"
                >
                  Inspect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Sample records', String(moduleRecords[module].length), 'Preview entries in this workspace'],
          ['Workspace areas', String(config.sections.length), 'Sections available to admins'],
          ['Current section', activeSection, 'Filtered view below'],
        ].map(([label, value, detail]) => (
          <article
            key={label}
            className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)] flex flex-col justify-between"
          >
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
              {label}
            </div>
            <div className="mt-2 truncate text-[22px] font-extrabold tracking-tight">{value}</div>
            <div className="mt-1 text-[10px] text-muted-foreground leading-snug line-clamp-2">{detail}</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary">
            <Icon size={22} />
          </div>
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-tight">{config.title}</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{config.hint}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
          {config.sections.map((section) => (
            <button
              key={section}
              onClick={() => setSelected(section)}
              aria-pressed={activeSection === section}
              className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[11px] font-bold transition-colors ${
                activeSection === section
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-t-md'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
        <div className="relative overflow-x-auto">
          {renderLayout()}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-card to-transparent sm:hidden" />
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 mt-5 text-[10px] text-muted-foreground font-medium">
          <span>
            Showing {records.length} {activeSection.toLowerCase()} records
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldAlert size={12} /> Read-only preview
          </span>
        </div>
      </section>

      {/* GENERIC RECORD MODAL FOR OTHER MODULES (Analytics, Master Data, Content, etc.) */}
      <Modal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        eyebrow={selectedRecord?.section}
        title={selectedRecord?.title}
        closeButtonTestId="button-close-record"
        maxWidth="max-w-[500px]"
        footer={
          <>
            <button
              onClick={() => setSelectedRecord(null)}
              className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors"
            >
              Dismiss
            </button>
            <button
              data-testid="button-dismiss-record"
              onClick={() => setSelectedRecord(null)}
              className="rounded-xl bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              Take Action
            </button>
          </>
        }
      >
        {selectedRecord && (
          <div className="rounded-xl bg-muted/50 p-4 border border-border">
            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">
              Details
            </div>
            <p className="text-[13px] leading-relaxed text-foreground/90">{selectedRecord.detail}</p>

            <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4 text-[11px]">
              <span className="text-muted-foreground font-semibold">Status</span>
              <StatusPill value={selectedRecord.status} />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground font-semibold">Last updated</span>
              <span className="font-mono text-foreground/80">{selectedRecord.updated}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

interface StageMappingViewProps {
  mappings: ApplicationStageMapping[];
  onUpdateMapping: (updated: ApplicationStageMapping) => void;
  onResetDefaults: () => void;
  onToggleStatus: (mappingId: string) => void;
}

function StageMappingView({
  mappings,
  onUpdateMapping,
  onResetDefaults,
  onToggleStatus,
}: StageMappingViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [editingMapping, setEditingMapping] = useState<ApplicationStageMapping | null>(null);
  const [editForm, setEditForm] = useState<ApplicationStageMapping | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleOpenEdit = (mapping: ApplicationStageMapping) => {
    setEditingMapping(mapping);
    setEditForm({ ...mapping });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    onUpdateMapping(editForm);
    setEditingMapping(null);
    setEditForm(null);
  };

  const filteredMappings = mappings.filter((m) => {
    const matchesSearch =
      m.candidateStage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.adminStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.candidateDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All statuses' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mappings.filter((m) => m.status === 'Active').length;
  const notifyCount = mappings.filter((m) => m.notifyCandidate).length;

  return (
    <div className="space-y-6 mt-4">
      {/* 1. Header Metrics / KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Configured Stages</div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-foreground">{mappings.length}</span>
            <span className="text-[10px] text-muted-foreground font-medium">pipeline steps</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Candidate milestones defined</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Mappings</div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-600">{activeCount} / {mappings.length}</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Operational</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Active in candidate portal</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Notifications</div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-primary">{notifyCount}</span>
            <span className="text-[10px] text-primary/80 font-medium">Triggers active</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Auto emails on status sync</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ATS Alignment</div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-foreground">5 Stages</span>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">Aligned</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Synced with recruiter ATS</p>
        </div>
      </div>

      {/* 2. Toolbar: Search, Filter, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search candidate stage or admin status…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-[11px] outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-xl border border-border bg-card px-3 text-[11px] font-medium outline-none transition focus:border-primary/50"
          >
            <option value="All statuses">All statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            data-testid="btn-preview-candidate-experience"
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors shadow-sm"
          >
            <Eye size={14} /> Preview candidate experience
          </button>
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            data-testid="btn-reset-defaults"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            <RotateCcw size={13} /> Reset defaults
          </button>
        </div>
      </div>

      {/* 3. Stage Mapping Configuration Table */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table
          data-testid="stage-mapping-table"
          className="w-full min-w-[900px] border-collapse text-left"
        >
          <thead>
            <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase border-y border-border/80">
              <th className="py-3 px-3.5 w-16 text-center">STEP</th>
              <th className="py-3 px-3.5 min-w-[240px]">CANDIDATE-FACING STAGE</th>
              <th className="py-3 px-3.5 min-w-[260px]">MAPPED ADMIN STATUS</th>
              <th className="py-3 px-3.5 min-w-[170px]">NOTIFICATION & SYNC</th>
              <th className="py-3 px-3.5 whitespace-nowrap">STATUS</th>
              <th className="py-3 px-3.5 whitespace-nowrap">UPDATED</th>
              <th className="py-3 px-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/75">
            {filteredMappings.map((mapping) => (
              <tr
                key={mapping.id}
                data-testid={`row-stage-mapping-${mapping.id}`}
                className="transition-colors hover:bg-[#fbfaff]"
              >
                {/* Step / Order */}
                <td className="py-3.5 px-3.5 text-center align-top">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-extrabold">
                    #{mapping.order}
                  </span>
                </td>

                {/* Candidate-Facing Stage */}
                <td className="py-3.5 px-3.5 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-foreground">
                        {mapping.candidateStage}
                      </span>
                      {mapping.portalVisible ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                          <Globe size={10} /> Portal visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                          Portal hidden
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      "{mapping.candidateDescription}"
                    </p>
                  </div>
                </td>

                {/* Mapped Admin Status */}
                <td className="py-3.5 px-3.5 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ArrowRight size={13} className="text-muted-foreground shrink-0" />
                      <StatusPill value={mapping.adminStatus} />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                      {mapping.description}
                    </p>
                  </div>
                </td>

                {/* Notification & Sync */}
                <td className="py-3.5 px-3.5 align-top">
                  {mapping.notifyCandidate ? (
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/60 bg-emerald-50/70 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                      <Mail size={12} className="text-emerald-600" />
                      Auto email enabled
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                      <Mail size={12} className="opacity-40" />
                      No notification
                    </div>
                  )}
                  <div className="mt-1 text-[10px] text-muted-foreground/80 pl-1">
                    {mapping.notifyCandidate ? 'Triggers on stage entry' : 'Silent internal transition'}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                  <StatusPill value={mapping.status} />
                </td>

                {/* Updated */}
                <td className="py-3.5 px-3.5 align-top whitespace-nowrap text-[11px] text-muted-foreground">
                  {mapping.lastUpdated}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-3.5 align-top text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      data-testid={`btn-configure-${mapping.id}`}
                      onClick={() => handleOpenEdit(mapping)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[10px] font-bold text-foreground transition-colors hover:border-primary/40 hover:bg-[#f7f5fd] hover:text-primary"
                    >
                      <Edit2 size={11} /> Configure
                    </button>
                    <button
                      type="button"
                      data-testid={`btn-toggle-status-${mapping.id}`}
                      onClick={() => onToggleStatus(mapping.id)}
                      className="rounded-lg border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {mapping.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Configure Modal */}
      <Modal
        isOpen={Boolean(editingMapping && editForm)}
        onClose={() => {
          setEditingMapping(null);
          setEditForm(null);
        }}
        dataTestId="modal-configure-stage-mapping"
        eyebrow="STAGE MAPPING CONFIGURATION"
        title={editForm ? `Configure: ${editForm.candidateStage} → ${editForm.adminStatus}` : 'Configure Stage'}
        subtitle="Map the candidate-facing experience directly to your internal recruiter pipeline status."
        maxWidth="max-w-[560px]"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => {
                setEditingMapping(null);
                setEditForm(null);
              }}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="btn-save-stage-mapping"
              onClick={handleSaveEdit}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              Save Configuration
            </button>
          </div>
        }
      >
        {editForm && (
          <form onSubmit={handleSaveEdit} className="space-y-4 py-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Candidate-Facing Stage Name
                </label>
                <input
                  type="text"
                  value={editForm.candidateStage}
                  onChange={(e) => setEditForm({ ...editForm, candidateStage: e.target.value })}
                  className="w-full h-9 rounded-xl border border-border bg-card px-3 text-[12px] font-medium text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  required
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Shown on candidate job tracker</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Mapped Admin Status (ATS)
                </label>
                <select
                  value={editForm.adminStatus}
                  onChange={(e) => setEditForm({ ...editForm, adminStatus: e.target.value })}
                  className="w-full h-9 rounded-xl border border-border bg-card px-3 text-[12px] font-medium text-foreground outline-none focus:border-primary/50"
                >
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Closed">Closed</option>
                </select>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Internal recruiter status</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1">
                Candidate Dashboard Message
              </label>
              <textarea
                rows={3}
                value={editForm.candidateDescription}
                onChange={(e) => setEditForm({ ...editForm, candidateDescription: e.target.value })}
                className="w-full rounded-xl border border-border bg-card p-3 text-[12px] font-medium text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 leading-relaxed"
                placeholder="Message displayed to candidates on their status tracking timeline…"
                required
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Visible to candidate in their application status box</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1">
                Admin / Recruiter Workflow Description
              </label>
              <textarea
                rows={2}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full rounded-xl border border-border bg-card p-3 text-[12px] font-medium text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 leading-relaxed"
                placeholder="Internal explanation of this pipeline transition…"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Internal notes for hiring managers and operations admins</span>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.notifyCandidate}
                  onChange={(e) => setEditForm({ ...editForm, notifyCandidate: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-[11px] font-semibold text-foreground">
                  Send automated email notification when candidate enters this stage
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.portalVisible}
                  onChange={(e) => setEditForm({ ...editForm, portalVisible: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-[11px] font-semibold text-foreground">
                  Make this stage visible on candidate progress timeline
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="font-semibold text-muted-foreground">Mapping Operational Status:</span>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Paused' })}
                className="h-8 rounded-lg border border-border bg-card px-2.5 text-[11px] font-bold"
              >
                <option value="Active">Active (In use)</option>
                <option value="Paused">Paused (Inactive)</option>
              </select>
            </div>
          </form>
        )}
      </Modal>

      {/* 5. Candidate Experience Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        dataTestId="modal-candidate-experience-preview"
        eyebrow="CANDIDATE DASHBOARD PREVIEW"
        title="Candidate Application Tracker Experience"
        subtitle="Simulated preview of how candidates experience their application milestones in the JobRisers portal."
        maxWidth="max-w-[620px]"
        footer={
          <div className="flex justify-end w-full">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              Close Preview
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-1">
          {/* Simulated Candidate Header */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Application</span>
                <h4 className="text-[14px] font-extrabold text-foreground mt-0.5">Senior Product Designer</h4>
                <p className="text-[11px] text-muted-foreground">Northstar Labs · Bengaluru, KA (Hybrid) · Applied Oct 12, 2026</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                In Progress
              </span>
            </div>

            {/* Stepper Progression */}
            <div className="mt-5 pt-4 border-t border-border">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Milestone Progress Timeline
              </div>
              <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-muted-foreground/20 z-0" />
                <div className="absolute top-1/2 left-4 w-1/2 -translate-y-1/2 h-0.5 bg-primary z-0" />

                {[
                  { label: 'Applied', status: 'completed', step: 1 },
                  { label: 'Under Review', status: 'completed', step: 2 },
                  { label: 'Interview Scheduled', status: 'current', step: 3 },
                  { label: 'Offer Received', status: 'upcoming', step: 4 },
                ].map((s) => (
                  <div key={s.label} className="relative z-10 flex flex-col items-center">
                    {s.status === 'completed' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                        <CheckCircle2 size={15} />
                      </div>
                    )}
                    {s.status === 'current' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary shadow-sm ring-4 ring-primary/10">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                      </div>
                    )}
                    {s.status === 'upcoming' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-card border-2 border-border text-muted-foreground text-[10px] font-bold">
                        {s.step}
                      </div>
                    )}
                    <span className={`mt-1.5 text-[10px] font-bold text-center max-w-[80px] leading-tight ${
                      s.status === 'current' ? 'text-primary' : s.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Stage Highlight Box */}
            <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Current Milestone Message</span>
                <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.2 rounded">Stage 3 of 4</span>
              </div>
              <p className="text-[12px] font-medium text-foreground leading-relaxed">
                "Congratulations! The company has invited you for an interview. Check your inbox for the calendar link."
              </p>
            </div>
          </div>

          {/* Recruiter Mapping Alignment Info */}
          <div className="rounded-xl bg-muted/40 border border-border p-3 text-[11px] text-muted-foreground space-y-1">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Info size={13} className="text-primary" /> Recruiter Synchronization Notes:
            </div>
            <p className="text-[10px] leading-relaxed">
              When recruiters move an application to internal ATS status <strong className="text-foreground">"Interview"</strong>, candidates see <strong className="text-foreground">"Interview Scheduled"</strong> and automated prep guides are triggered.
            </p>
          </div>
        </div>
      </Modal>

      {/* 6. Reset Defaults Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        dataTestId="modal-reset-defaults-confirm"
        eyebrow="CONFIRM RESET"
        title="Reset Stage Mappings to Defaults?"
        subtitle="This action will restore all 6 standard JobRisers stage mappings (Applied, Under Review, Interview Scheduled, Offer Received, Not Selected, Withdrawn)."
        maxWidth="max-w-[480px]"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="btn-confirm-reset-defaults"
              onClick={() => {
                onResetDefaults();
                setIsResetConfirmOpen(false);
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        }
      >
        <div className="py-2 text-[12px] text-muted-foreground leading-relaxed">
          Any customized candidate messages, visibility settings, or notification rules will be overwritten with platform defaults. Are you sure you wish to proceed?
        </div>
      </Modal>
    </div>
  );
}
