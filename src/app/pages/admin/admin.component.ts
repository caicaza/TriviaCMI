import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Sala } from 'src/app/model/SalaModel';
import { SalaService } from 'src/app/services/sala.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ClipboardService } from 'ngx-clipboard';
import Swal from 'sweetalert2';
import { TimeApiService } from 'src/app/services/time-api.service';
import { UsuarioSalaService } from 'src/app/services/usuario-sala.service';
import { MenuItem } from 'primeng/api';

//import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AdminComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;

  misSalas: Sala[] = [];
  auxMisSalas: Sala[] = [];
  existeError: boolean = false;
  result: string = '';
  textoBuscar: string = '';
  idRol: number = 0;

  currentURL: string = '';
  currentCodigo: string = '';

  timeLondon: string = '';

  salaItem: Sala = {
    idSala: 0,
    nombre: '',
    imagen: '',
    descripcion: '',
    idModoJuego: 0,
    modoJuego: '',
    estado: 0,
    totalPreguntas: 0,
    cantJugadas: 0,
    fecha_creacion: '',
    fecha_modificacion: '',
    fechaActivacion: '',
  };

  cardsPerPage: number = 6;
  currentPage: number = 1;

  items: MenuItem[] | undefined;

  constructor(
    private salaServicio: SalaService,
    private usuarioServicio: UsuarioService,
    private usuario_SalaServicio: UsuarioSalaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService,
    private timeApiService: TimeApiService,
    private _clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.constantsService.loading(true);
    this.idRol = parseInt(this.usuarioServicio.getRol()!);
    this.cargarSalas();

    this.getTimeLondon();

    // this.itemsMenu();
  }

  cargarSalas() {
    this.salaServicio.listaSala(0).subscribe({
      next: (data: any) => {
        const { info, error, lista } = data.result;
        this.result = info;
        if (error > 0) {
          // hay error
          this.existeError = true;
        } else {
          // no hay error
          this.existeError = false;
          this.misSalas = lista;
          this.auxMisSalas = lista;
        }
        this.constantsService.loading(false);
      },
      error: (e) => {
        //console.log(e);
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  descargarReporteSalasUsuarios() {
    this.constantsService.loading(true);
    this.usuario_SalaServicio.reporteRanking(0).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;

          let url = this.usuario_SalaServicio.getUrlArchivo(info);

          const element = document.createElement('a');
          element.download = `Ranking.xls`;
          element.href = url;
          element.click();

          this.messageService.add({
            severity: 'success',
            summary: this.constantsService.mensajeSatisfactorio(),
            detail: 'La descarga del reporte ha comenzado',
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

  descargarReporteSalas() {
    this.constantsService.loading(true);
    this.salaServicio.reporteSalas(0).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;

          let url = this.salaServicio.getUrlArchivo(info);

          const element = document.createElement('a');
          element.download = `Salas.xls`;
          element.href = url;
          element.click();
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

  buscar() {
    if (this.textoBuscar.trim() !== '') {
      this.constantsService.loading(true);
      this.salaServicio.listaSalaSearch(0, this.textoBuscar.trim()).subscribe({
        next: (data: any) => {
          const { info, error, lista } = data.result;
          this.result = info;
          if (error > 0) {
            this.existeError = true;
          } else {
            this.existeError = false;
            this.misSalas = lista;
            this.messageService.add({
              severity: 'success',
              summary: this.constantsService.mensajeSatisfactorio(),
              detail: 'Sala/s Entontrada/s',
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
    } else {
      this.misSalas = this.auxMisSalas;
    }
  }

  verSalasAll(event: Event) {
    const valueText = (event.target as HTMLInputElement).value;
    if (valueText.trim() === '') {
      this.misSalas = this.auxMisSalas;
    }
  }

  getImageSala(nombreImagen: string): string {
    let imageUrl = `${this.salaServicio.getURLImages()}/${nombreImagen}`;
    return imageUrl;
  }

  allCopySala() {
    const textos = [
      'Cuando estés logueado en nuestra página de trivias, puedes ingresar directamente a la sala a través del link proporcionado. También puedes utilizar el buscador en la página principal, introduciendo el nombre de la sala y después introduces el código de la sala para acceder.',
      '',
      'Link de la Sala: ' + this.currentURL,
      'Nombre de la Sala: ' + this.salaItem.nombre,
      'Código de Sala: ' + this.currentCodigo,
    ];
    const textoAConcatenar = textos.join('\n');
    //this._clipboardService.copy(textoAConcatenar);
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textoAConcatenar)
        .then(() => {
          //alert('Texto copiado al portapapeles.');
        })
        .catch((err) => {
          console.error('Error al copiar al portapapeles:', err);
          this._clipboardService.copyFromContent(textoAConcatenar);
          // alert('Texto copiado al portapapeles utilizando ngx-clipboard.');
        });
    } else {
      this._clipboardService.copyFromContent(textoAConcatenar);
      //alert('Texto copiado al portapapeles utilizando ngx-clipboard.');
    }
  }

  dataSalaOnModal(sala: Sala) {
    this.salaItem = sala;
    let idSala = this.encryptionService.encrypt(sala.idSala.toString());
    let codigo1 = this.constantsService.randomNumber(10, 99);
    let codigo2 = this.constantsService.randomNumber(10, 99);

    this.currentURL = `${window.location.origin}/EntradaSala?idSala=${idSala}`;
    this.currentCodigo = codigo1 + sala.idSala.toString() + codigo2;
    //console.log(codigo1, codigo2);
  }

  cambiarEstado(sala: Sala, estado: number) {
    if (estado == 1 && sala.totalPreguntas < 5) {
      Swal.fire({
        title: '¡No se puede activar la sala!',
        text: 'La sala debe tener minimo 5 preguntas',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btn btn-secondary',
        },
        showCancelButton: false,
        buttonsStyling: false,
      });
      return;
    }

    this.constantsService.loading(true);
    this.salaItem = sala;
    this.salaItem.estado = estado;
    //this.salaItem.fechaActivacion = this.constantsService.getISODate();
    this.salaItem.fechaActivacion = this.timeLondon;

    this.salaServicio.editarEstado(this.salaItem).subscribe({
      next: (data: any) => {
        const { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión',
          });
        } else {
          this.existeError = false;
          this.cargarSalas();
          this.messageService.add({
            severity: 'success',
            summary: this.constantsService.mensajeSatisfactorio(),
            detail: estado === 1 ? 'Sala Activada' : 'Sala Desactivada',
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

  getTimeLondon() {
    this.timeApiService.getLondonTime().subscribe({
      next: (data: any) => {
        console.log(data);
        console.log('TIME LONDRES', data.datetime.split('.')[0]);
        const currentTime = new Date(data.datetime);
        console.log('currentTime', currentTime);

        this.timeLondon = data.datetime.split('.')[0];
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  resetearSala(idSala: number) {
    this.constantsService.loading(true);
    this.usuario_SalaServicio.deleteRanking(idSala).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        this.existeError = error;
        this.result = info;
        if (error === 0) {
          this.messageService.add({
            severity: 'success',
            summary: this.constantsService.mensajeSatisfactorio(),
            detail: 'Sala reseteada',
          });
        } else if (error === 2) {
          this.messageService.add({
            severity: 'warn',
            summary: this.constantsService.mensajeError(),
            detail: info,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.constantsService.mensajeError(),
            detail: 'No se pudo resetear la sala',
          });
        }
        this.constantsService.loading(false);
      },
      error: (e) => {
        if (e.status === 401 || e.status === 403) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  eliminarSala(idSala: number) {
    this.constantsService.loading(true);
    this.salaServicio.eliminarSala(idSala).subscribe({
      next: (data: any) => {
        const { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
          this.messageService.add({
            severity: 'error',
            summary: this.constantsService.mensajeError(),
            detail: 'No se pudo eliminar la sala',
          });
        } else {
          this.existeError = false;
          this.cargarSalas();
          this.messageService.add({
            severity: 'success',
            summary: this.constantsService.mensajeSatisfactorio(),
            detail: 'Sala eliminada',
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

  confirmEliminar(idSala: number) {
    this.confirmationService.confirm({
      message: '¿Seguro desea eliminar la sala?',
      header: 'Confirmación Eliminar',
      accept: () => this.eliminarSala(idSala),
    });
  }

  confirmResetear(idSala: number) {
    this.confirmationService.confirm({
      message: '¿Seguro desea resetear la sala?</br>Se eliminará el ranking',
      header: 'Confirmación Resetear',
      /* icon: 'pi pi-exclamation-triangle', */
      accept: () => this.resetearSala(idSala),
    });
  }

  cambiarPag(ruta: string, id: number) {
    this.closeModal.nativeElement.click();
    let idSala = this.encryptionService.encrypt(id.toString());
    let params = { idSala };
    this.router.navigate([ruta], { queryParams: params });
  }

  cerrarSesion() {
    this.usuarioServicio.logout();
  }

  //PAGINACION

  get cardsToShow(): any[] {
    const startIndex = (this.currentPage - 1) * this.cardsPerPage;
    const endIndex = startIndex + this.cardsPerPage;
    return this.misSalas.slice(startIndex, endIndex);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.misSalas.length / this.cardsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  /*   itemsMenu(){
    this.items = [
      {
          label: 'Options',
          items: [
              {
                  label: 'Update',
                  icon: 'pi pi-refresh',
                  command: () => {
                      this.update();
                  }
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-times',
                  command: () => {
                      this.delete();
                  }
              }
          ]
      },
      {
          label: 'Navigate',
          items: [
              {
                  label: 'Angular',
                  icon: 'pi pi-external-link',
                  url: 'http://angular.io'
              },
              {
                  label: 'Router',
                  icon: 'pi pi-upload',
                  routerLink: '/fileupload'
              }
          ]
      }
  ];
  }

  update() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
}

delete() {
    this.messageService.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
} */
}
