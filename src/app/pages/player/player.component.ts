import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Sala, SalaReciente } from 'src/app/model/SalaModel';
import { SalaService } from 'src/app/services/sala.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;

  misSalas: Sala[] = [];
  idUsuario: number = 0;
  textoBuscar: string = '';
  existeError: boolean = false;
  result: string = '';
  codigo: string = '';
  errorCodigo: string = '';
  msjSalas: string = 'Últimas 6 salas visitadas';

  sala: Sala = {
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

  //PAGINACION

  cardsPerPage: number = 6;
  currentPage: number = 1;

  //Quitar el boton salir
  isLogin2 = false;

  //Para los nuevos filtros
  elementoActivo: number = 0;

  constructor(
    private router: Router,
    private usuarioServicio: UsuarioService,
    private salaServicio: SalaService,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService
  ) {}

  ngOnInit(): void {
    this.constantsService.loading(true);
    this.idUsuario = parseInt(this.usuarioServicio.getIdUsuario()!);
    this.isLogin2 = this.usuarioServicio.getTipoLogin() == '2';

    this.todasLasSalas();

    //this.salasRecientes(this.idUsuario);
  }

  salasRecientes(idUsuario: number) {
    this.salaServicio.listaSalaReciente(0, idUsuario).subscribe({
      next: (data: any) => {
        let { info, error, lista } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;
          this.misSalas = lista;
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

  salasRecientes2() {
    this.elementoActivo = 1;
    const idUsuario = this.idUsuario;
    this.salaServicio.listaSalaReciente(0, idUsuario).subscribe({
      next: (data: any) => {
        let { info, error, lista } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;
          this.misSalas = lista;
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

  /* crearSalaReciente(salaReciente: SalaReciente) {
    this.salaServicio.crearSalaReciente(salaReciente).subscribe({
      next: (data: any) => {
        let { info, error } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;
        }
        this.constantsService.loading(false);
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  } */

  buscar() {
    this.constantsService.loading(true);
    if (this.textoBuscar.trim() !== '') {
      this.salaServicio.listaSalaSearch(0, this.textoBuscar.trim()).subscribe({
        next: (data: any) => {
          const { info, error, lista } = data.result;
          this.result = info;
          if (error > 0) {
            this.existeError = true;
          } else {
            this.existeError = false;
            this.misSalas = lista;
            if (this.misSalas.length > 1) {
              this.msjSalas = `${this.misSalas.length} salas encontradas`;
            } else if (this.misSalas.length === 1) {
              this.msjSalas = `Una sala encontrada`;
            } else {
              this.msjSalas = `No se pudo encontrar la sala o no existe la sala`;
            }
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
      this.todasLasSalas();
      /* this.salaServicio.listaSala(0).subscribe({
        next: (data: any) => {
          const { info, error, lista } = data.result;
          this.result = info;
          if (error > 0) {
            this.existeError = true;
          } else {
            this.existeError = false;
            this.misSalas = lista;
            this.msjSalas = `Todas las salas`;
          }
          this.constantsService.loading(false);
        },
        error: (e) => {
          if (e.status === 401) {
            this.router.navigate(['/']);
          }
        },
      }); */
    }
  }

  todasLasSalas() {
    this.elementoActivo = 0;
    this.salaServicio.listaSala(0).subscribe({
      next: (data: any) => {
        const { info, error, lista } = data.result;
        this.result = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;
          this.misSalas = lista;
          this.msjSalas = `Todas las salas`;
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

  cambiarPag(ruta: string, id: number) {
    let idSala = this.encryptionService.encrypt(id.toString());
    let params = { idSala };
    this.router.navigate([ruta], { queryParams: params });
  }

  abrirModal(sala: Sala) {
    this.sala = sala;
  }

  ingresarSala() {
    let idSala = this.sala.idSala.toString();
    let codigo = this.codigo.trim();
    let auxCodigo = '';

    if (codigo !== '') {
      for (let i = 0; i < idSala.length; i++) {
        auxCodigo += codigo[i + 2];
      }

      if (auxCodigo === idSala) {
        /* let salaReciente = {
          idSala: this.sala.idSala,
          idUsuario: this.idUsuario,
        };
        this.crearSalaReciente(salaReciente); */

        this.closeModal.nativeElement.click();
        this.cambiarPag('/EntradaSala', this.sala.idSala);
      } else {
        this.errorCodigo = 'El ID de acceso es incorrecto!';
      }
    } else {
      this.errorCodigo = 'Ingrese el ID de acceso';
    }
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
}
