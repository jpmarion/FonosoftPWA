import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IMedico } from 'src/app/services/medico/imedico';
import { MedicoService } from 'src/app/services/medico/medico.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss']
})
export class MedicoComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<IMedico>;
  displayedColumns: string[] = ['id', 'descripcion', 'action'];

  private _liveAnnouncer = inject(LiveAnnouncer);
  private _authServices = inject(AuthService);
  private _medicoServices = inject(MedicoService);

  
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    this.CargarMedicos();
  }

  CargarMedicos() {
    var usuario = this._authServices.getCurrentUser();
    this._medicoServices.BuscarMedicos(usuario.idUsuario!)
      .subscribe((res) => {
        this.dataSource.data = res;
      });
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

  abrirAltaMedico() {

  }

  abrirVerMedico(id: number) {

  }

  abrirModificarMedico(id: number) {

  }
}
