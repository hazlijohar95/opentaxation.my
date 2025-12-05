import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  FloppyDisk,
  Eye,
  PencilSimple,
  Trash,
  CaretDown,
  Image as ImageIcon,
  X,
  Calendar,
  User,
  Clock,
} from 'phosphor-react';
import {
  BlogPost,
  BlogPostInput,
  PostStatus,
  Locale,
  Category,
  Tag,
  Author,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  getTags,
  getAuthors,
} from '@/lib/blog';
import { supabase } from '@/lib/supabase';

// Lazy load heavy components
const RichTextEditor = lazy(() => import('@/components/blog/RichTextEditor'));
const ImageUpload = lazy(() => import('@/components/blog/ImageUpload'));
const TableOfContents = lazy(() => import('@/components/blog/TableOfContents').then(m => ({ default: m.default })));

// Import utilities
import { addIdsToHeadings, extractHeadings } from '@/components/blog/TableOfContents';

const statusOptions: { value: PostStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
];

const localeOptions: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ms', label: 'Bahasa Malaysia' },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatPreviewDate(date?: string | null): string {
  if (!date) return new Date().toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return new Date(date).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogAdminEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isBlogAdmin, isLoading: authLoading } = useAuth();
  const isNew = id === 'new';

  // Redirect if not a blog admin
  if (!authLoading && !isBlogAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Form state
  const [formData, setFormData] = useState<BlogPostInput>({
    slug: '',
    locale: 'en',
    title: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    cover_image_alt: '',
    author_id: '',
    category_id: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    og_image_url: '',
    is_featured: false,
    tag_ids: [],
  });

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Load data
  useEffect(() => {
    loadMetadata();
    if (!isNew && id) {
      loadPost(id);
    }
  }, [id, isNew]);

  const loadMetadata = async () => {
    try {
      const [cats, tgs, auths] = await Promise.all([
        getCategories(),
        getTags(),
        getAuthors(),
      ]);
      setCategories(cats);
      setTags(tgs);
      setAuthors(auths);
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  };

  const loadPost = async (postId: string) => {
    setIsLoading(true);
    try {
      // For admin, we need to fetch by ID, not slug
      // Using direct Supabase query since getPostBySlug only gets published posts
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*),
          tags:blog_post_tags(tag:blog_tags(*))
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      if (!data) {
        setError('Post not found');
        return;
      }

      const post: BlogPost = {
        ...data,
        tags: data.tags?.map((t: { tag: Tag }) => t.tag).filter(Boolean) || [],
      };

      setOriginalPost(post);
      setFormData({
        slug: post.slug,
        locale: post.locale,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        cover_image_url: post.cover_image_url || '',
        cover_image_alt: post.cover_image_alt || '',
        author_id: post.author?.id || '',
        category_id: post.category?.id || '',
        status: post.status,
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        og_image_url: post.og_image_url || '',
        is_featured: post.is_featured,
        tag_ids: post.tags.map((t) => t.id),
      });
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      const reading_time = estimateReadingTime(formData.content);

      const postData: BlogPostInput = {
        ...formData,
        slug,
        reading_time_minutes: reading_time,
      };

      // Set published_at if publishing for the first time
      if (
        formData.status === 'published' &&
        (!originalPost || originalPost.status !== 'published')
      ) {
        postData.published_at = new Date().toISOString();
      }

      if (isNew) {
        const newPost = await createPost(postData);
        navigate(`/dashboard/blog/${newPost.id}`);
      } else if (id) {
        await updatePost(id, postData);
        await loadPost(id);
      }
    } catch (err) {
      console.error('Failed to save post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNew) return;
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(id);
      navigate('/dashboard/blog');
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post');
    }
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = formData.tag_ids || [];
    if (currentTags.includes(tagId)) {
      setFormData({ ...formData, tag_ids: currentTags.filter((t) => t !== tagId) });
    } else {
      setFormData({ ...formData, tag_ids: [...currentTags, tagId] });
    }
  };

  // Sanitize content for preview to prevent XSS attacks
  const sanitizedPreviewContent = useMemo(() => {
    if (!formData.content) return '';
    const contentWithIds = addIdsToHeadings(formData.content);
    return DOMPurify.sanitize(contentWithIds, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'blockquote', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'hr'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'id', 'title', 'width', 'height', 'style'],
      ALLOW_DATA_ATTR: false,
    });
  }, [formData.content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/blog"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft weight="bold" className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? 'New Post' : 'Edit Post'}
            </h1>
            {originalPost && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(originalPost.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'edit'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PencilSimple weight="bold" className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye weight="bold" className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          {!isNew && originalPost?.status === 'published' && (
            <a
              href={`/blog/${originalPost.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              title="View live post"
            >
              <Eye weight="bold" className="h-4 w-4" />
              <span className="hidden sm:inline">Live</span>
            </a>
          )}
          {!isNew && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash weight="bold" className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center justify-between"
        >
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X weight="bold" className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* Preview Mode */}
      {viewMode === 'preview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background border border-border rounded-xl overflow-hidden"
        >
          {/* Preview header */}
          <div className="bg-muted/30 border-b border-border px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Preview</span>
            <span className="text-xs text-muted-foreground">
              This is how your post will appear to readers
            </span>
          </div>

          {/* Preview content */}
          <div className="p-6 md:p-8 max-w-3xl mx-auto">
            {/* Category & Date */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {formData.category_id && categories.find(c => c.id === formData.category_id) && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${categories.find(c => c.id === formData.category_id)?.color}20`,
                    color: categories.find(c => c.id === formData.category_id)?.color,
                  }}
                >
                  {categories.find(c => c.id === formData.category_id)?.name_en}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar weight="fill" className="h-4 w-4" />
                {formatPreviewDate(originalPost?.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock weight="fill" className="h-4 w-4" />
                {estimateReadingTime(formData.content)} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {formData.title || 'Untitled Post'}
            </h1>

            {/* Author */}
            {formData.author_id && (() => {
              const author = authors.find(a => a.id === formData.author_id);
              if (!author) return null;
              return (
                <div className="flex items-center gap-3 mb-8">
                  {author.avatar_url ? (
                    <img
                      src={author.avatar_url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User weight="fill" className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{author.name}</p>
                  </div>
                </div>
              );
            })()}

            {/* Cover Image */}
            {formData.cover_image_url && (
              <div className="relative aspect-[2/1] mb-8 rounded-2xl overflow-hidden bg-muted">
                <img
                  src={formData.cover_image_url}
                  alt={formData.cover_image_alt || formData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Table of Contents */}
            {formData.content && extractHeadings(formData.content).length >= 2 && (
              <Suspense fallback={<div className="h-20 bg-muted/30 rounded-xl animate-pulse mb-8" />}>
                <TableOfContents content={formData.content} className="mb-8" />
              </Suspense>
            )}

            {/* Content */}
            {formData.content ? (
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedPreviewContent }}
              />
            ) : (
              <div className="text-muted-foreground italic">
                No content yet. Start writing in the editor.
              </div>
            )}

            {/* Tags */}
            {formData.tag_ids && formData.tag_ids.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-8 pt-8 border-t border-border/40">
                {formData.tag_ids.map((tagId) => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <span
                      key={tag.id}
                      className="px-3 py-1.5 bg-muted/50 rounded-full text-sm text-muted-foreground"
                    >
                      #{tag.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Form */}
      {viewMode === 'edit' && (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={generateSlug(formData.title) || 'auto-generated-slug'}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
                rows={3}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Content *
              </label>
              <Suspense
                fallback={
                  <div className="h-[300px] border border-border rounded-lg flex items-center justify-center text-muted-foreground">
                    Loading editor...
                  </div>
                }
              >
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your post content here..."
                />
              </Suspense>
            </div>
          </div>

          {/* Right column - settings */}
          <div className="space-y-6">
            {/* Publish settings */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Publish</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as PostStatus })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Language
                </label>
                <select
                  value={formData.locale}
                  onChange={(e) =>
                    setFormData({ ...formData, locale: e.target.value as Locale })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {localeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData({ ...formData, is_featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-foreground">Featured post</span>
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <FloppyDisk weight="bold" className="h-5 w-5" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>

            {/* Category & Author */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Organization</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Author
                </label>
                <select
                  value={formData.author_id}
                  onChange={(e) =>
                    setFormData({ ...formData, author_id: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        formData.tag_ids?.includes(tag.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tags available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Cover Image</h3>

              <Suspense fallback={<div className="aspect-video bg-muted rounded-lg animate-pulse" />}>
                <ImageUpload
                  value={formData.cover_image_url || ''}
                  onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
                  folder="covers"
                />
              </Suspense>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.cover_image_alt}
                  onChange={(e) =>
                    setFormData({ ...formData, cover_image_alt: e.target.value })
                  }
                  placeholder="Describe the image for accessibility"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* SEO settings */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <h3 className="font-semibold text-foreground">SEO Settings</h3>
                <CaretDown
                  weight="bold"
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    showAdvanced ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showAdvanced && (
                <div className="p-4 pt-0 space-y-4 border-t border-border">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) =>
                        setFormData({ ...formData, meta_title: e.target.value })
                      }
                      placeholder={formData.title || 'Page title for search engines'}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) =>
                        setFormData({ ...formData, meta_description: e.target.value })
                      }
                      placeholder={formData.excerpt || 'Description for search engines'}
                      rows={3}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      OG Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.og_image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, og_image_url: e.target.value })
                      }
                      placeholder={formData.cover_image_url || 'Social sharing image'}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
      )}
    </div>
  );
}
