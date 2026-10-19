import { useState } from 'react';
import {
  Sparkles,
  Bot,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  Save,
  RotateCcw,
  Check,
  ShieldAlert,
  Tag,
  FileText,
  User,
  Building2,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  initialAdminAiCoverLetterConfig,
  type AdminAiCoverLetterConfig,
} from '@/mock-data';

export function AiCoverLetterPage() {
  const [config, setConfig] = useState<AdminAiCoverLetterConfig>(initialAdminAiCoverLetterConfig);
  const [newBuzzword, setNewBuzzword] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<'aarav' | 'priya' | 'rohan'>('aarav');
  const [selectedJob, setSelectedJob] = useState<'frontend' | 'pm' | 'devops'>('frontend');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInsertTag = (tag: string) => {
    setConfig((prev) => ({
      ...prev,
      systemPrompt: `${prev.systemPrompt} {${tag}}`,
    }));
    showToast(`Inserted variable tag: {${tag}}`);
  };

  const handleAddBuzzword = () => {
    const word = newBuzzword.trim().toLowerCase();
    if (!word) return;
    if (!config.bannedBuzzwords.includes(word)) {
      setConfig((prev) => ({
        ...prev,
        bannedBuzzwords: [...prev.bannedBuzzwords, word],
      }));
      showToast(`Added '${word}' to banned buzzwords filter.`);
    }
    setNewBuzzword('');
  };

  const handleRemoveBuzzword = (wordToRemove: string) => {
    setConfig((prev) => ({
      ...prev,
      bannedBuzzwords: prev.bannedBuzzwords.filter((w) => w !== wordToRemove),
    }));
  };

  const handleSimulateGeneration = () => {
    setIsGenerating(true);
    setGeneratedOutput(null);

    setTimeout(() => {
      setIsGenerating(false);

      if (selectedCandidate === 'aarav') {
        setGeneratedOutput(
          `Dear Hiring Team at Northstar Labs,\n\nI was immediately drawn to Northstar Labs' mission to streamline developer workflows with intuitive, human-centered interfaces. With 6.5 years of specialized experience architecting large-scale React and TypeScript frontends, I have repeatedly delivered design systems that bridge engineering rigor with delightful user experience.\n\nIn my recent tenure at DesignFlow, I spearheaded the core design tokens migration to React 19, reducing UI bundle sizes by 28% and slashing onboarding time for junior developers across our Bangalore engineering hubs. My primary stack—React, TypeScript, Next.js, and Jest—directly mirrors the engineering challenges described in your Senior Frontend opening.\n\nWhat excites me most about Northstar Labs is your commitment to performance and thoughtful architecture under high-throughput conditions. I welcome the opportunity to discuss how my background in component modularity and performance profiling can accelerate your product roadmap.\n\nWarm regards,\nAarav Mehta\nBengaluru, KA · aarav.mehta@designflow.io`
        );
      } else if (selectedCandidate === 'priya') {
        setGeneratedOutput(
          `Dear Hiring Manager at Razorpay Technologies,\n\nHaving tracked Razorpay's pioneering leadership across India's UPI switch infrastructure, I am eager to contribute as a Fintech Product Manager. Over the past 5 years driving payment gateways and merchant settlement products, I have specialized in turning complex regulatory requirements into friction-free financial experiences.\n\nAt Fintech Cloud, I spearheaded the instant payout engine integration, handling over ₹450M in monthly gross transaction value while maintaining 99.98% ledger reconciliation uptime. My approach is grounded in SQL data discovery, rigorous PRD authoring, and empathetic merchant interviews.\n\nI would value the chance to explore how my experience navigating NPCI specifications and core banking APIs can support Razorpay's next phase of merchant expansion.\n\nSincerely,\nPriya Sharma\nGurugram, HR · priya.sharma@fintechcloud.in`
        );
      } else {
        setGeneratedOutput(
          `Dear Engineering Leadership at CloudNative Systems,\n\nI am writing to express my strong enthusiasm for the Site Reliability & Cloud Infrastructure role at CloudNative Systems. With 4 years focused on AWS Kubernetes orchestration and Terraform automated deployments, I specialize in building fault-tolerant cloud foundations that eliminate deployment bottlenecks.\n\nDuring my work scaling cloud microservices, I designed Prometheus alert topologies that drove our Mean Time to Detection (MTTD) down by 42%. My core capabilities encompass Docker containerization, CI/CD pipeline automation, and multi-region infrastructure provisioning.\n\nI look forward to discussing how my operational discipline can ensure high uptime and continuous reliability for your engineering teams.\n\nBest regards,\nRohan Verma\nHyderabad, TS · rohan.verma@cloudnative.dev`
        );
      }
      showToast('Generated simulated cover letter preview.');
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Cover letter copied to clipboard.');
  };

  const handleSaveConfig = () => {
    setConfig((prev) => ({
      ...prev,
      lastUpdated: 'Just now (Updated)',
    }));
    showToast('AI Cover Letter fine-tuning rules saved for active model.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3 shadow-2xl text-xs font-semibold text-foreground animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-lg font-extrabold text-foreground">
                AI Cover Letter Fine-Tuner
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                EXT-4
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 border border-indigo-500/30">
                {config.version}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                ● {config.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure system prompts, candidate context tags, stylistic tone, and anti-hallucination guardrails.
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="btn-save-ai-config"
          onClick={handleSaveConfig}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer self-end md:self-auto"
        >
          <Save size={14} />
          <span>Save Fine-Tuning</span>
        </button>
      </div>

      {/* Safety Notice: Mock Preview Disclosure */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">ADMINISTRATIVE CONFIGURATION & SIMULATED PREVIEW ONLY:</strong> Output generated here is a simulated demonstration derived from candidate profile variables. No real production AI API keys are exposed, and no paid LLM tokens are consumed in this preview environment.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Template & Rules (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prompt Engineering Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-foreground flex items-center gap-2">
                <FileText size={15} className="text-primary" />
                <span>System Directive & Persona Template</span>
              </div>
              <span className="text-[10px] text-muted-foreground">v2.4 Core Prompt</span>
            </div>

            <textarea
              rows={8}
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              className="w-full rounded-xl border border-border bg-background p-3 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none leading-relaxed"
            />

            <div>
              <div className="text-[11px] font-bold text-muted-foreground mb-1.5">
                Insert Candidate & Job Context Tags:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'candidate_name',
                  'target_role',
                  'years_experience',
                  'key_skills',
                  'company_name',
                  'job_description',
                  'notable_achievements',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInsertTag(tag)}
                    className="px-2 py-1 rounded-lg border border-border bg-muted/60 text-[10px] font-mono text-foreground hover:bg-primary/10 hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    +{`{${tag}}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tone & Length Parameters */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="text-xs font-bold text-foreground flex items-center gap-2">
              <Sliders size={15} className="text-primary" />
              <span>Tone, Length & Creativity Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Editorial Tone
                </label>
                <select
                  value={config.tone}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tone: e.target.value as AdminAiCoverLetterConfig['tone'],
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Professional & Authoritative">Professional & Authoritative</option>
                  <option value="Enthusiastic & Startup-ready">Enthusiastic & Startup-ready</option>
                  <option value="Technical & Direct">Technical & Direct</option>
                  <option value="Executive & Visionary">Executive & Visionary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Target Length
                </label>
                <select
                  value={config.length}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      length: e.target.value as AdminAiCoverLetterConfig['length'],
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Concise (~200 words)">Concise (~200 words)</option>
                  <option value="Balanced (~350 words)">Balanced (~350 words)</option>
                  <option value="Comprehensive (~500 words)">Comprehensive (~500 words)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-foreground">
                    Temperature (Creativity vs Determinism)
                  </label>
                  <span className="font-mono text-[11px] font-bold text-primary">
                    {config.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={config.temperature}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0.1 (Strict & Factual)</span>
                  <span>0.5 (Balanced)</span>
                  <span>0.9 (Creative Flavour)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality & Safety Guardrails */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="text-xs font-bold text-foreground flex items-center gap-2">
              <ShieldAlert size={15} className="text-primary" />
              <span>Anti-Hallucination & Quality Rules</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Anti-Hallucination Strictness</div>
                  <div className="text-[11px] text-muted-foreground">
                    Strictly bounds claims to verified metrics in candidate profile
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.antiHallucinationStrict}
                  onChange={(e) => setConfig({ ...config, antiHallucinationStrict: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <div className="font-semibold text-foreground">DPDP Automated PII Sanitization</div>
                  <div className="text-[11px] text-muted-foreground">
                    Strips sensitive personal ID credentials from intermediate prompts
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.stripPii}
                  onChange={(e) => setConfig({ ...config, stripPii: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-border">
                <div className="font-semibold text-foreground mb-1.5">Banned Buzzwords Filter</div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {config.bannedBuzzwords.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 px-2 py-0.5 text-[11px] font-medium"
                    >
                      {word}
                      <button
                        type="button"
                        onClick={() => handleRemoveBuzzword(word)}
                        className="hover:text-rose-900 cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBuzzword}
                    onChange={(e) => setNewBuzzword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBuzzword())}
                    placeholder="Add forbidden buzzword (e.g. guru)..."
                    className="flex-1 rounded-xl border border-border bg-background p-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddBuzzword}
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Safe Test Generator & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                <span>Interactive Test Generation</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Mock Engine
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Select Test Candidate Profile
                </label>
                <select
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="aarav">Aarav Mehta (Lead Frontend · React/TS · 6.5y)</option>
                  <option value="priya">Priya Sharma (Fintech PM · UPI Switch · 5.0y)</option>
                  <option value="rohan">Rohan Verma (Cloud DevOps · AWS/K8s · 4.0y)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Select Target Job Posting
                </label>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="frontend">Northstar Labs — Senior Frontend Engineer</option>
                  <option value="pm">Razorpay Technologies — Product Manager (UPI)</option>
                  <option value="devops">CloudNative Systems — Site Reliability Engineer</option>
                </select>
              </div>

              <button
                type="button"
                data-testid="btn-generate-ai-cover-letter"
                disabled={isGenerating}
                onClick={handleSimulateGeneration}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Simulating Prompt Assembly…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Run Test Generation (Mock Preview)</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Output Surface */}
            {generatedOutput && (
              <div className="pt-4 border-t border-border space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    PREVIEW / MOCK OUTPUT
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-border bg-background p-3.5 text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans max-h-[380px] overflow-y-auto">
                  {generatedOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
