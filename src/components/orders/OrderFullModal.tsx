import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from './OrderList';
import { formatCLP } from '../../utils/currency';

interface OrderFullModalProps {
  order: Order | null;
  loading: boolean;
  error: string;
  onClose: () => void;
}

export function OrderFullModal({ order, loading, error, onClose }: OrderFullModalProps) {
  if (!order) return null;

  return (
    <div className="modal-backdrop order-detail-backdrop" onClick={(event) => event.currentTarget === event.target && onClose()} role="presentation">
      <section aria-labelledby="order-full-detail-title" aria-modal="true" className="order-full-modal" role="dialog">
        <div className="order-full-modal-header">
          <div>
            <span className="eyebrow">Información de la orden</span>
            <h2 id="order-full-detail-title">{order.id}</h2>
          </div>
          <button aria-label="Cerrar información de la orden" className="detail-close" onClick={onClose} type="button">×</button>
        </div>

        {loading ? <p className="order-detail-loading">Cargando información completa…</p> : error ? <p className="form-error" role="alert">{error}</p> : (
          <>
            <div className="order-full-status"><OrderStatusBadge status={order.status} /><span>Actualizada {order.updatedDate}</span></div>
            <div className="order-full-grid">
              <div className="order-full-section">
                <h3>Pedido</h3>
                <dl className="order-full-list">
                  <div><dt>Producto</dt><dd>{order.productName}</dd></div>
                  <div><dt>ID del producto</dt><dd>{order.productId}</dd></div>
                  <div><dt>Cantidad</dt><dd>{order.items} unidades</dd></div>
                  <div><dt>Precio unitario</dt><dd>{formatCLP(order.unitPrice)}</dd></div>
                  <div><dt>Total</dt><dd className="order-full-total">{formatCLP(order.amount)}</dd></div>
                </dl>
              </div>
              <div className="order-full-section">
                <h3>Cliente y trazabilidad</h3>
                <dl className="order-full-list">
                  <div><dt>Correo</dt><dd className="detail-email">{order.customer}</dd></div>
                  <div><dt>ID del cliente</dt><dd>{order.customerId}</dd></div>
                  <div><dt>Creada</dt><dd>{order.date}</dd></div>
                  <div><dt>Actualizada</dt><dd>{order.updatedDate}</dd></div>
                </dl>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
