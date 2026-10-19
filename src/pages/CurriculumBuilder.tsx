import { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  FileText,
  Video,
  Code,
  Link2,
  HelpCircle,
  Clock,
  Save,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '@/components/ui';
import {
  initialAdminCurricula,
  type AdminInterviewCurriculum,
  type AdminInterviewModule,
  type AdminInterviewLesson,
  type AdminInterviewQuestion,
  type AdminInterviewResource,
} from '@/mock-data';

export function CurriculumBuilderView() {
  const [curricula, setCurricula] = useState<AdminInterviewCurriculum[]>(initialAdminCurricula);
  const [selectedCurriculum, setSelectedCurriculum] = useState<AdminInterviewCurriculum>(initialAdminCurricula[0]);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ 'mod-1': true, 'mod-3': true });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddCurriculumOpen, setIsAddCurriculumOpen] = useState(false);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<AdminInterviewLesson | null>(null);

  // Form states
  const [newCurrTitle, setNewCurrTitle] = useState('');
  const [newCurrCategory, setNewCurrCategory] = useState('System Design');
  const [newCurrDifficulty, setNewCurrDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newCurrSummary, setNewCurrSummary] = useState('');
  const [newCurrRole, setNewCurrRole] = useState('Senior Full Stack Engineer');

  const [newModTitle, setNewModTitle] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonFormat, setNewLessonFormat] = useState<'Video' | 'Interactive Code' | 'Reading' | 'System Design'>('Reading');
  const [newLessonDuration, setNewLessonDuration] = useState(30);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleExpand = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Reordering Modules
  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    const mods = [...selectedCurriculum.modules];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= mods.length) return;
    const temp = mods[index];
    mods[index] = mods[target];
    mods[target] = temp;

    const updatedCurr = { ...selectedCurriculum, modules: mods };
    setSelectedCurriculum(updatedCurr);
    setCurricula((prev) => prev.map((c) => (c.id === updatedCurr.id ? updatedCurr : c)));
    showToast('Module sequence reordered.');
  };

  // Reordering Lessons
  const handleMoveLesson = (modId: string, lessonIndex: number, direction: 'up' | 'down') => {
    const updatedModules = selectedCurriculum.modules.map((m) => {
      if (m.id !== modId) return m;
      const lessons = [...m.lessons];
      const target = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
      if (target < 0 || target >= lessons.length) return m;
      const temp = lessons[lessonIndex];
      lessons[lessonIndex] = lessons[target];
      lessons[target] = temp;
      return { ...m, lessons };
    });

    const updatedCurr = { ...selectedCurriculum, modules: updatedModules };
    setSelectedCurriculum(updatedCurr);
    setCurricula((prev) => prev.map((c) => (c.id === updatedCurr.id ? updatedCurr : c)));
    showToast('Lesson sequence reordered.');
  };

  // Toggle Published
  const handleTogglePublish = (currId: string) => {
    setCurricula((prev) =>
      prev.map((c) => {
        if (c.id !== currId) return c;
        const newStatus = c.status === 'Published' ? 'Draft' : 'Published';
        if (selectedCurriculum.id === currId) {
          setSelectedCurriculum({ ...c, status: newStatus });
        }
        showToast(`Curriculum marked as ${newStatus}.`);
        return { ...c, status: newStatus };
      })
    );
  };

  // Create Curriculum
  const handleCreateCurriculum = () => {
    if (!newCurrTitle.trim()) return;
    const newCurr: AdminInterviewCurriculum = {
      id: `curr-${Date.now()}`,
      title: newCurrTitle.trim(),
      category: newCurrCategory,
      difficulty: newCurrDifficulty,
      summary: newCurrSummary.trim() || 'Curated interview curriculum prepared by staff engineers.',
      targetRoles: [newCurrRole.trim() || 'Software Engineer'],
      status: 'Draft',
      estimatedHours: 4,
      modules: [],
      createdAt: 'Today',
      updatedAt: 'Today',
    };
    setCurricula((prev) => [newCurr, ...prev]);
    setSelectedCurriculum(newCurr);
    setIsAddCurriculumOpen(false);
    setNewCurrTitle('');
    setNewCurrSummary('');
    showToast(`Created new curriculum: ${newCurr.title}`);
  };

  // Add Module
  const handleAddModule = () => {
    if (!newModTitle.trim()) return;
    const newMod: AdminInterviewModule = {
      id: `mod-${Date.now()}`,
      title: newModTitle.trim(),
      order: selectedCurriculum.modules.length + 1,
      lessons: [],
    };
    const updatedCurr = {
      ...selectedCurriculum,
      modules: [...selectedCurriculum.modules, newMod],
    };
    setSelectedCurriculum(updatedCurr);
    setCurricula((prev) => prev.map((c) => (c.id === updatedCurr.id ? updatedCurr : c)));
    setIsAddModuleOpen(false);
    setNewModTitle('');
    setExpandedModules((prev) => ({ ...prev, [newMod.id]: true }));
    showToast(`Added module: ${newMod.title}`);
  };

  // Add Lesson
  const handleAddLesson = () => {
    if (!activeModuleForLesson || !newLessonTitle.trim()) return;
    const newLes: AdminInterviewLesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle.trim(),
      durationMin: newLessonDuration,
      format: newLessonFormat,
      questions: [
        {
          id: `q-${Date.now()}`,
          text: `Sample technical challenge for ${newLessonTitle}`,
          difficulty: 'Medium',
          rubric: 'Candidate must explain architectural trade-offs and edge cases.',
        },
      ],
      resources: [],
    };

    const updatedMods = selectedCurriculum.modules.map((m) =>
      m.id === activeModuleForLesson ? { ...m, lessons: [...m.lessons, newLes] } : m
    );

    const updatedCurr = { ...selectedCurriculum, modules: updatedMods };
    setSelectedCurriculum(updatedCurr);
    setCurricula((prev) => prev.map((c) => (c.id === updatedCurr.id ? updatedCurr : c)));
    setIsAddLessonOpen(false);
    setNewLessonTitle('');
    showToast(`Added lesson to module.`);
  };

  const handleOpenPreview = (lesson?: AdminInterviewLesson) => {
    if (lesson) {
      setPreviewLesson(lesson);
    } else {
      const firstLesson = selectedCurriculum.modules[0]?.lessons[0] || null;
      setPreviewLesson(firstLesson);
    }
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            <BookOpen size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-lg font-extrabold text-foreground">
                Interview Prep Curriculum Builder
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                EXT-3
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                Curriculum &rarr; Module &rarr; Lesson &rarr; Question Bank
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Build structured interview mastery paths with modular lessons, scoring rubrics, and candidate preview drawers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            data-testid="btn-preview-curriculum"
            onClick={() => handleOpenPreview()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-2xs transition-colors cursor-pointer"
          >
            <Eye size={14} className="text-primary" />
            <span>Candidate Preview</span>
          </button>
          <button
            type="button"
            data-testid="btn-create-curriculum"
            onClick={() => setIsAddCurriculumOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Curriculum</span>
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Curricula Catalog (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-foreground px-1">
            <span>Curricula Library</span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {curricula.length} Programs
            </span>
          </div>

          <div className="space-y-2">
            {curricula.map((curr) => {
              const isSelected = curr.id === selectedCurriculum.id;
              const totalLessons = curr.modules.reduce((acc, m) => acc + m.lessons.length, 0);

              return (
                <div
                  key={curr.id}
                  onClick={() => setSelectedCurriculum(curr)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                      {curr.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        curr.status === 'Published'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {curr.status}
                    </span>
                  </div>

                  <div className="mt-2 font-bold text-foreground text-xs leading-snug">
                    {curr.title}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                    <span>
                      {curr.modules.length} Modules &bull; {totalLessons} Lessons
                    </span>
                    <span className="font-semibold text-primary">{curr.estimatedHours}h est.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Module & Lesson Tree (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Curriculum Details Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {selectedCurriculum.difficulty} Level
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Target: {selectedCurriculum.targetRoles.join(', ')}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-foreground mt-1">
                  {selectedCurriculum.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {selectedCurriculum.summary}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(selectedCurriculum.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    selectedCurriculum.status === 'Published'
                      ? 'border border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
                      : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                  }`}
                >
                  {selectedCurriculum.status === 'Published' ? 'Unpublish' : 'Publish to Live'}
                </button>
                <button
                  type="button"
                  data-testid="btn-add-module"
                  onClick={() => setIsAddModuleOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Module</span>
                </button>
              </div>
            </div>
          </div>

          {/* Module & Lessons Accordion Tree */}
          <div className="space-y-3.5">
            {selectedCurriculum.modules.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card text-muted-foreground text-xs space-y-2">
                <Layers size={24} className="mx-auto text-muted-foreground/40" />
                <div className="font-semibold text-foreground">No modules in this curriculum yet</div>
                <p className="text-[11px]">Click 'Add Module' to begin structuring learning milestones.</p>
              </div>
            ) : (
              selectedCurriculum.modules.map((mod, modIdx) => {
                const isExpanded = expandedModules[mod.id] ?? false;

                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs"
                  >
                    {/* Module Header Bar */}
                    <div className="p-4 bg-muted/20 flex items-center justify-between gap-3 border-b border-border/60">
                      <div
                        onClick={() => toggleExpand(mod.id)}
                        className="flex items-center gap-2.5 cursor-pointer flex-1"
                      >
                        <button type="button" className="text-muted-foreground">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <span className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {modIdx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-foreground leading-tight">
                            {mod.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {mod.lessons.length} Lesson{mod.lessons.length !== 1 ? 's' : ''} configured
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={modIdx === 0}
                          onClick={() => handleMoveModule(modIdx, 'up')}
                          className="p-1 rounded-lg border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                          title="Move module up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={modIdx === selectedCurriculum.modules.length - 1}
                          onClick={() => handleMoveModule(modIdx, 'down')}
                          className="p-1 rounded-lg border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                          title="Move module down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModuleForLesson(mod.id);
                            setIsAddLessonOpen(true);
                          }}
                          className="ml-2 inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Lesson</span>
                        </button>
                      </div>
                    </div>

                    {/* Module Lessons Body */}
                    {isExpanded && (
                      <div className="p-3.5 space-y-2">
                        {mod.lessons.length === 0 ? (
                          <div className="py-4 text-center text-muted-foreground text-[11px]">
                            No lessons added yet. Click '+ Add Lesson' above.
                          </div>
                        ) : (
                          mod.lessons.map((les, lesIdx) => (
                            <div
                              key={les.id}
                              className="p-3 rounded-xl border border-border/80 bg-background flex items-center justify-between gap-3 text-xs hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                                  {lesIdx + 1}
                                </span>
                                <div className="truncate">
                                  <div className="font-bold text-foreground truncate flex items-center gap-2">
                                    <span>{les.title}</span>
                                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                                      {les.format}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-muted-foreground flex items-center gap-3 mt-0.5">
                                    <span>{les.durationMin} mins</span>
                                    <span>&bull;</span>
                                    <span>{les.questions.length} Question(s)</span>
                                    {les.resources.length > 0 && (
                                      <>
                                        <span>&bull;</span>
                                        <span>{les.resources.length} Resource(s)</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  disabled={lesIdx === 0}
                                  onClick={() => handleMoveLesson(mod.id, lesIdx, 'up')}
                                  className="p-1 rounded-lg border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                                  title="Move lesson up"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  disabled={lesIdx === mod.lessons.length - 1}
                                  onClick={() => handleMoveLesson(mod.id, lesIdx, 'down')}
                                  className="p-1 rounded-lg border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                                  title="Move lesson down"
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenPreview(les)}
                                  className="p-1 rounded-lg border border-border hover:bg-muted text-primary cursor-pointer"
                                  title="Preview Lesson"
                                >
                                  <Eye size={12} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Curriculum Modal */}
      {isAddCurriculumOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddCurriculumOpen(false)}
          eyebrow="EXT-3 · CURRICULUM BUILDER"
          title="Create New Interview Prep Curriculum"
          maxWidth="max-w-[500px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsAddCurriculumOpen(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCurriculum}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Save Curriculum
              </button>
            </div>
          }
        >
          <div className="space-y-3.5 py-1 text-xs">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Curriculum Title</label>
              <input
                type="text"
                value={newCurrTitle}
                onChange={(e) => setNewCurrTitle(e.target.value)}
                placeholder="e.g. Modern Web Security & Penetration Defense"
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Category</label>
                <select
                  value={newCurrCategory}
                  onChange={(e) => setNewCurrCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="System Design">System Design</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Product Management">Product Management</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Difficulty</label>
                <select
                  value={newCurrDifficulty}
                  onChange={(e) => setNewCurrDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Target Roles</label>
              <input
                type="text"
                value={newCurrRole}
                onChange={(e) => setNewCurrRole(e.target.value)}
                placeholder="e.g. Security Engineer, Lead Pentester"
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Curriculum Summary</label>
              <textarea
                rows={3}
                value={newCurrSummary}
                onChange={(e) => setNewCurrSummary(e.target.value)}
                placeholder="Describe what candidates will master upon completing this curriculum..."
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Add Module Modal */}
      {isAddModuleOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModuleOpen(false)}
          eyebrow="EXT-3 · MODULE STRUCTURING"
          title="Add Module to Curriculum"
          maxWidth="max-w-[460px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsAddModuleOpen(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddModule}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Add Module
              </button>
            </div>
          }
        >
          <div className="space-y-3 py-1 text-xs">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Module Title</label>
              <input
                type="text"
                value={newModTitle}
                onChange={(e) => setNewModTitle(e.target.value)}
                placeholder="e.g. Section 2: Concurrency & Thread Synchronization"
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Add Lesson Modal */}
      {isAddLessonOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddLessonOpen(false)}
          eyebrow="EXT-3 · LESSON COMPOSITION"
          title="Add Lesson to Module"
          maxWidth="max-w-[480px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsAddLessonOpen(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLesson}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Add Lesson
              </button>
            </div>
          }
        >
          <div className="space-y-3 py-1 text-xs">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Lesson Title</label>
              <input
                type="text"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="e.g. Designing Mutex Locks with Deadlock Detection"
                className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Format</label>
                <select
                  value={newLessonFormat}
                  onChange={(e) => setNewLessonFormat(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Reading">Reading / Article</option>
                  <option value="System Design">System Design Walkthrough</option>
                  <option value="Interactive Code">Interactive Code Sandbox</option>
                  <option value="Video">Video Masterclass</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={newLessonDuration}
                  onChange={(e) => setNewLessonDuration(parseInt(e.target.value, 10) || 30)}
                  className="w-full rounded-xl border border-border bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Candidate-Facing Lesson Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPreviewOpen(false)}
          eyebrow="EXT-3 · CANDIDATE LESSON PREVIEW"
          title={previewLesson?.title || selectedCurriculum.title}
          maxWidth="max-w-[700px]"
          footer={
            <div className="flex justify-between items-center w-full text-xs">
              <span className="text-muted-foreground text-[11px]">
                Candidate interactive learning view with questions and evaluation rubric.
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                Close Preview
              </button>
            </div>
          }
        >
          <div className="space-y-4 py-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                {selectedCurriculum.category} &bull; {selectedCurriculum.difficulty}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {previewLesson?.durationMin || 35} mins estimated
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
              <div className="font-bold text-foreground flex items-center gap-2">
                <FileText size={15} className="text-primary" />
                <span>Lesson Concept Overview</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Candidates explore core system constraints, evaluate algorithmic complexity, and structure technical answers aligned with hiring manager expectations.
              </p>
            </div>

            {/* Questions Bank Section */}
            {previewLesson && previewLesson.questions.length > 0 && (
              <div className="space-y-3">
                <div className="font-bold text-foreground flex items-center gap-2">
                  <HelpCircle size={15} className="text-primary" />
                  <span>Interview Assessment Challenge ({previewLesson.questions.length})</span>
                </div>

                {previewLesson.questions.map((q) => (
                  <div key={q.id} className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{q.text}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          q.difficulty === 'Hard'
                            ? 'bg-rose-500/10 text-rose-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
                      <strong className="text-foreground">Evaluation Rubric:</strong> {q.rubric}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
