import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  PencilSimple,
  Trash,
  Eye,
  FunnelSimple,
  CaretLeft,
  CaretRight,
} from 'phosphor-react';
import {
  BlogPost,
  PostStatus,
  Locale,
  getAdminPosts,
  deletePost,
  PaginationMeta,
} from '@/lib/blog';
import { useAuth } from '@/contexts/AuthContext';

const statusColors: Record<PostStatus, string> = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

const statusLabels: Record<PostStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  scheduled: 'Scheduled',
  archived: 'Archived',
};

export default function BlogAdminList() {
  const navigate = useNavigate();
  const { isBlogAdmin, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PostStatus | ''>('');
  const [localeFilter, setLocaleFilter] = useState<Locale | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not a blog admin
  if (!authLoading && !isBlogAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadPosts();
  }, [page, statusFilter, localeFilter]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { posts: fetchedPosts, meta } = await getAdminPosts({
        page,
        pageSize: 10,
        status: statusFilter || undefined,
        locale: localeFilter || undefined,
      });
      setPosts(fetchedPosts);
      setPagination(meta);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Link
          to="/dashboard/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus weight="bold" className="h-5 w-5" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showFilters || statusFilter || localeFilter
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          <FunnelSimple weight="bold" className="h-4 w-4" />
          Filters
          {(statusFilter || localeFilter) && (
            <span className="ml-1 px-1.5 py-0.5 bg-background/20 rounded text-xs">
              {[statusFilter, localeFilter].filter(Boolean).length}
            </span>
          )}
        </button>

        {pagination && (
          <p className="text-sm text-muted-foreground">
            {pagination.totalCount} post{pagination.totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filter options */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as PostStatus | '');
                setPage(1);
              }}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Language
            </label>
            <select
              value={localeFilter}
              onChange={(e) => {
                setLocaleFilter(e.target.value as Locale | '');
                setPage(1);
              }}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All languages</option>
              <option value="en">English</option>
              <option value="ms">Bahasa Malaysia</option>
            </select>
          </div>

          {(statusFilter || localeFilter) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setLocaleFilter('');
                setPage(1);
              }}
              className="self-end px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      )}

      {/* Posts table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={loadPosts}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No posts found</p>
            <Link
              to="/dashboard/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              <Plus weight="bold" className="h-4 w-4" />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Published
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <p className="font-medium text-foreground truncate">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[post.status]
                        }`}
                      >
                        {statusLabels[post.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground uppercase">
                        {post.locale}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {post.author?.name || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.published_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {post.status === 'published' && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                            title="View"
                          >
                            <Eye weight="bold" className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          to={`/dashboard/blog/${post.id}`}
                          className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <PencilSimple weight="bold" className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash weight="bold" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CaretLeft weight="bold" className="h-5 w-5" />
          </button>

          <span className="px-4 text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
            className="p-2 rounded-lg bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CaretRight weight="bold" className="h-5 w-5" />
          </button>
        </nav>
      )}
    </div>
  );
}
