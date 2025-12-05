import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag as TagIcon } from 'phosphor-react';
import { BlogPost, formatBlogDate, getLocalizedField } from '@/lib/blog';
import { useLanguage } from '@/i18n/LanguageContext';

interface ArticleCardProps {
  article: BlogPost;
  featured?: boolean;
}

function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { language } = useLanguage();

  const categoryName = article.category
    ? getLocalizedField(article.category, 'name', language as 'en' | 'ms')
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group ${featured ? 'md:col-span-2' : ''}`}
    >
      <Link
        to={`/blog/${article.slug}`}
        className="block h-full bg-card rounded-2xl border border-border/40 overflow-hidden hover:border-border/60 hover:shadow-lg transition-all duration-300"
      >
        {/* Cover Image */}
        {article.cover_image_url && (
          <div
            className={`relative overflow-hidden bg-muted ${
              featured ? 'aspect-[2/1]' : 'aspect-[16/9]'
            }`}
          >
            <img
              src={article.cover_image_url}
              alt={article.cover_image_alt || article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {categoryName && (
              <span
                className="absolute top-4 left-4 px-3 py-1.5 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full"
                style={{
                  borderLeft: `3px solid ${article.category?.color || '#3b82f6'}`,
                }}
              >
                {categoryName}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-5 ${featured ? 'md:p-6' : ''}`}>
          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User weight="fill" className="h-3.5 w-3.5" />
                {article.author.name}
              </span>
            )}
            {article.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar weight="fill" className="h-3.5 w-3.5" />
                {formatBlogDate(article.published_at, language as 'en' | 'ms')}
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 ${
              featured ? 'text-xl md:text-2xl' : 'text-lg'
            }`}
          >
            {article.title}
          </h2>

          {/* Excerpt */}
          {article.excerpt && (
            <p
              className={`text-muted-foreground line-clamp-2 ${
                featured ? 'text-base' : 'text-sm'
              }`}
            >
              {article.excerpt}
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <TagIcon weight="fill" className="h-3.5 w-3.5 text-muted-foreground" />
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Reading time */}
          {article.reading_time_minutes > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              {article.reading_time_minutes} min read
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

export default memo(ArticleCard);
