import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Error } from 'src/app/model/error';
import { RequestAddObraSocial } from './request-add-obra-social';
import { RequestModifcarObraSocial } from './request-modifcar-obra-social';
import { IObraSocial } from './iobra-social';

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
export class ObrasocialService {

  private apiUrl = environment.apiUrlEntidades;
  private obraSocialUrl = this.apiUrl + '/api/ObraSocial';
  private todasUrl = this.obraSocialUrl + '/Todas';
  private habilitadosURl = this.obraSocialUrl + '/GetHabilitados';
  private cambiarEstadoObraSocialUrl = this.obraSocialUrl + '/CambiarEstado?IdObraSocial=';

  constructor(
    private http: HttpClient
  ) { }

  BuscarObrasSociales(idUsuario: BigInteger): Observable<any> {
    return this.http.get<IObraSocial[]>(this.todasUrl + '/' + idUsuario).pipe(
      map((response: IObraSocial[]) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
  }

  BuscarObrasSocialesHabilitadas(): Observable<any> {
    return this.http.get<IObraSocial[]>(this.habilitadosURl).pipe(
      map((response: IObraSocial[]) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
  }

  BuscarObraSocial(idObraSocial: number): Observable<IObraSocial> {
    return this.http.get<IObraSocial>(this.obraSocialUrl + '/' + idObraSocial)
      .pipe(
        catchError(error =>
          this.handleError(error))
      );
  }

  AgregarObraSocial(requestAddObraSocial: RequestAddObraSocial): Observable<any> {
    const requestJson = JSON.stringify({
      idUsuario: requestAddObraSocial.idUsuario,
      nombreObraSocial: requestAddObraSocial.descripcion,
    });

    return this.http.post<any>(this.obraSocialUrl, requestJson, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        )
      );
  }

  ModificarObraSocial(requestModificarObraSocial: RequestModifcarObraSocial): Observable<any> {
    const requestJson = JSON.stringify({
      idObraSocial: requestModificarObraSocial.id,
      nombre: requestModificarObraSocial.descripcion
    });

    return this.http.put<any>(this.obraSocialUrl, requestJson, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        )
      );
  }

  CambiarEstadoObraSocial(idObraSocial: number): Observable<any> {
    return this.http.put<any>(this.cambiarEstadoObraSocialUrl + idObraSocial, httpOptions)
      .pipe(
        map((response: any) => {
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
