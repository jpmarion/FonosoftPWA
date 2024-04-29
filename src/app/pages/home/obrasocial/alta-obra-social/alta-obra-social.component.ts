import { Component, Injectable, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { RequestAddObraSocial } from 'src/app/services/obrasocial/request-add-obra-social';
import { Error } from 'src/app/model/error';
import { DateRange, MAT_DATE_RANGE_SELECTION_STRATEGY, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Usuario } from 'src/app/model/usuario.model';

@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) { }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.today();//  date;
      const end = this._dateAdapter.addCalendarYears(date, 100);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-alta-obra-social',
  templateUrl: './alta-obra-social.component.html',
  styleUrls: ['./alta-obra-social.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class AltaObraSocialComponent implements OnInit {

  _obraSocialForm = new FormGroup({
    descripcionObraSocialForm: new FormControl('', [Validators.required, Validators.maxLength(200)])
  });
  public _Titulo: string = "";
  public _boton: string = "";

  private request = new RequestAddObraSocial;
  private _tipoDocumentoServices = inject(ObrasocialService);
  private _authServices = inject(AuthService);
  private dialogOk = inject(MatDialog);
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);
  private _usuario!: Usuario;

  constructor(public dialogRef: MatDialogRef<AltaObraSocialComponent>) { }

  ngOnInit(): void {
    this._Titulo = 'FORMOBRASOCIAL.matDialogTitleAlta';
    this._boton = 'FORMOBRASOCIAL.btnAgregar';
  }

  Ejecutar(): void {
    this._usuario = this._authServices.getCurrentUser();
    this.request.idUsuario = this._usuario.idUsuario!;
    this.request.descripcion = this._obraSocialForm.get('descripcionObraSocialForm')?.value!;
    this._tipoDocumentoServices.AgregarObraSocial(this.request)
      .subscribe({
        next: (resultado) => {
          this.openOkDialog('FORMOBRASOCIAL.TituloOkDialogAlta', 'FORMOBRASOCIAL.MsjOkDialogAlta');
          this.dialogRef.close();
        },
        error: (e) => {
          if (e instanceof Error) {
            this.MensajeError(e);
          } else {
            console.error('Un error a ocurrido', e.error.message);
          }
        }
      });
  }

  openOkDialog(titulo: string, mensaje: string) {
    const dialogRef = this.dialogOk.open(OkDialogComponent, {
      data: { titulo: titulo, mensaje: mensaje }
    });
  }

  private MensajeError(error: Error) {
    switch (error.NroError) {
      case "Error7":
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
      default:
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
    }
  }

  private MostrarMsj(msj: string, input: string): void {
    const dialogRef = this.dialogError.open(ErrorDialogComponent, {
      data: { titulo: 'FORMTIPODOCUMENTO.TituloErrorDialog', mensaje: msj }
    })
      .afterClosed()
      .subscribe(result => {
        var elem = this.renderer.selectRootElement(input);
        elem.focus();
      });
  }

  EsDescripcionInvalid() {
    return this._obraSocialForm.get('descripcionTipoDocumentoForm')?.invalid;
  }

  MensajeErrorDescripcion() {
    if (this._obraSocialForm.get('descripcionObraSocialForm')?.errors) {
      if (this._obraSocialForm.get('descripcionObraSocialForm')?.hasError('required')) {
        return 'FORMOBRASOCIAL.errorDescripcionRequired';
      }
      if (this._obraSocialForm.get('descripcionObraSocialForm')?.errors?.['maxLength']) {
        return 'FORMOBRASOCIAL.ErrorDescripcionMaxLength';
      }
    }
    return '';
  }
}
