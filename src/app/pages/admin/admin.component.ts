import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Sala } from 'src/app/model/SalaModel';
import { SalaService } from 'src/app/services/sala.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';
//import { environment } from 'src/environments/environments';
//import { Clipboard } from '@angular/cdk/clipboard';

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

  idSalaItem: number = 0;
  codigoSala: string = '';

  salaItem: Sala = {
    idSala: 0,
    nombre: '',
    imagen: '',
    descripcion: '',
    idModoJuego: 0,
    modoJuego: '',
    estado: 0,
    fecha_creacion: '',
    fecha_modificacion: '',
  };

  constructor(
    private salaServicio: SalaService,
    private usuarioServicio: UsuarioService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService, //private clipboard: Clipboard
    private location: Location
  ) {}

  ngOnInit(): void {
    this.constantsService.loading(true);
    this.cargarSalas();
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

  getIdSala(idSala: number) {
    this.idSalaItem = idSala;
  }

  nameLink() {
    this.codigoSala = this.encryptionService.encrypt(
      this.idSalaItem.toString()
    );

    return `${window.location.origin}/EntradaSala?idSala`;
  }

  copiarText() {
    let idSala = '';
    idSala = this.encryptionService.encrypt(this.idSalaItem.toString());
    let currentUrl = `${window.location.origin}/EntradaSala?idSala=${idSala}`;

    console.log(this.idSalaItem, idSala, currentUrl);

    /* const texto = this.textoACopiar.nativeElement;
    texto.select();
    document.execCommand('copy');

    this.clipboard.copy(texto); */
  }

  cambiarEstado(estado: number, idSala: number) {
    this.constantsService.loading(true);
    this.salaItem.estado = estado;
    this.salaItem.idSala = idSala;
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

  cambiarPag(ruta: string, id: number) {
    this.closeModal.nativeElement.click();
    let idSala = this.encryptionService.encrypt(id.toString());
    let params = { idSala };
    this.router.navigate([ruta], { queryParams: params });
  }

  cerrarSesion() {
    this.usuarioServicio.logout();
  }
}
