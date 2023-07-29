import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tipodocumento } from 'src/app/model/tipodocumento';
import { environment } from 'src/environments/environment';
import { Error } from 'src/app/model/error';
import { RequestAddTipoDocumento } from './request-add-tipo-documento';
import { RequestPutTipoDocumento } from './request-put-tipo-documento';
import { ITipoDocumento } from './itipo-documento';

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
export class TipodocumentoService {
  private apiUrl = environment.apiUrlEntidades;
  private tipoDocumentoUrl = this.apiUrl + '/api/TipoDocumento';
  private DeshabilitarTipoDocumentoUrl = this.tipoDocumentoUrl + '/DeshabilitarTipoDocumento/';
  private HabilitarTipoDocumentoUrl = this.tipoDocumentoUrl + '/HabilitarTipoDocumento/';

  constructor(
    private http: HttpClient
  ) { }

  BuscarTodosLosTipoDocumento(): Observable<any> {
    return this.http.get<Tipodocumento[]>(this.tipoDocumentoUrl).pipe(
      map((response: Tipodocumento[]) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
  }

  AgregarTipoDocumento(request: RequestAddTipoDocumento): Observable<any> {
    const requestJson = JSON.stringify({
      descripcion: request.descripcion
    });

    return this.http.post<any>(this.tipoDocumentoUrl, requestJson, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        )
      );
  }

  ModificarTipoDocumento(request: RequestPutTipoDocumento): Observable<any> {
    const requestJson = JSON.stringify({
      id: request.id,
      descripcion: request.descripcion
    });

    return this.http.put<any>(this.tipoDocumentoUrl, requestJson, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        )
      );
  }

  BuscarTipoDocumento(idTipoDocumento: number): Observable<ITipoDocumento> {
    // return this.http.get<Tipodocumento>(this.tipoDocumentoUrl + '/' + idTipoDocumento, httpOptions)
    //   .pipe(
    //     map((response: Tipodocumento) => {
    //       return response;
    //     }),
    //     catchError(error =>
    //       this.handleError(error)
    //     )
    //   );
    return this.http.get<ITipoDocumento>(this.tipoDocumentoUrl+'/'+idTipoDocumento)
    .pipe(
      catchError(error=>
        this.handleError(error))
    );
  }

  DeshabilitarTipoDocumento(idTipoDocumento: number): Observable<any> {
    return this.http.put<any>(this.DeshabilitarTipoDocumentoUrl + idTipoDocumento, httpOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError(error =>
          this.handleError(error)
        )
      );
  }

  HabilitarTipoDocumento(idTipoDocumento: number): Observable<any> {
    return this.http.put<any>(this.HabilitarTipoDocumentoUrl + idTipoDocumento, httpOptions)
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
