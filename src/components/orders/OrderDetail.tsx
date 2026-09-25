import { OrderStatusBadge, type OrderStatus } from './OrderStatusBadge';
import type { Order } from './OrderList';

interface OrderDetailProps {
  order: Order | null;
  canUpdateStatus: boolean;
  onClose: () => void;
}

export function OrderDetail({ order, canUpdateStatus, onClose }: OrderDetailProps) {
  if (!order) return null;

  const nextStatus: OrderStatus = order.status === 'CREATED' ? 'ACCEPTED' : 'IN_PROGRESS';

  return (
    <aside className="order-detail" aria-label={`Detalle del pedido ${order.id}`}>
      <div className="detail-header"><div><span className="eyebrow">Detalle del pedido</span><h2>{order.id}</h2></div><button className="detail-close" onClick={onClose} type="button">×</button></div>
      <div className="detail-status"><OrderStatusBadge status={order.status} /><span>{order.date}</span></div>
      <div className="detail-block"><span>Cliente</span><strong>{order.customer}</strong></div>
      <div className="detail-block"><span>Contenido</span><strong>{order.items} productos</strong></div>
      <div className="detail-block"><span>Total del pedido</span><strong className="detail-total">{order.amount}</strong></div>
      {canUpdateStatus && <button className="btn btn-login detail-action" type="button">Marcar como {nextStatus === 'ACCEPTED' ? 'aceptado' : 'en proceso'}</button>}
    </aside>
  );
}