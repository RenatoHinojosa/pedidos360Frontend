export type OrderStatus = 'CREADO' | 'ACEPTADO' | 'EN_PREPARACION' | 'DESPACHADO' | 'ENTREGADO' | 'CANCELADO';

const statusLabels: Record<OrderStatus, string> = {
  CREADO: 'Creado',
  ACEPTADO: 'Aceptado',
  EN_PREPARACION: 'En preparación',
  DESPACHADO: 'Despachado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`order-status status-${status.toLowerCase()}`}>{statusLabels[status]}</span>;
}