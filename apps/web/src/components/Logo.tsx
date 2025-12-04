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
      underline: 'h-[1.5px] -bottom-[1px]',
    },
    md: {
      text: 'text-xl sm:text-2xl',
      underline: 'h-[2px] -bottom-[1px]',
    },
    lg: {
      text: 'text-3xl sm:text-4xl',
      underline: 'h-[2.5px] -bottom-[2px]',
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
        'inline-flex items-baseline select-none font-display tracking-tight group',
        config.text,
        className
      )}
    >
      <span className="font-semibold text-foreground">open</span>
      {/* "taxation" with signature underline accent */}
      <span className="relative font-semibold text-foreground italic">
        taxation
        {/* Signature underline - elegant accent mark */}
        <span
          className={cn(
            'absolute left-0 right-0 rounded-full transition-all duration-300',
            'bg-gradient-to-r from-transparent via-foreground/60 to-transparent',
            'group-hover:via-foreground/80',
            config.underline
          )}
        />
      </span>
      <span className="font-normal text-muted-foreground not-italic">.my</span>
    </motion.a>
  );
}
