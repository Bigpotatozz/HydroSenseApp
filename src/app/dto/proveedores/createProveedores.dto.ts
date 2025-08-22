export interface ComponenteRegistroDTO {
  nombreComponente: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

export interface ProveedorRegistrarDTO {
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

  componentes: ComponenteRegistroDTO[];
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

  componentes: ComponenteRegistroDTO[];
}

export interface RegistroProveedorResponse {
  success: boolean;
  message: string;
  data?: {
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

    componentes: {
      idComponente: number;
      nombreComponente: string;
      descripcion: string;
      precio: number;
      cantidad: number;
    }[];
  };
}
