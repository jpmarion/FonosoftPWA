import { DataSource } from "@angular/cdk/collections";
import { Observable, ReplaySubject } from "rxjs";
import { DocumentoRow } from "./documento-row";

export class DataSourceDocumento extends DataSource<DocumentoRow> {
    private _dataStream = new ReplaySubject<DocumentoRow[]>();

    constructor(initialData: DocumentoRow[]) {
        super();
        this.setData(initialData);
    }

    connect(): Observable<DocumentoRow[]> {
        return this._dataStream;
    }

    disconnect() { }

    // Eliminar(documento: DocumentoRow): void {
    //     if (this.EstaCargado(documento)) {
    //         this._documentosRow = this._documentosRow.filter((value) => value.idTipoDocumento! = documento.idTipoDocumento);
    //     }
    //     this.setData(this._documentosRow);
    // }

    setData(data: DocumentoRow[]) {
        this._dataStream.next(data);
    }
}
