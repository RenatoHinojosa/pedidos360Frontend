export type AppRole = 'ADMIN' | 'OPERATOR' | 'CLIENTE';

export function resolveAppRole(roles: string[] | undefined): AppRole {
  const normalizedRoles = (roles ?? []).map((role) => role.toUpperCase());
  if (normalizedRoles.includes('ADMIN')) return 'ADMIN';
  if (normalizedRoles.includes('OPERATOR') || normalizedRoles.includes('OPERADOR')) return 'OPERATOR';
  return 'CLIENTE';
}

export function canManageOrders(role: AppRole): boolean {
  return role === 'ADMIN' || role === 'OPERATOR';
}

export function canCreateOrders(role: AppRole): boolean {
  return role === 'CLIENTE' || role === 'OPERATOR';
}

export function canManageCatalog(role: AppRole): boolean {
  return role === 'ADMIN' || role === 'OPERATOR';
}