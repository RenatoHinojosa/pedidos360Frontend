export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  accent: string;
}

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onOrder: (product: Product) => void;
}

export function ProductCard({ product, onView, onOrder }: ProductCardProps) {
  const stockState = product.stock < 10 ? 'low' : 'available';

  return (
    <article className="product-card">
      <div className={`product-art ${product.accent}`}><span aria-hidden="true">◈</span></div>
      <div className="product-copy"><span className="product-category">{product.category}</span><h3>{product.name}</h3><div className="product-meta"><strong>{product.price}</strong><span className={`stock-label ${stockState}`}><i /> {product.stock} en stock</span></div><div className="product-actions"><button className="btn product-secondary-action" onClick={() => onView(product)} type="button">Ver detalle</button><button className="btn btn-login product-order-action" disabled={product.stock === 0} onClick={() => onOrder(product)} type="button">Crear pedido</button></div></div>
    </article>
  );
}