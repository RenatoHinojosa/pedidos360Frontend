import { useState } from 'react';
import { ProductCard, type Product } from '../components/catalog/ProductCard';
import { ProductForm } from '../components/catalog/ProductForm';
import { ProductOrderForm } from '../components/catalog/ProductOrderForm';
import { useAppRole } from '../hooks/useAppRole';
import { canManageCatalog } from '../types/auth';

const demoProducts: Product[] = [
  { id: '1', name: 'Pack oficina esencial', category: 'Oficina', price: '$48.00', stock: 124, accent: 'product-green' },
  { id: '2', name: 'Auriculares Studio', category: 'Tecnología', price: '$89.90', stock: 36, accent: 'product-yellow' },
  { id: '3', name: 'Lámpara de escritorio', category: 'Hogar', price: '$62.50', stock: 8, accent: 'product-blue' },
  { id: '4', name: 'Organizador modular', category: 'Oficina', price: '$27.00', stock: 74, accent: 'product-rose' },
];

export function Catalog() {
  const { role } = useAppRole();
  const canEdit = canManageCatalog(role);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmation, setConfirmation] = useState('');

  return (
    <div className="module-page">
      <header className="module-heading"><div><div className="eyebrow">Productos</div><h1>Catálogo</h1><p>Consulta la oferta y disponibilidad de tus productos.</p></div>{canEdit && <button className="btn btn-login module-primary-action" onClick={() => setIsFormOpen(true)} type="button">+ Nuevo producto</button>}</header>
      <div className="catalog-layout"><section><div className="catalog-toolbar"><div className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Buscar productos" placeholder="Buscar en el catálogo" /></div><select aria-label="Filtrar por categoría"><option>Todas las categorías</option><option>Oficina</option><option>Tecnología</option><option>Hogar</option></select></div>{confirmation && <p className="form-success" role="status">{confirmation}</p>}<div className="product-grid">{demoProducts.map((product) => <ProductCard key={product.id} onOrder={setSelectedProduct} onView={setSelectedProduct} product={product} />)}</div></section></div>
      {isFormOpen && <div className="modal-backdrop" onClick={(event) => event.currentTarget === event.target && setIsFormOpen(false)} role="presentation"><div aria-labelledby="product-form-title" aria-modal="true" className="product-modal" role="dialog"><ProductForm onClose={() => setIsFormOpen(false)} /></div></div>}
      {selectedProduct && <div className="modal-backdrop" onClick={(event) => event.currentTarget === event.target && setSelectedProduct(null)} role="presentation"><div aria-labelledby="product-order-title" aria-modal="true" className="product-modal" role="dialog"><ProductOrderForm onClose={() => setSelectedProduct(null)} onCreated={() => { setConfirmation(`Pedido de ${selectedProduct.name} creado correctamente.`); setSelectedProduct(null); }} product={selectedProduct} /></div></div>}
    </div>
  );
}