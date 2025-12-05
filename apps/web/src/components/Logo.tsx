import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className, size = 'md' }: LogoProps) {
  const sizeConfig = {
    sm: {
      text: 'text-lg sm:text-xl',
    },
    md: {
      text: 'text-xl sm:text-2xl',
    },
    lg: {
      text: 'text-3xl sm:text-4xl',
    },
  };

  const config = sizeConfig[size];

  return (
    <motion.a
      href="/"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'inline-flex items-baseline select-none font-display tracking-tight',
        config.text,
        className
      )}
    >
      <span className="font-semibold text-foreground">open</span>
      <span className="font-semibold text-foreground italic">taxation</span>
      <span className="font-normal text-muted-foreground not-italic">.my</span>
    </motion.a>
  );
}
