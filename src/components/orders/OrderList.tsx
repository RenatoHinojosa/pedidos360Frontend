import { OrderStatusBadge, type OrderStatus } from './OrderStatusBadge';
import { formatCLP } from '../../utils/currency';

export interface Order {
  id: string;
  customer: string;
  productName: string;
  items: number;
  amount: number;
  date: string;
  status: OrderStatus;
}

interface OrderListProps {
  orders: Order[];
  onSelect: (order: Order) => void;
}

export function OrderList({ orders, onSelect }: OrderListProps) {
  return (
    <div className="orders-list-table" role="table" aria-label="Listado de pedidos">
      <div className="orders-list-row orders-list-header" role="row">
        <span>Pedido</span><span>Cliente</span><span>Producto</span><span>Importe</span><span>Estado</span><span />
      </div>
      {orders.length === 0 && <p className="empty-state">No encontramos pedidos con esos criterios.</p>}
      {orders.map((order) => (
        <button className="orders-list-row orders-list-data" key={order.id} onClick={() => onSelect(order)} type="button">
          <strong>{order.productName}</strong><span>{order.customer}</span><span>{order.productName} × {order.items}</span><span>{formatCLP(order.amount)}</span><OrderStatusBadge status={order.status} /><span className="row-arrow">→</span>
        </button>
      ))}
    </div>
  );
}