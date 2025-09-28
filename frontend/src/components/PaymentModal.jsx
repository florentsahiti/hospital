import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SC32SEQmKd7WPTHiPvGlq84EU3LjAqL9rZ57l374FCC6IqzNQGdxFpOYTvgydH2RH15IMI5l6DRLYZZMHKHtygA00HBI4hEzN');

const PaymentForm = ({ appointment, backendUrl, token, onPaymentSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent
      const { data: paymentIntentData } = await axios.post(
        `${backendUrl}/api/payment/create-payment-intent`,
        {
          appointmentId: appointment._id,
          amount: appointment.amount
        },
        { headers: { token } }
      );

      if (!paymentIntentData.success) {
        toast.error(paymentIntentData.message);
        setProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      );

      if (error) {
        toast.error(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const { data: confirmData } = await axios.post(
          `${backendUrl}/api/payment/confirm-payment`,
          {
            paymentIntentId: paymentIntent.id,
            appointmentId: appointment._id
          },
          { headers: { token } }
        );

        if (confirmData.success) {
          toast.success('Payment successful!');
          onPaymentSuccess();
          onClose();
        } else {
          toast.error(confirmData.message);
        }
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
        <p className="text-sm text-gray-600 mb-2">
          Doctor: {appointment.docData.name}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Date: {appointment.slotDate}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Amount: ${appointment.amount}
        </p>
        
        <div className="border p-3 rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay $${appointment.amount}`}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ appointment, backendUrl, token, onPaymentSuccess, onClose }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm
            appointment={appointment}
            backendUrl={backendUrl}
            token={token}
            onPaymentSuccess={onPaymentSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
