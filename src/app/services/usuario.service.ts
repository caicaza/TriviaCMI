import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { Usuario } from '../model/UsuarioModel';
import { LoginUsuario } from '../model/LoginModel';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiURL: string = environment.URL + '/api/usuario'; //Para crear el usuario

  helper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  listaUsuario(estados: number, buscar: string): Observable<Usuario[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<Usuario[]>(
      `${this.apiURL}/list?estados=${estados}&buscar=${buscar}`,
      {
        headers: headers,
      }
    );
  }

  getUsuario(estados: number, idUsuario: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get<Usuario[]>(
      `${this.apiURL}/list/${estados}/${idUsuario}`,
      {
        headers: headers,
      }
    );
  }

  crearUsuario(modelo: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiURL}/Create`, modelo);
  }

  editarUsuario(modelo: Usuario): Observable<Usuario> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.put<Usuario>(`${this.apiURL}/Update`, modelo, {
      headers: headers,
    });
  }

  eliminarUsuario(idUsuario: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.delete<Usuario>(
      `${this.apiURL}/Delete?idUsuario=${idUsuario}`,
      {
        headers: headers,
      }
    );
  }

  loginUsuario(
    modelo: LoginUsuario,
    tipoLogin: number
  ): Observable<LoginUsuario> {
    return this.http.post<LoginUsuario>(
      `${this.apiURL}/auth?tipoLogin=${tipoLogin}`,
      modelo
    );
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    this.removeLocalItems();
    this.router.navigate(['/Iniciar_Sesion']);
  }

  removeLocalItems() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRol() {
    let idRol = '';

    if (this.loggedIn()) {
      let token = this.getToken();
      const decodeToken = this.helper.decodeToken(token!);
      idRol = decodeToken.idRol;
    } else {
      this.router.navigate(['/']);
    }

    return idRol;
  }

  getIdUsuario() {
    let idUsuario = '';

    if (this.loggedIn()) {
      let token = this.getToken();
      const decodeToken = this.helper.decodeToken(token!);
      idUsuario = decodeToken.id;
    } else {
      this.router.navigate(['/']);
    }

    return idUsuario;
  }

  getUserName() {
    let nombre = '';

    if (this.loggedIn()) {
      let token = this.getToken();
      const decodeToken = this.helper.decodeToken(token!);
      nombre = decodeToken.nombre;
    } else {
      this.router.navigate(['/']);
    }

    return nombre;
  }

  getTipoLogin() {
    let tipoLogin = '';

    if (this.loggedIn()) {
      let token = this.getToken();
      const decodeToken = this.helper.decodeToken(token!);
      tipoLogin = decodeToken.tipoLogin;
    } else {
      this.router.navigate(['/']);
    }

    return tipoLogin;
  }
}
