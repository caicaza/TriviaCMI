import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Sala, SalaReciente } from '../model/SalaModel';

@Injectable({
  providedIn: 'root',
})
export class SalaService {
  private apiURL: string = environment.URL + '/api/sala'; //Para crear el usuario
  private apiURLImages: string = environment.URL + '/Content/Images/Sala';
  private apiURLArchivos: string = environment.URL + '/Content/Archivos/Sala';

  constructor(
    private http: HttpClient,
    private usuarioServicio: UsuarioService
  ) {}

  getURLImages() {
    return this.apiURLImages;
  }

  listaSala(estados: number): Observable<Sala[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<Sala[]>(`${this.apiURL}/list/${estados}`, {
      headers: headers,
    });
  }

  listaSalaSearch(estados: number, buscar: string): Observable<Sala[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<Sala[]>(
      `${this.apiURL}/list?estados=${estados}&buscar=${buscar}`,
      {
        headers: headers,
      }
    );
  }

  listaSalaReciente(estados: number, idUsuario: number): Observable<Sala[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<Sala[]>(
      `${this.apiURL}/listReciente/${estados}/${idUsuario}`,
      {
        headers: headers,
      }
    );
  }

  crearSalaReciente(salaReciente: SalaReciente): Observable<SalaReciente> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.post<SalaReciente>(
      `${this.apiURL}/createReciente`,
      salaReciente,
      {
        headers: headers,
      }
    );
  }

  itemSala(
    estados: number,
    idSala: number,
    idUsuario: number
  ): Observable<Sala> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<Sala>(
      `${this.apiURL}/list/${estados}/${idSala}/${idUsuario}`,
      {
        headers: headers,
      }
    );
  }

  crearSala(formData: FormData): Observable<FormData> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    //headers.append('Access-Control-Allow-Credentials', 'true');
    return this.http.post<FormData>(`${this.apiURL}/create`, formData, {
      headers: headers,
    });
  }

  editarSala(formData: FormData): Observable<FormData> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    headers.append('Access-Control-Allow-Credentials', 'true');
    return this.http.put<FormData>(`${this.apiURL}/update`, formData, {
      headers: headers,
    });
  }

  editarEstado(sala: Sala): Observable<Sala> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.put<Sala>(`${this.apiURL}/updateEstado`, sala, {
      headers: headers,
    });
  }

  eliminarSala(idSala: number): Observable<number> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.delete<number>(`${this.apiURL}/delete?idSala=${idSala}`, {
      headers: headers,
    });
  }

  reporteSalas(estados: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.usuarioServicio.getToken()}`,
    });
    return this.http.get<any>(`${this.apiURL}/reporte/sala/${estados}`, {
      headers: headers,
    });
  }

  getUrlArchivo(nombreArcivo: string): string {
    return `${this.apiURLArchivos}/${nombreArcivo}`;
  }
}
