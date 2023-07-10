import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tipodocumento } from 'src/app/model/tipodocumento';
import { environment } from 'src/environments/environment';
import { Error } from 'src/app/model/error';

@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {
  private apiUrl = environment.apiUrlEntidades;
  private pacienteUrl = this.apiUrl + '/api/TipoDocumento';

  constructor(
    private http: HttpClient
  ) { }

  BuscarTodosLosTipoDocumento(): Observable<any> {
    return this.http.get<Tipodocumento[]>(this.pacienteUrl).pipe(
      map((response: Tipodocumento[]) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
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
}
