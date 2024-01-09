import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { EncryptionService } from 'src/app/encryption.service';
import { SalaJuego } from 'src/app/model/SalaModel';
import { SalaJuegoService } from 'src/app/services/sala-juego.service';

const preventBackNavigation = true;

@Component({
  selector: 'app-survivor-personal-result',
  templateUrl: './survivor-personal-result.component.html',
  styleUrls: ['./survivor-personal-result.component.css'],
})
export class SurvivorPersonalResultComponent implements OnInit, CanActivate {
  private mainTimerInterval: any;
  public seconds: number = 3;
  finTemporizador: boolean = false;

  error: boolean = false;
  info: string = '';

  idSala: number = 0;
  idUsuario: number = 0;
  isWinner: number = 0;

  InicialesJugador: string = 'CMI';
  NombreJugador: string = '';
  Puntos: number = 0;
  fondoGanar = false;
  imgJugadorVivo = 'assets/Imagenes Juego/S3CirculoPlayer.png';

  verRanking: boolean=false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private salaJuegoService: SalaJuegoService
  ) {
    /* window.onpopstate = () => {
      this.router.navigate(['/MisSalas']); // Aquí puedes realizar la acción que deseas al bloquear el evento de volver atrás.      // Por ejemplo, puedes redirigir al usuario a una página específica:      // window.location.href = '/pagina-de-destino';      // O puedes mostrar un mensaje de advertencia.
    }; */
  }

  ngOnInit() {

    setTimeout(() => {
      this.verRanking=true;     
      //console.log(this.verRanking);    
    }, 60000); 


    this.route.queryParams.subscribe((params) => {
      let idSala = this.encryptionService.decrypt(params['idSala']);
      let idUsuario = this.encryptionService.decrypt(params['idUsuario']);
      let isWinner = this.encryptionService.decrypt(params['isWinner']);
      if (idSala === '' || idUsuario === '' || isWinner === '') {
        history.back();
      }
      this.idUsuario = parseInt(idUsuario);
      this.idSala = parseInt(idSala);
      this.isWinner = parseInt(isWinner);

      if (this.isWinner > 0) {
        this.fondoGanar = true;
        this.verRanking=true;
      } else {
        this.fondoGanar = false;
      }
    });

    this.getInfoResultJugador(this.idSala, this.idUsuario);

    this.mainTimerInterval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        this.finTemporizador = true;
        clearInterval(this.mainTimerInterval);
        // Aquí puedes agregar una acción personalizada cuando el temporizador haya finalizado.
      }
    }, 1000);

   
  }

  canActivate(): boolean {
    if (preventBackNavigation) {
      // Redirige al usuario a una página específica en lugar de permitir la navegación hacia atrás.
      this.router.navigate(['/MisSalas']);
      return false;
    }
    return true;
  }

  getInfoResultJugador(idSala: number, idJugador: number) {
    this.salaJuegoService.getList(idSala, 0).subscribe({
      next: (data: any) => {
        let { info, error, lista } = data.result;
        this.info = info;
        if (error > 0) {
          this.error = true;
        } else {
          this.error = false;
          let listSalaJuego: SalaJuego[] = lista;

          let salaJuegoItem: SalaJuego = listSalaJuego.find(function (element) {
            return element.idSala === idSala && element.idJugador === idJugador;
          })!;

          this.InicialesJugador = salaJuegoItem.iniciales;
          this.Puntos = salaJuegoItem.posicion;
          //this.Pocision = listSalaJuego.indexOf(salaJuegoItem) + 1;
        }
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  cambiarPag(ruta: string, id: number) {
    let idSala = this.encryptionService.encrypt(id.toString());
    let params = { idSala };
    this.router.navigate([ruta], { queryParams: params });
  }

  ngOnDestroy() {
    if (this.mainTimerInterval) {
      clearInterval(this.mainTimerInterval);
    }
  }
}
