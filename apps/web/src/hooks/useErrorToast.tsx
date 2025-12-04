import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X } from 'phosphor-react';
import { logError } from '@/lib/errorTracking';

export interface ErrorToast {
  id: string;
  title: string;
  message: string;
}

/**
 * Custom hook for error toast notifications
 * 
 * Per React best practices: https://react.dev/learn/you-might-not-need-an-effect
 * - Handles user events (showing errors) in callbacks, not Effects
 * - Properly cleans up timeouts to prevent memory leaks
 */
export function useErrorToast() {
  const [errors, setErrors] = useState<ErrorToast[]>([]);
  // Store timeout IDs to clean them up if component unmounts
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup all pending timeouts on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
    };
  }, []);

  const showError = useCallback((title: string, message: string) => {
        const id = Math.random().toString(36).substring(7);
        setErrors((prev) => [...prev, { id, title, message }]);
        
        // Log error for tracking
        logError(new Error(`${title}: ${message}`));
        
        // Auto-dismiss after 5 seconds
        const timeoutId = setTimeout(() => {
          setErrors((prev) => prev.filter((e) => e.id !== id));
          timeoutRefs.current.delete(id);
        }, 5000);
        
        timeoutRefs.current.set(id, timeoutId);
      }, []);

  const dismissError = useCallback((id: string) => {
    // Clear timeout if error is manually dismissed
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const ErrorToastContainer = () => {
    if (errors.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {errors.map((error) => (
          <Alert key={error.id} variant="destructive" className="shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <AlertTitle>{error.title}</AlertTitle>
                <AlertDescription className="mt-1">{error.message}</AlertDescription>
              </div>
              <button
                onClick={() => dismissError(error.id)}
                className="ml-4 text-destructive hover:text-destructive/80 transition-colors"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Alert>
        ))}
      </div>
    );
  };

  return { showError, dismissError, ErrorToastContainer };
}

