import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App';
import './index.css';
import './i18n'; // Initialize i18n
import { initErrorTracking } from './lib/errorTracking';
import { initAnalytics } from './lib/analytics';

// Initialize custom error tracking
initErrorTracking();

// Initialize analytics
initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
