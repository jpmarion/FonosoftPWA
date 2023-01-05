import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Error } from 'src/app/model/error';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestLogin } from 'src/app/services/auth/request-login.model';
import { ErrorDialogComponent } from '../../dialog/error-dialog/error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  error: any;
  errorLogin: boolean = false;
  requestLogin = new RequestLogin();

  login = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private authServices: AuthService,
    private router: Router,
    private dialogError: MatDialog
  ) { }

  ngOnInit(): void {
    this.errorLogin = false;
  }

  onSubmit() {
    this.requestLogin.nombreUsuario = this.login.get('usuario')?.value!;
    this.requestLogin.password = this.login.get('password')?.value!;

    this.authServices.onLogin(this.requestLogin)
      .subscribe({
        next: (resultado) => this.router.navigate(['home']),
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
      case 7:
        const dialogRef = this.dialogError.open(ErrorDialogComponent, {
          data: { titulo: 'Login', mensaje: error.MsgError }
        })
        break;
      default:
        break;
    }

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
