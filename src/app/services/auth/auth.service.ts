import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
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
  private loginUrl = this.apiUrl + '/api/Login/login';
  private cambiarContraseniaUrl = this.apiUrl + '/api/Login/cambiarcontraseniausuario';
  private registrarUrl = this.apiUrl + '/api/Login/registrar';
  private confirmarUsuarioUrl = this.apiUrl + '/api/Login/confirmarusuario/?nombreUsuario=';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  onLogin(requestLogin: RequestLogin): Observable<any> {
    const request = JSON.stringify({
      nombreUsuario: requestLogin.nombreUsuario,
      password: requestLogin.password
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

  CambiarContraseniaUsuairo(requestCambiarContrasenia: RequestCambiarContrasenia): Observable<any> {
    const request = JSON.stringify({
      id: requestCambiarContrasenia.id,
      password: requestCambiarContrasenia.password
    });

    return this.http.post(this.cambiarContraseniaUrl, request, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(this.handleError
        ));
  }

  Registrar(requestRegistro: RequestRegistro): Observable<any> {
    const request = JSON.stringify({
      nombreUsuario: requestRegistro.usuario,
      email: requestRegistro.email,
      password: requestRegistro.password,
      BodyConfirmarRegistro: requestRegistro.bodyConfirmarRegistro
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

  ConfirmarRegistro(nombreUsuario: string): Observable<any> {
    const body: string = '';
    return this.http.put(this.confirmarUsuarioUrl + nombreUsuario, body)
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

  estaAutenticado(): boolean {
    if (this.currentUser?.token) {
      return true;
    }
    return false;
  }
}
