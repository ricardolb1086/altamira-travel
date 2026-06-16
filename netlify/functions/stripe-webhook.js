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

      // Detalles del viaje desde la metadata
      const md = session.metadata || {};
      const concepto = md.concepto || 'Servicios de viaje Altamira Travel';
      const detalleViaje = [
        md.fechas ? `Fechas del viaje: ${md.fechas}` : null,
        md.pax ? `${md.pax} pasajero(s)` : null,
      ].filter(Boolean).join(' · ');

      // Términos que protegen contra chargebacks (firmes y razonables)
      const TERMINOS =
        'Servicios no reembolsables ni endosables. Al confirmar el pago, el cliente acepta ' +
        'los Términos, la Política de Reembolsos y el Acuerdo de Reserva de Altamira Travel ' +
        '(altamiratravel.com). Una vez confirmada la reserva, los servicios se bloquean y ' +
        'prepagan con nuestros proveedores en destino, por lo que no admiten devolución ni ' +
        'transferencia. Se recomienda contratar un seguro de viaje. Los cambios de horario o ' +
        'cancelaciones de aerolíneas son responsabilidad exclusiva de la aerolínea.';

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
        description: detalleViaje ? `${concepto} — ${detalleViaje}` : concepto,
      });

      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: 'send_invoice',
        days_until_due: 1,
        auto_advance: false,
        description: detalleViaje
          ? `Servicios de viaje · Altamira Travel · ${detalleViaje}`
          : 'Servicios de viaje · Altamira Travel',
        footer: TERMINOS + '\n\nGracias por viajar con Altamira Travel · altamiratravel.com',
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
