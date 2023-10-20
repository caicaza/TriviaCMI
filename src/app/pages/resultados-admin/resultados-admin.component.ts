import { Component } from '@angular/core';
import { PuntosJugador } from 'src/app/model/PuntosJugador';

@Component({
  selector: 'app-resultados-admin',
  templateUrl: './resultados-admin.component.html',
  styleUrls: ['./resultados-admin.component.css'],
})
export class ResultadosAdminComponent {
  testname: string = 'Carlos';
  testIniciales: string = '';
  numJugadores: number = 0;
  //Lista auxiliar para los jugadores
  listaJugadores: PuntosJugador[] = [
    {
      idUsuario: 0,
      iniciales: 'PP',
      usuario: 'Preuba preuba',
      rol: '',
      idSala: 0,
      sala: '',
      puntaje: 23,
      tiempo: 0,
      fecha_creacion: '',
      fecha_modificacion: '',
    },
  ];

  constructor() {
    this.testIniciales = this.obtenerIniciales(this.testname);
    this.numJugadores = this.listaJugadores.length;
  }

  obtenerIniciales(nombre: string) {
    // Divide el nombre en palabras utilizando espacio como separador
    const palabras = nombre.split(' ');

    // Verifica si hay al menos una palabra en el nombre
    if (palabras.length >= 1) {
      // Inicializa una variable para almacenar las iniciales
      let iniciales = '';
      if (palabras.length > 1) {
        // Recorre las palabras y obtiene las iniciales de las dos primeras
        for (let i = 0; i < Math.min(palabras.length, 2); i++) {
          const palabra = palabras[i];
          if (palabra.length > 0) {
            iniciales += palabra[0].toUpperCase();
          }
        }
      } else {
        for (let i = 0; i < palabras.length; i++) {
          const palabra = palabras[i];
          if (palabra.length > 0) {
            iniciales += palabra[0].toUpperCase();
          }
        }
      }
      return iniciales;
    } else {
      // En caso de que el nombre esté vacío o no contenga palabras
      return '';
    }
  }
}
