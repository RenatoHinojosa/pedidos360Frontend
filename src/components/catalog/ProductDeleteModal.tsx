import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { deleteProducto } from '../../services/api/productos';
import type { Product } from './ProductCard';

interface ProductDeleteModalProps {
  product: Product;
  onClose: () => void;
  onDeleted: () => void;
}

export function ProductDeleteModal({ product, onClose, onDeleted }: ProductDeleteModalProps) {
  const api = useApi();
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmationText.trim() !== 'confirmar') {
      setError('Escribe "confirmar" para continuar.');
      return;
    }
    if (!api) {
      setError('No hay sesión activa.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await deleteProducto(api, product.id);
      onDeleted();
    } catch (err) {
      setError('No se pudo eliminar el producto. Verifica tu conexión o permisos.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="product-form delete-product-form" onSubmit={handleSubmit}>
      <div className="form-heading"><div><span className="eyebrow delete-eyebrow">Acción irreversible</span><h2 id="product-delete-title">Eliminar producto</h2></div><button aria-label="Cerrar confirmación" className="detail-close" onClick={onClose} type="button">×</button></div>
      <p className="delete-copy">Se eliminará <strong>{product.name}</strong> del catálogo. Esta acción no se puede deshacer.</p>
      <label>Escribe <strong>confirmar</strong> para continuar<input autoFocus value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions"><button className="btn form-cancel" onClick={onClose} type="button">Cancelar</button><button className="btn product-delete-confirm" disabled={submitting || confirmationText.trim() !== 'confirmar'} type="submit">{submitting ? 'Eliminando…' : 'Eliminar producto'}</button></div>
    </form>
  );
}