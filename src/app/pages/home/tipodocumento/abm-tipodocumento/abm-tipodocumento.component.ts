import { Component, Inject, InjectionToken, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAbmTipoDocumento } from './iabm-tipo-documento';
import { VerTipoDocumento } from './ver-tipo-documento';
import { AltaTipoDocumento } from './alta-tipo-documento';
import { ModificarTipoDocumento } from './modificar-tipo-documento';

export enum TipoABM {
  VER,
  ALTA,
  BAJA,
  MODIFICAR
}

export interface DialogData {
  tipoAbm: TipoABM,
  idTipoDocumento: number
}

@Component({
  selector: 'app-abm-tipodocumento',
  templateUrl: './abm-tipodocumento.component.html',
  styleUrls: ['./abm-tipodocumento.component.scss']
})
export class AbmTipodocumentoComponent implements OnInit {
  _tipoDocumentoForm = new FormGroup({
    descripcionTipoDocumentoForm: new FormControl()
  });
  EsVerBaja: boolean = false;
  dialogRef = inject(MatDialogRef<AbmTipodocumentoComponent>);

  private _abmTipoDocumento!: IAbmTipoDocumento
  public _Titulo: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.CargarComponent();
  }

  CargarComponent(): void {
    switch (this.data.tipoAbm) {
      case TipoABM.VER:
        this.EsVerBaja = true;
        this._Titulo = 'FORMTIPODOCUMENTO.matDialogTitleVer';
        this._abmTipoDocumento = new VerTipoDocumento(this._tipoDocumentoForm, this.data.idTipoDocumento);
        this._abmTipoDocumento.Ejecutar();
        break;
      case TipoABM.ALTA:
        this.EsVerBaja = false;
        this._Titulo = 'FORMTIPODOCUMENTO.matDialogTitleAlta';
        this._abmTipoDocumento = new AltaTipoDocumento(this._tipoDocumentoForm);
        break;
      case TipoABM.MODIFICAR:
        this.EsVerBaja = false;
        this._Titulo = 'FORMTIPODOCUMENTO.matDialogTitleModificar';
        this._abmTipoDocumento = new VerTipoDocumento(this._tipoDocumentoForm, this.data.idTipoDocumento);
        this._abmTipoDocumento.Ejecutar();
        this._abmTipoDocumento = new ModificarTipoDocumento(this._tipoDocumentoForm, this.data.idTipoDocumento);
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {

  }

  getEsVerBaja() {
    return this.EsVerBaja;
  }

  DescripcionInvalid(): boolean {
    return this._abmTipoDocumento.EsDescripcionInvalid();
  }

  getMensajeErrorDescripcion(): string {
    return this._abmTipoDocumento.MensajeErrorDescripcion();
  }

  getTitulo(): string {
    return this._Titulo;
  }

  Ejecutar(): void {
    this._abmTipoDocumento.Ejecutar();
    this.dialogRef.close();
  }
}