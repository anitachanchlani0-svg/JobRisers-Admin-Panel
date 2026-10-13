const fs = require('fs');

let code = `import { useState } from 'react';
import { ClipboardList, ListFilter, FileText, Sparkles, Bell, ShieldAlert, CircleHelp, Activity, Settings2, MoreHorizontal, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { moduleDetails, moduleRecords, type WorkspaceRecord } from '@/mock-data';
import { StatusPill, EmptyState, EmptyInline } from '@/components/ui';

type ModulePageProps = {
  module: string;
  title: string;
  eyebrow: string;
  description: string;
};

export function ModulePage({ module, title, eyebrow, description }: ModulePageProps) {
  const config = moduleDetails[module];
  const Icon = config.icon;
  const [selected, setSelected] = useState(config.sections[0]);
  const [selectedRecord, setSelectedRecord] = useState<WorkspaceRecord | null>(null);
  const records = moduleRecords[module].filter((record) => record.section === selected);

  const renderLayout = () => {
    if (!records.length) {
      return <EmptyState title={\`No \${selected.toLowerCase()} records\`} detail="No sample records are available in this section." />;
    }

    // Analytics Layout (Metrics Cards)
    if (module === 'analytics') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {records.map((record) => (
            <div key={record.title} className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedRecord(record)}>
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{record.section}</div>
                <StatusPill value={record.status} />
              </div>
              <h3 className="text-lg font-bold mb-1">{record.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{record.detail}</p>
              <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-border">
                <span className="text-emerald-600 flex items-center gap-1"><Activity size={14}/> {record.updated}</span>
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
            <div key={record.title} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div>
                <h3 className="text-sm font-bold">{record.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{record.detail}</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-xs text-muted-foreground">{record.updated}</div>
                 <StatusPill value={record.status} />
                 <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-border"><MoreHorizontal size={16}/></button>
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
            <div key={record.title} className="group relative rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedRecord(record)}>
               <div className="h-24 bg-muted flex items-center justify-center text-muted-foreground border-b border-border">
                 <Icon size={24} className="opacity-20 group-hover:opacity-50 transition-opacity group-hover:scale-110 duration-300"/>
               </div>
               <div className="p-3">
                 <h3 className="text-xs font-bold truncate mb-1">{record.title}</h3>
                 <p className="text-[10px] text-muted-foreground truncate mb-2">{record.detail}</p>
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
          <tr className="text-[9px] font-bold tracking-[.1em] text-muted-foreground bg-[#faf9fd]">
            <th className="py-3.5 px-4 rounded-tl-lg">RECORD</th>
            <th className="px-4 py-3.5">STATUS</th>
            <th className="px-4 py-3.5">UPDATED</th>
            <th className="py-3.5 px-4 text-right rounded-tr-lg">DETAILS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/75">
          {records.map((record) => (
            <tr key={record.title} data-testid={\`row-module-\${module}-\${record.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}\`} className="transition-colors hover:bg-[#fbfaff]">
              <td className="max-w-[480px] py-4 px-4">
                <div className="text-[12px] font-semibold">{record.title}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{record.detail}</div>
              </td>
              <td className="px-4 py-4"><StatusPill value={record.status} /></td>
              <td className="whitespace-nowrap px-4 py-4 text-[11px] text-muted-foreground">{record.updated}</td>
              <td className="py-4 px-4 text-right">
                <button data-testid={\`button-inspect-\${module}-\${record.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}\`} onClick={() => setSelectedRecord(record)} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold transition-colors hover:border-primary/30 hover:bg-[#f7f5fd] hover:text-primary">
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
          ['Current section', selected, 'Filtered view below'],
        ].map(([label, value, detail]) => (
          <article key={label} className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)]">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
            <div className="mt-2 truncate text-[22px] font-extrabold tracking-tight">{value}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{detail}</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary"><Icon size={22} /></div>
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-tight">{config.title}</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{config.hint}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
          {config.sections.map((section) => (
            <button key={section} onClick={() => setSelected(section)} aria-pressed={selected === section} className={\`whitespace-nowrap border-b-2 px-3 py-2.5 text-[11px] font-bold transition-colors \${selected === section ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-t-md'}\`}>
              {section}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          {renderLayout()}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 mt-5 text-[10px] text-muted-foreground font-medium">
          <span>Showing {records.length} {selected.toLowerCase()} records</span>
          <span className="flex items-center gap-1.5"><ShieldAlert size={12} /> Read-only preview</span>
        </div>
      </section>

      {selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRecord(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="record-title" className="w-full max-w-[500px] rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[.15em] text-primary uppercase">{selectedRecord.section}</p>
                <h2 id="record-title" className="mt-2 font-display text-xl font-extrabold tracking-tight">{selectedRecord.title}</h2>
              </div>
              <button data-testid="button-close-record" aria-label="Close record details" onClick={() => setSelectedRecord(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"><CheckCircle2 size={20}/></button>
            </div>
            <div className="mt-6 rounded-xl bg-muted/50 p-4 border border-border">
              <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">Details</div>
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
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelectedRecord(null)} className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors">Dismiss</button>
              <button data-testid="button-dismiss-record" onClick={() => setSelectedRecord(null)} className="rounded-xl bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">Take Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/pages/Module.tsx', code);
