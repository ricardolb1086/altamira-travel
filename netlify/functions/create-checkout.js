// ─────────────────────────────────────────────────────────────
// Altamira Travel — Generador de links de pago Stripe
// Crea una Checkout Session con checkbox de Términos OBLIGATORIO.
// La clave secreta vive en process.env.STRIPE_SECRET_KEY (Netlify),
// nunca en el código público.
// ─────────────────────────────────────────────────────────────

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Solo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { concepto, monto, cliente, email, passcode, fechas, pax } = data;

    // ── Seguridad: passcode para que solo tú puedas generar links ──
    if (process.env.ADMIN_PASSCODE && passcode !== process.env.ADMIN_PASSCODE) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Código incorrecto' }) };
    }

    // ── Validaciones ──
    if (!concepto || !monto) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Falta concepto o monto' }) };
    }
    const montoNum = Number(monto);
    if (isNaN(montoNum) || montoNum < 1) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Monto inválido' }) };
    }

    const dominio = process.env.URL || 'https://altamiratravel.com';

    // ── Crear la sesión de pago ──
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: concepto,
            description: [
              cliente ? `Reserva a nombre de ${cliente}` : null,
              fechas ? `Fechas del viaje: ${fechas}` : null,
              pax ? `${pax} pasajero(s)` : null,
            ].filter(Boolean).join(' · ') || undefined,
          },
          unit_amount: Math.round(montoNum * 100), // Stripe usa centavos
        },
        quantity: 1,
      }],
      // ✅ Factura formal automática (Stripe la crea, numera y envía al pagar)
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Servicios de viaje · Altamira Travel',
          custom_fields: [
            cliente ? { name: 'Cliente', value: cliente } : null,
            fechas ? { name: 'Fechas del viaje', value: fechas } : null,
            pax ? { name: 'Pasajeros', value: String(pax) } : null,
          ].filter(Boolean),
          footer:
            'Servicios no reembolsables ni endosables. Al confirmar el pago, el cliente acepta ' +
            'los Términos, la Política de Reembolsos y el Acuerdo de Reserva de Altamira Travel ' +
            '(altamiratravel.com). Una vez confirmada la reserva, los servicios se bloquean y ' +
            'prepagan con nuestros proveedores en destino, por lo que no admiten devolución ni ' +
            'transferencia. Se recomienda contratar un seguro de viaje. Los cambios de horario o ' +
            'cancelaciones de aerolíneas son responsabilidad exclusiva de la aerolínea. ' +
            'Gracias por viajar con Altamira Travel.',
        },
      },
      metadata: {
        concepto: concepto,
        cliente: cliente || '',
        fechas: fechas || '',
        pax: pax || '',
      },
      // ✅ Checkbox OBLIGATORIO de Términos (registra aceptación con fecha/hora)
      consent_collection: {
        terms_of_service: 'required',
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: 'Acepto los [Términos y Condiciones](https://altamiratravel.com/terminos.html), la [Política de Reembolsos](https://altamiratravel.com/reembolsos.html) y el [Acuerdo de Reserva](https://altamiratravel.com/acuerdo-de-reserva.html) de Altamira Travel.',
        },
        submit: {
          message: 'Tu reserva se confirmará una vez recibido el pago.',
        },
      },
      // Pre-llenar email si lo tenemos
      customer_email: email || undefined,
      // Recolectar datos para evidencia anti-chargeback
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      success_url: `${dominio}/pago-exitoso.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${dominio}/pago-cancelado.html`,
      locale: 'es',
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url, id: session.id }),
    };

  } catch (err) {
    console.error('Error creando checkout:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Error interno' }),
    };
  }
};
