import { formatCLP } from '../../utils/currency';
import type { Product } from './ProductCard';

interface ProductDetailProps {
  error?: string;
  loading?: boolean;
  product: Product;
  onClose: () => void;
}

export function ProductDetail({ error = '', loading = false, product, onClose }: ProductDetailProps) {
  return (
    <section className="product-form product-detail-panel" aria-labelledby="product-detail-title">
      <div className="form-heading"><div><span className="eyebrow">Catálogo</span><h2 id="product-detail-title">Detalle del producto</h2></div><button aria-label="Cerrar detalle" className="detail-close" onClick={onClose} type="button">×</button></div>
      <h3 className="product-detail-name">{product.name}</h3>
      {loading ? <p className="order-detail-loading">Cargando información completa…</p> : error ? <p className="form-error" role="alert">{error}</p> : <dl className="product-detail-list">
        <div><dt>ID del producto</dt><dd>{product.id}</dd></div>
        <div><dt>Categoría</dt><dd>{product.category}</dd></div>
        <div><dt>Precio</dt><dd>{formatCLP(product.price)}</dd></div>
        <div><dt>Stock disponible</dt><dd>{product.stock} unidades</dd></div>
        <div className="product-detail-description"><dt>Descripción</dt><dd>{product.description || 'Este producto no tiene una descripción registrada.'}</dd></div>
      </dl>}
      <div className="form-actions"><button className="btn btn-login" onClick={onClose} type="button">Cerrar</button></div>
    </section>
  );
}