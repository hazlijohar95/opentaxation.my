import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TooltipProvider } from './components/ui/tooltip';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import SinglePageApp from './pages/SinglePageApp';
import { trackPageView } from './lib/analytics';

// Lazy load non-critical routes
const AuthPage = lazy(() => import('./pages/AuthPage'));
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/pages/TermsOfService'));
const Disclaimer = lazy(() => import('./components/pages/Disclaimer'));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const DashboardCalendar = lazy(() => import('./pages/dashboard/DashboardCalendar'));
const SavedCalculations = lazy(() => import('./pages/dashboard/SavedCalculations'));
const DashboardSettings = lazy(() => import('./pages/dashboard/DashboardSettings'));

// Loading fallback for lazy routes
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<SinglePageApp />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* Dashboard routes (protected) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="calendar" element={<DashboardCalendar />} />
          <Route path="calculations" element={<SavedCalculations />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <AppRoutes />
        <PWAInstallPrompt />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;

