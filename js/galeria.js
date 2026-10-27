/* ============================================================
   GALERÍA — Carrusel profesional (CBTis 260 | IA)
   ------------------------------------------------------------
   CÓMO AGREGAR O CAMBIAR IMÁGENES:
   1. Guarda la foto en la carpeta  imagenes/
   2. Agrega una línea en la lista FOTOS (sección 1 de este archivo)
   3. Sube la versión en sw.js (v4 → v5) para que la PWA se actualice
   ============================================================ */
(() => {
  "use strict";

  /* ----------------------------------------------------------
     1. CONFIGURACIÓN
     ---------------------------------------------------------- */
  const DURACION = 5000;          // milisegundos que se muestra cada imagen
  const RUTA     = "imagenes/";   // carpeta donde están las fotos

  // Categorías (los filtros se generan solos con esta lista)
  const CATEGORIAS = ["Fundamentos", "Lenguaje y creatividad", "Datos y visión", "Aplicaciones", "Ética y futuro"];

  // Cada foto: archivo, categoría (posición en CATEGORIAS), título y descripción.
  const FOTOS = [
    // --- Fundamentos (0) ---
    { f: "inteligencia-artificial.jpg",        c: 0, t: "Inteligencia Artificial",      d: "Sistemas capaces de aprender, razonar y tomar decisiones a partir de grandes cantidades de datos." },
    { f: "portada-nteligencia-artificial.jpg", c: 0, t: "La IA en nuestras manos",      d: "Una tecnología al alcance de todos que usamos, muchas veces sin notarlo, todos los días." },
    { f: "red-neuronal.jpg",                   c: 0, t: "Redes neuronales",             d: "Modelos inspirados en el cerebro humano: capas de neuronas artificiales que detectan patrones." },
    { f: "machine-learning.jpg",               c: 0, t: "Aprendizaje automático",       d: "Algoritmos que mejoran con la experiencia: aprenden de ejemplos en lugar de seguir reglas fijas." },
    { f: "deep-learning.jpg",                  c: 0, t: "Aprendizaje profundo",         d: "Redes con muchas capas que reconocen voz, imágenes y textos con gran precisión." },
    { f: "modelo-ia.jpg",                      c: 0, t: "Modelos de IA",                d: "Un modelo es el resultado del entrenamiento: el «cerebro» que responde ante información nueva." },

    // --- Lenguaje y creatividad (1) ---
    { f: "procesamiento-lenguaje-natural.jpg", c: 1, t: "Procesamiento del lenguaje natural", d: "Permite que las máquinas entiendan, interpreten y produzcan el lenguaje humano." },
    { f: "llm.jpg",                            c: 1, t: "Modelos de lenguaje (LLM)",    d: "Entrenados con enormes cantidades de texto, son la base de los asistentes conversacionales actuales." },
    { f: "ia-generativa.jpg",                  c: 1, t: "IA generativa",                d: "Crea contenido nuevo —texto, imágenes, música o código— a partir de una instrucción." },
    { f: "generacion-contenido.jpg",           c: 1, t: "Generación de contenido",      d: "Texto, audio e imagen producidos con IA para apoyar la creatividad, no para reemplazarla." },
    { f: "chatbot.jpg",                        c: 1, t: "Chatbots",                     d: "Programas que conversan con las personas para resolver dudas a cualquier hora del día." },
    { f: "asistente-virtual.jpg",              c: 1, t: "Asistentes virtuales",         d: "Organizan tareas, responden preguntas y se conectan con los dispositivos que usamos a diario." },

    // --- Datos y visión (2) ---
    { f: "big-data.jpg",                       c: 2, t: "Big Data",                     d: "Volúmenes enormes de información que la IA analiza para encontrar patrones y tendencias." },
    { f: "datos.jpg",                          c: 2, t: "Los datos, el combustible de la IA", d: "Sin datos de calidad no hay aprendizaje: mejores ejemplos significan mejores resultados." },
    { f: "entrenamiento.jpg",                  c: 2, t: "Entrenamiento de modelos",     d: "La revisión humana etiqueta los datos (positivo, negativo, neutral) para que el modelo aprenda." },
    { f: "ia-vision.jpg",                      c: 2, t: "Visión por computadora",       d: "Sistemas que «ven»: reconocen rostros, objetos y señales en fotos y video." },

    // --- Aplicaciones (3) ---
    { f: "ia-medicina.jpg",                    c: 3, t: "IA en la medicina",            d: "Apoya el diagnóstico por imagen, el análisis de estudios y el descubrimiento de nuevos medicamentos." },
    { f: "ia-industria.jpg",                   c: 3, t: "IA en la industria",           d: "Robots y sensores inteligentes que optimizan la producción y previenen fallas en las máquinas." },
    { f: "ia-educacion.jpg",                   c: 3, t: "IA en la educación",           d: "Tutores virtuales y rutas de aprendizaje personalizadas para cada estudiante." },
    { f: "ia-empresas.jpg",                    c: 3, t: "IA en las empresas",           d: "Análisis de ventas, atención al cliente y decisiones basadas en datos." },
    { f: "ia-entretenimiento.jpg",             c: 3, t: "IA en el entretenimiento",     d: "Recomendaciones, videojuegos y experiencias de realidad virtual cada vez más inmersivas." },
    { f: "ia-transporte.jpg",                  c: 3, t: "IA en el transporte",          d: "Rutas inteligentes, tráfico optimizado y vehículos con asistencia a la conducción." },
    { f: "automatizacion.jpg",                 c: 3, t: "Automatización",               d: "Procesos repetitivos que se ejecutan solos para que las personas se enfoquen en tareas de mayor valor." },
    { f: "ia-vida.jpg",                        c: 3, t: "IA en la vida diaria",         d: "Del hogar al celular: la IA está presente en casi todo lo que usamos." },

    // --- Ética y futuro (4) ---
    { f: "ia-etica.jpg",                       c: 4, t: "Ética en la IA",               d: "Usarla con responsabilidad implica equidad, transparencia, privacidad y supervisión humana." },
    { f: "ia-futuro.jpg",                      c: 4, t: "El futuro de la IA",           d: "Nuevos retos y oportunidades que exigen formar personas críticas, creativas y preparadas." }
  ];

  /* ----------------------------------------------------------
     2. REFERENCIAS AL HTML
     ---------------------------------------------------------- */
  const $ = id => document.getElementById(id);
  const gal      = $("galeria");
  const stage    = $("gal-stage");
  const slidesEl = $("gal-slides");
  const thumbsEl = $("gal-thumbs");
  const filtrosEl= $("gal-filtros");
  const barra    = $("gal-progreso");
  const contador = $("gal-contador");
  const chip = $("gal-chip"), titulo = $("gal-titulo"), desc = $("gal-desc");
  const btnPlay = $("gal-play"), btnFs = $("gal-fs");
  if (!gal) return;               // por si el script se carga en otra página

  /* ----------------------------------------------------------
     3. ESTADO
     ---------------------------------------------------------- */
  let lista   = FOTOS.slice();    // fotos que se muestran (cambia con los filtros)
  let actual  = 0;                // posición de la foto visible
  let auto    = !matchMedia("(prefers-reduced-motion: reduce)").matches; // autoplay (apagado si el usuario prefiere menos movimiento)
  let slides = [], thumbs = [];   // elementos DOM creados
  // Motivos para pausar el progreso: mouse encima, pestaña oculta, galería fuera de pantalla
  const pausa = { mouse: false, oculta: false, fuera: false };

  barra.style.setProperty("--t", DURACION + "ms");

  /* ----------------------------------------------------------
     4. CONSTRUCCIÓN (diapositivas + miniaturas)
     ---------------------------------------------------------- */
  function construir() {
    slidesEl.textContent = "";
    thumbsEl.textContent = "";

    slides = lista.map((foto, n) => {
      // Diapositiva = fondo desenfocado + imagen principal
      const s = document.createElement("div");
      s.className = "gal-slide";
      s.setAttribute("role", "group");
      s.setAttribute("aria-roledescription", "diapositiva");
      s.setAttribute("aria-label", `${n + 1} de ${lista.length}`);
      const fondo = document.createElement("div");
      fondo.className = "gal-fondo";
      const img = document.createElement("img");
      img.alt = foto.t + ": " + foto.d;
      img.decoding = "async";
      // Si una foto no existe, se oculta sin romper el diseño
      img.addEventListener("error", () => { img.style.display = "none"; });
      s.append(fondo, img);
      slidesEl.appendChild(s);
      return s;
    });

    thumbs = lista.map((foto, n) => {
      // Miniatura = botón con la imagen pequeña
      const b = document.createElement("button");
      b.type = "button";
      b.className = "gal-thumb";
      b.setAttribute("aria-label", `Ver imagen ${n + 1}: ${foto.t}`);
      const img = document.createElement("img");
      img.src = RUTA + foto.f;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      b.appendChild(img);
      b.addEventListener("click", () => ir(n));
      thumbsEl.appendChild(b);
      return b;
    });
  }

  /* Carga la imagen real de una diapositiva solo cuando se necesita (ahorra datos) */
  function cargar(n) {
    const i = (n + lista.length) % lista.length;
    const img = slides[i].querySelector("img");
    if (!img.getAttribute("src")) {
      img.src = RUTA + lista[i].f;
      slides[i].querySelector(".gal-fondo").style.backgroundImage = `url("${RUTA + lista[i].f}")`;
    }
  }

  /* ----------------------------------------------------------
     5. NAVEGACIÓN
     ---------------------------------------------------------- */
  function ir(n) {
    actual = (n + lista.length) % lista.length;   // circular: después de la última vuelve a la primera

    slides.forEach((s, i) => {
      s.classList.toggle("activa", i === actual);
      s.setAttribute("aria-hidden", i === actual ? "false" : "true");
    });
    thumbs.forEach((t, i) => {
      t.classList.toggle("activa", i === actual);
      i === actual ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current");
    });

    cargar(actual); cargar(actual + 1); cargar(actual - 1);   // actual + vecinas

    // Panel de información y contador
    const foto = lista[actual];
    chip.textContent   = CATEGORIAS[foto.c];
    titulo.textContent = foto.t;
    desc.textContent   = foto.d;
    contador.textContent = String(actual + 1).padStart(2, "0") + " / " + String(lista.length).padStart(2, "0");

    // Centra la miniatura activa dentro de su tira (sin mover la página)
    const t = thumbs[actual];
    thumbsEl.scrollTo({ left: t.offsetLeft - (thumbsEl.clientWidth - t.offsetWidth) / 2, behavior: "smooth" });

    reiniciarProgreso();
  }
  const siguiente = () => ir(actual + 1);
  const anterior  = () => ir(actual - 1);

  /* ----------------------------------------------------------
     6. AUTOPLAY CON BARRA DE PROGRESO
     La barra se llena con una animación CSS; cuando termina
     ("animationend") se pasa a la siguiente imagen.
     ---------------------------------------------------------- */
  function reiniciarProgreso() {
    barra.classList.remove("corriendo");
    if (!auto) return;
    void barra.offsetWidth;                // fuerza reinicio de la animación
    barra.classList.add("corriendo");
  }
  barra.addEventListener("animationend", siguiente);

  function actualizarPausa() {
    gal.classList.toggle("pausa", pausa.mouse || pausa.oculta || pausa.fuera);
  }

  function alternarAuto() {
    auto = !auto;
    gal.classList.toggle("manual", !auto);
    btnPlay.setAttribute("aria-pressed", String(!auto));
    btnPlay.setAttribute("aria-label", auto ? "Pausar reproducción automática" : "Reanudar reproducción automática");
    reiniciarProgreso();
  }

  /* ----------------------------------------------------------
     7. FILTROS POR CATEGORÍA
     ---------------------------------------------------------- */
  function crearFiltros() {
    const opciones = [{ nombre: "Todas", cat: null }].concat(CATEGORIAS.map((nombre, cat) => ({ nombre, cat })));
    opciones.forEach((o, k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "gal-filtro";
      b.setAttribute("aria-pressed", String(k === 0));
      const cuantas = o.cat === null ? FOTOS.length : FOTOS.filter(x => x.c === o.cat).length;
      b.innerHTML = `${o.nombre}<small>${cuantas}</small>`;
      b.addEventListener("click", () => {
        filtrosEl.querySelectorAll(".gal-filtro").forEach(x => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        lista = o.cat === null ? FOTOS.slice() : FOTOS.filter(x => x.c === o.cat);
        construir();
        ir(0);
      });
      filtrosEl.appendChild(b);
    });
  }

  /* ----------------------------------------------------------
     8. EVENTOS
     ---------------------------------------------------------- */
  $("gal-prev").addEventListener("click", anterior);
  $("gal-next").addEventListener("click", siguiente);
  btnPlay.addEventListener("click", alternarAuto);

  // Pantalla completa (se oculta el botón si el navegador no la soporta, p. ej. iPhone)
  if (document.fullscreenEnabled) {
    btnFs.addEventListener("click", () => {
      document.fullscreenElement ? document.exitFullscreen() : gal.requestFullscreen();
    });
  } else {
    btnFs.style.display = "none";
  }

  // Teclado: ← → cambian de imagen, Inicio / Fin saltan a la primera / última
  gal.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { siguiente(); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { anterior(); e.preventDefault(); }
    else if (e.key === "Home") { ir(0); e.preventDefault(); }
    else if (e.key === "End")  { ir(lista.length - 1); e.preventDefault(); }
  });

  // Deslizar con el dedo (solo si el movimiento es más horizontal que vertical)
  let x0 = 0, y0 = 0;
  stage.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? siguiente() : anterior();
  }, { passive: true });

  // Pausas automáticas: mouse encima, pestaña oculta, galería fuera de pantalla
  gal.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") { pausa.mouse = true;  actualizarPausa(); } });
  gal.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") { pausa.mouse = false; actualizarPausa(); } });
  document.addEventListener("visibilitychange", () => { pausa.oculta = document.hidden; actualizarPausa(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { pausa.fuera = !en.isIntersecting; actualizarPausa(); }, { threshold: 0.35 }).observe(gal);
  }

  /* ----------------------------------------------------------
     9. INICIO
     ---------------------------------------------------------- */
  crearFiltros();
  construir();
  if (!auto) { gal.classList.add("manual"); btnPlay.setAttribute("aria-pressed", "true"); }
  ir(0);
})();
