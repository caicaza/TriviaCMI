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
  

  if(usuarioServicio.loggedIn()){
    console.log(usuarioServicio.getRol());
    
      console.log("Entro1");
      if (usuarioServicio.getRol() == '1') {
        //router.navigate(['/Administrador']);
        return true;
      } else if (usuarioServicio.getRol() == '2') {
       // router.navigate(['/MisSalas']);
       console.log("Entro rol2");
        return true;
        
      } else{
        return false;
      }
    }else{
      return false;
    }  
  

  
};
