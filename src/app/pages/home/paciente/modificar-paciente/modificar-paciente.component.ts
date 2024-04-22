import { Component, Inject, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/pages/dialog/error-dialog/error-dialog.component';
import { DocumentoRow } from '../documento-row';
import { ITipoDocumento } from 'src/app/services/tipodocumento/itipo-documento';
import { DataSourceDocumento } from '../data-source-documento';
import { ObrasocialService } from 'src/app/services/obrasocial/obrasocial.service';
import { TipodocumentoService } from 'src/app/services/tipodocumento/tipodocumento.service';
import { IObraSocial } from 'src/app/services/obrasocial/iobra-social';
import { DialogData } from '../paciente.component';
import { PacienteService } from 'src/app/services/paciente/paciente.service';
import { IPaciente } from 'src/app/services/paciente/ipaciente';
import { Error } from 'src/app/model/error';
import { DataSourceObraSocial } from '../data-source-obra-social';
import { ObrasocialRow } from '../obrasocial-row';
import { ITipoContacto } from 'src/app/services/tipocontacto/i-tipo-contacto';
import { TipoContactoRow } from '../tipo-contacto-row';
import { DataSourceTipoContacto } from '../data-source-tipo-contacto';
import { TipocontactoService } from 'src/app/services/tipocontacto/tipocontacto.service';
import { ModPaciente } from 'src/app/services/paciente/mod-paciente';
import { OkDialogComponent } from 'src/app/pages/dialog/ok-dialog/ok-dialog.component';
import { ModDocumento } from 'src/app/services/paciente/mod-documento';

@Component({
  selector: 'app-modificar-paciente',
  templateUrl: './modificar-paciente.component.html',
  styleUrls: ['./modificar-paciente.component.scss']
})
export class ModificarPacienteComponent implements OnInit {

  pacienteForm = new FormGroup({
    apellidoPacienteForm: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    nombrePacienteForm: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    emailPacienteForm: new FormControl('', [Validators.email]),
    celularPacienteForm: new FormControl(),
    obraSocialForm: new FormControl(),
    nroobrasocialform: new FormControl(),
    tipodocumentoForm: new FormControl(),
    nrodocumentoForm: new FormControl('', [Validators.maxLength(100)]),
    tipoContactoForm: new FormControl(),
    contactoform: new FormControl('', [Validators.maxLength(300)])
  });

  EsApellidoInvalido?: boolean = this.pacienteForm.get('apellidoPacienteForm')?.invalid;
  EsNombreInvalido?: boolean = this.pacienteForm.get('nombrePacienteForm')?.invalid;

  private pacienteServices = inject(PacienteService);
  private idPaciente!: number;
  private paciente!: IPaciente;

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

  private dialogError = inject(MatDialog);
  private renderer = inject(Renderer2);
  private dialogOk = inject(MatDialog);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ModificarPacienteComponent>) {
    this.idPaciente = data.idPaciente;
  }

  ngOnInit(): void {
    this.CargarTiposDocumentos();
    this.CargarObraSociales();
    this.CargarTiposContactos();
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
            documento.idTipoDocumento = element.idTipoDocumento;
            documento.DescripcionTipoDocumento = element.documento;
            documento.NroDocumento = element.nroDocumento;
            this.documentosTable = [...this.documentosTable, documento];
            this.dtsDocumentos.setData(this.documentosTable);
          });
          this.paciente.obraSociales.forEach(element => {
            let obraSocial = new ObrasocialRow();
            obraSocial.idObraSocial = element.idObraSocial;
            obraSocial.obraSocial = element.obraSocial;
            obraSocial.nroObraSocial = element.nroObraSocial;
            this.obrasSocialesTable = [...this.obrasSocialesTable, obraSocial];
            this.dtsObrasSociales.setData(this.obrasSocialesTable);
          });
          this.paciente.contactos.forEach(element => {
            let contacto = new TipoContactoRow();
            contacto.idTipoContacto = element.idTipoContacto;
            contacto.tipoContacto = element.tipoContacto;
            contacto.contacto = element.descContacto;
            this.TiposContactosTable = [...this.TiposContactosTable, contacto];
            this.dtsTipoContactos.setData(this.TiposContactosTable);
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
      case "ErrorEntidad0":
        this.MostrarMsj(error.MsgError?.toString()!, '#apellidoPacienteForm');
        break;
      case "ErrorEntidad1":
        this.MostrarMsj(error.MsgError?.toString()!, '#nombrePacienteForm');
        break;
      case "ErrorEntidadTipoDocumento3":
        this.MostrarMsj(error.MsgError?.toString()!, '#nombrePacienteForm');
        break;
      default:
        this.MostrarMsj(error.MsgError?.toString()!, '#apellidoPacienteForm');
        break;
    }
  }


  ModificarDatosPaciente(): void {
    let paciente = new ModPaciente();
    paciente.idPaciente = this.idPaciente;
    paciente.apellido = this.pacienteForm.get('apellidoPacienteForm')?.value!;
    paciente.nombre = this.pacienteForm.get('nombrePacienteForm')?.value!;

    this.pacienteServices.ModificarPaciente(paciente)
      .subscribe({
        next: (resultado) => {
          this.openOkDialog('FORMPACIENTE.TituloOkDialogModificar', 'FORMPACIENTE.MsjOkDialogModificar');
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

  CargarTiposDocumentos(): void {
    this.tipoDocumentoService.BuscarTiposDocumentosHabilitados()
      .subscribe((res) => {
        this.tiposDocumentos = res;
      });
  }
  AgregarDocumento(): void {
    let modDocumento = new ModDocumento();
    modDocumento.IdPaciente = this.idPaciente;
    modDocumento.IdTipoDocumento = Number(this.pacienteForm.get('tipodocumentoForm')?.value);
    modDocumento.NroDocumento = this.pacienteForm.get('nrodocumentoForm')?.value!;
    this.pacienteServices.AgregarPacienteDocumento(modDocumento)
      .subscribe({
        next: (resultado) => {
          this.AgregarDocumentoTable();
          this.esAgregarBotonDocumento = false;
          this.openOkDialog('FORMPACIENTE.TituloOkDialogModificarDocumento', 'FORMPACIENTE.MsjOkDialogModificarDocumento');
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
  ModificarDocumento(): void {
    let modDocumento = new ModDocumento();
    modDocumento.IdPaciente = this.idPaciente;
    modDocumento.IdTipoDocumento = Number(this.pacienteForm.get('tipodocumentoForm')?.value);
    modDocumento.NroDocumento = this.pacienteForm.get('nrodocumentoForm')?.value!;
    this.pacienteServices.ModificarPacienteDocumento(modDocumento)
      .subscribe({
        next: (resultado) => {
          this.AgregarDocumentoTable();
          this.esAgregarBotonDocumento = true;
          this.openOkDialog('FORMPACIENTE.MsjOkDialogModificarDocumento', 'FORMPACIENTE.TituloOkDialogModificarDocumento');
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
  EliminarDocumento(): void {
    this.pacienteForm.get('tipodocumentoForm')?.setValue('1');
    this.pacienteForm.get('nrodocumentoForm')?.setValue('');
    this.esAgregarBotonDocumento = true;
  }
  private AgregarDocumentoTable(): void {
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
  onRowClickDocumento(row: any) {
    let tipodocumento = row;
    this.documentosTable = this.documentosTable.filter(documento => { documento.idTipoDocumento != this.tipodocumento?.idTipoDocumento });
    this.dtsDocumentos.setData(this.documentosTable);
    this.pacienteForm.get('tipodocumentoForm')?.setValue(tipodocumento?.idTipoDocumento);
    this.pacienteForm.get('nrodocumentoForm')?.setValue(tipodocumento?.NroDocumento!);
    this.esAgregarBotonDocumento = false;
  }
  EstaCargadoDocumento(idTipoDocumento: number): boolean {
    const documento = this.documentosTable.find(value => value.idTipoDocumento == idTipoDocumento);
    if (documento != null) {
      return true;
    }
    return false;
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
  private EstaCargadaObraSocial(idObraSocial: number): boolean {
    const obraSocial = this.obrasSocialesTable.find(valor => valor.idObraSocial == idObraSocial);
    if (obraSocial != null) {
      return true;
    }
    return false;
  }
  CargarObraSociales(): void {
    this.obraSocialServices.BuscarObrasSocialesHabilitadas()
      .subscribe((res) => {
        this.obrasSociales = res;
      });
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

  EsApellidoInvalid() {
    return this.pacienteForm.get('apellidoPacienteForm')?.invalid;
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

  EsNombreInvalid() {
    return this.pacienteForm.get('nombrePacienteForm')?.invalid;
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

  EsEmailInvalid() {
    return this.pacienteForm.get('emailPacienteForm')?.invalid;
  }
  MensajeErrorEmail() {
    if (this.pacienteForm.get('emailPacienteForm')?.value != '') {
      if (this.pacienteForm.get('emailPacienteForm')?.errors) {
        return 'FORMPACIENTE.ErrorEmail';
      }
    }
    return '';
  }

  EsCelularInvalid() {
    return this.pacienteForm.get('celularPacienteForm')?.invalid;
  }
  MensajeErrorCelular() {
    if (this.pacienteForm.get('celularPacienteForm')?.value != '') {
      if (this.pacienteForm.get('celularPacienteForm')?.errors) {
        return 'FORMPACIENTE.ErrorCelular';
      }
    }
    return '';
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

  openOkDialog(titulo: string, mensaje: string) {
    const dialogRef = this.dialogOk.open(OkDialogComponent, {
      data: { titulo: titulo, mensaje: mensaje }
    });
  }

}
