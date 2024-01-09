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
  private apiURL: string = environment.URL + '/api/Usuario_Sala';
  private apiURLArchivos: string =
    environment.URL + '/Content/Archivos/Ranking';

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

  deleteRanking(idSala: Number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.delete<any>(`${this.apiURL}/delete?idSala=${idSala}`, {
      headers: headers,
    });
  }

  reporteRankingById(estados: number, idSala: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<any>(
      `${this.apiURL}/reporte/ranking/${estados}/${idSala}`,
      {
        headers: headers,
      }
    );
  }

  reporteRanking(estados: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<any>(`${this.apiURL}/reporte/ranking/${estados}`, {
      headers: headers,
    });
  }

  getUrlArchivo(nombreArcivo: string): string {
    return `${this.apiURLArchivos}/${nombreArcivo}`;
  }
}
