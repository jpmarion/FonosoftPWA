import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from '../../dialog/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar-registro',
  templateUrl: './confirmar-registro.component.html',
  styleUrls: ['./confirmar-registro.component.scss']
})
export class ConfirmarRegistroComponent implements OnInit {
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private authServices: AuthService,
    private router: Router,
    private dialogError: MatDialog,
    private renderer: Renderer2) { }
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  onSubmit() {
    this.authServices.ConfirmarRegistro(this.id)
      .subscribe({
        next: (_) => {
          this.router.navigate([''])
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
      case "Error12":
      case "ErrorAut3":
      case "ErrorAut4":
      case "ErrorAut9":
      case "ErrorAut10":
        this.MostrarMsj(error.MsgError?.toString()!, '#usuario');
        break;
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
}
