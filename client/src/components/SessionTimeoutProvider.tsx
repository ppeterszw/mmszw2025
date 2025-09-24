import { ReactNode } from 'react';
import { useSessionTimeout } from '@/hooks/use-session-timeout';

interface SessionTimeoutProviderProps {
  children: ReactNode;
}

export function SessionTimeoutProvider({ children }: SessionTimeoutProviderProps) {
  // Initialize session timeout functionality
  useSessionTimeout();
  
  return <>{children}</>;
}