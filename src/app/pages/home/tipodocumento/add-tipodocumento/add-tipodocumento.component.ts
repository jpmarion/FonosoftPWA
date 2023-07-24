import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { RequestAddTipoDocumento } from 'src/app/services/tipodocumento/request-add-tipo-documento';

@Component({
  selector: 'app-add-tipodocumento',
  templateUrl: './add-tipodocumento.component.html',
  styleUrls: ['./add-tipodocumento.component.scss']
})
export class AddTipodocumentoComponent implements OnInit {
  addTipoDocumento = new FormGroup({
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(100)])
  });
  requestAddTipoDocumento = new RequestAddTipoDocumento();

  constructor(
    private dialogError: MatDialog,
    private dialogOk: MatDialog,
    public dialogRef: MatDialogRef<AddTipodocumentoComponent>,
    private tipoDocumentoServices: TipodocumentoService,
    private renderer: Renderer2) { }

  ngOnInit(): void { }

  agregarTipoDocumento() {
    this.requestAddTipoDocumento.descripcion = this.addTipoDocumento.get('descripcion')?.value!;
    this.tipoDocumentoServices.AgregarTipoDocumento(this.requestAddTipoDocumento)
    .subscribe({
      next:(resultado)=>{
        this.dialogRef.close();
        this.openOkDialog('FORMADDTIPODOCUMENTO.TituloOkDialog','FORMADDTIPODOCUMENTO.MsjOkDialog');
      },
      error:(e)=>{
        if (e instanceof Error) {
          this.MensajeError(e);
        } else {
          console.error('Un error a ocurrido', e.error.message);
        }
      }
    })
  }

  get descripcionInvalid() {
    return this.addTipoDocumento.get('descripcion')?.invalid;
  }
  getMensajeErrorDescripcion() {
    if (this.addTipoDocumento.get('descripcion')?.errors) {
      if (this.addTipoDocumento.get('descripcion')?.hasError('required')) {
        return 'FORMADDTIPODOCUMENTO.errorDescripcionRequired';
      }
      if (this.addTipoDocumento.get('descripcion')?.errors?.['maxLength']) {
        return 'FORMADDTIPODOCUMENTO.ErrorDescripcionMaxLength';
      }
    }
    return '';
  }

  private MensajeError(error: Error) {
    switch (error.NroError) {
      case "ErrorAuth7":
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
      default:
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
    }
  }

  openOkDialog(titulo: string, mensaje: string) {
    const dialogRef = this.dialogOk.open(OkDialogComponent, {
      data: { titulo: titulo, mensaje: mensaje }
    });
  }

  private MostrarMsj(msj: string, input: string): void {
    const dialogRef = this.dialogError.open(ErrorDialogComponent, {
      data: { titulo: 'FORMADDTIPODOCUMENTO.TituloErrorDialog', mensaje: msj }
    })
      .afterClosed()
      .subscribe(result => {
        var elem = this.renderer.selectRootElement(input);
        elem.focus();
      });
  }
}