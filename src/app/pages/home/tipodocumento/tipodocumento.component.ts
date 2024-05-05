import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Tipodocumento } from 'src/app/model/tipodocumento';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { VerTipoDocumentoComponent } from './ver-tipo-documento/ver-tipo-documento.component';
import { ModificarTipoDocumentoComponent } from './modificar-tipo-documento/modificar-tipo-documento.component';
import { CambiarEstadoTipoDocumentoComponent } from './cambiar-estado-tipo-documento/cambiar-estado-tipo-documento.component';
import { AltaTipoDocumentoComponent } from './alta-tipo-documento/alta-tipo-documento.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Usuario } from 'src/app/model/usuario.model';

export interface DialogData {
  idTipoDocumento: number;
}

@Component({
  selector: 'app-tipodocumento',
  templateUrl: './tipodocumento.component.html',
  styleUrls: ['./tipodocumento.component.scss'],
})
export class TipodocumentoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'descripcion', 'estado', 'action'];
  dataSource = new MatTableDataSource<Tipodocumento[]>;

  selection = new SelectionModel<Tipodocumento>(true, []);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private tipoDocumentoServices: TipodocumentoService,
    private authServices: AuthService,
    private dialogAltaTipoDocumento: MatDialog,
    private dialogVerTipoDocumento: MatDialog,
    private dialogModificarTipoDocumento: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
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
    const dialogRef = this.dialogAltaTipoDocumento.open(AltaTipoDocumentoComponent, {
      width: '30%',
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.cargarTiposDocumentos();
      }
    });
  }

  abrirVerTipoDocumento(idTipoDocumento: number): void {
    const dialogRef = this.dialogVerTipoDocumento.open(VerTipoDocumentoComponent, {
      width: '30%',
      data: {
        idTipoDocumento: idTipoDocumento
      }
    });
  }

  abrirModificarTipoDocumento(idTipoDocumento: number): void {
    const dialogRef = this.dialogModificarTipoDocumento.open(ModificarTipoDocumentoComponent, {
      width: '30%',
      data: {
        idTipoDocumento: idTipoDocumento
      }
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.cargarTiposDocumentos();
      }
    });
  }

  abrirCambiarEstadoTipoDocumento(idTipoDocumento: number): void {
    const dialogRef = this.dialogModificarTipoDocumento.open(CambiarEstadoTipoDocumentoComponent, {
      width: '30%',
      data: {
        idTipoDocumento: idTipoDocumento
      }
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.cargarTiposDocumentos();

      }
    });
  }

  cargarTiposDocumentos(): void {
    var usuario =  this.authServices.getCurrentUser();
    this.tipoDocumentoServices.BuscarTodosLosTipoDocumento(usuario.idUsuario!)
      .subscribe((res) => {
        this.dataSource.data = res;
      })
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
