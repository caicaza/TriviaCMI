import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginUsuario } from 'src/app/model/LoginModel';
import { UsuarioService } from 'src/app/services/usuario.service';

import { JwtHelperService } from '@auth0/angular-jwt';

import { Router } from '@angular/router';
import { ConstantsService } from 'src/app/constants.service';

import { StorageMap } from '@ngx-pwa/local-storage'; // Importa LocalStorage

 

@Component({
  selector: 'app-ventana-login',
  templateUrl: './ventana-login.component.html',
  styleUrls: ['./ventana-login.component.scss'],
})
export class VentanaLoginComponent implements OnInit {
  @Output() isLoginH = new EventEmitter<boolean>();

  helper = new JwtHelperService();

  //Inputs
  loginUsuario: LoginUsuario = {
    correo: '',
    contrasena: '',
  };

  existeError: boolean = false;

  rememberMe: boolean = false;

  constructor(
    private usuarioServicio: UsuarioService,
    private router: Router,
    private constantsService: ConstantsService,
    private localStorage: StorageMap
  ) {}

  ngOnInit(): void {
    this.constantsService.loading(false);
  }

  onSubmit() {
    this.constantsService.loading(true);
    this.usuarioServicio.loginUsuario(this.loginUsuario).subscribe({
      next: (data: any) => {
        const { info, error } = data.result;
        if (error > 0) {
          // hay error
          this.existeError = true;
        } else {
          // no hay error
          const decodeToken = this.helper.decodeToken(info);
          //console.log(decodeToken);
          let { correo, idRol, nombre, id } = decodeToken;
          localStorage.setItem('id', id);
          localStorage.setItem('token', info);
          localStorage.setItem('rol', idRol);

           //GUARDO ESTO EN LA CASILLA DE RECUERDAME
           if (this.rememberMe) {
            // Guarda el nombre de usuario y contraseña en el almacenamiento local
            this.localStorage.set('correo', correo).subscribe(() => {});
            this.localStorage.set('token', info).subscribe(() => {});
            this.localStorage.set('rol', info).subscribe(() => {});
          }

          //Ruta para el jugador

          if (idRol == 2) {
            this.router.navigate(['/MisSalas']);
          }
          //Ruta para el administrador
          if (idRol == 1) {
            this.router.navigate(['/Administrador']);
          }
        }
        this.constantsService.loading(false);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  /* getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  } */

  // Método para cambiar el valor del booleano y emitir el evento
  onClickCambiar() {
    this.isLoginH.emit(false); // Puedes emitir 'true' o 'false' según tu lógica
  }
  toggleRememberMe() {
  this.rememberMe = !this.rememberMe;
}


}
