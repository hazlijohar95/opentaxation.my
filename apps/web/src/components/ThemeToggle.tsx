import { Sun, Moon } from 'phosphor-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 p-1 bg-muted/50 rounded-lg border border-border/30">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-all duration-300 ${
          resolvedTheme === 'light'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-[var(--blue)]'
        }`}
        aria-label="Switch to light mode"
      >
        <Sun
          weight={resolvedTheme === 'light' ? 'fill' : 'regular'}
          className="h-4 w-4"
        />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-all duration-300 ${
          resolvedTheme === 'dark'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-[var(--blue)]'
        }`}
        aria-label="Switch to dark mode"
      >
        <Moon
          weight={resolvedTheme === 'dark' ? 'fill' : 'regular'}
          className="h-4 w-4"
        />
      </button>
    </div>
  );
}
