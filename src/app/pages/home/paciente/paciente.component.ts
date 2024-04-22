import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/model/paciente';
import { PacienteService } from 'src/app/services/paciente/paciente.service';
import { AltaPacienteComponent } from './alta-paciente/alta-paciente.component';
import { VerPacienteComponent } from './ver-paciente/ver-paciente.component';
import { ModificarPacienteComponent } from './modificar-paciente/modificar-paciente.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface DialogData {
  idPaciente: number;
}

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {
  displayedColumns: string[] = ['position', 'apellido', 'nombre', 'tipodoc', 'documento', 'action'];
  dataSource = new MatTableDataSource<Paciente>;
  pacientes: Paciente[] = [];

  private dialogPaciente = inject(MatDialog);
  private pacienteService = inject(PacienteService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarPacientes(): void {
    this.pacienteService.BuscarTodosLosPacientes()
      .subscribe((res) => {
        this.pacientes = res;
        this.dataSource.data = res;
      });
  }

  abrirAltaPaciente(): void {
    const dialogRef = this.dialogPaciente.open(AltaPacienteComponent, {
      width: '100%',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.cargarPacientes();
      }
    });
  }

  abrirVerPaciente(id: number): void {
    const dialogRef = this.dialogPaciente.open(VerPacienteComponent, {
      width: '100%',
      data: {
        idPaciente: id
      },
      disableClose: true
    });
  }

  abrirModificarPaciente(id: number): void {
    const dialogRef = this.dialogPaciente.open(ModificarPacienteComponent, {
      width: '100%',
      data: {
        idPaciente: id
      }
    }).afterClosed().subscribe(result => {
      if (result != '') {
        this.dataSource.data = [];
        this.cargarPacientes();
      }
    });
  }
}
