import { useMemo } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { Calculator, ClockCounterClockwise, Gear, House, ArrowLeft, CalendarCheck, Article, Icon } from 'phosphor-react';
import Logo from '@/components/Logo';

interface NavItem {
  to: string;
  icon: Icon;
  label: string;
  end: boolean;
  adminOnly?: boolean;
}

const allNavItems: NavItem[] = [
  { to: '/dashboard', icon: House, label: 'Overview', end: true },
  { to: '/dashboard/calendar', icon: CalendarCheck, label: 'Tax Calendar', end: false },
  { to: '/dashboard/calculations', icon: ClockCounterClockwise, label: 'Saved Calculations', end: false },
  { to: '/dashboard/blog', icon: Article, label: 'Blog', end: false, adminOnly: true },
  { to: '/dashboard/settings', icon: Gear, label: 'Settings', end: false },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, isLoading, isBlogAdmin } = useAuth();

  // Filter nav items based on admin status
  const navItems = useMemo(() =>
    allNavItems.filter(item => !item.adminOnly || isBlogAdmin),
    [isBlogAdmin]
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect to home if not signed in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-6">
                <NavLink to="/">
                  <Logo size="sm" />
                </NavLink>
                <span className="font-display text-sm text-muted-foreground">Dashboard</span>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors touch-target"
                >
                  <Calculator weight="duotone" className="h-4 w-4" />
                  <span className="hidden sm:inline">Calculator</span>
                </button>
                <UserMenu />
              </div>
            </div>
          </header>

          <div className="flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border/30 min-h-[calc(100vh-4rem)] bg-background">
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`
                    }
                  >
                    <Icon weight="duotone" className="h-5 w-5" />
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-border/30">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
                >
                  <ArrowLeft weight="bold" className="h-4 w-4" />
                  Back to Calculator
                </button>
              </div>
            </aside>

            {/* Mobile nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-background/95 backdrop-blur-xl p-2 pb-safe">
              <div className="flex justify-around">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors touch-target ${
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon weight={isActive ? 'fill' : 'duotone'} className="h-5 w-5" />
                        <span>{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </div>
  );
}
