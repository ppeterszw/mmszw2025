import React, { useEffect, useRef, useCallback } from 'react';
import { AuthContext } from './use-auth';
import { useToast } from './use-toast';

// Session timeout duration in milliseconds (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Warning duration before logout (30 seconds)
const WARNING_DURATION = 30 * 1000;

export function useSessionTimeout() {
  const authContext = React.useContext(AuthContext);
  const { toast } = useToast();
  
  // Only proceed if auth context is available and user is logged in
  if (!authContext) return;
  
  const { user, logoutMutation } = authContext;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningShownRef = useRef(false);

  const logout = useCallback(() => {
    if (user) {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          toast({
            title: "Session Expired",
            description: "You have been logged out due to inactivity.",
            variant: "destructive",
          });
        }
      });
    }
  }, [user, logoutMutation, toast]);

  const showWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      toast({
        title: "Session Expiring Soon",
        description: "Your session will expire in 30 seconds due to inactivity. Move your mouse or click anywhere to stay logged in.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // Reset warning flag
    warningShownRef.current = false;

    // Only set timeout if user is logged in
    if (user) {
      // Set warning timeout (4.5 minutes)
      warningTimeoutRef.current = setTimeout(() => {
        showWarning();
      }, SESSION_TIMEOUT - WARNING_DURATION);

      // Set logout timeout (5 minutes)
      timeoutRef.current = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);
    }
  }, [user, logout, showWarning]);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = () => {
      resetTimeout();
    };

    // Set initial timeout
    resetTimeout();

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [user, resetTimeout]);

  // Clear timeouts when user logs out
  useEffect(() => {
    if (!user) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      warningShownRef.current = false;
    }
  }, [user]);
}