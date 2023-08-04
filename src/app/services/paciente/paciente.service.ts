import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Error } from 'src/app/model/error';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paciente } from 'src/app/model/paciente';
import { RequestAddPaciente } from './request-add-paciente';

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
  private pacienteUrl = this.apiUrl + '/api/paciente';

  constructor(
    private http: HttpClient
  ) { }

  BuscarTodosLosPacientes(): Observable<any> {
    return this.http.get<Paciente[]>(this.pacienteUrl).pipe(
      map((response: Paciente[]) => {
        return response;
      }),
      catchError(error =>
        this.handleError(error)
      )
    );
  }

  AgregarPaciente(requestAddPaciente: RequestAddPaciente): Observable<any> {
    const request = JSON.stringify({
      descripcion: requestAddPaciente.TipoDocumento
    });

    return this.http.post(this.pacienteUrl, request)
      .pipe(
        map((respnse: any) => {
          return respnse;
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
}
