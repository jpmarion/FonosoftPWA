import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tipodocumento } from 'src/app/model/tipodocumento';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';

@Component({
  selector: 'app-tipodocumento',
  templateUrl: './tipodocumento.component.html',
  styleUrls: ['./tipodocumento.component.scss']
})
export class TipodocumentoComponent implements OnInit {
  displayedColumns: string[] = ['position', 'tipodocumento'];
  dataSource = new MatTableDataSource<Tipodocumento[]>;

  constructor(private tipoDocumentoServices: TipodocumentoService) { }

  ngOnInit(): void {
    this.tipoDocumentoServices.BuscarTodosLosTipoDocumento()
      .subscribe((res) => {
        this.dataSource.data = res;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
