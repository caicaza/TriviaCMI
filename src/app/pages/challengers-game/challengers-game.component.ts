import {
  Component,
  HostListener,
  Renderer2,
  ElementRef,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import {
  Opcion,
  Pregunta,
  Pregunta_OpcionList,
  SalaJuego,
} from 'src/app/model/SalaModel';
import { Options, LabelType } from 'ngx-slider-v2';
import { EncryptionService } from 'src/app/encryption.service';
import { Router } from '@angular/router';
import { UsuarioSalaService } from 'src/app/services/usuario-sala.service';
import { PuntosJugador } from 'src/app/model/PuntosJugador';
import { ConstantsService } from 'src/app/constants.service';
import { MessageService } from 'primeng/api';
import { JuegoChallenger } from 'src/app/model/JuegoChallenger';
import { SalaJuegoService } from 'src/app/services/sala-juego.service';

declare var bootstrap: any;
declare var LeaderLine: any;

@Component({
  selector: 'app-challengers-game',
  templateUrl: './challengers-game.component.html',
  styleUrls: ['./challengers-game.component.scss'],
  providers: [MessageService],
})
export class ChallengersGameComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  //SIDEBAR
  sidebarVisible4: boolean = true;

  //controlar un error
  marginLeftValues: number[] = [];

  //Para mover el carro
  numXtraslacion: number[] = [
    10, -35, -70, -50, -5, 32, 15, -25, -65, -55, -20, 20, 25, -15, -55, -65,
    -35, 15, 35,
  ];
  altura: number = 116;
  contadorCiclo: number = 0;
  maximoContador: number = 19;

  isEdificioPar: boolean = true;

  @ViewChild('elementoVehiculo', { static: true })
  elementoVehiculo?: ElementRef;

  lineas: any[] = [];
  container = document.getElementById('containerFondo');
  @ViewChildren('elementoImagen') elementosImagen?: QueryList<ElementRef>;

  @Output() numVentanaH = new EventEmitter<number>();
  @Input() PreguntasList: Pregunta_OpcionList[] = [];
  @Input() idJugador: number = 0;

  EdificiosCount: number[] = [];

  //mostrarModal: boolean = false;

  //Ruta de imagenes de los botones
  svgActivo: string = 'assets/Icons/btnGameActivo.svg';
  svgInactivo: string = 'assets/Icons/btnGameInactivo.svg';
  svgVisitado: string = 'assets/Icons/btnGameVisitado.svg';

  //Ruta de las imagenes que van entre los botones
  imagenes: string[] = [
    'assets/Imagenes Juego/Edif00.png',
    'assets/Imagenes Juego/Edif01.png',
    'assets/Imagenes Juego/Edif02.png',
    'assets/Imagenes Juego/Edif03.png',
    'assets/Imagenes Juego/Edif04.png',
    'assets/Imagenes Juego/Edif05.png',
    'assets/Imagenes Juego/Edif06.png',
    'assets/Imagenes Juego/Edif07.png',
    'assets/Imagenes Juego/Edif08.png',
    'assets/Imagenes Juego/Edif09.png',
    'assets/Imagenes Juego/Edif10.png',
  ];

  imagenFinal: string = 'assets/Imagenes Juego/CasaFinal.png';

  numImagenesColocadas: number = 0;

  //Menjase error
  Mensaje_error: string = 'Respuesta equivocada';

  //Para creara los botones y las imagenes

  botones: {
    id: any;
    svg: string;
    tipo: string;
    rutaImagen: string;
  }[] = [];

  //Para las posiciones senosoidales

  centroX: number = 20;
  centroY: number = 20;
  cantidadDeBotones = 20;
  amplitud = 50;
  frecuencia = 10; // Ajusta la frecuencia según la cantidad de botones

  //Para el modal

  mostrarAlert = false;
  mostrarWrongAlert = false;
  modalElement: any;
  modal: any;

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

  listaPosiciones: SalaJuego[] = [];

  // numPreguntaActual: number = 0;
  preguntaTexto: string = '';
  actualOpcionList: any[] = [];
  botonSeleccionado: boolean[] = [];

  numPreguntasContestadas: number = 0;
  puntosGanados: number = 0;
  puedeResponder: boolean = true;

  //MUSICA
  musicaFondo: HTMLAudioElement | null = null;

  //TEMPORIZADOR Y SUMA DEL TIEMPO QUE SE DEMORQA EN RESPONDER

  numIntervaloImg: number = 4;
  countdown: number = 20; // Temporizador principal en segundos

  mainTimerInterval: any;
  userClicked: boolean = false;
  startTime: Date = new Date('2023-10-10T10:00:00');
  userClickTime: Date = new Date('2023-10-10T10:00:00');

  tiempoDelJugador: number = 0;
  isTimerRunning: boolean = false;

  juegoTerminado: boolean = false;

  //PARA EL SLIDER DE NG PRIME

  value: number = 0; // Valor del slider

  optionsMia: Options = {
    floor: 0,
    ceil: this.cantidadDeBotones,
    showTicks: true,
    tickStep: 5,
    readOnly: true,
  };
  optionsAux: Options = {
    floor: 0,
    ceil: this.cantidadDeBotones,
    showTicks: false,
    readOnly: true,
  };
  /* optionsAux1: Options = {
    floor: 0,
    ceil: this.cantidadDeBotones,
    showTicks: false,
    readOnly: true,
  };
  optionsAux2: Options = {
    floor: 0,
    ceil: this.cantidadDeBotones,
    showTicks: false,
    readOnly: true,
  };
  optionsAux3: Options = {
    floor: 0,
    ceil: this.cantidadDeBotones,
    showTicks: false,
    readOnly: true,
  }; */

  /* value2: number = 2; // Valor del slider jugador 2
  value3: number = 3; // Valor del slider jugador 3
  value4: number = 4; // Valor del slider jugador 4 */

  optionsMeta: Options = {
    floor: 0,
    ceil: this.cantidadDeBotones,
    showTicks: false,
    readOnly: true,
  };
  valueMeta: number = 0;

  idSala: number = 0;

  puntosJugador: PuntosJugador = {
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
  };

  //Tiempo
  tiempoMostrarPrimerModal: number = 5000;
  tiempoMostrarModal: number = 6000;

  @HostListener('mousewheel', ['$event'])
  onWheel(event: any) {
    event.preventDefault();
  }

  colores = [
    '#c9700394',
    '#d89e578f',
    '#b39039b5',
    '#c9700394',
    '#d89e578f',
    '#b39039b5',
    '#c9700394',
    '#d89e578f',
    '#b39039b5',
    '#c9700394',
    '#d89e578f',
    '#b39039b5',
  ];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private encryptionService: EncryptionService,
    private router: Router,
    private usuarioSalaService: UsuarioSalaService,
    private constantsService: ConstantsService,
    private salaJuegoService: SalaJuegoService,
    private messageService: MessageService
  ) {
    this.numPreguntasContestadas = 0;
    this.puntosGanados = 0;
    this.puedeResponder = true;
    this.tiempoDelJugador = 0; //Tiempo que se demora en contestar las preguntas, esto se acumula
  }

  ngOnInit() {
    this.container = document.getElementById('containerFondo');
    //MUSICA NO LE PONEMOS EN METODO APARTE PORQUE DEJA DE FUNCIONAR
    this.musicaFondo = new Audio();
    this.musicaFondo.src = 'assets/musicAndSFX/MusicaGame4.mp3'; // Ruta a tu archivo de música
    this.musicaFondo.loop = true;
    this.musicaFondo.volume = 0.25; // Volumen (0.5 representa la mitad del volumen)
    this.musicaFondo.play();

    setTimeout(() => {
      this.mostrarModal(); //ACTIVAR CUANDO TERMINES DE TESTEAR <------------
      //console.log("Entro");
    }, this.tiempoMostrarPrimerModal);

    this.idSala = this.PreguntasList[0].pregunta.idSala;
    this.listaDePreguntas = this.PreguntasList;

    //this.steps = 10;

    //Para las imagenes de los edificios principales

    const OpNumEdif = (this.listaDePreguntas.length * 3) / 5.75 / 2;
    var numberOfItems = 0;

    if (OpNumEdif % 1 >= 0.5) {
      numberOfItems = Math.ceil(OpNumEdif);
    } else {
      numberOfItems = Math.trunc(OpNumEdif);
    }
    this.EdificiosCount = Array.from(
      { length: numberOfItems },
      (_, index) => index
    );
    //console.log(this.EdificiosCount);

    if (this.listaDePreguntas.length > 20) {
      this.numIntervaloImg = 5;
    }
    this.numImagenesColocadas = 0; //Actualizo la cantidad de imagenes colocadas
    this.cantidadDeBotones = this.listaDePreguntas.length; //La cantidad de botones es igual a la cantidad de preguntas
    this.rellenarPregunta(1);
    //this.updateCenters(window.innerWidth);
    this.generateButtons();
    //console.log(this.PreguntasList);

    this.getListaPosiciones(this.idSala, this.idJugador);
  }

  ngAfterViewInit() {
    //Slide para la meta
    this.optionsMeta = {
      readOnly: true,
      floor: 0,
      ceil: this.listaDePreguntas.length,
      showTicks: false,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '';

          default:
            return '';
        }
      },
      getPointerColor: (value: number): string => {
        return '#F29523';
      },
    };
    this.valueMeta = this.listaDePreguntas.length;
    // Obtén el elemento .sinusoidal-container por su ID
    const sinusoidalContainer = document.getElementById('sinusoidal-container');
    // Establece la altura deseada en píxeles
    const alturaDeseada =
      this.listaDePreguntas.length * 130 +
      this.numImagenesColocadas * 160 +
      290; // Cambia esto al valor que necesites

    // Verifica si el elemento se encontró antes de intentar establecer la altura
    if (sinusoidalContainer) {
      //console.log("Num preguntas"+this.listaDePreguntas.length);
      sinusoidalContainer.style.height = alturaDeseada + 'px';
      //console.log("Num preguntas"+this.listaDePreguntas.length);
    }
    //Crear lineas entr los botones
    setTimeout(() => {
      this.adjustLines();
      //this.obtenerDiferenciaBotones();
    }, 500);

    window.addEventListener('resize', () => {
      this.createLines();
    });

    if (this.elementoVehiculo) {
      this.elementoVehiculo.nativeElement.style.transition =
        'transform 0.5s linear';
      this.elementoVehiculo.nativeElement.style.transform = `translate(${35}px, ${0}px)`;
    }

    this.EdificiosCount.forEach((element, i) => {
      this.marginLeftValues[i] = this.calculateMargin2(i);
    });

    this.scrollInicial();

    this.actualizarMiSlider();
  }

  ngOnDestroy(): void {
    this.modal.hide();
    this.sidebarVisible4 = false;
    this.lineas.forEach((linea) => linea.remove());
  }

  getListaPosiciones(idSala: number, idJugador: number) {
    this.salaJuegoService.getList(idSala, idJugador).subscribe({
      next: (data: any) => {
        //console.log(data);

        let { error, info, lista } = data.result;
        if (error > 0) {
        } else {
          //console.log(lista);
          this.listaPosiciones = lista;
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  adjustLines() {
    if (this.elementosImagen) {
      const elementos = this.elementosImagen.toArray();
      // Limpia las líneas anteriores si las hubiera
      //this.lineas.forEach((linea: HTMLElement) => linea.remove());
      //this.lineas.length = 0;

      for (let i = 0; i < elementos.length - 1; i++) {
        //console.log('LINEAS');
        const linea = new LeaderLine(
          elementos[i].nativeElement,
          elementos[i + 1].nativeElement,
          { dash: { animation: true } }
        );

        linea.show('draw');
        linea.setOptions({
          color: '#FFE608',
          size: 15,
          endPlug: 'behind', // Terminación en cuadrado (sin flecha)
          path: 'straight', // Línea recta, sin curvas
          dash: {
            animation: {
              duration: 2500, // Duración en milisegundos
              timing: 'linear', // Función de temporización, por ejemplo, 'linear', 'ease-in', 'ease-out', etc.
            },
          },
        });

        this.lineas.push(linea);
      }
    }
  }

  createLines() {
    // Limpiar las líneas anteriores si las hubiera
    this.lineas.forEach((linea) => linea.remove());
    this.lineas.length = 0;

    if (this.elementosImagen) {
      const elementos = this.elementosImagen.toArray();
      for (let i = 0; i < elementos.length - 1; i++) {
        const linea = new LeaderLine(
          elementos[i].nativeElement,
          elementos[i + 1].nativeElement,
          { dash: { animation: true } }
        );

        // Configurar las opciones de la línea aquí
        linea.setOptions({
          color: '#FFE608',
          size: 15,
          endPlug: 'behind',
          path: 'straight',
          dash: {
            animation: {
              duration: 2500,
              timing: 'linear',
            },
          },
        });

        linea.show('draw');

        this.lineas.push(linea);
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
      //Activamos el primer boton del camino
      if (numPregunta == 1) {
        this.activarBoton(1, 1);
      }
    }, 1000);
  }

  quitarSeleccionado() {
    const reiniciarSeleccionados: boolean[] = [];
    for (let i = 0; i < this.actualOpcionList.length; i++) {
      reiniciarSeleccionados.push(false);
    }
    this.botonSeleccionado = reiniciarSeleccionados;
  }

  mostrarModal() {
    this.getListaPosiciones(this.idSala, this.idJugador);
    //this.sidebarVisible4 = false;
    this.value++;
    this.modalElement = this.el.nativeElement.querySelector('#exampleModal');
    this.modal = new bootstrap.Modal(this.modalElement);
    this.resetTimer();
    const mainBody = document.getElementById('main-body');
    if (mainBody) {
      mainBody.style.overflowY = 'hidden';
    }

    this.modal.show();
    //this.musicaFondo.play();
    //TIEMPO
    this.startTime = new Date(); //CAPTURAMOS LA HORA QUE EMPIEZA EN MILISENGOS
  }

  closeModal(id: number) {
    if (this.puedeResponder) {
      this.userClicked = true;
      this.stopTimer(); // Detiene el temporizador principal
      this.userClickTime = new Date();
      this.puedeResponder = false;

      this.botonSeleccionado[id] = true;
      const respuestaSeleccionada = this.actualOpcionList[id];
      this.tiempoDelJugador +=
        this.userClickTime.getTime() - this.startTime.getTime();
      //console.log(this.tiempoDelJugador);

      if (respuestaSeleccionada.correcta === 1) {
        //AQUI PONER LA ACTUALIZACION DE LAS POSICIONES
        let juego = {
          idSala: this.idSala,
          idJugador: this.idJugador,
          nombre: 'prueba',
          iniciales: 'pp',
          posicion: 1,
          estadoJuego: 1,
        };
        this.actualizarPosicion(juego);
        // La respuesta es correcta, puedes reproducir un sonido, cambiar el color, etc.
        this.puntosGanados++;
        this.mostrarAlert = true;
        this.reproducirSonido('assets/musicAndSFX/QuizCorrect.wav');

        setTimeout(() => {
          this.mostrarAlert = false;
          this.moverVehiculo();
          this.modal.hide();
          this.sidebarVisible4 = true;
          this.numPreguntasContestadas++;
          this.puedeResponder = true;
          this.countdown = 20;
        }, 3000); // 3000 milisegundos = 3 segundos
      } else {
        this.Mensaje_error = 'Respuesta equivocada';
        this.preguntaMalConstestada();
      }
      this.pasarAOtraPregunta();
    }
  }

  actualizarPosicion(juego: SalaJuego) {
    this.salaJuegoService.updateItem(juego).subscribe({
      next: (data: any) => {
        let { error } = data.result;
        if (error === 0) {
          console.log('posicion actualizada');
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  preguntaMalConstestada() {
    const indexCorrecto = this.actualOpcionList.findIndex(
      (item) => item.correcta === 1
    ); //Obtengo la id del correcto
    this.botonSeleccionado[indexCorrecto] = true; //Activo al correcto

    this.mostrarWrongAlert = true;
    this.reproducirSonido('assets/musicAndSFX/QuizWrong.wav');
    setTimeout(() => {
      this.mostrarWrongAlert = false;
      this.modal.hide();
      this.sidebarVisible4 = true;
      this.moverVehiculo();
      this.numPreguntasContestadas++;
      this.puedeResponder = true;
      this.countdown = 20;
    }, 3000); // 3000 milisegundos = 3 segundos
  }

  pasarAOtraPregunta() {
    //console.log(this.numPreguntasContestadas);
    //console.log(this.listaDePreguntas.length);

    if (this.numPreguntasContestadas + 1 < this.listaDePreguntas.length) {
      setTimeout(() => {
        this.activarBoton(this.numPreguntasContestadas + 1, 1);
        this.rellenarPregunta(this.numPreguntasContestadas + 1);
      }, 4000);

      setTimeout(() => {
        this.mostrarModal();
      }, this.tiempoMostrarModal);
    } else {
      setTimeout(() => {
        this.onClickCambiar();
      }, 2000);
    }
  }

  reproducirSonido(nombreArchivo: string) {
    const audio = new Audio();
    audio.src = nombreArchivo;
    audio.load();
    audio.play();
  }

  generateButtons() {
    for (let i = 1; i <= this.cantidadDeBotones; i++) {
      if (i == this.cantidadDeBotones) {
      } else {
        this.botones.push({
          id: i - this.numImagenesColocadas,
          svg: this.svgInactivo,
          tipo: 'boton',
          rutaImagen: '',
        });
      }
    }
  }

  activarBoton(id: number, imgCambio: number) {
    const boton = this.botones.find((b) => b.id === id);
    if (boton) {
      switch (imgCambio) {
        case 1:
          boton.svg = this.svgActivo;
          break;
        /*  case 2:
          boton.svg=this.svgInactivo;
          break;
        case 3:
          boton.svg=this.svgVisitado;
          break; */
        default:
          boton.svg = this.svgActivo;
          break;
      }
      // Hacer scroll hacia el botón activado
      const buttonElement = this.el.nativeElement.querySelector(
        `#boton-${id - 1}`
      );
      if (buttonElement) {
        //console.log('Scroll boton');
        buttonElement.scrollIntoView({ behavior: 'smooth' }); // Hace scroll suavemente

        setTimeout(() => {
          this.createLines();
        }, 40);
        setTimeout(() => {
          this.createLines();
        }, 70);
        setTimeout(() => {
          this.createLines();
        }, 150);
        setTimeout(() => {
          this.createLines();
        }, 300);
        setTimeout(() => {
          this.createLines();
        }, 500);
        setTimeout(() => {
          this.createLines();
        }, 750);
      }
    }
  }

  //para el temporizador
  startMainTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true; // Marca que el temporizador está en funcionamiento
      this.countdown = 20; // Restablece el tiempo en segundos
      this.mainTimerInterval = setInterval(() => {
        if (!this.userClicked) {
          this.countdown--; // Temporizador principal disminuye en segundos
        }
        if (this.countdown <= 0) {
          this.puedeResponder = false;
          this.userClicked = true;
          this.preguntaMalConstestada();
          this.stopTimer();
          this.pasarAOtraPregunta();
          this.Mensaje_error = 'Se acabo el tiempo';
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
    this.constantsService.loading(true);
    this.juegoTerminado = true;

    //RESULTADO RECOPILADOS
    console.log('Tiempo transcurrido=' + this.tiempoDelJugador);
    console.log('Puntos Jugador=' + this.puntosGanados);
    console.log('Juego terminado=' + this.juegoTerminado);

    this.puntosJugador.idUsuario = this.idJugador;
    this.puntosJugador.idSala = this.idSala;
    this.puntosJugador.puntaje = this.puntosGanados;
    this.puntosJugador.tiempo = this.tiempoDelJugador;

    //Cuando finalicé el juego directo a esta ventana
    this.musicaFondo?.pause();
    // @ts-ignore
    this.musicaFondo.currentTime = 0;
    //this.numVentanaH.emit(3); //1 para la ventana inicio sala, 2 para el juego y 3 para la ventana de resultados

    //console.log(this.puntosJugador);
    this.guardarPuntaje(this.puntosJugador);
  }

  guardarPuntaje(puntosJugador: PuntosJugador) {
    this.usuarioSalaService.crearRanking(puntosJugador).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        //console.log(info);
        if (error > 0) {
          this.messageService.add({
            severity: 'error',
            summary: this.constantsService.mensajeError(),
            detail: 'ha ocurrido un error con la conexión',
          });
        } else {
          this.constantsService.loading(false);
          this.cambiarPag('/RankingChallengers', this.idSala);
        }
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  calculateMargin(index: number): number {
    const amplitude = 100; // Ajusta la amplitud del coseno según sea necesario
    const frequency = 1; // Ajusta la frecuencia del coseno según sea necesario
    const res = Math.round(amplitude * Math.cos(frequency * index));
    //console.log(index+" margin "+res);

    return res;
  }

  calculateMargin2(index: number): number {
    if (this.isEdificioPar) {
      this.isEdificioPar = !this.isEdificioPar;
      return 250;
    } else {
      this.isEdificioPar = !this.isEdificioPar;
      return -250;
    }
  }

  moverVehiculo() {
    const i = this.numPreguntasContestadas + 1;
    const h = this.altura;

    if (this.elementoVehiculo) {
      this.elementoVehiculo.nativeElement.style.transition =
        'transform 1.5s linear';
      this.elementoVehiculo.nativeElement.style.transform = `translate(${
        this.numXtraslacion[this.contadorCiclo]
      }px, ${h * i}px)`;
      this.contadorCiclo++;
      if (this.contadorCiclo >= 19) {
        this.contadorCiclo = 0;
      }
    }
    //this.numPreguntasContestadas++;
  }

  setListOptions(iniciales: string, index: number): Options {
    let optionsAux = {
      floor: 0,
      ceil: this.cantidadDeBotones,
      showTicks: false,
      readOnly: true,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return iniciales;

          default:
            return '';
        }
      },
      getPointerColor: (value: number): string => {
        return this.colores[index];
      },
    };
    return optionsAux;
  }

  actualizarMiSlider() {
    const numPreguntas = this.cantidadDeBotones;

    this.optionsMia = {
      readOnly: true,
      floor: 0,
      ceil: numPreguntas,
      showTicks: true,
      tickStep: 5,
      tickValueStep: 5,
      getPointerColor: (value: number): string => {
        return 'orange';
      },
      getSelectionBarColor: (): string => {
        return 'orange';
      },
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return 'Tú';

          default:
            return '';
        }
      },
    };

    /* this.optionsAux1 = {
      readOnly: true,
      floor: 0,
      ceil: numPreguntas,
      showTicks: false,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return 'BC';

          default:
            return '';
        }
      },
      getPointerColor: (value: number): string => {
        return '#29292975';
      },
    };
    this.optionsAux2 = {
      readOnly: true,
      floor: 0,
      ceil: numPreguntas,
      showTicks: false,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return 'PC';

          default:
            return '';
        }
      },
      getPointerColor: (value: number): string => {
        return '#29292975';
      },
    };
    this.optionsAux3 = {
      readOnly: true,
      floor: 0,
      ceil: numPreguntas,
      showTicks: false,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return 'HP';

          default:
            return '';
        }
      },
      getPointerColor: (value: number): string => {
        return '#29292975';
      },
    }; */
  }

  /*  actualizarPosiciones() {
    this.value2 = 0; // Actualizar el slider jugador 2
    this.value3 = 0; // Actualizar el slider jugador 3
    this.value4 = 0; // Actualizar el slider jugador 4
  } */

  cambiarPag(ruta: string, id: number) {
    let idSala = this.encryptionService.encrypt(id.toString());
    let params = { idSala };
    this.router.navigate([ruta], { queryParams: params });
  }

  scrollInicial() {
    // Hacer scroll hacia el botón activado
    const vehicleElement =
      this.el.nativeElement.querySelector(`#elementoVehiculo`);
    if (vehicleElement) {
      //console.log('Entro carro');

      setTimeout(() => {
        vehicleElement.scrollIntoView({ behavior: 'smooth' });
      }, 40);
      setTimeout(() => {
        vehicleElement.scrollIntoView({ behavior: 'smooth' });
      }, 70);
      setTimeout(() => {
        vehicleElement.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      setTimeout(() => {
        vehicleElement.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      setTimeout(() => {
        vehicleElement.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      setTimeout(() => {
        vehicleElement.scrollIntoView({ behavior: 'smooth' });
      }, 750);
    }
  }
}
