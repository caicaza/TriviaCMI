import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { SalaJuego } from '../model/SalaModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaJuegoService {
  private apiURL: string = environment.URL + '/api/SalaJuego';

  constructor(private http: HttpClient) {}

  getList(idSala: number, idJugador: number): Observable<SalaJuego[]> {
    return this.http.get<SalaJuego[]>(
      `${this.apiURL}/list/${idSala}/${idJugador}`
    );
  }

  getListByIds(idSala: number, idJugador: number): Observable<SalaJuego[]> {
    return this.http.get<SalaJuego[]>(
      `${this.apiURL}/listByIds/${idSala}/${idJugador}`
    );
  }

  createItem(salaJuego: SalaJuego) {
    return this.http.post<SalaJuego>(`${this.apiURL}/create`, salaJuego);
  }

  updateItem(salaJuego: SalaJuego) {
    return this.http.post<SalaJuego>(`${this.apiURL}/update`, salaJuego);
  }
}
