import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role === "admin" || user.role === "member_manager" || user.role === "case_manager" || user.role === "super_admin") {
        setLocation("/admin-dashboard");
      } else {
        setLocation("/member-portal");
      }
    }
  }, [user, setLocation]);

  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}
