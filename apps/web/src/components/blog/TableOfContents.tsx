import { useState, useEffect, useMemo } from 'react';
import { List, CaretDown } from 'phosphor-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractHeadings(html: string): TocItem[] {
  const headings: TocItem[] = [];
  const regex = /<h([1-3])[^>]*>([^<]+)<\/h[1-3]>/gi;
  let match;
  const usedSlugs = new Set<string>();

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].trim();
    let slug = generateSlug(text);

    // Ensure unique slugs
    let counter = 1;
    const baseSlug = slug;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);

    headings.push({
      id: slug,
      text,
      level,
    });
  }

  return headings;
}

export function addIdsToHeadings(html: string): string {
  const usedSlugs = new Set<string>();

  return html.replace(/<h([1-3])([^>]*)>([^<]+)<\/h[1-3]>/gi, (match, level, attrs, text) => {
    const trimmedText = text.trim();
    let slug = generateSlug(trimmedText);

    // Ensure unique slugs
    let counter = 1;
    const baseSlug = slug;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);

    return `<h${level}${attrs} id="${slug}">${trimmedText}</h${level}>`;
  });
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const headings = useMemo(() => extractHeadings(content), [content]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length < 2) return null;

  return (
    <nav className={`bg-muted/30 border border-border/50 rounded-xl overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <List weight="bold" className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Table of Contents</span>
        </div>
        <CaretDown
          weight="bold"
          className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? '' : '-rotate-90'}`}
        />
      </button>

      {isOpen && (
        <ul className="px-4 pb-4 space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => handleClick(heading.id)}
                className={`
                  w-full text-left text-sm py-1.5 rounded transition-colors
                  ${heading.level === 1 ? 'pl-0 font-medium' : ''}
                  ${heading.level === 2 ? 'pl-4' : ''}
                  ${heading.level === 3 ? 'pl-8 text-xs' : ''}
                  ${
                    activeId === heading.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
