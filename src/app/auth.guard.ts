import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';

export const authGuard: CanActivateFn = (route, state) => {
  const usuarioServicio = inject(UsuarioService);
  const router = inject(Router);

  /*  if(usuarioServicio.loggedIn()){
    return true;

  }else{
    return false;
  } */

  if (usuarioServicio.loggedIn()) {
    if (usuarioServicio.getRol() == '1') {
      return true;
    } else if (usuarioServicio.getRol() == '2') {
      return true;
    } else if (usuarioServicio.getRol() == '3') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const authGuardAdmin: CanActivateFn = (route, state) => {
  const usuarioServicio = inject(UsuarioService);
  const router = inject(Router);

  if (usuarioServicio.loggedIn()) {
    if (usuarioServicio.getRol() == '1' || usuarioServicio.getRol() == '3') {
      return true;
    } else {
      router.navigate(['/Iniciar_Sesion']);
      return false;
    }
  } else {
    router.navigate(['/Iniciar_Sesion']);
    return false;
  }
};

export const authGuardPlayer: CanActivateFn = (route, state) => {
  const usuarioServicio = inject(UsuarioService);
  const router = inject(Router);

  if (usuarioServicio.loggedIn()) {
    if (
      usuarioServicio.getRol() == '2' ||
      usuarioServicio.getRol() == '1' ||
      usuarioServicio.getRol() == '3'
    ) {
      return true;
    } else {
      router.navigate(['/Iniciar_Sesion']);
      return false;
    }
  } else {
    router.navigate(['/Iniciar_Sesion']);
    return false;
  }
};
