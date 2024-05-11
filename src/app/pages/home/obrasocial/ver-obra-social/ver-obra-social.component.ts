import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { DialogData } from '../obrasocial.component';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { IObraSocial } from 'src/app/services/obrasocial/iobra-social';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-ver-obra-social',
  templateUrl: './ver-obra-social.component.html',
  styleUrls: ['./ver-obra-social.component.scss']
})
export class VerObraSocialComponent implements OnInit {

  obraSocialForm = new FormGroup({
    descripcionObraSocialForm: new FormControl()
  });

  titulo: string = "";
  private obraSocialServices = inject(ObrasocialService);
  private authServices = inject(AuthService);
  private idObraSocial!: number;
  private obraSocial!: IObraSocial;

  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.idObraSocial = data.idObraSocial;
  }

  ngOnInit(): void {
    this.titulo = 'FORMOBRASOCIAL.matDialogTitleVer'
    this.verObraSocial();
  }

  verObraSocial(): void {
    var usuario = this.authServices.getCurrentUser();
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

}
