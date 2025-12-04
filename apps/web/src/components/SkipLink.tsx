/**
 * Skip link component for accessibility
 * Allows keyboard users to skip to main content
 */
import { Link } from 'react-router-dom';

interface SkipLinkProps {
  to: string;
  children?: React.ReactNode;
}

export default function SkipLink({ to, children = 'Skip to main content' }: SkipLinkProps) {
  return (
    <Link
      to={to}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </Link>
  );
}

