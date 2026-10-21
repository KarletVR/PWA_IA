<?php
// API de la tabla "algoritmos" (MySQL de XAMPP).
//   GET     -> lista todos
//   POST    -> agrega   {nombre, descripcion, tipo}
//   PUT     -> modifica {id, nombre, descripcion, tipo}
//   DELETE  -> borra    {id}
// Si tu MySQL tiene contraseña, cámbiala aquí:
$host = "localhost";
$usuario = "root";
$clave = "";
$bd = "algoritmos_busqueda";

header("Content-Type: application/json; charset=utf-8");
mysqli_report(MYSQLI_REPORT_OFF);

function responder($codigo, $datos) {
  http_response_code($codigo);
  echo json_encode($datos, JSON_UNESCAPED_UNICODE);
  exit;
}

$cx = @new mysqli($host, $usuario, $clave, $bd);
if ($cx->connect_errno) responder(500, ["error" => "No se pudo conectar a la base de datos"]);
$cx->set_charset("utf8mb4");

$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo === "GET") {
  $r = $cx->query("SELECT id, nombre, descripcion, tipo FROM algoritmos ORDER BY id");
  if (!$r) responder(500, ["error" => "No se pudo leer la tabla algoritmos"]);
  $filas = [];
  while ($f = $r->fetch_assoc()) { $f["id"] = (int)$f["id"]; $filas[] = $f; }
  responder(200, $filas);
}

$in = json_decode(file_get_contents("php://input"), true);
if (!is_array($in)) responder(400, ["error" => "Datos no válidos"]);

// Limpia y valida los campos de texto (para POST y PUT).
function campos($in) {
  $nombre = trim($in["nombre"] ?? "");
  $desc = trim($in["descripcion"] ?? "");
  $tipo = trim($in["tipo"] ?? "");
  if ($nombre === "" || $desc === "" || $tipo === "")
    responder(400, ["error" => "Nombre, descripción y tipo son obligatorios"]);
  if (mb_strlen($nombre) > 100) responder(400, ["error" => "El nombre no puede pasar de 100 caracteres"]);
  if (mb_strlen($tipo) > 50) responder(400, ["error" => "El tipo no puede pasar de 50 caracteres"]);
  return [$nombre, $desc, $tipo];
}

// ¿Ya existe otro algoritmo con ese nombre? (sin distinguir mayúsculas)
function existe($cx, $nombre, $excepto = 0) {
  $s = $cx->prepare("SELECT id FROM algoritmos WHERE nombre = ? AND id <> ? LIMIT 1");
  $s->bind_param("si", $nombre, $excepto);
  $s->execute();
  $s->store_result();
  return $s->num_rows > 0;
}

if ($metodo === "POST") {
  [$nombre, $desc, $tipo] = campos($in);
  if (existe($cx, $nombre)) responder(409, ["error" => "Ya existe un algoritmo llamado «$nombre»"]);
  $s = $cx->prepare("INSERT INTO algoritmos (nombre, descripcion, tipo) VALUES (?, ?, ?)");
  $s->bind_param("sss", $nombre, $desc, $tipo);
  if (!$s->execute()) responder($cx->errno === 1062 ? 409 : 500, ["error" => $cx->errno === 1062 ? "Ya existe un algoritmo con ese nombre" : "No se pudo agregar"]);
  responder(201, ["id" => $cx->insert_id, "mensaje" => "Algoritmo agregado"]);
}

if ($metodo === "PUT") {
  $id = (int)($in["id"] ?? 0);
  [$nombre, $desc, $tipo] = campos($in);
  if (existe($cx, $nombre, $id)) responder(409, ["error" => "Ya existe otro algoritmo llamado «$nombre»"]);
  $s = $cx->prepare("UPDATE algoritmos SET nombre = ?, descripcion = ?, tipo = ? WHERE id = ?");
  $s->bind_param("sssi", $nombre, $desc, $tipo, $id);
  if (!$s->execute()) responder($cx->errno === 1062 ? 409 : 500, ["error" => $cx->errno === 1062 ? "Ya existe un algoritmo con ese nombre" : "No se pudo modificar"]);
  responder(200, ["mensaje" => "Algoritmo modificado"]);
}

if ($metodo === "DELETE") {
  $id = (int)($in["id"] ?? 0);
  $s = $cx->prepare("DELETE FROM algoritmos WHERE id = ?");
  $s->bind_param("i", $id);
  if (!$s->execute()) responder(500, ["error" => "No se pudo borrar"]);
  if ($s->affected_rows === 0) responder(404, ["error" => "Ese algoritmo ya no existe"]);
  responder(200, ["mensaje" => "Algoritmo borrado"]);
}

responder(405, ["error" => "Método no permitido"]);
