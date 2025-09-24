import { useApplicantAuth } from "@/hooks/use-applicant-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ApplicantProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { applicant, isLoading } = useApplicantAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!applicant || !applicant.emailVerified) {
    return (
      <Route path={path}>
        <Redirect to="/apply/individual" />
      </Route>
    );
  }

  return <Component />
}