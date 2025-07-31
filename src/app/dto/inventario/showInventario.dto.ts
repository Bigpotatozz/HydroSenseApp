export interface ComponenteInventarioDTO {
  nombreComponente: string;
  cantidad: number;
  precio: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
