import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciarSesionComponent } from './pages/iniciar-sesion/iniciar-sesion.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/Iniciar_Sesion',
    pathMatch: 'full'
  },
  {
    path: 'Iniciar_Sesion', component: IniciarSesionComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
