const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { generateItineraryPDF } = require('./generate-itinerary-pdf');

const EMAIL_STRINGS = {
  es: {
    personalizedItinerary: 'ITINERARIO PERSONALIZADO', hello: 'Hola', defaultRecipient: 'viajero',
    defaultNote: 'Preparamos esta propuesta especialmente para ti.', yourNextTrip: 'TU PRÓXIMO VIAJE',
    adjustDetail: 'Si deseas ajustar algún detalle, responde directamente a este correo. Será un placer diseñarlo contigo.',
    terms: 'Términos y condiciones', day: 'DÍA', dayTbd: 'Jornada por definir',
    breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena', origin: 'Origen', destination: 'Destino',
    programPerPerson: 'PROGRAMA POR PERSONA', flightsPerPerson: 'VUELOS POR PERSONA', totalEstimated: 'TOTAL ESTIMADO',
    dayByDay: 'El viaje, día a día', flights: 'Vuelos', includes: 'El viaje incluye', excludes: 'No incluye',
    subjectPrefix: 'Tu itinerario Altamira'
  },
  en: {
    personalizedItinerary: 'PERSONALIZED ITINERARY', hello: 'Hi', defaultRecipient: 'traveler',
    defaultNote: 'We prepared this proposal especially for you.', yourNextTrip: 'YOUR NEXT TRIP',
    adjustDetail: "If you'd like to adjust any detail, just reply to this email. We'd love to design it with you.",
    terms: 'Terms and conditions', day: 'DAY', dayTbd: 'Day to be defined',
    breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', origin: 'Origin', destination: 'Destination',
    programPerPerson: 'PROGRAM PER PERSON', flightsPerPerson: 'FLIGHTS PER PERSON', totalEstimated: 'TOTAL ESTIMATED',
    dayByDay: 'Your trip, day by day', flights: 'Flights', includes: 'The trip includes', excludes: 'Not included',
    subjectPrefix: 'Your Altamira itinerary'
  }
};
function getEmailLang(trip) { return trip?.trip?.lang === 'en' ? 'en' : 'es'; }

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return response(405, { error: 'Método no permitido.' });
  const accessCode = process.env.ITINERARY_ACCESS_CODE || process.env.ADMIN_PASSCODE;
  if (!process.env.RESEND_API_KEY || !accessCode) {
    return response(503, { error: 'El envío por correo aún no está configurado en Netlify.' });
  }
  if (event.headers['x-altamira-code'] !== accessCode) {
    return response(401, { error: 'El código privado no es correcto.' });
  }
  try {
    const body = JSON.parse(event.body || '{}');
    if (!EMAIL_PATTERN.test(body.to || '')) return response(400, { error: 'Escribe un correo válido.' });
    if (!body.trip?.trip?.title) return response(400, { error: 'El itinerario no tiene nombre.' });
    const lang = getEmailLang(body.trip);
    const L = EMAIL_STRINGS[lang];
    const safeTitle = escapeHTML(body.trip.trip.title);
    const safeName = escapeHTML(body.recipientName || body.trip.trip.client || L.defaultRecipient);
    const safeNote = escapeHTML(body.note || L.defaultNote).replace(/\n/g, '<br>');
    const rendered = renderItinerary(body.trip, lang);
    const pdf = body.pdfBase64 ? decodePDF(body.pdfBase64) : await generateItineraryPDF(body.trip);
    rendered.attachments.push({
      content: pdf.toString('base64'),
      filename: `${slug(body.trip.trip.title)}.pdf`,
      content_type: 'application/pdf'
    });
    const cover = rendered.coverCid ? `<img src="cid:${rendered.coverCid}" alt="${safeTitle}" style="width:100%;height:auto;display:block">` : '';
    const emailHTML = `<!doctype html><html><body style="margin:0;background:#f4efe6;color:#2e2820;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 14px"><table role="presentation" width="640" style="max-width:640px;background:#fffdf8;border-collapse:collapse"><tr><td style="background:#2e2820;padding:34px 42px;color:#f7f0e5"><div style="font-family:Georgia,serif;font-size:22px;letter-spacing:3px">ALTA<span style="color:#c47646">MIRA</span> · TRAVEL</div><div style="font-size:11px;letter-spacing:2px;margin-top:8px;color:#d7c8b8">${L.personalizedItinerary}</div></td></tr>${cover?`<tr><td>${cover}</td></tr>`:''}<tr><td style="padding:42px"><p style="font-family:Georgia,serif;font-size:22px;margin:0 0 12px">${L.hello} ${safeName},</p><p style="font-size:15px;line-height:1.7;color:#5f574e;margin:0 0 28px">${safeNote}</p><div style="border-top:1px solid #ded7ca;border-bottom:1px solid #ded7ca;padding:28px 0"><div style="font-size:10px;letter-spacing:2px;color:#a85e32">${L.yourNextTrip}</div><h1 style="font-family:Georgia,serif;font-weight:normal;font-size:42px;line-height:1;margin:9px 0 14px">${safeTitle}</h1><p style="color:#6b6258">${escapeHTML(body.trip.trip.route || '')}</p></div><div class="email-proposal" style="margin-top:30px">${rendered.html}</div><p style="font-size:13px;line-height:1.7;color:#655c53;margin-top:34px">${L.adjustDetail}</p></td></tr><tr><td style="background:#efe6da;padding:25px 42px;font-size:12px;line-height:1.7;color:#5f574e">Altamira Travel · Miami, Florida · <a href="https://altamiratravel.com" style="color:#a85e32">altamiratravel.com</a><br><a href="https://altamiratravel.com/terminos" style="color:#a85e32">${L.terms}</a></td></tr></table></td></tr></table></body></html>`;
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.ITINERARY_FROM || 'Altamira Travel <itinerarios@altamiratravel.com>', to: [body.to], reply_to: process.env.ITINERARY_REPLY_TO || 'hola@altamiratravel.com', subject: `${L.subjectPrefix} · ${body.trip.trip.title}`, html: emailHTML, attachments: rendered.attachments })
    });
    const result = await resendResponse.json();
    if (!resendResponse.ok) throw new Error(result.message || 'El proveedor de correo rechazó el envío.');
    return response(200, { ok: true, id: result.id });
  } catch (error) {
    console.error('send-itinerary:', error.message);
    return response(500, { error: 'No fue posible enviar el itinerario. Revisa la configuración e inténtalo nuevamente.' });
  }
};

function escapeHTML(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function decodePDF(value = '') {
  if (!/^[A-Za-z0-9+/=]+$/.test(value) || value.length > 5600000) throw new Error('El PDF adjunto no es válido o supera el tamaño permitido.');
  const pdf = Buffer.from(value, 'base64');
  if (pdf.length < 5 || pdf.length > 4200000 || pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error('El archivo adjunto no es un PDF válido.');
  return pdf;
}
function renderItinerary(data, lang = 'es') {
  const L = EMAIL_STRINGS[lang];
  const attachments = [];
  let encodedSize = 0;
  const inlineImage = (dataUrl, id, filename) => {
    if (/^https:\/\/[a-z0-9.-]+\/[^\s]+$/i.test(dataUrl || '')) {
      attachments.push({ path: dataUrl, filename, content_disposition: 'inline', content_id: id });
      return id;
    }
    const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
    if (!match || attachments.length >= 7 || encodedSize + match[2].length > 4000000) return '';
    encodedSize += match[2].length;
    attachments.push({ content: match[2], filename, content_type: match[1], content_disposition: 'inline', content_id: id });
    return id;
  };
  const coverCid = inlineImage(data.trip?.cover, 'altamira-cover', 'portada.jpg');
  const days = (data.days || []).filter(day => day.title || day.activities || day.description).map((day, index) => {
    const activities = lines(day.activities).map(item => `<li style="margin:0 0 7px">${escapeHTML(item)}</li>`).join('');
    const meals = [day.breakfast && L.breakfast, day.lunch && L.lunch, day.dinner && L.dinner].filter(Boolean).join(' · ');
    const imageCid = inlineImage(day.image, `altamira-day-${index + 1}`, `dia-${index + 1}.jpg`);
    return `<div style="border-top:1px solid #ded7ca;padding:22px 0"><div style="font-size:10px;letter-spacing:2px;color:#a85e32">${L.day} ${index + 1}${day.date ? ` · ${escapeHTML(day.date)}` : ''}</div><h3 style="font-family:Georgia,serif;font-size:25px;font-weight:normal;margin:7px 0 10px">${escapeHTML(day.title || L.dayTbd)}</h3>${imageCid ? `<img src="cid:${imageCid}" alt="" style="width:100%;height:auto;display:block;border-radius:5px;margin:14px 0">` : ''}${day.description ? `<p style="font-size:14px;line-height:1.65;color:#5f574e">${escapeHTML(day.description)}</p>` : ''}${activities ? `<ul style="padding-left:20px;font-size:13px;line-height:1.5;color:#4d463f">${activities}</ul>` : ''}${meals ? `<p style="font-size:10px;letter-spacing:1px;color:#a85e32">${escapeHTML(meals.toUpperCase())}</p>` : ''}</div>`;
  }).join('');
  const flights = (data.flights || []).filter(flight => flight.from || flight.to || flight.airline).map(flight => `<div style="border:1px solid #ded7ca;border-radius:5px;padding:15px;margin:0 0 10px"><strong style="font-family:Georgia,serif;font-size:18px;font-weight:normal">${escapeHTML(flight.from || L.origin)} → ${escapeHTML(flight.to || L.destination)}</strong><div style="font-size:12px;color:#6b6258;margin-top:5px">${escapeHTML([flight.airline, flight.number, flight.date, flight.depart && flight.arrive ? `${flight.depart} – ${flight.arrive}` : ''].filter(Boolean).join(' · '))}</div>${flight.notes ? `<p style="font-size:12px;line-height:1.5;color:#a85e32;margin:8px 0 0">${escapeHTML(flight.notes)}</p>` : ''}</div>`).join('');
  const includes = lines(data.details?.includes).map(item => `<li style="margin-bottom:6px">${escapeHTML(item)}</li>`).join('');
  const excludes = lines(data.details?.excludes).map(item => `<li style="margin-bottom:6px">${escapeHTML(item)}</li>`).join('');
  const price = Number(data.pricing?.price || 0);
  const airfare = Number(data.pricing?.airfare || 0);
  const total = price + airfare;
  const currency = escapeHTML(data.pricing?.currency || 'USD');
  const pricing = price || airfare ? `<div style="background:#2e2820;color:#fff8ed;padding:24px;margin:28px 0"><table role="presentation" style="width:100%;border-collapse:collapse"><tr>${price ? `<td style="padding:0 12px 0 0"><span style="font-size:9px;letter-spacing:1.5px;color:#d8cbbc">${L.programPerPerson}</span><div style="font-family:Georgia,serif;font-size:25px;color:#df9a70;margin-top:6px">${currency} ${price.toLocaleString('en-US')}</div></td>` : ''}${airfare ? `<td style="padding:0 12px"><span style="font-size:9px;letter-spacing:1.5px;color:#d8cbbc">${L.flightsPerPerson}</span><div style="font-family:Georgia,serif;font-size:25px;color:#df9a70;margin-top:6px">${currency} ${airfare.toLocaleString('en-US')}</div></td><td style="padding:0 0 0 12px"><span style="font-size:9px;letter-spacing:1.5px;color:#d8cbbc">${L.totalEstimated}</span><div style="font-family:Georgia,serif;font-size:25px;color:#fff8ed;margin-top:6px">${currency} ${total.toLocaleString('en-US')}</div></td>` : ''}</tr></table>${data.pricing?.fareNotice ? `<p style="border-top:1px solid #4c443b;margin:18px 0 0;padding-top:14px;font-size:11px;line-height:1.5;color:#d8cbbc">${escapeHTML(data.pricing.fareNotice)}</p>` : ''}</div>` : '';
  const html = `${data.trip?.summary ? `<p style="font-family:Georgia,serif;font-size:19px;line-height:1.65;color:#5f574e">${escapeHTML(data.trip.summary)}</p>` : ''}<h2 style="font-family:Georgia,serif;font-size:30px;font-weight:normal;margin:34px 0 5px">${L.dayByDay}</h2>${days}${flights ? `<h2 style="font-family:Georgia,serif;font-size:30px;font-weight:normal;margin:34px 0 14px">${L.flights}</h2>${flights}` : ''}${pricing}${includes ? `<h3 style="font-family:Georgia,serif;font-size:23px;font-weight:normal">${L.includes}</h3><ul style="padding-left:20px;font-size:13px;line-height:1.5">${includes}</ul>` : ''}${excludes ? `<h3 style="font-family:Georgia,serif;font-size:23px;font-weight:normal">${L.excludes}</h3><ul style="padding-left:20px;font-size:13px;line-height:1.5">${excludes}</ul>` : ''}`;
  return { html, attachments, coverCid };
}
function lines(value = '') { return String(value || '').split('\n').map(item => item.trim()).filter(Boolean); }
function slug(value = '') { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'itinerario-altamira'; }
function response(statusCode, body) { return { statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) }; }
