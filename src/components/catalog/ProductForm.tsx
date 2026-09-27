import { useState } from 'react';

interface ProductFormProps {
  onClose: () => void;
}

export function ProductForm({ onClose }: ProductFormProps) {
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const category = String(form.get('category') ?? '').trim();
    const price = Number(form.get('price'));
    const stock = Number(form.get('stock'));

    if (!name || !category || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setError('Completa los campos y revisa que el precio sea mayor a 0 y el stock no sea negativo.');
      return;
    }

    setError('');
    onClose();
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-heading"><div><span className="eyebrow">Catálogo</span><h2 id="product-form-title">Nuevo producto</h2></div><button aria-label="Cerrar formulario" className="detail-close" onClick={onClose} type="button">×</button></div>
      <label>Nombre del producto<input name="name" placeholder="Ej. Pack oficina esencial" /></label>
      <label>Categoría<select defaultValue="" name="category"><option value="" disabled>Selecciona una categoría</option><option>Oficina</option><option>Tecnología</option><option>Hogar</option></select></label>
      <div className="form-columns"><label>Precio<input name="price" placeholder="$ 0.00" type="number" /></label><label>Stock inicial<input name="stock" placeholder="0" type="number" /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><button className="btn form-cancel" onClick={onClose} type="button">Cancelar</button><button className="btn btn-login" type="submit">Guardar producto <span aria-hidden="true">→</span></button></div>
    </form>
  );
}