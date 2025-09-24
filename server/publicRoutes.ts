import type { Express } from "express";
import { storage } from "./storage";

export function registerPublicRoutes(app: Express) {
  // Public verification endpoint - no authentication required
  app.get("/api/public/verify/:membershipNumber", async (req, res) => {
    try {
      const { membershipNumber } = req.params;
      
      if (!membershipNumber) {
        return res.status(400).json({ error: "Membership number is required" });
      }

      // Search in both members and organizations
      const member = await storage.getMemberByMembershipNumber(membershipNumber);
      if (member) {
        // Return member information for verification
        return res.json({
          type: "member",
          membershipNumber: member.membershipNumber,
          firstName: member.firstName,
          lastName: member.lastName,
          memberType: member.memberType,
          status: member.membershipStatus, // Use 'status' for consistency with frontend
          createdAt: member.createdAt,
          expiryDate: member.expiryDate
        });
      }

      // Try organization lookup by registration number
      const organization = await storage.getOrganizationByRegistrationNumber(membershipNumber);
      
      if (organization) {
        // Return organization information for verification
        return res.json({
          type: "organization",
          membershipNumber: organization.membershipNumber || organization.registrationNumber,
          name: organization.name,
          organizationType: organization.type,
          status: organization.membershipStatus, // Use 'status' for consistency with frontend
          createdAt: organization.createdAt,
          expiryDate: organization.expiryDate
        });
      }

      // No registration found
      return res.status(404).json({ error: "Registration not found" });
      
    } catch (error) {
      console.error("Public verification error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Alternative endpoint that accepts query parameter
  app.get("/api/public/verify", async (req, res) => {
    const membershipNumber = req.query.member as string;
    if (membershipNumber) {
      // Redirect to the main verification endpoint
      return res.redirect(307, `/api/public/verify/${encodeURIComponent(membershipNumber)}`);
    }
    
    return res.status(400).json({ error: "Membership number is required" });
  });

  // Public members directory endpoint - limited data for verification
  app.get("/api/public/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      
      // Return only safe, public information for verification purposes
      const publicMembers = members
        .filter(member => member.membershipStatus === "active")
        .map(member => ({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          membershipNumber: member.membershipNumber,
          memberType: member.memberType,
          membershipStatus: member.membershipStatus
        }));

      res.json(publicMembers);
    } catch (error) {
      console.error("Public members directory error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Public organizations directory endpoint - limited data for verification
  app.get("/api/public/organizations", async (req, res) => {
    try {
      const organizations = await storage.getAllOrganizations();
      
      // Return only safe, public information for verification purposes
      const publicOrganizations = organizations
        .filter(org => org.membershipStatus === "active")
        .map(org => ({
          id: org.id,
          name: org.name,
          registrationNumber: org.registrationNumber,
          membershipStatus: org.membershipStatus
        }));

      res.json(publicOrganizations);
    } catch (error) {
      console.error("Public organizations directory error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}