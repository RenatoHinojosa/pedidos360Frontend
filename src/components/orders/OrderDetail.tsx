import { useState } from 'react';
import { OrderStatusBadge, type OrderStatus } from './OrderStatusBadge';
import type { Order } from './OrderList';
import { formatCLP } from '../../utils/currency';
import { useApi } from '../../hooks/useApi';
import { ApiError } from '../../services/api/client';
import { updateEstadoOrden } from '../../services/api/ordenes';

// Espejo de TRANSICIONES_VALIDAS del backend, solo para decidir qué botones
// mostrar. El backend sigue siendo quien valida de verdad.
const TRANSICIONES: Record<OrderStatus, OrderStatus[]> = {
  CREADO: ['ACEPTADO', 'CANCELADO'],
  ACEPTADO: ['EN_PREPARACION', 'CANCELADO'],
  EN_PREPARACION: ['DESPACHADO', 'CANCELADO'],
  DESPACHADO: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  CREADO: 'creado',
  ACEPTADO: 'aceptado',
  EN_PREPARACION: 'en preparación',
  DESPACHADO: 'despachado',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
};

interface OrderDetailProps {
  order: Order | null;
  canUpdateStatus: boolean;
  isCliente: boolean;
  onClose: () => void;
  onOpenDetail: () => void;
  onUpdated: () => void;
}

export function OrderDetail({ order, canUpdateStatus, isCliente, onClose, onOpenDetail, onUpdated }: OrderDetailProps) {
  const api = useApi();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  if (!order) return null;

  const transicionesDisponibles = TRANSICIONES[order.status];
  const avanzar = transicionesDisponibles.find((s) => s !== 'CANCELADO');
  const puedeCancelar = transicionesDisponibles.includes('CANCELADO');

  async function cambiarEstado(nuevoEstado: OrderStatus) {
    if (!api || !order) return;
    setError('');
    setUpdating(true);
    try {
      await updateEstadoOrden(api, order.id, nuevoEstado);
      onUpdated();
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as { mensaje?: unknown } | null;
        const message = typeof body?.mensaje === 'string'
          ? body.mensaje
          : `No se pudo actualizar el pedido (API ${err.status}).`;
        setError(message);
      } else {
        setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado del pedido.');
      }
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  // Un Operador/Admin puede avanzar o cancelar en cualquier transición válida.
  // Un Cliente solo puede cancelar, y solo mientras el pedido siga en CREADO.
  const puedeAvanzar = canUpdateStatus && avanzar;
  const puedeMostrarCancelar = (canUpdateStatus && puedeCancelar) || (isCliente && order.status === 'CREADO' && puedeCancelar);

  return (
    <aside className="order-detail" aria-label={`Detalle del pedido ${order.id}`}>
      <div className="detail-header"><div><span className="eyebrow">Detalle del pedido</span><h2>{order.id}</h2></div><button className="detail-close" onClick={onClose} type="button">×</button></div>
      <div className="detail-status"><OrderStatusBadge status={order.status} /><span>{order.date}</span></div>
      <div className="detail-block"><span>Producto</span><strong>{order.productName}</strong></div>
      <div className="detail-block"><span>Cantidad</span><strong>{order.items} unidades</strong></div>
      <div className="detail-block"><span>Total del pedido</span><strong className="detail-total">{formatCLP(order.amount)}</strong></div>
      <button className="btn detail-info-action" onClick={onOpenDetail} type="button">Información detallada</button>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="detail-actions">
        {puedeAvanzar && avanzar && <button className="btn btn-login detail-action" disabled={updating} onClick={() => cambiarEstado(avanzar)} type="button">{updating ? 'Actualizando…' : `Marcar como ${STATUS_LABELS[avanzar]}`}</button>}
        {puedeMostrarCancelar && <button className="btn form-cancel detail-action" disabled={updating} onClick={() => cambiarEstado('CANCELADO')} type="button">Cancelar pedido</button>}
      </div>
    </aside>
  );
}