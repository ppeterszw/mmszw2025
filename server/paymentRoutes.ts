/**
 * Enhanced Payment Routes with PayNow Integration
 */

import type { Express } from "express";
import { db } from "./db";
import { payments, paymentInstallments, members, organizations, memberRenewals } from "@shared/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { getPayNowService, PayNowService } from "./services/paynowService";
import { z } from "zod";

// Validation schemas
const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  paymentMethod: z.enum(["paynow_ecocash", "paynow_onemoney", "cash", "bank_transfer", "stripe_card"]),
  purpose: z.enum(["membership", "application", "renewal", "event", "fine", "subscription"]),
  description: z.string().optional(),
  memberId: z.string().optional(),
  organizationId: z.string().optional(),
  applicationId: z.string().optional(),
  eventId: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
});

const paynowExpressCheckoutSchema = z.object({
  paymentId: z.string(),
  phoneNumber: z.string().regex(/^(?:\+263|0)[0-9]{9}$/, "Invalid Zimbabwe phone number"),
  paymentMethod: z.enum(["ecocash", "onemoney"]),
});

export function registerPaymentRoutes(app: Express) {
  const paynow = getPayNowService();

  /**
   * Create a new payment
   * POST /api/payments/create
   */
  app.post("/api/payments/create", async (req, res) => {
    try {
      const paymentData = createPaymentSchema.parse(req.body);
      const userId = (req as any).user?.id;

      // Generate unique payment reference
      const paymentNumber = PayNowService.generateReference('EACZ-PAY');
      const referenceNumber = PayNowService.generateReference('REF');

      // Calculate fees (2.5% for PayNow transactions)
      let fees = 0;
      if (paymentData.paymentMethod.startsWith('paynow_')) {
        fees = paymentData.amount * 0.025; // 2.5% processing fee
      }

      const netAmount = paymentData.amount - fees;

      // Create payment record
      const [payment] = await db.insert(payments).values({
        paymentNumber,
        memberId: paymentData.memberId || null,
        organizationId: paymentData.organizationId || null,
        applicationId: paymentData.applicationId || null,
        eventId: paymentData.eventId || null,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        status: 'pending',
        purpose: paymentData.purpose,
        description: paymentData.description || `${paymentData.purpose} payment`,
        referenceNumber,
        fees: fees.toString(),
        netAmount: netAmount.toString(),
        processedBy: userId || null,
        createdAt: new Date(),
      }).returning();

      // If PayNow payment, initiate transaction
      if (paymentData.paymentMethod.startsWith('paynow_')) {
        const paymentMethod = paymentData.paymentMethod === 'paynow_ecocash' ? 'ecocash' : 'onemoney';

        // Check if phone number provided for express checkout
        if (paymentData.phoneNumber) {
          const expressResult = await paynow.initiateExpressCheckout({
            amount: paymentData.amount,
            reference: referenceNumber,
            description: payment.description || '',
            paymentMethod,
            phoneNumber: paymentData.phoneNumber,
            email: paymentData.email,
          });

          if (expressResult.success) {
            return res.json({
              success: true,
              payment: {
                id: payment.id,
                paymentNumber: payment.paymentNumber,
                amount: payment.amount,
                status: payment.status,
                method: 'express',
              },
              paynow: {
                pollUrl: expressResult.pollUrl,
                instructions: expressResult.instructions,
              },
            });
          }
        }

        // Standard web payment
        const initResult = await paynow.initiatePayment({
          amount: paymentData.amount,
          reference: referenceNumber,
          description: payment.description || '',
          paymentMethod,
          email: paymentData.email,
          phone: paymentData.phoneNumber,
        });

        if (initResult.success) {
          // Update payment with PayNow details
          await db
            .update(payments)
            .set({
              gatewayResponse: JSON.stringify(initResult),
              updatedAt: new Date(),
            })
            .where(eq(payments.id, payment.id));

          return res.json({
            success: true,
            payment: {
              id: payment.id,
              paymentNumber: payment.paymentNumber,
              amount: payment.amount,
              status: payment.status,
              method: 'redirect',
            },
            paynow: {
              redirectUrl: initResult.redirectUrl,
              pollUrl: initResult.pollUrl,
              reference: initResult.reference,
            },
          });
        } else {
          // Update payment status to failed
          await db
            .update(payments)
            .set({
              status: 'failed',
              failureReason: initResult.error,
              updatedAt: new Date(),
            })
            .where(eq(payments.id, payment.id));

          return res.status(400).json({
            success: false,
            error: initResult.error,
            payment: {
              id: payment.id,
              status: 'failed',
            },
          });
        }
      }

      // For non-PayNow payments, return pending status
      res.json({
        success: true,
        payment: {
          id: payment.id,
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
          status: payment.status,
          referenceNumber: payment.referenceNumber,
        },
      });

    } catch (error: any) {
      console.error('Payment creation error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create payment',
      });
    }
  });

  /**
   * PayNow callback/webhook endpoint
   * POST /api/payments/paynow/callback
   */
  app.post("/api/payments/paynow/callback", async (req, res) => {
    try {
      const result = await paynow.processCallback(req.body);

      if (result.success) {
        // Additional processing based on payment purpose
        if (result.paymentId) {
          const [payment] = await db
            .select()
            .from(payments)
            .where(eq(payments.id, result.paymentId))
            .limit(1);

          if (payment && result.status === 'completed') {
            // Handle successful payment based on purpose
            await handleSuccessfulPayment(payment);
          }
        }

        res.json({
          success: true,
          message: 'Callback processed successfully',
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error('PayNow callback error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process callback',
      });
    }
  });

  /**
   * Check payment status
   * GET /api/payments/:paymentId/status
   */
  app.get("/api/payments/:paymentId/status", async (req, res) => {
    try {
      const { paymentId } = req.params;

      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, paymentId))
        .limit(1);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
        });
      }

      // If payment is pending and uses PayNow, check status
      if (payment.status === 'pending' && payment.paymentMethod?.startsWith('paynow_')) {
        const gatewayResponse = payment.gatewayResponse ? JSON.parse(payment.gatewayResponse) : null;

        if (gatewayResponse?.pollUrl) {
          const statusResult = await paynow.checkPaymentStatus(gatewayResponse.pollUrl);

          if (statusResult) {
            // Map PayNow status to our status
            const newStatus = mapPayNowStatusToInternal(statusResult.status);

            if (newStatus !== payment.status) {
              // Update payment status
              await db
                .update(payments)
                .set({
                  status: newStatus,
                  externalPaymentId: statusResult.paynowReference,
                  paymentDate: newStatus === 'completed' ? new Date() : null,
                  updatedAt: new Date(),
                })
                .where(eq(payments.id, payment.id));

              if (newStatus === 'completed') {
                await handleSuccessfulPayment({ ...payment, status: newStatus });
              }

              return res.json({
                success: true,
                payment: {
                  id: payment.id,
                  status: newStatus,
                  paynowReference: statusResult.paynowReference,
                },
              });
            }
          }
        }
      }

      res.json({
        success: true,
        payment: {
          id: payment.id,
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          purpose: payment.purpose,
          paymentDate: payment.paymentDate,
          referenceNumber: payment.referenceNumber,
        },
      });

    } catch (error: any) {
      console.error('Payment status check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check payment status',
      });
    }
  });

  /**
   * Initiate express checkout for existing payment
   * POST /api/payments/paynow/express-checkout
   */
  app.post("/api/payments/paynow/express-checkout", async (req, res) => {
    try {
      const checkoutData = paynowExpressCheckoutSchema.parse(req.body);

      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, checkoutData.paymentId))
        .limit(1);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
        });
      }

      if (payment.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Payment is not in pending status',
        });
      }

      const result = await paynow.initiateExpressCheckout({
        amount: parseFloat(payment.amount),
        reference: payment.referenceNumber || '',
        description: payment.description || '',
        paymentMethod: checkoutData.paymentMethod,
        phoneNumber: checkoutData.phoneNumber,
      });

      if (result.success) {
        // Update payment with new gateway response
        await db
          .update(payments)
          .set({
            gatewayResponse: JSON.stringify(result),
            updatedAt: new Date(),
          })
          .where(eq(payments.id, payment.id));

        res.json({
          success: true,
          pollUrl: result.pollUrl,
          instructions: result.instructions,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }

    } catch (error: any) {
      console.error('Express checkout error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to initiate express checkout',
      });
    }
  });

  /**
   * Get payment history for member/organization
   * GET /api/payments/history
   */
  app.get("/api/payments/history", async (req, res) => {
    try {
      const userId = (req as any).user?.id;
      const { memberId, organizationId, limit = 50, offset = 0 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      let query = db.select().from(payments);

      if (memberId) {
        query = query.where(eq(payments.memberId, memberId as string)) as any;
      } else if (organizationId) {
        query = query.where(eq(payments.organizationId, organizationId as string)) as any;
      }

      const paymentHistory = await query
        .orderBy(desc(payments.createdAt))
        .limit(Number(limit))
        .offset(Number(offset));

      res.json({
        success: true,
        payments: paymentHistory,
        count: paymentHistory.length,
      });

    } catch (error: any) {
      console.error('Payment history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch payment history',
      });
    }
  });

  /**
   * Create payment installment plan
   * POST /api/payments/:paymentId/installments
   */
  app.post("/api/payments/:paymentId/installments", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { numberOfInstallments, firstPaymentDate } = req.body;

      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, paymentId))
        .limit(1);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Payment not found',
        });
      }

      const totalAmount = parseFloat(payment.amount);
      const installmentAmount = totalAmount / numberOfInstallments;
      const installments = [];

      for (let i = 0; i < numberOfInstallments; i++) {
        const dueDate = new Date(firstPaymentDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        const [installment] = await db.insert(paymentInstallments).values({
          paymentId: payment.id,
          installmentNumber: i + 1,
          amount: installmentAmount.toString(),
          dueDate,
          status: 'pending',
        }).returning();

        installments.push(installment);
      }

      res.json({
        success: true,
        installments,
        message: `Created ${numberOfInstallments} installments`,
      });

    } catch (error: any) {
      console.error('Installment creation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create installments',
      });
    }
  });
}

/**
 * Helper function to handle successful payments
 */
async function handleSuccessfulPayment(payment: any) {
  try {
    // Handle based on payment purpose
    switch (payment.purpose) {
      case 'membership':
      case 'application':
        // Update application or member status
        if (payment.memberId) {
          await db
            .update(members)
            .set({
              membershipStatus: 'active',
              updatedAt: new Date(),
            })
            .where(eq(members.id, payment.memberId));
        }
        break;

      case 'renewal':
        // Update renewal status
        if (payment.memberId) {
          const renewals = await db
            .select()
            .from(memberRenewals)
            .where(
              and(
                eq(memberRenewals.memberId, payment.memberId),
                eq(memberRenewals.status, 'pending')
              )
            )
            .limit(1);

          if (renewals.length > 0) {
            await db
              .update(memberRenewals)
              .set({
                status: 'completed',
                paidAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(memberRenewals.id, renewals[0].id));

            // Extend membership expiry
            await db
              .update(members)
              .set({
                expiryDate: sql`${members.expiryDate} + INTERVAL '1 year'`,
                updatedAt: new Date(),
              })
              .where(eq(members.id, payment.memberId));
          }
        }
        break;

      default:
        console.log(`Payment completed for purpose: ${payment.purpose}`);
    }

    // TODO: Send email notification
    // TODO: Generate receipt

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

/**
 * Map PayNow status to internal payment status
 */
function mapPayNowStatusToInternal(paynowStatus: string): string {
  switch (paynowStatus) {
    case 'paid':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}
