import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { DialogData } from '../obrasocial.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { IObraSocial } from 'src/app/services/obrasocial/iobra-social';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-cambiar-estado-obra-social',
  templateUrl: './cambiar-estado-obra-social.component.html',
  styleUrls: ['./cambiar-estado-obra-social.component.scss']
})
export class CambiarEstadoObraSocialComponent implements OnInit {

  obraSocialForm = new FormGroup({
    descripcionObraSocialForm: new FormControl()
  });

  titulo: string = "";
  boton: string = "";

  private idObraSocial!: number;
  private obraSocial!: IObraSocial;

  private obraSocialServices = inject(ObrasocialService);
  private authServices = inject(AuthService);
  private dialogOk = inject(MatDialog);
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(
    public dialogRef: MatDialogRef<CambiarEstadoObraSocialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.idObraSocial = data.idObraSocial;
  }

  ngOnInit(): void {
    this.titulo = 'FORMOBRASOCIAL.matDialogTitleBaja'
    this.boton = 'FORMOBRASOCIAL.btnCambiarEstado';
    this.verObraSocial();
  }

  Ejecutar(): void {
    var usuario = this.authServices.getCurrentUser();
    this.obraSocialServices.CambiarEstadoObraSocial(this.idObraSocial, usuario.idUsuario!)
      .subscribe({
        next: (resultado) => {
          this.openOkDialog('FORMOBRASOCIAL.TituloOkDialogCambiarEstado', 'FORMOBRASOCIAL.MsjOkDialogCambiarEstado');
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
    var usuario = this.authServices.getCurrentUser()
    this.obraSocialServices.BuscarObraSocial(this.idObraSocial, usuario.idUsuario!)
      .subscribe({
        next: (result) => {
          this.obraSocial = result;
          this.obraSocialForm.get('descripcionObraSocialForm')?.setValue(this.obraSocial.nombre!);
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
}
