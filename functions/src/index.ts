import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2023-10-16'
});

export const createStripeCheckoutSession = functions.firestore
  .document('stripe_checkout_sessions/{sessionId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: data.items,
        mode: 'payment',
        success_url: data.success_url,
        cancel_url: data.cancel_url,
        metadata: {
          orderId: context.params.sessionId
        }
      });

      await snap.ref.update({
        sessionId: session.id,
        created: admin.firestore.FieldValue.serverTimestamp()
      });

      return session;
    } catch (error) {
      const err = error as Error;
      await snap.ref.update({ error: err.message });
      throw error;
    }
  });

export const handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe.webhook_secret;

  try {
    if (!sig || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret
    );
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    const error = err as Error;
    console.error('Webhook Error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  if (!session.metadata?.orderId) return;

  const orderRef = admin.firestore().collection('orders').doc(session.metadata.orderId);
  
  await orderRef.set({
    status: 'paid',
    stripeSessionId: session.id,
    amount: session.amount_total,
    customerEmail: session.customer_email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}