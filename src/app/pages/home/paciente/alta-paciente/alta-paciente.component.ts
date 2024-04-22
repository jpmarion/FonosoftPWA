import { Component, OnInit, Renderer2, ViewChild, inject, numberAttribute } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { ITipoDocumento } from 'src/app/services/tipodocumento/itipo-documento';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { DocumentoRow } from '../documento-row';
import { IObraSocial } from 'src/app/services/obrasocial/iobra-social';
import { DataSourceDocumento } from '../data-source-documento';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { ObrasocialRow } from '../obrasocial-row';
import { DataSourceObraSocial } from '../data-source-obra-social';
import { ITipoContacto } from 'src/app/services/tipocontacto/i-tipo-contacto';
import { TipocontactoService } from 'src/app/services/tipocontacto/tipocontacto.service';
import { TipoContactoRow } from '../tipo-contacto-row';
import { DataSourceTipoContacto } from '../data-source-tipo-contacto';
import { AddPaciente, AddPacienteContacto, AddPacienteDocumento, AddPacienteObraSocial } from 'src/app/services/paciente/AddPaciente';
import { PacienteService } from 'src/app/services/paciente/paciente.service';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { Error } from 'src/app/model/error';

@Component({
  selector: 'app-alta-paciente',
  templateUrl: './alta-paciente.component.html',
  styleUrls: ['./alta-paciente.component.scss'],
})
export class AltaPacienteComponent implements OnInit {

  pacienteForm = new FormGroup({
    apellidoPacienteForm: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    nombrePacienteForm: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    emailPacienteForm: new FormControl('', [Validators.email]),
    celularPacienteForm: new FormControl(),
    obraSocialForm: new FormControl(),
    nroobrasocialform: new FormControl(),
    tipodocumentoForm: new FormControl(''),
    nrodocumentoForm: new FormControl('', [Validators.maxLength(100)]),
    tipoContactoForm: new FormControl(),
    contactoform: new FormControl('', [Validators.maxLength(300)])
  });

  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);

  EsApellidoInvalido?: boolean = this.pacienteForm.get('apellidoPacienteForm')?.invalid;
  EsNombreInvalido?: boolean = this.pacienteForm.get('nombrePacienteForm')?.invalid;

  tipodocumento?: ITipoDocumento;
  tiposDocumentos: ITipoDocumento[] = [];
  private documentosTable: DocumentoRow[] = [];
  dtsDocumentos = new DataSourceDocumento(this.documentosTable);
  displayedColumnsDocumento: string[] = ['tipodocumento', 'nrodocumento'];
  clickedRows = new Set<ITipoDocumento>();
  private tipoDocumentoService = inject(TipodocumentoService);
  public esAgregarBotonDocumento = true;

  obraSocial?: IObraSocial;
  obrasSociales: IObraSocial[] = [];
  private obrasSocialesTable: ObrasocialRow[] = [];
  dtsObrasSociales = new DataSourceObraSocial(this.obrasSocialesTable);
  displayedColumnsObraSocial: string[] = ['obraSocial', 'nroObraSocial'];
  clickedRowsObraSocial = new Set<IObraSocial>();
  private obraSocialServices = inject(ObrasocialService);
  public esAgregarBotonObraSocial = true;

  tipoContacto?: ITipoContacto;
  tiposContactos: ITipoContacto[] = [];
  private TiposContactosTable: TipoContactoRow[] = [];
  dtsTipoContactos = new DataSourceTipoContacto(this.TiposContactosTable);
  displayedColumnsTipoContacto: string[] = ['tipoContacto', 'contacto'];
  clickedRowsTipoContacto = new Set<ITipoContacto>();
  private tipoContactoServices = inject(TipocontactoService);
  public esAgregarBotonTipoContacto = true;

  private pacienteService = inject(PacienteService);

  private dialogOk = inject(MatDialog);

  constructor(public dialogRef: MatDialogRef<AltaPacienteComponent>) { }

  ngOnInit(): void {
    this.CargarTiposDocumentos();
    this.CargarObrasSociales();
    this.CargarTiposContactos();
  }

  private MostrarMsj(msj: string, input: string): void {
    const dialogRef = this.dialogError.open(ErrorDialogComponent, {
      data: { titulo: 'FORMPACIENTE.TituloErrorDialog', mensaje: msj }
    })
      .afterClosed()
      .subscribe(result => {
        var elem = this.renderer.selectRootElement(input);
        elem.focus();
      });
  }

  MensajeErrorApellido() {
    if (this.pacienteForm.get('apellidoPacienteForm')?.errors) {
      if (this.pacienteForm.get('apellidoPacienteForm')?.hasError('required')) {
        return 'FORMPACIENTE.errorRequired';
      }
      if (this.pacienteForm.get('apellidoPacienteForm')?.hasError('maxLength')) {
        return 'FORMPACIENTE.ErrorMaxLength';
      }
    }
    return '';
  }

  MensajeErrorNombre() {
    if (this.pacienteForm.get('nombrePacienteForm')?.errors) {
      if (this.pacienteForm.get('nombrePacienteForm')?.hasError('required')) {
        return 'FORMPACIENTE.errorRequired';
      }
      if (this.pacienteForm.get('nombrePacienteForm')?.hasError('maxLength')) {
        return 'FORMPACIENTE.ErrorMaxLength';
      }
    }
    return '';
  }

  CargarTiposDocumentos(): void {
    this.tipoDocumentoService.BuscarTiposDocumentosHabilitados()
      .subscribe((res) => {
        this.tiposDocumentos = res;
      });
  }
  AgregarDocumento(): void {
    let tipoDocumentoSeleccionado = new DocumentoRow();
    tipoDocumentoSeleccionado!.idTipoDocumento = Number(this.pacienteForm.get('tipodocumentoForm')?.value);

    const descripcionDocumento = this.tiposDocumentos.find(valor => valor.idTipoDocumento == tipoDocumentoSeleccionado?.idTipoDocumento);

    tipoDocumentoSeleccionado!.DescripcionTipoDocumento = descripcionDocumento?.nombreTipoDocumento!;
    tipoDocumentoSeleccionado!.NroDocumento = this.pacienteForm.get('nrodocumentoForm')?.value!;

    if (tipoDocumentoSeleccionado?.idTipoDocumento == 0) {
      this.MostrarMsj('FORMPACIENTE.TipoDocumentoError', '#nrodocumentoForm');
      return;
    }
    if (tipoDocumentoSeleccionado?.NroDocumento == '') {
      this.MostrarMsj('FORMPACIENTE.NroDocumentoError', '#nrodocumentoForm');
      return;
    }

    if (!this.EstaCargadoDocumento(tipoDocumentoSeleccionado.idTipoDocumento)) {
      this.documentosTable = [...this.documentosTable!, tipoDocumentoSeleccionado!];
      this.dtsDocumentos.setData(this.documentosTable);
    } else {
      this.MostrarMsj('FORMPACIENTE.TipoDocumentoRepetidoError', '#nrodocumentoForm');
      return;
    }

    this.pacienteForm.get('tipodocumentoForm')?.setValue('1');
    this.pacienteForm.get('nrodocumentoForm')?.setValue('');
  }
  private EstaCargadoDocumento(idTipoDocumento: number): boolean {
    const documento = this.documentosTable.find(value => value.idTipoDocumento == idTipoDocumento);
    if (documento != null) {
      return true;
    }
    return false;
  }
  ModificarDocumento(): void {
    this.AgregarDocumento();
    this.esAgregarBotonDocumento = true;
  }
  EliminarDocumento(): void {
    this.pacienteForm.get('tipodocumentoForm')?.setValue('1');
    this.pacienteForm.get('nrodocumentoForm')?.setValue('');
    this.esAgregarBotonDocumento = true;
  }
  onRowClickDocumento(row: any) {
    let tipodocumento = row;
    this.documentosTable = this.documentosTable.filter(documento => { documento.idTipoDocumento != tipodocumento?.idTipoDocumento });
    this.dtsDocumentos.setData(this.documentosTable);
    this.pacienteForm.get('tipodocumentoForm')?.setValue(tipodocumento?.idTipoDocumento!);
    this.pacienteForm.get('nrodocumentoForm')?.setValue(tipodocumento?.NroDocumento!);
    this.esAgregarBotonDocumento = false;
  }

  CargarObrasSociales(): void {
    this.obraSocialServices.BuscarObrasSocialesHabilitadas()
      .subscribe((res) => {
        this.obrasSociales = res;
      });
  }
  AgregarObraSocial(): void {
    let obraSocialAgregar = new ObrasocialRow();
    obraSocialAgregar.idObraSocial = Number(this.pacienteForm.get('obraSocialForm')?.value);

    const descripcionObraSocial = this.obrasSociales.find(value => value.id == obraSocialAgregar.idObraSocial);
    obraSocialAgregar.obraSocial = descripcionObraSocial?.nombre!;

    obraSocialAgregar.nroObraSocial = this.pacienteForm.get('nroobrasocialform')?.value;

    if (obraSocialAgregar.idObraSocial == 0) {
      this.MostrarMsj('FORMPACIENTE.NroObraSocialError', '#obraSocialForm');
      return;
    }

    if (obraSocialAgregar.nroObraSocial == '') {
      this.MostrarMsj('FORMPACIENTE.NroObraSocialError', '#nroobrasocialform');
      return;
    }

    if (!this.EstaCargadaObraSocial(obraSocialAgregar.idObraSocial)) {
      this.obrasSocialesTable = [...this.obrasSocialesTable, obraSocialAgregar];
      this.dtsObrasSociales.setData(this.obrasSocialesTable);
    } else {
      this.MostrarMsj('FORMPACIENTE.ObraSocialRepetidaError', '#obraSocialForm');
      return;
    }

    this.pacienteForm.get('obraSocialForm')?.setValue('1');
    this.pacienteForm.get('nroobrasocialform')?.setValue('');
  }
  private EstaCargadaObraSocial(idObraSocial: number): boolean {
    const obraSocial = this.obrasSocialesTable.find(valor => valor.idObraSocial == idObraSocial);
    if (obraSocial != null) {
      return true;
    }
    return false;
  }
  ModificarObraSocial(): void {
    this.AgregarObraSocial();
    this.esAgregarBotonObraSocial = true;
  }
  EliminarObraSocial(): void {
    this.pacienteForm.get('obraSocialForm')?.setValue('1');
    this.pacienteForm.get('nroobrasocialform')?.setValue('');
    this.esAgregarBotonObraSocial = true;
  }
  onRowClickObraSocial(row: any) {
    const obraSocialRow = row;
    this.obrasSocialesTable = this.obrasSocialesTable.filter(obraSocial => obraSocial.idObraSocial != obraSocial.idObraSocial);
    this.dtsObrasSociales.setData(this.obrasSocialesTable);
    this.pacienteForm.get('obraSocialForm')?.setValue(obraSocialRow.idObraSocial);
    this.pacienteForm.get('nroobrasocialform')?.setValue(obraSocialRow.nroObraSocial);
    this.esAgregarBotonObraSocial = false;
  }

  CargarTiposContactos(): void {
    this.tipoContactoServices.BuscarTiposContactos()
      .subscribe((res) => {
        this.tiposContactos = res;
      });
  }
  AgregarContacto(): void {
    let tipoContactoAgregar = new TipoContactoRow();
    tipoContactoAgregar.idTipoContacto = Number(this.pacienteForm.get('tipoContactoForm')?.value);

    const descripcionTipoContacto = this.tiposContactos.find(value => value.idTipoContacto == tipoContactoAgregar.idTipoContacto);
    tipoContactoAgregar.tipoContacto = descripcionTipoContacto?.tipoContacto!;

    tipoContactoAgregar.contacto = this.pacienteForm.get('contactoform')?.value!;

    if (tipoContactoAgregar.idTipoContacto == 0) {
      this.MostrarMsj("FORMPACIENTE.TipoContactoError", "#tipoContactoForm");
      return;
    }

    if (tipoContactoAgregar.contacto == '') {
      this.MostrarMsj("FORMPACIENTE.ContactoError", "#contactoform");
      return;
    }

    this.TiposContactosTable = [...this.TiposContactosTable, tipoContactoAgregar];
    this.dtsTipoContactos.setData(this.TiposContactosTable);

    this.pacienteForm.get('tipoContactoForm')?.setValue('1');
    this.pacienteForm.get('contactoform')?.setValue('');
  }
  ModificarContacto(): void {
    this.AgregarContacto();
    this.esAgregarBotonTipoContacto = true;
  }
  EliminarContacto(): void {
    this.pacienteForm.get('tipoContactoForm')?.setValue('1');
    this.pacienteForm.get('contactoform')?.setValue('');
    this.esAgregarBotonObraSocial = true;
  }
  onRowClicContacto(row: any) {
    const contactoRow = row;
    this.TiposContactosTable = this.TiposContactosTable.filter(contacto => contacto.idTipoContacto != contactoRow.idTipoContacto);
    this.dtsTipoContactos.setData(this.TiposContactosTable);
    this.pacienteForm.get('tipoContactoForm')?.setValue(contactoRow.idTipoContacto);
    this.pacienteForm.get('contactoform')?.setValue(contactoRow.contacto);
    this.esAgregarBotonTipoContacto = false;
  }

  Ejecutar(): void {
    let paciente = new AddPaciente();
    paciente.apellido = this.pacienteForm.get('apellidoPacienteForm')?.value!;
    paciente.nonbre = this.pacienteForm.get('nombrePacienteForm')?.value!;

    this.documentosTable.forEach(element => {
      let documento = new AddPacienteDocumento();
      documento.idTipoDocumento = element.idTipoDocumento;
      documento.nroDocumento = element.NroDocumento;
      paciente.documentos?.push(documento);
    });

    this.obrasSocialesTable.forEach(element => {
      let obraSocial = new AddPacienteObraSocial();
      obraSocial.idObraSocial = element.idObraSocial;
      obraSocial.nroObraSocial = element.nroObraSocial;
      paciente.obrasSociales?.push(obraSocial);
    });

    this.TiposContactosTable.forEach(element => {
      let contacto = new AddPacienteContacto();
      contacto.idTipoContacto = element.idTipoContacto;
      contacto.DescContacto = element.contacto;
      paciente.contactos?.push(contacto);
    });

    this.pacienteService.AgregarPaciente(paciente)
      .subscribe({
        next: (resultado) => {
          this.openOkDialog('FORMPACIENTE.TituloOkDialogAlta', 'FORMPACIENTE.MsjOkDialogAlta');
          this.dialogRef.close();
        },
        error: (e) => {
          if (e instanceof Error) {
            this.MensajeError(e);
          } else {
            console.error('Un error a ocurrido', e.error.message);
          }
        }
      });
  }

  openOkDialog(titulo: string, mensaje: string) {
    const dialogRef = this.dialogOk.open(OkDialogComponent, {
      data: { titulo: titulo, mensaje: mensaje }
    });
  }
  private MensajeError(error: Error) {
    switch (error.NroError) {
      case "ErrorEntidad0":
        this.MostrarMsj(error.MsgError?.toString()!, '#apellidoPacienteForm');
        break;
      case "ErrorEntidad1":
        this.MostrarMsj(error.MsgError?.toString()!, '#nombrePacienteForm');
        break;
      case "ErrorEntidad3":
        this.MostrarMsj(error.MsgError?.toString()!, '#obraSocialForm');
        break;
      case "ErrorEntidad4":
        this.MostrarMsj(error.MsgError?.toString()!, '#nroobrasocialform');
        break;
      case "ErrorEntidad5":
        this.MostrarMsj(error.MsgError?.toString()!, '#tipoContactoForm');
        break;
      case "ErrorEntidad6":
        this.MostrarMsj(error.MsgError?.toString()!, '#contactoform');
        break;
      case "ErrorEntidad8":
        this.MostrarMsj(error.MsgError?.toString()!, '#tipodocumentoForm');
        break;
      case "ErrorEntidad9":
        this.MostrarMsj(error.MsgError?.toString()!, '#nrodocumentoForm');
        break;
      default:
        this.MostrarMsj(error.MsgError?.toString()!, '#apellidoPacienteForm');
        break;
    }
  }
}
