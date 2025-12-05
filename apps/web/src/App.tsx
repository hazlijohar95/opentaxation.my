import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
const PartnersPage = lazy(() => import('./pages/PartnersPage'));

// Blog routes
const BlogListPage = lazy(() => import('./pages/blog/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage'));

// Blog admin routes
const BlogAdminList = lazy(() => import('./pages/dashboard/blog/BlogAdminList'));
const BlogAdminEdit = lazy(() => import('./pages/dashboard/blog/BlogAdminEdit'));

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
        <Route path="/partners" element={<PartnersPage />} />

        {/* Blog routes */}
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* Dashboard routes (protected) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="calendar" element={<DashboardCalendar />} />
          <Route path="calculations" element={<SavedCalculations />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="blog" element={<BlogAdminList />} />
          <Route path="blog/:id" element={<BlogAdminEdit />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <TooltipProvider>
          <AppRoutes />
          <PWAInstallPrompt />
        </TooltipProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

