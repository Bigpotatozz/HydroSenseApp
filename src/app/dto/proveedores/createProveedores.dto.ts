
export interface ComponenteRegistroDTO {
  nombreComponente: string;
  descripcion: string;
  precio: number; 
  cantidad: number; 
}

export interface ProveedorConComponentesDTO {
  nombreProveedor: string;
  nombreContacto: string;
  componentes: ComponenteRegistroDTO[];
}

export interface RegistroProveedorResponse {
  success: boolean;
  message: string;
  data?: {
    idProveedor: number;
    nombreProveedor: string;
    nombreContacto: string;
    componentes: {
      idComponente: number;
      nombreComponente: string;
      descripcion: string;
      precio: number;
      cantidad: number;
    }[];
  };
}
