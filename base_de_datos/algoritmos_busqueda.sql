-- ============================================================
-- BASE DE DATOS: algoritmos_busqueda   (MySQL / MariaDB — XAMPP)
-- CBTis 260 | Inteligencia Artificial
--
-- CÓMO IMPORTARLA:
--   1. Enciende Apache y MySQL en el panel de XAMPP.
--   2. Abre http://localhost/phpmyadmin
--   3. Pestaña "Importar" → elige este archivo → botón "Importar".
--      (no hace falta crear la base antes: este archivo la crea)
--
-- OJO: si la tabla "algoritmos" ya existe, este archivo la BORRA
-- y la vuelve a crear con los 25 algoritmos originales.
-- ============================================================

CREATE DATABASE IF NOT EXISTS algoritmos_busqueda
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE algoritmos_busqueda;

DROP TABLE IF EXISTS algoritmos;

-- UNIQUE en "nombre": evita repetidos. Con la colación _unicode_ci tampoco
-- distingue mayúsculas ni acentos ("Busqueda" = "Búsqueda"), igual que el
-- modo sin servidor del sitio. La API (api/algoritmos.php) responde
-- "Ya existe un algoritmo..." cuando MySQL rechaza un duplicado.
CREATE TABLE algoritmos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT         NOT NULL,
  tipo        VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_algoritmos_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO algoritmos (id, nombre, descripcion, tipo) VALUES
  (1, 'Búsqueda local',
   'Trabaja con un solo estado actual (o unos pocos) y se mueve a estados vecinos mejores, sin guardar el camino recorrido. Usa poca memoria y sirve para problemas de optimización.',
   'Tipo de búsqueda'),
  (2, 'Búsqueda ciega (no informada)',
   'No tiene ninguna pista sobre qué tan cerca está la meta; solo genera sucesores y comprueba si llegó a ella. Los algoritmos se diferencian por el orden en que revisan los nodos.',
   'Tipo de búsqueda'),
  (3, 'Búsqueda heurística (informada)',
   'Usa una función heurística h(n) que estima qué tan cerca está un estado de la meta, para revisar primero las opciones más prometedoras y llegar más rápido que la búsqueda ciega.',
   'Tipo de búsqueda'),
  (4, 'Búsqueda genética (algoritmos genéticos)',
   'Método de búsqueda y optimización inspirado en la evolución: maneja una población de soluciones que mejora con selección, cruce y mutación a lo largo de varias generaciones.',
   'Tipo de búsqueda'),
  (5, 'Ascenso de colinas (hill climbing)',
   'Parte de un estado y se mueve siempre al vecino con mejor valor, deteniéndose cuando ninguno mejora; puede quedar atrapado en óptimos locales.',
   'Local'),
  (6, 'Ascenso de colinas con reinicio aleatorio',
   'Repite el ascenso de colinas desde distintos estados iniciales generados al azar y se queda con el mejor resultado, para reducir el riesgo de quedar atrapado en un óptimo local.',
   'Local'),
  (7, 'Temple simulado',
   'Variante del ascenso de colinas que acepta ocasionalmente movimientos peores, con una probabilidad que disminuye con el tiempo, para escapar de óptimos locales.',
   'Local'),
  (8, 'Búsqueda local en haz',
   'Mantiene k estados a la vez; en cada paso genera los sucesores de todos y conserva los k mejores, de modo que los estados comparten información.',
   'Local'),
  (9, 'Búsqueda en anchura (BFS)',
   'Expande todos los nodos de un nivel antes de pasar al siguiente. Es completa y óptima cuando todas las acciones tienen el mismo costo, pero consume mucha memoria.',
   'No informada'),
  (10, 'Búsqueda en profundidad (DFS)',
   'Expande siempre el nodo más profundo y retrocede al llegar a un callejón sin salida. Usa poca memoria, pero no garantiza encontrar la solución óptima.',
   'No informada'),
  (11, 'Búsqueda de costo uniforme',
   'Expande el nodo con menor costo acumulado desde el origen. Es óptima cuando los costos de las acciones son positivos.',
   'No informada'),
  (12, 'Búsqueda de profundidad limitada',
   'Es una búsqueda en profundidad con un límite máximo de profundidad, que evita caminos infinitos pero puede no hallar soluciones más profundas.',
   'No informada'),
  (13, 'Profundización iterativa',
   'Ejecuta búsquedas de profundidad limitada con límites crecientes; combina el bajo uso de memoria de DFS con la completitud de BFS.',
   'No informada'),
  (14, 'Búsqueda bidireccional',
   'Lanza dos búsquedas simultáneas, una desde el estado inicial y otra desde la meta, hasta que se encuentran en un punto intermedio.',
   'No informada'),
  (15, 'Búsqueda voraz primero el mejor',
   'Expande el nodo que parece más cercano a la meta según una función heurística h(n). Es rápida, pero no es completa ni óptima en general.',
   'Informada (heurística)'),
  (16, 'A* (A estrella)',
   'Evalúa los nodos con f(n) = g(n) + h(n), es decir, costo recorrido más costo estimado restante. Es completa y óptima si la heurística es admisible.',
   'Informada (heurística)'),
  (17, 'IDA* (A* con profundización iterativa)',
   'Aplica la idea de la profundización iterativa a A*: en lugar de un límite de profundidad usa un límite de valor f(n), con lo que necesita mucha menos memoria que A*.',
   'Informada (heurística)'),
  (18, 'Búsqueda secuencial (lineal)',
   'Recorre los elementos de una lista uno por uno hasta hallar el buscado o llegar al final. No exige datos ordenados. Complejidad O(n).',
   'Estructuras de datos'),
  (19, 'Búsqueda binaria',
   'Divide repetidamente a la mitad un arreglo ordenado, compara con el elemento central y descarta la mitad donde no puede estar el valor. Complejidad O(log n).',
   'Estructuras de datos'),
  (20, 'Búsqueda por interpolación',
   'Variante de la búsqueda binaria que estima la posición probable del valor según su magnitud; funciona mejor con datos ordenados y distribuidos de forma uniforme.',
   'Estructuras de datos'),
  (21, 'Búsqueda por saltos',
   'Avanza por bloques de tamaño fijo (aprox. √n) en un arreglo ordenado y luego realiza una búsqueda lineal dentro del bloque donde podría estar el valor.',
   'Estructuras de datos'),
  (22, 'Búsqueda por dispersión (hash)',
   'Aplica una función hash a la clave para calcular directamente la posición del elemento en una tabla. Complejidad promedio cercana a O(1).',
   'Estructuras de datos'),
  (23, 'Búsqueda en árbol binario de búsqueda',
   'Parte de la raíz y, según la comparación con cada nodo, desciende por la rama izquierda o derecha. Es eficiente (O(log n)) si el árbol está equilibrado.',
   'Estructuras de datos'),
  (24, 'Minimax',
   'Recorre el árbol de un juego de dos jugadores suponiendo que cada uno elige la mejor jugada posible; maximiza la ganancia propia y minimiza la del oponente.',
   'Adversaria'),
  (25, 'Poda alfa-beta',
   'Optimiza Minimax descartando ramas que no pueden influir en la decisión final, lo que permite explorar más profundamente en el mismo tiempo.',
   'Adversaria');
