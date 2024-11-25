import { loadStripe } from '@stripe/stripe-js';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem } from '../types';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createCheckoutSession(items: CartItem[]) {
  try {
    // Create checkout session in Firestore
    const checkoutSessionRef = await addDoc(collection(db, 'stripe_checkout_sessions'), {
      items: items.map(item => ({
        price: item.product.stripePriceId,
        quantity: item.quantity
      })),
      success_url: `${window.location.origin}/checkout/success`,
      cancel_url: `${window.location.origin}/cart`,
      created: new Date().toISOString()
    });

    // Wait for Cloud Function to create Stripe session
    let attempts = 0;
    let sessionData;

    while (attempts < 5) {
      const docSnap = await getDoc(checkoutSessionRef);
      sessionData = docSnap.data();
      
      if (sessionData?.sessionId) {
        break;
      }
      
      if (sessionData?.error) {
        throw new Error(sessionData.error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!sessionData?.sessionId) {
      throw new Error('Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionData.sessionId
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    toast.error(error.message || 'Failed to start checkout process');
    throw error;
  }
}