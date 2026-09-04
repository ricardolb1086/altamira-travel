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
const BRAND_SYMBOLS = {
  dark: loadBrandSymbol('simbolo-terra.png'),
  light: loadBrandSymbol('simbolo-blanco.png')
};

exports.handler = async (event) => {
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
        'Cache-Control': 'no-store'
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

    drawCover(doc, data, images.cover);
    drawOverview(doc, data);
    (data.days || []).forEach((day, index) => drawDay(doc, day, index, images.days[index]));
    if ((data.flights || []).length || (data.hotels || []).length) drawLogistics(doc, data);
    drawClosing(doc, data);
    addPageFurniture(doc);
    doc.end();
  });
}

function drawCover(doc, data, cover) {
  doc.addPage({ size: 'LETTER', margin: 0 });
  if (cover) {
    try { doc.image(cover, 0, 0, { cover: [W, H], align: 'center', valign: 'center' }); }
    catch { doc.rect(0, 0, W, H).fill(COLORS.ink); }
  } else doc.rect(0, 0, W, H).fill(COLORS.ink);
  doc.save().fillColor(COLORS.ink).opacity(cover ? 0.72 : 1).rect(0, 0, W, H).fill().restore();
  drawBrandLockup(doc, true, M, 37, 1.15);
  doc.fillColor(COLORS.terra).font('Helvetica-Bold').fontSize(8).text('ITINERARIO PERSONALIZADO', M, 265, { characterSpacing: 1.8 });
  const titleSize = fitTitle(data.trip.title);
  doc.fillColor(COLORS.white).font('Times-Roman').fontSize(titleSize).text(data.trip.title, M, 292, { width: 485, lineGap: -3 });
  let y = Math.min(555, Math.max(455, doc.y + 18));
  doc.strokeColor(COLORS.terra).lineWidth(1.2).moveTo(M, y).lineTo(M + 54, y).stroke();
  doc.fillColor('#E8DED2').font('Helvetica').fontSize(11).text(data.trip.route || 'Una experiencia disenada a tu medida', M, y + 17, { width: 460, lineGap: 3 });
  doc.fillColor(COLORS.white).font('Helvetica-Bold').fontSize(8).text(`PREPARADO PARA ${String(data.trip.client || 'NUESTRO VIAJERO').toUpperCase()}`, M, 690, { characterSpacing: 1.2 });
  doc.fillColor('#D8CBBB').font('Helvetica').fontSize(9).text(dateRange(data.trip.start, data.trip.end), M, 712);
}

function drawOverview(doc, data) {
  contentPage(doc, 'LA PROPUESTA', 'Un viaje pensado para ti');
  const top = 142;
  const stats = [
    [duration(data.trip.start, data.trip.end, data.days?.length), 'DURACION'],
    [String(data.trip.travelers || '-'), 'VIAJEROS'],
    [shortDate(data.trip.start) || 'POR DEFINIR', 'SALIDA']
  ];
  stats.forEach((item, index) => {
    const x = M + index * 169;
    doc.fillColor(COLORS.cream).roundedRect(x, top, 155, 70, 5).fill();
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(20).text(item[0], x + 14, top + 17, { width: 130 });
    doc.fillColor(COLORS.soft).font('Helvetica-Bold').fontSize(7).text(item[1], x + 14, top + 45, { characterSpacing: 1.2 });
  });
  let y = 246;
  if (data.trip.summary) {
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(8).text('LA EXPERIENCIA', M, y, { characterSpacing: 1.5 });
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(18).text(data.trip.summary, M, y + 24, { width: W - M * 2, lineGap: 6 });
    y = doc.y + 28;
  }
  doc.strokeColor(COLORS.line).lineWidth(1).moveTo(M, y).lineTo(W - M, y).stroke();
  y += 24;
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(8).text('RUTA DEL VIAJE', M, y, { characterSpacing: 1.5 });
  doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(28).text(data.trip.route || 'Ruta por confirmar', M, y + 20, { width: W - M * 2, lineGap: 3 });
  y = doc.y + 26;
  doc.fillColor(COLORS.soft).font('Helvetica').fontSize(10).text('Cada jornada ha sido organizada para ofrecer una lectura clara del viaje. Los horarios definitivos se confirmaran junto con la documentacion final.', M, y, { width: 455, lineGap: 4 });
}

function drawDay(doc, day, index, image) {
  let y = Math.max(210, contentPage(doc, `DIA ${String(index + 1).padStart(2, '0')}  /  ${shortDate(day.date) || 'FECHA POR DEFINIR'}`, day.title || 'Jornada por definir'));
  if (image) {
    const imageHeight = 140;
    try {
      doc.save();
      try {
        doc.rect(M, y, W - M * 2, imageHeight).clip();
        doc.image(image, M, y, { cover: [W - M * 2, imageHeight], align: 'center', valign: 'center' });
      } finally {
        doc.restore();
      }
    }
    catch { drawImageFallback(doc, y, index, imageHeight); }
    doc.strokeColor(COLORS.terra).lineWidth(3).moveTo(M, y + imageHeight).lineTo(W - M, y + imageHeight).stroke();
    y += imageHeight + 30;
  } else {
    doc.fillColor(COLORS.ink).roundedRect(M, y, W - M * 2, 190, 7).fill();
    doc.fillColor(COLORS.terra).font('Times-Roman').fontSize(88).text(String(index + 1).padStart(2, '0'), M + 30, y + 45);
    doc.fillColor('#D8CBBB').font('Helvetica-Bold').fontSize(8).text('UNA NUEVA JORNADA', M + 225, y + 82, { characterSpacing: 1.6 });
    doc.strokeColor(COLORS.terra).lineWidth(1).moveTo(M + 225, y + 105).lineTo(W - M - 28, y + 105).stroke();
    y += 222;
  }
  if (day.description) {
    const descSize = String(day.description).length > 750 ? 10.2 : 11.5;
    doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(descSize).text(day.description, M, y, { width: W - M * 2, lineGap: 4 });
    y = doc.y + 17;
  }
  const activities = splitLines(day.activities);
  if (activities.length) {
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7.5).text('MOMENTOS DEL DIA', M, y, { characterSpacing: 1.4 });
    y += 19;
    const columns = activities.length > 5 ? 2 : 1;
    const colWidth = columns === 2 ? 238 : W - M * 2;
    const perColumn = Math.ceil(activities.length / columns);
    activities.forEach((activity, i) => {
      const col = Math.floor(i / perColumn);
      const row = i % perColumn;
      const x = M + col * 270;
      const itemY = y + row * 25;
      doc.fillColor(COLORS.terra).circle(x + 3, itemY + 5, 2.5).fill();
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(9.2).text(activity, x + 13, itemY, { width: colWidth - 13, height: 22, ellipsis: true });
    });
    y += perColumn * 25 + 5;
  }
  const meals = [day.breakfast && 'Desayuno', day.lunch && 'Almuerzo', day.dinner && 'Cena'].filter(Boolean);
  if (meals.length) {
    meals.forEach((meal, i) => {
      const x = M + i * 90;
      doc.fillColor('#EFE6DA').roundedRect(x, y, 80, 20, 10).fill();
      doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text(meal.toUpperCase(), x, y + 7, { width: 80, align: 'center' });
    });
    y += 34;
  }
  if (day.notes && y < 690) {
    doc.fillColor(COLORS.cream).roundedRect(M, y, W - M * 2, Math.min(58, H - 76 - y), 5).fill();
    doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(7).text('NOTA', M + 13, y + 12, { characterSpacing: 1 });
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.5).text(day.notes, M + 55, y + 10, { width: W - M * 2 - 70, height: 40, lineGap: 2, ellipsis: true });
  }
}

function drawLogistics(doc, data) {
  contentPage(doc, 'LOGISTICA', 'Todo bajo control');
  let y = 142;
  if (data.flights?.length) {
    sectionLabel(doc, 'VUELOS', y); y += 22;
    data.flights.forEach((flight, index) => {
      const cardHeight = flight.notes ? 92 : 70;
      doc.fillColor(index % 2 ? COLORS.paper : COLORS.cream).roundedRect(M, y, W - M * 2, cardHeight, 5).fill();
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(16).text(`${flight.from || 'Origen'} - ${flight.to || 'Destino'}`, M + 15, y + 13);
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.5).text([flight.airline, flight.number, shortDate(flight.date), flight.depart && flight.arrive ? `${flight.depart} - ${flight.arrive}` : ''].filter(Boolean).join('  /  '), M + 15, y + 39, { width: 470 });
      if (flight.notes) doc.fillColor(COLORS.terraDeep).font('Helvetica').fontSize(7.7).text(flight.notes, M + 15, y + 58, { width: 470, height: 25, lineGap: 2, ellipsis: true });
      y += cardHeight + 10;
    });
    y += 12;
  }
  if (data.hotels?.length) {
    sectionLabel(doc, 'ALOJAMIENTO', y); y += 22;
    data.hotels.forEach((hotel, index) => {
      if (y > 665) { contentPage(doc, 'LOGISTICA', 'Alojamiento'); y = 142; }
      doc.strokeColor(COLORS.line).roundedRect(M, y, W - M * 2, 74, 5).stroke();
      doc.fillColor(COLORS.ink).font('Times-Roman').fontSize(17).text(hotel.name || 'Hotel por confirmar', M + 15, y + 13);
      doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.5).text([hotel.city, hotel.room, hotel.meals].filter(Boolean).join('  /  '), M + 15, y + 40, { width: 470 });
      y += 84;
    });
  }
}

function drawClosing(doc, data) {
  contentPage(doc, 'DETALLES DE LA PROPUESTA', 'Servicios e inversion');
  let y = 137;
  const price = Number(data.pricing?.price || 0);
  const airfare = Number(data.pricing?.airfare || 0);
  const total = price + airfare;
  if (price || airfare) {
    doc.fillColor(COLORS.ink).roundedRect(M, y, W - M * 2, 92, 6).fill();
    const currency = data.pricing.currency || 'USD';
    if (airfare) {
      const priceColumns = [
        ['PROGRAMA POR PERSONA', price],
        ['VUELOS POR PERSONA', airfare],
        ['TOTAL ESTIMADO', total]
      ];
      priceColumns.forEach(([label, value], index) => {
        const x = M + 20 + index * 165;
        doc.fillColor('#D8CBBB').font('Helvetica-Bold').fontSize(6.5).text(label, x, y + 16, { width: 150, characterSpacing: 1 });
        doc.fillColor(index === 2 ? COLORS.white : COLORS.terra).font('Times-Roman').fontSize(index === 2 ? 25 : 23).text(`${currency} ${value.toLocaleString('en-US')}`, x, y + 34, { width: 150 });
      });
      if (data.pricing?.fareNotice) doc.fillColor('#D8CBBB').font('Helvetica').fontSize(7.3).text(data.pricing.fareNotice, M + 20, y + 69, { width: W - M * 2 - 40, height: 16, align: 'center', ellipsis: true });
    } else {
      doc.fillColor('#D8CBBB').font('Helvetica-Bold').fontSize(7).text('INVERSION POR PERSONA', M + 20, y + 22, { characterSpacing: 1.4 });
      doc.fillColor(COLORS.terra).font('Times-Roman').fontSize(34).text(`${currency} ${price.toLocaleString('en-US')}`, M + 20, y + 42);
      if (data.pricing.deposit) doc.fillColor(COLORS.white).font('Helvetica').fontSize(9).text(`Reserva con ${data.pricing.deposit}`, 320, y + 49, { width: 220, align: 'right' });
    }
    y += 120;
  }
  const includes = splitLines(data.details?.includes);
  const excludes = splitLines(data.details?.excludes);
  drawListColumn(doc, 'EL VIAJE INCLUYE', includes, M, y, 235, true);
  drawListColumn(doc, 'NO INCLUYE', excludes, 325, y, 235, false);
  y += Math.max(includes.length, excludes.length) * 24 + 45;
  if (data.details?.requirements && y < 610) {
    sectionLabel(doc, 'INFORMACION IMPORTANTE', y); y += 20;
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.8).text(data.details.requirements, M, y, { width: W - M * 2, lineGap: 3 });
    y = doc.y + 18;
  }
  if (data.pricing?.terms && y < 660) {
    sectionLabel(doc, 'CONDICIONES DE PAGO', y); y += 20;
    doc.fillColor(COLORS.soft).font('Helvetica').fontSize(8.8).text(data.pricing.terms, M, y, { width: W - M * 2, lineGap: 3 });
  }
  doc.fillColor(COLORS.terraDeep).font('Helvetica-Bold').fontSize(9).text('Consulta los Terminos y Condiciones completos', M, 690, { link: 'https://altamiratravel.com/terminos', underline: true });
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
  const symbol = light ? BRAND_SYMBOLS.light : BRAND_SYMBOLS.dark;
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
  const dayPromises = (data.days || []).map(day => fetchImage(day.image));
  return { cover: await coverPromise, days: await Promise.all(dayPromises) };
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

function duration(start, end, fallback = 0) {
  if (!start || !end) return `${fallback || '-'} ${fallback === 1 ? 'dia' : 'dias'}`;
  const count = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
  return `${count} ${count === 1 ? 'dia' : 'dias'}`;
}
function dateRange(start, end) { return start && end ? `${longDate(start)} - ${longDate(end)}` : 'Fechas por confirmar'; }
function longDate(value) { return value ? new Intl.DateTimeFormat('es-US', { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(`${value}T00:00:00Z`)) : ''; }
function shortDate(value) { return value ? new Intl.DateTimeFormat('es-US', { day:'numeric', month:'long', timeZone:'UTC' }).format(new Date(`${value}T00:00:00Z`)) : ''; }
function splitLines(value = '') { return String(value || '').split('\n').map(item => item.trim()).filter(Boolean); }
function fitTitle(value = '') { const length = String(value).length; return length > 55 ? 38 : length > 36 ? 44 : 52; }
function slug(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'itinerario-altamira'; }
function json(statusCode, body) { return { statusCode, headers: { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }, body: JSON.stringify(body) }; }
