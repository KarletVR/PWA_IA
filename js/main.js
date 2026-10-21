// Comportamientos comunes a todas las páginas.
// 1) Imagen que falte en /img: se oculta y el diseño no se rompe.
document.querySelectorAll("img[data-img]").forEach(i=>{
  const ocultar=()=>i.classList.add("sin-imagen");
  i.addEventListener("error",ocultar);
  if(i.complete&&i.naturalWidth===0)ocultar();
});
// 2) En celular, el menú se desplaza para mostrar la sección activa.
const act=document.querySelector(".nav a.activo");
if(act)act.scrollIntoView({inline:"center",block:"nearest"});
// 3) Registro del Service Worker (PWA).
if("serviceWorker" in navigator)
  addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(e=>console.error("SW:",e)));
