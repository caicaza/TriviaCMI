import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciarSesionComponent } from './pages/iniciar-sesion/iniciar-sesion.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard } from './auth.guard';
import { CrearSalaComponent } from './pages/crear-sala/crear-sala.component';
import { SalaComponent } from './pages/sala/sala.component';
import { EditarPreguntaComponent } from './pages/editar-pregunta/editar-pregunta.component';
import { IngresarImagenComponent } from './pages/ingresar-imagen/ingresar-imagen.component';
import { PlayerComponent } from './pages/player/player.component';
import { ResultadosAdminComponent } from './pages/resultados-admin/resultados-admin.component';
import { InicioSalaComponent } from './pages/inicio-sala/inicio-sala.component';
import { ChallengersGameComponent } from './pages/challengers-game/challengers-game.component';
import { SurvivorGameComponent } from './pages/survivor-game/survivor-game.component';
import { EntradaSalaComponent } from './pages/entrada-sala/entrada-sala.component';
import { RankingChallengerComponent } from './components/ranking-challenger/ranking-challenger.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/Iniciar_Sesion',
    pathMatch: 'full'
  },
  {
    path: 'Iniciar_Sesion', component: IniciarSesionComponent,
  },
  {
    path: 'Administrador',
    component: AdminComponent,
    canActivate: [authGuard],
  },
  {
    path: 'CrearSala',
    component: CrearSalaComponent,
    canActivate: [authGuard],
  },
  { path: 'Sala', component: SalaComponent, canActivate: [authGuard] },
  {
    path: 'Editar_pregunta',
    component: EditarPreguntaComponent,
    canActivate: [authGuard],
  },
  {
    path: 'Ingresar_Imagen',
    component: IngresarImagenComponent,
    canActivate: [authGuard],
  },
  {
    path: 'MisSalas',
    component: PlayerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'EntradaSala/:idSala', // Define una ruta con un parámetro dinámico
    component: EntradaSalaComponent,
     //canActivate: [authGuard],
  },
  {
    path: 'Resultados',
    component: ResultadosAdminComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'InicioSala',
    component: InicioSalaComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'JuegoChallengers',
    component: ChallengersGameComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'JuegoSupervivencia',
    component: SurvivorGameComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'EntradaSala',
    component: EntradaSalaComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'RankingChallengers',
    component: RankingChallengerComponent,
    //canActivate: [authGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
