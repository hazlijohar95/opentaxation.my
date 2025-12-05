import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import {
  CaretLeft,
  Calendar,
  User,
  Tag as TagIcon,
  ShareNetwork,
  Copy,
  Check,
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  WhatsappLogo,
  BookmarkSimple,
  Clock,
  Eye,
} from 'phosphor-react';
import Logo from '@/components/Logo';
import ArticleCard from '@/components/blog/ArticleCard';
import TableOfContents, { addIdsToHeadings, extractHeadings } from '@/components/blog/TableOfContents';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  BlogPost,
  getPostBySlug,
  getRelatedPosts,
  incrementViewCount,
  formatBlogDate,
  getLocalizedField,
  isBookmarked,
  toggleBookmark,
  Locale,
} from '@/lib/blog';

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = language as Locale;
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Fetch article
  useEffect(() => {
    async function loadArticle() {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getPostBySlug(slug, locale);
        if (!data) {
          setError(t('blog.error.notFound', 'Article not found'));
        } else {
          setArticle(data);

          // Increment view count (fire and forget)
          incrementViewCount(slug);

          // Fetch related articles
          const related = await getRelatedPosts(
            data.id,
            data.category?.id || null,
            locale,
            3
          );
          setRelatedArticles(related);

          // Check bookmark status
          if (user?.id) {
            const isBookmarkedStatus = await isBookmarked(data.id, user.id);
            setBookmarked(isBookmarkedStatus);
          }
        }
      } catch (err) {
        setError(t('blog.error.loading', 'Failed to load article'));
        console.error('Error fetching article:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadArticle();
  }, [slug, locale, t, user?.id]);

  // Handle bookmark toggle
  const handleBookmark = async () => {
    if (!user?.id || !article) return;

    setBookmarkLoading(true);
    try {
      const newStatus = await toggleBookmark(article.id, user.id);
      setBookmarked(newStatus);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Share functionality
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article?.title || '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-5 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="aspect-[2/1] bg-muted rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-5 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || t('blog.error.notFound', 'Article not found')}
          </h1>
          <button
            onClick={() => navigate('/blog')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            {t('blog.backToBlog', 'Back to Blog')}
          </button>
        </div>
      </div>
    );
  }

  const ogImageUrl = article.og_image_url || article.cover_image_url;
  const categoryName = article.category
    ? getLocalizedField(article.category, 'name', locale)
    : null;
  const authorBio = article.author
    ? getLocalizedField(article.author, 'bio', locale)
    : null;

  // Process content to add IDs to headings and sanitize for XSS protection
  const processedContent = useMemo(() => {
    const contentWithIds = addIdsToHeadings(article.content);
    return DOMPurify.sanitize(contentWithIds, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'blockquote', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'hr'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'id', 'title', 'width', 'height', 'style'],
      ALLOW_DATA_ATTR: false,
    });
  }, [article.content]);
  const hasTableOfContents = useMemo(
    () => extractHeadings(article.content).length >= 2,
    [article.content]
  );

  return (
    <>
      <Helmet>
        <title>{article.meta_title || article.title} | OpenTaxation.my</title>
        <meta
          name="description"
          content={article.meta_description || article.excerpt || ''}
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.meta_title || article.title} />
        <meta
          property="og:description"
          content={article.meta_description || article.excerpt || ''}
        />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        {article.published_at && (
          <meta property="article:published_time" content={article.published_at} />
        )}
        {article.author && (
          <meta property="article:author" content={article.author.name} />
        )}
        <link rel="canonical" href={shareUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            image: ogImageUrl || undefined,
            datePublished: article.published_at,
            dateModified: article.updated_at,
            author: article.author
              ? {
                  '@type': 'Person',
                  name: article.author.name,
                }
              : undefined,
            publisher: {
              '@type': 'Organization',
              name: 'OpenTaxation.my',
              logo: {
                '@type': 'ImageObject',
                url: 'https://opentaxation.my/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': shareUrl,
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <CaretLeft weight="bold" className="h-4 w-4" />
              {t('blog.backToBlog', 'All Articles')}
            </Link>
          </div>
        </header>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-5 py-8 md:py-12">
          {/* Category & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-sm text-muted-foreground mb-4"
          >
            {categoryName && (
              <Link
                to={`/blog?category=${article.category?.slug}`}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: `${article.category?.color}20`,
                  color: article.category?.color,
                }}
              >
                {categoryName}
              </Link>
            )}
            {article.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar weight="fill" className="h-4 w-4" />
                {formatBlogDate(article.published_at, locale)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock weight="fill" className="h-4 w-4" />
              {article.reading_time_minutes} min read
            </span>
            {article.view_count > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye weight="fill" className="h-4 w-4" />
                {article.view_count.toLocaleString()}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight"
          >
            {article.title}
          </motion.h1>

          {/* Author */}
          {article.author && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-3 mb-8"
            >
              {article.author.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User weight="fill" className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">{article.author.name}</p>
                {authorBio && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {authorBio}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Cover Image */}
          {article.cover_image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-[2/1] mb-8 rounded-2xl overflow-hidden bg-muted"
            >
              <img
                src={article.cover_image_url}
                alt={article.cover_image_alt || article.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Table of Contents */}
          {hasTableOfContents && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-8"
            >
              <TableOfContents content={article.content} />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasTableOfContents ? 0.3 : 0.25 }}
            className="prose prose-lg dark:prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 flex-wrap mb-8 pt-8 border-t border-border/40"
            >
              <TagIcon weight="fill" className="h-5 w-5 text-muted-foreground" />
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/blog?q=${tag.name}`}
                  className="px-3 py-1.5 bg-muted/50 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </motion.div>
          )}

          {/* Share & Bookmark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between py-6 border-t border-b border-border/40"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {t('blog.share', 'Share this article')}
            </span>
            <div className="flex items-center gap-2">
              {/* Bookmark button */}
              {user ? (
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    bookmarked
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/50 hover:bg-muted text-foreground'
                  }`}
                >
                  <BookmarkSimple
                    weight={bookmarked ? 'fill' : 'regular'}
                    className="h-4 w-4"
                  />
                  {bookmarked ? t('blog.bookmarked', 'Saved') : t('blog.bookmark', 'Save')}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted/50 hover:bg-muted text-foreground transition-colors"
                >
                  <BookmarkSimple weight="regular" className="h-4 w-4" />
                  {t('blog.bookmark', 'Save')}
                </Link>
              )}

              {/* Share button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-lg text-sm font-medium transition-colors"
                >
                  <ShareNetwork weight="bold" className="h-4 w-4" />
                  {t('blog.shareButton', 'Share')}
                </button>

                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-lg p-2 min-w-[160px] z-10"
                  >
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check weight="bold" className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy weight="bold" className="h-4 w-4" />
                      )}
                      {copied ? t('blog.copied', 'Copied!') : t('blog.copyLink', 'Copy link')}
                    </button>
                    <a
                      href={shareLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                    >
                      <FacebookLogo weight="fill" className="h-4 w-4 text-[#1877F2]" />
                      Facebook
                    </a>
                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                    >
                      <TwitterLogo weight="fill" className="h-4 w-4 text-[#1DA1F2]" />
                      Twitter
                    </a>
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                    >
                      <LinkedinLogo weight="fill" className="h-4 w-4 text-[#0A66C2]" />
                      LinkedIn
                    </a>
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                    >
                      <WhatsappLogo weight="fill" className="h-4 w-4 text-[#25D366]" />
                      WhatsApp
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-6xl mx-auto px-5 py-12 border-t border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {t('blog.related', 'Related Articles')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relArticle) => (
                <ArticleCard key={relArticle.id} article={relArticle} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
