/**
 * Animated gradient blob background for landing page
 * Creates soft, morphing blue gradient circles
 */

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Main gradient blob - top right */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-40 blur-3xl animate-blob"
        style={{
          background: 'radial-gradient(circle, var(--blue-light) 0%, var(--blue-lighter) 50%, transparent 70%)',
        }}
      />

      {/* Secondary blob - bottom left */}
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-30 blur-3xl animate-blob-delay-1"
        style={{
          background: 'radial-gradient(circle, var(--blue) 0%, var(--blue-light) 40%, transparent 70%)',
        }}
      />

      {/* Third blob - center top */}
      <div
        className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full opacity-15 dark:opacity-25 blur-3xl animate-blob-delay-2"
        style={{
          background: 'radial-gradient(circle, var(--blue-lighter) 0%, var(--blue-light) 50%, transparent 70%)',
        }}
      />

      {/* Reduced motion: static gradient fallback */}
      <div
        className="absolute inset-0 opacity-0 motion-reduce:opacity-100"
        style={{
          background: 'radial-gradient(ellipse at top right, var(--blue-lighter) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
