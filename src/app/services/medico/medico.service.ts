import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Error } from 'src/app/model/error';
import { environment } from 'src/environments/environment';
import { IMedico } from './imedico';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'accept': '*/*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = environment.apiUrlEntidades;
  private medicoUrl = this.apiUrl + '/api/medico'

  constructor(
    private http: HttpClient
  ) { }

  BuscarMedicos(idUsuario: BigInteger) {
    return this.http.get<IMedico[]>(this.medicoUrl + '/' + idUsuario).pipe(
      map((response: IMedico[]) => {
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
