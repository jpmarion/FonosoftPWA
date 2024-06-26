import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Error } from 'src/app/model/error';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ErrorDialogComponent } from '../../dialog/error-dialog/error-dialog.component';
import { OkDialogComponent } from '../../dialog/ok-dialog/ok-dialog.component';
import { RequestRegistro } from 'src/app/services/paciente/request-registro';
import { environment } from 'src/environments/environment';
import { matchValidator } from './confirmar-email';

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
    confirmarEmail: new FormControl('', [Validators.required, Validators.email, matchValidator('email')]),
    passwordreg: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  private confirmarUrl = environment.apiUrlFonosoft + 'confirmarregistro';

  constructor(
    private dialogError: MatDialog,
    private dialogOk: MatDialog,
    public dialogRefRegistro: MatDialogRef<RegistroComponent>,
    private authService: AuthService,
    private renderer: Renderer2
  ) {
    this.dialogRefRegistro.disableClose = true;
  }

  ngOnInit(): void {
    this.errorRegistro = false;
  }

  registro() {
    this.estadoBoton = true;
    this.rqtRegistro.nombreUsuario = this.registroForm.get('usuario')?.value!;
    this.rqtRegistro.email = this.registroForm.get('email')?.value!;
    this.rqtRegistro.password = this.registroForm.get('passwordreg')?.value!;

    this.authService.Registrar(this.rqtRegistro)
      .subscribe({
        next: (resultado) => {
          const dialogRef = this.dialogOk.open(OkDialogComponent, {
            data: { titulo: 'FORMREGISTRO.TituloOkDialog', mensaje: 'FORMREGISTRO.MsjOkDialog' }
          }).afterClosed().subscribe((result) => {
            this.dialogRefRegistro.close();

          });
          // this.openOkDialog('FORMREGISTRO.TituloOkDialog', 'FORMREGISTRO.MsjOkDialog');
          // this.dialogRefRegistro.close();
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

  get confirmarEmailInvalid() {
    return this.registroForm.get('confirmarEmail')?.invalid;
  }
  getMensajeErrorConfirmarEmail() {
    if (this.registroForm.get('confirmarEmail')?.errors) {
      if (this.registroForm.get('confirmarEmail')?.hasError('required')) {
        return 'FORMREGISTRO.errorEmaildRequired';
      }
      if (this.registroForm.get('confirmarEmail')?.errors?.['email']) {
        return 'FORMREGISTRO.errorEmail';
      }
      if (this.registroForm.get('confirmarEmail')?.errors?.['matching']) {
        return 'FORMREGISTRO.errorEmailMatching';
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

  getHtmlMail(urlConfirmacion: string) {

    return '<!DOCTYPE html>' +
      '<html>' +
      '' +
      '<head>' +
      '    <title></title>' +
      '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
      '    <meta name="viewport" content="width=device-width, initial-scale=1">' +
      '    <meta http-equiv="X-UA-Compatible" content="IE=edge" />' +
      '    <style type="text/css">' +
      '        @media screen {' +
      '            @font-face {' +
      '                font-family: \'Lato\';' +
      '                font-style: normal;' +
      '                font-weight: 400;' +
      '                src: local(\'Lato Regular\'), local(\'Lato-Regular\'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format(\'woff\');' +
      '            }' +
      '' +
      '            @font-face {' +
      '                font-family: \'Lato\';' +
      '                font-style: normal;' +
      '                font-weight: 700;' +
      '                src: local(\'Lato Bold\'), local(\'Lato-Bold\'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format(\'woff\');' +
      '            }' +
      '' +
      '            @font-face {' +
      '                font-family: \'Lato\';' +
      '                font-style: italic;' +
      '                font-weight: 400;' +
      '                src: local(\'Lato Italic\'), local(\'Lato-Italic\'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format(\'woff\');' +
      '            }' +
      '' +
      '            @font-face {' +
      '                font-family: \'Lato\';' +
      '                font-style: italic;' +
      '                font-weight: 700;' +
      '                src: local(\'Lato Bold Italic\'), local(\'Lato-BoldItalic\'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format(\'woff\');' +
      '            }' +
      '        }' +
      '' +
      '        /* CLIENT-SPECIFIC STYLES */' +
      '        body,' +
      '        table,' +
      '        td,' +
      '        a {' +
      '            -webkit-text-size-adjust: 100%;' +
      '            -ms-text-size-adjust: 100%;' +
      '        }' +
      '' +
      '        table,' +
      '        td {' +
      '            mso-table-lspace: 0pt;' +
      '            mso-table-rspace: 0pt;' +
      '        }' +
      '' +
      '        img {' +
      '            -ms-interpolation-mode: bicubic;' +
      '        }' +
      '' +
      '        /* RESET STYLES */' +
      '        img {' +
      '            border: 0;' +
      '            height: auto;' +
      '            line-height: 100%;' +
      '            outline: none;' +
      '            text-decoration: none;' +
      '        }' +
      '' +
      '        table {' +
      '            border-collapse: collapse !important;' +
      '        }' +
      '' +
      '        body {' +
      '            height: 100% !important;' +
      '            margin: 0 !important;' +
      '            padding: 0 !important;' +
      '            width: 100% !important;' +
      '        }' +
      '' +
      '        /* iOS BLUE LINKS */' +
      '        a[x-apple-data-detectors] {' +
      '            color: inherit !important;' +
      '            text-decoration: none !important;' +
      '            font-size: inherit !important;' +
      '            font-family: inherit !important;' +
      '            font-weight: inherit !important;' +
      '            line-height: inherit !important;' +
      '        }' +
      '' +
      '        /* MOBILE STYLES */' +
      '        @media screen and (max-width:600px) {' +
      '            h1 {' +
      '                font-size: 32px !important;' +
      '                line-height: 32px !important;' +
      '            }' +
      '        }' +
      '' +
      '        /* ANDROID CENTER FIX */' +
      '        div[style*="margin: 16px 0;"] {' +
      '            margin: 0 !important;' +
      '        }' +
      '    </style>' +
      '</head>' +
      '' +
      '<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">' +
      '    <!-- HIDDEN PREHEADER TEXT -->' +
      '    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account.' +
      '    </div>' +
      '    <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
      '        <!-- LOGO -->' +
      '        <tr>' +
      '            <td bgcolor="#FFA73B" align="center">' +
      '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">' +
      '                    <tr>' +
      '                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>' +
      '                    </tr>' +
      '                </table>' +
      '            </td>' +
      '        </tr>' +
      '        <tr>' +
      '            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">' +
      '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">' +
      '                    <tr>' +
      '                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">' +
      '                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Bienvenido!</h1>                       </td>' +
      '                    </tr>' +
      '                </table>' +
      '            </td>' +
      '        </tr>' +
      '        <tr>' +
      '            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">' +
      '                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">' +
      '                    <tr>' +
      '                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">' +
      '                            <p style="margin: 0;">Por favor confirme el registro para poder usar Fonosoft</p>' +
      '                        </td>' +
      '                    </tr>' +
      '                    <tr>' +
      '                        <td bgcolor="#ffffff" align="left">' +
      '                            <table width="100%" border="0" cellspacing="0" cellpadding="0">' +
      '                                <tr>' +
      '                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">' +
      '                                        <table border="0" cellspacing="0" cellpadding="0">' +
      '                                            <tr>' +
      '                                                <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="' + urlConfirmacion + '" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirmar Cuenta</a></td>' +
      '                                            </tr>' +
      '                                        </table>' +
      '                                    </td>' +
      '                                </tr>' +
      '                            </table>' +
      '                        </td>' +
      '                    </tr> <!-- COPY -->' +
      '            </table>' +
      '</body>' +
      '' +
      '</html>';



  }
}
