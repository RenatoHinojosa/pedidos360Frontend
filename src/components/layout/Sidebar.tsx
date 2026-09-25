import { NavLink } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';

const navigation = [
  { label: 'Inicio', to: '/', icon: '⌂' },
  { label: 'Pedidos', to: '/orders', icon: '▤' },
  { label: 'Catálogo', to: '/catalog', icon: '◈' },
  { label: 'Reportería', to: '/reporteria', icon: '◒', future: true },
  { label: 'Auditoría', to: '/auditoria', icon: '◌', future: true },
];

export function Sidebar() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = accounts[0];

  const handleLogout = () => {
    if (inProgress === InteractionStatus.None) {
      instance
        .logoutRedirect({ postLogoutRedirectUri: '/' })
        .catch((error) => console.error(error));
    }
  };

  if (!isAuthenticated) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="logo-symbol">p</span>
        <span>Pedidos360</span>
      </div>

      <div className="sidebar-section-label">Workspace</div>
      <nav className="sidebar-nav" aria-label="Navegación principal">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}${item.future ? ' future' : ''}`
            }
          >
            <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.future && <span className="coming-badge">Pronto</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="user-avatar">
            {currentUser?.name?.charAt(0).toUpperCase() ?? 'U'}
          </span>
          <span className="user-copy">
            <strong>{currentUser?.name ?? 'Usuario'}</strong>
            <small>Sesión activa</small>
          </span>
        </div>
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          disabled={inProgress !== InteractionStatus.None}
        >
          <span aria-hidden="true">↪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}