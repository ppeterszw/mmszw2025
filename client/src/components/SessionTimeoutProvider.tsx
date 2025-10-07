import { ReactNode } from 'react';
import { useSessionTimeout } from '@/hooks/use-session-timeout';

interface SessionTimeoutProviderProps {
  children: ReactNode;
}

export function SessionTimeoutProvider({ children }: SessionTimeoutProviderProps) {
  // Initialize session timeout functionality and get the dialog component
  const sessionDialog = useSessionTimeout();

  return (
    <>
      {children}
      {sessionDialog}
    </>
  );
}