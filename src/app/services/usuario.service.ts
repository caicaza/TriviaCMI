import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  crearUsuario(modelo: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiURL}/Create`, modelo);
  }

  loginUsuario(modelo: LoginUsuario): Observable<LoginUsuario> {
    return this.http.post<LoginUsuario>(`${this.apiURL}/auth`, modelo);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    this.router.navigate(['/Iniciar_Sesion']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRol() {
    if (!localStorage.getItem('rol')) {
      this.router.navigate(['/']);
    }

    return localStorage.getItem('rol');
  }

  getIdUsuario() {
    if (!localStorage.getItem('id')) {
      this.router.navigate(['/']);
    }

    return localStorage.getItem('id');
  }

  getUserName() {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }

    return localStorage.getItem('user');
  }
}
