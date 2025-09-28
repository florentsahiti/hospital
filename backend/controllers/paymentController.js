import Stripe from 'stripe';
import Appointment from '../models/appointmentModel.js';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;
    const userId = req.body.userId; // Set by authUser middleware

    if (!appointmentId || !amount) {
      return res.status(400).json({ success: false, message: 'Appointment ID and amount are required' });
    }

    // Verify the appointment belongs to the user
    const appointment = await Appointment.findOne({ _id: appointmentId, userId });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        appointmentId: appointmentId,
        userId: userId
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

// Confirm payment and update appointment
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, appointmentId } = req.body;
    const userId = req.body.userId; // Set by authUser middleware

    if (!paymentIntentId || !appointmentId) {
      return res.status(400).json({ success: false, message: 'Payment intent ID and appointment ID are required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Verify the appointment belongs to the user
      const appointment = await Appointment.findOne({ _id: appointmentId, userId });
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });
      }

      // Update appointment status to paid
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { 
          paymentStatus: 'paid',
          paymentIntentId: paymentIntentId,
          paidAt: new Date()
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        appointment: updatedAppointment
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

// Webhook handler for Stripe events
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      
      // Update appointment status
      if (paymentIntent.metadata.appointmentId) {
        await Appointment.findByIdAndUpdate(
          paymentIntent.metadata.appointmentId,
          { 
            paymentStatus: 'paid',
            paymentIntentId: paymentIntent.id,
            paidAt: new Date()
          }
        );
      }
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
