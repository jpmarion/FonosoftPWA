import { Component, Inject, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentoRow } from '../documento-row';
import { DataSourceDocumento } from '../data-source-documento';
import { IObraSocial } from 'src/app/services/obrasocial/iobra-social';
import { ITipoDocumento } from 'src/app/services/tipodocumento/itipo-documento';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../paciente.component';
import { PacienteService } from 'src/app/services/paciente/paciente.service';
import { IPaciente } from 'src/app/services/paciente/ipaciente';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { Error } from 'src/app/model/error';
import { ObrasocialRow } from '../obrasocial-row';
import { DataSourceObraSocial } from '../data-source-obra-social';
import { MatSort } from '@angular/material/sort';
import { TipoContactoRow } from '../tipo-contacto-row';
import { DataSourceTipoContacto } from '../data-source-tipo-contacto';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-ver-paciente',
  templateUrl: './ver-paciente.component.html',
  styleUrls: ['./ver-paciente.component.scss']
})
export class VerPacienteComponent implements OnInit {

  pacienteForm = new FormGroup({
    apellidoPacienteForm: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    nombrePacienteForm: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    emailPacienteForm: new FormControl('', [Validators.email]),
    celularPacienteForm: new FormControl(),
    obraSocialForm: new FormControl(),
    nroobrasocialform: new FormControl(),
    tipodocumentoForm: new FormControl(''),
    nrodocumentoForm: new FormControl('', [Validators.maxLength(100)])
  });

  Titulo: string = "";

  private pacienteServices = inject(PacienteService);

  private documentosTable: DocumentoRow[] = [];
  dtsDocumentos = new DataSourceDocumento(this.documentosTable);
  displayedColumnsDocumento: string[] = ['tipodocumento', 'nrodocumento'];

  private obraSocialTable: ObrasocialRow[] = [];
  displayedColumnsObraSocial: string[] = ['obraSocial', 'nroObraSocial'];
  dtsObraSocial = new DataSourceObraSocial(this.obraSocialTable);

  private contactoTable: TipoContactoRow[] = [];
  displayedColumnsContacto: string[] = ['tipoContacto', 'contacto'];
  dtsContactos = new DataSourceTipoContacto(this.contactoTable);

  obrasSociales: IObraSocial[] = [];
  tipodocumento?: ITipoDocumento;
  tiposDocumentos: ITipoDocumento[] = [];

  private idPaciente!: number;
  private paciente!: IPaciente;
  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.idPaciente = data.idPaciente;
  }

  ngOnInit(): void {
    this.Titulo = 'FORMPACIENTE.matDialogTitleVer';
    this.verPaciente();
  }

  verPaciente(): void {
    this.pacienteServices.BuscarPaciente(this.idPaciente)
      .subscribe({
        next: (result) => {
          this.paciente = result;
          this.pacienteForm.get('apellidoPacienteForm')?.setValue(this.paciente.apellido);
          this.pacienteForm.get('nombrePacienteForm')?.setValue(this.paciente.nombre);
          this.paciente.documentos.forEach(element => {
            let documento = new DocumentoRow();
            documento.DescripcionTipoDocumento = element.documento;
            documento.NroDocumento = element.nroDocumento;
            this.documentosTable = [...this.documentosTable, documento];
            this.dtsDocumentos.setData(this.documentosTable);
          });
          this.paciente.obraSociales.forEach(element => {
            let obraSocial = new ObrasocialRow();
            obraSocial.obraSocial = element.obraSocial;
            obraSocial.nroObraSocial = element.nroObraSocial;
            this.obraSocialTable = [...this.obraSocialTable, obraSocial];
            this.dtsObraSocial.setData(this.obraSocialTable);
          });
          this.paciente.contactos.forEach(element => {
            let contacto = new TipoContactoRow();
            contacto.tipoContacto = element.tipoContacto;
            contacto.contacto = element.descContacto;
            this.contactoTable = [...this.contactoTable, contacto];
            this.dtsContactos.setData(this.contactoTable);
          });
        },
        error: (e) => {
          if (e instanceof Error) {
            this.MensajeError(e);
          } else {
            console.error('Un error a ocurrido', e.error.message);
          }
        }
      })
  }

  private MensajeError(error: Error) {
    switch (error.NroError) {
      case "Error7":
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
      default:
        this.MostrarMsj(error.MsgError?.toString()!, '#descripcion');
        break;
    }
  }

  private MostrarMsj(msj: string, input: string): void {
    const dialogRef = this.dialogError.open(ErrorDialogComponent, {
      data: { titulo: 'FORMOBRASOCIAL.TituloErrorDialog', mensaje: msj }
    })
      .afterClosed()
      .subscribe(result => {
        var elem = this.renderer.selectRootElement(input);
        elem.focus();
      });
  }

}
