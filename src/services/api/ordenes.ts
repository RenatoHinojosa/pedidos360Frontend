import type { ApiClient } from './client';

export interface OrdenDTO {
  orderId: string;
  productId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: string;
  creadoPor: string;
  creadoPorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export async function listOrdenes(api: ApiClient) {
  const res = await api.get<{ ordenes: OrdenDTO[]; total: number }>('/orders');
  return res.ordenes;
}

export async function getOrden(api: ApiClient, orderId: string) {
  const res = await api.get<{ orden: OrdenDTO }>(`/orders/${orderId}`);
  return res.orden;
}

export async function createOrden(api: ApiClient, productId: string, cantidad: number) {
  const res = await api.post<{ mensaje: string; orden: OrdenDTO }>('/orders', { productId, cantidad });
  return res.orden;
}

export async function updateEstadoOrden(api: ApiClient, orderId: string, nuevoEstado: string) {
  const res = await api.patch<{ mensaje: string; orden: OrdenDTO }>(`/orders/${orderId}/estado`, { nuevoEstado });
  return res.orden;
}
