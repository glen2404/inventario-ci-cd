const productos = [];
let ultimoId = 0;

// 1) Validar datos de entrada
function validarDatosProducto(data) {
  if (!data.sku || !data.nombre) {
    throw new Error("SKU y nombre son obligatorios");
  }
}

// 2) Construir el objeto producto listo para guardar
function construirProducto(data) {
  const stockInicial = data.stock ?? 0;

  return {
    id: ++ultimoId,
    sku: String(data.sku),
    nombre: String(data.nombre),
    stock: Number(stockInicial),
  };
}

// 3) Función pública que usa las dos anteriores
function crearProducto(data) {
  validarDatosProducto(data);
  const nuevo = construirProducto(data);
  productos.push(nuevo);
  return nuevo;
}

function listarProductos() {
  return [...productos];
}

module.exports = {
  crearProducto,
  listarProductos,

};
