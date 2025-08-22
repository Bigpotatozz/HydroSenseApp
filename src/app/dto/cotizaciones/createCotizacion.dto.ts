export interface DetalleCotizacionItem {
  idSistema?: number;
  idComponente?: number;
  nota?: string;
}

export class CreateCotizacion {
  constructor(
    public nombreContacto: string,
    public correoElectronico: string,
    public situacionDetallada: string,
    public productos: DetalleCotizacionItem[] = []
  ) { }
}


export interface ResponderCotizacionDTO {
  mensaje: string;
}
