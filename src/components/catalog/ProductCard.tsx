export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  accent: string;
}

export function ProductCard({ product }: { product: Product }) {
  const stockState = product.stock < 10 ? 'low' : 'available';

  return (
    <article className="product-card">
      <div className={`product-art ${product.accent}`}><span aria-hidden="true">◈</span></div>
      <div className="product-copy"><span className="product-category">{product.category}</span><h3>{product.name}</h3><div className="product-meta"><strong>{product.price}</strong><span className={`stock-label ${stockState}`}><i /> {product.stock} en stock</span></div></div>
    </article>
  );
}