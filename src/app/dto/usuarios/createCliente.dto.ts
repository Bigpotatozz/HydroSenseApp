export interface UsuarioRegistroDTO {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  edad: number;
  pais: string;
  correo: string;
  contrasenia: string;
  telefono: string;
  nivel: string;
}
