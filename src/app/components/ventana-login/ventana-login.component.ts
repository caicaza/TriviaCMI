import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginUsuario } from 'src/app/model/LoginModel';
import { UsuarioService } from 'src/app/services/usuario.service';

import { JwtHelperService } from '@auth0/angular-jwt';

import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from 'src/app/constants.service';

import { StorageMap } from '@ngx-pwa/local-storage'; // Importa LocalStorage

@Component({
  selector: 'app-ventana-login',
  templateUrl: './ventana-login.component.html',
  styleUrls: ['./ventana-login.component.scss'],
})
export class VentanaLoginComponent implements OnInit {
  //Ojos
  hidePassword: boolean = true;

  @Output() isLoginH = new EventEmitter<boolean>();

  helper = new JwtHelperService();

  //Inputs
  loginUsuario: LoginUsuario = {
    nombre: '',
    contrasena: '',
    correo: '',
  };

  tipoLogin: number = 1;

  existeError: boolean = false;
  rememberMe: boolean = false;

  rol: number = 0;

  constructor(
    private usuarioServicio: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private constantsService: ConstantsService,
    private localStorage: StorageMap
  ) {}

  ngOnInit(): void {
    this.constantsService.loading(false);
    this.route.queryParams.subscribe((params) => {
      if (params['usuario'] && params['correo'] && params['tipoLogin']) {
        this.tipoLogin = parseInt(params['tipoLogin']);
        this.loginUsuario.nombre = params['usuario'];
        this.loginUsuario.correo = params['correo'];

        this.constantsService.loading(true);
        this.iniciarSesion();
      }
    });

    const url = window.location;
    console.log(url.origin);
    this.usuarioServicio.removeLocalItems();

    // Recupera los datos guardados desde el almacenamiento local
    this.localStorage.get('user').subscribe((nombre) => {
      if (typeof nombre == 'string') {
        this.loginUsuario.nombre = nombre;
        //console.log(this.loginUsuario.nombre);
      }
    });

    this.localStorage.get('contrasena').subscribe((contrasena) => {
      if (typeof contrasena == 'string') {
        this.loginUsuario.contrasena = contrasena;
        if (contrasena != '') {
          this.rememberMe = true;
        }
      }
    });

    //REVISAR ESTA PARTE, NO CACHO PORQUE SE HACE BUGG A BYRON

    /*   if (localStorage.getItem('rol')) {
      const rolString = localStorage.getItem('rol'); 

      if(rolString){
        this.rol=parseInt(rolString,10); 

        if (this.rol == 2) {
          this.router.navigate(['/MisSalas']);
        }
        if (this.rol == 1) {
          this.router.navigate(['/Administrador']);
        }

      }
      
    }
 */
  }

  onSubmit() {
    this.constantsService.loading(true);
    this.iniciarSesion();
  }

  iniciarSesion() {
    this.usuarioServicio
      .loginUsuario(this.loginUsuario, this.tipoLogin)
      .subscribe({
        next: (data: any) => {
          const { info, error } = data.result;
          if (error > 0) {
            // hay error
            this.existeError = true;
          } else {
            // no hay error
            this.existeError = false;
            const decodeToken = this.helper.decodeToken(info);
            //console.log(decodeToken);
            let { idRol, nombre, id } = decodeToken;
            localStorage.setItem('token', info);

            //GUARDO ESTO EN LA CASILLA DE RECUERDAME
            if (this.rememberMe) {
              // Guarda el nombre de usuario y contraseña en el almacenamiento local
              this.localStorage
                .set('user', this.loginUsuario.nombre)
                .subscribe(() => {
                  //console.log(this.loginUsuario.correo);
                });
              this.localStorage
                .set('contrasena', this.loginUsuario.contrasena)
                .subscribe(() => {
                  //console.log(this.loginUsuario.contrasena);
                });
            } else {
              this.localStorage.set('user', '').subscribe(() => {
                //console.log(this.loginUsuario.correo);
              });
              this.localStorage.set('contrasena', '').subscribe(() => {
                //console.log(this.loginUsuario.contrasena);
              });
            }

            this.constantsService.startWatching();

            //Ruta para el jugador
            if (idRol == 2) {
              this.router.navigate(['/MisSalas']);
            }
            //Ruta para el administrador
            if (idRol == 1 || idRol == 3) {
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

  // Método para cambiar el valor del booleano y emitir el evento
  onClickCambiar() {
    this.isLoginH.emit(false); // Puedes emitir 'true' o 'false' según tu lógica
  }
  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
