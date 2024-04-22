import { DataSource } from "@angular/cdk/collections";
import { TipoContactoRow } from "./tipo-contacto-row";
import { Observable, ReplaySubject } from "rxjs";

export class DataSourceTipoContacto extends DataSource<TipoContactoRow> {
    private _dataStream = new ReplaySubject<TipoContactoRow[]>();

    constructor(initialData: TipoContactoRow[]) {
        super();
        this.setData(initialData);
    }

    connect(): Observable<TipoContactoRow[]> {
        return this._dataStream;
    }

    disconnect() { }

    setData(data: TipoContactoRow[]) {
        this._dataStream.next(data);
    }
}
