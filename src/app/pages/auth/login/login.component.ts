import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Error } from 'src/app/model/error';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestLogin } from 'src/app/services/auth/request-login.model';
import { ErrorDialogComponent } from '../../dialog/error-dialog/error-dialog.component';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  private error: any;
  private errorLogin: boolean = false;
  private requestLogin = new RequestLogin();

  login = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private dialog: MatDialog,
    private authServices: AuthService,
    private router: Router,
    private dialogError: MatDialog,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.errorLogin = false;
  }

  onSubmit() {
    this.requestLogin.nombreUsuario = this.login.get('usuario')?.value!;
    this.requestLogin.password = this.login.get('password')?.value!;

    this.authServices.onLogin(this.requestLogin)
      .subscribe({
        next: (resultado) => {
          localStorage.setItem('idUsuario', resultado['id']);
          localStorage.setItem('token', resultado['token'])
          this.router.navigate(['home'])
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
      case "ErrorAuth1":
      case "ErrorAuth2":
      case "ErrorAuth3":
      case "ErrorAuth4":
      case "ErrorAuth10":
        this.MostrarMsj(error.MsgError?.toString()!, '#usuario');
        break;
      case "ErrorAuth5":
      case "ErrorAuth6":
      case "ErrorAuth7":
        this.MostrarMsj(error.MsgError?.toString()!, '#password');
        break;
      // case 7:
      //   this.MostrarMsj(error.MsgError?.toString()!, '');
      //   break;
      default:
        break;
    }
  }

  private MostrarMsj(msj: string, input: string): void {
    const dialogRef = this.dialogError.open(ErrorDialogComponent, {
      data: { titulo: 'FORMLOGIN.TituloErrorDialog', mensaje: msj }
    })
      .afterClosed()
      .subscribe(result => {
        var elem = this.renderer.selectRootElement(input);
        elem.focus();
      });
  }

  Registrarse() {
    const dialogRef = this.dialog.open(RegistroComponent);
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);
      });
  }

  get usuarioInvalid() {
    return this.login.get('usuario')?.invalid;
  }

  getMensajeErrorUsuario() {
    if (this.login.get('usuario')?.errors) {
      if (this.login.get('usuario')?.hasError('required')) {
        return 'FORMLOGIN.errorPasswordRequired';
      }
    }
    return '';
  }

  get passwordInvalid() {
    return this.login.get('password')?.invalid;
  }

  getMensajeErrorPassword() {
    if (this.login.get('password')?.errors) {
      if (this.login.get('password')?.hasError('required')) {
        return 'FORMLOGIN.errorPasswordRequired';
      }
      if (this.login.get('password')?.errors?.['minlength']) {
        return 'FORMLOGIN.errorPasswordMinLength';
      }
    }
    return '';
  }

}
