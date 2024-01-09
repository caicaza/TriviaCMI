import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Usuario } from 'src/app/model/UsuarioModel';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConstantsService } from 'src/app/constants.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventana-registro',
  templateUrl: './ventana-registro.component.html',
  styleUrls: ['./ventana-registro.component.scss'],
})
export class VentanaRegistroComponent implements OnInit {
  //Ojos
  hidePassword: boolean = true;

  bool: boolean = false;

  campo: string = '';
  //Inputs
  nuevoUsuario: Usuario = {
    idUsuario: 0,
    nombre: '',
    correo: '',
    contrasena: '',
    idRol: 2,
    rol: '',
    iniciales: '',
  };
  //respuesta: Result = {info:"", error:0};
  //PARA EL MENSAJE DE ERROR
  errorEncontrado: string = '';
  existeError: boolean = false;

  //MOSTRAR EL MODAL
  formModal: any;
  mostrarModal: boolean = false;

  visible: boolean = false;
  position: string = 'center';

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }

  /*  constructor(private usuarioServicio:UsuarioService, private messageService: MessageService) {  
  }  */
  constructor(
    private usuarioServicio: UsuarioService,
    private constantsService: ConstantsService
  ) {}

  /*  showToast1() {
    this.messageService.clear();
    this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Registro Exitoso', detail: 'Has realizado tu registro de usuario con éxito' });
} */

  ngOnInit(): void {}

  @Output() isLoginH = new EventEmitter<boolean>();

  onSubmit() {
    //Del servicio aplicamos la función crear usuario
    this.constantsService.loading(true);

    this.nuevoUsuario.iniciales = this.obtenerIniciales(
      this.nuevoUsuario.nombre
    );

    this.usuarioServicio.crearUsuario(this.nuevoUsuario).subscribe({
      next: (data: any) => {
        const { info, error, campo } = data.result;
        this.campo = campo;
        this.errorEncontrado = info;
        if (error > 0) {
          this.existeError = true;
        } else {
          this.existeError = false;

          Swal.fire({
            title: '¡Usuario Registrado!',
            text: '¿Desea iniciar sesión?',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'btn btn-secondary',
            },
            showCancelButton: false,
            buttonsStyling: false,
          }).then((response) => {
            if (response.isConfirmed) {
              this.onClickCambiar();
            }
          });
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
    this.isLoginH.emit(true); // Puedes emitir 'true' o 'false' según tu lógica
  }

  obtenerIniciales(nombre: string) {
    // Divide el nombre en palabras utilizando espacio como separador
    const palabras = nombre.split(' ');

    // Verifica si hay al menos una palabra en el nombre
    if (palabras.length >= 1) {
      // Inicializa una variable para almacenar las iniciales
      let iniciales = '';
      if (palabras.length > 1) {
        // Recorre las palabras y obtiene las iniciales de las dos primeras
        for (let i = 0; i < Math.min(palabras.length, 2); i++) {
          const palabra = palabras[i];
          if (palabra.length > 0) {
            iniciales += palabra[0].toUpperCase();
          }
        }
      } else {
        for (let i = 0; i < palabras.length; i++) {
          const palabra = palabras[i];
          if (palabra.length > 0) {
            iniciales += palabra[0].toUpperCase();
          }
        }
      }
      return iniciales;
    } else {
      // En caso de que el nombre esté vacío o no contenga palabras
      return '';
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
