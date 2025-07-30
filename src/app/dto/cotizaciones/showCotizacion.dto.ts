export interface CotizacionResumenDTO {
  idCotizacion: number;
  nombreContacto: string;
  correoElectronico: string;
  situacionDetallada: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
