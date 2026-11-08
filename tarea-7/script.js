// ===== Datos =====
let inventario = [
  { id: 1, nombre: "Taladro percutor 650W", categoria: "Herramientas", cantidad: 12, precio: 74.9, agotado: false },
  { id: 2, nombre: "Juego de llaves Allen", categoria: "Herramientas", cantidad: 40, precio: 8.5, agotado: false },
  { id: 3, nombre: "Cinta métrica 5 m", categoria: "Herramientas", cantidad: 0, precio: 4.25, agotado: true },
  { id: 4, nombre: "Cuaderno universitario", categoria: "Papelería", cantidad: 80, precio: 2.1, agotado: false },
  { id: 5, nombre: "Caja de marcadores", categoria: "Papelería", cantidad: 25, precio: 6.75, agotado: false },
  { id: 6, nombre: "Resma de papel carta", categoria: "Papelería", cantidad: 0, precio: 5.4, agotado: true },
  { id: 7, nombre: "Audífonos con cable", categoria: "Electrónica", cantidad: 18, precio: 12.99, agotado: false },
  { id: 8, nombre: "Cargador USB-C 20W", categoria: "Electrónica", cantidad: 30, precio: 15.0, agotado: false },
  { id: 9, nombre: "Batería externa 10000 mAh", categoria: "Electrónica", cantidad: 9, precio: 22.5, agotado: false }
];

let categoriaActual = "todas";

// ===== Referencias al DOM =====
const formulario = document.getElementById("formulario-producto");
const mensajeError = document.getElementById("mensaje-error");
const selectorFiltro = document.getElementById("filtro-categoria");
const cuerpoInventario = document.getElementById("cuerpo-inventario");
const mensajeVacio = document.getElementById("mensaje-vacio");
const indicadorProductos = document.getElementById("total-productos");
const indicadorUnidades = document.getElementById("total-unidades");
const indicadorValor = document.getElementById("valor-total");
const indicadorAgotados = document.getElementById("total-agotados");

// ===== Cierre para generar ids =====
function crearGeneradorId() {
  let contador = 100;
  return function () {
    contador++;
    return contador;
  };
}

const generarId = crearGeneradorId();

// ===== Cálculos =====
function calcularValorTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].cantidad * items[i].precio;
  }
  return total;
}

function contarUnidades(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].cantidad;
  }
  return total;
}

function contarAgotados(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].agotado) {
      total++;
    }
  }
  return total;
}

function contarPorCategoria(items) {
  const conteo = {};
  for (let i = 0; i < items.length; i++) {
    const categoria = items[i].categoria;
    if (conteo[categoria] === undefined) {
      conteo[categoria] = 1;
    } else {
      conteo[categoria]++;
    }
  }
  return conteo;
}

// ===== Construcción del DOM =====
function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearBoton(texto, clase, id) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.classList.add(clase);
  boton.setAttribute("data-id", id);
  return boton;
}

function crearFila(item) {
  const fila = document.createElement("tr");
  fila.classList.add(item.agotado ? "agotado" : "disponible");

  const subtotal = item.cantidad * item.precio;
  fila.appendChild(crearCelda(item.nombre));
  fila.appendChild(crearCelda(item.categoria));
  fila.appendChild(crearCelda(item.cantidad));
  fila.appendChild(crearCelda("$" + item.precio.toFixed(2)));
  fila.appendChild(crearCelda("$" + subtotal.toFixed(2)));
  fila.appendChild(crearCelda(item.agotado ? "Agotado" : "Disponible"));

  const celdaAcciones = crearCelda("");
  celdaAcciones.appendChild(crearBoton("Cambiar estado", "btn-estado", item.id));
  celdaAcciones.appendChild(crearBoton("Eliminar", "btn-eliminar", item.id));
  fila.appendChild(celdaAcciones);

  return fila;
}

function actualizarIndicadores(items) {
  // Los indicadores muestran los productos VISIBLES (los que cumplen el filtro actual).
  indicadorProductos.textContent = items.length;
  indicadorUnidades.textContent = contarUnidades(items);
  indicadorValor.textContent = calcularValorTotal(items).toFixed(2);
  indicadorAgotados.textContent = contarAgotados(items);
}

function renderizar(items) {
  cuerpoInventario.textContent = "";
  for (let i = 0; i < items.length; i++) {
    cuerpoInventario.appendChild(crearFila(items[i]));
  }
  actualizarIndicadores(items);
  mensajeVacio.hidden = items.length > 0;
}

// ===== Filtro =====
function filtrarPorCategoria(categoria) {
  const resultado = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].categoria === categoria) {
      resultado.push(inventario[i]);
    }
  }
  return resultado;
}

function obtenerItemsVisibles() {
  if (categoriaActual === "todas") {
    return inventario;
  }
  return filtrarPorCategoria(categoriaActual);
}

function renderizarVista() {
  renderizar(obtenerItemsVisibles());
}

function obtenerCategorias(items) {
  const categorias = [];
  for (let i = 0; i < items.length; i++) {
    if (!categorias.includes(items[i].categoria)) {
      categorias.push(items[i].categoria);
    }
  }
  return categorias;
}

function llenarSelector() {
  const categorias = obtenerCategorias(inventario);
  if (categoriaActual !== "todas" && !categorias.includes(categoriaActual)) {
    categoriaActual = "todas";
  }

  selectorFiltro.textContent = "";
  const opcionTodas = document.createElement("option");
  opcionTodas.value = "todas";
  opcionTodas.textContent = "todas";
  selectorFiltro.appendChild(opcionTodas);

  for (let i = 0; i < categorias.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = categorias[i];
    opcion.textContent = categorias[i];
    selectorFiltro.appendChild(opcion);
  }
  selectorFiltro.value = categoriaActual;
}

// ===== Validación y operaciones =====
function validarProducto(datos) {
  if (datos.nombre === "") {
    throw new Error("El nombre no puede estar vacío.");
  }
  if (datos.categoria === "") {
    throw new Error("La categoría no puede estar vacía.");
  }
  if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
    throw new Error("La cantidad debe ser un entero mayor que cero.");
  }
  if (typeof datos.precio !== "number" || Number.isNaN(datos.precio) || datos.precio < 0) {
    throw new Error("El precio debe ser un número mayor o igual que cero.");
  }
}

function leerFormulario() {
  const textoPrecio = formulario.elements["precio"].value.trim();
  return {
    nombre: formulario.elements["nombre"].value.trim(),
    categoria: formulario.elements["categoria"].value.trim(),
    cantidad: Number(formulario.elements["cantidad"].value),
    precio: textoPrecio === "" ? NaN : Number(textoPrecio)
  };
}

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  console.error(mensaje);
}

function limpiarError() {
  mensajeError.textContent = "";
}

function agregarProducto(event) {
  event.preventDefault();
  try {
    const datos = leerFormulario();
    validarProducto(datos);

    const nuevoProducto = {
      id: generarId(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      cantidad: datos.cantidad,
      precio: datos.precio,
      agotado: false
    };
    inventario.push(nuevoProducto);

    llenarSelector();
    renderizarVista();
    formulario.reset();
    limpiarError();
    console.log("Alta: " + nuevoProducto.nombre + " (id " + nuevoProducto.id + ")");
  } catch (error) {
    mostrarError(error.message);
  }
}

function eliminarProducto(id) {
  const resultado = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id !== id) {
      resultado.push(inventario[i]);
    }
  }
  return resultado;
}

function cambiarEstado(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario[i].agotado = !inventario[i].agotado;
      return;
    }
  }
}

// ===== Manejadores de eventos =====
function manejarClicTabla(event) {
  const boton = event.target;
  if (!boton.classList.contains("btn-estado") && !boton.classList.contains("btn-eliminar")) {
    return;
  }

  const id = Number(boton.getAttribute("data-id"));

  if (boton.classList.contains("btn-estado")) {
    cambiarEstado(id);
    console.log("Cambio de estado: id " + id);
  } else {
    inventario = eliminarProducto(id);
    console.log("Baja: id " + id);
    llenarSelector();
  }
  renderizarVista();
}

function manejarCambioFiltro() {
  categoriaActual = selectorFiltro.value;
  renderizarVista();
}

// ===== Flujo principal =====
function iniciar() {
  llenarSelector();
  renderizarVista();

  formulario.addEventListener("submit", agregarProducto);
  cuerpoInventario.addEventListener("click", manejarClicTabla);
  selectorFiltro.addEventListener("change", manejarCambioFiltro);

  console.table(inventario);
  console.table(contarPorCategoria(inventario));
}

iniciar();
