import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Tipodocumento } from 'src/app/model/tipodocumento';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { AbmTipodocumentoComponent, TipoABM } from './abm-tipodocumento/abm-tipodocumento.component';

@Component({
  selector: 'app-tipodocumento',
  templateUrl: './tipodocumento.component.html',
  styleUrls: ['./tipodocumento.component.scss'],
})
export class TipodocumentoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['position', 'tipodocumento', 'action'];
  dataSource = new MatTableDataSource<Tipodocumento[]>;

  selection = new SelectionModel<Tipodocumento>(true, []);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private tipoDocumentoServices: TipodocumentoService,
    private dialogAltaTipoDocumento: MatDialog,
    private dialogVerTipoDocumento: MatDialog,
    private dialogModificarTipoDocumento: MatDialog
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator!;
  }

  ngOnInit(): void {
    this.cargarTiposDocumentos();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirAltaTipoDocumento(): void {
    const dialogRef = this.dialogAltaTipoDocumento.open(AbmTipodocumentoComponent, {
      width: '30%',
      data: {
        tipoAbm: TipoABM.ALTA,
        idTipoDocumento: 0
      }
    }).afterClosed().subscribe(result => {
      this.dataSource.data = [];
      this.cargarTiposDocumentos();
    });
  }

  abrirVerTipoDocumento(idTipoDocumento: number): void {
    const dialogRef = this.dialogVerTipoDocumento.open(AbmTipodocumentoComponent, {
      width: '30%',
      data: {
        tipoAbm: TipoABM.VER,
        idTipoDocumento: idTipoDocumento
      }
    });
  }

  abrirModificarTipoDocumento(idTipoDocumento: number): void {
    const dialogRef = this.dialogModificarTipoDocumento.open(AbmTipodocumentoComponent, {
      width: '30%',
      data: {
        tipoAbm: TipoABM.MODIFICAR,
        idTipoDocumento: idTipoDocumento
      }
    }).afterClosed().subscribe(result => {
      this.dataSource.data = [];
      this.cargarTiposDocumentos();
    });
  }

  cargarTiposDocumentos(): void {
    this.tipoDocumentoServices.BuscarTodosLosTipoDocumento()
      .subscribe((res) => {
        this.dataSource.data = res;
      });
  }
}
