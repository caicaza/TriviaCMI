import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { UsuarioService } from './usuario.service';
import { PuntosJugador } from '../model/PuntosJugador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioSalaService {
  private apiURL: string = environment.URL + '/api/Usuario_Sala'; //Para crear el usuario

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioServicio: UsuarioService
  ) {}

  listBySalaRanking(
    estados: number,
    idSala: number
  ): Observable<PuntosJugador[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<PuntosJugador[]>(
      `${this.apiURL}/list/${estados}/${idSala}`,
      {
        headers: headers,
      }
    );
  }

  crearRanking(puntosJugador: PuntosJugador): Observable<PuntosJugador> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.post<PuntosJugador>(
      `${this.apiURL}/create`,
      puntosJugador,
      {
        headers: headers,
      }
    );
  }
}
