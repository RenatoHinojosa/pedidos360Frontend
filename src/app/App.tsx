import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { redirectToLogin } from '../services/auth/authActions';
import { RequireAuth } from '../components/auth/RequireAuth';
import { RequireRole } from '../components/auth/RequireRole';
import { Sidebar } from '../components/layout/Sidebar';
import { Landing } from '../pages/Landing';
import { Dashboard } from '../pages/Dashboard';
import { AdminDemo } from '../pages/AdminDemo';
import { SectionPlaceholder } from '../pages/SectionPlaceholder';
import { Orders } from '../pages/Orders';
import { Catalog } from '../pages/Catalog';

function PublicNav() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    if (inProgress === InteractionStatus.None) {
      redirectToLogin(instance).catch((error) => console.error(error));
    }
  };

  return (
    <header className="navbar">
      <div className="logo"><span className="logo-symbol">p</span><span>Pedidos360</span></div>
      {!isAuthenticated && (
        <button className="btn btn-login" onClick={handleLogin} disabled={inProgress !== InteractionStatus.None}>
          Iniciar sesión
        </button>
      )}
    </header>
  );
}

function Topbar() {
  const { accounts } = useMsal();
  const location = useLocation();
  const currentUser = accounts[0];
  const titles: Record<string, string> = {
    '/': 'Inicio',
    '/dashboard': 'Inicio',
    '/orders': 'Gestión de pedidos',
    '/catalog': 'Catálogo',
    '/reporteria': 'Reportería',
    '/auditoria': 'Auditoría',
  };

  return (
    <header className="workspace-topbar">
      <div><span className="breadcrumb-muted">Workspace / </span>{titles[location.pathname] ?? 'Inicio'}</div>
      <div className="topbar-user">
        <span className="topbar-avatar">{currentUser?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
        <span>{currentUser?.name ?? 'Usuario'}</span>
      </div>
    </header>
  );
}

function AppRoutes() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Landing />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/reporteria" element={<SectionPlaceholder eyebrow="Indicadores" title="Reportería" description="Los KPIs de tu operación estarán disponibles en este espacio." />} />
        <Route path="/auditoria" element={<SectionPlaceholder eyebrow="Trazabilidad" title="Auditoría" description="Consulta la actividad y los cambios importantes de tu organización." />} />
        <Route element={<RequireRole role="Admin" />}>
          <Route path="/admin" element={<AdminDemo />} />
        </Route>
      </Route>
      <Route path="*" element={isAuthenticated ? <Dashboard /> : <Landing />} />
    </Routes>
  );
}

function AuthenticatedShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="workspace">
        <Topbar />
        <main className="dashboard-container"><AppRoutes /></main>
      </div>
    </div>
  );
}

function PublicShell() {
  return (
    <div className="layout">
      <PublicNav />
      <main className="container"><AppRoutes /></main>
    </div>
  );
}

export default function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter>
      {isAuthenticated ? <AuthenticatedShell /> : <PublicShell />}
    </BrowserRouter>
  );
}