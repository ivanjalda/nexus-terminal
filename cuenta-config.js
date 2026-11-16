/* Configuración de las cuentas de Nexus Terminal.
   Para activar el registro: pega aquí los datos de tu proyecto de Firebase (los 6 datos de "firebaseConfig").
   Mientras "apiKey" esté vacío, el registro está dormido: el botón de Telegram abre directo y no se bloquea nada. */
window.NT_CFG = {
  fb: { apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: "" },
  tgEs: "https://t.me/nexus_terminal_Alerts",   // canal en español
  tgEn: "",                                      // canal en inglés (cuando lo crees, pega aquí su enlace)
  formEs: "",                                    // formulario de Brevo (lista en español): dirección "action" del formulario
  formEn: "",                                    // formulario de Brevo (lista en inglés)
  emailField: "EMAIL",                           // nombre del campo del correo en el formulario de Brevo
  lock: { map: true, az: true, cmp: true, csv: true }   // qué se pide registrarse para ver (pon false para dejarlo libre)
};
