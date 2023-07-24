import { AbstractControl } from "@angular/forms";
import { AAbmTipoDocumento } from "./aabm-tipo-documento";
import { TipodocumentoService } from "src/app/services/tipodocumento/tipodocumento.service";
import { Tipodocumento } from "src/app/model/tipodocumento";
import { inject } from "@angular/core";

export class VerTipoDocumento extends AAbmTipoDocumento {
    private _idTipoDocumento!: number;
    private tipoDocumento = new Tipodocumento();
    private tipoDocumentoServices = inject(TipodocumentoService);

    constructor(FormGroup: AbstractControl, IdTipoDocumento: number) {
        super(FormGroup);
        this._idTipoDocumento = IdTipoDocumento;
    }

    override Ejecutar(): void {
        this.tipoDocumentoServices.BuscarTipoDocumento(this._idTipoDocumento)
            .subscribe({
                next: (result) => {
                    this.tipoDocumento = result;
                    this._formGroup.get('descripcionTipoDocumentoForm')?.setValue(this.tipoDocumento.descripcion);
                }
            });
    }
    override EsDescripcionInvalid(): boolean {
        return false;
    }
    override MensajeErrorDescripcion(): string {
        return '';
    }
}
