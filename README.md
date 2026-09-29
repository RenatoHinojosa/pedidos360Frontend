# Pedidos360 Frontend

Aplicación web para la gestión de pedidos y productos de **Pedidos360**. El
frontend permite a clientes y equipos internos consultar el estado de la
operación desde una interfaz protegida con Microsoft Entra ID y conectada a
una API REST desplegada en AWS.

Este repositorio contiene la aplicación frontend. El backend debe estar
disponible y configurado por separado para que las operaciones de catálogo y
pedidos funcionen correctamente.

## Funcionalidades

- Inicio y cierre de sesión mediante Microsoft Entra ID.
- Dashboard adaptado al rol del usuario: `ADMIN`, `OPERATOR` o `CLIENTE`.
- Catálogo de productos conectado a la API, con búsqueda, filtro por categoría
  y vista de detalle.
- Creación de pedidos desde el catálogo.
- Gestión de productos para administradores y operadores: crear, editar y
  eliminar.
- Consulta de pedidos, búsqueda, filtro por estado y vista de detalle.
- Actualización del estado de los pedidos para administradores y operadores.
- Protección de rutas y permisos mediante roles de aplicación y tokens JWT.
- Renovación silenciosa del token, con redirección a Entra ID cuando se
  requiere interacción.

## Tecnologías

- React 19 y React DOM.
- TypeScript 6.
- Vite 8.
- React Router 7.
- Microsoft Authentication Library: `@azure/msal-browser` y `@azure/msal-react`.
- Oxlint para análisis estático.
- AWS API Gateway y AWS Lambda como backend protegido, en un repositorio o
  despliegue independiente.

## Requisitos

Antes de ejecutar el proyecto necesitas:

- Node.js compatible con las versiones actuales de Vite y TypeScript.
- `pnpm`, preferiblemente habilitado mediante Corepack.
- Una aplicación registrada en Microsoft Entra ID con el redirect URI local:
  `http://localhost:5173`.
- Los roles de aplicación configurados para `ADMIN`, `OPERATOR` y `CLIENTE`.
- La API de backend desplegada y accesible desde el navegador.
- CORS habilitado en la API para `http://localhost:5173`.
- Un scope de API válido para solicitar los tokens del backend.

## Instalación y configuración

1. Instala las dependencias:

   ```bash
   corepack pnpm install
   ```

2. Crea el archivo local de variables de entorno a partir de la plantilla:

   ```bash
   cp .env.example .env
   ```

   En PowerShell puedes usar:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Completa `.env` con los valores de tu tenant, aplicación de Entra ID y API:

   ```env
   VITE_AZURE_CLIENT_ID=ID_DE_LA_APLICACION_FRONTEND
   VITE_AZURE_TENANT_ID=ID_DEL_TENANT
   VITE_AZURE_REDIRECT_URI=http://localhost:5173
   VITE_API_BASE_URL=https://tu-api.execute-api.us-east-1.amazonaws.com
   VITE_API_SCOPE=api://ID_DE_TU_API/orders.read api://ID_DE_TU_API/orders.write
   ```

   `VITE_API_BASE_URL` debe apuntar a la base de la API, sin una ruta adicional
   como `/orders`. El cliente agrega las rutas necesarias (`/productos` y
   `/orders`). Los scopes deben coincidir con los expuestos por la aplicación
   de backend en Entra ID.

## Ejecución

Inicia el servidor de desarrollo con:

```bash
corepack pnpm dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

Comandos disponibles:

```bash
corepack pnpm build    # Comprueba tipos y genera la versión de producción
corepack pnpm lint     # Ejecuta Oxlint
corepack pnpm preview  # Sirve localmente el build generado
```

## Rutas principales

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público o autenticado | Landing pública o dashboard según la sesión |
| `/dashboard` | Autenticado | Indicadores y accesos rápidos por rol |
| `/orders` | Autenticado | Consulta y gestión de pedidos |
| `/catalog` | Autenticado | Consulta y gestión del catálogo |
| `/reporteria` | Autenticado | Espacio reservado para reportería |
| `/auditoria` | Autenticado | Espacio reservado para auditoría |
| `/admin` | Rol `Admin` | Vista de administración y demostración de permisos |

## Permisos por rol

| Rol | Permisos principales |
| --- | --- |
| `CLIENTE` | Consultar catálogo, crear pedidos y consultar sus propios pedidos |
| `OPERATOR` | Gestionar catálogo, crear pedidos y actualizar pedidos operativos |
| `ADMIN` | Gestionar catálogo, consultar todos los pedidos y actualizar estados |

La interfaz oculta o muestra acciones según el rol, pero la autorización real
debe validarse también en el backend mediante los claims del token.

## Documentación adicional

La guía [`docs/guia_entra_id_v2.html`](./docs/guia_entra_id_v2.html) contiene
los pasos detallados para configurar el tenant, registrar las aplicaciones,
crear roles y scopes, configurar el JWT Authorizer y resolver problemas de
CORS o autenticación.
