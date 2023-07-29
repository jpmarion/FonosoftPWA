import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { RequestAddTipoDocumento } from 'src/app/services/tipodocumento/request-add-tipo-documento';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';

@Component({
  selector: 'app-alta-tipo-documento',
  templateUrl: './alta-tipo-documento.component.html',
  styleUrls: ['./alta-tipo-documento.component.scss']
})
export class AltaTipoDocumentoComponent implements OnInit {

  _tipoDocumentoForm = new FormGroup({
    descripcionTipoDocumentoForm: new FormControl()
  });
  public _Titulo: string = "";
  public _boton: string = "";
  private request = new RequestAddTipoDocumento;

  private _tipoDocumentoServices = inject(TipodocumentoService);
  private dialogOk = inject(MatDialog);
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(public dialogRef: MatDialogRef<AltaTipoDocumentoComponent>,) { }

  ngOnInit(): void {
    this._Titulo = 'FORMTIPODOCUMENTO.matDialogTitleAlta';
    this._boton = 'FORMTIPODOCUMENTO.btnAgregar';
  }

  Ejecutar(): void {
    this.request.descripcion = this._tipoDocumentoForm.get('descripcionTipoDocumentoForm')?.value;
    this._tipoDocumentoServices.AgregarTipoDocumento(this.request)
      .subscribe({
        next: (resultado) => {
          this.openOkDialog('FORMTIPODOCUMENTO.TituloOkDialogAlta', 'FORMTIPODOCUMENTO.MsjOkDialogAlta');
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
