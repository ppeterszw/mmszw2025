import { useApplicantAuth } from "@/hooks/use-applicant-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ApplicantProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element | null;
}) {
  const { applicant, isLoading } = useApplicantAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      ) : !applicant || !applicant.emailVerified ? (
        <Redirect to="/apply/individual" />
      ) : (
        <Component />
      )}
    </Route>
  );
}