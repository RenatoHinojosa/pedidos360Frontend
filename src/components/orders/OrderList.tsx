import { OrderStatusBadge, type OrderStatus } from './OrderStatusBadge';

export interface Order {
  id: string;
  customer: string;
  items: number;
  amount: string;
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
        <span>Pedido</span><span>Cliente</span><span>Artículos</span><span>Importe</span><span>Estado</span><span />
      </div>
      {orders.map((order) => (
        <button className="orders-list-row orders-list-data" key={order.id} onClick={() => onSelect(order)} type="button">
          <strong>{order.id}</strong><span>{order.customer}</span><span>{order.items} productos</span><span>{order.amount}</span><OrderStatusBadge status={order.status} /><span className="row-arrow">→</span>
        </button>
      ))}
    </div>
  );
}