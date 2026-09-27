import { useEffect, useMemo, useState } from 'react';
import { ProductCard, type Product } from '../components/catalog/ProductCard';
import { ProductForm } from '../components/catalog/ProductForm';
import { ProductOrderForm } from '../components/catalog/ProductOrderForm';
import { ProductDeleteModal } from '../components/catalog/ProductDeleteModal';
import { useAppRole } from '../hooks/useAppRole';
import { useApi } from '../hooks/useApi';
import { canManageCatalog } from '../types/auth';
import { listProductos, type ProductoDTO } from '../services/api/productos';
import { CATEGORIAS_FIJAS } from '../constants/categories';

const ACCENTS = ['product-green', 'product-yellow', 'product-blue', 'product-rose'] as const;

function mapProducto(dto: ProductoDTO, index: number): Product {
  return {
    id: dto.productId,
    name: dto.nombre,
    category: dto.categoria,
    price: dto.precio,
    stock: dto.stock,
    accent: ACCENTS[index % ACCENTS.length],
  };
}

export function Catalog() {
  const { role } = useAppRole();
  const canEdit = canManageCatalog(role);
  const api = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  async function loadProducts(categoria?: string) {
    if (!api) return;
    setLoading(true);
    setError('');
    try {
      const data = await listProductos(api, categoria || undefined);
      setProducts(data.map(mapProducto));
    } catch (err) {
      setError('No se pudo cargar el catálogo. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts(categoriaFiltro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, categoriaFiltro]);

  // Combina las categorías fijas con cualquier categoría "nueva" ya creada,
  // para que el filtro también las liste (sin duplicar las fijas).
  const categoriasDisponibles = useMemo(() => {
    const extras = products
      .map((p) => p.category)
      .filter((cat) => !CATEGORIAS_FIJAS.includes(cat as typeof CATEGORIAS_FIJAS[number]));
    return [...CATEGORIAS_FIJAS, ...new Set(extras)];
  }, [products]);

  return (
    <div className="module-page">
      <header className="module-heading"><div><div className="eyebrow">Productos</div><h1>Catálogo</h1><p>Consulta la oferta y disponibilidad de tus productos.</p></div>{canEdit && <button className="btn btn-login module-primary-action" onClick={() => setIsFormOpen(true)} type="button">+ Nuevo producto</button>}</header>
      <div className="catalog-layout"><section><div className="catalog-toolbar"><div className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Buscar productos" placeholder="Buscar en el catálogo" /></div>
        <select
          aria-label="Filtrar por categoría"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categoriasDisponibles.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        {confirmation && <p className="form-success" role="status">{confirmation}</p>}
        {loading ? <p>Cargando catálogo…</p> : <div className="product-grid">{products.map((product) => <ProductCard key={product.id} onDelete={canEdit ? setDeletingProduct : undefined} onOrder={setSelectedProduct} onView={setSelectedProduct} product={product} />)}</div>}
      </section></div>
      {isFormOpen && <div className="modal-backdrop" onClick={(event) => event.currentTarget === event.target && setIsFormOpen(false)} role="presentation"><div aria-labelledby="product-form-title" aria-modal="true" className="product-modal" role="dialog"><ProductForm onClose={() => setIsFormOpen(false)} onCreated={() => { setConfirmation('Producto creado correctamente.'); setIsFormOpen(false); loadProducts(categoriaFiltro); }} /></div></div>}
      {selectedProduct && <div className="modal-backdrop" onClick={(event) => event.currentTarget === event.target && setSelectedProduct(null)} role="presentation"><div aria-labelledby="product-order-title" aria-modal="true" className="product-modal" role="dialog"><ProductOrderForm onClose={() => setSelectedProduct(null)} onCreated={() => { setConfirmation(`Pedido de ${selectedProduct.name} creado correctamente.`); setSelectedProduct(null); }} product={selectedProduct} /></div></div>}
      {deletingProduct && <div className="modal-backdrop" onClick={(event) => event.currentTarget === event.target && setDeletingProduct(null)} role="presentation"><div aria-labelledby="product-delete-title" aria-modal="true" className="product-modal" role="dialog"><ProductDeleteModal onClose={() => setDeletingProduct(null)} onDeleted={() => { setConfirmation('Producto eliminado correctamente.'); setDeletingProduct(null); loadProducts(categoriaFiltro); }} product={deletingProduct} /></div></div>}
    </div>
  );
}