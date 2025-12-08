import { useEffect, useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = 'http://localhost:3000/api/productos';

function App() {
  // Lista de productos
  const [productos, setProductos] = useState([]);

  // Formulario CREAR
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState(0);

  // Formulario EDITAR (simple)
  const [editSku, setEditSku] = useState('');
  const [editNombre, setEditNombre] = useState('');
  const [editStock, setEditStock] = useState('');

  // Error edición
  const [editError, setEditError] = useState('');

  // Cargar datos al inicio
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => setProductos(json.data ?? []))
      .catch((err) => console.error("Error cargando datos", err));
  }, []);

  // Crear producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sku.trim() || !nombre.trim()) {
      alert("SKU y nombre son obligatorios");
      return;
    }

    const nuevo = {
      sku,
      nombre,
      stock: Number(stock),
    };

    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });

    if (resp.ok) {
      const json = await resp.json();
      setProductos((prev) => [...prev, json.data]);

      // limpiar
      setSku("");
      setNombre("");
      setStock(0);
    } else {
      alert("Error al crear producto");
    }
  };

  // Editar producto
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editSku.trim()) {
      setEditError("Debes ingresar el SKU para editar un producto");
      return;
    }

    // Validar si envió algo para editar
    if (!editNombre.trim() && editStock === "") {
      setEditError("Debes cambiar al menos un campo (nombre o stock)");
      return;
    }

    setEditError("");

    try {
      const resp = await fetch(`${API_URL}/${editSku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editNombre || undefined,
          stock: editStock === "" ? undefined : Number(editStock),
        }),
      });

      if (resp.status === 400) {
        setEditError("La API rechazó los datos (código 400)");
        return;
      }

      if (!resp.ok) {
        setEditError(`Error al editar (código ${resp.status})`);
        return;
      }

      const json = await resp.json();

      setProductos((prev) =>
        prev.map((p) => (p.sku === editSku ? json.data : p))
      );

      // limpiar
      setEditSku("");
      setEditNombre("");
      setEditStock("");
    } catch (err) {
      setEditError("Error al conectarse al servidor");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Inventario Web (Demo)</h1>

      {/* FORMULARIO CREAR */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>SKU:</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="A-001"
          />
        </div>

        <div>
          <label>Nombre:</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Cable HDMI"
          />
        </div>

        <div>
          <label>Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
          />
        </div>

        <button type="submit">Crear producto</button>
      </form>

      <hr />

      {/* FORMULARIO EDITAR - SIMPLE */}
      <h2>Editar producto</h2>

      <form onSubmit={handleEdit}>
        <div>
          <label>SKU del producto:</label>
          <input
            value={editSku}
            onChange={(e) => setEditSku(e.target.value)}
            placeholder="Ej: A-001"
          />
        </div>

        <div>
          <label>Nuevo nombre (opcional):</label>
          <input
            value={editNombre}
            onChange={(e) => setEditNombre(e.target.value)}
            placeholder="Nuevo nombre"
          />
        </div>

        <div>
          <label>Nuevo stock (opcional):</label>
          <input
            type="number"
            value={editStock}
            onChange={(e) => setEditStock(e.target.value)}
            placeholder="0"
          />
        </div>

        <button type="submit">Aplicar cambios</button>
      </form>

      {/* Error edición */}
      {editError && <p style={{ color: "red" }}>{editError}</p>}

      <hr />

      {/* LISTA DE PRODUCTOS */}
      <h2>Productos actuales</h2>
      <ul>
  {productos.map((p) => (
    <li key={p.id}>
      {p.sku} – {p.nombre} – {p.stock} unidades
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
