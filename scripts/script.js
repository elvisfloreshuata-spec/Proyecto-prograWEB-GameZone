const SESSION_KEY = 'gamezone_session';

const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  const abierto = nav.classList.toggle('open');
  toggle.classList.toggle('open', abierto);
  toggle.setAttribute('aria-expanded', abierto);
});

// Si hay sesión, el botón muestra el usuario en vez de "Registrarse"
try {
  const sesion = JSON.parse(localStorage.getItem(SESSION_KEY));
  const btn = document.querySelector('.btn-registro');

  if (sesion && btn) {
    btn.textContent = sesion.usuario;
    btn.href = '#';
  }
} catch {}
