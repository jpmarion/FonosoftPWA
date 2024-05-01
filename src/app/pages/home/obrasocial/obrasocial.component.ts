import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { AltaObraSocialComponent } from './alta-obra-social/alta-obra-social.component';
import { ModificarObraSocialComponent } from './modificar-obra-social/modificar-obra-social.component';
import { VerObraSocialComponent } from './ver-obra-social/ver-obra-social.component';
import { CambiarEstadoObraSocialComponent } from './cambiar-estado-obra-social/cambiar-estado-obra-social.component';
import { IObraSocial } from 'src/app/services/obrasocial/iobra-social';
import { Usuario } from 'src/app/model/usuario.model';
import { AuthService } from 'src/app/services/auth/auth.service';

export interface DialogData {
  idObraSocial: number;
}

@Component({
  selector: 'app-obrasocial',
  templateUrl: './obrasocial.component.html',
  styleUrls: ['./obrasocial.component.scss']
})
export class ObrasocialComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'descripcion', 'estado', 'action'];
  dataSource = new MatTableDataSource<IObraSocial[]>;

  selection = new SelectionModel<IObraSocial>(true, []);

  private _obraSocialServices = inject(ObrasocialService);
  private _authServices = inject(AuthService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private _dialogAltaObraSocial = inject(MatDialog);
  private _dialogModificarObraSocial = inject(MatDialog);

  private _usuario!:Usuario;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.CargarObrasSociales();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator!;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  CargarObrasSociales() {
    this._usuario = this._authServices.getCurrentUser();
    this._obraSocialServices.BuscarObrasSociales(this._usuario.idUsuario!)
      .subscribe((res) => {
        this.dataSource.data = res;
      });
  }

  abrirAltaObraSocial(): void {
    const dialogRef = this._dialogAltaObraSocial.open(AltaObraSocialComponent, {
      width: '30%',
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.CargarObrasSociales();
      }
    });
  }

  abrirVerObraSocial(id: number): void {
    const dialogRef = this._dialogModificarObraSocial.open(VerObraSocialComponent, {
      width: '30%',
      data: {
        idObraSocial: id
      }
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.CargarObrasSociales();
      }
    });
  }

  abrirModificarObraSocial(id: number): void {
    const dialogRef = this._dialogModificarObraSocial.open(ModificarObraSocialComponent, {
      width: '30%',
      data: {
        idObraSocial: id
      }
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.CargarObrasSociales();
      }
    });
  }

  abrirCambiarEstadoObraSocial(id: number): void {
    const dialogRef = this._dialogModificarObraSocial.open(CambiarEstadoObraSocialComponent, {
      width: '30%',
      data: {
        idObraSocial: id
      }
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.CargarObrasSociales();
      }
    });
  }
}
