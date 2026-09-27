// Vista PROTEGIDA: solo se renderiza dentro del guard <RequireAuth/> (ver
// App.tsx) — este componente asume que ya hay sesión activa.
import { useMsal } from '@azure/msal-react';
import { Link } from 'react-router-dom';
import { TokenInspector } from '../components/dashboard/TokenInspector';
import { Pokemones } from '../components/dashboard/Pokemones';
import { useAppRole } from '../hooks/useAppRole';
import type { AppRole } from '../types/auth';
import { formatCLP } from '../utils/currency';

const roleLabels: Record<AppRole, string> = {
  ADMIN: 'Vista global',
  OPERATOR: 'Centro operativo',
  CLIENTE: 'Tu actividad',
};

const roleMetrics: Record<AppRole, Array<{ label: string; value: string; note: string; icon: string; tone?: string }>> = {
  ADMIN: [
    { label: 'Pedidos globales', value: '128', note: '+12.5% frente a ayer', icon: '▤', tone: 'primary' },
    { label: 'Ventas del mes', value: formatCLP(48600), note: '+8.7% frente al mes anterior', icon: '$' },
    { label: 'Usuarios activos', value: '86', note: '12 usuarios en línea', icon: '◎' },
    { label: 'Productos activos', value: '1,284', note: '+4.2% este mes', icon: '◈' },
  ],
  OPERATOR: [
    { label: 'Pedidos en curso', value: '58', note: '7 requieren atención', icon: '◷', tone: 'primary' },
    { label: 'Pedidos pendientes', value: '24', note: 'Por aceptar hoy', icon: '!' },
    { label: 'Completados hoy', value: '46', note: '+9.2% frente a ayer', icon: '✓' },
    { label: 'Productos activos', value: '1,284', note: 'Catálogo actualizado', icon: '◈' },
  ],
  CLIENTE: [
    { label: 'Pedidos recientes', value: '12', note: '3 en proceso', icon: '▤', tone: 'primary' },
    { label: 'Último pedido', value: '#1048', note: 'Completado hoy', icon: '✓' },
    { label: 'En proceso', value: '3', note: 'Revisa su estado', icon: '◷' },
    { label: 'Productos disponibles', value: '1,284', note: 'Explora el catálogo', icon: '◈' },
  ],
};

export function Dashboard() {
  const { accounts } = useMsal();
  const { role } = useAppRole();
  const currentUser = accounts[0];

  const firstName = currentUser?.name?.split(' ')[0] ?? 'equipo';

  return (
    <div className="dashboard-page">
      <header className="dashboard-heading">
        <div>
          <div className="eyebrow">{roleLabels[role]}</div>
          <h1>Buen día, {firstName}.</h1>
          <p>Esto es lo que está pasando en tu operación hoy.</p>
        </div>
        <div className="date-chip">
          <span aria-hidden="true">◷</span> Miércoles, 25 de septiembre
        </div>
      </header>

      <section className="metric-grid" aria-label="Indicadores principales">
        {roleMetrics[role].map((metric) => (
          <article className={`metric-card${metric.tone === 'primary' ? ' metric-primary' : ''}`} key={metric.label}>
            <div className="metric-topline"><span>{metric.label}</span><span className={`metric-icon${metric.tone === 'primary' ? '' : ' soft'}`}>{metric.icon}</span></div>
            <strong>{metric.value}</strong>
            <small><b>{metric.note.split(' ')[0]}</b>{metric.note.slice(metric.note.indexOf(' '))}</small>
          </article>
        ))}
      </section>

      {role === 'OPERATOR' && <section className="dashboard-grid role-view-grid">
        <article className="dashboard-card order-summary"><div className="card-heading"><div><h2>Cola operativa</h2><p>Pedidos que requieren seguimiento</p></div><Link className="text-action" to="/orders">Abrir pedidos <span aria-hidden="true">→</span></Link></div><div className="operator-queue"><div><strong>24</strong><span>Pendientes por aceptar</span></div><div><strong>58</strong><span>En proceso</span></div><div><strong>7</strong><span>Requieren atención</span></div></div></article>
        <article className="dashboard-card quick-actions"><div className="card-heading"><div><h2>Acciones operativas</h2><p>Atiende la cola de hoy</p></div></div><div className="action-list"><Link to="/orders"><span className="action-icon green">▤</span><span><strong>Revisar pendientes</strong><small>Ordena por prioridad</small></span><span>→</span></Link><Link to="/catalog"><span className="action-icon lime">◈</span><span><strong>Consultar catálogo</strong><small>Ver disponibilidad</small></span><span>→</span></Link></div></article>
        <article className="dashboard-card recent-orders"><div className="card-heading"><div><h2>Pedidos en curso</h2><p>Actividad que necesita seguimiento</p></div><Link className="text-action" to="/orders">Ver todos <span aria-hidden="true">→</span></Link></div><div className="orders-table" role="table" aria-label="Pedidos en curso"><div className="orders-row orders-header" role="row"><span>Pedido</span><span>Cliente</span><span>Importe</span><span>Estado</span></div><div className="orders-row" role="row"><strong>#PED-1047</strong><span>Grupo Andino</span><span>{formatCLP(860.5)}</span><em className="status-pill process">En proceso</em></div><div className="orders-row" role="row"><strong>#PED-1046</strong><span>Distribuciones Sol</span><span>{formatCLP(2108)}</span><em className="status-pill pending-pill">Pendiente</em></div></div></article>
      </section>}

      {role === 'CLIENTE' && <section className="dashboard-grid role-view-grid">
        <article className="dashboard-card order-summary"><div className="card-heading"><div><h2>Mis pedidos</h2><p>Estado actual de tus órdenes</p></div><Link className="text-action" to="/orders">Ver historial <span aria-hidden="true">→</span></Link></div><div className="customer-status"><strong>3</strong><span>pedidos en proceso</span><div className="status-track"><i /><i /><i /><i /></div><small>El más reciente está siendo preparado</small></div></article>
        <article className="dashboard-card quick-actions"><div className="card-heading"><div><h2>Comprar</h2><p>Encuentra lo que necesitas</p></div></div><div className="action-list"><Link to="/catalog"><span className="action-icon lime">◈</span><span><strong>Explorar catálogo</strong><small>Crea una orden por producto</small></span><span>→</span></Link><Link to="/orders"><span className="action-icon green">▤</span><span><strong>Consultar pedidos</strong><small>Revisa estados y fechas</small></span><span>→</span></Link></div></article>
        <article className="dashboard-card recent-orders"><div className="card-heading"><div><h2>Últimos pedidos</h2><p>Tu actividad más reciente</p></div><Link className="text-action" to="/orders">Ver todos <span aria-hidden="true">→</span></Link></div><div className="orders-table" role="table" aria-label="Últimos pedidos"><div className="orders-row orders-header" role="row"><span>Pedido</span><span>Cliente</span><span>Importe</span><span>Estado</span></div><div className="orders-row" role="row"><strong>#PED-1048</strong><span>Tu pedido</span><span>{formatCLP(1240)}</span><em className="status-pill ready">Completado</em></div><div className="orders-row" role="row"><strong>#PED-1047</strong><span>Tu pedido</span><span>{formatCLP(860.5)}</span><em className="status-pill process">En proceso</em></div></div></article>
      </section>}

      <section className={`dashboard-grid${role === 'ADMIN' ? '' : ' role-admin-only'}`}>
        <article className="dashboard-card order-summary">
          <div className="card-heading">
            <div><h2>Estado de pedidos</h2><p>Distribución de los pedidos actuales</p></div>
            <Link className="text-action" to="/orders">Ver todos <span aria-hidden="true">→</span></Link>
          </div>
          <div className="order-chart">
            <div className="donut-chart"><strong>128</strong><span>Total</span></div>
            <div className="legend-list">
              <div><i className="legend-dot pending" /><span>Pendientes</span><strong>24</strong></div>
              <div><i className="legend-dot progress" /><span>En proceso</span><strong>58</strong></div>
              <div><i className="legend-dot complete" /><span>Completados</span><strong>46</strong></div>
            </div>
          </div>
        </article>

        <article className="dashboard-card quick-actions">
          <div className="card-heading"><div><h2>Acciones rápidas</h2><p>Lo que puedes hacer ahora</p></div></div>
          <div className="action-list">
            <Link to="/orders"><span className="action-icon green">+</span><span><strong>Nuevo pedido</strong><small>Registra una nueva venta</small></span><span>→</span></Link>
            <Link to="/catalog"><span className="action-icon lime">◈</span><span><strong>Gestionar catálogo</strong><small>Productos y disponibilidad</small></span><span>→</span></Link>
          </div>
        </article>

        <article className="dashboard-card recent-orders">
          <div className="card-heading"><div><h2>Pedidos recientes</h2><p>Últimos movimientos de la operación</p></div><Link className="text-action" to="/orders">Ver todos <span aria-hidden="true">→</span></Link></div>
          <div className="orders-table" role="table" aria-label="Pedidos recientes">
            <div className="orders-row orders-header" role="row"><span>Pedido</span><span>Cliente</span><span>Importe</span><span>Estado</span></div>
            <div className="orders-row" role="row"><strong>#PED-1048</strong><span>Comercial Nova</span><span>{formatCLP(1240)}</span><em className="status-pill ready">Completado</em></div>
            <div className="orders-row" role="row"><strong>#PED-1047</strong><span>Grupo Andino</span><span>{formatCLP(860.5)}</span><em className="status-pill process">En proceso</em></div>
            <div className="orders-row" role="row"><strong>#PED-1046</strong><span>Distribuciones Sol</span><span>{formatCLP(2108)}</span><em className="status-pill pending-pill">Pendiente</em></div>
          </div>
        </article>
      </section>

      <details className="technical-tools">
        <summary>Herramientas técnicas de integración</summary>
        <TokenInspector />
        <Pokemones />
      </details>
    </div>
  );
}
