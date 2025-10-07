import React, { useEffect, useRef, useCallback, useState } from 'react';
import { AuthContext } from './use-auth';
import { useToast } from './use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, RefreshCw } from "lucide-react";

// Session timeout duration in milliseconds (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Warning duration before logout (30 seconds)
const WARNING_DURATION = 30 * 1000;

// Extension duration (10 minutes)
const EXTENSION_DURATION = 10 * 60 * 1000;

export function useSessionTimeout() {
  const authContext = React.useContext(AuthContext);
  const { toast } = useToast();
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Only proceed if auth context is available and user is logged in
  if (!authContext) return null;

  const { user, logoutMutation } = authContext;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logout = useCallback(() => {
    if (user) {
      setShowWarningDialog(false);
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

  const extendSession = useCallback(() => {
    setShowWarningDialog(false);
    setCountdown(30);

    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // Set new warning timeout (extension - 30 seconds)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarningDialog(true);
      // Start countdown
      let secondsLeft = 30;
      setCountdown(secondsLeft);
      countdownIntervalRef.current = setInterval(() => {
        secondsLeft -= 1;
        setCountdown(secondsLeft);
        if (secondsLeft <= 0 && countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      }, 1000);
    }, EXTENSION_DURATION - WARNING_DURATION);

    // Set new logout timeout (10 minutes)
    timeoutRef.current = setTimeout(() => {
      logout();
    }, EXTENSION_DURATION);

    toast({
      title: "Session Extended",
      description: "Your session has been extended by 10 minutes.",
    });
  }, [logout, toast]);

  const showWarning = useCallback(() => {
    setShowWarningDialog(true);

    // Start countdown
    let secondsLeft = 30;
    setCountdown(secondsLeft);
    countdownIntervalRef.current = setInterval(() => {
      secondsLeft -= 1;
      setCountdown(secondsLeft);
      if (secondsLeft <= 0 && countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }, 1000);
  }, []);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Reset dialog state
    setShowWarningDialog(false);
    setCountdown(30);

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
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
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
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      setShowWarningDialog(false);
    }
  }, [user]);

  return (
    <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
      <AlertDialogContent className="max-w-md border-2 border-egyptian-blue/20 shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-egyptian-blue to-powder-blue flex items-center justify-center shadow-xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-egyptian-blue to-powder-blue bg-clip-text text-transparent">
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <p className="text-base text-gray-700 font-medium">
              Your session will expire in <span className="font-bold text-egyptian-blue text-lg">{countdown} seconds</span> due to inactivity.
            </p>
            <p className="text-sm text-gray-600">
              Would you like to extend your session or log out now?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-4">
          <Button
            variant="outline"
            onClick={logout}
            className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
          <Button
            onClick={extendSession}
            className="w-full sm:w-auto bg-gradient-to-r from-egyptian-blue to-powder-blue hover:opacity-90 text-white border-0 font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Extend Session (10 min)
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}