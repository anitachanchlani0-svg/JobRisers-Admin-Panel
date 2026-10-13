import { CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  detail: string;
}

export function EmptyState({ title, detail }: EmptyStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eeeafd] text-primary"><CheckCircle2 size={19} /></div>
      <h2 className="mt-4 text-[13px] font-bold">{title}</h2>
      <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

interface EmptyInlineProps {
  text: string;
}

export function EmptyInline({ text }: EmptyInlineProps) {
  return <div className="flex items-center gap-2 py-5 text-[11px] text-muted-foreground"><CheckCircle2 size={15} className="text-emerald-600" />{text}</div>;
}