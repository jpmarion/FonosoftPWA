import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Usuario } from 'src/app/model/usuario.model';
import { environment } from 'src/environments/environment';
import { RequestLogin } from './request-login.model';
import { Error } from 'src/app/model/error';
import { RequestCambiarContrasenia } from './request-cambiar-contrasenia';
import { RequestRegistro } from '../paciente/request-registro';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser?: Usuario;
  private readonly apiUrl = environment.apiUrlAuth;
  private loginUrl = this.apiUrl + '/api/Auth/Login';
  private cambiarContraseniaUrl = this.apiUrl + '/api/Auth/ModificarContrasenia';
  private registrarUrl = this.apiUrl + '/api/Auth/Registrar';
  private confirmarUsuarioUrl = this.apiUrl + '/api/Auth/Confirmar';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  onLogin(requestLogin: RequestLogin): Observable<any> {
    const request = JSON.stringify({
      nombreUsuario: requestLogin.nombreUsuario,
      contrasenia: requestLogin.password
    });

    return this.http.post(this.loginUrl, request, httpOptions)
      .pipe(
        map((response: Usuario) => {
          this.currentUser = response;
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        ));
  }

  onLogout(): void {
    this.currentUser = undefined;
  }

  CambiarContraseniaUsuairo(requestCambiarContrasenia: RequestCambiarContrasenia): Observable<any> {
    const request = JSON.stringify({
      idUsuario: requestCambiarContrasenia.id,
      password: requestCambiarContrasenia.password
    });

    return this.http.post(this.cambiarContraseniaUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        ));
  }

  Registrar(requestRegistro: RequestRegistro): Observable<any> {
    const request = JSON.stringify({
      nombreUsuario: requestRegistro.nombreUsuario,
      email: requestRegistro.email,
      contrasenia: requestRegistro.password,
    });

    return this.http.post(this.registrarUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        ));
  }

  ConfirmarRegistro(id: string): Observable<any> {
    const request = JSON.stringify({
      Id: id
    });

    return this.http.post(this.confirmarUsuarioUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        ));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        let errorModel = new Error();
        errorModel.NroError = error.error.nroError;
        errorModel.MsgError = error.error.msgError;
        return throwError(() => errorModel);
      default:
        return `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }

  getToken(): string {
    return this.currentUser?.token!;
  }

  getCurrentUser(): Usuario {
    return this.currentUser!;
  }

  estaAutenticado(): boolean {
    if (this.currentUser?.token) {
      return true;
    }
    return false;
  }
}
