window.NT_CFG = {
  fb: {
    apiKey: "AIzaSyCQ5szK3P5Ea3CkZvs0ZuhZBckrLsHyL7w",
    authDomain: "nexus-terminal-610f7.firebaseapp.com",
    projectId: "nexus-terminal-610f7",
    storageBucket: "nexus-terminal-610f7.firebasestorage.app",
    messagingSenderId: "65639081869",
    appId: "1:65639081869:web:5a8ace275351f8d200bfc4"
  },
  tgEs: "https://t.me/nexus_terminal_Alerts",
  tgEn: "https://t.me/nexus_terminal_Alerts_EN",
  formEs: "https://ab17eabe.sibforms.com/serve/MUIFADedeDwkRm4ScGfQH1vjbcZD708StzJWu5QY2WGMG57oQzM54U-c7WEbi67SWuG6hxL6bUpr6Xu03d6rCllX7JGLjlFkgoxwzxVOYnQSU9Adxju2M5_a_5iA-sWK9Wa_NsX8Psv3OAtwqFqJexskviKdL3deL3KOG9ckEM_gVEbltE84YrDpZF0JJ5SegbzFFMO0ER5jv7cgJA==",
  formEn: "https://ab17eabe.sibforms.com/serve/MUIFADtlYU7K7RqgqUuG9MmjzUw9448gMZih2A96FDVfRLbxk5to3tdz00t4Kk-Kn0vVjhJ-FCgNZ1alsYxgziCGh-iS4LH2woWcdEXcpTLY2NVefJkiTxvjqTW_uLYpAXE1ye0s3HJxCpC-EZWtXroLNKc-AeZiDt-ZC9zB5VxAQOUAH_Ljov0RnnomSXIxrx6pGZn4fInobKweOA==",
  emailField: "EMAIL",
  lock: { map: true, az: true, cmp: true, csv: true }
};

/* Enlace directo al plan Pro: espacio.html#pro o ?pro lleva a la tarjeta Suscribirme a Pro */ (function () { if (!/#pro\b|[?&]pro\b/.test(location.href)) return; var n = 0; var t = setInterval(function () { var a = document.querySelector('a.nt-pro'); n++; if (a && a.offsetParent) { clearInterval(t); var box = a.closest('section,article,div') || a; box.scrollIntoView({ behavior: 'smooth', block: 'center' }); a.style.boxShadow = '0 0 0 3px #d4af37'; } else if (n > 40) clearInterval(t); }, 250); })();
