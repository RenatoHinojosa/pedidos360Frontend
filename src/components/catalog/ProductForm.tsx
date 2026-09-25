interface ProductFormProps {
  onClose: () => void;
}

export function ProductForm({ onClose }: ProductFormProps) {
  return (
    <form className="product-form" onSubmit={(event) => event.preventDefault()}>
      <div className="form-heading"><div><span className="eyebrow">Catálogo</span><h2 id="product-form-title">Nuevo producto</h2></div><button aria-label="Cerrar formulario" className="detail-close" onClick={onClose} type="button">×</button></div>
      <label>Nombre del producto<input placeholder="Ej. Pack oficina esencial" /></label>
      <label>Categoría<select defaultValue=""><option value="" disabled>Selecciona una categoría</option><option>Oficina</option><option>Tecnología</option><option>Hogar</option></select></label>
      <div className="form-columns"><label>Precio<input placeholder="$ 0.00" /></label><label>Stock inicial<input placeholder="0" type="number" /></label></div>
      <div className="form-actions"><button className="btn form-cancel" onClick={onClose} type="button">Cancelar</button><button className="btn btn-login" type="submit">Guardar producto <span aria-hidden="true">→</span></button></div>
    </form>
  );
}