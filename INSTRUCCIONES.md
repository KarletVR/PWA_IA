# Sitio IA — CBTis 260

Incluye la **Galería** y el apartado **Algoritmos de búsqueda** (con base de datos).

## Opción A — Con base de datos real (XAMPP)

1. Abre el panel de **XAMPP** y enciende **Apache** y **MySQL**.
2. Copia **toda esta carpeta** dentro de `C:\xampp\htdocs\` (por ejemplo `C:\xampp\htdocs\PWA_IA\`).
3. Abre **http://localhost/phpmyadmin** → pestaña **Importar** → elige
   `base_de_datos/algoritmos_busqueda.sql` → botón **Importar**.
   (El archivo crea la base `algoritmos_busqueda`, la tabla `algoritmos` y los 25 registros.)
4. Entra a **http://localhost/PWA_IA/** y abre **Algoritmos de búsqueda** en el menú.

> Importante: ábrelo con `http://localhost/...`, **no** con doble clic al archivo
> (`file:///...`). Sin Apache, PHP no se ejecuta.

Si tu MySQL tiene contraseña, cámbiala en `api/algoritmos.php` (líneas `$usuario` y `$clave`).
Por defecto XAMPP usa usuario `root` y contraseña vacía.

## Opción B — Sin servidor (GitHub Pages, Netlify, doble clic…)

No necesitas hacer nada. Si la página no encuentra PHP/MySQL, cambia sola al
**modo sin servidor**: usa los mismos 25 algoritmos (`js/datos-iniciales.js`) y guarda
los cambios en el navegador de cada persona (`localStorage`). Aparece un aviso verde
que lo indica.

## Qué puedes hacer en Algoritmos de búsqueda

- **Buscar** por ID, nombre, descripción o tipo (sin importar mayúsculas ni acentos).
- **Agregar**, **Modificar** y **Borrar** algoritmos.
- No permite nombres repetidos: muestra "Ya existe un algoritmo llamado …".

## Estructura nueva

| Archivo | Para qué sirve |
|---|---|
| `algoritmos-busqueda.html` | Página con formulario y tabla |
| `js/algoritmos.js` | Lógica: búsqueda, alta, edición, borrado y cambio automático de modo |
| `js/datos-iniciales.js` | Los 25 algoritmos para el modo sin servidor |
| `api/algoritmos.php` | API (GET, POST, PUT, DELETE) que habla con MySQL |
| `base_de_datos/algoritmos_busqueda.sql` | Base de datos para importar en phpMyAdmin |
| `galeria.html`, `css/galeria.css`, `js/galeria.js` | Carrusel de imágenes |

## Después de cambiar archivos

Sube `VERSION` en `sw.js` (ahora `v7` → `v8`) para que la PWA ya instalada descargue
los archivos nuevos. Si no ves los cambios, recarga con **Ctrl + F5**.

## Nota de seguridad

La API no pide usuario ni contraseña: cualquiera que abra el sitio puede agregar,
modificar o borrar registros. Está bien para trabajo en clase con XAMPP; si algún día
lo publicas en internet con PHP, habría que agregarle un inicio de sesión.
