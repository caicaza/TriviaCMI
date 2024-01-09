import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Usuario } from 'src/app/model/UsuarioModel';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ClipboardService } from 'ngx-clipboard';
import { SalaService } from 'src/app/services/sala.service';
import { UsuarioSalaService } from 'src/app/services/usuario-sala.service';

@Component({
  selector: 'app-gestionar-usuarios',
  templateUrl: './gestionar-usuarios.component.html',
  styleUrls: ['./gestionar-usuarios.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class GestionarUsuariosComponent {
  @ViewChild('closeModal') closeModal!: ElementRef;

  auxUsuarios: Usuario[] = [];
  Usuarios: Usuario[] = [];
  existeError: boolean = false;
  result: string = '';
  textoBuscar: string = '';

  currentURL: string = '';
  currentCodigo: string = '';

  timeLondon: string = '';
  idRol = 0;

  constructor(
    private router: Router,
    private usuarioServicio: UsuarioService,
    private usuario_salaServicio: UsuarioSalaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService,
    private _clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.constantsService.loading(true);
    this.listarUsuarios('', true);
    this.idRol = parseInt(this.usuarioServicio.getRol()!);
  }

  listarUsuarios(buscar: string, cargaInicial: boolean) {
    this.usuarioServicio.listaUsuario(0, buscar).subscribe({
      next: (data: any) => {
        let { error, info, lista } = data.result;
        this.result = info;
        this.existeError = error;
        if (error === 0) {
          this.Usuarios = lista;
          if (cargaInicial) {
            this.auxUsuarios = lista;
          }
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

  buscar() {
    this.constantsService.loading(true);
    this.listarUsuarios(this.textoBuscar, false);
  }

  verUsuariosAll(event: Event) {
    const valueText = (event.target as HTMLInputElement).value;
    if (valueText.trim() === '') {
      this.Usuarios = this.auxUsuarios;
    }
  }

  eliminarUsuario(idUsuario: number) {
    this.constantsService.loading(true);
    this.usuarioServicio.eliminarUsuario(idUsuario).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
          this.messageService.add({
            severity: 'error',
            summary: this.constantsService.mensajeError(),
            detail: 'No se pudo eliminar el usuario',
          });
        } else {
          this.existeError = false;
          this.listarUsuarios('', true);
          this.messageService.add({
            severity: 'success',
            summary: this.constantsService.mensajeSatisfactorio(),
            detail: 'Usuario eliminado',
          });
        }
        this.constantsService.loading(false);
      },
      error: (e) => {},
    });
  }

  confirmEliminar(idUsuario: number) {
    this.confirmationService.confirm({
      message: '¿Seguro desea eliminar el usuario?',
      header: 'Confirmación Eliminar',
      accept: () => this.eliminarUsuario(idUsuario),
    });
  }

  cambiarPag(ruta: string, type: string, id1: number) {
    let idUsuario = this.encryptionService.encrypt(id1.toString());
    let params = { type, idUsuario };
    this.router.navigate([ruta], { queryParams: params });
  }

  cerrarSesion() {
    this.usuarioServicio.logout();
  }

  descargarReporteSalasUsuarios() {
    this.constantsService.loading(true);
    this.usuario_salaServicio.reporteRanking(0).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;

          let url = this.usuario_salaServicio.getUrlArchivo(info);

          const element = document.createElement('a');
          element.download = `Ranking.xls`;
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

  copyUsuario(usuario: string) {
    /* "Estimado [Nombre del Usuario],

Nos complace informarte que tu clave de acceso ha sido restablecido con éxito. A continuación, encontrarás tu nueva contraseña, creada con la máxima seguridad para proteger tu cuenta. Apreciamos tu confianza en nuestro servicio y te recordamos la importancia de mantener esta información de manera confidencial. */
    const textos = [
      'Estimado usuario,',
      'Nos complace informarte que tu nombre de usuario ha sido recuperada con éxito. Apreciamos tu confianza en nuestro servicio y te recordamos la importancia de mantener esta información de manera confidencial. Recuerda que tu contraseña es tu DPI Personal',
      'Nombre de usuario: ' + usuario,
    ];
    const textoAConcatenar = textos.join('\n');
    //this._clipboardService.copy(textoAConcatenar);
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textoAConcatenar)
        .then(() => {
          //alert('Texto copiado al portapapeles.');
          this.messageService.add({
            severity: 'success',
            summary: this.constantsService.mensajeSatisfactorio(),
            detail: 'Información copiada',
          });
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
}
