/**
 * Floating decorative lines for landing page
 * Subtle animated lines around the hero section
 */
import { motion } from 'framer-motion';

interface FloatingLinesProps {
  className?: string;
}

// Line configurations - positioned around edges
const lines = [
  { id: 1, top: '15%', right: '10%', rotation: -30, length: 80, opacity: 0.12, delay: 0 },
  { id: 2, top: '60%', right: '5%', rotation: 45, length: 60, opacity: 0.1, delay: 1 },
  { id: 3, bottom: '20%', left: '8%', rotation: 20, length: 70, opacity: 0.12, delay: 2 },
  { id: 4, top: '35%', left: '5%', rotation: -15, length: 50, opacity: 0.08, delay: 3 },
  { id: 5, bottom: '35%', right: '12%', rotation: 60, length: 55, opacity: 0.1, delay: 1.5 },
];

export function FloatingLines({ className = '' }: FloatingLinesProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none hidden md:block ${className}`}
      aria-hidden="true"
    >
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute"
          style={{
            top: line.top,
            bottom: line.bottom,
            left: line.left,
            right: line.right,
            width: `${line.length}px`,
            height: '2px',
            background: `linear-gradient(90deg, transparent 0%, var(--blue) 50%, transparent 100%)`,
            opacity: line.opacity,
            transform: `rotate(${line.rotation}deg)`,
            borderRadius: '1px',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [line.opacity, line.opacity * 1.4, line.opacity],
            y: [0, -15, 0],
            rotate: [line.rotation, line.rotation + 2, line.rotation],
          }}
          transition={{
            duration: 6 + line.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: line.delay,
          }}
        />
      ))}

      {/* Extra subtle dot accents */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full"
        style={{ background: 'var(--blue)', opacity: 0.15 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full"
        style={{ background: 'var(--blue-light)', opacity: 0.1 }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
}
