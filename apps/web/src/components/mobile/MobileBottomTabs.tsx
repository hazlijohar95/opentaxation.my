import { memo } from 'react';
import { motion } from 'framer-motion';
import { NotePencil, ChartBar } from 'phosphor-react';

export type TabType = 'inputs' | 'results';

interface MobileBottomTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasResults?: boolean;
}

const tabs = [
  { id: 'inputs' as const, label: 'Inputs', icon: NotePencil },
  { id: 'results' as const, label: 'Results', icon: ChartBar },
];

function MobileBottomTabs({ activeTab, onTabChange, hasResults = false }: MobileBottomTabsProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch h-[49px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const showBadge = tab.id === 'results' && hasResults && !isActive;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 active:bg-muted/30"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Icon container */}
              <div className="relative">
                <Icon
                  weight={isActive ? 'fill' : 'regular'}
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />

                {/* Badge indicator */}
                {showBadge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    }}
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full shadow-sm"
                    aria-label="New results available"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                style={{ letterSpacing: '-0.02em' }}
              >
                {tab.label}
              </span>

              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default memo(MobileBottomTabs);
