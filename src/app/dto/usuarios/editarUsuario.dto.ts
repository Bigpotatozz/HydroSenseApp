export class EditarUsuarioDto {

    constructor(
        public nombre: string,
        public apellidoPaterno: string,
        public apellidoMaterno: string,
        public edad: number,
        public pais: string,
        public correo: string,
        public contrasenia: string,
        public telefono: string
    ){}

}