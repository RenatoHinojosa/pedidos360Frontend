import { useState } from 'react';
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
  const filteredOrders = demoOrders.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="module-page">
      <header className="module-heading"><div><div className="eyebrow">Operación</div><h1>Gestión de pedidos</h1><p>Consulta, crea y da seguimiento a tus pedidos.</p></div>{canCreateOrders(role) && <button className="btn btn-login module-primary-action" type="button">+ Nuevo pedido</button>}</header>
      <div className="module-toolbar"><div className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Buscar pedidos" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por pedido o cliente" value={query} /></div><span className="role-context">Vista {role === 'CLIENTE' ? 'de cliente' : 'operativa'}</span></div>
      <div className={`orders-workspace${selectedOrder ? ' with-detail' : ''}`}><section className="module-card"><div className="module-card-heading"><div><h2>Todos los pedidos</h2><p>{filteredOrders.length} pedidos encontrados</p></div><select aria-label="Filtrar por estado"><option>Todos los estados</option><option>Creado</option><option>En proceso</option><option>Completado</option></select></div><OrderList orders={filteredOrders} onSelect={setSelectedOrder} /></section><OrderDetail canUpdateStatus={canManageOrders(role)} onClose={() => setSelectedOrder(null)} order={selectedOrder} /></div>
    </div>
  );
}