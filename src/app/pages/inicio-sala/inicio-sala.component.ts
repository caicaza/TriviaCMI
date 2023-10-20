import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Sala } from 'src/app/model/SalaModel';
import { SalaService } from 'src/app/services/sala.service';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inicio-sala',
  templateUrl: './inicio-sala.component.html',
  styleUrls: ['./inicio-sala.component.css'],
  providers: [ConfirmationService],
})
export class InicioSalaComponent implements OnInit, AfterViewInit {

  @ViewChild('mi_imagen') miImagen: ElementRef | undefined;
  imagenEsHorizontal: boolean = true;
  //nombreSala: string = 'Mi sala!';
  //idSala: number = 0;
  //imagenSala: string = 'assets/Imagenes Juego/ImagenDefault.png';
  @Input() errorResultDataPregOpc: number = 0;
  existeError: boolean = false;
  result: string = '';

  miSala: Sala = {
    idSala: 1,
    nombre: 'Mi primera sala',
    imagen: 'assets/Imagenes Juego/Imagen test.png',
    descripcion: 'Descripcion Sala',
    idModoJuego: 0,
    modoJuego: 'Challenger',
    estado: 1,
    fecha_creacion: '',
    fecha_modificacion: '',
  };

  @Output() numVentanaH = new EventEmitter<number>();
  isFinalizoJuego: boolean = false; //Necesitamos obtener un valor si el jugador ya finalizó el juego

  ngOnInit(): void {
    this.constantsService.loading(true);
    this.route.queryParams.subscribe((params) => {
      let idSala = this.encryptionService.decrypt(params['idSala']);
      if (idSala === '') {
        history.back();
      }
      this.miSala.idSala = parseInt(idSala);
    });
    this.cargarInfoSala(this.miSala.idSala);
  }

  ngAfterViewInit(): void {
    this.calcularRelacionAspecto();
  }

  constructor(
    private salaServicio: SalaService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService
  ) {}

  cargarInfoSala(idSala: number) {
    this.salaServicio.itemSala(0, idSala).subscribe({
      next: (data: any) => {
        const { info, error, sala } = data.result;
        this.result = info;
        if (error > 0) {
          //hay error
          this.existeError = true;
        } else {
          //no hay error
          this.existeError = false;
          this.miSala = sala;
        }
        this.constantsService.loading(false);
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  getImageSala(nombreImagen: string): string {
    let imageUrl = `${this.salaServicio.getURLImages()}/${nombreImagen}`;
    return imageUrl;
  }

  validarDataPregOpc() {
    if (this.errorResultDataPregOpc > 0) {
      this.confirmationService.confirm({
        message:
          'Posibles errores: la sala no tiene preguntas, las preguntas no tienen opciones o la sala no existe',
        header: 'Hay errores en la lista de preguntas y opciones',
        accept: () => {},
      });
    } else {
      this.onClickCambiar();
    }
  }

  onClickCambiar() {
    if (!this.isFinalizoJuego) {
      this.numVentanaH.emit(2); //1 para la ventana inicio sala, 2 para el juego y 3 para la ventana de resultados
    }
    if (this.isFinalizoJuego) {
      this.numVentanaH.emit(3); //1 para la ventana inicio sala, 2 para el juego y 3 para la ventana de resultados
    }
  }

  onClickCambiarTest() {
    this.numVentanaH.emit(3); //1 para la ventana inicio sala, 2 para el juego y 3 para la ventana de resultados
  }

  // myForm: FormGroup;
  // submitted = false; // Agrega la propiedad "submitted" y inicialízala en falso

  /*   constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.myForm = this.fb.group({
      inputName: ['', Validators.required],
      inputZip: ['', Validators.required],
    });
  } */

  /*  onSubmit() {
    this.submitted = true; 
    this.cdr.detectChanges();
    if (this.myForm.invalid) {      
      return;
    }   
  } */

  calcularRelacionAspecto() {
    console.log(this.miImagen);
    if (this.miImagen && this.miImagen.nativeElement) {
      const img = this.miImagen.nativeElement;
      img.onload = () => {
        const ancho = img.width;
        const alto = img.height;
        console.log(`Ancho: ${ancho}px, Alto: ${alto}px`);
        this.imagenEsHorizontal=ancho<alto;
      };
      //img.src = this.imagenSala; // Asegúrate de que la imagen esté cargada antes de obtener sus dimensiones
    }
    
  }
}
