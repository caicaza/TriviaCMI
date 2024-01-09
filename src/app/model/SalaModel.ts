export interface Sala {
  idSala: number;
  nombre: string;
  imagen: string;
  descripcion: string;
  idModoJuego: number;
  modoJuego: string;
  estado: number;
  totalPreguntas: number;
  cantJugadas: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  fechaActivacion: string;
}

export interface SalaReciente {
  idSala: number;
  idUsuario: number;
}

export interface SalaJuego {
  idSala: number;
  idJugador: number;
  nombre: string;
  iniciales: string;
  posicion: number;
  estadoJuego: number;
}

export interface Pregunta {
  idPregunta: number;
  nombre: string;
  idSala: number;
  estado: number;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface Opcion {
  idOpcion: number;
  nombre: string;
  correcta: number; //0 para falso; 1 verdadero
  estado: number;
  idPregunta: number;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface Pregunta_OpcionList {
  pregunta: Pregunta;
  opcionList: Opcion[];
}
