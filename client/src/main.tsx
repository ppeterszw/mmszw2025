import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// If Clerk is configured, use it; otherwise run without Clerk
if (PUBLISHABLE_KEY) {
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
} else {
  // Run without Clerk for basic applicant auth only
  createRoot(document.getElementById("root")!).render(<App />);
}
