// Página PÚBLICA (no está detrás de RequireAuth). Solo ofrece login/logout;
// el contenido protegido vive en /dashboard, detrás del guard.
import { Link } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { redirectToLogin } from '../services/auth/authActions';
import { useState } from 'react';

export function Landing() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (inProgress === InteractionStatus.None) {
      setLoginError(null);
      try {
        await redirectToLogin(instance);
      } catch (error) {
        console.error(error);
        setLoginError('No fue posible iniciar sesión. Inténtalo nuevamente.');
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="welcome-panel">
        <div className="eyebrow">Sesión activa</div>
        <h1>Tu operación está lista.</h1>
        <p className="lead">
          Continúa al panel para consultar pedidos y revisar el estado de tu
          operación.
        </p>
        <Link className="btn btn-login btn-lg" to="/dashboard">
          Ir al panel <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="landing-shell">
      <section className="landing-intro">
        <div className="brand-mark" aria-hidden="true"><span>p</span></div>
        <div className="eyebrow">Operaciones comerciales</div>
        <h1>Todo pedido,<br /><em>en un solo lugar.</em></h1>
        <p className="lead">
          Gestiona el movimiento de tu negocio con una vista clara, segura y
          pensada para avanzar.
        </p>
        <div className="intro-meta">
          <span className="status-dot" aria-hidden="true" />
          Plataforma protegida por Microsoft Entra ID
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="panel-kicker">Bienvenido de vuelta</div>
        <h2 id="login-title">Ingresa a Pedidos360</h2>
        <p className="panel-copy">
          Usa tu cuenta corporativa para acceder a tu espacio de trabajo.
        </p>
        <button
          className="btn btn-login btn-lg login-action"
          onClick={handleLogin}
          disabled={inProgress !== InteractionStatus.None}
        >
          <span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          {inProgress !== InteractionStatus.None
            ? 'Conectando...'
            : 'Continuar con Microsoft'}
          <span className="button-arrow" aria-hidden="true">→</span>
        </button>
        <p className="security-note">
          <span aria-hidden="true">◉</span> Acceso seguro y centralizado
        </p>
        {loginError && <p className="login-error" role="alert">{loginError}</p>}
      </section>
    </div>
  );
}
