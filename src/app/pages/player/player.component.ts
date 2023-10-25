import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Sala } from 'src/app/model/SalaModel';
import { SalaService } from 'src/app/services/sala.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent {
  @ViewChild('closeModal') closeModal!: ElementRef;

  misSalas: Sala[] = [];
  textoBuscar: string = '';
  existeError: boolean = false;
  result: string = '';
  idSalaSeleccionada: number = 0;
  codigo: string = '';
  errorCodigo: string = '';

  constructor(
    private router: Router,
    private usuarioServicio: UsuarioService,
    private salaServicio: SalaService,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService
  ) {}

  buscar() {
    if (this.textoBuscar.trim() !== '') {
      this.constantsService.loading(true);
      this.salaServicio.listaSalaSearch(1, this.textoBuscar.trim()).subscribe({
        next: (data: any) => {
          const { info, error, lista } = data.result;
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

  abrirModal(idSala: number) {
    this.idSalaSeleccionada = idSala;
  }

  ingresarSala() {
    let idSala = this.idSalaSeleccionada.toString();
    let codigo = this.codigo.trim();
    let auxCodigo = '';

    if (codigo !== '') {
      for (let i = 0; i < idSala.length; i++) {
        auxCodigo += codigo[i + 2];
      }

      if (auxCodigo === idSala) {
        this.closeModal.nativeElement.click();
        this.cambiarPag('/EntradaSala', this.idSalaSeleccionada);
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
}
