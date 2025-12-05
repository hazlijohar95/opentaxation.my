import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, CaretDown, CaretUp } from 'phosphor-react';

const NOTES = [
  {
    id: 'salary',
    icon: '💰',
    titleKey: 'inputs.notes.salary.title',
    summaryKey: 'inputs.notes.salary.summary',
    contentKey: 'inputs.notes.salary.content',
  },
  {
    id: 'sdnbhd-salary',
    icon: '🏢',
    titleKey: 'inputs.notes.sdnbhdSalary.title',
    summaryKey: 'inputs.notes.sdnbhdSalary.summary',
    contentKey: 'inputs.notes.sdnbhdSalary.content',
  },
  {
    id: 'epf',
    icon: '🏦',
    titleKey: 'inputs.notes.epf.title',
    summaryKey: 'inputs.notes.epf.summary',
    contentKey: 'inputs.notes.epf.content',
  },
  {
    id: 'compliance',
    icon: '📋',
    titleKey: 'inputs.notes.compliance.title',
    summaryKey: 'inputs.notes.compliance.summary',
    contentKey: 'inputs.notes.compliance.content',
  },
  {
    id: 'dividend-tax',
    icon: '📊',
    titleKey: 'inputs.notes.dividendTax.title',
    summaryKey: 'inputs.notes.dividendTax.summary',
    contentKey: 'inputs.notes.dividendTax.content',
  },
];

export default function EducationalNotes() {
  const { t } = useTranslation();
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardContent className="p-5 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lightbulb weight="duotone" className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wide">{t('inputs.notes.title')}</span>
        </div>

        <div className="space-y-3">
          {NOTES.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
            >
              <button
                type="button"
                onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                className="w-full flex items-start gap-3 p-4 text-left touch-target"
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{note.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{t(note.titleKey)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t(note.summaryKey)}</div>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {expandedNote === note.id ? (
                    <CaretUp weight="bold" className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <CaretDown weight="bold" className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedNote === note.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="pl-9 text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-t border-border/30 pt-4">
                        {t(note.contentKey)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
