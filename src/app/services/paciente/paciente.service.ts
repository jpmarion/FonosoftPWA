import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Error } from 'src/app/model/error';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddPaciente } from './AddPaciente';
import { IPaciente } from './ipaciente';
import { ModPaciente } from './mod-paciente';
import { ModDocumento } from './mod-documento';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiUrlEntidades;
  private pacienteUrl = this.apiUrl + '/api/Paciente';
  private pacienteAgregarDocumentoUrl= this.pacienteUrl+'/AgregarDocumento';
  private pacienteModificarDocumentoUrl = this.pacienteUrl + '/ModificarDocumento';
  private pacienteUrlGet = this.pacienteUrl + '/';

  constructor(
    private http: HttpClient
  ) { }

  BuscarTodosLosPacientes(): Observable<any> {
    return this.http.get<IPaciente[]>(this.pacienteUrl).pipe(
      map((response: IPaciente[]) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
  }

  BuscarPaciente(idPaciente: number): Observable<any> {
    return this.http.get<IPaciente>(this.pacienteUrlGet + idPaciente).pipe(
      map((response: IPaciente) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
  }

  AgregarPaciente(requestAddPaciente: AddPaciente): Observable<any> {
    const request = JSON.stringify({
      apellido: requestAddPaciente.apellido,
      nombre: requestAddPaciente.nonbre,
      obrasSociales: requestAddPaciente.obrasSociales,
      contactos: requestAddPaciente.contactos,
      documentos: requestAddPaciente.documentos
    });

    return this.http.post(this.pacienteUrl, request, httpOptions)
      .pipe(
        map((respnse: any) => {
          return respnse;
        }),
        catchError(error =>
          this.handleError(error)
        ));
  }
  ModificarPaciente(rqsModPaciente: ModPaciente): Observable<any> {
    const request = JSON.stringify({
      idPaciente: rqsModPaciente.idPaciente,
      apellido: rqsModPaciente.apellido,
      nombre: rqsModPaciente.nombre
    });

    return this.http.put(this.pacienteUrl, request, httpOptions)
    .pipe(
      map((respnse: any) => {
        return respnse;
      }),
      catchError(error =>
        this.handleError(error)
      ));
  }

  AgregarPacienteDocumento(rqsDocumento:ModDocumento):Observable<any>{
    const request = JSON.stringify({
      idEntidadPaciente:rqsDocumento.IdPaciente,
      idTipoDocumento:rqsDocumento.IdTipoDocumento,
      nroDocumento:rqsDocumento.NroDocumento
    });

    return this.http.post(this.pacienteAgregarDocumentoUrl, request, httpOptions)
    .pipe(
      map((respnse: any) => {
        return respnse;
      }),
      catchError(error =>
        this.handleError(error)
      ));
  }
  ModificarPacienteDocumento(rqsDocumento:ModDocumento):Observable<any>{
    const request = JSON.stringify({
      idEntidadPaciente:rqsDocumento.IdPaciente,
      idTipoDocumento:rqsDocumento.IdTipoDocumento,
      nroDocumento:rqsDocumento.NroDocumento
    });

    return this.http.put(this.pacienteModificarDocumentoUrl, request, httpOptions)
    .pipe(
      map((respnse: any) => {
        return respnse;
      }),
      catchError(error =>
        this.handleError(error)
      ));
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
