import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Question,
  CaretDown,
  CaretUp,
  Lightbulb,
} from 'phosphor-react';

/** Inline help component with lightbulb icon */
export function InlineHelp({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
      <Lightbulb weight="duotone" className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

/** Section header with optional expandable tip */
export function SectionHeader({
  title,
  subtitle,
  tip,
}: {
  title: string;
  subtitle: string;
  tip?: string;
}) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {tip && (
          <button
            type="button"
            onClick={() => setShowTip(!showTip)}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            aria-label={showTip ? 'Hide tip' : 'Show tip'}
          >
            <Question weight="bold" className="h-4 w-4" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {showTip && tip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <InlineHelp>{tip}</InlineHelp>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Collapsible section with animated toggle */
export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-2xl overflow-hidden bg-card">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 min-h-[48px] hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-semibold">{title}</span>
        {isOpen ? (
          <CaretUp weight="bold" className="h-4 w-4 text-muted-foreground" />
        ) : (
          <CaretDown weight="bold" className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
