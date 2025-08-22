export interface UsuarioDTO {
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
}

export interface ProductoVentaDTO {
  id: number;
  nombre: string;
  tipo: 'sistema' | 'componente';
  cantidadDisponible: number;
  precioUnitario?: number;
}

export interface DetalleVentaForm {
  productoSeleccionado: ProductoVentaDTO | null;
  cantidad: number | null;
  nota?: string;
  stockActual: number;
}

export interface VentaDTO {
  idCliente: number | null;
  fechaVenta: string;
  detalles: {
    idComponente?: number;
    idSistema?: number;
    cantidad: number;
    nota?: string;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
