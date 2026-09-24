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
    bookingPayments: 'Reserva y pagos', paymentPlan: 'PLAN DE PAGOS', paymentConditions: 'CONDICIONES DE PAGO',
    optionalActivities: 'ACTIVIDADES OPCIONALES', optionalActivitiesSubtitle: 'Disponibles durante el recorrido (no incluidas en el precio del programa)',
    colCity: 'CIUDAD', colActivity: 'ACTIVIDAD', colAdult: 'ADULTO', colChild: 'NIÑO',
    importantInfo: 'Información importante', accommodation: 'Alojamiento', flightDetails: 'DETALLES DEL VUELO',
    localTimes: 'Todos los horarios corresponden a la hora local de cada ciudad.', hotelTbd: 'Hotel por confirmar', note: 'NOTA',
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
    bookingPayments: 'Booking and payments', paymentPlan: 'PAYMENT PLAN', paymentConditions: 'PAYMENT CONDITIONS',
    optionalActivities: 'OPTIONAL ACTIVITIES', optionalActivitiesSubtitle: 'Available during the trip (not included in the program price)',
    colCity: 'CITY', colActivity: 'ACTIVITY', colAdult: 'ADULT', colChild: 'CHILD',
    importantInfo: 'Important information', accommodation: 'Accommodation', flightDetails: 'FLIGHT DETAILS',
    localTimes: 'All times are local to each city.', hotelTbd: 'Hotel to be confirmed', note: 'NOTE',
    subjectPrefix: 'Your Altamira itinerary'
  }
};
function getEmailLang(trip) { return trip?.trip?.lang === 'en' ? 'en' : 'es'; }

exports.renderItinerary = (...args) => renderItinerary(...args);
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
    return `<div style="border-top:1px solid #ded7ca;padding:22px 0"><div style="font-size:10px;letter-spacing:2px;color:#a85e32">${L.day} ${index + 1}${day.date ? ` · ${escapeHTML(longDate(day.date, lang))}` : ''}</div><h3 style="font-family:Georgia,serif;font-size:25px;font-weight:normal;margin:7px 0 10px">${escapeHTML(day.title || L.dayTbd)}</h3>${imageCid ? `<img src="cid:${imageCid}" alt="" style="width:100%;height:auto;display:block;border-radius:5px;margin:14px 0">` : ''}${day.description ? `<p style="font-size:14px;line-height:1.65;color:#5f574e">${escapeHTML(day.description)}</p>` : ''}${activities ? `<ul style="padding-left:20px;font-size:13px;line-height:1.5;color:#4d463f">${activities}</ul>` : ''}${meals ? `<p style="font-size:10px;letter-spacing:1px;color:#a85e32">${escapeHTML(meals.toUpperCase())}</p>` : ''}${day.notes ? `<p style="font-size:12px;line-height:1.5;color:#6b6258;background:#f7f2e9;padding:10px 12px;border-radius:4px;margin:10px 0 0"><strong style="font-size:9px;letter-spacing:1.5px;color:#a85e32">${L.note}</strong>&nbsp; ${escapeHTML(day.notes)}</p>` : ''}</div>`;
  }).join('');
  const flights = (data.flights || []).filter(flight => flight.from || flight.to || flight.airline).map(flight => {
    const details = String(flight.notes || '').split(/\s+·\s+|\n/).map(part => part.trim()).filter(Boolean)
      .map(part => `<li style="margin:0 0 5px">${escapeHTML(part)}</li>`).join('');
    const cell = (head, value, place) => `<td style="padding:10px 12px 0 0;vertical-align:top"><div style="font-size:9px;letter-spacing:1.5px;color:#766d63">${head}</div><div style="font-family:Georgia,serif;font-size:21px;color:#2e2820;margin-top:3px">${escapeHTML(value || '-')}</div>${place ? `<div style="font-size:11px;color:#766d63">${escapeHTML(place)}</div>` : ''}</td>`;
    const carrier = [flight.airline, flight.number].filter(Boolean).join(' ');
    return `<div style="background:#f7f2e9;border-radius:6px;padding:18px 20px;margin:0 0 12px"><div style="font-size:12px;font-weight:bold;color:#2e2820;float:right">${escapeHTML(carrier)}</div><div style="font-family:Georgia,serif;font-size:22px;color:#2e2820;clear:both">${escapeHTML(flight.from || L.origin)} – ${escapeHTML(flight.to || L.destination)}</div><table role="presentation" style="border-collapse:collapse"><tr>${cell(L.day === 'DÍA' ? 'FECHA' : 'DATE', longDate(flight.date, lang), '')}${cell(L.day === 'DÍA' ? 'SALIDA' : 'DEPARTURE', flight.depart, flight.from)}${cell(L.day === 'DÍA' ? 'LLEGADA' : 'ARRIVAL', flight.arrive, flight.to)}</tr></table>${details ? `<div style="border-top:1px solid #ded7ca;margin-top:14px;padding-top:12px"><div style="font-size:9px;letter-spacing:1.5px;color:#a85e32;margin-bottom:8px">${L.flightDetails}</div><ul style="padding-left:18px;margin:0;font-size:13px;line-height:1.5;color:#2e2820">${details}</ul></div>` : ''}</div>`;
  }).join('');
  const hotels = (data.hotels || []).filter(hotel => hotel.name || hotel.city).map(hotel => `<div style="border:1px solid #ded7ca;border-radius:5px;padding:14px 16px;margin:0 0 10px"><strong style="font-family:Georgia,serif;font-size:18px;font-weight:normal">${escapeHTML(hotel.name || L.hotelTbd)}</strong><div style="font-size:12px;color:#6b6258;margin-top:4px">${escapeHTML([hotel.city, hotel.room, hotel.meals].filter(Boolean).join(' · '))}</div></div>`).join('');
  const includes = lines(data.details?.includes).map(item => `<li style="margin-bottom:6px">${escapeHTML(item)}</li>`).join('');
  const excludes = lines(data.details?.excludes).map(item => `<li style="margin-bottom:6px">${escapeHTML(item)}</li>`).join('');
  const price = Number(data.pricing?.price || 0);
  const airfare = Number(data.pricing?.airfare || 0);
  const total = price + airfare;
  const currency = escapeHTML(data.pricing?.currency || 'USD');
  const pricing = price || airfare ? `<div style="background:#2e2820;color:#fff8ed;padding:24px;margin:28px 0"><table role="presentation" style="width:100%;border-collapse:collapse"><tr>${price ? `<td style="padding:0 12px 0 0"><span style="font-size:9px;letter-spacing:1.5px;color:#d8cbbc">${L.programPerPerson}</span><div style="font-family:Georgia,serif;font-size:25px;color:#df9a70;margin-top:6px">${currency} ${price.toLocaleString('en-US')}</div></td>` : ''}${airfare ? `<td style="padding:0 12px"><span style="font-size:9px;letter-spacing:1.5px;color:#d8cbbc">${L.flightsPerPerson}</span><div style="font-family:Georgia,serif;font-size:25px;color:#df9a70;margin-top:6px">${currency} ${airfare.toLocaleString('en-US')}</div></td><td style="padding:0 0 0 12px"><span style="font-size:9px;letter-spacing:1.5px;color:#d8cbbc">${L.totalEstimated}</span><div style="font-family:Georgia,serif;font-size:25px;color:#fff8ed;margin-top:6px">${currency} ${total.toLocaleString('en-US')}</div></td>` : ''}</tr></table>${data.pricing?.fareNotice ? `<p style="border-top:1px solid #4c443b;margin:18px 0 0;padding-top:14px;font-size:11px;line-height:1.5;color:#d8cbbc">${escapeHTML(data.pricing.fareNotice)}</p>` : ''}</div>` : '';
  const money = text => escapeHTML(text).replace(/(\$[\d][\d,]*(?:\.\d{1,2})?)/g, '<strong style="color:#c47646">$1</strong>');
  const label = text => `<div style="font-size:10px;letter-spacing:2px;color:#a85e32;margin:26px 0 10px">${text}</div>`;
  const h2 = text => `<h2 style="font-family:Georgia,serif;font-size:30px;font-weight:normal;margin:34px 0 14px">${text}</h2>`;
  const paymentPlanItems = data.pricing?.paymentPlan || [];
  const paymentPlan = paymentPlanItems.length ? `${label(L.paymentPlan)}<table role="presentation" width="100%" style="border-collapse:collapse">${paymentPlanItems.map((item, index) => `<tr style="background:${index % 2 ? '#fffdf8' : '#f7f2e9'}"><td style="padding:13px 14px;font-size:14px;font-weight:bold;color:#2e2820;width:38%;vertical-align:top">${escapeHTML(item.label || '')}</td><td style="padding:13px 8px;font-size:13px;font-weight:bold;color:#c47646;vertical-align:top">${escapeHTML(item.amount || '').split('\n').join('<br>')}</td><td style="padding:13px 14px;font-size:12px;color:#6b6258;text-align:right;vertical-align:top">${escapeHTML(item.due || '')}</td></tr>`).join('')}</table>` : '';
  const optionalItems = data.pricing?.optionalActivities || [];
  const optional = optionalItems.length ? `${label(L.optionalActivities)}<p style="font-size:12px;color:#6b6258;margin:0 0 10px">${L.optionalActivitiesSubtitle}</p><table role="presentation" width="100%" style="border-collapse:collapse"><tr style="font-size:9px;letter-spacing:1.2px;color:#766d63"><td style="padding:6px 12px">${L.colCity}</td><td style="padding:6px 8px">${L.colActivity}</td><td style="padding:6px 8px;text-align:right">${L.colAdult}</td><td style="padding:6px 12px;text-align:right">${L.colChild}</td></tr>${optionalItems.map((item, index) => `<tr style="background:${index % 2 ? '#fffdf8' : '#f7f2e9'};font-size:13px"><td style="padding:10px 12px;font-weight:bold">${escapeHTML(item.city || '')}</td><td style="padding:10px 8px;color:#5f574e">${escapeHTML(item.name || '')}</td><td style="padding:10px 8px;text-align:right;font-weight:bold;color:#c47646">$${escapeHTML(item.adult ?? '')}</td><td style="padding:10px 12px;text-align:right;font-weight:bold;color:#c47646">$${escapeHTML(item.child ?? '')}</td></tr>`).join('')}</table>${data.pricing?.optionalActivitiesNote ? `<p style="font-size:12px;font-style:italic;color:#6b6258">${escapeHTML(data.pricing.optionalActivitiesNote)}</p>` : ''}` : '';
  const termsHtml = data.pricing?.terms ? `${label(L.paymentConditions)}${String(data.pricing.terms).split('\n').map(line => line.trim() ? `<p style="margin:0 0 5px;font-size:13px;line-height:1.6;color:#5f574e">${money(line)}</p>` : '<div style="height:8px"></div>').join('')}` : '';
  const booking = paymentPlan || optional || termsHtml ? `${h2(L.bookingPayments)}${paymentPlan}${optional}${termsHtml}` : '';
  const importantInfo = data.details?.requirements ? `${h2(L.importantInfo)}${String(data.details.requirements).split('\n').map(line => line.trim() ? `<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#5f574e">${escapeHTML(line)}</p>` : '').join('')}` : '';
  const html = `${data.trip?.summary ? `<p style="font-family:Georgia,serif;font-size:19px;line-height:1.65;color:#5f574e">${escapeHTML(data.trip.summary)}</p>` : ''}<h2 style="font-family:Georgia,serif;font-size:30px;font-weight:normal;margin:34px 0 5px">${L.dayByDay}</h2>${days}${flights ? `<h2 style="font-family:Georgia,serif;font-size:30px;font-weight:normal;margin:34px 0 6px">${L.flights}</h2><p style="font-size:12px;color:#6b6258;margin:0 0 14px">${L.localTimes}</p>${flights}` : ''}${hotels ? `${h2(L.accommodation)}${hotels}` : ''}${pricing}${booking}${includes ? `<h3 style="font-family:Georgia,serif;font-size:23px;font-weight:normal">${L.includes}</h3><ul style="padding-left:20px;font-size:13px;line-height:1.5">${includes}</ul>` : ''}${excludes ? `<h3 style="font-family:Georgia,serif;font-size:23px;font-weight:normal">${L.excludes}</h3><ul style="padding-left:20px;font-size:13px;line-height:1.5">${excludes}</ul>` : ''}${importantInfo}`;
  return { html, attachments, coverCid };
}
function longDate(value, lang = 'es') {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!m) return value || '';
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-US', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}
function lines(value = '') { return String(value || '').split('\n').map(item => item.trim()).filter(Boolean); }
function slug(value = '') { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'itinerario-altamira'; }
function response(statusCode, body) { return { statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) }; }
