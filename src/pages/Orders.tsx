import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderDetail } from '../components/orders/OrderDetail';
import { OrderFullModal } from '../components/orders/OrderFullModal';
import { OrderList, type Order } from '../components/orders/OrderList';
import { useAppRole } from '../hooks/useAppRole';
import { useApi } from '../hooks/useApi';
import { canCreateOrders, canManageOrders } from '../types/auth';
import { getOrden, listOrdenes, type OrdenDTO } from '../services/api/ordenes';
import { formatOrderDate } from '../utils/date';
import type { OrderStatus } from '../components/orders/OrderStatusBadge';

const ORDER_STATUSES: OrderStatus[] = ['CREADO', 'ACEPTADO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO', 'CANCELADO'];

function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

function mapOrden(dto: OrdenDTO): Order | null {
  if (!isOrderStatus(dto.estado)) {
    console.warn(`Estado de pedido no reconocido: ${dto.estado}`);
    return null;
  }

  const customerEmail = dto.creadoPorEmail ?? '';

  return {
    id: dto.orderId,
    productId: dto.productId,
    customer: customerEmail || 'No disponible',
    customerId: dto.creadoPor,
    productName: dto.productoNombre,
    items: dto.cantidad,
    unitPrice: dto.precioUnitario,
    amount: dto.total,
    date: formatOrderDate(dto.createdAt),
    updatedDate: formatOrderDate(dto.updatedAt),
    status: dto.estado,
  };
}

export function Orders() {
  const { role } = useAppRole();
  const api = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [fullDetailOrder, setFullDetailOrder] = useState<Order | null>(null);
  const [fullDetailLoading, setFullDetailLoading] = useState(false);
  const [fullDetailError, setFullDetailError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  async function loadOrders() {
    if (!api) return;
    setLoading(true);
    setError('');
    try {
      const data = await listOrdenes(api);
      setOrders(data.map(mapOrden).filter((order): order is Order => order !== null));
    } catch (err) {
      setError('No se pudieron cargar los pedidos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  async function handleOpenFullDetail(order: Order) {
    if (!api) return;

    setFullDetailOrder(order);
    setFullDetailLoading(true);
    setFullDetailError('');
    try {
      const detail = await getOrden(api, order.id);
      const mappedDetail = mapOrden(detail);
      if (mappedDetail) setFullDetailOrder(mappedDetail);
    } catch (err) {
      setFullDetailError('No se pudo cargar la información completa de la orden.');
      console.error(err);
    } finally {
      setFullDetailLoading(false);
    }
  }

  // El backend ya filtra "mis pedidos" para rol CLIENTE (vía CreadoPorIndex),
  // así que aquí solo aplicamos búsqueda y filtro de estado sobre lo recibido.
  const filteredOrders = orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.productName}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (statusFilter === 'ALL' || order.status === statusFilter);
  });

  return (
    <div className="module-page">
      <header className="module-heading"><div><div className="eyebrow">{role === 'CLIENTE' ? 'Tu actividad' : role === 'OPERATOR' ? 'Centro operativo' : 'Operación'}</div><h1>{role === 'CLIENTE' ? 'Mis pedidos' : role === 'OPERATOR' ? 'Pedidos en curso' : 'Gestión de pedidos'}</h1><p>{role === 'CLIENTE' ? 'Consulta el estado de tus órdenes individuales.' : role === 'OPERATOR' ? 'Atiende pedidos pendientes y en proceso.' : 'Consulta y da seguimiento a todos los pedidos.'}</p></div>{canCreateOrders(role) && <Link className="btn btn-login module-primary-action" to="/catalog">Crear pedido</Link>}</header>
      <div className="module-toolbar"><div className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Buscar pedidos" onChange={(event) => setQuery(event.target.value)} placeholder={role === 'CLIENTE' ? 'Buscar en mis pedidos' : 'Buscar por pedido, cliente o producto'} value={query} /></div><span className="role-context">{role === 'CLIENTE' ? 'Vista de cliente' : role === 'OPERATOR' ? 'Cola operativa' : 'Vista global'}</span></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className={`orders-workspace${selectedOrder ? ' with-detail' : ''}`}><section className="module-card"><div className="module-card-heading"><div><h2>{role === 'CLIENTE' ? 'Historial de mis pedidos' : role === 'OPERATOR' ? 'Pedidos para atender' : 'Todos los pedidos'}</h2><p>{filteredOrders.length} pedidos encontrados</p></div><select aria-label="Filtrar por estado" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option value="ALL">Todos los estados</option><option value="CREADO">Creado</option><option value="ACEPTADO">Aceptado</option><option value="EN_PREPARACION">En preparación</option><option value="DESPACHADO">Despachado</option><option value="ENTREGADO">Entregado</option><option value="CANCELADO">Cancelado</option></select></div>{loading ? <p>Cargando pedidos…</p> : <OrderList orders={filteredOrders} onSelect={setSelectedOrder} />}</section><OrderDetail canUpdateStatus={canManageOrders(role)} isCliente={role === 'CLIENTE'} onClose={() => setSelectedOrder(null)} onOpenDetail={() => selectedOrder && handleOpenFullDetail(selectedOrder)} onUpdated={() => { loadOrders(); setSelectedOrder(null); }} order={selectedOrder} /></div>
      <OrderFullModal error={fullDetailError} loading={fullDetailLoading} onClose={() => { setFullDetailOrder(null); setFullDetailError(''); }} order={fullDetailOrder} />
    </div>
  );
}