export const CATEGORIAS_FIJAS = ['Oficina', 'Tecnología', 'Hogar'] as const;

export const OPCION_NUEVA_CATEGORIA = '__nueva__';

/**
 * Normaliza una categoría escrita a mano: recorta espacios y deja
 * la primera letra en mayúscula, para reducir duplicados por casing
 * (ej. "oficina" y "Oficina" no deberían ser dos categorías distintas).
 */
export function normalizarCategoria(valor: string): string {
  const trimmed = valor.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}