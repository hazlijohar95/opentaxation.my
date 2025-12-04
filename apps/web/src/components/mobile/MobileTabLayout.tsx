import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileHeader from './MobileHeader';
import MobileBottomTabs, { type TabType } from './MobileBottomTabs';

interface MobileTabLayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  inputsContent: React.ReactNode;
  resultsContent: React.ReactNode;
  hasResults: boolean;
  onClearInputs?: () => void;
}

function MobileTabLayout({
  activeTab,
  onTabChange,
  inputsContent,
  resultsContent,
  hasResults,
  onClearInputs,
}: MobileTabLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Compact header */}
      <MobileHeader onClearInputs={onClearInputs} />

      {/* Main content area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          paddingBottom: 'calc(49px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute inset-0 overflow-y-auto overscroll-contain"
          >
            {activeTab === 'inputs' ? inputsContent : resultsContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom tab navigation */}
      <MobileBottomTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        hasResults={hasResults}
      />
    </div>
  );
}

export default memo(MobileTabLayout);
