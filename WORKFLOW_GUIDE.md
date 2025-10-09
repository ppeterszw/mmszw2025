# EACZ Application Workflow System - Complete Guide

## 🎉 Implementation Complete!

The comprehensive 4-stage application workflow system with email notifications and PDF certificate generation is now fully implemented and deployed.

## 📝 **ID Naming Convention**

### **Application IDs (Pre-Approval):**
- **Individual Applications**: `APP-MBR-YYYY-XXXX` (e.g., APP-MBR-2025-0001)
- **Organization Applications**: `APP-ORG-YYYY-XXXX` (e.g., APP-ORG-2025-0001)

### **Member IDs (Post-Approval):**
- **Individual Members**: `EAC-MBR-YYYY-XXXX` (e.g., EAC-MBR-2025-0001)
- **Organizations**: `EAC-ORG-YYYY-XXXX` (e.g., EAC-ORG-2025-0001)

### **ID Conversion on Approval:**
When an application is approved, the Application ID is converted to Member ID by simply replacing "APP" with "EAC":
- `APP-MBR-2025-0001` → `EAC-MBR-2025-0001`
- `APP-ORG-2025-0123` → `EAC-ORG-2025-0123`

This ensures **traceability** - you can always track which application became which member by the matching number sequence.

---

## 📋 **Overview**

### **Workflow Stages**

Applications now go through 4 distinct stages:

1. **Under Review** → Initial review by Admin & Member Manager
2. **Document Review** → Document verification by Administrator
3. **Payment Review** → Payment verification by Administrator
4. **Final Approval** → Creates Member/Organization record + sends certificate

---

## 🔧 **How to Use (Administrator/Member Manager)**

### **Method 1: Using API Endpoints (Current Implementation)**

You can transition applications through stages using these API endpoints:

```javascript
// STAGE 1: Move to Under Review
fetch('/api/applications/{APPLICATION_ID}/move-to-under-review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ applicationType: 'individual' }) // or 'organization'
})

// STAGE 2: Move to Document Review
fetch('/api/applications/{APPLICATION_ID}/move-to-document-review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ applicationType: 'individual' })
})

// STAGE 3: Move to Payment Review
fetch('/api/applications/{APPLICATION_ID}/move-to-payment-review', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ applicationType: 'individual' })
})

// STAGE 4: Final Approval - CREATES MEMBER/ORGANIZATION!
fetch('/api/applications/{APPLICATION_ID}/approve-final', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicationType: 'individual',
    notes: 'Application approved'
  })
})
```

###**Method 2: Adding UI Buttons (TODO)**

To add buttons to the admin UI (`client/src/pages/admin/application-review.tsx`):

Replace the Action Buttons section (lines 324-351) with:

```typescript
{/* New Workflow Action Buttons */}
{(application.status === "submitted" || application.status === "draft") && (
  <div className="space-y-4 pt-4 border-t">
    <h4 className="font-semibold">Move Application to Next Stage:</h4>

    <div className="grid grid-cols-2 gap-3">
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => moveToStage(application.id, 'under-review', 'individual')}
      >
        📋 Move to Under Review
      </Button>

      <Button
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
        onClick={() => moveToStage(application.id, 'document-review', 'individual')}
      >
        📄 Move to Document Review
      </Button>

      <Button
        className="bg-purple-600 hover:bg-purple-700 text-white"
        onClick={() => moveToStage(application.id, 'payment-review', 'individual')}
      >
        💳 Move to Payment Review
      </Button>

      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={() => finalApprove(application.id, 'individual')}
      >
        ✅ Final Approval (Create Member)
      </Button>
    </div>

    <Button
      variant="destructive"
      onClick={() => handleReview("rejected")}
      className="w-full"
    >
      <XCircle className="w-4 h-4 mr-2" />
      Reject Application
    </Button>
  </div>
)}
```

Add these mutation functions:

```typescript
const moveToStageMutation = useMutation({
  mutationFn: ({ id, stage, type }: { id: string; stage: string; type: string }) =>
    apiRequest("POST", `/api/applications/${id}/move-to-${stage}`, { applicationType: type }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    toast({ title: "Success", description: "Application moved to next stage" });
    setSelectedApplication(null);
  },
});

const finalApproveMutation = useMutation({
  mutationFn: ({ id, type, notes }: { id: string; type: string; notes?: string }) =>
    apiRequest("POST", `/api/applications/${id}/approve-final`, { applicationType: type, notes }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    queryClient.invalidateQueries({ queryKey: ["/api/members"] });
    toast({ title: "Success", description: "Member/Organization created successfully!" });
    setSelectedApplication(null);
  },
});

const moveToStage = (id: string, stage: string, type: string) => {
  moveToStageMutation.mutate({ id, stage, type });
};

const finalApprove = (id: string, type: string) => {
  if (confirm('This will create the member/organization record and send their certificate. Continue?')) {
    finalApproveMutation.mutate({ id, type, notes: reviewNotes });
  }
};
```

---

## 📧 **Email Notifications**

### **What Gets Sent:**

#### **Stage 1: Under Review**
- **To**: Applicant
- **Subject**: "Application Under Review"
- **Content**: Initial review started, explains next steps
- **CC**: Administrator, Member Manager (separate emails)

#### **Stage 2: Document Review**
- **To**: Applicant
- **Subject**: "Document Review In Progress"
- **Content**: Documents being verified
- **CC**: Administrator (for review notification)

#### **Stage 3: Payment Review**
- **To**: Applicant
- **Subject**: "Payment Review"
- **Content**: Payment being verified, almost done!
- **CC**: Administrator (for payment verification)

#### **Stage 4: Final Approval**
- **To**: Applicant
- **Subject**: "Your Membership Certificate - EACZ"
- **Content**:
  - Congratulations message
  - Membership details table
  - Welcome to EACZ
  - **Attached**: PDF Certificate with QR code

---

## 📜 **Certificate Features**

### **What's Included:**
✅ Professional A4 PDF certificate
✅ EACZ branding (Egyptian blue #1034A6 + Powder blue #B0E0E6)
✅ Member/Organization name
✅ Membership number (EAC-MBR-YYYY-XXXX format)
✅ Member type / Business type
✅ Registration date
✅ Expiry date (1 year from approval)
✅ QR code linking to public verification page
✅ Registrar signature (placeholder)
✅ Decorative borders and professional layout

### **Certificate Email:**
- Beautiful HTML email with gradient header
- Membership details table
- Links to member portal
- PDF certificate attached
- QR code verification instructions

---

## 🔍 **Testing Guide**

### **1. Test Workflow Transitions**

```bash
# Get an application ID from the database
psql "postgresql://..." -c "SELECT id, application_id, status FROM individual_applications LIMIT 5;"

# Use the browser console or Postman to test each stage
```

### **2. Verify Email Delivery**

Check that emails are being sent to:
- Applicant email address
- Admin email addresses
- Member Manager email addresses

### **3. Verify Member/Organization Creation**

After final approval, check:
- Members list should show new member
- Organizations list should show new organization
- Membership number auto-generated correctly
- Expiry date set to 1 year from now

### **4. Test Certificate Generation**

- Check applicant receives congratulatory email
- Verify PDF certificate is attached
- Open PDF and verify all details are correct
- Scan QR code to test verification link

---

## 📦 **New Dependencies Added**

```json
{
  "dependencies": {
    "pdfkit": "^0.17.2",
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "@types/pdfkit": "^0.17.3",
    "@types/qrcode": "^1.5.5"
  }
}
```

---

## 🚀 **Deployment Status**

✅ **Deployed to Production**: https://mms.estateagentscouncil.org
✅ **Git Committed**: All changes committed to `main` branch
✅ **Build Status**: Successful
✅ **Database**: Compatible with Neon PostgreSQL

---

## 📝 **Next Steps (Optional Enhancements)**

1. **Add UI Buttons**: Update admin panel to show workflow buttons visually
2. **Add Logo**: Replace placeholder logo in certificate with actual EACZ logo
3. **Add Signature**: Add actual Registrar signature image to certificate
4. **Email Templates**: Further customize email templates with more branding
5. **SMS Notifications**: Add SMS notifications for critical stages
6. **Dashboard Widgets**: Add workflow status widgets to admin dashboard
7. **Audit Trail**: Add detailed audit log for each workflow transition

---

## 🐛 **Troubleshooting**

### **Emails not sending?**
- Check `ZEPTOMAIL_API_KEY` is set in environment variables
- Verify sender email is verified in ZeptoMail dashboard
- Check server logs for email errors

### **Certificate not generating?**
- Check server logs for PDF generation errors
- Verify `pdfkit` and `qrcode` packages are installed
- Ensure sufficient server memory for PDF generation

### **Member/Organization not created?**
- Check application has valid data
- Verify database connection
- Check logs for creation errors
- Ensure membership number generation is working

---

## 📞 **Support**

For questions or issues:
- Check server logs: `vercel logs [deployment-url]`
- Review this guide
- Contact system administrator

---

**Generated with Claude Code** 🤖
**Last Updated**: 2025-10-09
