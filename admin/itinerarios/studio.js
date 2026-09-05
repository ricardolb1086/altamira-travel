(() => {
  const STORAGE_KEY = 'altamira-itinerary-studio-v1';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const uid = () => Math.random().toString(36).slice(2, 10);
  const emptyFlight = () => ({ id: uid(), date: '', airline: '', number: '', from: '', to: '', depart: '', arrive: '', notes: '' });
  const emptyHotel = () => ({ id: uid(), name: '', city: '', checkin: '', checkout: '', room: '', meals: '' });
  const emptyDay = () => ({ id: uid(), date: '', title: '', description: '', activities: '', image: '', breakfast: false, lunch: false, dinner: false, notes: '' });
  const PREVIEW_STRINGS = {
    es: {
      locale: 'es-US', kicker: 'Itinerario personalizado', defaultTitle: 'Tu próximo gran viaje',
      defaultRoute: 'Una experiencia diseñada a tu medida', preparedFor: 'Preparado para', defaultClient: 'nuestro viajero',
      daySingular: 'día', dayPlural: 'días', tbd: 'Por definir', duration: 'Duración', travelers: 'Viajeros', departure: 'Salida',
      experience: 'La experiencia', tripPlanned: 'Un viaje pensado para ti', dayByDay: 'Día a día', howWeLive: 'Así viviremos el viaje',
      dayDetailPlaceholder: 'El itinerario detallado aparecerá aquí.', day: 'DÍA', dayTbd: 'Día por definir',
      breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena', note: 'Nota:',
      connections: 'Conexiones', flights: 'Vuelos', origin: 'Origen', destination: 'Destino',
      rest: 'Descanso', selectedHotels: 'Hoteles seleccionados', hotelTbd: 'Hotel por confirmar',
      programPerPerson: 'Programa por persona', flightsPerPerson: 'Vuelos por persona', totalEstimatedPerPerson: 'Total estimado por persona',
      allYouNeedToKnow: 'Todo lo que necesitas saber', tripServices: 'Servicios del viaje', includes: 'Incluye', excludes: 'No incluye',
      conditions: 'Condiciones', bookingPayments: 'Reserva y pagos', validUntil: 'Propuesta válida hasta:',
      tagline: 'Journeys made unforgettable', terms: 'Términos y condiciones'
    },
    en: {
      locale: 'en-US', kicker: 'Personalized itinerary', defaultTitle: 'Your next great trip',
      defaultRoute: 'An experience designed for you', preparedFor: 'Prepared for', defaultClient: 'our traveler',
      daySingular: 'day', dayPlural: 'days', tbd: 'To be defined', duration: 'Duration', travelers: 'Travelers', departure: 'Departure',
      experience: 'The experience', tripPlanned: 'A trip designed for you', dayByDay: 'Day by day', howWeLive: "Here's how we'll live the trip",
      dayDetailPlaceholder: 'The detailed itinerary will appear here.', day: 'DAY', dayTbd: 'Day to be defined',
      breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', note: 'Note:',
      connections: 'Connections', flights: 'Flights', origin: 'Origin', destination: 'Destination',
      rest: 'Rest', selectedHotels: 'Selected hotels', hotelTbd: 'Hotel to be confirmed',
      programPerPerson: 'Program per person', flightsPerPerson: 'Flights per person', totalEstimatedPerPerson: 'Total estimated per person',
      allYouNeedToKnow: 'Everything you need to know', tripServices: 'Trip services', includes: 'Includes', excludes: 'Not included',
      conditions: 'Conditions', bookingPayments: 'Booking and payments', validUntil: 'Proposal valid until:',
      tagline: 'Journeys made unforgettable', terms: 'Terms and conditions'
    }
  };
  const defaults = () => ({
    trip: { title: '', client: '', travelers: '2', start: '', end: '', route: '', summary: '', cover: '', lang: 'es' },
    days: [emptyDay()], flights: [], hotels: [],
    pricing: { currency: 'USD', price: '', airfare: '', fareNotice: '', deposit: '', validUntil: '', terms: '' },
    details: { includes: '', excludes: '', requirements: '' },
    contact: { name: 'Altamira Travel', email: 'hola@altamiratravel.com', phone: '+1 (888) 855-1889', closing: 'Estamos listos para hacer realidad este viaje.' }
  });
  let state = load();

  function load() {
    try { return { ...defaults(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') }; }
    catch { return defaults(); }
  }
  function get(path) { return path.split('.').reduce((value, key) => value?.[key], state); }
  function set(path, value) {
    const keys = path.split('.'); let target = state;
    keys.slice(0, -1).forEach(key => target = target[key]); target[keys.at(-1)] = value;
    save(); renderPreview();
  }
  let saveTimer;
  function save() {
    $('#saveState').lastChild.textContent = ' Guardando…';
    clearTimeout(saveTimer); saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); $('#saveState').lastChild.textContent = ' Guardado automáticamente'; }
      catch { $('#saveState').lastChild.textContent = ' La imagen es demasiado grande'; }
    }, 220);
  }
  function escapeHTML(value = '') { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c])); }
  function lines(value = '') { return value.split('\n').map(v => v.trim()).filter(Boolean); }
  function previewLang() { return state.trip.lang === 'en' ? 'en' : 'es'; }
  function fmtDate(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat(PREVIEW_STRINGS[previewLang()].locale, { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(`${value}T00:00:00Z`));
  }
  function tripDays() {
    const P = PREVIEW_STRINGS[previewLang()];
    if (!state.trip.start || !state.trip.end) return state.days.length ? `${state.days.length} ${state.days.length === 1 ? P.daySingular : P.dayPlural}` : P.tbd;
    const diff = Math.round((new Date(state.trip.end) - new Date(state.trip.start)) / 86400000) + 1;
    return diff > 0 ? `${diff} ${diff === 1 ? P.daySingular : P.dayPlural}` : `${state.days.length} ${state.days.length === 1 ? P.daySingular : P.dayPlural}`;
  }
  function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2400); }

  function bindStaticFields() {
    $$('[data-bind]').forEach(input => {
      input.value = get(input.dataset.bind) ?? '';
      input.addEventListener('input', () => set(input.dataset.bind, input.value));
    });
  }
  function renderEditors() { renderDays(); renderFlights(); renderHotels(); }
  function field(label, value, key, type = 'text', span = '') {
    const tag = type === 'textarea' ? `<textarea rows="3" data-key="${key}">${escapeHTML(value)}</textarea>` : `<input type="${type}" data-key="${key}" value="${escapeHTML(value)}">`;
    return `<div class="field ${span}"><label>${label}</label>${tag}</div>`;
  }
  function actionButtons(index, length, kind) {
    return `<div class="card-actions"><button class="icon-btn" data-action="up" data-kind="${kind}" data-index="${index}" title="Subir" ${index===0?'disabled':''}>↑</button><button class="icon-btn" data-action="down" data-kind="${kind}" data-index="${index}" title="Bajar" ${index===length-1?'disabled':''}>↓</button><button class="icon-btn" data-action="remove" data-kind="${kind}" data-index="${index}" title="Eliminar">×</button></div>`;
  }
  function renderDays() {
    $('#daysEditor').innerHTML = state.days.map((day, i) => `<article class="item-card" data-item="days" data-index="${i}">
      <div class="card-title"><span class="day-number">DÍA ${String(i+1).padStart(2,'0')}</span><h3>${escapeHTML(day.title || 'Nueva jornada')}</h3>${actionButtons(i,state.days.length,'days')}</div>
      ${field('Fecha',day.date,'date','date')}${field('Título del día',day.title,'title')}
      ${field('Narrativa',day.description,'description','textarea','span-2')}
      ${field('Actividades · una por línea',day.activities,'activities','textarea','span-2')}
      <div class="day-image"><div class="image-thumb">${day.image?`<img src="${day.image}" alt="">`:'<span>✦</span>'}</div><div><button class="text-btn" data-action="image" data-kind="days" data-index="${i}">Seleccionar foto</button>${day.image?`<button class="text-btn danger" data-action="removeImage" data-kind="days" data-index="${i}">Quitar</button>`:''}<input type="file" accept="image/jpeg,image/png,image/webp" data-day-file="${i}" hidden></div></div>
      <div class="meal-row"><label class="check-pill"><input type="checkbox" data-key="breakfast" ${day.breakfast?'checked':''}> Desayuno</label><label class="check-pill"><input type="checkbox" data-key="lunch" ${day.lunch?'checked':''}> Almuerzo</label><label class="check-pill"><input type="checkbox" data-key="dinner" ${day.dinner?'checked':''}> Cena</label></div>
      ${field('Notas prácticas',day.notes,'notes','textarea','span-2')}
    </article>`).join('');
  }
  function renderFlights() {
    $('#flightsEditor').innerHTML = state.flights.length ? state.flights.map((item,i) => `<article class="item-card" data-item="flights" data-index="${i}"><div class="card-title"><span class="day-number">TRAMO ${i+1}</span><h3>${escapeHTML(item.from||'Origen')} → ${escapeHTML(item.to||'Destino')}</h3>${actionButtons(i,state.flights.length,'flights')}</div>${field('Fecha',item.date,'date','date')}${field('Aerolínea',item.airline,'airline')}${field('Vuelo',item.number,'number')}${field('Origen',item.from,'from')}${field('Destino',item.to,'to')}${field('Salida',item.depart,'depart','time')}${field('Llegada',item.arrive,'arrive','time')}${field('Notas',item.notes,'notes','textarea','span-2')}</article>`).join('') : '<div class="empty-preview"><p>Aún no has agregado vuelos.</p></div>';
  }
  function renderHotels() {
    $('#hotelsEditor').innerHTML = state.hotels.length ? state.hotels.map((item,i) => `<article class="item-card" data-item="hotels" data-index="${i}"><div class="card-title"><span class="day-number">HOTEL ${i+1}</span><h3>${escapeHTML(item.name||'Nuevo alojamiento')}</h3>${actionButtons(i,state.hotels.length,'hotels')}</div>${field('Hotel',item.name,'name')}${field('Ciudad',item.city,'city')}${field('Check-in',item.checkin,'checkin','date')}${field('Check-out',item.checkout,'checkout','date')}${field('Habitación',item.room,'room')}${field('Régimen',item.meals,'meals')}</article>`).join('') : '<div class="empty-preview"><p>Aún no has agregado hoteles.</p></div>';
  }
  function bindDynamic() {
    $('#editor').addEventListener('input', e => {
      const card = e.target.closest('[data-item]'); if (!card || !e.target.dataset.key) return;
      const item = state[card.dataset.item][Number(card.dataset.index)];
      item[e.target.dataset.key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      const heading = $('.card-title h3', card);
      if (heading && card.dataset.item === 'days' && e.target.dataset.key === 'title') heading.textContent = item.title || 'Nueva jornada';
      if (heading && card.dataset.item === 'flights' && ['from','to'].includes(e.target.dataset.key)) heading.textContent = `${item.from || 'Origen'} → ${item.to || 'Destino'}`;
      if (heading && card.dataset.item === 'hotels' && e.target.dataset.key === 'name') heading.textContent = item.name || 'Nuevo alojamiento';
      save(); renderPreview();
    });
    $('#editor').addEventListener('click', e => {
      const btn = e.target.closest('[data-action]'); if (!btn) return;
      const list = state[btn.dataset.kind], index = Number(btn.dataset.index), action = btn.dataset.action;
      if (action === 'remove') { if (list.length > 1 || btn.dataset.kind !== 'days') list.splice(index,1); }
      if (action === 'up' && index > 0) [list[index-1],list[index]]=[list[index],list[index-1]];
      if (action === 'down' && index < list.length-1) [list[index+1],list[index]]=[list[index],list[index+1]];
      if (action === 'image') $(`[data-day-file="${index}"]`).click();
      if (action === 'removeImage') list[index].image = '';
      renderEditors(); save(); renderPreview();
    });
    $('#editor').addEventListener('change', async e => {
      if (!e.target.matches('[data-day-file]') || !e.target.files[0]) return;
      state.days[Number(e.target.dataset.dayFile)].image = await resizeImage(e.target.files[0]); renderEditors(); save(); renderPreview();
    });
  }
  function resizeImage(file, maxWidth = 1400, quality = .8) {
    return new Promise((resolve,reject) => { const reader = new FileReader(); reader.onerror=reject; reader.onload=() => { const img = new Image(); img.onerror=reject; img.onload=() => { const scale=Math.min(1,maxWidth/img.width), canvas=document.createElement('canvas'); canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale); canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height); resolve(canvas.toDataURL('image/jpeg',quality)); }; img.src=reader.result; }; reader.readAsDataURL(file); });
  }
  function renderPreview() {
    const t=state.trip, price=Number(state.pricing.price||0), airfare=Number(state.pricing.airfare||0), total=price+airfare, currency=state.pricing.currency;
    const P=PREVIEW_STRINGS[previewLang()];
    const coverStyle=t.cover?` style="background-image:url('${t.cover}')"`:'';
    const daysHTML=state.days.filter(d=>d.title||d.description||d.activities||d.image).map((d,i)=>`<div class="proposal-day"><div class="proposal-day-num">${P.day} ${String(i+1).padStart(2,'0')}</div><div><h3>${escapeHTML(d.title||P.dayTbd)}</h3>${d.date?`<div class="proposal-day-date">${escapeHTML(fmtDate(d.date))}</div>`:''}${d.image?`<img class="proposal-day-img" src="${d.image}" alt="">`:''}${d.description?`<p>${escapeHTML(d.description)}</p>`:''}${lines(d.activities).length?`<ul>${lines(d.activities).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>`:''}<div class="meal-tags">${d.breakfast?`<span>${P.breakfast}</span>`:''}${d.lunch?`<span>${P.lunch}</span>`:''}${d.dinner?`<span>${P.dinner}</span>`:''}</div>${d.notes?`<p><strong>${P.note}</strong> ${escapeHTML(d.notes)}</p>`:''}</div></div>`).join('');
    const flights=state.flights.filter(x=>x.from||x.to||x.airline).map(x=>`<div class="proposal-info"><b>${escapeHTML(x.from||P.origin)} → ${escapeHTML(x.to||P.destination)}</b><span>${escapeHTML([x.airline,x.number,x.date?fmtDate(x.date):'',x.depart&&x.arrive?`${x.depart} – ${x.arrive}`:''].filter(Boolean).join(' · '))}</span>${x.notes?`<p>${escapeHTML(x.notes)}</p>`:''}</div>`).join('');
    const hotels=state.hotels.filter(x=>x.name||x.city).map(x=>`<div class="proposal-info"><b>${escapeHTML(x.name||P.hotelTbd)}</b><span>${escapeHTML([x.city,x.room,x.meals].filter(Boolean).join(' · '))}</span>${x.checkin||x.checkout?`<p>${escapeHTML(x.checkin?fmtDate(x.checkin):'')} — ${escapeHTML(x.checkout?fmtDate(x.checkout):'')}</p>`:''}</div>`).join('');
    $('#proposal').innerHTML=`<header class="proposal-cover ${t.cover?'has-image':''}"${coverStyle}><div class="proposal-logo"><img src="/images/simbolo-blanco.png" alt="Altamira Travel"><span>ALTA<b>MIRA</b></span></div><div><div class="proposal-kicker">${P.kicker}</div><h1>${escapeHTML(t.title||P.defaultTitle)}</h1><div class="proposal-route">${escapeHTML(t.route||P.defaultRoute)}</div><div class="proposal-client">${P.preparedFor} ${escapeHTML(t.client||P.defaultClient)}</div></div></header>
      <div class="proposal-stats"><div class="proposal-stat"><b>${escapeHTML(tripDays())}</b><span>${P.duration}</span></div><div class="proposal-stat"><b>${escapeHTML(t.travelers||'—')}</b><span>${P.travelers}</span></div><div class="proposal-stat"><b>${escapeHTML(t.start?fmtDate(t.start).replace(/ de \d{4}$/,'').replace(/,? \d{4}$/,''):P.tbd)}</b><span>${P.departure}</span></div></div>
      ${t.summary?`<section class="proposal-section"><div class="eyebrow">${P.experience}</div><h2>${P.tripPlanned}</h2><div class="proposal-summary">${escapeHTML(t.summary)}</div></section>`:''}
      <section class="proposal-section alt"><div class="eyebrow">${P.dayByDay}</div><h2>${P.howWeLive}</h2>${daysHTML||`<p class="proposal-summary">${P.dayDetailPlaceholder}</p>`}</section>
      ${flights?`<section class="proposal-section"><div class="eyebrow">${P.connections}</div><h2>${P.flights}</h2><div class="proposal-grid">${flights}</div></section>`:''}
      ${hotels?`<section class="proposal-section alt"><div class="eyebrow">${P.rest}</div><h2>${P.selectedHotels}</h2><div class="proposal-grid">${hotels}</div></section>`:''}
      ${price||airfare?`<section class="proposal-price"><div class="proposal-price-breakdown">${price?`<div><small>${P.programPerPerson}</small><strong>${currency} ${price.toLocaleString('en-US')}</strong></div>`:''}${airfare?`<div><small>${P.flightsPerPerson}</small><strong>${currency} ${airfare.toLocaleString('en-US')}</strong></div><div class="proposal-price-total"><small>${P.totalEstimatedPerPerson}</small><strong>${currency} ${total.toLocaleString('en-US')}</strong></div>`:''}${state.pricing.fareNotice?`<p>${escapeHTML(state.pricing.fareNotice)}</p>`:''}</div></section>`:''}
      ${(state.details.includes||state.details.excludes)?`<section class="proposal-section"><div class="eyebrow">${P.allYouNeedToKnow}</div><h2>${P.tripServices}</h2><div class="proposal-lists"><div><h3>${P.includes}</h3><ul class="yes">${lines(state.details.includes).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div><div><h3>${P.excludes}</h3><ul class="no">${lines(state.details.excludes).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div></div>${state.details.requirements?`<p class="proposal-summary">${escapeHTML(state.details.requirements)}</p>`:''}</section>`:''}
      ${state.pricing.terms?`<section class="proposal-section alt"><div class="eyebrow">${P.conditions}</div><h2>${P.bookingPayments}</h2><p class="proposal-summary">${escapeHTML(state.pricing.terms)}</p>${state.pricing.validUntil?`<p><strong>${P.validUntil}</strong> ${escapeHTML(fmtDate(state.pricing.validUntil))}</p>`:''}</section>`:''}
      <footer class="proposal-footer"><div><strong>ALTA<span style="color:#c47646">MIRA</span> TRAVEL</strong><div class="eyebrow">${P.tagline}</div></div><p>${escapeHTML(state.contact.closing)}<br><b>${escapeHTML(state.contact.name)}</b><br>${escapeHTML(state.contact.email)} · ${escapeHTML(state.contact.phone)}<br><a href="https://altamiratravel.com/terminos" target="_blank" rel="noopener">${P.terms}</a></p></footer>`;
  }
  function setupNav() {
    $('#sectionNav').addEventListener('click', e => { const btn=e.target.closest('[data-target]'); if(!btn)return; $$('.rail-link').forEach(x=>x.classList.toggle('active',x===btn)); $$('.editor-section').forEach(x=>x.classList.toggle('active',x.dataset.section===btn.dataset.target)); $('#editor').scrollTo({top:0,behavior:'smooth'}); });
  }
  function setupActions() {
    $('#addDay').onclick=()=>{state.days.push(emptyDay());renderEditors();save();renderPreview();};
    $('#addFlight').onclick=()=>{state.flights.push(emptyFlight());renderEditors();save();renderPreview();};
    $('#addHotel').onclick=()=>{state.hotels.push(emptyHotel());renderEditors();save();renderPreview();};
    $('#chooseCover').onclick=()=>$('#coverInput').click();
    $('#coverInput').onchange=async e=>{if(!e.target.files[0])return;state.trip.cover=await resizeImage(e.target.files[0],1800,.82);renderCover();save();renderPreview();};
    $('#removeCover').onclick=()=>{state.trip.cover='';renderCover();save();renderPreview();};
    async function downloadPDF(){
      const button=$('#printBtn'),original=button.textContent;button.disabled=true;button.textContent='Generando PDF…';
      try{const response=await fetch('/.netlify/functions/generate-itinerary-pdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)});if(!response.ok){const result=await response.json();throw new Error(result.error||'No fue posible generar el PDF');}const blob=await response.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${(state.trip.title||'itinerario-altamira').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('PDF profesional descargado');}catch(error){toast(error.message);}finally{button.disabled=false;button.textContent=original;}
    }
    $('#printBtn').onclick=()=>{if(!state.trip.title){toast('Agrega primero el nombre del viaje');return;}$('#pdfLangDialog').showModal();};
    $$('[data-pdf-lang]').forEach(btn=>btn.onclick=()=>{state.trip.lang=btn.dataset.pdfLang;save();renderPreview();$('#pdfLangDialog').close();downloadPDF();});
    $('#fitPreview').onclick=()=>{const focused=document.body.classList.toggle('preview-focus');$('#fitPreview').textContent=focused?'Volver al editor':'Ajustar';window.scrollTo({top:0,behavior:'smooth'});};
    $('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`altamira-${(state.trip.title||'itinerario').toLowerCase().replace(/[^a-z0-9]+/g,'-')}.json`;a.click();URL.revokeObjectURL(a.href);toast('Copia del itinerario guardada');};
    $('#importBtn').onclick=()=>$('#importDialog').showModal();
    $('#importFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{state={...defaults(),...JSON.parse(reader.result)};localStorage.setItem(STORAGE_KEY,JSON.stringify(state));location.reload();}catch{toast('El archivo no es un itinerario válido');}};reader.readAsText(file);};
    $('#newBtn').onclick=()=>{if(confirm('¿Crear un itinerario nuevo? La propuesta actual seguirá disponible si antes guardas una copia.')){state=defaults();save();location.reload();}};
    $('#emailBtn').onclick=()=>{if(!state.trip.title){toast('Agrega primero el nombre del viaje');return;}$('#recipientName').value=state.trip.client||'';$('#emailDialog').showModal();};
    $$('[data-close]').forEach(x=>x.onclick=()=>document.getElementById(x.dataset.close).close());
    $('#emailForm').onsubmit=sendEmail;
  }
  function renderCover(){const thumb=$('#coverThumb');thumb.innerHTML=state.trip.cover?`<img src="${state.trip.cover}" alt="Portada">`:'<span>✦</span>';$('#removeCover').classList.toggle('hidden',!state.trip.cover);}
  async function sendEmail(e){
    e.preventDefault(); const status=$('#sendStatus'),button=e.submitter; status.className='send-status';status.textContent='Preparando y enviando…';button.disabled=true;
    try{const response=await fetch('/.netlify/functions/send-itinerary',{method:'POST',headers:{'Content-Type':'application/json','X-Altamira-Code':$('#accessCode').value},body:JSON.stringify({to:$('#recipientEmail').value.trim(),recipientName:$('#recipientName').value.trim(),note:$('#emailNote').value.trim(),trip:state})});const result=await response.json();if(!response.ok)throw new Error(result.error||'No fue posible enviar');status.classList.add('success');status.textContent='Itinerario enviado correctamente.';setTimeout(()=>$('#emailDialog').close(),1500);}catch(err){status.classList.add('error');status.textContent=err.message;}finally{button.disabled=false;}
  }
  bindStaticFields(); renderCover(); renderEditors(); bindDynamic(); setupNav(); setupActions(); renderPreview();
})();
