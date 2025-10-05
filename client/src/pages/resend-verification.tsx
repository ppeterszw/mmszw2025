/**
 * Resend Verification Email Page
 * Allows applicants to request resend of welcome and verification emails
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResendVerificationPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address",
      });
      return;
    }

    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/applicants/resend-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        toast({
          title: "Emails Sent Successfully",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Send Emails",
          description: result.message || "An error occurred. Please try again.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend emails. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Resend Verification Email</CardTitle>
          <CardDescription>
            Didn't receive your welcome or verification email? Enter your email address below to receive them again.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Emails Sent Successfully!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    We've sent your welcome and verification emails to <strong>{email}</strong>.
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                variant="outline"
                className="w-full"
              >
                Send to Another Email
              </Button>

              <div className="text-center">
                <a href="/" className="text-sm text-blue-600 hover:underline">
                  Return to Home
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResendEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email address you used during registration
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Emails
                  </>
                )}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">What you'll receive:</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Welcome email with your Applicant ID</li>
                    <li>Email verification link (valid for 24 hours)</li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Need help?{" "}
                  <a href="mailto:info@eacz.co.zw" className="text-blue-600 hover:underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
