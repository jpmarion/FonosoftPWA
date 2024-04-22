import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITipoContacto } from './i-tipo-contacto';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Error } from 'src/app/model/error';

@Injectable({
  providedIn: 'root'
})
export class TipocontactoService {
  private apiUrl = environment.apiUrlEntidades;
  private tipoContactoUrl = this.apiUrl + '/api/TipoContacto';

  constructor(
    private http: HttpClient
  ) { }

  BuscarTiposContactos(): Observable<ITipoContacto[]> {
    return this.http.get<ITipoContacto[]>(this.tipoContactoUrl).pipe(
      map((response: ITipoContacto[]) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorModel = new Error();
    switch (error.status) {
      case 400:
        errorModel.NroError = error.error.nroError;
        errorModel.MsgError = error.error.msgError;
        return throwError(() => errorModel);
      default:
        errorModel.NroError = error.status.toString();
        errorModel.MsgError = error.message;
        return throwError(() => errorModel);
    }
  }
}
