import { AbstractControl } from "@angular/forms";
import { AAbmTipoDocumento } from "./aabm-tipo-documento";
import { RequestAddTipoDocumento } from "src/app/services/tipodocumento/request-add-tipo-documento";
import { TipodocumentoService } from "src/app/services/tipodocumento/tipodocumento.service";
import { Renderer2, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { OkDialogComponent } from "src/app/pages/dialog/ok-dialog/ok-dialog.component";
import { Error } from 'src/app/model/error';
import { ErrorDialogComponent } from "src/app/pages/dialog/error-dialog/error-dialog.component";

export class AltaTipoDocumento extends AAbmTipoDocumento {
    requestAddTipoDocumento = new RequestAddTipoDocumento();
    private tipoDocumentoServices = inject(TipodocumentoService);
    private dialogOk = inject(MatDialog);
    private dialogError = inject(MatDialog);
    private renderer = inject(Renderer2);

    constructor(FormGroup: AbstractControl) {
        super(FormGroup);
    }

    override Ejecutar(): void {
        this.requestAddTipoDocumento.descripcion = this._formGroup.get('descripcionTipoDocumentoForm')?.value ?? '';
        this.tipoDocumentoServices.AgregarTipoDocumento(this.requestAddTipoDocumento)
            .subscribe({
                next: (resultado) => {
                    this.openOkDialog('FORMTIPODOCUMENTO.TituloOkDialogAlta', 'FORMTIPODOCUMENTO.MsjOkDialogAlta');
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
    override EsDescripcionInvalid(): boolean {
        return this._formGroup.get('descripcionTipoDocumentoForm')?.invalid!;
    }
    override MensajeErrorDescripcion(): string {
        if (this._formGroup.get('descripcion')?.errors) {
            if (this._formGroup.get('descripcion')?.hasError('required')) {
                return 'FORMTIPODOCUMENTO.errorDescripcionRequired';
            }
            if (this._formGroup.get('descripcion')?.errors?.['maxLength']) {
                return 'FORMTIPODOCUMENTO.ErrorDescripcionMaxLength';
            }
        }
        return '';
    }

    openOkDialog(titulo: string, mensaje: string) {
        const dialogRef = this.dialogOk.open(OkDialogComponent, {
            data: { titulo: titulo, mensaje: mensaje }
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
            data: { titulo: 'FORMTIPODOCUMENTO.TituloErrorDialog', mensaje: msj }
        })
            .afterClosed()
            .subscribe(result => {
                var elem = this.renderer.selectRootElement(input);
                elem.focus();
            });
    }
}

