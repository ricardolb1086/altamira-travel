// ─────────────────────────────────────────────────────────────
// Altamira Travel — Webhook de Stripe
// Cuando un pago (Checkout) se completa, genera automáticamente
// una factura formal en Stripe y se la envía al cliente por email.
// ─────────────────────────────────────────────────────────────

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  // Verificar que el evento viene realmente de Stripe (seguridad)
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

  // Solo nos interesa cuando un Checkout se completa
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      // Datos del cliente y la compra
      const email = session.customer_details?.email;
      const nombre = session.customer_details?.name || '';
      const total = session.amount_total; // en centavos
      const moneda = session.currency;

      // Recuperar el concepto de la línea comprada
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
      const concepto = lineItems.data[0]?.description || 'Servicios de viaje Altamira Travel';

      if (!email) {
        console.log('Sin email del cliente, no se puede facturar');
        return { statusCode: 200, body: 'OK (sin email)' };
      }

      // 1. Crear o encontrar el cliente en Stripe
      let customer;
      const existing = await stripe.customers.list({ email, limit: 1 });
      if (existing.data.length > 0) {
        customer = existing.data[0];
      } else {
        customer = await stripe.customers.create({ email, name: nombre });
      }

      // 2. Crear la factura (con cobro automático = ya pagada)
      const invoiceItem = await stripe.invoiceItems.create({
        customer: customer.id,
        amount: total,
        currency: moneda,
        description: concepto,
      });

      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: 'send_invoice',
        days_until_due: 1,
        auto_advance: false,
        description: 'Factura por servicios de viaje · Altamira Travel',
        footer: 'Gracias por viajar con Altamira Travel · altamiratravel.com',
      });

      // 3. Finalizar y marcar como pagada (el pago ya ocurrió)
      await stripe.invoices.finalizeInvoice(invoice.id);
      await stripe.invoices.pay(invoice.id, { paid_out_of_band: true });

      // 4. Enviar la factura al cliente por email
      await stripe.invoices.sendInvoice(invoice.id);

      console.log(`✅ Factura ${invoice.number} generada y enviada a ${email}`);
    } catch (err) {
      console.error('Error generando la factura:', err.message);
      // No fallamos el webhook para que Stripe no reintente infinitamente
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
