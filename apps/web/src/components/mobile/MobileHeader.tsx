import { memo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotsThree, ArrowCounterClockwise, House, SignOut } from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  title?: string;
  onClearInputs?: () => void;
}

function MobileHeader({ title = 'Tax Calculator', onClearInputs }: MobileHeaderProps) {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // Close menu on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: House,
      action: () => window.location.href = '/dashboard',
    },
    ...(onClearInputs
      ? [
          {
            id: 'reset',
            label: 'Reset All',
            icon: ArrowCounterClockwise,
            action: onClearInputs,
          },
        ]
      : []),
    {
      id: 'signout',
      label: 'Sign Out',
      icon: SignOut,
      action: signOut,
      destructive: true,
    },
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center justify-between h-12 px-4">
        {/* Left: User avatar */}
        <div className="flex items-center">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata?.full_name || 'User avatar'}
              className="w-8 h-8 rounded-full ring-2 ring-border/50"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-border/50">
              <span className="text-xs font-medium text-muted-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Center: Title */}
        <h1 className="text-[17px] font-semibold tracking-tight">{title}</h1>

        {/* Right: Menu button */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/50 active:bg-muted transition-colors"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <DotsThree weight="bold" className="h-5 w-5 text-foreground" />
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-2 w-48 bg-background rounded-xl border border-border shadow-xl overflow-hidden"
                role="menu"
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === menuItems.length - 1;
                  const isDestructive = 'destructive' in item && item.destructive;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuAction(item.action)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50 active:bg-muted ${
                        !isLast ? 'border-b border-border/50' : ''
                      } ${isDestructive ? 'text-red-500' : 'text-foreground'}`}
                      role="menuitem"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Icon
                        weight="regular"
                        className={`h-4 w-4 ${isDestructive ? 'text-red-500' : 'text-muted-foreground'}`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default memo(MobileHeader);
