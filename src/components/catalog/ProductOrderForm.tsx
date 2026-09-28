import { useState } from 'react';
import type { Product } from './ProductCard';
import { formatCLP } from '../../utils/currency';
import { useApi } from '../../hooks/useApi';
import { createOrden } from '../../services/api/ordenes';

interface ProductOrderFormProps {
  product: Product;
  onClose: () => void;
  onCreated: () => void;
}

export function ProductOrderForm({ product, onClose, onCreated }: ProductOrderFormProps) {
  const api = useApi();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
      setError(`Indica una cantidad entre 1 y ${product.stock}.`);
      return;
    }
    if (!api) {
      setError('No hay sesión activa.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await createOrden(api, product.id, quantity);
      onCreated();
    } catch (err) {
      setError('No se pudo crear el pedido. Verifica el stock disponible.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-heading"><div><span className="eyebrow">Pedido individual</span><h2 id="product-order-title">{product.name}</h2></div><button aria-label="Cerrar pedido" className="detail-close" onClick={onClose} type="button">×</button></div>
      <p className="order-product-copy">{product.category} · {formatCLP(product.price)} por unidad</p>
      <label>Cantidad<input min="1" max={product.stock} name="quantity" onChange={(event) => setQuantity(Number(event.target.value))} type="number" value={quantity} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="order-total">Total estimado <strong>{formatCLP(product.price * quantity)}</strong></p>
      <div className="form-actions"><button className="btn form-cancel" onClick={onClose} type="button">Cancelar</button><button className="btn btn-login" disabled={submitting} type="submit">{submitting ? 'Enviando…' : 'Confirmar pedido'}</button></div>
    </form>
  );
}