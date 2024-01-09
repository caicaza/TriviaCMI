import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Usuario } from 'src/app/model/UsuarioModel';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
})
export class CrearUsuarioComponent {
  type: string = '';
  //imageSala: string = '';
  titulo: string = '';

  existeError: boolean = false;
  result: string = '';
  campo: string = '';

  nombreInput: FormControl;
  dpiInput: FormControl;
  correoInput: FormControl;

  verErrorInputs: boolean = false;

  nuevoUsuario: Usuario = {
    idUsuario: 0,
    nombre: '',
    correo: '',
    contrasena: '', //contraseña o DPI
    idRol: 0,
    rol: '',
    iniciales: 'MC',
  };

  isEditar = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService,
    private usuarioServicio: UsuarioService
  ) {
    this.nombreInput = new FormControl('', [
      Validators.required,
      Validators.maxLength(60),
    ]);
    this.dpiInput = new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]);
    this.correoInput = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.email,
    ]);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.type = params['type'];
      let idUsuario = this.encryptionService.decrypt(params['idUsuario']);
      if (idUsuario === '' && this.type === 'editar') {
        history.back();
      }
      if (this.type === 'editar') {
        this.nuevoUsuario.idUsuario = parseInt(idUsuario);
      }
    });
    switch (this.type) {
      case 'crear': {
        this.titulo = 'Crear nuevo usuario';
        break;
      }
      case 'editar': {
        this.isEditar = true;
        this.constantsService.loading(true);
        this.titulo = 'Editar Usuario';
        this.cargarData(this.nuevoUsuario.idUsuario);
        break;
      }
      default: {
        this.titulo = '';
        this.router.navigate(['/GestionarUsuarios']);
        break;
      }
    }
  }

  UpsertSala() {
    this.constantsService.loading(true);
    this.verErrorInputs = true;
    switch (this.type) {
      case 'crear': {
        if (this.validForm()) {
          this.crearNuevoUsuario();
        }
        break;
      }
      case 'editar': {
        if (this.validForm()) {
          this.editarUsuario();
        }
        break;
      }
      default: {
        this.router.navigate(['/GestionarUsuarios']);
        break;
      }
    }
  }

  cargarData(idUsuario: number) {
    this.usuarioServicio.getUsuario(0, idUsuario).subscribe({
      next: (data: any) => {
        let { error, info, usuario } = data.result;
        this.result = info;
        this.existeError = error;
        if (error === 0) {
          this.nuevoUsuario = usuario;
        }
        this.constantsService.loading(false);
      },
      error: (e) => {
        if (e.status === 401 || e.status === 403) {
          this.router.navigate(['/']);
        } else if (e.status == 400) {
          history.back();
        }
      },
    });
  }

  crearNuevoUsuario() {
    this.usuarioServicio.crearUsuario(this.nuevoUsuario).subscribe({
      next: (data: any) => {
        let { info, error, campo } = data.result;
        this.result = info;
        this.existeError = error;
        this.campo = campo;
        if (error === 0) {
          this.router.navigate(['/GestionarUsuarios']);
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

  editarUsuario() {
    this.usuarioServicio.editarUsuario(this.nuevoUsuario).subscribe({
      next: (data: any) => {
        let { info, error, campo } = data.result;
        this.result = info;
        this.existeError = error;
        this.campo = campo;
        if (error === 0) {
          this.router.navigate(['/GestionarUsuarios']);
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

  selectRol(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.nuevoUsuario.idRol = Number(selectedValue);
  }

  getIndexRol(idRol: number): number {
    switch (idRol) {
      case 1: {
        return 2;
      }
      case 2: {
        return 3;
      }
      case 3: {
        return 1;
      }
      default:
        {
        }
        return 0;
    }
  }

  validForm(): boolean {
    let isValid: boolean = true;
    if (this.nombreInput.hasError('maxlength')) {
      isValid = false;
    }

    if (this.dpiInput.hasError('maxlength')) {
      isValid = false;
    }

    if (
      this.correoInput.hasError('maxlength') ||
      this.correoInput.hasError('email')
    ) {
      isValid = false;
    }

    if (!isValid) {
      this.constantsService.loading(false);
    }
    return isValid;
  }
}
