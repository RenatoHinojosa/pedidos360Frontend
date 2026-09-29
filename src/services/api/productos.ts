import type { ApiClient } from './client';

export interface ProductoDTO {
  productId: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion?: string;
}

export interface ProductoInput {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion?: string;
}

export async function listProductos(api: ApiClient, categoria?: string) {
  const query = categoria ? `?categoria=${encodeURIComponent(categoria)}` : '';
  const res = await api.get<{ productos: ProductoDTO[]; total: number }>(`/productos${query}`);
  return res.productos;
}

export async function getProducto(api: ApiClient, productId: string) {
  const res = await api.get<{ producto: ProductoDTO }>(`/productos/${encodeURIComponent(productId)}`);
  return res.producto;
}

export async function createProducto(api: ApiClient, data: ProductoInput) {
  const res = await api.post<{ mensaje: string; producto: ProductoDTO }>('/productos', data);
  return res.producto;
}

export async function updateProducto(api: ApiClient, productId: string, data: ProductoInput) {
  const res = await api.put<{ mensaje: string; producto: ProductoDTO }>(`/productos/${encodeURIComponent(productId)}`, data);
  return res.producto;
}

export async function deleteProducto(api: ApiClient, productId: string) {
  return api.del<{ mensaje: string }>(`/productos/${encodeURIComponent(productId)}`);
}