import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { ITipoDocumento } from 'src/app/services/tipodocumento/itipo-documento';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { DialogData } from '../tipodocumento.component';


@Component({
  selector: 'app-cambiar-estado-tipo-documento',
  templateUrl: './cambiar-estado-tipo-documento.component.html',
  styleUrls: ['./cambiar-estado-tipo-documento.component.scss']
})
export class CambiarEstadoTipoDocumentoComponent implements OnInit {

  _tipoDocumentoForm = new FormGroup({
    descripcionTipoDocumentoForm: new FormControl()
  });
  private _idTipoDocumento!: number;
  private _tipoDocumento!: ITipoDocumento;
  public _Titulo: string = "";
  public _boton: string = "";

  private _tipoDocumentoServices = inject(TipodocumentoService);
  private dialogOk = inject(MatDialog);
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(
    public dialogRef: MatDialogRef<CambiarEstadoTipoDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this._idTipoDocumento = data.idTipoDocumento;
  }

  ngOnInit(): void {
    this._Titulo = 'FORMTIPODOCUMENTO.matDialogTitleBaja';
    this._boton = 'FORMTIPODOCUMENTO.btnBaja';
    this.VerTipoDocumento();
  }

  VerTipoDocumento() {
    this._tipoDocumentoServices.BuscarTipoDocumento(this._idTipoDocumento)
      .subscribe({
        next: (result) => {
          this._tipoDocumento = result;
          this._tipoDocumentoForm.get('descripcionTipoDocumentoForm')?.setValue(this._tipoDocumento?.nombreTipoDocumento!);
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
    this._tipoDocumentoServices.CambiarEstadoTipoDocumento(this._idTipoDocumento)
    .subscribe({
      next: (resultado) => {
        this.openOkDialog('FORMTIPODOCUMENTO.TituloOkDialogCambiarEstado', 'FORMTIPODOCUMENTO.MsjOkDialogCambiarEstado');
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
}
