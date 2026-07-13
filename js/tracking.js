/**
 * Altamira Travel — Tracking Utility
 * Todos los eventos van via dataLayer → GTM → GA4 + Meta Pixel
 */

(function () {
  'use strict';

  // ── Utilidad central ──────────────────────────────────────────────
  function trackEvent(eventName, parameters) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...parameters });
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function getPageMeta() {
    return {
      page_path: window.location.pathname,
      page_title: document.title,
      language: document.documentElement.lang || 'es',
    };
  }

  function getProgramMeta() {
    var meta = document.querySelector('meta[name="program-name"]');
    var country = document.querySelector('meta[name="destination-country"]');
    var category = document.querySelector('meta[name="program-category"]');
    var price = document.querySelector('meta[name="program-price"]');
    return {
      program_name: meta ? meta.content : null,
      destination_country: country ? country.content : null,
      category: category ? category.content : null,
      price: price ? parseFloat(price.content) : null,
      currency: 'USD',
    };
  }

  // ── 1. WhatsApp clicks ────────────────────────────────────────────
  function initWhatsAppTracking() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"]'
      );
      if (!link) return;

      var programMeta = getProgramMeta();
      var pageMeta = getPageMeta();

      // Inferir button_location por clases CSS
      var location = 'general';
      if (link.classList.contains('wa-float')) location = 'floating_button';
      else if (link.classList.contains('btn-wa')) location = 'program_card';
      else if (link.closest('.hero')) location = 'hero';
      else if (link.closest('footer')) location = 'footer';
      else if (link.closest('.circuit-cta') || link.closest('.circuit-card')) location = 'waiting_list';

      // Fallback: si la página no tiene meta program-name,
      // leer el nombre desde la tarjeta del circuito (Originals en index)
      var programName = programMeta.program_name;
      if (!programName) {
        var card = link.closest('.circuit');
        var nameEl = card ? card.querySelector('.circuit-name') : null;
        if (nameEl) programName = nameEl.textContent.trim();
      }

      trackEvent('click_whatsapp', {
        button_location: location,
        page_path: pageMeta.page_path,
        page_title: pageMeta.page_title,
        destination_country: programMeta.destination_country,
        program_name: programName,
        language: pageMeta.language,
      });
    });
  }

  // ── 2. Formulario cotizar / contacto ──────────────────────────────
  function initFormTracking() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      // Solo disparar si no hay campos inválidos
      var invalid = form.querySelectorAll(':invalid');
      if (invalid.length > 0) return;

      var programMeta = getProgramMeta();
      var pageMeta = getPageMeta();
      var formName = form.dataset.formName || 'contact_form';

      trackEvent('generate_lead', {
        form_name: formName,
        program_name: programMeta.program_name,
        destination_country: programMeta.destination_country,
        page_path: pageMeta.page_path,
        language: pageMeta.language,
      });
    });
  }

  // ── 3. Vista de programa turístico ────────────────────────────────
  function initViewItemTracking() {
    var programMeta = getProgramMeta();
    if (!programMeta.program_name) return; // Solo en páginas de programas

    var pageMeta = getPageMeta();

    trackEvent('view_item', {
      program_name: programMeta.program_name,
      destination_country: programMeta.destination_country,
      category: programMeta.category,
      price: programMeta.price,
      currency: programMeta.currency,
      page_path: pageMeta.page_path,
    });
  }

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    initWhatsAppTracking();
    initFormTracking();
    initViewItemTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
