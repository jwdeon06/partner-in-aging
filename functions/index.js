const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret);

admin.initializeApp();

exports.createStripeCheckoutSession = functions.firestore
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
      await snap.ref.update({ error: error.message });
      throw error;
    }
  });

exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe.webhook_secret;

  try {
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPaymentIntent(paymentIntent);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

async function handleSuccessfulPayment(session) {
  const orderId = session.metadata.orderId;
  const orderRef = admin.firestore().collection('orders').doc(orderId);
  
  await orderRef.set({
    status: 'paid',
    stripeSessionId: session.id,
    amount: session.amount_total,
    customerEmail: session.customer_email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

async function handleSuccessfulPaymentIntent(paymentIntent) {
  const orderRef = admin.firestore().collection('orders').doc(paymentIntent.metadata.orderId);
  
  await orderRef.update({
    paymentIntentId: paymentIntent.id,
    status: 'payment_succeeded',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}