import {
  SignIn,
  SignUp,
  SignOutButton,
  UserButton,
  useUser,
  useAuth,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClerkSignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign in to EACZ</CardTitle>
        </CardHeader>
        <CardContent>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                card: "shadow-none border-none",
                headerTitle: "hidden",
              }
            }}
            redirectUrl="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function ClerkSignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Join EACZ</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                card: "shadow-none border-none",
                headerTitle: "hidden",
              }
            }}
            redirectUrl="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function ClerkUserButton() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
        }
      }}
      showName
    />
  );
}

export function ClerkSignOutButton() {
  return (
    <SignOutButton>
      <Button variant="outline" size="sm">
        Sign Out
      </Button>
    </SignOutButton>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <ClerkSignIn />
      </SignedOut>
    </>
  );
}

export function useClerkAuth() {
  const { user, isLoaded } = useUser();
  const { isSignedIn, signOut } = useAuth();

  return {
    user,
    isLoaded,
    isSignedIn,
    signOut,
    userId: user?.id,
    email: user?.primaryEmailAddress?.emailAddress,
    fullName: user?.fullName,
    firstName: user?.firstName,
    lastName: user?.lastName,
  };
}