import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SignOut, User } from 'phosphor-react';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const userImage = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
  const userEmail = user.email;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full overflow-hidden border border-border hover:border-foreground/30 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20"
      >
        {userImage ? (
          <img
            src={userImage}
            alt={userName || 'User'}
            className="h-full w-full object-cover"
          />
        ) : (
          <User weight="bold" className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-[16rem] rounded-lg border bg-background shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName || 'User'}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <User weight="bold" className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{userName}</p>
                <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={async () => {
                await signOut();
                setIsOpen(false);
              }}
            >
              <SignOut weight="bold" className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
