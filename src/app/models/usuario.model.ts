
export class Usuario {
    constructor(
    public idUsuario: number,
    public nombre: string,
    public apellidoPaterno: string,
    public apellidoMaterno: string,
    public correo: string,
    public edad: number,
    public fechaRegistro: string, 
    public nivel: string,
    public pais: string,
    public passwordHash: string,
    public telefono: string
  ) {}
}