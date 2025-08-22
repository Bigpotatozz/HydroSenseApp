export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ItemCotizadoDTO {
  tipo: 'sistema' | 'componente';
  idSistema?: number;
  idComponente?: number;
  nombre: string;
  precio: number;
}

export interface CotizacionResumenDTO {
  idCotizacion: number;
  nombreContacto: string;
  correoElectronico: string;
  situacionDetallada: string;
  estatus: number;
  items: ItemCotizadoDTO[];
  total: number;
}
