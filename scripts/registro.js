const USERS_KEY = 'gamezone_users';
const form = document.getElementById('registroForm');

// ---------- localStorage ----------
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ---------- Validación ----------
function setError(input, msg) {
  const group = input.closest('.form__group');
  group.classList.toggle('form__group--invalid', !!msg); // <- cambió
  input.setAttribute('aria-invalid', !!msg);             // <- nuevo (accesibilidad)
  group.querySelector('.form__error').textContent = msg;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let ok = true;

  const usuario = form.usuario;
  const email = form.email;
  const pass = form.password;
  const pass2 = form.password2;
  const juego = form.juego;
  const terminos = document.getElementById('terminos');

  if (usuario.value.trim().length < 3) {
    setError(usuario, 'Mínimo 3 caracteres'); ok = false;
  } else setError(usuario, '');

  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    setError(email, 'Correo no válido'); ok = false;
  } else setError(email, '');

  if (pass.value.length < 8) {
    setError(pass, 'Mínimo 8 caracteres'); ok = false;
  } else setError(pass, '');

  if (pass2.value !== pass.value || !pass2.value) {
    setError(pass2, 'Las contraseñas no coinciden'); ok = false;
  } else setError(pass2, '');

  if (!juego.value) {
    setError(juego, 'Elige un juego'); ok = false;
  } else setError(juego, '');

  const errT = document.getElementById('errorTerminos');
  if (!terminos.checked) {
    errT.textContent = 'Debes aceptar los términos'; ok = false;
  } else errT.textContent = '';

  if (!ok) return;

  // ---------- Guardar en localStorage ----------
  const users = getUsers();
  const emailValor = email.value.trim().toLowerCase();
  const usuarioValor = usuario.value.trim();

  if (users.some(u => u.email === emailValor)) {
    setError(email, 'Este correo ya está registrado');
    return;
  }

  if (users.some(u => u.usuario.toLowerCase() === usuarioValor.toLowerCase())) {
    setError(usuario, 'Ese nombre de usuario ya existe');
    return;
  }

  const nuevo = {
    id: Date.now(),
    usuario: usuarioValor,
    email: emailValor,
    password: await hashPassword(pass.value),
    juego: juego.value,
    creadoEn: new Date().toISOString()
  };

  users.push(nuevo);
  saveUsers(users);

  // Sesión automática
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: nuevo.id,
    usuario: nuevo.usuario
  }));

  form.reset();
  window.location.href = 'index.html';
});