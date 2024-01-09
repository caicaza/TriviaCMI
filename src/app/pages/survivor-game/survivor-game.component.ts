import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/encryption.service';
import { PuntosJugador } from 'src/app/model/PuntosJugador';
import {
  Opcion,
  Pregunta,
  Pregunta_OpcionList,
  SalaJuego,
} from 'src/app/model/SalaModel';
import { UsuarioSalaService } from 'src/app/services/usuario-sala.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MessageService } from 'primeng/api';
import { ConstantsService } from 'src/app/constants.service';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SalaJuegoService } from 'src/app/services/sala-juego.service';
import { PreguntaService } from 'src/app/services/pregunta.service';

declare var bootstrap: any;

@Component({
  selector: 'app-survivor-game',
  templateUrl: './survivor-game.component.html',
  styleUrls: ['./survivor-game.component.css'],
  providers: [MessageService],
  animations: [
    trigger('jugadoresChanged', [
      state('changed', style({ transform: 'scale(1.2)' })),
      transition('* => changed', [animate('0.2s')]),
    ]),
  ],
})
export class SurvivorGameComponent implements OnInit, AfterViewInit, OnDestroy {
  respElejigas: number[] = [0, 0, 0, 0];
  mostrarNumResp = false;
  txtJugadorX = 'Jugadores';

  tiempoPregunta = 14;
  msjContadorStart = false;

  eliminadosSave: SalaJuego[] = [];

  //Menjase error
  Mensaje_error: string = 'Respuesta equivocada';

  //Para el modal

  mostrarAlert = false;
  mostrarWrongAlert = false;
  modalElement: any;
  modal: any;
  mostrarMsjAnalisis: boolean = false;

  //Para colocar las preguntas
  preguntaActual: Pregunta = {
    idPregunta: 0,
    nombre: 'Mi primera Pregunta de prueba',
    idSala: 0,
    estado: 0,
    fecha_creacion: '',
    fecha_modificacion: '',
  };

  opcioTest1: Opcion = {
    idOpcion: 1,
    nombre: 'Primera opción para responder a la pregunta',
    correcta: 0,
    estado: 0,
    fecha_creacion: '',
    fecha_modificacion: '',
    idPregunta: 0,
  };

  opcioTest2: Opcion = {
    idOpcion: 2,
    nombre: 'Segunda opción para responder a la pregunta',
    correcta: 1, //0 para falso; 1 verdadero
    estado: 0,
    fecha_creacion: '',
    fecha_modificacion: '',
    idPregunta: 0,
  };

  preguntaOpcionActual: Pregunta_OpcionList = {
    pregunta: this.preguntaActual,
    opcionList: [this.opcioTest1, this.opcioTest2, this.opcioTest1],
  };
  preguntaOpcionTest: Pregunta_OpcionList = {
    pregunta: this.preguntaActual,
    opcionList: [this.opcioTest1, this.opcioTest2],
  };

  listaDePreguntas: Pregunta_OpcionList[] = [];

  // PARA LAS PREGUNTAS
  preguntaTexto: string = '';
  actualOpcionList: any[] = [];
  botonSeleccionado: boolean[] = [];

  numPreguntasContestadas: number = 0;
  puntosGanados: number = 0;
  puedeResponder: boolean = true;

  //PARA LA SALA
  numerodeJugadores: number = 0;
  AuxNumerodeJugadores: number = 0;
  auxMuertos = 0;

  //sala y usuario

  idSala: number = 0;
  idUsuario: number = 0;

  puntosJugador: PuntosJugador = {
    idUsuario: 0,
    iniciales: 'PP',
    usuario: 'Prueba prueba',
    rol: '',
    idSala: 0,
    sala: '',
    puntaje: 23,
    tiempo: 0,
    fecha_creacion: '',
    fecha_modificacion: '',
  };
  //TEMPORIZADOR Y SUMA DEL TIEMPO QUE SE DEMORQA EN RESPONDER

  numIntervaloImg: number = 4;
  countdown: number = this.tiempoPregunta; // Temporizador principal en segundos

  mainTimerInterval: any;
  userClicked: boolean = false;
  startTime: Date = new Date('2023-10-10T10:00:00');
  userClickTime: Date = new Date('2023-10-10T10:00:00');

  tiempoDelJugador: number = 0;
  isTimerRunning: boolean = false;

  juegoTerminado: boolean = false;

  //Tiempo
  tiempoMostrarPrimerModal: number = 5000;
  tiempoMostrarModal: number = 12000;
  tiempoMostrarRespuesta: number = 4500;
  tiempoMostrarOtraPregunta: number = 5500;

  //MUSICA
  musicaFondo: HTMLAudioElement | null = null;

  //@Input() PreguntasList: Pregunta_OpcionList[] = [];

  //Circulos de nuevos jugadores
  circles: { left: number; top: number }[] = [];
  texts: string[] = ['AB', 'DC', 'CMI', 'AC'];
  names: string[] = [''];

  //Jugadores Eliminados
  //idJugador = 0;
  //jugadoresSala: SalaJuego[] = [];
  mostrarEspera: boolean = false;
  isLife: boolean = true;
  isUltimoenPie: boolean = false;
  numerodeEliminados = 0;
  txtEliminados = 'Eliminados';

  //Para una pequeña animacion
  animationState = '';

  //Para repetir pregunta
  repetirPregunta = false;

  //identificar si usuario gano
  ganoJugador = false;

  //Para cambiar la imagen de al fondo
  mostrarJugadorVivo = true;
  imgJugadorVivo = 'assets/Imagenes Juego/S3CirculoPlayer.png';
  imgJugadorMuerto = 'assets/Imagenes Juego/jugadorMuerto.png';
  imgXEliminado = 'assets/Imagenes Juego/JugadorXEliminado.png';
  mostrarEliminados = false;
  msjResultados = '';
  msjR1 = 'Obteniendo Resultados de otros jugadores';
  msjR2 = 'Revisando Resultados';

  //Musica compuesta
  playlist: string[] = [
    'assets/musicAndSFX/EpicPower_Inicio.mp3',
    'assets/musicAndSFX/Epic_Power_Loop.mp3',
  ];
  currentTrackIndex: number = 0;

  //NUEVA LISTA
  jugadoresSurvivor: SalaJuego[] = [];

  jugador: SalaJuego = {
    idSala: 0,
    idJugador: 0,
    nombre: 'prueba',
    iniciales: 'MM',
    posicion: 0,
    estadoJuego: 0,
  };

  //Temporizador para revisar los resultados
  timer: any;
  remainingTime = 6; // Tiempo en segundos
  valorKnob = 0;

  //Mostrar jugador o jugadores
  jugadorYo = true;
  inicialesYo = '';
  viewotrosjugadores = true;
  fondoPreguntas = true;

  //Mensajes
  isNadiePerdio = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private encryptionService: EncryptionService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioSalaService: UsuarioSalaService,
    private usuarioService: UsuarioService,
    private salaJuegoService: SalaJuegoService,
    private preguntaServicio: PreguntaService,
    private constantsService: ConstantsService,
    private messageService: MessageService
  ) {
    this.numPreguntasContestadas = 0;
    this.puntosGanados = 0;
    this.puedeResponder = true;
    this.tiempoDelJugador = 0; //Tiempo que se demora en contestar las preguntas, esto se acumula
  }
  ngOnInit() {
    //MUSICA COMPUESTA
    this.playCurrentTrack();

    this.idUsuario = parseInt(this.usuarioService.getIdUsuario()!);

    this.route.queryParams.subscribe((params) => {
      let idSala = this.encryptionService.decrypt(params['idSala']);
      if (idSala === '') {
        history.back();
      }
      this.idSala = parseInt(idSala);
    });

    //Obtengo nuevos jugadores
    //this.getNumJugadoresNuevos();
    this.getListaBD(1); //ACTIVAR CUANDO TERMINES DE TESTEAR <------------

    //Test para ve el numero cambiado
    /* setTimeout(() => {      
      this.updateNumJugadores(this.numerodeJugadores);
    }, 2500); */

    setTimeout(() => {
      this.jugadorYo = false;
      this.viewotrosjugadores = false;
      this.mostrarModal(); //ACTIVAR CUANDO TERMINES DE TESTEAR <------------
    }, this.tiempoMostrarPrimerModal);

    /*      for (let i = 0; i < 6; i++) {
      this.listaDePreguntas.push(this.preguntaOpcionActual);
    } 

    for (let i = 0; i < 40; i++) {
      this.jugadoresSurvivor.push(this.jugador);      
      
    } */
    this.listPreguntas(this.idSala); //ACTIVAR CUANDO TERMINES DE TESTEAR <------------

    //Para las imagenes de los edificios principales
    this.rellenarPregunta(1);

    //this.generarCirculos(4);
  }
  ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.stopTimer();
    this.modal.hide();
  }

  listPreguntas(idSala: number) {
    this.preguntaServicio.PregListOpList(1, idSala).subscribe({
      next: (data: any) => {
        const { error, list } = data.result;
        if (error === 0) {
          this.listaDePreguntas = list;
        }
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  //Para musica compuesta
  playCurrentTrack() {
    this.musicaFondo = new Audio();
    this.musicaFondo.src = this.playlist[this.currentTrackIndex];
    this.musicaFondo.load();
    this.musicaFondo.play();
    this.musicaFondo.volume = 0.25;
    this.musicaFondo.onended = () => {
      if (this.currentTrackIndex === 0) {
        this.currentTrackIndex = 1; // Pasa a la segunda pista
        this.playCurrentTrack();
      } else {
        // Reproduce la segunda pista en bucle
        if (this.musicaFondo) {
          this.musicaFondo.play();
        }
      }
    };
  }

  updateNumJugadores(nuevoNumero: number) {
    console.log('Jugadores ' + nuevoNumero);
    this.animationState = 'changed';
    this.numerodeJugadores = nuevoNumero;

    setTimeout(() => {
      this.animationState = '';
    }, 200); // Restablece la animación después de 200 ms
  }

  /* async getNumJugadoresNuevos() {
    //Obtener nuevo jugadores de la bd
    //let listaJugadoresBD = await this.getListaBD();
    //console.log('listajugadores => ', listaJugadoresBD);
    //this.updateNumJugadores(listaJugadoresBD.length);
    //Comparar la lista de bd con la lista guardada
    let listaNuevos = this.jugadoresSala.filter((elemento1) => {
      return !listaJugadoresBD.some(
        (elemento2) => elemento2.idJugador == elemento1.idJugador
      );
    });
    if (listaNuevos.length > 0) {
      //Si hay nuevo jugadores los guardo en mi lista jugadores Sala
      console.log('listanuevos:', listaNuevos);
      this.jugadoresSala = listaJugadoresBD;
      const textsAux: string[] = [];

      for (let i = 0; i < listaNuevos.length; i++) {
        textsAux.push(listaNuevos[i].iniciales);
      }
      //actualizo la lista de texto de los circulos animados
      this.texts = textsAux;
      this.generarCirculos(listaNuevos.length);
    }
  } */

  /* getNumJugadoresMuertos() {
    console.log('Jugadores muertos');
    //Obtener nuevo jugadores de la bd
    const listaJugadoresBD = this.getListaBD(0);
    console.log('muertos', listaJugadoresBD.length);
    const PosicionActual = this.numPreguntasContestadas;

    //Comparar la lista de bd con la lista guardada

    const valorInicial: {
      jugadoresMuertos: SalaJuego[];
      jugadoresVivos: SalaJuego[];
    } = { jugadoresMuertos: [], jugadoresVivos: [] };

    const { jugadoresMuertos, jugadoresVivos } = listaJugadoresBD.reduce(
      (result, jugador) => {
        if (jugador.posicion < PosicionActual) {
          result.jugadoresMuertos.push(jugador);
        } else {
          result.jugadoresVivos.push(jugador);
        }
        return result;
      },
      valorInicial
    );

    this.updateNumJugadores(jugadoresVivos.length);

    //Si solo hay un jugador vivo <-- comprobar si este usuario ganó
    const idJugador = this.usuarioService.getIdUsuario();

    if (jugadoresVivos.length == 1) {
      if (jugadoresVivos[0].idJugador.toString() == idJugador) {
        this.ganoJugador = true;
      }
    }

    if (jugadoresVivos.length == 0) {
      this.repetirPregunta = true;
    }

    let nuevosMuertos = jugadoresMuertos.filter(
      (item1) =>
        !this.eliminadosSave.find(
          (item2) => item1.idJugador === item2.idJugador
        )
    );
    this.eliminadosSave = jugadoresMuertos;

    this.numerodeEliminados = nuevosMuertos.length;

    console.log(jugadoresMuertos);
    console.log(nuevosMuertos);
    console.log(nuevosMuertos.length);

    if (nuevosMuertos.length > 0) {
      if (nuevosMuertos.length == 1) {
        this.txtJugadorX = 'Jugador';
      } else {
        this.txtJugadorX = 'Jugadores';
      }

      //this.jugadoresSala=listaJugadoresBD;
      const textsAux: string[] = [];

      for (let i = 0; i < nuevosMuertos.length; i++) {
        textsAux.push(nuevosMuertos[i].iniciales);
      }
      //actualizo la lista de texto de los circulos animados
      this.texts = textsAux;
      setTimeout(() => {
        this.generarCirculos(nuevosMuertos.length);
      }, 2500);
    }
  } */

  getListaBD(vistaCirculos: number) {
    // console.log('Ingreso de jugadores :D');

    let listaJugadoresBD: SalaJuego[] = []; //Lista de la bd de jugadores

    this.salaJuegoService.getList(this.idSala, 0).subscribe({
      next: (data: any) => {
        let { error, info, lista } = data.result;
        if (error === 0) {
          listaJugadoresBD = lista;

          let jugador: SalaJuego = listaJugadoresBD.find((element) => {
            return element.idJugador === this.idUsuario;
          })!;

          this.jugador = jugador;

          if (listaJugadoresBD.length > 0) {
            let jugadoresMuertos: SalaJuego[] = listaJugadoresBD.filter(
              (elemento1) => {
                if (elemento1.estadoJuego === 0) {
                  return elemento1;
                }
                return null;
              }
            );

            let jugadoresVivos: SalaJuego[] = listaJugadoresBD.filter(
              (elemento1) => {
                if (elemento1.estadoJuego === 1) {
                  return elemento1;
                }
                return null;
              }
            );

            this.numerodeJugadores = jugadoresVivos.length;

            //console.log('JUGADORES', jugadoresMuertos, jugadoresVivos);

            this.numerodeEliminados = jugadoresMuertos.length;
            if (jugadoresMuertos.length == this.auxMuertos) {
              this.isNadiePerdio = true;
              this.auxMuertos = jugadoresMuertos.length;
            }

            if (vistaCirculos === 0) {
              console.log(jugadoresMuertos.length);
              if (jugadoresMuertos.length > 0) {
                //this.isNadiePerdio=false;
                this.jugadoresSurvivor = jugadoresMuertos; //Actualizo mi for del html
                //this.txtJugadorX = 'Jugadores';
              } else {
                //console.log(this.isNadiePerdio);
                //this.isNadiePerdio=true;
                this.jugadoresSurvivor = []; //Vacio el for
                //this.txtJugadorX = 'Jugador';
                //console.log(this.isNadiePerdio);
              }

              const textsAux: string[] = [];
              const namesAux: string[] = [];
              for (let i = 0; i < jugadoresMuertos.length; i++) {
                textsAux.push(jugadoresMuertos[i].iniciales);

                //PARA LOS NOMBRES
                // Divide el texto en palabras
                const nombres = jugadoresMuertos[i].nombre.split(' '); //CAMBIAR ESTA PARTE NO HAY NOMBRES

                // Toma las dos primeras palabras y las une
                const nombres2p = nombres.slice(0, 2).join(' ');
                namesAux.push(nombres2p);
              }
              //actualizo la lista de texto de los circulos animados
              this.texts = textsAux;
              this.names = namesAux;
            } else if (vistaCirculos === 1) {
              this.jugadoresSurvivor = jugadoresVivos; //Actualizo mi for del html
              const textsAux: string[] = [];
              const namesAux: string[] = [];
              for (let i = 0; i < jugadoresVivos.length; i++) {
                textsAux.push(jugadoresVivos[i].iniciales);

                //PARA LOS NOMBRES
                // Divide el texto en palabras
                const nombres = jugadoresMuertos[i].nombre.split(' '); //CAMBIAR ESTA PARTE NO HAY NOMBRES

                // Toma las dos primeras palabras y las une
                const nombres2p = nombres.slice(0, 2).join(' ');
                namesAux.push(nombres2p);
              }
              //actualizo la lista de texto de los circulos animados
              this.texts = textsAux;
              this.names = namesAux;
            }

            if (jugadoresVivos.length == 1) {
              this.ganoJugador = true;
            }
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.constantsService.mensajeError(),
            detail: 'ha ocurrido un error con la conexión',
          });
        }
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  sendResultadoBD() {
    console.log('mis resultados');
    let auxEstadoJuego = 0;
    // si es true contestó bien sigue vivo, pero si es false contestó mal esta muerto
    if (this.isLife) {
      auxEstadoJuego = 1;
    } else {
      auxEstadoJuego = 0;
    }

    let juego = {
      idSala: this.idSala,
      idJugador: this.idUsuario,
      nombre: 'prueba',
      iniciales: 'PP',
      posicion: 0,
      estadoJuego: auxEstadoJuego,
    };

    this.salaJuegoService.updateItem(juego).subscribe({
      next: (data: any) => {
        let { error } = data.result;
        if (error == 0) {
          console.log('Posicion actualizada');
        }
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  generarCirculos(numCircles: number) {
    this.mostrarJugadorVivo = true;
    const circlesAux: { left: number; top: number }[] = [];

    const minDistance = 50;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < numCircles; i++) {
      const circle = {
        left: this.getRandomNumber(50, window.innerWidth - 50), // Asegura que no se desborde en el ancho de la ventana
        top: this.getRandomNumber(50, window.innerHeight - 50), // Asegura que no se desborde en la altura de la ventana
      };
      circlesAux.push(circle);
    }
    this.circles = circlesAux;

    if (this.numPreguntasContestadas + 1 > 1) {
      setTimeout(() => {
        this.mostrarJugadorVivo = false;
      }, 1500);
    }
  }

  getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  mostrarModal() {
    //this.sidebarVisible4 = false;
    //this.value++;
    this.mostrarEliminados = false;
    this.modalElement = this.el.nativeElement.querySelector('#exampleModal');
    this.modal = new bootstrap.Modal(this.modalElement);
    this.resetTimer();
    const mainBody = document.getElementById('main-body');
    if (mainBody) {
      mainBody.style.overflowY = 'hidden';
    }
    //Cambiamos las imgs de la parte de arriba
    this.fondoPreguntas = true;
    this.viewotrosjugadores = false;

    this.isNadiePerdio = false;
    this.modal.show();
    //this.musicaFondo.play();
    //TIEMPO
    this.startTime = new Date(); //CAPTURAMOS LA HORA QUE EMPIEZA EN MILISEGUNDOS
  }

  closeModal(id: number) {
    if (this.puedeResponder) {
      this.restartTimerKnob();
      this.msjResultados = this.msjR1;
      //this.userClicked = true;
      this.mostrarEspera = true;
      //this.stopTimer(); // Detiene el temporizador principal
      this.userClickTime = new Date();
      this.puedeResponder = false;

      this.botonSeleccionado[id] = true;
      const respuestaSeleccionada = this.actualOpcionList[id];
      this.tiempoDelJugador =
        this.userClickTime.getTime() - this.startTime.getTime();
      //console.log(this.tiempoDelJugador);
      this.mostrarMsjAnalisis = true;

      if (respuestaSeleccionada.correcta == 1) {
        this.puntosGanados++;
        this.isLife = true;
      } else {
        this.Mensaje_error = 'Respuesta equivocada';
        this.isLife = false;
      }

      // this.numPreguntasContestadas++;

      this.sendResultadoBD();
    }
  }

  //Despues del temporizador pregunta bien y mal contestada me controlaran las siguientes

  preguntaMalConstestada() {
    const indexCorrecto = this.actualOpcionList.findIndex(
      (item) => item.correcta === 1
    ); //Obtengo la id del correcto
    this.botonSeleccionado[indexCorrecto] = true; //Activo al correcto

    this.mostrarEspera = true; //Mostrar cuanso se acaba el tiempo

    this.msjResultados = this.msjR2;
    this.isLife = false;

    //Mostramos resultados
    setTimeout(() => {
      this.mostrarNumResp = true;
      this.mostrarEspera = false;
      this.mostrarWrongAlert = true;
      this.reproducirSonido('assets/musicAndSFX/QuizWrong.wav');
    }, this.tiempoMostrarRespuesta);

    //Cerramos el modal
    setTimeout(() => {
      this.isNadiePerdio = false;
      //Cambiamos las imgs de la parte de arriba
      this.fondoPreguntas = false;
      this.viewotrosjugadores = true;

      this.mostrarNumResp = false;
      this.mostrarWrongAlert = false;
      this.modal.hide();
      //this.numPreguntasContestadas++;
      this.puedeResponder = true;
      this.countdown = this.tiempoPregunta;
      this.onClickCambiar();
    }, this.tiempoMostrarRespuesta + 5500); // 3000 milisegundos = 3 segundos
  }

  preguntaBienContestada() {
    this.msjResultados = this.msjR2;

    this.mostrarEspera = true;

    //Mostramos resultados
    setTimeout(() => {
      this.mostrarNumResp = true;
      this.mostrarEspera = false;
      this.mostrarAlert = true;
      this.reproducirSonido('assets/musicAndSFX/QuizCorrect.wav');
    }, this.tiempoMostrarRespuesta);

    setTimeout(() => {
      //this.isNadiePerdio=false;
      //Cambiamos las imgs de la parte de arriba
      this.fondoPreguntas = false;
      this.viewotrosjugadores = true;

      this.mostrarNumResp = false;
      this.mostrarAlert = false;
      this.modal.hide();
      this.puedeResponder = true;
      this.countdown = this.tiempoPregunta;
    }, this.tiempoMostrarRespuesta + 5500);
  }

  pasarAOtraPregunta() {
    setTimeout(() => {
      this.mostrarEliminados = true;
    }, 3000);

    if (this.repetirPregunta) {
      setTimeout(() => {
        this.generarCirculos(2);
      }, this.tiempoMostrarOtraPregunta);
    }

    //Si toca repetir pregunta restamos 1 pregunta contestada
    if (this.repetirPregunta) {
      this.numPreguntasContestadas--;
    }

    //Pasamos a la siguiente pregunta
    //Si gano jugador, terminar juego
    if (this.ganoJugador) {
      setTimeout(() => {
        this.onClickCambiar();
      }, 5000);
    } else {
      //Si aun no gana continuar con las preguntas
      if (this.numPreguntasContestadas + 1 < this.listaDePreguntas.length) {
        setTimeout(() => {
          this.rellenarPregunta(this.numPreguntasContestadas + 1);
        }, this.tiempoMostrarModal - 100);

        setTimeout(() => {
          this.mostrarModal();
        }, this.tiempoMostrarModal);
      } else {
        setTimeout(() => {
          this.onClickCambiar();
        }, 5000);
      }
    }
  }

  rellenarPregunta(numPregunta: number) {
    //console.log(numPregunta);
    setTimeout(() => {
      this.quitarSeleccionado();
      const PreguntaActual = this.listaDePreguntas[numPregunta - 1];
      this.preguntaTexto = PreguntaActual.pregunta.nombre;
      this.actualOpcionList = PreguntaActual.opcionList;
    }, 1000);
  }

  quitarSeleccionado() {
    const reiniciarSeleccionados: boolean[] = [];
    for (let i = 0; i < this.actualOpcionList.length; i++) {
      reiniciarSeleccionados.push(false);
    }
    this.botonSeleccionado = reiniciarSeleccionados;
  }

  reproducirSonido(nombreArchivo: string) {
    const audio = new Audio();
    audio.src = nombreArchivo;
    audio.load();
    audio.play();
  }

  //para el temporizador
  startMainTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true; // Marca que el temporizador está en funcionamiento
      this.countdown = this.tiempoPregunta; // Restablece el tiempo en segundos
      this.mainTimerInterval = setInterval(() => {
        if (!this.userClicked) {
          this.countdown--; // Temporizador principal disminuye en segundos
        }
        if (this.countdown <= 0) {
          this.numPreguntasContestadas++;

          if (this.isLife) {
            if (!this.puedeResponder) {
              this.preguntaBienContestada();
            }
          } else {
            this.preguntaMalConstestada();
          }
          if (this.puedeResponder) {
            console.log('No respondió');
            this.isLife = false;
            this.sendResultadoBD();
            this.userClickTime = new Date();
            this.preguntaMalConstestada();
            this.Mensaje_error = 'Se acabo el tiempo';
          }

          this.puedeResponder = false;
          this.userClicked = true;
          //this.preguntaMalConstestada();

          this.stopTimer();

          setTimeout(() => {
            console.log('jugadores muertos');
            //this.getNumJugadoresMuertos();
            this.getListaBD(0);
          }, 1000);

          /* if (this.isLife || this.repetirPregunta) {
            setTimeout(() => {
              this.pasarAOtraPregunta();
            }, 3000);
          } */
          if (this.isLife) {
            setTimeout(() => {
              this.pasarAOtraPregunta();
            }, 3000);
          }
        }
      }, 1000); // El temporizador principal se actualiza cada segundo (1000 ms)
    }
  }

  stopTimer() {
    clearInterval(this.mainTimerInterval); // Detiene el temporizador principal
    //this.countdown=20;
    this.isTimerRunning = false; // Marca que el temporizador ya no está en funcionamiento
  }

  resetTimer() {
    this.countdown = 20; // Reiniciar el tiempo en segundos
    this.userClicked = false; // Reiniciar el estado del usuario
    this.startMainTimer(); // Iniciar nuevamente el temporizador principal
  }

  onClickCambiar() {
    this.juegoTerminado = true;

    //RESULTADO RECOPILADOS
    console.log('Tiempo transcurrido=' + this.tiempoDelJugador);
    console.log('Puntos Jugador=' + this.puntosGanados);
    console.log('Juego terminado=' + this.juegoTerminado);

    this.puntosJugador.idUsuario = this.idUsuario;
    this.puntosJugador.idSala = this.idSala;
    this.puntosJugador.puntaje = this.puntosGanados;
    this.puntosJugador.tiempo = this.tiempoDelJugador;

    //Cuando finalicé el juego directo a esta ventana
    this.musicaFondo?.pause();
    // @ts-ignore
    this.musicaFondo.currentTime = 0;
    //this.numVentanaH.emit(3); //1 para la ventana inicio sala, 2 para el juego y 3 para la ventana de resultados

    this.guardarPuntaje(this.puntosJugador);
  }

  guardarPuntaje(puntosJugador: PuntosJugador) {
    this.usuarioSalaService.crearRanking(puntosJugador).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        if (error > 0) {
          this.messageService.add({
            severity: 'error',
            summary: this.constantsService.mensajeError(),
            detail: 'ha ocurrido un error con la conexión',
          });
        } else {
          if (this.isLife) {
            //this.cambiarPag('/RankingChallengers', this.idSala, this.idUsuario, isWinner);
            this.cambiarPag('/SurvivorResult', this.idSala, this.idUsuario, 1);
          } else {
            this.cambiarPag('/SurvivorResult', this.idSala, this.idUsuario, 0);
          }
        }
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  cambiarPag(ruta: string, id: number, id2: number, gano: number) {
    let idSala = this.encryptionService.encrypt(id.toString());
    let idUsuario = this.encryptionService.encrypt(id2.toString());
    let isWinner = this.encryptionService.encrypt(gano.toString());
    let params = { idSala, idUsuario, isWinner };
    this.router.navigate([ruta], { queryParams: params });
  }

  // Función para iniciar o reiniciar el temporizador
  startTimerKnob() {
    const tiempoRecogido = this.countdown + 2;
    if (this.timer) {
      clearInterval(this.timer); // Detiene el temporizador anterior si existe
    }

    this.timer = setInterval(() => {
      if (this.remainingTime === 0) {
        this.valorKnob = 100;
        clearInterval(this.timer); // Detiene el temporizador después de 6 segundos
        // Puedes realizar alguna acción aquí cuando el temporizador llegue a cero
      } else {
        let valor = Math.round(this.valorKnob + 100 / tiempoRecogido);
        if (valor > 100) {
          valor = 100;
        }
        this.valorKnob = valor; // Aumenta el valor en 100/6 (aproximadamente 16.67%) cada segundo
        this.remainingTime -= 1;
      }
    }, 1000);
  }

  // Función para reiniciar el temporizador
  restartTimerKnob() {
    const tiempoRecogido = this.countdown + 2;
    this.valorKnob = 0;
    this.remainingTime = tiempoRecogido; // Reinicia el tiempo a 6 segundos
    this.startTimerKnob(); // Inicia el temporizador nuevamente
  }
}
