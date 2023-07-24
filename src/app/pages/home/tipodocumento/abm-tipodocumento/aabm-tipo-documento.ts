import { AbstractControl, FormGroup } from "@angular/forms";
import { IAbmTipoDocumento } from "./iabm-tipo-documento";

export abstract class AAbmTipoDocumento implements IAbmTipoDocumento {
    public _formGroup!: AbstractControl;

    constructor(FormGroup: AbstractControl) {
        this._formGroup = FormGroup;
    }

    abstract Ejecutar(): void;
    abstract EsDescripcionInvalid(): boolean;
    abstract MensajeErrorDescripcion(): string;
}
