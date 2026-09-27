import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderDetail } from '../components/orders/OrderDetail';
import { OrderList, type Order } from '../components/orders/OrderList';
import { useAppRole } from '../hooks/useAppRole';
import { canCreateOrders, canManageOrders } from '../types/auth';

const demoOrders: Order[] = [
  { id: '#PED-1048', customer: 'Comercial Nova', items: 8, amount: '$1,240.00', date: '25 Sep, 2026 · 09:42', status: 'COMPLETED' },
  { id: '#PED-1047', customer: 'Grupo Andino', items: 4, amount: '$860.50', date: '25 Sep, 2026 · 09:15', status: 'IN_PROGRESS' },
  { id: '#PED-1046', customer: 'Distribuciones Sol', items: 12, amount: '$2,108.00', date: '25 Sep, 2026 · 08:51', status: 'CREATED' },
  { id: '#PED-1045', customer: 'Mercado Central', items: 3, amount: '$420.00', date: '24 Sep, 2026 · 17:20', status: 'ACCEPTED' },
];

export function Orders() {
  const { role } = useAppRole();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const roleOrders = role === 'CLIENTE' ? demoOrders.filter((order) => order.id === '#PED-1048' || order.id === '#PED-1047') : demoOrders;
  const filteredOrders = roleOrders.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (statusFilter === 'ALL' || order.status === statusFilter);
  });

  return (
    <div className="module-page">
      <header className="module-heading"><div><div className="eyebrow">{role === 'CLIENTE' ? 'Tu actividad' : role === 'OPERATOR' ? 'Centro operativo' : 'Operación'}</div><h1>{role === 'CLIENTE' ? 'Mis pedidos' : role === 'OPERATOR' ? 'Pedidos en curso' : 'Gestión de pedidos'}</h1><p>{role === 'CLIENTE' ? 'Consulta el estado de tus órdenes individuales.' : role === 'OPERATOR' ? 'Atiende pedidos pendientes y en proceso.' : 'Consulta y da seguimiento a todos los pedidos.'}</p></div>{canCreateOrders(role) && <Link className="btn btn-login module-primary-action" to="/catalog">Crear pedido</Link>}</header>
      <div className="module-toolbar"><div className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Buscar pedidos" onChange={(event) => setQuery(event.target.value)} placeholder={role === 'CLIENTE' ? 'Buscar en mis pedidos' : 'Buscar por pedido o cliente'} value={query} /></div><span className="role-context">{role === 'CLIENTE' ? 'Vista de cliente' : role === 'OPERATOR' ? 'Cola operativa' : 'Vista global'}</span></div>
      <div className={`orders-workspace${selectedOrder ? ' with-detail' : ''}`}><section className="module-card"><div className="module-card-heading"><div><h2>{role === 'CLIENTE' ? 'Historial de mis pedidos' : role === 'OPERATOR' ? 'Pedidos para atender' : 'Todos los pedidos'}</h2><p>{filteredOrders.length} pedidos encontrados</p></div><select aria-label="Filtrar por estado" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option value="ALL">Todos los estados</option><option value="CREATED">Creado</option><option value="ACCEPTED">Aceptado</option><option value="IN_PROGRESS">En proceso</option><option value="COMPLETED">Completado</option></select></div><OrderList orders={filteredOrders} onSelect={setSelectedOrder} /></section><OrderDetail canUpdateStatus={canManageOrders(role)} onClose={() => setSelectedOrder(null)} order={selectedOrder} /></div>
    </div>
  );
}