/* Nexus Terminal · cuentas de usuario (Firebase): Google o correo y contraseña, "Mi cuenta" con favoritos, bloqueo de secciones y avisos (Telegram y correo).
   Si cuenta-config.js no tiene claves de Firebase, todo queda dormido: el Telegram abre directo y nada se bloquea. */
(function () {
  var C = window.NT_CFG || {}, FB = C.fb || {}, ON = !!(FB.apiKey && FB.projectId);
  var EN = (document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0, LG = EN ? 'en' : 'es';
  var P = EN ? '../' : '';
  var T = EN ? {
    enter: 'Sign in', acc: 'My account', out: 'Sign out', create: 'Create account', login: 'Sign in', google: 'Continue with Google', or: 'or with email', mail: 'Email', pass: 'Password (min. 6 characters)', keep: 'Keep me signed in',
    forgot: 'I forgot my password', sent: 'We have sent you an email to reset your password.', bad: 'Wrong email or password.', exists: 'That email already has an account. Sign in instead.', weak: 'The password must have at least 6 characters.', err: 'Something went wrong. Try again.', soon: 'Registration will be available very soon.',
    tTg: 'Create your free account to join the channel', tLock: 'Create your free account to see this section', tGen: 'Your free account', pTg: 'Free, it takes a minute. Then you can join the Telegram channel.', pLock: 'Free, it takes a minute. You will unlock the heat map, the analyzer, the comparer and CSV export.', pGen: 'Free. Save your favorites and get the daily alerts.',
    favs: 'My favorites', nofav: 'No favorites yet. Star a stock in the Scanner and it will appear here.', tg: 'Join the Telegram channel', ml: 'Daily summary by email', mlp: 'The same content as the channel, every morning.', mlb: 'Subscribe', mlc: 'I agree to receive the daily summary and promotions of Valmont & Co. and Equity Intrinsic (Community16 LLC websites), and I have read the privacy policy. I can unsubscribe any time.', mlok: 'Almost done! Your subscription is NOT active yet. We sent an email to your address: open it and press the button "SÍ, SUSCRIBIRME A ESTA LISTA" ("Yes, subscribe me") to confirm. Check Spam or Promotions if you do not see it.', locked: 'Free with an account',
    close: 'Close', hi: 'Signed in as'
  } : {
    enter: 'Entrar', acc: 'Mi cuenta', out: 'Salir', create: 'Crear cuenta', login: 'Entrar', google: 'Continuar con Google', or: 'o con correo', mail: 'Correo electrónico', pass: 'Contraseña (mínimo 6 caracteres)', keep: 'Mantener la sesión iniciada',
    forgot: 'He olvidado mi contraseña', sent: 'Te hemos enviado un correo para restablecer la contraseña.', bad: 'Correo o contraseña incorrectos.', exists: 'Ese correo ya tiene cuenta. Entra con ella.', weak: 'La contraseña debe tener al menos 6 caracteres.', err: 'Algo ha fallado. Inténtalo otra vez.', soon: 'El registro estará disponible muy pronto.',
    tTg: 'Crea tu cuenta gratis para unirte al canal', tLock: 'Crea tu cuenta gratis para ver esta sección', tGen: 'Tu cuenta gratis', pTg: 'Es gratis y tarda un minuto. Después podrás unirte al canal de Telegram.', pLock: 'Es gratis y tarda un minuto. Desbloquearás el mapa de calor, el analizador, el comparador y la descarga en CSV.', pGen: 'Gratis. Guarda tus favoritos y recibe los avisos diarios.',
    favs: 'Mis favoritos', nofav: 'Aún no tienes favoritos. Marca una acción con la estrella en el Escáner y aparecerá aquí.', tg: 'Unirme al canal de Telegram', ml: 'Resumen diario por correo', mlp: 'El mismo contenido del canal, cada mañana.', mlb: 'Suscribirme', mlc: 'Acepto recibir cada día el resumen y las promociones de Valmont & Co. y Equity Intrinsic (webs de Community16 LLC), y he leído la política de privacidad. Puedo darme de baja cuando quiera.', mlok: '¡Casi listo! Tu suscripción todavía NO está activa. Te hemos enviado un correo: ábrelo y pulsa el botón «SÍ, SUSCRIBIRME A ESTA LISTA» para confirmar. Si no lo ves, mira en Spam o Promociones.', locked: 'Gratis con cuenta',
    close: 'Cerrar', hi: 'Sesión iniciada como'
  };
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var st = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; };
  var TG = function () { return (EN && C.tgEn) ? C.tgEn : (C.tgEs || 'https://t.me/nexus_terminal_Alerts'); };
  var A = window.NTAcc = { on: ON, user: null, open: open, tg: TG };

  /* ---- estilos ---- */
  var css = document.createElement('style');
  css.textContent = '.ntA{position:relative;display:inline-block}.ntAb{font:inherit;font-size:.82rem;font-weight:700;padding:7px 14px;border-radius:999px;border:1px solid var(--gold,#b8860b);background:var(--gold,#b8860b);color:#111;cursor:pointer;white-space:nowrap}.ntAb.on{background:transparent;color:var(--text,#1d1d1f)}'
    + '.ntAp{position:absolute;right:0;top:calc(100% + 8px);width:min(360px,92vw);background:var(--surface,#fff);color:var(--text,#1d1d1f);border:1px solid var(--border,#ddd);border-radius:14px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,.35);z-index:900;text-align:left;font-size:.88rem}.ntAp h4{margin:12px 0 6px;font-size:.9rem}.ntAp p{margin:4px 0;color:var(--muted,#6e6e73);font-size:.8rem}.ntAp ul{margin:0;padding:0;list-style:none;max-height:160px;overflow:auto}.ntAp li a{display:block;padding:5px 0;border-bottom:1px solid var(--border,#ddd);color:inherit;text-decoration:none;font-weight:600}'
    + '.ntM{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}.ntMc{background:var(--surface,#fff);color:var(--text,#1d1d1f);border:1px solid var(--border,#ddd);border-radius:18px;padding:26px;width:min(420px,100%);max-height:92vh;overflow:auto;position:relative}.ntMc h3{margin:0 0 6px;font-size:1.25rem}.ntMc p{margin:0 0 14px;color:var(--muted,#6e6e73);font-size:.9rem}'
    + '.ntMc input[type=email],.ntMc input[type=password],.ntAp input[type=email]{width:100%;box-sizing:border-box;padding:11px 12px;margin:0 0 8px;font:inherit;border:1px solid var(--border,#ccc);border-radius:10px;background:var(--bg,#fff);color:inherit}.ntMc .x{position:absolute;right:14px;top:10px;background:none;border:0;font-size:1.5rem;cursor:pointer;color:inherit}'
    + '.ntB{display:block;width:100%;box-sizing:border-box;padding:11px;margin:6px 0;font:inherit;font-weight:700;border-radius:10px;border:1px solid var(--gold,#b8860b);background:var(--gold,#b8860b);color:#111;cursor:pointer;text-align:center;text-decoration:none}.ntB.g{background:transparent;color:inherit;border-color:var(--border,#bbb)}.ntMc .sep{text-align:center;color:var(--muted,#6e6e73);font-size:.78rem;margin:10px 0}.ntMc .m,.ntAp .m{color:#d5392f;font-size:.82rem;min-height:1em;margin:4px 0}.ntMc label,.ntAp label{display:block;font-size:.76rem;color:var(--muted,#6e6e73);margin:6px 0}.ntMc .lk{font-size:.8rem;text-align:center;margin-top:10px}.ntMc .lk a{color:var(--gold,#b8860b);cursor:pointer}'
    + '.ntLock{position:relative}.ntLock>*{filter:blur(6px);pointer-events:none;user-select:none}.ntLock::after{content:attr(data-msg);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--gold,#b8860b);color:#111;font-weight:700;padding:10px 18px;border-radius:999px;cursor:pointer;white-space:nowrap}.ntLock{cursor:pointer}';
  document.head.appendChild(css);

  /* ---- Firebase (se carga solo si hay claves) ---- */
  var fb = null, fbP = null;
  function loadFb() {
    if (fbP) return fbP;
    var s = ['app', 'auth', 'firestore'].map(function (n) { return 'https://www.gstatic.com/firebasejs/10.12.2/firebase-' + n + '-compat.js'; });
    fbP = s.reduce(function (p, u) { return p.then(function () { return new Promise(function (ok, ko) { var e = document.createElement('script'); e.src = u; e.onload = ok; e.onerror = ko; document.head.appendChild(e); }); }); }, Promise.resolve())
      .then(function () { window.firebase.initializeApp(FB); fb = { auth: window.firebase.auth(), db: window.firebase.firestore() }; return fb; });
    return fbP;
  }

  /* ---- favoritos: la lista del Escáner (nt_watch) se sincroniza con la cuenta ---- */
  var WK = 'nt_watch', syncT = null;
  var wlGet = function () { try { return JSON.parse(st(WK) || '[]'); } catch (e) { return []; } };
  function pushFavs() {
    if (!A.user || !fb) return; clearTimeout(syncT);
    syncT = setTimeout(function () { fb.db.collection('users').doc(A.user.uid).set({ favs: wlGet(), email: A.user.email || '', lang: LG, actualizado: new Date().toISOString() }, { merge: true }).catch(function () {}); }, 800);
  }
  try { var _si = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { _si.apply(this, arguments); if (k === WK) pushFavs(); }; } catch (e) {}
  function pullFavs(u) {
    return fb.db.collection('users').doc(u.uid).get().then(function (d) {
      var remote = (d.exists && d.data().favs) || [], local = wlGet(), all = remote.concat(local.filter(function (x) { return remote.indexOf(x) < 0; }));
      if (JSON.stringify(all) !== JSON.stringify(local)) { st(WK, JSON.stringify(all)); if (!sessionStorage.getItem('ntFavReload') && $('#vbar')) { sessionStorage.setItem('ntFavReload', '1'); location.reload(); } }
      else pushFavs();
    }).catch(function () {});
  }

  /* ---- cabecera: botón Entrar / Mi cuenta ---- */
  var box = document.createElement('span'); box.className = 'ntA'; box.id = 'ntAcc';
  function placeBtn() { var ref = $('a[href$="como.html"]'); if (ref && ref.parentNode) { ref.parentNode.appendChild(box); return true; } return false; }
  function paintBtn() {
    box.innerHTML = '<button class="ntAb' + (A.user ? ' on' : '') + '" type="button" id="ntAbtn">' + (A.user ? '👤 ' + T.acc : T.enter) + '</button><div class="ntAp" id="ntAp" hidden></div>';
    $('#ntAbtn').onclick = function (e) { e.stopPropagation(); if (!A.user) { open('gen'); return; } var p = $('#ntAp'); if (p.hidden) panel(); p.hidden = !p.hidden; };
  }
  document.addEventListener('click', function (e) { var p = $('#ntAp'); if (p && !p.hidden && !box.contains(e.target)) p.hidden = true; });
  function panel() {
    var u = A.user, f = wlGet(), p = $('#ntAp'), form = C.formEs && !EN || C.formEn && EN ? (EN ? C.formEn : C.formEs) : '';
    p.innerHTML = '<p>' + T.hi + ' <b>' + esc(u.email || '') + '</b></p><h4>' + T.favs + '</h4>'
      + (f.length ? '<ul>' + f.map(function (k) { var m = k.split(':'); return '<li><a href="' + P + 'herramientas.html?m=' + encodeURIComponent(m[0]) + '&s=' + encodeURIComponent(m[1]) + '#comparador">⭐ ' + esc(m[1]) + ' <span style="font-weight:400;color:var(--muted)">' + esc(m[0]) + '</span></a></li>'; }).join('') + '</ul>' : '<p>' + T.nofav + '</p>')
      + '<h4>Telegram</h4><a class="ntB" href="' + TG() + '" target="_blank" rel="noopener">' + T.tg + '</a>'
      + (form ? '<h4>' + T.ml + '</h4><p>' + T.mlp + '</p><form id="ntMF" action="' + esc(form) + '" method="post"><input type="email" name="' + esc(C.emailField || 'EMAIL') + '" required value="' + esc(u.email || '') + '"><input type="hidden" name="locale" value="' + LG + '"><label><input type="checkbox" required> ' + T.mlc + '</label><button class="ntB" type="submit">' + T.mlb + '</button><div class="m" id="ntMFm"></div></form>' : '')
      + '<button class="ntB g" type="button" id="ntOut">' + T.out + '</button>';
    $('#ntOut').onclick = function () { fb.auth.signOut(); $('#ntAp').hidden = true; };
    var mf = $('#ntMF'); if (mf) mf.onsubmit = function (e) { e.preventDefault(); fetch(mf.action, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(mf)).toString() }).then(function () { mf.innerHTML = '<div style="border:2px solid #d4a72c;border-radius:10px;padding:14px;background:rgba(212,167,44,.12);line-height:1.5"><b>✉️ ' + T.mlok + '</b></div>'; }).catch(function () { $('#ntMFm').textContent = T.err; }); };
  }

  /* ---- ventana de registro / entrada ---- */
  var modal = null, mode = 'create', why = 'gen', after = null;
  function close() { if (modal) { modal.remove(); modal = null; } }
  function open(w, cb) {
    why = w || 'gen'; after = cb || null; close();
    if (!ON) { modal = box2('<h3>' + T.tGen + '</h3><p>' + T.soon + '</p>'); return; }
    loadFb().then(draw);
  }
  function box2(inner) { var m = document.createElement('div'); m.className = 'ntM'; m.innerHTML = '<div class="ntMc"><button class="x" type="button" aria-label="' + T.close + '">×</button>' + inner + '</div>'; m.onclick = function (e) { if (e.target === m) close(); }; $('.x', m).onclick = close; document.body.appendChild(m); return m; }
  function draw() {
    close();
    var t = why === 'tg' ? [T.tTg, T.pTg] : why === 'lock' ? [T.tLock, T.pLock] : [T.tGen, T.pGen];
    modal = box2('<h3>' + t[0] + '</h3><p>' + t[1] + '</p><button class="ntB g" type="button" id="ntG">' + T.google + '</button><div class="sep">' + T.or + '</div>'
      + '<input type="email" id="ntE" placeholder="' + T.mail + '" autocomplete="email"><input type="password" id="ntPw" placeholder="' + T.pass + '" autocomplete="' + (mode === 'create' ? 'new-password' : 'current-password') + '">'
      + '<label><input type="checkbox" id="ntK" checked> ' + T.keep + '</label><div class="m" id="ntMsg"></div><button class="ntB" type="button" id="ntGo">' + (mode === 'create' ? T.create : T.login) + '</button>'
      + '<div class="lk"><a id="ntSw">' + (mode === 'create' ? (EN ? 'I already have an account · Sign in' : 'Ya tengo cuenta · Entrar') : (EN ? 'Create a free account' : 'Crear cuenta gratis')) + '</a>' + (mode === 'login' ? ' · <a id="ntFg">' + T.forgot + '</a>' : '') + '</div>');
    var msg = function (s) { $('#ntMsg').textContent = s || ''; };
    var persist = function () { return fb.auth.setPersistence($('#ntK').checked ? window.firebase.auth.Auth.Persistence.LOCAL : window.firebase.auth.Auth.Persistence.SESSION); };
    var fail = function (e) { var c = (e && e.code) || ''; msg(/user-not-found|wrong-password|invalid-credential|invalid-email/.test(c) ? T.bad : /email-already/.test(c) ? T.exists : /weak/.test(c) ? T.weak : /popup-closed|cancelled/.test(c) ? '' : T.err); };
    $('#ntG').onclick = function () { persist().then(function () { return fb.auth.signInWithPopup(new window.firebase.auth.GoogleAuthProvider()); }).catch(fail); };
    $('#ntSw').onclick = function () { mode = mode === 'create' ? 'login' : 'create'; draw(); };
    if ($('#ntFg')) $('#ntFg').onclick = function () { var e = $('#ntE').value.trim(); if (!e) { msg(T.mail); return; } fb.auth.sendPasswordResetEmail(e).then(function () { msg(T.sent); }).catch(fail); };
    $('#ntGo').onclick = function () { var e = $('#ntE').value.trim(), p = $('#ntPw').value; if (!e || !p) { msg(T.mail + ' / ' + T.pass); return; } persist().then(function () { return mode === 'create' ? fb.auth.createUserWithEmailAndPassword(e, p) : fb.auth.signInWithEmailAndPassword(e, p); }).catch(fail); };
  }

  /* ---- bloqueos y avisos ---- */
  function guard(e, w) { if (!ON || A.user) return false; e.preventDefault(); e.stopPropagation(); open(w); return true; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-acc],a[href*="t.me/nexus_terminal"],#vbar button[data-v="map"],#vbar button[data-v="az"],#cb,#azc');
    if (!t) return;
    var k = t.getAttribute('data-acc'), L = C.lock || {};
    if (t.matches('a[href*="t.me/nexus_terminal"]')) { if (ON && !A.user) { guard(e, 'tg'); } else if (A.user && EN && C.tgEn) { e.preventDefault(); window.open(C.tgEn, '_blank', 'noopener'); } return; }
    if (k === 'signup' || k === 'login') { e.preventDefault(); if (A.user) { var b = $('#ntAbtn'); if (b) b.click(); } else { mode = k === 'login' ? 'login' : 'create'; open('gen'); } return; }
    if (t.id === 'cb' && L.cmp !== false) { guard(e, 'lock'); return; }
    if (t.id === 'azc' && L.csv !== false) { guard(e, 'lock'); return; }
    if (t.matches('#vbar button[data-v="map"]') && L.map !== false) { guard(e, 'lock'); return; }
    if (t.matches('#vbar button[data-v="az"]') && L.az !== false) { guard(e, 'lock'); return; }
  }, true);
  function marks() { // etiqueta "Gratis con cuenta" en lo que se bloquea
    if (!ON || A.user) { $$('.ntTag').forEach(function (x) { x.remove(); }); return; }
    var L = C.lock || {}; [['#vbar button[data-v="map"]', L.map], ['#vbar button[data-v="az"]', L.az]].forEach(function (p) { var b = $(p[0]); if (b && p[1] !== false && !b.querySelector('.ntTag')) b.insertAdjacentHTML('beforeend', ' <span class="ntTag" title="' + T.locked + '">🔒</span>'); });
  }

  /* ---- estado de la sesión ---- */
  function boot() {
    placeBtn(); paintBtn(); marks(); setInterval(marks, 1500);
    if (!ON) return;
    loadFb().then(function (f) { f.auth.onAuthStateChanged(function (u) { A.user = u || null; paintBtn(); marks(); if (u) { close(); pullFavs(u); if (after) { var a = after; after = null; a(); } if (why === 'tg') { why = 'gen'; modal = box2('<h3>' + (EN ? 'Account ready ✔' : 'Cuenta lista ✔') + '</h3><p>' + (EN ? 'You can now join the channel.' : 'Ya puedes unirte al canal.') + '</p><a class="ntB" href="' + TG() + '" target="_blank" rel="noopener">' + T.tg + '</a>'); } } }); }).catch(function () {});
  }
  // Tras confirmar en el correo, Brevo devuelve al usuario a la web con ?suscrito=1: se le da las gracias aquí mismo
  function gracias() {
    try { if (!/[?&]suscrito=1/.test(location.search)) return; } catch (e) { return; }
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:50%;top:80px;transform:translateX(-50%);z-index:99999;max-width:min(92vw,520px);background:#0b0f17;color:#fff;border:2px solid #d4a72c;border-radius:12px;padding:18px 22px;box-shadow:0 10px 40px rgba(0,0,0,.5);font:15px/1.5 system-ui,Arial,sans-serif;text-align:center';
    d.innerHTML = '<b style="font-size:17px;color:#d4a72c">' + (EN ? 'Thanks for subscribing!' : '¡Gracias por suscribirte!') + '</b><br>' + (EN ? 'Your subscription is confirmed. You will receive the daily summary in your email.' : 'Tu suscripción está confirmada. Recibirás el resumen diario en tu correo.') + '<br><button type="button" style="margin-top:10px;background:#d4a72c;color:#111;border:0;border-radius:8px;padding:8px 18px;font-weight:700;cursor:pointer">OK</button>';
    d.querySelector('button').onclick = function () { d.remove(); };
    document.body.appendChild(d); setTimeout(function () { try { d.remove(); } catch (e) {} }, 15000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); gracias(); }); else { boot(); gracias(); }
})();
