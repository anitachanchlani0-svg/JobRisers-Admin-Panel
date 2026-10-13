const fs = require('fs');

let code = `import { useState } from 'react';
import { ClipboardList, ListFilter, FileText, Sparkles, Bell, ShieldAlert, CircleHelp, Activity, Settings2 } from 'lucide-react';
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

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Sample records', String(moduleRecords[module].length), 'Preview entries in this workspace'],
          ['Workspace areas', String(config.sections.length), 'Sections available to admins'],
          ['Current section', selected, 'Filtered view below'],
        ].map(([label, value, detail]) => (
          <article key={label} className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[9px] font-semibold text-muted-foreground">{label}</div>
            <div className="mt-2 truncate text-[17px] font-extrabold tracking-tight">{value}</div>
            <div className="mt-1 text-[9px] text-muted-foreground">{detail}</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary"><Icon size={19} /></div>
          <div>
            <h2 className="font-display text-[16px] font-extrabold tracking-tight">{config.title}</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{config.hint}</p>
          </div>
        </div>
        <div className="mt-5 flex gap-1 overflow-x-auto border-b border-border">
          {config.sections.map((section) => (
            <button key={section} onClick={() => setSelected(section)} aria-pressed={selected === section} className={\`whitespace-nowrap border-b-2 px-3 py-2.5 text-[10px] font-semibold transition-colors \${selected === section ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}\`}>
              {section}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          {records.length ? (
            <table className="w-full min-w-[650px] border-collapse text-left mt-5">
              <thead>
                <tr className="text-[9px] font-bold tracking-[.1em] text-muted-foreground">
                  <th className="py-3.5 pr-4">RECORD</th>
                  <th className="px-4 py-3.5">STATUS</th>
                  <th className="px-4 py-3.5">UPDATED</th>
                  <th className="py-3.5 pl-4 text-right">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/75">
                {records.map((record) => (
                  <tr key={record.title} data-testid={\`row-module-\${module}-\${record.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}\`} className="transition-colors hover:bg-[#fbfaff]">
                    <td className="max-w-[480px] py-4 pr-4">
                      <div className="text-[11px] font-semibold">{record.title}</div>
                      <div className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{record.detail}</div>
                    </td>
                    <td className="px-4 py-4"><StatusPill value={record.status} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-[10px] text-muted-foreground">{record.updated}</td>
                    <td className="py-4 pl-4 text-right">
                      <button data-testid={\`button-inspect-\${module}-\${record.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}\`} onClick={() => setSelectedRecord(record)} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold transition-colors hover:border-primary/30 hover:bg-[#f7f5fd] hover:text-primary">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title={\`No \${selected.toLowerCase()} records\`} detail="No sample records are available in this section." />
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 mt-4 text-[9px] text-muted-foreground">
          <span>{records.length} sample records</span>
          <span className="flex items-center gap-1.5"><ShieldAlert size={11} /> Read-only preview · actions are not persisted</span>
        </div>
      </section>

      {selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRecord(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="record-title" className="w-full max-w-[500px] rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold tracking-[.15em] text-primary">{selectedRecord.section.toUpperCase()}</p>
                <h2 id="record-title" className="mt-2 font-display text-lg font-extrabold tracking-tight">{selectedRecord.title}</h2>
              </div>
              <button data-testid="button-close-record" aria-label="Close record details" onClick={() => setSelectedRecord(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">×</button>
            </div>
            <div className="mt-5 rounded-xl bg-muted/70 p-4">
              <div className="text-[9px] font-bold tracking-wide text-muted-foreground">DETAILS</div>
              <p className="mt-2 text-[12px] leading-relaxed">{selectedRecord.detail}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px]">
                <span className="text-muted-foreground">Status</span>
                <StatusPill value={selectedRecord.status} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Last updated</span>
                <span>{selectedRecord.updated}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button data-testid="button-dismiss-record" onClick={() => setSelectedRecord(null)} className="rounded-lg bg-primary px-4 py-2 text-[10px] font-semibold text-primary-foreground">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/pages/Module.tsx', code);
