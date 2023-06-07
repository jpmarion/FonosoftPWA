import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Error } from 'src/app/model/error';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ErrorDialogComponent } from '../../dialog/error-dialog/error-dialog.component';
import { OkDialogComponent } from '../../dialog/ok-dialog/ok-dialog.component';
import { RequestRegistro } from 'src/app/services/paciente/request-registro';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  hide = true;
  estadoBoton = false;
  errorRegistro: boolean = false;
  rqtRegistro = new RequestRegistro();
  registroForm = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private dialogError: MatDialog,
    private dialogOk: MatDialog,
    public dialogRef: MatDialogRef<RegistroComponent>,
    private authService: AuthService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.errorRegistro = false;
  }

  registro() {
    this.estadoBoton = true;
    this.rqtRegistro.usuario = this.registroForm.get('usuario')?.value!;
    this.rqtRegistro.email = this.registroForm.get('email')?.value!;
    this.rqtRegistro.password = this.registroForm.get('password')?.value!;

    this.authService.Registrar(this.rqtRegistro)
      .subscribe({
        next: (resultado) => {
          this.openOkDialog('FORMREGISTRO.TituloOkDialog', 'FORMREGISTRO.MsjOkDialog');
        },
        error: (e) => {
          if (e instanceof Error) {
            this.MensajeError(e);
          } else {
            console.error('Un error a ocurrido', e.error.message);
          }
        }
      });
    this.estadoBoton = false;
  }

  private MensajeError(error: Error) {
    switch (error.NroError) {
      case 2:
        this.MostrarMsj(error.MsgError?.toString()!, '#email');
        break;
      case 5:
      case 6:
        this.MostrarMsj(error.MsgError?.toString()!, '#password');
        break;
      case 7:
        this.MostrarMsj(error.MsgError?.toString()!, '');
        break;
      case 8:
        this.MostrarMsj(error.MsgError?.toString()!, 'usuario');
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

  get passwordInvalid() {
    return this.registroForm.get('password')?.invalid;
  }
  getMensajeErrorPassword() {
    if (this.registroForm.get('password')?.errors) {
      if (this.registroForm.get('password')?.hasError('required')) {
        return 'FORMREGISTRO.errorPasswordRequired';
      }
      if (this.registroForm.get('password')?.errors?.['minlength']) {
        return 'FORMREGISTRO.errorPasswordMinLength';
      }
    }
    return '';
  }

  get emailInvalid() {
    return this.registroForm.get('email')?.invalid;
  }
  getMensajeErrorEmail() {
    if (this.registroForm.get('email')?.errors) {
      if (this.registroForm.get('email')?.hasError('required')) {
        return 'FORMREGISTRO.errorEmaildRequired';
      }
      if (this.registroForm.get('email')?.errors?.['email']) {
        return 'FORMREGISTRO.errorEmail';
      }
    }
    return '';
  }

  get usuarioInvalid() {
    return this.registroForm.get('usuario')?.invalid;
  }

  getMensajeErrorUsuario() {
    if (this.registroForm.get('usuario')?.errors) {
      if (this.registroForm.get('usuario')?.hasError('required')) {
        return 'FORMLOGIN.errorPasswordRequired';
      }
    }
    return '';
  }


  openOkDialog(titulo: string, mensaje: string) {
    const dialogRef = this.dialogOk.open(OkDialogComponent, {
      data: { titulo: titulo, mensaje: mensaje }
    });
  }


}
