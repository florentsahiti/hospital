import 'dotenv/config';
import Stripe from 'stripe';

console.log('Testing Stripe configuration...');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
  console.log('Please create a .env file in the backend directory with:');
  console.log('STRIPE_SECRET_KEY=sk_test_51SC32SEQmKd7WPTHfNCOqmmmi6IMxJZUcHUfK3cDKl62BJNXt3WfPuZmrmfT9YR57CnLQdrnOnA3SC0YZrciXYbO006Y7M8pLU');
  process.exit(1);
}

try {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe initialized successfully');
  
  // Test creating a payment intent
  stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    metadata: { test: 'true' }
  }).then(paymentIntent => {
    console.log('✅ Test payment intent created:', paymentIntent.id);
    console.log('✅ Stripe integration is working correctly!');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error creating test payment intent:', error.message);
    process.exit(1);
  });
} catch (error) {
  console.error('❌ Error initializing Stripe:', error.message);
  process.exit(1);
}
