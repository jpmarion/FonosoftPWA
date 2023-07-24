import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tipodocumento } from 'src/app/model/tipodocumento';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';

export interface DialogData {
  idTipoDocumento: number;
}

@Component({
  selector: 'app-ver-tipodocumento',
  templateUrl: './ver-tipodocumento.component.html',
  styleUrls: ['./ver-tipodocumento.component.scss']
})
export class VerTipodocumentoComponent implements OnInit {
  verTipoDocumento = new FormGroup({
    descripcionVerTipoDocumento: new FormControl('')
  });
  tipoDocumento = new Tipodocumento();

  constructor(
    private dialogError: MatDialog,
    private tipoDocumentoServices: TipodocumentoService,
    public dialogRef: MatDialogRef<VerTipodocumentoComponent>,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.tipoDocumentoServices.BuscarTipoDocumento(this.data.idTipoDocumento)
      .subscribe({
        next: (result) => {
          this.tipoDocumento = result;
          this.verTipoDocumento.get('descripcionVerTipoDocumento')?.setValue(this.tipoDocumento.descripcion!);        

          // this.verTipoDocumento.setValue({
          //   descripcionVerTipoDocumento: this.tipoDocumento.Descripcion?
          // })
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
      case "ErrorAuth7":
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
      default:
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
    }
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
