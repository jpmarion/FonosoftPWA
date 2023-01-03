import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Usuario } from 'src/app/model/usuario.model';
import { environment } from 'src/environments/environment';
import { RequestLogin } from './request-login.model';
import { Error } from 'src/app/model/error';

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
  private readonly apiUrl = environment.apiUrl;
  private loginUrl = this.apiUrl + '/api/Login/login';

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
          return response;
        }),
        catchError(this.handleError
        ));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        let errorModel = new Error();
        errorModel.NroError = error.error.nroError;
        errorModel.MsgError = error.error.msgError;
        return throwError(() => errorModel);
      // return throwError(() => error.error);
      default:
        return `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
}
