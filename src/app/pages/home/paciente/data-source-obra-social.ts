import { DataSource } from "@angular/cdk/collections";
import { ObrasocialRow } from "./obrasocial-row";
import { Observable, ReplaySubject } from "rxjs";

export class DataSourceObraSocial extends DataSource<ObrasocialRow> {
    private _dataStream = new ReplaySubject<ObrasocialRow[]>();

    constructor(initialData: ObrasocialRow[]) {
        super();
        this.setData(initialData);
    }

    connect(): Observable<ObrasocialRow[]> {
        return this._dataStream;
    }

    disconnect() { }

    setData(data: ObrasocialRow[]) {
        this._dataStream.next(data);
    }
}
