export interface ComponenteSimpleDTO {
  nombreComponente: string;
  cantidadRequerida: number;
  cantidadDisponible: number;
}

export interface SistemaProduccionDTO {
  idSistema: number;
  nombreSistema: string;
  sistemasDisponibles: number;
  componentes: ComponenteSimpleDTO[];
  costoTotalProduccion: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
