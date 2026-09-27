import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { createProducto } from '../../services/api/productos';
import { CATEGORIAS_FIJAS, OPCION_NUEVA_CATEGORIA, normalizarCategoria } from '../../constants/categories';

interface ProductFormProps {
  onClose: () => void;
  onCreated: () => void;
}

export function ProductForm({ onClose, onCreated }: ProductFormProps) {
  const api = useApi();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categoriaNueva, setCategoriaNueva] = useState('');

  const mostrarInputNueva = categoriaSeleccionada === OPCION_NUEVA_CATEGORIA;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const price = Number(form.get('price'));
    const stock = Number(form.get('stock'));

    const category = mostrarInputNueva
      ? normalizarCategoria(categoriaNueva)
      : categoriaSeleccionada;

    if (!name || !category || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setError('Completa los campos y revisa que el precio sea mayor a 0 y el stock no sea negativo.');
      return;
    }

    if (!api) {
      setError('No hay sesión activa.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await createProducto(api, {
        nombre: name,
        categoria: category,
        precio: price,
        stock,
      });
      onCreated();
    } catch (err) {
      setError('No se pudo guardar el producto. Verifica tu conexión o permisos.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-heading"><div><span className="eyebrow">Catálogo</span><h2 id="product-form-title">Nuevo producto</h2></div><button aria-label="Cerrar formulario" className="detail-close" onClick={onClose} type="button">×</button></div>
      <label>Nombre del producto<input name="name" placeholder="Ej. Pack oficina esencial" /></label>
      <label>
        Categoría
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="" disabled>Selecciona una categoría</option>
          {CATEGORIAS_FIJAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          <option value={OPCION_NUEVA_CATEGORIA}>+ Nueva categoría…</option>
        </select>
      </label>
      {mostrarInputNueva && (
        <label>
          Nombre de la nueva categoría
          <input
            placeholder="Ej. Papelería"
            value={categoriaNueva}
            onChange={(e) => setCategoriaNueva(e.target.value)}
          />
        </label>
      )}
      <div className="form-columns"><label>Precio en CLP<input min="1" name="price" placeholder="$ 0" step="1" type="number" /></label><label>Stock inicial<input name="stock" placeholder="0" type="number" /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><button className="btn form-cancel" onClick={onClose} type="button">Cancelar</button><button className="btn btn-login" disabled={submitting} type="submit">{submitting ? 'Guardando…' : 'Guardar producto'} <span aria-hidden="true">→</span></button></div>
    </form>
  );
}