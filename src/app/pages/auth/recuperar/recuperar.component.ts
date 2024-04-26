import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from './confirmar-email';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OkDialogComponent } from '../../dialog/ok-dialog/ok-dialog.component';
import { ErrorDialogComponent } from '../../dialog/error-dialog/error-dialog.component';
import { Error } from 'src/app/model/error';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent {
  estadoBoton = false;
  RecuperarForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, matchValidator('email')]),
  });

  constructor(
    private authService: AuthService,
    private dialogOk: MatDialog,
    public dialogRefRecuperar: MatDialogRef<RecuperarComponent>,
    private dialogError: MatDialog,
    private renderer: Renderer2) { }

  recuperar() {
    var email = this.RecuperarForm.get('email')?.value;
    this.authService.ResetContrasenia(email!)
      .subscribe({
        next: (resultado) => {
          const dialogRef = this.dialogOk.open(OkDialogComponent, {
            data: { titulo: 'FORMRECUPERAR.TituloOkDialog', mensaje: 'FORMRECUPERAR.MsjOkDialog' }
          }).afterClosed().subscribe((result) => {
            this.dialogRefRecuperar.close();

          });
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
      case "Error1":
      case "Error6":
      case "Error8":
        this.MostrarMsj(error.MsgError?.toString()!, 'usuario');
        break;
      case "Error2":
      case "Error3":
        this.MostrarMsj(error.MsgError?.toString()!, '#email');
        break;
      case "Error4":
      case "Error5":
        this.MostrarMsj(error.MsgError?.toString()!, '#password');
        break;
      default:
        break;
    }
  }

  private MostrarMsj(msj: string, input: string): void {
    const dialogRef = this.dialogError.open(ErrorDialogComponent, {
      data: { titulo: 'FORMREGISTRO.TituloErrorDialog', mensaje: msj }
    })
      .afterClosed()
      .subscribe(result => {
        var elem = this.renderer.selectRootElement(input);
        elem.focus();
      });
  }

  get emailInvalid() {
    return this.RecuperarForm.get('email')?.invalid;
  }
  getMensajeErrorEmail() {
    if (this.RecuperarForm.get('email')?.errors) {
      if (this.RecuperarForm.get('email')?.hasError('required')) {
        return 'FORMREGISTRO.errorEmaildRequired';
      }
      if (this.RecuperarForm.get('email')?.errors?.['email']) {
        return 'FORMREGISTRO.errorEmail';
      }
    }
    return '';
  }
}
