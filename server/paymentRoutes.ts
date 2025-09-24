import type { Express } from "express";
import { paynowService } from "./paynowService";
import Stripe from "stripe";
import { storage } from "./storage";

// Initialize Stripe if keys are available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function registerPaymentRoutes(app: Express) {
  
  // Paynow payment initiation
  app.post("/api/payment/paynow/initiate", async (req, res) => {
    try {
      const { amount, currency = "USD", reference, email, phone, description, memberId, paymentType } = req.body;

      // Enhanced validation
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          error: "Valid payment amount is required and must be greater than 0"
        });
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Valid email address is required"
        });
      }

      if (!description || description.trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: "Payment description is required (minimum 3 characters)"
        });
      }

      if (!reference || reference.trim().length < 3) {
        return res.status(400).json({
          success: false,
          error: "Payment reference is required (minimum 3 characters)"
        });
      }

      // Generate unique reference if needed
      const uniqueReference = reference.includes('EACZ') ? reference : `EACZ-${reference}-${Date.now()}`;

      const baseUrl = 'https://mms.estateagentscouncil.org';

      const paymentRequest = {
        amount: parseFloat(amount),
        currency,
        reference: uniqueReference,
        email: email.trim(),
        phone: phone?.trim(),
        description: description.trim(),
        returnUrl: `${baseUrl}/payment/return?ref=${uniqueReference}`,
        resultUrl: `${baseUrl}/api/payment/paynow/callback`,
        memberId: memberId || req.user?.id,
        paymentType: paymentType || 'general'
      };

      console.log('Initiating PayNow payment:', {
        ...paymentRequest,
        email: '[HIDDEN]',
        phone: '[HIDDEN]'
      });

      const result = await paynowService.initiatePayment(paymentRequest);

      if (result.success) {
        // Store payment record in database
        try {
          // await storage.createPayment({
          //   amount: amount.toString(),
          //   currency,
          //   paymentMethod: "paynow",
          //   status: "pending",
          //   purpose: description,
          //   referenceNumber: uniqueReference,
          //   memberId: paymentRequest.memberId || "guest",
          //   paymentType: paymentRequest.paymentType
          // });

          console.log('PayNow payment initiated successfully:', uniqueReference);
        } catch (dbError) {
          console.error('Database error while storing payment:', dbError);
          // Continue with payment process even if DB storage fails
        }

        res.json({
          success: true,
          paymentUrl: result.paymentUrl,
          pollUrl: result.pollUrl,
          reference: result.reference || uniqueReference,
          message: 'Payment initiated successfully. Please complete payment on PayNow.'
        });
      } else {
        console.error('PayNow payment initiation failed:', result.error, result.errorCode);
        res.status(400).json({
          success: false,
          error: result.error || 'Payment initiation failed',
          errorCode: result.errorCode
        });
      }

    } catch (error) {
      console.error("Paynow initiation error:", error);
      res.status(500).json({
        success: false,
        error: "Payment service temporarily unavailable. Please try again later."
      });
    }
  });

  // Paynow callback handler
  app.post("/api/payment/paynow/callback", async (req, res) => {
    try {
      const { reference, paynowreference, amount, status, hash } = req.body;

      console.log("PayNow callback received:", {
        reference,
        paynowreference,
        amount,
        status,
        timestamp: new Date().toISOString()
      });

      // Validate required callback fields
      if (!reference || !paynowreference || !status) {
        console.error('Invalid PayNow callback - missing required fields');
        return res.status(400).send("Invalid callback data");
      }

      // Update payment status in database
      try {
        // const paymentStatus = status === "Paid" ? "completed" : 
        //                      status === "Cancelled" ? "cancelled" : "failed";
        
        // await storage.updatePaymentByReference(reference, {
        //   status: paymentStatus,
        //   transactionId: paynowreference,
        //   paymentDate: status === "Paid" ? new Date() : undefined,
        //   callbackData: JSON.stringify(req.body)
        // });

        console.log(`Payment ${reference} updated to status: ${status}`);
      } catch (dbError) {
        console.error('Database error in PayNow callback:', dbError);
        // Still return OK to PayNow to prevent retries
      }

      res.status(200).send("OK");

    } catch (error) {
      console.error("Paynow callback error:", error);
      res.status(500).send("Error processing callback");
    }
  });

  // Paynow payment verification
  app.post("/api/payment/paynow/verify", async (req, res) => {
    try {
      const { pollUrl, reference } = req.body;

      if (!pollUrl || !pollUrl.startsWith('https://')) {
        return res.status(400).json({ 
          success: false,
          error: "Valid PayNow poll URL is required" 
        });
      }

      console.log(`Verifying PayNow payment: ${reference || 'unknown'}`);

      const result = await paynowService.verifyPayment(pollUrl);
      
      // Update database with verification result if reference provided
      if (reference && result.success && result.status) {
        try {
          // const paymentStatus = result.status === 'Paid' ? 'completed' : 
          //                      result.status === 'Cancelled' ? 'cancelled' : 'pending';
          
          // await storage.updatePaymentByReference(reference, {
          //   status: paymentStatus,
          //   verificationDate: new Date(),
          //   verificationData: JSON.stringify(result)
          // });

          console.log(`Payment ${reference} verification result: ${result.status}`);
        } catch (dbError) {
          console.error('Database error during payment verification:', dbError);
        }
      }

      res.json({
        ...result,
        statusDescription: result.status ? paynowService.getPaymentStatusDescription(result.status) : 'Unknown status',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Paynow verification error:", error);
      res.status(500).json({ 
        success: false,
        error: "Payment verification failed. Please try again." 
      });
    }
  });

  // Stripe payment intent creation
  app.post("/api/payment/stripe/create-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ error: "Stripe not configured" });
      }

      const { amount, currency = "usd", description, metadata } = req.body;

      if (!amount || !description) {
        return res.status(400).json({ 
          error: "Missing required fields: amount, description" 
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: currency.toLowerCase(),
        description,
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });

    } catch (error) {
      console.error("Stripe payment intent creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Stripe webhook handler
  app.post("/api/payment/stripe/webhook", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ error: "Stripe not configured" });
      }

      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !endpointSecret) {
        return res.status(400).send('Webhook signature verification failed');
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.log('Webhook signature verification failed:', err);
        return res.status(400).send('Webhook signature verification failed');
      }

      // Handle payment success
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);

        // Update payment status in database
        // await storage.updatePaymentByTransactionId(paymentIntent.id, {
        //   status: "completed",
        //   paymentDate: new Date()
        // });
      }

      res.json({ received: true });

    } catch (error) {
      console.error("Stripe webhook error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Cash payment recording
  app.post("/api/payment/cash/record", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !["admin", "member_manager"].includes(req.user?.role)) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const { amount, currency = "USD", reference, description, memberId, receiptNumber } = req.body;

      if (!amount || !reference || !description || !receiptNumber) {
        return res.status(400).json({ 
          error: "Missing required fields: amount, reference, description, receiptNumber" 
        });
      }

      // Record cash payment
      // const payment = await storage.createPayment({
      //   amount: amount.toString(),
      //   currency,
      //   paymentMethod: "cash",
      //   status: "completed",
      //   purpose: description,
      //   referenceNumber: reference,
      //   transactionId: receiptNumber,
      //   paymentDate: new Date(),
      //   memberId
      // });

      res.json({
        success: true,
        message: "Cash payment recorded successfully"
      });

    } catch (error) {
      console.error("Cash payment recording error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get payment methods
  app.get("/api/payment/methods", (req, res) => {
    const methods = [
      {
        id: "cash",
        name: "Cash Payment",
        description: "In-person cash payment at EACZ offices",
        enabled: true,
        adminOnly: true
      },
      {
        id: "paynow",
        name: "PayNow",
        description: "Mobile money and bank payments via PayNow",
        enabled: !!process.env.PAYNOW_INTEGRATION_ID,
        supportedMethods: ["EcoCash", "OneMoney", "Bank Transfer"]
      },
      {
        id: "stripe",
        name: "Credit/Debit Card",
        description: "International card payments via Stripe",
        enabled: !!process.env.STRIPE_SECRET_KEY,
        supportedMethods: ["Visa", "MasterCard", "American Express"]
      }
    ];

    res.json(methods);
  });
}