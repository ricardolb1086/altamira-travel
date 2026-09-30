const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const COLORS = {
  cream: '#F7F2E9', paper: '#FFFDF8', ink: '#2E2820', soft: '#6B6258',
  terra: '#C47646', terraDeep: '#A85E32', line: '#DED7CA', white: '#FFFFFF'
};
const W = 612;
const H = 792;
const M = 52;
const PDF_VERSION = 'editorial-v4-2026-09-30';
const BRAND_SYMBOLS = {
  dark: loadBrandSymbol('simbolo-terra.png'),
  light: loadBrandSymbol('simbolo-blanco.png')
};

const STRINGS = {
  es: {
    personalizedItinerary: 'ITINERARIO PERSONALIZADO',
    defaultRoute: 'Una experiencia diseñada a tu medida',
    preparedFor: 'PREPARADO PARA',
    defaultClient: 'NUESTRO VIAJERO',
    proposal: 'LA PROPUESTA',
    tripPlanned: 'Un viaje pensado para ti',
    duration: 'DURACIÓN',
    travelers: 'VIAJEROS',
    departure: 'SALIDA',
    tbd: 'POR DEFINIR',
    experience: 'LA EXPERIENCIA',
    routeLabel: 'RUTA DEL VIAJE',
    defaultRouteLong: 'Ruta por confirmar',
    overviewNote: 'Cada jornada ha sido organizada para ofrecer una lectura clara del viaje. Los horarios definitivos se confirmarán junto con la documentación final.',
    day: 'DÍA',
    itineraryKicker: 'EL ITINERARIO',
    dayByDay: 'Día a día',
    dateTbd: 'FECHA POR DEFINIR',
    dayTitleTbd: 'Jornada por definir',
    momentsOfDay: 'MOMENTOS DEL DÍA',
    breakfast: 'Desayuno',
    lunch: 'Almuerzo',
    dinner: 'Cena',
    note: 'NOTA',
    logistics: 'LOGÍSTICA',
    allUnderControl: 'Todo bajo control',
    flights: 'VUELOS',
    flightOutbound: 'VUELO DE IDA',
    flightReturn: 'VUELO DE REGRESO',
    flightN: 'VUELO',
    colDate: 'FECHA',
    colArrival: 'LLEGADA',
    flightDetails: 'DETALLES DEL VUELO',
    localTimes: 'Todos los horarios corresponden a la hora local de cada ciudad.',
    accommodation: 'ALOJAMIENTO',
    origin: 'Origen',
    destination: 'Destino',
    hotelTbd: 'Hotel por confirmar',
    proposalDetails: 'DETALLES DE LA PROPUESTA',
    servicesInvestment: 'Servicios e inversión',
    programPerPerson: 'PROGRAMA POR PERSONA',
    flightsPerPerson: 'VUELOS POR PERSONA',
    totalEstimated: 'TOTAL ESTIMADO',
    investmentPerPerson: 'INVERSIÓN POR PERSONA',
    reserveWith: 'Reserva con',
    includes: 'EL VIAJE INCLUYE',
    excludes: 'NO INCLUYE',
    importantInfo: 'INFORMACIÓN IMPORTANTE',
    beforeTravel: 'Antes de viajar',
    conditions: 'CONDICIONES',
    bookingPayments: 'Reserva y pagos',
    paymentConditions: 'CONDICIONES DE PAGO',
    fullTerms: 'Consulta los Términos y Condiciones completos',
    dateRangeTbd: 'Fechas por confirmar',
    daySingular: 'día',
    dayPlural: 'días',
    paymentPlan: 'PLAN DE PAGOS',
    optionalActivities: 'ACTIVIDADES OPCIONALES',
    optionalActivitiesSubtitle: 'Disponibles durante el recorrido (no incluidas en el precio del programa)',
    colConcept: 'CONCEPTO',
    colDue: 'FECHA LÍMITE',
    colCity: 'CIUDAD',
    colActivity: 'ACTIVIDAD',
    colAdult: 'ADULTO',
    colChild: 'NIÑO',
    locale: 'es-US'
  },
  en: {
    personalizedItinerary: 'PERSONALIZED ITINERARY',
    defaultRoute: 'An experience designed for you',
    preparedFor: 'PREPARED FOR',
    defaultClient: 'OUR TRAVELER',
    proposal: 'THE PROPOSAL',
    tripPlanned: 'A trip designed for you',
    duration: 'DURATION',
    travelers: 'TRAVELERS',
    departure: 'DEPARTURE',
    tbd: 'TO BE DEFINED',
    experience: 'THE EXPERIENCE',
    routeLabel: 'TRIP ROUTE',
    defaultRouteLong: 'Route to be confirmed',
    overviewNote: 'Each day has been organized to offer a clear reading of the trip. Final schedules will be confirmed along with the final documentation.',
    day: 'DAY',
    itineraryKicker: 'THE ITINERARY',
    dayByDay: 'Day by day',
    dateTbd: 'DATE TO BE DEFINED',
    dayTitleTbd: 'Day to be defined',
    momentsOfDay: "DAY'S HIGHLIGHTS",
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    note: 'NOTE',
    logistics: 'LOGISTICS',
    allUnderControl: 'Everything under control',
    flights: 'FLIGHTS',
    flightOutbound: 'OUTBOUND FLIGHT',
    flightReturn: 'RETURN FLIGHT',
    flightN: 'FLIGHT',
    colDate: 'DATE',
    colArrival: 'ARRIVAL',
    flightDetails: 'FLIGHT DETAILS',
    localTimes: 'All times are local to each city.',
    accommodation: 'ACCOMMODATION',
    origin: 'Origin',
    destination: 'Destination',
    hotelTbd: 'Hotel to be confirmed',
    proposalDetails: 'PROPOSAL DETAILS',
    servicesInvestment: 'Services and investment',
    programPerPerson: 'PROGRAM PER PERSON',
    flightsPerPerson: 'FLIGHTS PER PERSON',
    totalEstimated: 'TOTAL ESTIMATED',
    investmentPerPerson: 'INVESTMENT PER PERSON',
    reserveWith: 'Reserve with',
    includes: 'THE TRIP INCLUDES',
    excludes: 'NOT INCLUDED',
    importantInfo: 'IMPORTANT INFORMATION',
    beforeTravel: 'Before you travel',
    conditions: 'CONDITIONS',
    bookingPayments: 'Booking and payments',
    paymentConditions: 'PAYMENT CONDITIONS',
    fullTerms: 'See the full Terms and Conditions',
    dateRangeTbd: 'Dates to be confirmed',
    daySingular: 'day',
    dayPlural: 'days',
    paymentPlan: 'PAYMENT PLAN',
    optionalActivities: 'OPTIONAL ACTIVITIES',
    optionalActivitiesSubtitle: 'Available during the trip (not included in the program price)',
    colConcept: 'CONCEPT',
    colDue: 'DUE DATE',
    colCity: 'CITY',
    colActivity: 'ACTIVITY',
    colAdult: 'ADULT',
    colChild: 'CHILD',
    locale: 'en-US'
  }
};
function getLang(data) { return data?.trip?.lang === 'en' ? 'en' : 'es'; }

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') return json(200, { ok: true, version: PDF_VERSION });
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metodo no permitido.' });
  try {
    const data = JSON.parse(event.body || '{}');
    if (!data.trip?.title) return json(400, { error: 'Agrega el nombre del viaje antes de generar el PDF.' });

    const buffer = await generateItineraryPDF(data);
    const filename = slug(data.trip.title || 'itinerario-altamira');
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        'Cache-Control': 'no-store',
        'X-Altamira-PDF-Version': PDF_VERSION
      },
      body: buffer.toString('base64')
    };
  } catch (error) {
    console.error('generate-itinerary-pdf:', error);
    return json(500, { error: 'No fue posible generar el PDF. Intentalo nuevamente.' });
  }
};

async function generateItineraryPDF(data) {
  const images = await loadImages(data);
  return buildPDF(data, images);
}

exports.generateItineraryPDF = generateItineraryPDF;

async function buildPDF(data, images) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 0, autoFirstPage: false, bufferPages: true, info: {
      Title: data.trip.title, Author: 'Altamira Travel', Subject: 'Itinerario personalizado'
    }});
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // pdfkit only caches images passed as a string (file path / data URI); Buffers
    // bypass its _imageRegistry entirely, so without this, drawBrandLockup's shared
    // logo buffer was being re-parsed and re-embedded on every single page.
    doc.brandSymbols = {
      dark: BRAND_SYMBOLS.dark ? doc.openImage(BRAND_SYMBOLS.dark) : null,
      light: BRAND_SYMBOLS.light ? doc.openImage(BRAND_SYMBOLS.light) : null
    };
    doc.lang = getLang(data);
    doc.T = STRINGS[doc.lang];

    drawCover(doc, data, images.cover);
    const format = getFormat(data);
    if (format === 'editorial') drawEditorialOverview(doc, data);
    else drawOverview(doc, data);
    if (format === 'editorial') drawEditorialDays(doc, data, images.days, images.dayGalleries);
    else if (format === 'executive') drawExecutiveDays(doc, data);
    else drawDays(doc, data, images.days);
    if ((data.flights || []).length || (data.hotels || []).length) {
      if (format === 'editorial') drawEditorialLogistics(doc, data, images.hotels);
      else drawLogistics(doc, data);
    }
    if (format === 'editorial') drawEditorialClosing(doc, data);
    else drawClosing(doc, data);
    addPageFurniture(doc);
    doc.end();
  });
}

function drawCover(doc, data, cover) {
  const T = doc.T;
  const format = getFormat(data);
  doc.addPage({ size: 'LETTER', margin: 0 });
  doc.rect(0, 0, W, H).fill(COLORS.ink);

  if (cover && format === 'editorial') {
    try {
      const img = doc.openImage(cover);
      doc.save();
      doc.rect(0, 0, W, H).clip();
      doc.image(img, 0, 0, { cover: [W, H], align: 'center', valign: 'center' });
      doc.restore();

      doc.save();
      doc.fillOpacity(.28).fillColor(COLORS.ink).rect(0, 0, W, H).fill();
      doc.fillOpacity(1);
      const shade = doc.linearGradient(0, 235, 0, H);
      shade.stop(0, COLORS.ink, 0).stop(.58, COLORS.ink, .48).stop(1, COLORS.ink, .93);
      doc.rect(0, 210, W, H - 210).fill(shade);
      doc.restore();

      drawBrandLockup(doc, true, M, 38, 1.18);
      doc.fillColor('#F1DDD0').font('Helvetica-Bold').fontSize(8)
        .text(T.personalizedItinerary, M, 432, { characterSpacing: 1.9 });
      const titleSize = Math.max(36, fitTitle(data.trip.title) - 3);
      doc.fillColor(COLORS.white).font('Times-Roman').fontSize(titleSize)
        .text(data.trip.title, M, 462, { width: 495, lineGap: -3 });
      let y = Math.min(625, Math.max(555, doc.y + 16));
      doc.fillColor(COLORS.terra).rect(M, y, 58, 3).fill();
      doc.fillColor('#F2E8DD').font('Helvetica').fontSize(11)
        .text(data.trip.route || T.defaultRoute, M, y + 18, { width: 455, lineGap: 3 });
      doc.fillColor(COLORS.white).font('Helvetica-Bold').fontSize(8)
        .text(`${T.preparedFor} ${String(data.trip.client || T.defaultClient).toUpperCase()}`, M, 698, { characterSpacing: 1.2 });
      doc.fillColor('#E1D4C7').font('Helvetica').fontSize(9)
        .text(dateRange(data.trip.start, data.trip.end, doc.lang), M, 721);
      return;
    } catch { /* fall back to classic cover */ }
  }

  let textTop = 265;
  if (cover) {
    try {
      const img = doc.openImage(cover);
      const bandH = Math.min(430, W * img.height / img.width);
      doc.save();
      doc.rect(0, 0, W, bandH).clip();
      doc.image(img, 0, 0, { cover: [W, bandH], align: 'center', valign: 'center' });
      doc.restore();
      const fade = doc.linearGradient(0, 0, 0, 120);
      fade.stop(0, COLORS.ink, 0.65).stop(1, COLORS.ink, 0);
      doc.rect(0, 0, W, 120).fill(fade);
      doc.strokeColor(COLORS.terra).lineWidth(2).moveTo(0, bandH).lineTo(W, bandH).stroke();
      textTop = bandH + 40;
    } catch { /* unreadable image: keep the plain dark cover */ }
  }
  drawBrandLockup(doc, true, M, 37, 1.15);
  doc.fillColor(COLORS.terra).font('Helvetica-Bold').fontSize(8).text(T.personalizedItinerary, M, textTop, { characterSpacing: 1.8 });
  const titleSize = fitTitle(data.trip.title);
  doc.fillColor(COLORS.white).font('Times-Roman').fontSize(titleSize).text(data.trip.title, M, textTop + 27, { width: 485, lineGap: -3 });
  let y = Math.min(600, Math.max(textTop + 190, doc.y + 18));
  doc.strokeColor(COLORS.terra).lineWidth(1.2).moveTo(M, y).lineTo(M + 54, y).stroke();
  doc.fillColor('#E8DED2').font('Helvetica').fontSize(11).text(data.trip.route || T.defaultRoute, M, y + 17, { width: 460, lineGap: 3 });
  doc.fillColor(COLORS.white).font('Helvetica-Bold').fontSize(8).text(`${T.preparedFor} ${String(data.trip.client || T.defaultClient).toUpperCase()}`, M, 690, { characterSpacing: 1.2 });
  doc.fillColor('#D8CBBB').font('Helvetica').fontSize(9).text(dateRange(data.trip.start, data.trip.end, doc.lang), M, 712);
}

function drawEditorialOverview(doc, data) {
  const T = doc.T;
  doc.addPage({ size: 'LETTER', margin: 0 });
  doc.fillColor(COLORS.paper).rect(0, 0, W, H).fill();
  drawBrandLockup(doc, false, M, 24, .86);
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text(T.proposal, M, 86, { characterSpacing: 1.5 });
  doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(34).text(T.tripPlanned, M, 103, { width: W - M * 2 });

  const statsY = 163;
  const stats = [
    [duration(data.trip.start, data.trip.end, data.days?.length, doc.lang), T.duration],
    [String(data.trip.travelers || '-'), T.travelers],
    [shortDate(data.trip.start, doc.lang) || T.tbd, T.departure]
  ];
  stats.forEach((item, index) => {
    const x = M + index * 169;
    doc.fillColor(COLORS.cream).roundedRect(x, statsY, 155, 62, 7).fill();
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(18).text(item[0], x + 14, statsY + 14, { width: 128 });
    doc.fillColor(COLORS.soft).font('Helvetica-Bold').fontSize(6.6).text(item[1], x + 14, statsY + 40, { characterSpacing: 1.1 });
  });

  let y = 258;
  if (data.trip.summary) {
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.2).text(T.experience, M, y, { characterSpacing: 1.4 });
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(17).text(editorialSummary(data.trip.summary, 420), M, y + 22, { width: 478, lineGap: 5 });
    y = doc.y + 34;
  }

  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.2).text(T.routeLabel, M, y, { characterSpacing: 1.4 });
  y += 25;
  const stops = String(data.trip.route || '').split(/[·•→>-]/).map(s => s.trim()).filter(Boolean).slice(0, 10);
  if (stops.length > 1) {
    const startX = M + 10, endX = W - M - 10, lineY = y + 35;
    doc.strokeColor(COLORS.line).lineWidth(2).moveTo(startX, lineY).lineTo(endX, lineY).stroke();
    stops.forEach((stop, i) => {
      const x = startX + (endX - startX) * (i / (stops.length - 1));
      doc.fillColor(COLORS.terra).circle(x, lineY, 5).fill();
      const labelY = i % 2 === 0 ? lineY + 15 : lineY - 35;
      doc.fillColor(COLORS.ink).font('Helvetica-Bold').fontSize(7.5).text(stop, x - 38, labelY, { width: 76, align: 'center', height: 24, ellipsis: true });
    });
    y = lineY + 78;
  } else {
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(24).text(data.trip.route || T.defaultRouteLong, M, y, { width: W - M * 2 });
    y = doc.y + 30;
  }

  const highlights = (data.days || []).flatMap(day => splitLines(day.activities)).slice(0, 6);
  if (highlights.length) {
    doc.fillColor(COLORS.cream).roundedRect(M, y, W - M * 2, 150, 10).fill();
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(T.momentsOfDay, M + 18, y + 17, { characterSpacing: 1.4 });
    highlights.forEach((item, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + 18 + col * 250, yy = y + 44 + row * 30;
      doc.fillColor(COLORS.terra).circle(x + 3, yy + 4, 2.5).fill();
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.5).text(item, x + 14, yy, { width: 215, height: 20, ellipsis: true });
    });
  }
}

function drawOverview(doc, data) {
  const T = doc.T;
  contentPage(doc, T.proposal, T.tripPlanned);
  const top = 142;
  const stats = [
    [duration(data.trip.start, data.trip.end, data.days?.length, doc.lang), T.duration],
    [String(data.trip.travelers || '-'), T.travelers],
    [shortDate(data.trip.start, doc.lang) || T.tbd, T.departure]
  ];
  stats.forEach((item, index) => {
    const x = M + index * 169;
    doc.fillColor(COLORS.cream).roundedRect(x, top, 155, 70, 5).fill();
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(20).text(item[0], x + 14, top + 17, { width: 130 });
    doc.fillColor(COLORS.soft).font('Helvetica-Bold').fontSize(7).text(item[1], x + 14, top + 45, { characterSpacing: 1.2 });
  });
  let y = 246;
  if (data.trip.summary) {
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(8).text(T.experience, M, y, { characterSpacing: 1.5 });
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(18).text(data.trip.summary, M, y + 24, { width: W - M * 2, lineGap: 6 });
    y = doc.y + 28;
  }
  doc.strokeColor(COLORS.line).lineWidth(1).moveTo(M, y).lineTo(W - M, y).stroke();
  y += 24;
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(8).text(T.routeLabel, M, y, { characterSpacing: 1.5 });
  doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(28).text(data.trip.route || T.defaultRouteLong, M, y + 20, { width: W - M * 2, lineGap: 3 });
  y = doc.y + 26;
  doc.fillColor(COLORS.soft).font('Helvetica').fontSize(10).text(T.overviewNote, M, y, { width: 455, lineGap: 4 });
}

const DAY_BOTTOM = 736;

function getFormat(data) {
  const value = String(data?.trip?.format || 'editorial').toLowerCase();
  return ['editorial', 'detailed', 'executive'].includes(value) ? value : 'editorial';
}

function drawEditorialDays(doc, data, dayImages, dayGalleries = []) {
  const T = doc.T;
  const days = (data.days || []).filter(day => day.title || day.description || day.activities || day.image);
  if (!days.length) return;

  const renderHeroDay = (day, index, image) => {
    doc.addPage({ size: 'LETTER', margin: 0 });
    doc.fillColor(COLORS.paper).rect(0, 0, W, H).fill();
    drawBrandLockup(doc, false, M, 23, .82);

    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.4)
      .text(`${T.day} ${String(index + 1).padStart(2, '0')}`, M, 84, { characterSpacing: 1.6 });
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8)
      .text(shortDate(day.date, doc.lang) || T.dateTbd, W - M - 180, 84, { width: 180, align: 'right' });

    const title = day.title || T.dayTitleTbd;
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(fitEditorialDayTitle(title))
      .text(title, M, 102, { width: W - M * 2, lineGap: -2 });
    let y = Math.max(158, doc.y + 14);

    let img = null;
    try { img = image ? doc.openImage(image) : null; } catch { img = null; }
    if (img) {
      const imageH = 300;
      doc.save();
      doc.roundedRect(M, y, W - M * 2, imageH, 7).clip();
      doc.image(img, M, y, { cover: [W - M * 2, imageH], align: 'center', valign: 'center' });
      doc.restore();
      doc.fillColor(COLORS.terra).rect(M, y + imageH - 4, 78, 4).fill();
      y += imageH + 12;
      const extras = (dayGalleries[index] || []).filter(Boolean).slice(0,2);
      if (extras.length) {
        const gap = 10, thumbW = (W - M * 2 - gap) / 2, thumbH = 84;
        extras.forEach((extra,i)=>{ try { const ex=doc.openImage(extra); doc.save(); doc.roundedRect(M+i*(thumbW+gap),y,thumbW,thumbH,5).clip(); doc.image(ex,M+i*(thumbW+gap),y,{cover:[thumbW,thumbH],align:'center',valign:'center'}); doc.restore(); } catch {} });
        y += thumbH + 14;
      }
    }

    const desc = editorialSummary(day.description, 260);
    if (desc) {
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(10.4)
        .text(desc, M, y, { width: W - M * 2, lineGap: 4 });
      y = doc.y + 16;
    }

    const activities = splitLines(day.activities).slice(0, 4);
    if (activities.length) {
      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.1)
        .text(T.momentsOfDay, M, y, { characterSpacing: 1.4 });
      y += 17;
      const colW = 230;
      activities.forEach((activity, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = M + col * 270, yy = y + row * 22;
        doc.fillColor(COLORS.terra).circle(x + 4, yy + 4, 2.7).fill();
        doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.8)
          .text(activity, x + 15, yy, { width: colW, height: 18, ellipsis: true });
      });
      y += Math.ceil(activities.length / 2) * 22 + 10;
    }

    const meals = [day.breakfast && T.breakfast, day.lunch && T.lunch, day.dinner && T.dinner].filter(Boolean);
    meals.forEach((meal, i) => {
      const x = M + i * 94;
      doc.fillColor('#EFE6DA').roundedRect(x, y, 84, 22, 11).fill();
      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7)
        .text(meal.toUpperCase(), x, y + 7.5, { width: 84, align: 'center' });
    });

    if (day.notes && y < 700) {
      const note = editorialSummary(day.notes, 150);
      const noteY = Math.min(y + 38, 690);
      doc.fillColor(COLORS.cream).roundedRect(M, noteY, W - M * 2, 40, 6).fill();
      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(6.8)
        .text(T.note, M + 14, noteY + 10, { characterSpacing: 1 });
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8)
        .text(note, M + 58, noteY + 9, { width: W - M * 2 - 72, height: 24, ellipsis: true });
    }
  };

  const renderCompactPage = batch => {
    doc.addPage({ size: 'LETTER', margin: 0 });
    doc.fillColor(COLORS.paper).rect(0, 0, W, H).fill();
    drawBrandLockup(doc, false, M, 23, .82);
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5)
      .text(T.itineraryKicker, M, 84, { characterSpacing: 1.5 });
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(28)
      .text(T.dayByDay, M, 101, { width: W - M * 2 });

    batch.forEach((entry, batchIndex) => {
      const { day, index } = entry;
      const y = 166 + batchIndex * 270;
      doc.fillColor(batchIndex % 2 ? '#FBF7F0' : COLORS.cream)
        .roundedRect(M, y, W - M * 2, 238, 10).fill();

      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.2)
        .text(`${T.day} ${String(index + 1).padStart(2, '0')}`, M + 18, y + 18, { characterSpacing: 1.4 });
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(7.8)
        .text(shortDate(day.date, doc.lang) || T.dateTbd, W - M - 160, y + 18, { width: 142, align: 'right' });

      const title = day.title || T.dayTitleTbd;
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(21)
        .text(title, M + 18, y + 38, { width: W - M * 2 - 36, height: 48, ellipsis: true });

      const desc = editorialSummary(day.description, 210);
      if (desc) {
        doc.fillColor(COLORS.soft).font('Times-Roman').fontSize(9.2)
          .text(desc, M + 18, y + 92, { width: W - M * 2 - 36, height: 50, lineGap: 3, ellipsis: true });
      }

      const activities = splitLines(day.activities).slice(0, 3);
      let ay = y + 154;
      activities.forEach((activity, i) => {
        doc.fillColor(COLORS.terra).circle(M + 22, ay + 4, 2.4).fill();
        doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.3)
          .text(activity, M + 34, ay, { width: 330, height: 15, ellipsis: true });
        ay += 19;
      });

      const meals = [day.breakfast && T.breakfast, day.lunch && T.lunch, day.dinner && T.dinner].filter(Boolean);
      if (meals.length) {
        meals.slice(0, 3).forEach((meal, i) => {
          const x = W - M - 86 - i * 72;
          doc.fillColor('#EFE6DA').roundedRect(x, y + 190, 64, 20, 10).fill();
          doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(6.4)
            .text(meal.toUpperCase(), x, y + 197, { width: 64, align: 'center' });
        });
      }
    });
  };

  let compactBatch = [];
  const flushCompact = () => {
    if (!compactBatch.length) return;
    renderCompactPage(compactBatch);
    compactBatch = [];
  };

  days.forEach((day, index) => {
    const image = dayImages?.[index];
    if (image) {
      flushCompact();
      renderHeroDay(day, index, image);
    } else {
      compactBatch.push({ day, index });
      if (compactBatch.length === 2) flushCompact();
    }
  });
  flushCompact();
}

function editorialSummary(value = '', max = 260) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  const end = sentence > max * .55 ? sentence + 1 : cut.lastIndexOf(' ');
  return `${cut.slice(0, Math.max(1, end)).trim()}…`;
}

function drawExecutiveDays(doc, data) {
  const T = doc.T;
  const days = (data.days || []).filter(day => day.title || day.description || day.activities);
  if (!days.length) return;
  let y = contentPage(doc, T.itineraryKicker, T.dayByDay);
  days.forEach((day, index) => {
    if (y > 704) y = contentPage(doc, T.itineraryKicker, T.dayByDay);
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.2)
      .text(`${T.day} ${String(index + 1).padStart(2, '0')}`, M, y, { characterSpacing: 1.3 });
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(15.5)
      .text(day.title || T.dayTitleTbd, M + 70, y - 4, { width: 305, height: 22, ellipsis: true });
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8)
      .text(shortDate(day.date, doc.lang) || '', W - M - 125, y, { width: 125, align: 'right' });
    const firstActivity = splitLines(day.activities)[0];
    if (firstActivity) {
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.2)
        .text(firstActivity, M + 70, y + 18, { width: W - M * 2 - 70, height: 14, ellipsis: true });
    }
    y += 43;
    doc.strokeColor(COLORS.line).lineWidth(.5).moveTo(M + 70, y - 8).lineTo(W - M, y - 8).stroke();
  });
}

function fitEditorialDayTitle(value = '') {
  const length = String(value).length;
  return length > 52 ? 25 : length > 34 ? 29 : 34;
}

// Days flow continuously (like the on-screen preview): several short days share a page,
// and only days that really carry a photo get an image block. No placeholder art.
function drawDays(doc, data, dayImages) {
  const T = doc.T;
  const days = data.days || [];
  if (!days.length) return;
  let y = contentPage(doc, T.itineraryKicker, T.dayByDay);
  days.forEach((day, index) => {
    const layout = measureDay(doc, day, index, dayImages[index]);
    const usable = DAY_BOTTOM - 152;
    if (layout.height > usable && layout.imageHeight) {
      layout.height -= Math.min(layout.imageHeight - 90, layout.height - usable);
      layout.imageHeight = Math.max(90, layout.imageHeight - (layout.originalHeight - layout.height));
    }
    if (y + layout.height > DAY_BOTTOM && y > 160) y = contentPage(doc, T.itineraryKicker, T.dayByDay);
    y = drawDay(doc, day, index, layout, y);
  });
}

function measureDay(doc, day, index, image) {
  const T = doc.T;
  const CW = W - M * 2;
  const activities = splitLines(day.activities);
  const columns = activities.length > 3 ? 2 : 1;
  const perColumn = Math.ceil(activities.length / columns);
  const descSize = String(day.description || '').length > 750 ? 10.2 : 11;
  const meals = [day.breakfast && T.breakfast, day.lunch && T.lunch, day.dinner && T.dinner].filter(Boolean);
  const titleText = day.title || T.dayTitleTbd;
  doc.font('Times-Roman').fontSize(19);
  const titleH = doc.heightOfString(titleText, { width: CW, lineGap: -1 });
  let img = null, imageHeight = 0;
  if (image) {
    try { img = doc.openImage(image); imageHeight = Math.min(230, CW * img.height / img.width); } catch { img = null; }
  }
  let descH = 0;
  if (day.description) {
    doc.font('Times-Roman').fontSize(descSize);
    descH = doc.heightOfString(day.description, { width: CW, lineGap: 3.5 });
  }
  let notesH = 0;
  if (day.notes) {
    doc.font('Helvetica').fontSize(8.5);
    notesH = Math.max(28, doc.heightOfString(day.notes, { width: CW - 70, lineGap: 2 }) + 18);
  }
  let height = 14 + titleH + 12;
  if (img) height += imageHeight + 12;
  if (day.description) height += descH + 12;
  if (activities.length) height += 18 + perColumn * 17 + 6;
  if (meals.length) height += 30;
  if (notesH) height += notesH + 6;
  height += 26;
  return { img, imageHeight, activities, columns, perColumn, descSize, meals, titleText, titleH, notesH, height, originalHeight: height };
}

function drawDay(doc, day, index, L, y) {
  const T = doc.T;
  const CW = W - M * 2;
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5)
    .text(`${T.day} ${String(index + 1).padStart(2, '0')}  /  ${shortDate(day.date, doc.lang) || T.dateTbd}`, M, y, { characterSpacing: 1.4 });
  y += 14;
  doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(19).text(L.titleText, M, y, { width: CW, lineGap: -1 });
  y += L.titleH + 12;
  if (L.img) {
    doc.save();
    doc.rect(M, y, CW, L.imageHeight).clip();
    doc.image(L.img, M, y, { cover: [CW, L.imageHeight], align: 'center', valign: 'center' });
    doc.restore();
    doc.strokeColor(COLORS.terra).lineWidth(2.5).moveTo(M, y + L.imageHeight).lineTo(W - M, y + L.imageHeight).stroke();
    y += L.imageHeight + 12;
  }
  if (day.description) {
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(L.descSize).text(day.description, M, y, { width: CW, lineGap: 3.5 });
    y = doc.y + 12;
  }
  if (L.activities.length) {
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text(T.momentsOfDay, M, y, { characterSpacing: 1.4 });
    y += 18;
    const colWidth = L.columns === 2 ? 238 : CW;
    L.activities.forEach((activity, i) => {
      const col = Math.floor(i / L.perColumn);
      const row = i % L.perColumn;
      const x = M + col * 270;
      const itemY = y + row * 17;
      doc.fillColor(COLORS.terra).circle(x + 3, itemY + 4, 2.3).fill();
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(9).text(activity, x + 13, itemY, { width: colWidth - 13, height: 14, ellipsis: true });
    });
    y += L.perColumn * 17 + 6;
  }
  if (L.meals.length) {
    L.meals.forEach((meal, i) => {
      const x = M + i * 90;
      doc.fillColor('#EFE6DA').roundedRect(x, y, 80, 20, 10).fill();
      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(meal.toUpperCase(), x, y + 7, { width: 80, align: 'center' });
    });
    y += 30;
  }
  if (L.notesH) {
    doc.fillColor(COLORS.cream).roundedRect(M, y, CW, L.notesH, 5).fill();
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(T.note, M + 13, y + 10, { characterSpacing: 1 });
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.5).text(day.notes, M + 55, y + 9, { width: CW - 70, lineGap: 2 });
    y += L.notesH + 6;
  }
  y += 8;
  doc.strokeColor(COLORS.line).lineWidth(.6).moveTo(M, y).lineTo(W - M, y).stroke();
  return y + 18;
}

// Flight notes are written as short facts separated by " · " (stops, duration, arrival day...).
function splitNoteParts(notes) {
  return String(notes || '').split(/\s+·\s+|\n/).map(part => part.trim()).filter(Boolean);
}

function drawEditorialLogistics(doc, data, hotelImages = []) {
  const T = doc.T;
  if (data.hotels?.length) {
    doc.addPage({ size: 'LETTER', margin: 0 });
    doc.fillColor(COLORS.paper).rect(0, 0, W, H).fill();
    drawBrandLockup(doc, false, M, 24, .86);
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.4).text(T.accommodation, M, 86, { characterSpacing: 1.5 });
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(31).text(T.accommodation, M, 103);
    let y = 156;
    data.hotels.slice(0, 6).forEach((hotel, index) => {
      const col = index % 2, row = Math.floor(index / 2);
      const x = M + col * 258, cardY = y + row * 176, cardW = 242, cardH = 158;
      doc.fillColor(COLORS.cream).roundedRect(x, cardY, cardW, cardH, 8).fill();
      let img = null;
      try { img = hotelImages[index] ? doc.openImage(hotelImages[index]) : null; } catch { img = null; }
      if (img) {
        doc.save(); doc.roundedRect(x, cardY, cardW, 82, 8).clip();
        doc.image(img, x, cardY, { cover: [cardW, 82], align: 'center', valign: 'center' }); doc.restore();
      }
      const textY = img ? cardY + 94 : cardY + 22;
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(14.5).text(hotel.name || T.hotelTbd, x + 14, textY, { width: cardW - 28, height: 36, ellipsis: true });
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(7.8).text([hotel.city, hotel.room, hotel.meals].filter(Boolean).join(' · '), x + 14, textY + 40, { width: cardW - 28, height: 28, ellipsis: true });
    });
  }

  if (data.flights?.length) {
    doc.addPage({ size: 'LETTER', margin: 0 });
    doc.fillColor(COLORS.paper).rect(0, 0, W, H).fill();
    drawBrandLockup(doc, false, M, 24, .86);
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.4).text(T.flights, M, 86, { characterSpacing: 1.5 });
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(31).text(T.flights, M, 103);
    let y = 164;
    data.flights.slice(0, 4).forEach((flight, index) => {
      const cardH = 112;
      doc.fillColor(index % 2 ? '#FBF7F0' : COLORS.cream).roundedRect(M, y, W - M * 2, cardH, 8).fill();
      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(`${T.flightN} ${index + 1}`, M + 18, y + 17, { characterSpacing: 1.2 });
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(20).text(`${flight.from || T.origin} → ${flight.to || T.destination}`, M + 18, y + 35, { width: 300 });
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.2).text([flight.airline, flight.number, shortDate(flight.date, doc.lang), flight.depart && flight.arrive ? `${flight.depart} – ${flight.arrive}` : ''].filter(Boolean).join(' · '), M + 18, y + 69, { width: 440 });
      y += cardH + 14;
    });
  }
}

function drawLogistics(doc, data) {
  const T = doc.T;
  contentPage(doc, T.logistics, T.allUnderControl);
  let y = 142;
  if (data.flights?.length) {
    sectionLabel(doc, T.flights, y); y += 18;
    doc.fillColor(COLORS.soft).font('Helvetica-Oblique').fontSize(8).text(T.localTimes, M, y, { width: W - M * 2 });
    y += 20;
    const total = data.flights.length;
    data.flights.forEach((flight, index) => {
      const label = total === 2 ? (index === 0 ? T.flightOutbound : T.flightReturn) : `${T.flightN} ${index + 1}`;
      const CW = W - M * 2;
      const points = splitNoteParts(flight.notes);
      doc.font('Helvetica').fontSize(8.6);
      const detailsH = points.reduce((sum, part) => sum + doc.heightOfString(part, { width: CW - 58, lineGap: 2 }) + 5, 0);
      const cardH = 20 + 34 + 52 + (points.length ? 26 + detailsH : 0) + 12;
      if (y + cardH > 735) { y = contentPage(doc, T.logistics, T.flights); }
      doc.fillColor(COLORS.cream).roundedRect(M, y, CW, cardH, 6).fill();
      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text(label, M + 18, y + 16, { characterSpacing: 1.4 });
      const carrier = [flight.airline, flight.number].filter(Boolean).join('  ');
      if (carrier) doc.fillColor(COLORS.ink).font('Helvetica-Bold').fontSize(9).text(carrier, M + 18, y + 15, { width: CW - 36, align: 'right' });
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(19).text(`${flight.from || T.origin} – ${flight.to || T.destination}`, M + 18, y + 34, { width: CW - 36 });
      const colY = y + 70;
      const cols = [
        [T.colDate, shortDate(flight.date, doc.lang) || '-', ''],
        [T.departure, flight.depart || '-', flight.from || ''],
        [T.colArrival, flight.arrive || '-', flight.to || '']
      ];
      cols.forEach(([head, value, place], i) => {
        const x = M + 18 + i * 165;
        doc.fillColor(COLORS.soft).font('Helvetica-Bold').fontSize(6.8).text(head, x, colY, { characterSpacing: 1 });
        doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(17).text(value, x, colY + 12, { width: 150 });
        if (place) doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8).text(place, x, colY + 33, { width: 150, height: 11, ellipsis: true });
      });
      if (points.length) {
        let dy = y + 20 + 34 + 52 + 8;
        doc.strokeColor(COLORS.line).lineWidth(.7).moveTo(M + 18, dy).lineTo(M + CW - 18, dy).stroke();
        dy += 10;
        doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(6.8).text(T.flightDetails, M + 18, dy, { characterSpacing: 1 });
        dy += 14;
        points.forEach(part => {
          doc.fillColor(COLORS.terra).circle(M + 21, dy + 4, 2.2).fill();
          doc.fillColor(COLORS.ink).font('Helvetica').fontSize(8.6).text(part, M + 34, dy, { width: CW - 58, lineGap: 2 });
          dy = doc.y + 5;
        });
      }
      y += cardH + 12;
    });
    y += 12;
  }
  if (data.hotels?.length) {
    sectionLabel(doc, T.accommodation, y); y += 22;
    data.hotels.forEach((hotel, index) => {
      if (y > 665) { contentPage(doc, T.logistics, T.accommodation); y = 142; }
      doc.strokeColor(COLORS.line).roundedRect(M, y, W - M * 2, 74, 5).stroke();
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(17).text(hotel.name || T.hotelTbd, M + 15, y + 13);
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.5).text([hotel.city, hotel.room, hotel.meals].filter(Boolean).join('  /  '), M + 15, y + 40, { width: 470 });
      y += 84;
    });
  }
}

function drawEditorialClosing(doc, data) {
  const T = doc.T;
  doc.addPage({ size: 'LETTER', margin: 0 });
  doc.fillColor(COLORS.paper).rect(0, 0, W, H).fill();
  drawBrandLockup(doc, false, M, 24, .86);
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text(T.proposalDetails, M, 86, { characterSpacing: 1.5 });
  doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(31).text(T.servicesInvestment, M, 103);

  const price = Number(data.pricing?.price || 0);
  const airfare = Number(data.pricing?.airfare || 0);
  const currency = data.pricing?.currency || 'USD';
  let y = 162;
  if (price || airfare) {
    doc.fillColor(COLORS.ink).roundedRect(M, y, W - M * 2, 106, 8).fill();
    const cols = airfare ? [[T.programPerPerson, price],[T.flightsPerPerson, airfare],[T.totalEstimated, price+airfare]] : [[T.investmentPerPerson, price]];
    cols.forEach((item, i) => {
      const w = (W - M * 2 - 36) / cols.length, x = M + 18 + i * w;
      doc.fillColor('#D8CBBB').font('Helvetica-Bold').fontSize(6.5).text(item[0], x, y + 20, { width: w - 10, characterSpacing: 1 });
      doc.fillColor(i === cols.length - 1 ? COLORS.white : COLORS.terra).font('Times-Roman').fontSize(24).text(`${currency} ${Number(item[1]||0).toLocaleString('en-US')}`, x, y + 43, { width: w - 10 });
    });
    y += 132;
  }

  const includes = splitLines(data.details?.includes).slice(0, 8);
  const excludes = splitLines(data.details?.excludes).slice(0, 6);
  const boxH = 260;
  doc.fillColor(COLORS.cream).roundedRect(M, y, 242, boxH, 8).fill();
  doc.fillColor('#FBF7F0').roundedRect(318, y, 242, boxH, 8).fill();
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(T.includes, M + 16, y + 18, { characterSpacing: 1.3 });
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(T.excludes, 334, y + 18, { characterSpacing: 1.3 });
  includes.forEach((item,i)=>{const yy=y+46+i*25;doc.fillColor(COLORS.terra).circle(M+20,yy+4,2.3).fill();doc.fillColor(COLORS.soft).font('Helvetica').fontSize(7.9).text(item,M+31,yy,{width:190,height:18,ellipsis:true});});
  excludes.forEach((item,i)=>{const yy=y+46+i*28;doc.fillColor(COLORS.soft).font('Helvetica-Bold').fontSize(8).text('—',334,yy);doc.fillColor(COLORS.soft).font('Helvetica').fontSize(7.9).text(item,348,yy,{width:195,height:21,ellipsis:true});});
  y += boxH + 26;

  const terms = editorialSummary(data.pricing?.terms || data.details?.requirements || '', 360);
  if (terms) {
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(T.paymentConditions, M, y, { characterSpacing: 1.3 });
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.4).text(terms, M, y + 20, { width: W - M * 2, lineGap: 3 });
  }
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(8.5).text(T.fullTerms, M, 706, { link: 'https://altamiratravel.com/terminos', underline: true });
}

function drawClosing(doc, data) {
  const T = doc.T;
  contentPage(doc, T.proposalDetails, T.servicesInvestment);
  let y = 137;
  const price = Number(data.pricing?.price || 0);
  const airfare = Number(data.pricing?.airfare || 0);
  const total = price + airfare;
  if (price || airfare) {
    doc.fillColor(COLORS.ink).roundedRect(M, y, W - M * 2, 92, 6).fill();
    const currency = data.pricing.currency || 'USD';
    if (airfare) {
      const priceColumns = [
        [T.programPerPerson, price],
        [T.flightsPerPerson, airfare],
        [T.totalEstimated, total]
      ];
      priceColumns.forEach(([label, value], index) => {
        const x = M + 20 + index * 165;
        doc.fillColor('#D8CBBB').font('Helvetica-Bold').fontSize(6.5).text(label, x, y + 16, { width: 150, characterSpacing: 1 });
        doc.fillColor(index === 2 ? COLORS.white : COLORS.terra).font('Times-Roman').fontSize(index === 2 ? 25 : 23).text(`${currency} ${value.toLocaleString('en-US')}`, x, y + 34, { width: 150 });
      });
      if (data.pricing?.fareNotice) doc.fillColor('#D8CBBB').font('Helvetica').fontSize(7.3).text(data.pricing.fareNotice, M + 20, y + 69, { width: W - M * 2 - 40, height: 16, align: 'center', ellipsis: true });
    } else {
      doc.fillColor('#D8CBBB').font('Helvetica-Bold').fontSize(7).text(T.investmentPerPerson, M + 20, y + 22, { characterSpacing: 1.4 });
      doc.fillColor(COLORS.terra).font('Times-Roman').fontSize(34).text(`${currency} ${price.toLocaleString('en-US')}`, M + 20, y + 42);
      if (data.pricing.deposit) doc.fillColor(COLORS.white).font('Helvetica').fontSize(9).text(`${T.reserveWith} ${data.pricing.deposit}`, 320, y + 49, { width: 220, align: 'right' });
    }
    y += 120;
  }
  const includes = splitLines(data.details?.includes);
  const excludes = splitLines(data.details?.excludes);
  drawListColumn(doc, T.includes, includes, M, y, 235, true);
  drawListColumn(doc, T.excludes, excludes, 325, y, 235, false);
  y += Math.max(includes.length, excludes.length) * 24 + 45;
  if (data.details?.requirements) {
    if (y >= 610) y = Math.max(152, contentPage(doc, T.importantInfo, T.beforeTravel));
    else { sectionLabel(doc, T.importantInfo, y); y += 20; }
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.8).text(data.details.requirements, M, y, { width: W - M * 2, lineGap: 3 });
    y = doc.y + 18;
  }
  const paymentPlan = data.pricing?.paymentPlan || [];
  if (paymentPlan.length) {
    if (y >= 560) y = Math.max(152, contentPage(doc, T.conditions, T.bookingPayments));
    y = drawPaymentPlan(doc, T, paymentPlan, M, y, W - M * 2);
    y += 22;
  }
  const optionalActivities = data.pricing?.optionalActivities || [];
  if (optionalActivities.length) {
    const estimatedHeight = 50 + optionalActivities.length * 33;
    if (y + estimatedHeight >= 705) y = Math.max(152, contentPage(doc, T.conditions, T.bookingPayments));
    y = drawOptionalActivities(doc, T, optionalActivities, M, y, W - M * 2, data.pricing?.optionalActivitiesNote);
    y += 22;
  }
  if (data.pricing?.terms) {
    if (y >= 660) y = Math.max(152, contentPage(doc, T.conditions, T.bookingPayments));
    sectionLabel(doc, T.paymentConditions, y); y += 20;
    y = drawTermsText(doc, data.pricing.terms, M, y, W - M * 2);
    y += 18;
  }
  if (y >= 670) y = Math.max(152, contentPage(doc, T.conditions, T.bookingPayments));
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(9).text(T.fullTerms, M, Math.max(y, 690), { link: 'https://altamiratravel.com/terminos', underline: true });
}

// Renders free-form paragraph text (pricing.terms) line by line, bolding and
// color-highlighting any "$1,234" / "$1,234.56" amount found inline so key
// figures stand out the same way they do in the payment-plan/optional-activities
// tables, without forcing that text into a rigid row/column structure.
function drawTermsText(doc, text, x, y, width, lineGap = 3) {
  const amountRe = /(\$[\d][\d,]*(?:\.\d{1,2})?)/g;
  doc.font('Helvetica').fontSize(8.8);
  const lineHeight = doc.currentLineHeight() + lineGap;
  String(text).split('\n').forEach(line => {
    if (!line) { y += lineHeight; return; }
    const parts = line.split(amountRe).filter(part => part !== '');
    parts.forEach((part, index) => {
      const isAmount = amountRe.test(part);
      amountRe.lastIndex = 0;
      doc.font(isAmount ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.8).fillColor(isAmount ? COLORS.terra : COLORS.soft);
      const continued = index < parts.length - 1;
      if (index === 0) doc.text(part, x, y, { continued, width, lineGap });
      else doc.text(part, { continued });
    });
    y = doc.y;
  });
  return y;
}
function drawPaymentPlan(doc, T, items, x, y, width) {
  sectionLabel(doc, T.paymentPlan, y);
  y += 20;
  const labelW = width * 0.28;
  const amountX = x + width * 0.32;
  const amountW = width * 0.42;
  const dueX = x + width * 0.76;
  const dueW = width * 0.24 - 16;
  items.forEach((item, index) => {
    if (y >= 705) { y = Math.max(152, contentPage(doc, T.conditions, T.bookingPayments)); }
    const amountLines = String(item.amount || '').split('\n').filter(Boolean);
    const rowH = Math.max(38, 16 + amountLines.length * 15);
    doc.fillColor(index % 2 ? COLORS.paper : COLORS.cream).roundedRect(x, y, width, rowH, 5).fill();
    doc.fillColor(COLORS.ink).font('Helvetica-Bold').fontSize(10.5).text(item.label || '', x + 16, y + 12, { width: labelW - 16 });
    let ly = y + 12;
    amountLines.forEach(line => {
      doc.fillColor(COLORS.terra).font('Helvetica-Bold').fontSize(9.8).text(line, amountX, ly, { width: amountW });
      ly += 15;
    });
    if (item.due) doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.3).text(item.due, dueX, y + 13, { width: dueW, align: 'right' });
    y += rowH + 8;
  });
  return y;
}

function drawOptionalActivities(doc, T, items, x, y, width, note) {
  sectionLabel(doc, T.optionalActivities, y);
  y += 16;
  doc.fillColor(COLORS.soft).font('Helvetica').fontSize(7.6).text(T.optionalActivitiesSubtitle, x, y, { width });
  y += 18;
  const colCity = width * 0.20;
  const colActivity = width * 0.48;
  const colPrice = width * 0.16;
  const adultX = x + colCity + colActivity + 4;
  const childX = x + colCity + colActivity + colPrice + 4;
  doc.fillColor(COLORS.soft).font('Helvetica-Bold').fontSize(6.8);
  doc.text(T.colCity, x + 14, y, { width: colCity - 14, characterSpacing: 0.8 });
  doc.text(T.colActivity, x + colCity + 4, y, { width: colActivity - 8, characterSpacing: 0.8 });
  doc.text(T.colAdult, adultX, y, { width: colPrice - 8, characterSpacing: 0.8, align: 'right' });
  doc.text(T.colChild, childX, y, { width: colPrice - 18, characterSpacing: 0.8, align: 'right' });
  y += 15;
  items.forEach((item, index) => {
    if (y >= 715) { y = Math.max(152, contentPage(doc, T.conditions, T.bookingPayments)); }
    const rowH = 28;
    doc.fillColor(index % 2 ? COLORS.paper : COLORS.cream).roundedRect(x, y, width, rowH, 4).fill();
    doc.fillColor(COLORS.ink).font('Helvetica-Bold').fontSize(8.3).text(item.city || '', x + 14, y + 9, { width: colCity - 14, height: 14, ellipsis: true });
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.3).text(item.name || '', x + colCity + 4, y + 9, { width: colActivity - 8, height: 14, ellipsis: true });
    doc.fillColor(COLORS.terra).font('Helvetica-Bold').fontSize(9).text(`$${item.adult}`, adultX, y + 8, { width: colPrice - 8, align: 'right' });
    doc.fillColor(COLORS.terra).font('Helvetica-Bold').fontSize(9).text(`$${item.child}`, childX, y + 8, { width: colPrice - 18, align: 'right' });
    y += rowH + 5;
  });
  if (note) {
    y += 6;
    doc.fillColor(COLORS.soft).font('Helvetica-Oblique').fontSize(8).text(note, x, y, { width, lineGap: 2 });
    y = doc.y;
  }
  return y;
}

function contentPage(doc, kicker, title) {
  doc.addPage({ size: 'LETTER', margin: 0 });
  doc.fillColor(COLORS.paper).rect(0, 0, W, H).fill();
  drawBrandLockup(doc, false, M, 23, .82);
  doc.strokeColor(COLORS.line).lineWidth(.7).moveTo(M, 68).lineTo(W - M, 68).stroke();
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text(kicker, M, 84, { characterSpacing: 1.4 });
  doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(31);
  const titleHeight = doc.heightOfString(title, { width: W - M * 2, lineGap: -2 });
  doc.text(title, M, 100, { width: W - M * 2, lineGap: -2 });
  return Math.max(152, 100 + titleHeight + 20);
}

function addPageFurniture(doc) {
  const range = doc.bufferedPageRange();
  for (let i = 1; i < range.count; i++) {
    doc.switchToPage(i);
    doc.strokeColor(COLORS.line).lineWidth(.6).moveTo(M, 750).lineTo(W - M, 750).stroke();
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(7).text('Altamira Travel  /  altamiratravel.com', M, 760);
    doc.text(`${i + 1} / ${range.count}`, W - M - 50, 760, { width: 50, align: 'right' });
  }
}

function drawImageFallback(doc, y, index, height = 205) {
  doc.fillColor(COLORS.cream).rect(M, y, W - M * 2, height).fill();
  doc.fillColor(COLORS.terra).font('Times-Roman').fontSize(70).text(String(index + 1).padStart(2, '0'), M, y + Math.max(38, (height - 70) / 2), { width: W - M * 2, align: 'center' });
}
function drawBrandLockup(doc, light, x, y, scale = 1) {
  const symbol = light ? doc.brandSymbols.light : doc.brandSymbols.dark;
  const symbolWidth = 43 * scale;
  const symbolHeight = 34 * scale;
  if (symbol) doc.image(symbol, x, y, { fit: [symbolWidth, symbolHeight] });
  else {
    doc.strokeColor(light ? COLORS.white : COLORS.terra).lineWidth(1.2 * scale)
      .moveTo(x + 3 * scale, y + symbolHeight).lineTo(x + 19 * scale, y).lineTo(x + 25 * scale, y + symbolHeight).stroke();
  }
  const textX = x + 52 * scale;
  const textY = y + 6 * scale;
  const fontSize = 20 * scale;
  doc.fillColor(light ? COLORS.white : COLORS.ink).font('Times-Roman').fontSize(fontSize)
    .text('ALTA', textX, textY, { continued: true, characterSpacing: 2.2 * scale });
  doc.fillColor(COLORS.terra).text('MIRA', { characterSpacing: 2.2 * scale });
}
function loadBrandSymbol(filename) {
  const candidates = [
    path.join(process.cwd(), 'images', filename),
    path.resolve(__dirname, '../../images', filename)
  ];
  const asset = candidates.find(candidate => fs.existsSync(candidate));
  return asset ? fs.readFileSync(asset) : null;
}
function sectionLabel(doc, text, y) { doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text(text, M, y, { characterSpacing: 1.4 }); }
function drawListColumn(doc, title, items, x, y, width, positive) {
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text(title, x, y, { characterSpacing: 1.3 });
  items.forEach((item, index) => {
    const itemY = y + 24 + index * 24;
    doc.fillColor(positive ? COLORS.terra : COLORS.soft).font('Helvetica-Bold').fontSize(9).text(positive ? '+' : '-', x, itemY);
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.2).text(item, x + 14, itemY, { width: width - 14, height: 21, ellipsis: true });
  });
}

async function loadImages(data) {
  const coverPromise = fetchImage(data.trip?.cover);
  const dayPromises = (data.days || []).map(async day => ({
    main: await fetchImage(day.image),
    gallery: await Promise.all((day.gallery || []).slice(0,2).map(fetchImage))
  }));
  const hotelPromises = (data.hotels || []).map(hotel => fetchImage(hotel.image));
  const dayData = await Promise.all(dayPromises);
  return { cover: await coverPromise, days: dayData.map(x=>x.main), dayGalleries: dayData.map(x=>x.gallery), hotels: await Promise.all(hotelPromises) };
}
async function fetchImage(source) {
  if (!source) return null;
  const dataMatch = /^data:image\/(?:jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(source);
  if (dataMatch) return Buffer.from(dataMatch[1], 'base64');
  if (!/^https:\/\//i.test(source)) return null;
  try {
    const response = await fetch(source, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const type = response.headers.get('content-type') || '';
    if (!/^image\/(jpeg|png)/i.test(type)) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.length <= 5000000 ? buffer : null;
  } catch { return null; }
}

function duration(start, end, fallback = 0, lang = 'es') {
  const T = STRINGS[lang];
  if (!start || !end) return `${fallback || '-'} ${fallback === 1 ? T.daySingular : T.dayPlural}`;
  const count = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
  return `${count} ${count === 1 ? T.daySingular : T.dayPlural}`;
}
function dateRange(start, end, lang = 'es') { return start && end ? `${longDate(start, lang)} - ${longDate(end, lang)}` : STRINGS[lang].dateRangeTbd; }
function longDate(value, lang = 'es') { return value ? new Intl.DateTimeFormat(STRINGS[lang].locale, { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(`${value}T00:00:00Z`)) : ''; }
function shortDate(value, lang = 'es') { return value ? new Intl.DateTimeFormat(STRINGS[lang].locale, { day:'numeric', month:'long', timeZone:'UTC' }).format(new Date(`${value}T00:00:00Z`)) : ''; }
function splitLines(value = '') { return String(value || '').split('\n').map(item => item.trim()).filter(Boolean); }
function fitTitle(value = '') { const length = String(value).length; return length > 55 ? 38 : length > 36 ? 44 : 52; }
function slug(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'itinerario-altamira'; }
function json(statusCode, body) { return { statusCode, headers: { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }, body: JSON.stringify(body) }; }
