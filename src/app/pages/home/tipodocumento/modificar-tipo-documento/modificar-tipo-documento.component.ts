import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Error } from 'src/app/model/error';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { ITipoDocumento } from 'src/app/services/tipodocumento/itipo-documento';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { RequestPutTipoDocumento } from 'src/app/services/tipodocumento/request-put-tipo-documento';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { DialogData } from '../tipodocumento.component';

@Component({
  selector: 'app-modificar-tipo-documento',
  templateUrl: './modificar-tipo-documento.component.html',
  styleUrls: ['./modificar-tipo-documento.component.scss']
})
export class ModificarTipoDocumentoComponent implements OnInit {

  _tipoDocumentoForm = new FormGroup({
    descripcionTipoDocumentoForm: new FormControl()
  });
  private _idTipoDocumento!: number;
  private _tipoDocumento!: ITipoDocumento;
  public _Titulo: string = "";
  public _boton: string = "";
  private _request = new RequestPutTipoDocumento();

  private _tipoDocumentoServices = inject(TipodocumentoService);
  private dialogOk = inject(MatDialog);
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(
    public dialogRef: MatDialogRef<ModificarTipoDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this._idTipoDocumento = data.idTipoDocumento;
  }
  ngOnInit(): void {
    this._Titulo = 'FORMTIPODOCUMENTO.matDialogTitleModificar';
    this._boton = 'FORMTIPODOCUMENTO.btnModificar';
    this.VerTipoDocumento();
  }

  VerTipoDocumento() {
    this._tipoDocumentoServices.BuscarTipoDocumento(this._idTipoDocumento)
      .subscribe({
        next: (result) => {
          this._tipoDocumento = result;
          this._tipoDocumentoForm.get('descripcionTipoDocumentoForm')?.setValue(this._tipoDocumento?.descripcion!);
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

  Ejecutar(): void {
    this._request.id = this._idTipoDocumento;
    this._request.descripcion = this._tipoDocumentoForm.get('descripcionTipoDocumentoForm')?.value ?? '';
    this._tipoDocumentoServices.ModificarTipoDocumento(this._request)
      .subscribe({
        next: (resultado) => {
          this.openOkDialog('FORMTIPODOCUMENTO.TituloOkDialogModificar', 'FORMTIPODOCUMENTO.MsjOkDialogModificar');
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

  openOkDialog(titulo: string, mensaje: string) {
    const dialogRef = this.dialogOk.open(OkDialogComponent, {
      data: { titulo: titulo, mensaje: mensaje }
    });
  }

  EsDescripcionInvalid(): boolean {
    return this._tipoDocumentoForm.get('descripcionTipoDocumentoForm')?.invalid!;
  }

  MensajeErrorDescripcion(): string {
    if (this._tipoDocumentoForm.get('descripcion')?.errors) {
      if (this._tipoDocumentoForm.get('descripcion')?.hasError('required')) {
        return 'FORMTIPODOCUMENTO.errorDescripcionRequired';
      }
      if (this._tipoDocumentoForm.get('descripcion')?.errors?.['maxLength']) {
        return 'FORMTIPODOCUMENTO.ErrorDescripcionMaxLength';
      }
    }
    return '';
  }
}
