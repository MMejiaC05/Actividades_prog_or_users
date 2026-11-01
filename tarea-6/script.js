// Datos de entrada
const gastos = [
  { nombre: 'Verduras', descripcion: 'Compra de verduras y frutas', monto: 32.75, categoria: 'alimentacion' },
  { nombre: 'Luz', descripcion: 'Recibo de energia electrica', monto: 68.90, categoria: 'servicios' },
  { nombre: 'Doctor', descripcion: 'Consulta medica general', monto: 120, categoria: 'salud' },
  { nombre: 'Cine', descripcion: 'Entrada al cine con amigos', monto: 18.50, categoria: 'entretenimiento' },
  { nombre: 'Bus', descripcion: 'Recarga de tarjeta de bus', monto: 25, categoria: 'transporte' },
  { nombre: 'Internet', descripcion: 'Plan mensual de internet', monto: 55, categoria: 'servicios' },
  { nombre: 'Restaurante', descripcion: 'Cena familiar en restaurante', monto: 104.30, categoria: 'alimentacion' },
  { nombre: 'Medicinas', descripcion: 'Medicamentos recetados', monto: 41.60, categoria: 'salud' }
];

// funcion flecha
const esMontoAlto = (monto) => monto >= 100;

// funciones
function calcularTotal(gastos) {
  let total = 0;
  for (let i = 0; i < gastos.length; i++) {
    if (typeof gastos[i].monto !== 'number') {
      throw new Error('El monto del gasto "' + gastos[i].descripcion + '" no es un numero');
    }
    total = total + gastos[i].monto;
  }
  return total;
}

function calcularPromedio(gastos) {
  if (gastos.length === 0) {
    throw new Error('No se puede calcular el promedio de una lista vacia');
  }
  return calcularTotal(gastos) / gastos.length;
}

function filtrarPorCategoria(gastos, categoria) {
  const filtrados = [];
  for (let i = 0; i < gastos.length; i++) {
    if (gastos[i].categoria === categoria) {
      filtrados[filtrados.length] = gastos[i];
    }
  }
  return filtrados;
}

function obtenerMayorGasto(gastos) {
  if (gastos.length === 0) {
    return null;
  }
  let mayor = gastos[0];
  for (let i = 1; i < gastos.length; i++) {
    if (gastos[i].monto > mayor.monto) {
      mayor = gastos[i];
    }
  }
  return mayor;
}

function clasificarGasto(monto) {
  if (esMontoAlto(monto)) {
    return 'Alto';
  } else if (monto >= 50) {
    return 'Medio';
  } else {
    return 'Bajo';
  }
}

function describirCategoria(categoria) {
  switch (categoria) {
    case 'alimentacion':
      return 'Comidas y bebidas';
    case 'transporte':
      return 'Traslados diarios';
    case 'servicios':
      return 'Pagos mensuales:luz e internet';
    case 'salud':
      return 'Consultas y medicina';
    case 'entretenimiento':
      return 'Diversion';
    default:
      return 'Categoria sin descripcion';
  }
}

function crearContadorDeAltos() {
  let contador = 0;
  return function () {
    contador = contador + 1;
    return contador;
  };
}

// Flujo principal
try {
  console.log('Informe de gastos personales');

  const gastosClasificados = [];
  for (let i = 0; i < gastos.length; i++) {
    gastosClasificados[gastosClasificados.length] = {
      nombre: gastos[i].nombre,
      descripcion: gastos[i].descripcion,
      monto: gastos[i].monto,
      categoria: gastos[i].categoria,
      nivel: clasificarGasto(gastos[i].monto),
      descripcionCategoria: describirCategoria(gastos[i].categoria)
    };
  }

  const contarAlto = crearContadorDeAltos();
  let cantidadAltos = 0;
  for (let i = 0; i < gastosClasificados.length; i++) {
    if (gastosClasificados[i].nivel === 'Alto') {
      cantidadAltos = contarAlto();
    }
  }

  console.log('Tabla de gastos clasificados por nivel:');
  console.table(gastosClasificados);

  const total = calcularTotal(gastos);
  const promedio = calcularPromedio(gastos);
  console.log('Total gastado: $' + total);
  console.log('Promedio por gasto: $' + promedio);

  const mayorGasto = obtenerMayorGasto(gastos);
  console.log('Gasto mas alto: ' + mayorGasto.descripcion + ' | Monto: $' + mayorGasto.monto + ' | Categoria: ' + mayorGasto.categoria);
  console.log('Cantidad de gastos de nivel Alto (>= $100): ' + cantidadAltos);

  const categoriaElegida = 'servicios';
  console.log('Gastos de la categoria "' + categoriaElegida + '":', filtrarPorCategoria(gastos, categoriaElegida));

  const resumenPorCategoria = {};
  for (let i = 0; i < gastos.length; i++) {
    const categoria = gastos[i].categoria;
    if (resumenPorCategoria[categoria] === undefined) {
      resumenPorCategoria[categoria] = 0;
    }
    resumenPorCategoria[categoria] = resumenPorCategoria[categoria] + gastos[i].monto;
  }

  const informe = { total, promedio, cantidadAltos, mayorGasto, resumenPorCategoria };
  console.log('Informe final en formato JSON:');
  console.log(JSON.stringify(informe, null, 2));
} catch (error) {
  console.error('Error al procesar los gastos: ' + error.message);
}

// Prueba controlada de error
try {
  calcularPromedio([]);
} catch (error) {
  console.log('Prueba controlada - error capturado: ' + error.message);
}
