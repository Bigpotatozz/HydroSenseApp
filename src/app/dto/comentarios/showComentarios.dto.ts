export interface Comentario {
  idComentario: number;
  nombreUsuario: string;
  nombreSistema: string;
  comentario: string;
  respuesta: string | null;
}

export interface ResponderComentarioDTO {
  idComentario: number;
  respuestaTexto: string;
}

