import { useState } from 'react';
import { Sliders, Cpu } from 'lucide-react';

const recommendationSections = [
  'Algorithm weights',
  'Match score distribution',
  'Candidate boosts',
  'Model evaluation',
];

export function RecommendationsPage() {
  const [selectedSection, setSelectedSection] = useState(recommendationSections[0]);

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Matching model', 'v2.4-hybrid', 'Production candidate-job match model'],
          ['Match CTR', '28.4%', 'Click-through rate on recommendations'],
          ['Daily match runs', '52,400', 'Automated pairing evaluations today'],
        ].map(([label, value, detail]) => (
          <article key={label} className="rounded-2xl border border-border bg-card p-4 shadow-[0_2px_12px_rgba(37,35,80,.025)]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 truncate font-display text-[22px] font-extrabold tracking-tight">{value}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{detail}</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eeeafd] text-primary">
            <Sliders size={22} />
          </div>
          <div>
            <h2 className="font-display text-[18px] font-extrabold tracking-tight">Recommendation engine & tuning</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              Configure candidate-job match weights, inspect match score breakdowns, and tune recommendation distribution.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
          {recommendationSections.map((section) => (
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

        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Cpu size={20} />
          </div>
          <h3 className="mt-3 text-sm font-bold text-foreground">{selectedSection}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Algorithm tuning and match metrics workspace ready for integration.
          </p>
        </div>
      </section>
    </div>
  );
}
