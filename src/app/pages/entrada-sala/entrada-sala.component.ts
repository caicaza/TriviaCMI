import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Pregunta_OpcionList } from 'src/app/model/SalaModel';
import { PreguntaService } from 'src/app/services/pregunta.service';

@Component({
  selector: 'app-entrada-sala',
  templateUrl: './entrada-sala.component.html',
  styleUrls: ['./entrada-sala.component.css'],
})
export class EntradaSalaComponent implements OnInit {
  numVentana: number = 1;
  idSala: number = 0;
  errorResultPreOp: number = 0;
  preList_opcList: Pregunta_OpcionList[] = [];

  constructor(
    private preguntaServicio: PreguntaService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService
  ) {
    this.numVentana = 1;
  }

  cambiarnumVentana(nuevoValor: number) {
    console.log('Entro');
    console.log(nuevoValor);

    this.numVentana = nuevoValor;
  }

  ngOnInit() {
    this.constantsService.loading(true);
    this.route.queryParams.subscribe((params) => {
      let idSala = this.encryptionService.decrypt(params['idSala']);
      if (idSala === '') {
        history.back();
      }
      this.idSala = parseInt(idSala);
    });
    this.dataPregListOpcList(this.idSala);
  }

  dataPregListOpcList(idSala: number) {
    this.preguntaServicio.PregListOpList(1, idSala).subscribe({
      next: (data: any) => {
        const { error, list } = data.result;
        //console.log(data);
        this.errorResultPreOp = error;
        this.preList_opcList = list;
        this.constantsService.loading(false);
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }
}
