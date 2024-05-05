import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { ITipoDocumento } from 'src/app/services/tipodocumento/itipo-documento';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { DialogData } from '../tipodocumento.component';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-ver-tipo-documento',
  templateUrl: './ver-tipo-documento.component.html',
  styleUrls: ['./ver-tipo-documento.component.scss']
})
export class VerTipoDocumentoComponent implements OnInit {

  _tipoDocumentoForm = new FormGroup({
    descripcionTipoDocumentoForm: new FormControl()
  });
  _Titulo: string = "";
  private _tipoDocumentoServices = inject(TipodocumentoService);
  private _authServices = inject(AuthService);
  private _idTipoDocumento!: number;
  private _tipoDocumento!: ITipoDocumento;

  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this._idTipoDocumento = data.idTipoDocumento;
  }

  ngOnInit(): void {
    this._Titulo = 'FORMTIPODOCUMENTO.matDialogTitleVer';
    this.VerTipoDocumento();
  }

  VerTipoDocumento() {
    var usuario = this._authServices.getCurrentUser();
    this._tipoDocumentoServices.BuscarTipoDocumento(this._idTipoDocumento, usuario.idUsuario!)
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


