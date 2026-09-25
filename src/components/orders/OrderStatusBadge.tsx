export type OrderStatus = 'CREATED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

const statusLabels: Record<OrderStatus, string> = {
  CREATED: 'Creado',
  ACCEPTED: 'Aceptado',
  IN_PROGRESS: 'En proceso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`order-status status-${status.toLowerCase()}`}>{statusLabels[status]}</span>;
}