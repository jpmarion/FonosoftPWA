import { AbstractControl } from "@angular/forms";
import { AAbmTipoDocumento } from "./aabm-tipo-documento";
import { TipodocumentoService } from "src/app/services/tipodocumento/tipodocumento.service";
import { Renderer2, inject } from "@angular/core";
import { RequestPutTipoDocumento } from "src/app/services/tipodocumento/request-put-tipo-documento";
import { MatDialog } from "@angular/material/dialog";
import { OkDialogComponent } from "src/app/pages/dialog/ok-dialog/ok-dialog.component";
import { ErrorDialogComponent } from "src/app/pages/dialog/error-dialog/error-dialog.component";
import { Error } from 'src/app/model/error';

export class ModificarTipoDocumento extends AAbmTipoDocumento {
    private _idTipoDocumento!: number;
    private _request = new RequestPutTipoDocumento();
    private tipoDocumentoServices = inject(TipodocumentoService);
    private dialogOk = inject(MatDialog);
    private dialogError = inject(MatDialog);
    private renderer = inject(Renderer2);

    constructor(FormGroup: AbstractControl, IdTipoDocumento: number) {
        super(FormGroup);
        this._idTipoDocumento = IdTipoDocumento;
    }

    override Ejecutar(): void {
        this._request.id = this._idTipoDocumento;
        this._request.descripcion =  this._formGroup.get('descripcionTipoDocumentoForm')?.value ?? '';
        this.tipoDocumentoServices.ModificarTipoDocumento(this._request)
        .subscribe({
            next:(resultado)=>{
                this.openOkDialog('FORMTIPODOCUMENTO.TituloOkDialogModificar', 'FORMTIPODOCUMENTO.MsjOkDialogModificar');
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
