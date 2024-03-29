import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IObraSocial } from 'src/app/model/iobra-social';
import { environment } from 'src/environments/environment';
import { Error } from 'src/app/model/error';
import { RequestAddObraSocial } from './request-add-obra-social';
import { RequestModifcarObraSocial } from './request-modifcar-obra-social';

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
  private habilitadosURl = this.obraSocialUrl + '/Habilitados';
  private deshabilitarObraSocialUrl = this.obraSocialUrl + '/Deshabilitar/';
  private habilitarObraSocialUrl = this.obraSocialUrl + '/Habilitar/';

  constructor(
    private http: HttpClient
  ) { }

  BuscarObrasSociales(): Observable<any> {
    return this.http.get<IObraSocial[]>(this.obraSocialUrl).pipe(
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
      descripcion: requestAddObraSocial.descripcion
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
      id: requestModificarObraSocial.id,
      descripcion: requestModificarObraSocial.descripcion
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

  DeshabilitarObraSocial(idObraSocial: number): Observable<any> {
    return this.http.put<any>(this.deshabilitarObraSocialUrl + idObraSocial, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        )
      );
  }

  HabilitarObraSocial(idObraSocial: number): Observable<any> {
    return this.http.put<any>(this.habilitarObraSocialUrl + idObraSocial, httpOptions)
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
