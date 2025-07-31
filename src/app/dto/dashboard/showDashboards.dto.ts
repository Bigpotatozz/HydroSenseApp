// src/app/dto/dashboard/dashboard.dto.ts
export interface ProductoPorMesDTO {
  producto: string;
  cantidadVendida: number;
}

export interface VentasPorVendedorDTO {
  vendedor: string;
  totalVentas: number;
}

export interface VentasPorMesDTO {
  mes: string;
  totalVentas: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
