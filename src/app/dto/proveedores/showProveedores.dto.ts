export interface ComponenteDTO {
  nombreComponente: string;
  descripcion: string;
}

export interface ProveedorConComponentesDTO {
  idProveedor: number;
  nombreProveedor: string;
  nombreContacto: string;

  telefono?: string;
  correo?: string;

  calle?: string;
  numero?: string;
  colonia?: string;
  ciudad?: string;
  estado?: string;
  codigoPostal?: string;
  pais?: string;

  componentes: ComponenteDTO[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProveedorConComponentesDTO {
  idProveedor: number;
  nombreProveedor: string;
  nombreContacto: string;
  componentes: ComponenteDTO[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
