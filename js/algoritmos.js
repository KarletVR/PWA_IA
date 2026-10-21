// Tabla de algoritmos con búsqueda, agregar, modificar y borrar (api/algoritmos.php).
const API = "api/algoritmos.php";
const $ = id => document.getElementById(id);
const cuerpo = $("cuerpo-algoritmos"), aviso = $("aviso-algoritmos"), buscar = $("buscar"),
      form = $("form-algoritmo"), titulo = $("titulo-form"), btnCancelar = $("cancelar");
let datos = [];

function mensaje(texto, error) {
  aviso.hidden = !texto;
  aviso.textContent = texto || "";
  aviso.className = "aviso " + (error ? "error" : "ok");
}

// Normaliza para buscar sin importar mayúsculas ni acentos.
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function pintar() {
  const q = norm(buscar.value.trim());
  const lista = datos.filter(a => !q || norm([a.id, a.nombre, a.descripcion, a.tipo].join(" ")).includes(q));
  cuerpo.innerHTML = "";
  if (!lista.length) {
    cuerpo.innerHTML = '<tr><td colspan="5">No se encontraron algoritmos.</td></tr>';
  }
  lista.forEach(a => {
    const tr = document.createElement("tr");
    [a.id, a.nombre, a.descripcion, a.tipo].forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;                     // textContent evita inyectar HTML
      tr.appendChild(td);
    });
    const acc = document.createElement("td");
    acc.className = "acciones";
    const b1 = document.createElement("button");
    b1.textContent = "Modificar"; b1.className = "btn peq";
    b1.onclick = () => editar(a);
    const b2 = document.createElement("button");
    b2.textContent = "Borrar"; b2.className = "btn peq rojo";
    b2.onclick = () => borrar(a);
    acc.append(b1, b2);
    tr.appendChild(acc);
    cuerpo.appendChild(tr);
  });
  $("contador").textContent = `${lista.length} de ${datos.length} algoritmos`;
  $("tipos").innerHTML = [...new Set(datos.map(a => a.tipo))].map(t => `<option value="${t.replace(/"/g, "&quot;")}">`).join("");
}

// ---------- Capa de datos ----------
// Modo "servidor": usa api/algoritmos.php + MySQL (XAMPP).
// Modo "local": si no hay PHP/MySQL (p. ej. GitHub Pages), guarda en este navegador.
let modo = "servidor";
const LS = "algoritmos_busqueda_bd";

async function pedir(metodo, cuerpoJson) {
  let r;
  try {
    r = await fetch(API, { method: metodo, headers: { "Content-Type": "application/json" },
                           body: cuerpoJson ? JSON.stringify(cuerpoJson) : undefined });
  } catch (_) {
    throw new Error("Sin conexión: no se pudo completar la acción.");
  }
  let j;
  try { j = await r.json(); } catch (_) { j = null; }
  if (j === null) throw new Error("NO_SERVIDOR");
  if (!r.ok) throw new Error(j.error || "Error del servidor (" + r.status + ")");
  return j;
}

const leerLocal = () => {
  try { const g = JSON.parse(localStorage.getItem(LS)); if (Array.isArray(g)) return g; } catch (_) {}
  return JSON.parse(JSON.stringify(DATOS_INICIALES));
};
const guardarLocal = l => { try { localStorage.setItem(LS, JSON.stringify(l)); } catch (_) { throw new Error("No se pudo guardar en este navegador."); } };

function localOp(metodo, d) {
  const l = leerLocal();
  const dup = (n, id) => l.some(a => a.id !== id && norm(a.nombre.trim()) === norm(n.trim()));
  if (metodo === "GET") return l;
  if (metodo === "DELETE") {
    if (!l.some(a => a.id === d.id)) throw new Error("Ese algoritmo ya no existe");
    guardarLocal(l.filter(a => a.id !== d.id)); return { mensaje: "Algoritmo borrado" };
  }
  const nombre = d.nombre.trim(), descripcion = d.descripcion.trim(), tipo = d.tipo.trim();
  if (!nombre || !descripcion || !tipo) throw new Error("Nombre, descripción y tipo son obligatorios");
  if (metodo === "POST") {
    if (dup(nombre, 0)) throw new Error(`Ya existe un algoritmo llamado «${nombre}»`);
    l.push({ id: Math.max(0, ...l.map(a => a.id)) + 1, nombre, descripcion, tipo });
    guardarLocal(l); return { mensaje: "Algoritmo agregado" };
  }
  if (dup(nombre, d.id)) throw new Error(`Ya existe otro algoritmo llamado «${nombre}»`);
  Object.assign(l.find(a => a.id === d.id) || {}, { nombre, descripcion, tipo });
  guardarLocal(l); return { mensaje: "Algoritmo modificado" };
}

async function datosOp(metodo, d) {
  if (modo === "local") return localOp(metodo, d);
  return pedir(metodo, d);
}

async function cargar() {
  try {
    datos = await datosOp("GET");
    if (modo === "local") mensaje("Modo sin servidor: no se encontró PHP/MySQL, los cambios se guardan solo en este navegador.", false);
    pintar();
  } catch (e) {
    if (e.message === "NO_SERVIDOR" || e.message.startsWith("Sin conexión")) {
      modo = "local"; return cargar();
    }
    mensaje("No se pudieron cargar los datos. Revisa que Apache y MySQL estén encendidos en XAMPP y que la base de datos esté importada.", true);
  }
}

function limpiarForm() {
  form.reset(); $("f-id").value = "";
  titulo.textContent = "Agregar algoritmo";
  $("guardar").textContent = "Agregar";
  btnCancelar.hidden = true;
}

function editar(a) {
  $("f-id").value = a.id; $("f-nombre").value = a.nombre;
  $("f-descripcion").value = a.descripcion; $("f-tipo").value = a.tipo;
  titulo.textContent = "Modificar algoritmo #" + a.id;
  $("guardar").textContent = "Guardar cambios";
  btnCancelar.hidden = false;
  mensaje("");
  form.scrollIntoView({ behavior: "smooth", block: "center" });
  $("f-nombre").focus();
}

async function borrar(a) {
  if (!confirm(`¿Borrar «${a.nombre}»? Esta acción no se puede deshacer.`)) return;
  try {
    const j = await datosOp("DELETE", { id: a.id });
    await cargar(); mensaje(j.mensaje, false);
  } catch (e) { mensaje(e.message, true); }
}

form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const cuerpoJson = { nombre: $("f-nombre").value, descripcion: $("f-descripcion").value, tipo: $("f-tipo").value };
  const id = $("f-id").value;
  try {
    const j = id ? await datosOp("PUT", { id: +id, ...cuerpoJson }) : await datosOp("POST", cuerpoJson);
    limpiarForm();
    await cargar(); mensaje(j.mensaje, false);
  } catch (e) { mensaje(e.message, true); }   // aquí aparece el error de "ya existe"
});

btnCancelar.addEventListener("click", () => { limpiarForm(); mensaje(""); });
buscar.addEventListener("input", pintar);
cargar();
