import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MagnifyingGlass, CaretLeft, CaretRight, FunnelSimple, X } from 'phosphor-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import ArticleCard from '@/components/blog/ArticleCard';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  BlogPost,
  Category,
  getPosts,
  getCategories,
  PaginationMeta,
  getLocalizedField,
  Locale,
} from '@/lib/blog';

export default function BlogListPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = language as Locale;
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // URL params
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('q') || '';

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { posts: fetchedPosts, meta } = await getPosts({
        locale,
        page: currentPage,
        pageSize: 9,
        categorySlug: currentCategory || undefined,
        search: currentSearch || undefined,
      });

      setPosts(fetchedPosts);
      setPagination(meta);
    } catch (err) {
      setError(t('blog.error.loading', 'Failed to load articles'));
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [locale, currentPage, currentCategory, currentSearch, t]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Load posts on param change
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Initialize search input from URL
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
      params.delete('category');
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  // Handle category filter
  const handleCategoryFilter = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (categorySlug) {
      params.set('category', categorySlug);
      params.delete('q');
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchParams({ page: '1' });
    setSearchQuery('');
  };

  // Handle pagination
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = currentCategory || currentSearch;

  return (
    <>
      <Helmet>
        <title>{t('blog.title', 'Tax News & Updates')} | OpenTaxation.my</title>
        <meta
          name="description"
          content={t(
            'blog.description',
            'Latest Malaysian tax news, updates, guides, and expert insights for individuals and businesses.'
          )}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" />
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('blog.backToCalculator', 'Back to Calculator')}
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-5 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              {t('blog.hero.title', 'Tax News & Updates')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {t(
                'blog.hero.subtitle',
                'Stay informed with the latest Malaysian tax regulations, tips, and guides.'
              )}
            </motion.p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="max-w-6xl mx-auto px-5 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('blog.search.placeholder', 'Search articles...')}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X weight="bold" className="h-4 w-4" />
                  {t('blog.filter.clear', 'Clear')}
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showFilters || currentCategory
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                <FunnelSimple weight="bold" className="h-4 w-4" />
                {t('blog.filter.categories', 'Categories')}
              </button>
            </div>
          </div>

          {/* Category Filter Dropdown */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !currentCategory
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                {t('blog.filter.all', 'All')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryFilter(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    currentCategory === cat.slug
                      ? 'bg-foreground text-background'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                  style={{
                    borderLeft:
                      currentCategory === cat.slug
                        ? `3px solid ${cat.color}`
                        : undefined,
                  }}
                >
                  {getLocalizedField(cat, 'name', locale)}
                </button>
              ))}
            </motion.div>
          )}

          {/* Active filter indicator */}
          {(currentCategory || currentSearch) && (
            <div className="mt-4 text-sm text-muted-foreground">
              {currentSearch && (
                <span>
                  {t('blog.search.results', 'Search results for')}: &quot;{currentSearch}&quot;
                </span>
              )}
              {currentCategory && (
                <span>
                  {t('blog.filter.showing', 'Showing')}:{' '}
                  {getLocalizedField(
                    categories.find((c) => c.slug === currentCategory) || {
                      name_en: currentCategory,
                      name_ms: currentCategory,
                    },
                    'name',
                    locale
                  )}
                </span>
              )}
            </div>
          )}
        </section>

        {/* Articles Grid */}
        <section className="max-w-6xl mx-auto px-5 pb-16">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border/40 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[16/9] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                {t('blog.error.retry', 'Try Again')}
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {t('blog.empty', 'No articles found.')}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary hover:underline text-sm"
                >
                  {t('blog.filter.clearAndShowAll', 'Clear filters and show all')}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <ArticleCard
                    key={post.id}
                    article={post}
                    featured={index === 0 && currentPage === 1 && !currentSearch}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <CaretLeft weight="bold" className="h-5 w-5" />
                  </button>

                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-foreground text-background'
                              : 'bg-muted/50 hover:bg-muted'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === 2 && currentPage > 3) ||
                      (page === pagination.totalPages - 1 &&
                        currentPage < pagination.totalPages - 2)
                    ) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="p-2 rounded-lg bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <CaretRight weight="bold" className="h-5 w-5" />
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
