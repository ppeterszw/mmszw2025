import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { requireAuth } from "./clerkAuth";

export function setupOrganizationPortalRoutes(app: Express) {

  // Get organization details with directors, members, and PREA
  app.get("/api/organization-portal/:organizationId", requireAuth, async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;

      // Verify user has access to this organization
      const user = req.user as any;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orgDetails = await storage.getOrganizationWithDetails(organizationId);

      if (!orgDetails) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // Check if user is PREA for this organization or is a member of this organization
      const isMemberOfOrg = orgDetails.members.some((m: any) => m.email === user.email);
      const isPREA = orgDetails.preaMember?.email === user.email;

      if (!isMemberOfOrg && !isPREA && !['admin', 'super_admin', 'staff'].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({
        ...orgDetails,
        isPREA,
        canManage: isPREA || ['admin', 'super_admin', 'staff'].includes(user.role)
      });

    } catch (error: any) {
      console.error("Get organization details error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch organization details" });
    }
  });

  // Get organization by member's email (for PREA members to find their org)
  app.get("/api/organization-portal/member/:email", requireAuth, async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const user = req.user as any;

      // Verify user can only access their own organization unless admin
      if (user.email !== email && !['admin', 'super_admin', 'staff'].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Find member by email
      const member = await storage.getMemberByEmail(email);
      if (!member || !member.organizationId) {
        return res.status(404).json({ message: "No organization found for this member" });
      }

      // Get full organization details
      const orgDetails = await storage.getOrganizationWithDetails(member.organizationId);

      if (!orgDetails) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const isPREA = orgDetails.preaMember?.email === email;

      res.json({
        ...orgDetails,
        isPREA,
        canManage: isPREA || ['admin', 'super_admin', 'staff'].includes(user.role)
      });

    } catch (error: any) {
      console.error("Get organization by member error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch organization" });
    }
  });

  // Add director (PREA or admin only)
  app.post("/api/organization-portal/:organizationId/directors", requireAuth, async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      const directorData = req.body;
      const user = req.user as any;

      // Check if user is PREA or admin
      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ['admin', 'super_admin', 'staff'].includes(user.role);

      if (!isPREA && !isAdmin) {
        return res.status(403).json({ message: "Only PREA or admin can add directors" });
      }

      const director = await storage.createDirector({
        ...directorData,
        organizationId
      });

      res.json(director);

    } catch (error: any) {
      console.error("Add director error:", error);
      res.status(500).json({ message: error.message || "Failed to add director" });
    }
  });

  // Update director (PREA or admin only)
  app.put("/api/organization-portal/:organizationId/directors/:directorId", requireAuth, async (req: Request, res: Response) => {
    try {
      const { organizationId, directorId } = req.params;
      const updates = req.body;
      const user = req.user as any;

      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ['admin', 'super_admin', 'staff'].includes(user.role);

      if (!isPREA && !isAdmin) {
        return res.status(403).json({ message: "Only PREA or admin can update directors" });
      }

      const director = await storage.updateDirector(directorId, updates);
      res.json(director);

    } catch (error: any) {
      console.error("Update director error:", error);
      res.status(500).json({ message: error.message || "Failed to update director" });
    }
  });

  // Delete director (PREA or admin only)
  app.delete("/api/organization-portal/:organizationId/directors/:directorId", requireAuth, async (req: Request, res: Response) => {
    try {
      const { organizationId, directorId } = req.params;
      const user = req.user as any;

      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ['admin', 'super_admin', 'staff'].includes(user.role);

      if (!isPREA && !isAdmin) {
        return res.status(403).json({ message: "Only PREA or admin can delete directors" });
      }

      await storage.deleteDirector(directorId);
      res.json({ message: "Director deleted successfully" });

    } catch (error: any) {
      console.error("Delete director error:", error);
      res.status(500).json({ message: error.message || "Failed to delete director" });
    }
  });

  // Update PREA designation (admin only initially, can be extended)
  app.put("/api/organization-portal/:organizationId/prea", requireAuth, async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      const { memberId } = req.body;
      const user = req.user as any;

      // Only admin can change PREA initially
      const isAdmin = ['admin', 'super_admin', 'staff'].includes(user.role);
      if (!isAdmin) {
        return res.status(403).json({ message: "Only admin can designate PREA" });
      }

      // Verify member exists and belongs to organization
      const member = await storage.getMember(memberId);
      if (!member || member.organizationId !== organizationId) {
        return res.status(400).json({ message: "Member not found or doesn't belong to this organization" });
      }

      // Verify member is a principal real estate agent
      if (member.memberType !== 'principal_real_estate_agent') {
        return res.status(400).json({ message: "Member must be a Principal Real Estate Agent" });
      }

      const org = await storage.updateOrganizationPREA(organizationId, memberId);
      res.json(org);

    } catch (error: any) {
      console.error("Update PREA error:", error);
      res.status(500).json({ message: error.message || "Failed to update PREA" });
    }
  });

  // Get organization members
  app.get("/api/organization-portal/:organizationId/members", requireAuth, async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.params;
      const user = req.user as any;

      // Verify access
      const org = await storage.getOrganization(organizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const members = await storage.getMembersByOrganization(organizationId);

      // Check if user has access
      const isMemberOfOrg = members.some(m => m.email === user.email);
      const preaMember = org.preaMemberId ? await storage.getMember(org.preaMemberId) : null;
      const isPREA = preaMember?.email === user.email;
      const isAdmin = ['admin', 'super_admin', 'staff'].includes(user.role);

      if (!isMemberOfOrg && !isPREA && !isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(members);

    } catch (error: any) {
      console.error("Get organization members error:", error);
      res.status(500).json({ message: error.message || "Failed to fetch members" });
    }
  });
}
