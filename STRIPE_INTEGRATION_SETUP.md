# Stripe Payment Gateway Integration Setup

This guide will help you set up Stripe payment gateway integration in your hospital management system.

## Prerequisites

Before starting, make sure you have:
- Node.js installed
- A Stripe account (test mode for development)
- The provided Stripe keys

## Installation Steps

### 1. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install stripe
```

#### Frontend Dependencies
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Environment Variables Setup

Add the following environment variables to your `backend/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51SC32SEQmKd7WPTHfNCOqmmmi6IMxJZUcHUfK3cDKl62BJNXt3WfPuZmrmfT9YR57CnLQdrnOnA3SC0YZrciXYbO006Y7M8pLU
STRIPE_PUBLISHABLE_KEY=pk_test_51SC32SEQmKd7WPTHiPvGlq84EU3LjAqL9rZ57l374FCC6IqzNQGdxFpOYTvgydH2RH15IMI5l6DRLYZZMHKHtygA00HBI4hEzN
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

For the frontend, create a `.env` file in the frontend directory:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SC32SEQmKd7WPTHiPvGlq84EU3LjAqL9rZ57l374FCC6IqzNQGdxFpOYTvgydH2RH15IMI5l6DRLYZZMHKHtygA00HBI4hEzN
```

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

### 3. Database Schema Updates

The appointment model has been updated to include:
- `paymentStatus`: 'pending', 'paid', 'failed'
- `paymentIntentId`: Stripe payment intent ID
- `paidAt`: Payment completion timestamp

### 4. Backend API Endpoints

The following endpoints have been added:

#### Create Payment Intent
```
POST /api/payment/create-payment-intent
Headers: { token: "your_jwt_token" }
Body: { appointmentId: "appointment_id", amount: 100 }
```

#### Confirm Payment
```
POST /api/payment/confirm-payment
Headers: { token: "your_jwt_token" }
Body: { paymentIntentId: "pi_xxx", appointmentId: "appointment_id" }
```

#### Webhook (for production)
```
POST /api/payment/webhook
```

### 5. Frontend Components

#### PaymentModal Component
- Located at: `frontend/src/components/PaymentModal.jsx`
- Handles Stripe payment form
- Uses Stripe Elements for secure card input

#### Updated MyAppointments Component
- Added payment button functionality
- Shows payment status
- Integrates with PaymentModal

## Usage

1. **Start the backend server:**
   ```bash
   cd backend
   npm run server
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the payment flow:**
   - Login to your application
   - Go to "My Appointments"
   - Click "Pay Online" on any unpaid appointment
   - Use test card numbers:
     - Success: `4242 4242 4242 4242`
     - Decline: `4000 0000 0000 0002`

## Test Card Numbers

For testing purposes, use these Stripe test card numbers:

- **Visa (Success)**: 4242 4242 4242 4242
- **Visa (Decline)**: 4000 0000 0000 0002
- **Mastercard (Success)**: 5555 5555 5555 4444
- **American Express (Success)**: 3782 822463 10005

Use any future expiry date and any 3-digit CVC.

## Security Notes

1. **Never expose secret keys** in frontend code
2. **Use HTTPS** in production
3. **Validate webhooks** using Stripe's webhook signatures
4. **Store sensitive data** securely on your backend

## Production Setup

For production deployment:

1. Replace test keys with live keys
2. Set up webhook endpoints in Stripe Dashboard
3. Configure proper error handling
4. Add logging and monitoring
5. Test thoroughly with real payment methods

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend allows requests from frontend
2. **Invalid API Key**: Verify your Stripe keys are correct
3. **Payment Intent Creation Failed**: Check backend logs and network connectivity
4. **Card Element Not Loading**: Verify Stripe publishable key is correct

### Debug Mode:

Enable Stripe debug mode by adding to your frontend:
```javascript
const stripePromise = loadStripe(publishableKey, {
  stripeAccount: 'your_account_id' // for connected accounts
});
```

## Support

For Stripe-related issues:
- Check [Stripe Documentation](https://stripe.com/docs)
- Review [Stripe API Reference](https://stripe.com/docs/api)
- Contact Stripe Support for account-specific issues

For application-specific issues, check the console logs and network requests.
