export interface ComponenteDTO {
  nombreComponente: string;
  descripcion: string;
}

export interface ProveedorConComponentesDTO {
  nombreProveedor: string;
  nombreContacto: string;
  componentes: ComponenteDTO[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
