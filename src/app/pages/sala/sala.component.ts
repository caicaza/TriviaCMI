import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pregunta, Sala } from 'src/app/model/SalaModel';
import { PreguntaService } from 'src/app/services/pregunta.service';
import { SalaService } from 'src/app/services/sala.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EncryptionService } from 'src/app/encryption.service';
import { ConstantsService } from 'src/app/constants.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class SalaComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('valueArchivo') valueArchivo!: ElementRef;

  excelFileUrl: SafeResourceUrl;

  existeError: boolean = false;
  result: string = '';

  existeErrorPregunta: boolean = false;
  resultPregunta: string = '';
  dialogEliminar: boolean = false;
  selectedFile: File | null = null;
  existeErrorArchivo: boolean = false;
  resultArchivo: string = 'Ingrese un archivo en formato .xlsx';

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

  preguntasSala: Pregunta[] = [
    {
      idPregunta: 1,
      nombre: '¿Porque deberia escribir Hola mundo?',
      idSala: 1,
      estado: 1,
      fecha_creacion: '',
      fecha_modificacion: '',
    },
  ];

  constructor(
    private salaServicio: SalaService,
    private preguntaServicio: PreguntaService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService,
    private sanitizer: DomSanitizer
  ) {
    this.excelFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'URL_DEL_ARCHIVO_EXCEL'
    );
  }

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
    this.cargarPreguntas(this.miSala.idSala);
  }

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

  cargarPreguntas(idSala: number) {
    this.preguntaServicio.listaPreguntaByIdSala(0, idSala).subscribe({
      next: (data: any) => {
        const { info, error, lista } = data.result;
        this.resultPregunta = info;
        if (error > 0) {
          this.existeErrorPregunta = true;
        } else {
          this.existeErrorPregunta = false;
          this.preguntasSala = lista;
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

  importArchivo() {
    if (this.selectedFile) {
      this.constantsService.loading(true);
      this.existeErrorArchivo = false;

      const formData = new FormData();
      formData.append('idSala', this.miSala.idSala.toString());
      formData.append('archivo', this.selectedFile);

      this.preguntaServicio.enviarArchivo(formData).subscribe({
        next: (data: any) => {
          const { info, error } = data.response;
          this.resultArchivo = info;
          if (error > 0) {
            this.existeErrorArchivo = true;
          } else {
            this.existeErrorArchivo = false;
            this.closeModal.nativeElement.click();
            this.selectedFile = null;
            this.valueArchivo.nativeElement.value = '';
            this.cargarPreguntas(this.miSala.idSala);
            this.messageService.add({
              severity: 'success',
              summary: this.constantsService.mensajeSatisfactorio(),
              detail: 'Preguntas creadas',
            });
          }
          this.constantsService.loading(false);
        },
        error: (e) => {
          this.closeModal.nativeElement.click();
          if (e.status === 401) {
            this.router.navigate(['/']);
          }
        },
      });
    } else {
      this.existeErrorArchivo = true;
      this.resultArchivo = 'Ingrese un archivo en formato .xlsx';
    }
  }

  exportArchivo() {
    this.constantsService.loading(true);
    this.preguntaServicio.getArchivo().subscribe({
      next: (data: Blob) => {
        const urlObject = window.URL.createObjectURL(data);
        const element = document.createElement('a');
        element.download = `formatoCMI.xlsx`;
        element.href = urlObject;
        element.click();
        this.constantsService.loading(false);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files![0];
    this.existeErrorArchivo = false;
    console.log(this.selectedFile.name);
  }

  eliminarPregunta(idPregunta: number) {
    this.constantsService.loading(true);
    this.preguntaServicio.eliminarPreguntaOpciones(idPregunta).subscribe({
      next: (data: any) => {
        const { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
          this.messageService.add({
            severity: 'error',
            summary: this.constantsService.mensajeError(),
            detail: 'No se pudo eliminar la pregunta',
          });
        } else {
          this.existeError = false;
          this.cargarPreguntas(this.miSala.idSala);
          this.messageService.add({
            severity: 'success',
            summary: this.constantsService.mensajeSatisfactorio(),
            detail: 'Pregunta eliminada',
          });
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

  confirmEliminar(idPregunta: number) {
    this.confirmationService.confirm({
      message: '¿Seguro desea eliminar la pregunta?',
      header: 'Confirmación Eliminar',
      accept: () => this.eliminarPregunta(idPregunta),
    });
  }

  cambiarPag(ruta: string, type: string, id1: number, id2: number) {
    let idSala = this.encryptionService.encrypt(id1.toString());
    let idPregunta = this.encryptionService.encrypt(id2.toString());
    let params = { type, idSala, idPregunta };
    this.router.navigate([ruta], { queryParams: params });
  }

  //  const salaEncontrada = salas.find((sala) => sala.idSala === idSala);
}
