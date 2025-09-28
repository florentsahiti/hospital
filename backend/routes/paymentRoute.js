import express from 'express';
import { createPaymentIntent, confirmPayment, stripeWebhook } from '../controllers/paymentController.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', authUser, createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', authUser, confirmPayment);

// Stripe webhook (no auth required)
router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);

export default router;
