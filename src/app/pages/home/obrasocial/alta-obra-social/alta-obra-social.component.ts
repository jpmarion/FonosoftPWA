import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { RequestAddObraSocial } from 'src/app/services/obrasocial/request-add-obra-social';
import { Error } from 'src/app/model/error';

@Component({
  selector: 'app-alta-obra-social',
  templateUrl: './alta-obra-social.component.html',
  styleUrls: ['./alta-obra-social.component.scss']
})
export class AltaObraSocialComponent implements OnInit {

  _obraSocialForm = new FormGroup({
    descripcionObraSocialForm: new FormControl('', [Validators.required, Validators.maxLength(200)])
  });
  public _Titulo: string = "";
  public _boton: string = "";

  private request = new RequestAddObraSocial;
  private _tipoDocumentoServices = inject(ObrasocialService);
  private dialogOk = inject(MatDialog);
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(public dialogRef: MatDialogRef<AltaObraSocialComponent>) { }

  ngOnInit(): void {
    this._Titulo = 'FORMOBRASOCIAL.matDialogTitleAlta';
    this._boton = 'FORMOBRASOCIAL.btnAgregar';
  }

  Ejecutar(): void {
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
