import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { DialogData } from '../obrasocial.component';
import { Error } from 'src/app/model/error';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { RequestModifcarObraSocial } from 'src/app/services/obrasocial/request-modifcar-obra-social';
import { IObraSocial } from 'src/app/services/obrasocial/iobra-social';

@Component({
  selector: 'app-modificar-obra-social',
  templateUrl: './modificar-obra-social.component.html',
  styleUrls: ['./modificar-obra-social.component.scss']
})
export class ModificarObraSocialComponent implements OnInit {

  obraSocialForm = new FormGroup({
    descripcionObraSocialForm: new FormControl('', [Validators.required, Validators.maxLength(200)])
  });

  private _idObraSocial!: number;
  private _obraSocial!: IObraSocial;
  private request = new RequestModifcarObraSocial();
  public _Titulo: string = "";
  public _boton: string = "";

  private obraSocialServices = inject(ObrasocialService);
  private dialogOk = inject(MatDialog);
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(
    public dialogRef: MatDialogRef<ModificarObraSocialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this._idObraSocial = data.idObraSocial;
  }

  ngOnInit(): void {
    this._Titulo = 'FORMOBRASOCIAL.matDialogTitleModificar';
    this._boton = 'FORMOBRASOCIAL.btnModificar';
    this.verObraSocial();
  }

  Ejecutar(): void {
    this.request.id = this._idObraSocial;
    this.request.descripcion = this.obraSocialForm.get('descripcionObraSocialForm')?.value ?? '';
    this.obraSocialServices.ModificarObraSocial(this.request)
      .subscribe({
        next: (result) => {
          this.openOkDialog('FORMOBRASOCIAL.TituloOkDialogModificar', 'FORMOBRASOCIAL.MsjOkDialogModificar');
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

  verObraSocial(): void {
    this.obraSocialServices.BuscarObraSocial(this._idObraSocial)
      .subscribe({
        next: (result) => {
          this._obraSocial = result;
          this.obraSocialForm.get('descripcionObraSocialForm')?.setValue(this._obraSocial.nombre!);
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
      data: { titulo: 'FORMOBRASOCIAL.TituloErrorDialog', mensaje: msj }
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
    return this.obraSocialForm.get('descripcionObraSocialForm')?.invalid!;
  }

  MensajeErrorDescripcion(): string {
    if (this.obraSocialForm.get('descripcionObraSocialForm')?.errors) {
      if (this.obraSocialForm.get('descripcionObraSocialForm')?.hasError('required')) {
        return 'FORMOBRASOCIAL.errorDescripcionRequired';
      }
      if (this.obraSocialForm.get('descripcionObraSocialForm')?.errors?.['maxLength']) {
        return 'FORMOBRASOCIAL.ErrorDescripcionMaxLength';
      }
    }
    return '';
  }
}
