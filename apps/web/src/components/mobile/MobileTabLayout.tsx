import { memo, useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion';
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

// Swipe configuration
const SWIPE_THRESHOLD = 0.3; // 30% of screen width
const SWIPE_VELOCITY_THRESHOLD = 0.3; // velocity in px/ms
const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 35,
  mass: 0.8,
};

function MobileTabLayout({
  activeTab,
  onTabChange,
  inputsContent,
  resultsContent,
  hasResults,
  onClearInputs,
}: MobileTabLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const [containerWidth, setContainerWidth] = useState(0);

  // Track container width for gesture calculations
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Handle pan/swipe gestures
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);

      const { offset, velocity } = info;
      const swipeDistance = offset.x;
      const swipeVelocity = velocity.x;

      // Calculate if swipe should trigger tab change
      const thresholdDistance = containerWidth * SWIPE_THRESHOLD;
      const isVelocitySwipe = Math.abs(swipeVelocity) > SWIPE_VELOCITY_THRESHOLD;
      const isDistanceSwipe = Math.abs(swipeDistance) > thresholdDistance;

      if (isVelocitySwipe || isDistanceSwipe) {
        // Determine direction
        if (swipeDistance > 0 && activeTab === 'results') {
          // Swiped right while on results -> go to inputs
          onTabChange('inputs');
        } else if (swipeDistance < 0 && activeTab === 'inputs') {
          // Swiped left while on inputs -> go to results
          onTabChange('results');
        }
      }

      // Animate back to position (handled by AnimatePresence)
      controls.start({ x: 0 });
    },
    [activeTab, containerWidth, controls, onTabChange]
  );

  // Calculate drag constraints based on current tab
  const dragConstraints = {
    left: activeTab === 'inputs' ? -containerWidth * 0.5 : 0,
    right: activeTab === 'results' ? containerWidth * 0.5 : 0,
  };

  // Tab content variants for smooth transitions
  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? containerWidth : -containerWidth,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? containerWidth : -containerWidth,
      opacity: 0,
    }),
  };

  // Direction for animation (1 = right to left, -1 = left to right)
  const direction = activeTab === 'results' ? 1 : -1;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Compact header */}
      <MobileHeader onClearInputs={onClearInputs} />

      {/* Main content area with swipe gestures */}
      <motion.div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{
          // Account for bottom tab bar and safe area
          paddingBottom: 'calc(49px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING_CONFIG}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.15}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 overflow-y-auto overscroll-contain"
            style={{
              touchAction: isDragging ? 'none' : 'pan-y',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {activeTab === 'inputs' ? inputsContent : resultsContent}
          </motion.div>
        </AnimatePresence>

        {/* Edge indicators for swipe affordance */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 rounded-r-full transition-opacity duration-200 ${
            activeTab === 'results' ? 'bg-border/50 opacity-50' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-16 rounded-l-full transition-opacity duration-200 ${
            activeTab === 'inputs' ? 'bg-border/50 opacity-50' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      </motion.div>

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
