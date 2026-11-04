/* Banner de consentimiento de cookies · Landing Black Friday OneToro TV
   Se mide por defecto; si el usuario rechaza, se guarda en localStorage (ot_bf_consent) y se actualiza
   el modo de consentimiento de Google y el consentimiento del píxel de Meta. GTM lee la misma clave (variable "JS - Consentimiento Meta landing BF"). */
(function () {
  var KEY = 'ot_bf_consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 365; // se vuelve a preguntar a los 12 meses

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && c.ts && Date.now() - c.ts < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }
  function gtag() { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); }
  function apply(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (typeof window.fbq === 'function') window.fbq('consent', c.marketing ? 'grant' : 'revoke');
    window.dataLayer.push({ event: 'consent_update', consent_analytics: !!c.analytics, consent_marketing: !!c.marketing });
  }
  function save(analytics, marketing) {
    var c = { v: 1, analytics: !!analytics, marketing: !!marketing, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    apply(c);
    close();
  }

  var css = '' +
    '.otc{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:16px max(16px,env(safe-area-inset-right,0px)) calc(16px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));background:#141414;border-top:1px solid #FFE500;color:#fff;font-family:Poppins,system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 -20px 60px rgba(0,0,0,.6)}' +
    '.otc[hidden]{display:none!important}' +
    '.otc-in{max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center;justify-content:space-between}' +
    '.otc-txt{flex:1 1 420px;min-width:0;font-size:14px;line-height:1.55;color:#C9C9C9;margin:0}' +
    '.otc-txt strong{color:#fff}.otc a{color:#FFE500}' +
    '.otc-btns{display:flex;flex-wrap:wrap;gap:10px}' +
    '.otc button{min-height:44px;padding:0 18px;border-radius:999px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;border:1px solid #fff;background:transparent;color:#fff}' +
    '.otc button.otc-yes{background:#FFE500;border-color:#FFE500;color:#0A0A0A}' +
    '.otc button:focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '.otc-panel{flex:1 1 100%;display:flex;flex-direction:column;gap:10px;border-top:1px solid #262626;padding-top:14px}' +
    '.otc-row{display:flex;gap:12px;align-items:flex-start;font-size:14px;color:#C9C9C9;line-height:1.5}' +
    '.otc-row input{width:20px;height:20px;margin:2px 0 0;flex:0 0 auto;accent-color:#FFE500}' +
    '.otc-row strong{color:#fff;display:block}' +
    'body.otc-open .mobile-cta{display:none!important}';

  var root, panel;
  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    root = document.createElement('div');
    root.className = 'otc'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-live', 'polite'); root.setAttribute('aria-label', 'Preferencias de cookies');
    root.innerHTML =
      '<div class="otc-in">' +
        '<p class="otc-txt"><strong>Usamos cookies.</strong> Además de las técnicas, necesarias para que la web funcione, usamos cookies de análisis y publicidad de Google y Meta para medir las visitas y mejorar nuestras campañas. Puedes rechazarlas o elegir cuáles aceptas. Más información en la <a href="/cookies/">política de cookies</a>.</p>' +
        '<div class="otc-btns">' +
          '<button type="button" class="otc-cfg">Configurar</button>' +
          '<button type="button" class="otc-no">Rechazar</button>' +
          '<button type="button" class="otc-yes">Aceptar todas</button>' +
        '</div>' +
        '<div class="otc-panel" hidden>' +
          '<label class="otc-row"><input type="checkbox" checked disabled><span><strong>Técnicas (siempre activas)</strong>Necesarias para el funcionamiento de la web y del formulario.</span></label>' +
          '<label class="otc-row"><input type="checkbox" id="otc-an"><span><strong>Análisis</strong>Google Analytics: medir visitas e inscripciones.</span></label>' +
          '<label class="otc-row"><input type="checkbox" id="otc-mk"><span><strong>Publicidad</strong>Google Ads y Meta (Facebook e Instagram): medir y mejorar nuestros anuncios.</span></label>' +
          '<div class="otc-btns"><button type="button" class="otc-save">Guardar preferencias</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    panel = root.querySelector('.otc-panel');
    root.querySelector('.otc-yes').addEventListener('click', function () { save(true, true); });
    root.querySelector('.otc-no').addEventListener('click', function () { save(false, false); });
    root.querySelector('.otc-cfg').addEventListener('click', function () { panel.hidden = !panel.hidden; });
    root.querySelector('.otc-save').addEventListener('click', function () {
      save(root.querySelector('#otc-an').checked, root.querySelector('#otc-mk').checked);
    });
  }
  function open() {
    if (!root) build();
    var c = read();
    root.querySelector('#otc-an').checked = !c || c.analytics !== false;
    root.querySelector('#otc-mk').checked = !c || c.marketing !== false;
    root.hidden = false; document.body.classList.add('otc-open');
  }
  function close() { if (root) root.hidden = true; document.body.classList.remove('otc-open'); }

  window.otConsent = { open: open };
  function init() {
    document.querySelectorAll('[data-otc-open]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    if (!read()) open();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
