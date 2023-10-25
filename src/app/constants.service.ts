import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  constructor() {}

  mensajeSatisfactorio(): string {
    return 'Proceso Ejecutado';
  }

  mensajeError(): string {
    return 'Error';
  }

  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  loading(visible: boolean) {
    //, none: boolean
    const loading = document.getElementById('loading');
    if (loading) {
      /* if(none){
        loading.classList.add('hidden');
        return;
      } */
      if (visible) {
        loading.classList.remove('hidden');
      } else {
        setTimeout(() => {
          loading.classList.add('hidden');
        }, 300);
      }
    }
  }
}
