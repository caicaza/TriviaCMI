import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

// Este es para la apiRest
import { HttpClientModule } from '@angular/common/http';

//Componentes de Primeng
/* import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog'; */
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { SliderModule } from 'primeng/slider';
import { KnobModule } from 'primeng/knob';
import { MenuModule } from 'primeng/menu';

//Ventanas creadas
import { VentanaLoginComponent } from './components/ventana-login/ventana-login.component';
import { VentanaRegistroComponent } from './components/ventana-registro/ventana-registro.component';
import { IniciarSesionComponent } from './pages/iniciar-sesion/iniciar-sesion.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CrearSalaComponent } from './pages/crear-sala/crear-sala.component';
import { SalaComponent } from './pages/sala/sala.component';
import { EditarPreguntaComponent } from './pages/editar-pregunta/editar-pregunta.component';
import { PlayerComponent } from './pages/player/player.component';
import { ResultadosAdminComponent } from './pages/resultados-admin/resultados-admin.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngresarImagenComponent } from './pages/ingresar-imagen/ingresar-imagen.component';

//import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDropdownModule,BsDropdownConfig } from 'ngx-bootstrap/dropdown';

import { NgxSliderModule } from 'ngx-slider-v2';

import { authGuard, authGuardAdmin, authGuardPlayer } from './auth.guard';

import { InicioSalaComponent } from './pages/inicio-sala/inicio-sala.component';
import { ChallengersGameComponent } from './pages/challengers-game/challengers-game.component';
import { EsperarJChallengersComponent } from './components/esperar-jchallengers/esperar-jchallengers.component';

import { RankingChallengerComponent } from './components/ranking-challenger/ranking-challenger.component';
import { EntradaSalaComponent } from './pages/entrada-sala/entrada-sala.component';
import { SurvivorGameComponent } from './pages/survivor-game/survivor-game.component';
import { ClipboardModule } from 'ngx-clipboard';
import { SurvivorPersonalResultComponent } from './components/survivor-personal-result/survivor-personal-result.component';
import { GestionarUsuariosComponent } from './pages/gestionar-usuarios/gestionar-usuarios.component';
import { CrearUsuarioComponent } from './pages/crear-usuario/crear-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    VentanaLoginComponent,
    VentanaRegistroComponent,
    IniciarSesionComponent,
    AdminComponent,
    CrearSalaComponent,
    SalaComponent,
    EditarPreguntaComponent,
    PlayerComponent,
    IngresarImagenComponent,
    ResultadosAdminComponent,
    InicioSalaComponent,
    ChallengersGameComponent,
    EsperarJChallengersComponent,
    RankingChallengerComponent,
    EntradaSalaComponent,
    SurvivorGameComponent,
    SurvivorPersonalResultComponent,
    GestionarUsuariosComponent,
    CrearUsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule,
    ClipboardModule,

    BsDropdownModule,

    /* ButtonModule,
    DialogModule,
    NgxDropzoneModule,
    ToastModule, */
    MenuModule,
    ProgressBarModule,
    KnobModule,
    NgxSliderModule,
    SliderModule,
    SidebarModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'Iniciar_Sesion', component: IniciarSesionComponent },
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
        canActivate: [authGuardPlayer],
      },
      {
        path: 'Resultados',
        component: ResultadosAdminComponent,
        canActivate: [authGuardPlayer],
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
        canActivate: [authGuardPlayer],
      },
      {
        path: 'SurvivorResult',
        component: SurvivorPersonalResultComponent,
        canActivate: [authGuardPlayer],
      },
      {
        path: 'GestionarUsuarios',
        component: GestionarUsuariosComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'CrearUsuario',
        component: CrearUsuarioComponent,
        canActivate: [authGuardAdmin],
      },
    ]),
  ],
  providers: [BsDropdownConfig],
  bootstrap: [AppComponent],
})
export class AppModule {}
