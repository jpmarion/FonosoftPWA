import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../dialog/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Error } from 'src/app/model/error';
import { RequestCambiarContrasenia } from 'src/app/services/auth/request-cambiar-contrasenia';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OkDialogComponent } from '../../dialog/ok-dialog/ok-dialog.component';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialogComponent implements OnInit {
  hide = true;
  requestCambiarContrasenia = new RequestCambiarContrasenia();
  cambiarPass = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  loading = false;

  constructor(
    private dialogError: MatDialog,
    private dialogOk: MatDialog,
    public dialogRefConfig: MatDialogRef<ConfigDialogComponent>,
    private authServices: AuthService
  ) {
    this.dialogRefConfig.disableClose = true;
  }

  ngOnInit(): void { }

  cambiarContrasenia() {
    this.requestCambiarContrasenia.id = Number(localStorage.getItem('idUsuario')) ?? 0;
    this.requestCambiarContrasenia.password = this.cambiarPass.get("password")?.value!;
    this.authServices.CambiarContraseniaUsuairo(this.requestCambiarContrasenia)
      .subscribe({
        next: (resultado) => {
          const dialogOk = this.dialogOk.open(OkDialogComponent, {
            data: { titulo: 'FORMCONFIGURACION.TituloOkDialog', mensaje: 'FORMCONFIGURACION.MsjOkDialog' }
          }).afterClosed().subscribe((result => {
            this.dialogRefConfig.close();
          }))
        },
        error: (e) => {
          if (e instanceof Error) {
            this.MensajeError(e);
          } else {
            console.error('Un error a ocurrido', e.error.message);
          }
        }
      })
  }

  private MensajeError(error: Error) {
    switch (error.NroError) {
      case "ErrorAuth7":
        const dialogRef = this.dialogError.open(ErrorDialogComponent, {
          data: { titulo: 'FORMCONFIGURACION.TituloErrorDialog', mensaje: error.MsgError }
        })
        break;
      default:
        break;
    }

  }

  get passwordInvalid() {
    return this.cambiarPass.get('password')?.invalid;
  }

  getMensajeErrorPassword() {
    if (this.cambiarPass.get('password')?.errors) {
      if (this.cambiarPass.get('password')?.hasError('required')) {
        return 'FORMLOGIN.errorPasswordRequired';
      }
      if (this.cambiarPass.get('password')?.errors?.['minlength']) {
        return 'FORMLOGIN.errorPasswordMinLength';
      }
    }
    return '';
  }
}
