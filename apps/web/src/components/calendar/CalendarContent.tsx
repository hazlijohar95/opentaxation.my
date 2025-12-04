import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Buildings, UsersThree, Briefcase, CalendarCheck, Bell, MapPin, CaretRight, Info } from 'phosphor-react';
import { Card } from '@/components/ui/card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { FloatingLines } from '@/components/ui/floating-lines';
import {
  type EntityType,
  type TaxDeadline,
  entityTypeInfo,
  getDeadlinesByEntity,
  getAllDeadlinesSorted,
} from '@/data/taxDeadlines';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const entityIcons: Record<EntityType, typeof User> = {
  Individual: User,
  Company: Buildings,
  Employer: UsersThree,
  Partnership: Briefcase,
};

interface DeadlineCardProps {
  deadline: TaxDeadline;
  index: number;
}

function DeadlineCard({ deadline, index }: DeadlineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="group p-5 sm:p-6 transition-all duration-500 hover:border-[var(--blue)]/50 hover:shadow-lg hover:shadow-[var(--blue)]/5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm sm:text-base font-semibold bg-muted px-3 py-1 rounded-lg transition-colors duration-500 group-hover:bg-[var(--blue)]/10 group-hover:text-[var(--blue)]">
                {deadline.formCode}
              </span>
              <span className="text-sm text-muted-foreground">{deadline.frequency}</span>
            </div>
            <p className="text-sm sm:text-base text-foreground leading-relaxed">{deadline.description}</p>
            {deadline.notes && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Info weight="fill" className="h-4 w-4" />
                {deadline.notes}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm sm:text-base font-semibold text-foreground transition-colors duration-500 group-hover:text-[var(--blue)]">{deadline.dueDate}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{deadline.month}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface EntitySelectorProps {
  selected: EntityType | null;
  onSelect: (entity: EntityType | null) => void;
}

function EntitySelector({ selected, onSelect }: EntitySelectorProps) {
  const { t } = useTranslation();
  const entities: EntityType[] = ['Individual', 'Company', 'Employer', 'Partnership'];

  const entityTranslations: Record<EntityType, { labelKey: string; descKey: string }> = {
    Individual: { labelKey: 'calendar.entity.individual', descKey: 'calendar.entity.individual.desc' },
    Company: { labelKey: 'calendar.entity.company', descKey: 'calendar.entity.company.desc' },
    Employer: { labelKey: 'calendar.entity.employer', descKey: 'calendar.entity.employer.desc' },
    Partnership: { labelKey: 'calendar.entity.partnership', descKey: 'calendar.entity.partnership.desc' },
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {entities.map((entity) => {
        const Icon = entityIcons[entity];
        const trans = entityTranslations[entity];
        const isSelected = selected === entity;

        return (
          <motion.button
            key={entity}
            onClick={() => onSelect(isSelected ? null : entity)}
            className={`group p-5 rounded-xl border text-left transition-all duration-500 ${
              isSelected
                ? 'border-foreground bg-foreground/5'
                : 'border-border hover:border-[var(--blue)]/50 hover:shadow-lg hover:shadow-[var(--blue)]/5 bg-background'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="space-y-3">
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                  isSelected ? 'border-foreground bg-foreground text-background' : 'border-border group-hover:border-[var(--blue)] group-hover:bg-[var(--blue)]/5'
                }`}
              >
                <Icon weight={isSelected ? 'fill' : 'regular'} className={`h-6 w-6 transition-colors duration-500 ${!isSelected && 'group-hover:text-[var(--blue)]'}`} />
              </div>
              <div>
                <p className={`font-semibold text-base transition-colors duration-500 ${!isSelected && 'group-hover:text-[var(--blue)]'}`}>{t(trans.labelKey)}</p>
                <p className="text-sm text-muted-foreground">{t(trans.descKey)}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function DeadlineTimeline({ deadlines }: { deadlines: TaxDeadline[] }) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {months.map((month, idx) => {
          const monthNum = idx + 1;
          const hasDeadlines = deadlines.some((d) => d.monthNumber === monthNum);
          const isCurrent = monthNum === currentMonth;

          return (
            <div
              key={month}
              className={`flex flex-col items-center min-w-[40px] ${
                hasDeadlines ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {month}
              </span>
              <div
                className={`w-2 h-2 rounded-full mt-1 ${
                  hasDeadlines
                    ? isCurrent
                      ? 'bg-foreground'
                      : 'bg-foreground/50'
                    : 'bg-muted'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FAQSection() {
  const { t } = useTranslation();
  const faqKeys = ['q1', 'q2', 'q3', 'q4'];

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-xl">{t('calendar.faq.title')}</h3>
      <Accordion type="single" collapsible className="space-y-3">
        {faqKeys.map((key) => (
          <AccordionItem
            key={`faq-${key}`}
            value={`item-${key}`}
            className="border border-border rounded-xl px-5 bg-card data-[state=open]:border-foreground/20"
          >
            <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-medium">
              {t(`calendar.faq.${key}`)}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-5 leading-relaxed">
              {t(`calendar.faq.a${key.slice(1)}`)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default function CalendarContent() {
  const { t } = useTranslation();
  const [selectedEntity, setSelectedEntity] = useState<EntityType | null>(null);

  const displayedDeadlines = selectedEntity
    ? getDeadlinesByEntity(selectedEntity)
    : getAllDeadlinesSorted();

  const entityTranslations: Record<EntityType, string> = {
    Individual: t('calendar.entity.individual'),
    Company: t('calendar.entity.company'),
    Employer: t('calendar.entity.employer'),
    Partnership: t('calendar.entity.partnership'),
  };

  const features = [
    { icon: CalendarCheck, labelKey: 'calendar.features.forms' },
    { icon: Bell, labelKey: 'calendar.features.reminders' },
    { icon: MapPin, labelKey: 'calendar.features.malaysia' },
  ];

  return (
    <div className="h-full overflow-y-auto overscroll-contain relative">
      {/* Animated gradient background */}
      <AnimatedBackground />

      {/* Floating decorative lines */}
      <FloatingLines />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 space-y-10 sm:space-y-12 pb-safe">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium">
            <MapPin weight="fill" className="h-4 w-4" />
            {t('calendar.badge')}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            {t('calendar.hero.title.start')}{' '}
            <span className="text-muted-foreground bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
              {t('calendar.hero.title.highlight')}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('calendar.hero.subtitle')}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {features.map(({ icon: Icon, labelKey }) => (
            <div key={labelKey} className="group flex flex-col items-center gap-3 text-center cursor-default">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-border/60 flex items-center justify-center bg-background shadow-sm transition-all duration-500 group-hover:border-[var(--blue)] group-hover:bg-[var(--blue)]/5 group-hover:shadow-md group-hover:shadow-[var(--blue)]/10">
                <Icon weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-500 group-hover:text-[var(--blue)]" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight transition-colors duration-500 group-hover:text-[var(--blue)]">{t(labelKey)}</span>
            </div>
          ))}
        </motion.div>

        {/* Entity Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">{t('calendar.filter.title')}</h2>
            {selectedEntity && (
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('calendar.filter.showAll')}
              </button>
            )}
          </div>
          <EntitySelector selected={selectedEntity} onSelect={setSelectedEntity} />
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <DeadlineTimeline deadlines={displayedDeadlines} />
        </motion.div>

        {/* Deadlines List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">
              {selectedEntity ? `${entityTranslations[selectedEntity]} ${t('calendar.deadlines.title').split(' ').pop()}` : t('calendar.deadlines.title')}
            </h2>
            <span className="text-sm text-muted-foreground">
              {t(displayedDeadlines.length === 1 ? 'calendar.deadlines.count' : 'calendar.deadlines.count_plural', { count: displayedDeadlines.length })}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEntity || 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {displayedDeadlines.map((deadline, index) => (
                <DeadlineCard key={deadline.id} deadline={deadline} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <FAQSection />
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center pb-6 sm:pb-10"
        >
          <a
            href="https://www.hasil.gov.my"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-[var(--blue)] transition-all duration-500 active:opacity-70"
          >
            {t('calendar.footer.lhdn')}
            <CaretRight weight="bold" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
