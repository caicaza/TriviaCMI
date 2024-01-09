import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciarSesionComponent } from './pages/iniciar-sesion/iniciar-sesion.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard, authGuardAdmin, authGuardPlayer } from './auth.guard';
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
import { SurvivorPersonalResultComponent } from './components/survivor-personal-result/survivor-personal-result.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/Iniciar_Sesion',
    pathMatch: 'full'
  },
  {
    path: 'Administrador',
    component: AdminComponent,
    canActivate: [authGuardAdmin],
  },
  {
    path: 'CrearSala',
    component: CrearSalaComponent,
    canActivate: [authGuardAdmin],
  },
  { path: 'Sala', component: SalaComponent, canActivate: [authGuardAdmin] },
  {
    path: 'Editar_pregunta',
    component: EditarPreguntaComponent,
    canActivate: [authGuardAdmin],
  },
  {
    path: 'Ingresar_Imagen',
    component: IngresarImagenComponent,
    canActivate: [authGuardAdmin],
  },
  {
    path: 'MisSalas',
    component: PlayerComponent,
    //canActivate: [authGuardPlayer],
  },
  {
    path: 'Resultados',
    component: ResultadosAdminComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'InicioSala',
    component: InicioSalaComponent,
    canActivate: [authGuardPlayer],
  },
  {
    path: 'JuegoChallengers',
    component: ChallengersGameComponent,
    canActivate: [authGuardPlayer],
  },
  {
    path: 'JuegoSupervivencia',
    component: SurvivorGameComponent,
    //canActivate: [authGuardPlayer],
  },
  {
    path: 'EntradaSala',
    component: EntradaSalaComponent,
    canActivate: [authGuardPlayer],
  },
  {
    path: 'RankingChallengers',
    component: RankingChallengerComponent,
    //canActivate: [authGuard],
  },
  {
    path: 'SurvivorResult',
    component: SurvivorPersonalResultComponent,
   // canActivate: [authGuardPlayer],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
