import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JuegoChallengerService {
  constructor() {}

  /* getList(idSala: number, idJugador: number): Observable<JuegoChallenger[]> {
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
  } */
}
