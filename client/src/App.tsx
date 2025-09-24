import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ApplicantAuthProvider } from "@/hooks/use-applicant-auth";
import { SessionTimeoutProvider } from "@/components/SessionTimeoutProvider";
import { ProtectedRoute } from "./lib/protected-route";
import { ApplicantProtectedRoute } from "./lib/applicant-protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import MemberPortal from "@/pages/member-portal";
import AdminDashboard from "@/pages/admin-dashboard";
import OrganizationPortal from "@/pages/organization-portal";
import CaseManagement from "@/pages/case-management";
import CaseReporting from "@/pages/case-reporting";
import MemberRegistration from "@/pages/member-registration";
import OrganizationRegistration from "@/pages/organization-registration";
import ApplicantRegistration from "@/pages/applicant-registration";
import IndividualApplicationChoice from "@/pages/individual-application-choice";
import ApplicantLogin from "@/pages/applicant-login";
import OrganizationApplicantRegistration from "@/pages/organization-applicant-registration";
import OrganizationApplicantLogin from "@/pages/organization-applicant-login";
import OrganizationApplication from "@/pages/organization-application";
import OrganizationApplicationChoice from "@/pages/organization-application-choice";
import OrganizationVerifyEmail from "@/pages/organization/verify-email";
import VerifyEmail from "@/pages/verify-email";
import EventManagement from "@/pages/event-management";
import PaymentPage from "@/pages/payment-page";
import CertificatePage from "@/pages/certificate-page";
import VerificationPage from "@/pages/verification-page";
import PaymentTestPage from "@/pages/payment-test";
import CaseTracking from "@/pages/case-tracking";
import ApplicationTracking from "@/pages/application-tracking";
import CpdTracking from "@/pages/cpd-tracking";
import MemberDirectory from "@/pages/member-directory";
import RenewalManagement from "@/pages/renewal-management";

// Admin Portal Pages
import AdminMemberManagement from "@/pages/admin/member-management";
import AdminOrganizationManagement from "@/pages/admin/organization-management";
import AdminApplicationReview from "@/pages/admin/application-review";
import AgentsApplicationsReview from "@/pages/admin/agents-applications";
import FirmsApplicationsReview from "@/pages/admin/firms-applications";
import AdminFinanceDashboard from "@/pages/admin/finance-dashboard";
import AdminSettings from "@/pages/admin/admin-settings";
import UserManagement from "@/pages/admin/user-management";

// Member Portal Pages
import MemberProfile from "@/pages/member/profile-management";
import MemberDocuments from "@/pages/member/document-management";
import MemberEvents from "@/pages/member/events";
import MemberPayments from "@/pages/member/payment-history";
import MemberCertificate from "@/pages/member/certificate";

// Organization Portal Pages
import OrganizationProfile from "@/pages/organization/organization-profile";
import OrganizationMemberManagement from "@/pages/organization/member-management";
import OrganizationDashboard from "@/pages/organization/dashboard";
import PrincipalAgentPage from "@/pages/organization/principal-agent";
import AgentsPage from "@/pages/organization/agents";
import OrganizationDocumentsPage from "@/pages/organization/documents";
import OrganizationCertificatePage from "@/pages/organization/certificate";
import OrganizationPaymentsPage from "@/pages/organization/payments";
import OrganizationRenewalsPage from "@/pages/organization/renewals";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/member-portal" component={MemberPortal} />
      <ProtectedRoute path="/admin-dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/organization-portal" component={OrganizationPortal} />
      <ProtectedRoute path="/case-management" component={CaseManagement} />
      <ProtectedRoute path="/organization-registration" component={OrganizationRegistration} />
      <ProtectedRoute path="/event-management" component={EventManagement} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/payment-test" component={PaymentTestPage} />
      <ProtectedRoute path="/certificate" component={CertificatePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/verify" component={VerificationPage} />
      <Route path="/certificates/verify" component={VerificationPage} />
      <Route path="/applicant-registration" component={ApplicantRegistration} />
      <Route path="/applicant-login" component={ApplicantLogin} />
      <Route path="/organization-applicant-registration" component={OrganizationApplicantRegistration} />
      <Route path="/organization-applicant-login" component={OrganizationApplicantLogin} />
      <Route path="/organization-application" component={OrganizationApplication} />
      <Route path="/organization/verify-email" component={OrganizationVerifyEmail} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/apply/individual" component={IndividualApplicationChoice} />
      <Route path="/apply/firm" component={OrganizationApplicationChoice} />
      <ApplicantProtectedRoute path="/member-registration" component={MemberRegistration} />
      <Route path="/cases/report" component={CaseReporting} />
      <Route path="/cases/track" component={CaseTracking} />
      <Route path="/track-application" component={ApplicationTracking} />
      <ProtectedRoute path="/cpd-tracking" component={CpdTracking} />
      <Route path="/member-directory" component={MemberDirectory} />
      
      {/* Admin Portal Routes */}
      <ProtectedRoute path="/admin/members" component={AdminMemberManagement} />
      <ProtectedRoute path="/admin-dashboard/members" component={AdminMemberManagement} />
      <ProtectedRoute path="/admin/organizations" component={AdminOrganizationManagement} />
      <ProtectedRoute path="/admin-dashboard/organizations" component={AdminOrganizationManagement} />
      <ProtectedRoute path="/admin/organizations/register" component={OrganizationRegistration} />
      <ProtectedRoute path="/admin/applications" component={AdminApplicationReview} />
      <ProtectedRoute path="/admin-dashboard/applications" component={AdminApplicationReview} />
      <ProtectedRoute path="/admin-dashboard/agents-applications" component={AgentsApplicationsReview} />
      <ProtectedRoute path="/admin-dashboard/firms-applications" component={FirmsApplicationsReview} />
      <ProtectedRoute path="/admin-dashboard/users" component={UserManagement} />
      <ProtectedRoute path="/admin-dashboard/finance" component={AdminFinanceDashboard} />
      <ProtectedRoute path="/admin-dashboard/settings" component={AdminSettings} />
      
      {/* Member Portal Routes */}
      <ProtectedRoute path="/member/profile" component={MemberProfile} />
      <ProtectedRoute path="/member/documents" component={MemberDocuments} />
      <ProtectedRoute path="/member/events" component={MemberEvents} />
      <ProtectedRoute path="/member/payments" component={MemberPayments} />
      <ProtectedRoute path="/member/certificate" component={MemberCertificate} />
      
      {/* Organization Portal Routes */}
      <ProtectedRoute path="/organization/dashboard" component={OrganizationDashboard} />
      <ProtectedRoute path="/organization/principal" component={PrincipalAgentPage} />
      <ProtectedRoute path="/organization/agents" component={AgentsPage} />
      <ProtectedRoute path="/organization/documents" component={OrganizationDocumentsPage} />
      <ProtectedRoute path="/organization/certificate" component={OrganizationCertificatePage} />
      <ProtectedRoute path="/organization/payments" component={OrganizationPaymentsPage} />
      <ProtectedRoute path="/organization/renewals" component={OrganizationRenewalsPage} />
      <ProtectedRoute path="/organization/profile" component={OrganizationProfile} />
      <ProtectedRoute path="/organization/members" component={OrganizationMemberManagement} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionTimeoutProvider>
          <ApplicantAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ApplicantAuthProvider>
        </SessionTimeoutProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
