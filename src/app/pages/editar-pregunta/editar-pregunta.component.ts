import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from 'src/app/constants.service';
import { EncryptionService } from 'src/app/encryption.service';
import { Opcion, Pregunta_OpcionList } from 'src/app/model/SalaModel';
import { PreguntaService } from 'src/app/services/pregunta.service';
//import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-editar-pregunta',
  templateUrl: './editar-pregunta.component.html',
  styleUrls: ['./editar-pregunta.component.css'],
})
export class EditarPreguntaComponent implements OnInit {
  //items: SelectItem[] = [];
  //selectedItem: string | undefined;

  type: string = '';
  titulo: string = '';

  existeError: boolean = false;
  result: string = '';
  auxIdPregunta: number = 0;
  auxOpcionList: Opcion[] = [];
  opcion: string[] = ['A', 'B', 'C', 'D'];

  pregutaOpciones: Pregunta_OpcionList = {
    pregunta: {
      idPregunta: 0,
      nombre: '',
      idSala: 0,
      estado: 0,
      fecha_creacion: '',
      fecha_modificacion: '',
    },
    opcionList: [],
  };

  constructor(
    private preguntaServicio: PreguntaService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private constantsService: ConstantsService
  ) {
    /* this.items = [];
    this.items.push({ label: '2', value: 2 });
    this.items.push({ label: '3', value: 3 });
    this.items.push({ label: '4', value: 4 }); */
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.type = params['type'];
      let idSala = this.encryptionService.decrypt(params['idSala']);
      let idPregunta = this.encryptionService.decrypt(params['idPregunta']);
      if (idSala === '' || idPregunta === '') {
        history.back();
      }
      this.pregutaOpciones.pregunta.idSala = parseInt(idSala);
      this.auxIdPregunta = parseInt(idPregunta);
    });
    switch (this.type) {
      case 'crear': {
        this.titulo = 'Crear Pregunta';
        this.auxIdPregunta = 0;
        break;
      }
      case 'editar': {
        this.constantsService.loading(true);
        this.titulo = 'Editar Pregunta';
        this.pregutaOpciones.pregunta.idPregunta = this.auxIdPregunta;
        this.cargarData(this.auxIdPregunta);
        break;
      }
      default: {
        this.titulo = '';
        history.back();
        break;
      }
    }
  }

  UpsertSala() {
    this.constantsService.loading(true);
    switch (this.type) {
      case 'crear': {
        this.crearNuevaPregunta();
        break;
      }
      case 'editar': {
        this.editarPregunta();
        break;
      }
      default: {
        history.back();
        break;
      }
    }
  }

  cargarData(idPregunta: number) {
    this.preguntaServicio.PregOpcLista(0, idPregunta).subscribe({
      next: (data: any) => {
        const { resultOpcion, resultPregunta } = data;
        const { lista } = resultOpcion;
        const { pregunta } = resultPregunta;
        if (resultPregunta.error > 0) {
        } else {
          this.pregutaOpciones.pregunta = pregunta;
        }
        if (resultOpcion.error > 0) {
        } else {
          this.pregutaOpciones.opcionList = lista;
          this.auxOpcionList = lista;
        }
        this.constantsService.loading(false);
      },
      error: (e) => {
        if (e.status === 401) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  crearNuevaPregunta() {
    this.preguntaServicio
      .crearPreguntaOpciones(this.pregutaOpciones)
      .subscribe({
        next: (data: any) => {
          const { info, error, campo } = data.result;
          this.result = info;
          if (error > 0) {
            this.result += '_' + campo;
            this.existeError = true;
          } else {
            this.existeError = false;
            history.back();
          }
          this.constantsService.loading(false);
        },
        error: (e) => {
          if (e.status === 401) {
            this.router.navigate(['/']);
          }
        },
      });
  }

  editarPregunta() {
    this.preguntaServicio
      .editarPreguntaOpciones(this.pregutaOpciones)
      .subscribe({
        next: (data: any) => {
          const { info, error, campo } = data.result;
          this.result = info;
          if (error > 0) {
            this.result += '_' + campo;
            this.existeError = true;
          } else {
            this.existeError = false;
            history.back();
          }
          this.constantsService.loading(false);
        },
        error: (e) => {
          if (e.status === 401) {
            this.router.navigate(['/']);
          } else if (e.status === 400) {
            history.back();
          }
        },
      });
  }

  opcionCorrecta(event: Event) {
    const valorSeleccionado = (event.target as HTMLInputElement).value;
    this.pregutaOpciones.opcionList.forEach((element) => {
      element.correcta = 0;
    });
    if (Number(valorSeleccionado) < 4) {
      this.pregutaOpciones.opcionList[Number(valorSeleccionado)].correcta = 1;
    } else {
      console.log('Opcion Incorrecta');
      history.back();
    }
  }

  selectTotalOpciones(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (Number(selectedValue) < 5) {
      this.pregutaOpciones.opcionList = this.opcionItem(Number(selectedValue));
    } else {
      this.pregutaOpciones.opcionList = [];
    }
  }

  opcionItem(num: number): Opcion[] {
    var item = [];
    for (let i = 0; i < num; i++) {
      item.push({
        idOpcion: 0,
        nombre: '',
        correcta: 0,
        estado: 0,
        idPregunta: this.auxIdPregunta,
        fecha_creacion: '',
        fecha_modificacion: '',
      });
      if (this.auxOpcionList.length > 0 && i < this.auxOpcionList.length) {
        item[i] = this.auxOpcionList[i];
      }
    }
    return item;
  }

  totalOpciones() {
    if (this.pregutaOpciones.opcionList.length > 0) {
      return this.pregutaOpciones.opcionList.length - 1;
    }
    return 0;
  }

  atras() {
    history.back();
  }
}
