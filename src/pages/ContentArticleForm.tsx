import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Save,
  CheckCircle2,
  Check,
  Eye,
  Calendar,
  Sparkles,
  Star,
} from 'lucide-react';
import { initialAdminCmsArticles, type AdminCmsArticle } from '@/mock-data';

export function ContentArticleFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';
  const existingArticle = !isNew ? initialAdminCmsArticles.find((a) => a.id === id) : null;

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [category, setCategory] = useState(existingArticle?.category || 'Career Strategy');
  const [author, setAuthor] = useState(existingArticle?.author || 'JobRisers Editorial');
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [coverImage, setCoverImage] = useState(
    existingArticle?.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop'
  );
  const [content, setContent] = useState(existingArticle?.content || '');
  const [seoTitle, setSeoTitle] = useState(existingArticle?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(existingArticle?.seoDescription || '');
  const [status, setStatus] = useState<AdminCmsArticle['status']>(existingArticle?.status || 'Draft');
  const [featured, setFeatured] = useState(existingArticle?.featured ?? false);
  const [scheduledPublishDate, setScheduledPublishDate] = useState(existingArticle?.scheduledPublishDate || '');

  const categories = ['Career Strategy', 'Tech Hiring', 'Compensation', 'Interview Prep'];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (isNew || !existingArticle) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isNew) {
      const newArticle: AdminCmsArticle = {
        id: `art-${Date.now()}`,
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        author: author.trim() || 'JobRisers Editorial',
        excerpt: excerpt.trim(),
        coverImage: coverImage.trim(),
        content: content.trim(),
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim(),
        views: 0,
        publishedDate: new Date().toISOString().split('T')[0],
        status,
        featured,
        scheduledPublishDate: status === 'Scheduled' ? scheduledPublishDate : undefined,
      };
      initialAdminCmsArticles.unshift(newArticle);
    } else if (existingArticle) {
      existingArticle.title = title.trim();
      existingArticle.slug = slug.trim();
      existingArticle.category = category;
      existingArticle.author = author.trim();
      existingArticle.excerpt = excerpt.trim();
      existingArticle.coverImage = coverImage.trim();
      existingArticle.content = content.trim();
      existingArticle.seoTitle = seoTitle.trim();
      existingArticle.seoDescription = seoDescription.trim();
      existingArticle.status = status;
      existingArticle.featured = featured;
      existingArticle.scheduledPublishDate = status === 'Scheduled' ? scheduledPublishDate : undefined;
    }

    navigate('/admin/content');
  };

  if (!isNew && !existingArticle) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/content"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Content CMS
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Article Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No article matching identifier "{id}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/content"
          data-testid="link-back-to-content"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Career Advice & Content
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            {isNew ? 'New Article Editor' : `Article ID: ${existingArticle?.id}`}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            status === 'Published'
              ? 'bg-emerald-50 text-emerald-700'
              : status === 'Scheduled'
              ? 'bg-purple-50 text-purple-700'
              : 'bg-muted text-muted-foreground'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              {isNew ? 'Write New Career Advice Article (CMS-2)' : `Edit Article · ${existingArticle?.title} (CMS-2)`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft career guides, technical interview strategies, SEO metadata, and schedule multi-channel publishing.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <form id="article-form" onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Navigating Multi-Offer Negotiations in Indian Tech"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. navigating-multi-offer-negotiations"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Short Excerpt / Teaser *
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise summary displayed on cards, social cards, and search results..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Article Body (Markdown Supported) *
                </label>
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write complete article content using Markdown format (# Heading, **bold**, etc.)..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" />
                SEO Metadata & OpenGraph
              </h2>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Custom title tag for Google search results..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="155-160 characters search engine snippet description..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Col: Publishing Settings & Media */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Publishing Controls
            </h2>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Author Byline
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Lifecycle Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published (Public)</option>
                <option value="Scheduled">Scheduled Dispatch</option>
              </select>
            </div>

            {status === 'Scheduled' && (
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Scheduled Publish Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={scheduledPublishDate}
                  onChange={(e) => setScheduledPublishDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground text-xs">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-amber-500" />
                  Mark as Featured Editorial Card
                </span>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              {coverImage && (
                <div className="mt-2 h-28 rounded-xl overflow-hidden border border-border">
                  <img src={coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/admin/content')}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="article-form"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 flex items-center gap-1.5"
              >
                <Save size={14} />
                Save Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
