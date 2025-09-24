import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { Applicant } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ApplicantAuthContextType = {
  applicant: Applicant | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<Applicant, Error, LoginData>;
  saveDraftMutation: UseMutationResult<SaveDraftResponse, Error, SaveDraftData>;
  loadDraftQuery: any;
};

type LoginData = {
  applicantId: string;
  email: string;
};

type SaveDraftData = {
  applicantId: string;
  applicationData: any;
};

type SaveDraftResponse = {
  success: boolean;
  message: string;
  draftId: string;
  lastSaved: string;
};

export const ApplicantAuthContext = createContext<ApplicantAuthContextType | null>(null);

export function ApplicantAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Store applicant data in localStorage for persistence across sessions
  const getStoredApplicant = (): Applicant | null => {
    try {
      const stored = localStorage.getItem('currentApplicant');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const setStoredApplicant = (applicant: Applicant | null) => {
    if (applicant) {
      localStorage.setItem('currentApplicant', JSON.stringify(applicant));
    } else {
      localStorage.removeItem('currentApplicant');
    }
  };

  // Mock query since we store applicant data locally after login
  const {
    data: applicant,
    error,
    isLoading,
  } = useQuery<Applicant | null, Error>({
    queryKey: ["/applicant/current"],
    queryFn: () => Promise.resolve(getStoredApplicant()),
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/applicants/login", credentials);
      const responseData = await res.json();
      if (responseData.success) {
        return responseData.applicant;
      }
      throw new Error(responseData.error || 'Login failed');
    },
    onSuccess: (applicant: Applicant) => {
      setStoredApplicant(applicant);
      queryClient.setQueryData(["/applicant/current"], applicant);
      toast({
        title: "Login successful",
        description: `Welcome back, ${applicant.fullName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: SaveDraftData) => {
      const res = await apiRequest("POST", `/api/applicants/${data.applicantId}/save-draft`, {
        applicationData: data.applicationData
      });
      return await res.json();
    },
    onSuccess: (response: SaveDraftResponse) => {
      toast({
        title: "Draft saved",
        description: "Your application progress has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save your application draft.",
        variant: "destructive",
      });
    },
  });

  const loadDraftQuery = (applicantId: string) => {
    return useQuery({
      queryKey: ["/applicant/draft", applicantId],
      queryFn: async () => {
        const res = await apiRequest("GET", `/api/applicants/${applicantId}/load-draft`);
        return await res.json();
      },
      enabled: !!applicantId,
      staleTime: 30 * 1000, // Refetch every 30 seconds if needed
    });
  };

  const logout = () => {
    setStoredApplicant(null);
    queryClient.setQueryData(["/applicant/current"], null);
    queryClient.clear(); // Clear all cached data
  };

  // Expose logout function via context if needed
  const contextValue: ApplicantAuthContextType = {
    applicant: applicant || null,
    isLoading,
    error,
    loginMutation,
    saveDraftMutation,
    loadDraftQuery,
  };

  return (
    <ApplicantAuthContext.Provider value={contextValue}>
      {children}
    </ApplicantAuthContext.Provider>
  );
}

export function useApplicantAuth() {
  const context = useContext(ApplicantAuthContext);
  if (!context) {
    throw new Error("useApplicantAuth must be used within an ApplicantAuthProvider");
  }
  return context;
}