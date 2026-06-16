// ─────────────────────────────────────────────────────────────
// Altamira Travel — Webhook de Stripe (registro)
// La factura formal ahora la crea Stripe automáticamente vía
// invoice_creation en el Checkout. Este webhook solo registra el
// evento (útil para logs / futuras automatizaciones).
// ─────────────────────────────────────────────────────────────

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Firma de webhook inválida:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const email = session.customer_details?.email || 'sin email';
    const total = (session.amount_total || 0) / 100;
    console.log(`✅ Pago completado · ${email} · $${total} ${session.currency?.toUpperCase()} · factura generada automáticamente por Stripe`);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
