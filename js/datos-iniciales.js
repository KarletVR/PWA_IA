// Datos iniciales (los mismos del .sql) para el modo sin servidor.
const DATOS_INICIALES = [
 {
  "id": 1,
  "nombre": "Búsqueda local",
  "descripcion": "Trabaja con un solo estado actual (o unos pocos) y se mueve a estados vecinos mejores, sin guardar el camino recorrido. Usa poca memoria y sirve para problemas de optimización.",
  "tipo": "Tipo de búsqueda"
 },
 {
  "id": 2,
  "nombre": "Búsqueda ciega (no informada)",
  "descripcion": "No tiene ninguna pista sobre qué tan cerca está la meta; solo genera sucesores y comprueba si llegó a ella. Los algoritmos se diferencian por el orden en que revisan los nodos.",
  "tipo": "Tipo de búsqueda"
 },
 {
  "id": 3,
  "nombre": "Búsqueda heurística (informada)",
  "descripcion": "Usa una función heurística h(n) que estima qué tan cerca está un estado de la meta, para revisar primero las opciones más prometedoras y llegar más rápido que la búsqueda ciega.",
  "tipo": "Tipo de búsqueda"
 },
 {
  "id": 4,
  "nombre": "Búsqueda genética (algoritmos genéticos)",
  "descripcion": "Método de búsqueda y optimización inspirado en la evolución: maneja una población de soluciones que mejora con selección, cruce y mutación a lo largo de varias generaciones.",
  "tipo": "Tipo de búsqueda"
 },
 {
  "id": 5,
  "nombre": "Ascenso de colinas (hill climbing)",
  "descripcion": "Parte de un estado y se mueve siempre al vecino con mejor valor, deteniéndose cuando ninguno mejora; puede quedar atrapado en óptimos locales.",
  "tipo": "Local"
 },
 {
  "id": 6,
  "nombre": "Ascenso de colinas con reinicio aleatorio",
  "descripcion": "Repite el ascenso de colinas desde distintos estados iniciales generados al azar y se queda con el mejor resultado, para reducir el riesgo de quedar atrapado en un óptimo local.",
  "tipo": "Local"
 },
 {
  "id": 7,
  "nombre": "Temple simulado",
  "descripcion": "Variante del ascenso de colinas que acepta ocasionalmente movimientos peores, con una probabilidad que disminuye con el tiempo, para escapar de óptimos locales.",
  "tipo": "Local"
 },
 {
  "id": 8,
  "nombre": "Búsqueda local en haz",
  "descripcion": "Mantiene k estados a la vez; en cada paso genera los sucesores de todos y conserva los k mejores, de modo que los estados comparten información.",
  "tipo": "Local"
 },
 {
  "id": 9,
  "nombre": "Búsqueda en anchura (BFS)",
  "descripcion": "Expande todos los nodos de un nivel antes de pasar al siguiente. Es completa y óptima cuando todas las acciones tienen el mismo costo, pero consume mucha memoria.",
  "tipo": "No informada"
 },
 {
  "id": 10,
  "nombre": "Búsqueda en profundidad (DFS)",
  "descripcion": "Expande siempre el nodo más profundo y retrocede al llegar a un callejón sin salida. Usa poca memoria, pero no garantiza encontrar la solución óptima.",
  "tipo": "No informada"
 },
 {
  "id": 11,
  "nombre": "Búsqueda de costo uniforme",
  "descripcion": "Expande el nodo con menor costo acumulado desde el origen. Es óptima cuando los costos de las acciones son positivos.",
  "tipo": "No informada"
 },
 {
  "id": 12,
  "nombre": "Búsqueda de profundidad limitada",
  "descripcion": "Es una búsqueda en profundidad con un límite máximo de profundidad, que evita caminos infinitos pero puede no hallar soluciones más profundas.",
  "tipo": "No informada"
 },
 {
  "id": 13,
  "nombre": "Profundización iterativa",
  "descripcion": "Ejecuta búsquedas de profundidad limitada con límites crecientes; combina el bajo uso de memoria de DFS con la completitud de BFS.",
  "tipo": "No informada"
 },
 {
  "id": 14,
  "nombre": "Búsqueda bidireccional",
  "descripcion": "Lanza dos búsquedas simultáneas, una desde el estado inicial y otra desde la meta, hasta que se encuentran en un punto intermedio.",
  "tipo": "No informada"
 },
 {
  "id": 15,
  "nombre": "Búsqueda voraz primero el mejor",
  "descripcion": "Expande el nodo que parece más cercano a la meta según una función heurística h(n). Es rápida, pero no es completa ni óptima en general.",
  "tipo": "Informada (heurística)"
 },
 {
  "id": 16,
  "nombre": "A* (A estrella)",
  "descripcion": "Evalúa los nodos con f(n) = g(n) + h(n), es decir, costo recorrido más costo estimado restante. Es completa y óptima si la heurística es admisible.",
  "tipo": "Informada (heurística)"
 },
 {
  "id": 17,
  "nombre": "IDA* (A* con profundización iterativa)",
  "descripcion": "Aplica la idea de la profundización iterativa a A*: en lugar de un límite de profundidad usa un límite de valor f(n), con lo que necesita mucha menos memoria que A*.",
  "tipo": "Informada (heurística)"
 },
 {
  "id": 18,
  "nombre": "Búsqueda secuencial (lineal)",
  "descripcion": "Recorre los elementos de una lista uno por uno hasta hallar el buscado o llegar al final. No exige datos ordenados. Complejidad O(n).",
  "tipo": "Estructuras de datos"
 },
 {
  "id": 19,
  "nombre": "Búsqueda binaria",
  "descripcion": "Divide repetidamente a la mitad un arreglo ordenado, compara con el elemento central y descarta la mitad donde no puede estar el valor. Complejidad O(log n).",
  "tipo": "Estructuras de datos"
 },
 {
  "id": 20,
  "nombre": "Búsqueda por interpolación",
  "descripcion": "Variante de la búsqueda binaria que estima la posición probable del valor según su magnitud; funciona mejor con datos ordenados y distribuidos de forma uniforme.",
  "tipo": "Estructuras de datos"
 },
 {
  "id": 21,
  "nombre": "Búsqueda por saltos",
  "descripcion": "Avanza por bloques de tamaño fijo (aprox. √n) en un arreglo ordenado y luego realiza una búsqueda lineal dentro del bloque donde podría estar el valor.",
  "tipo": "Estructuras de datos"
 },
 {
  "id": 22,
  "nombre": "Búsqueda por dispersión (hash)",
  "descripcion": "Aplica una función hash a la clave para calcular directamente la posición del elemento en una tabla. Complejidad promedio cercana a O(1).",
  "tipo": "Estructuras de datos"
 },
 {
  "id": 23,
  "nombre": "Búsqueda en árbol binario de búsqueda",
  "descripcion": "Parte de la raíz y, según la comparación con cada nodo, desciende por la rama izquierda o derecha. Es eficiente (O(log n)) si el árbol está equilibrado.",
  "tipo": "Estructuras de datos"
 },
 {
  "id": 24,
  "nombre": "Minimax",
  "descripcion": "Recorre el árbol de un juego de dos jugadores suponiendo que cada uno elige la mejor jugada posible; maximiza la ganancia propia y minimiza la del oponente.",
  "tipo": "Adversaria"
 },
 {
  "id": 25,
  "nombre": "Poda alfa-beta",
  "descripcion": "Optimiza Minimax descartando ramas que no pueden influir en la decisión final, lo que permite explorar más profundamente en el mismo tiempo.",
  "tipo": "Adversaria"
 }
];
