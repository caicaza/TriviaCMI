import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { UsuarioService } from './usuario.service';
import { JuegoChallenger } from '../model/JuegoChallenger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JuegoChallengerService {
  private apiURL: string = environment.URL + '/api/JuegoChallenger';

  constructor(private http: HttpClient) {}

  getList(idSala: number, idJugador: number): Observable<JuegoChallenger[]> {
    return this.http.get<JuegoChallenger[]>(
      `${this.apiURL}/list/${idSala}/${idJugador}`
    );
  }

  createItem(JuegoChallenger: JuegoChallenger) {
    return this.http.post<JuegoChallenger>(
      `${this.apiURL}/create`,
      JuegoChallenger
    );
  }

  updateItem(JuegoChallenger: JuegoChallenger) {
    return this.http.post<JuegoChallenger>(
      `${this.apiURL}/update`,
      JuegoChallenger
    );
  }
}
