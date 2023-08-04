import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatMenuModule } from '@angular/material/menu';
import { MenuComponent } from './menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ConfigDialogComponent } from './config-dialog/config-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacienteComponent } from './paciente/paciente.component';
import { MatTableModule } from '@angular/material/table';
import { MedicoComponent } from './medico/medico.component';
import { TipodocumentoComponent } from './tipodocumento/tipodocumento.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserModule } from '@angular/platform-browser';
import { VerTipoDocumentoComponent } from './tipodocumento/ver-tipo-documento/ver-tipo-documento.component';
import { ModificarTipoDocumentoComponent } from './tipodocumento/modificar-tipo-documento/modificar-tipo-documento.component';
import { CambiarEstadoTipoDocumentoComponent } from './tipodocumento/cambiar-estado-tipo-documento/cambiar-estado-tipo-documento.component';
import { AltaTipoDocumentoComponent } from './tipodocumento/alta-tipo-documento/alta-tipo-documento.component';
import { ObrasocialComponent } from './obrasocial/obrasocial.component';
import { AltaObraSocialComponent } from './obrasocial/alta-obra-social/alta-obra-social.component';
import { ModificarObraSocialComponent } from './obrasocial/modificar-obra-social/modificar-obra-social.component';
import { VerObraSocialComponent } from './obrasocial/ver-obra-social/ver-obra-social.component';
import { CambiarEstadoObraSocialComponent } from './obrasocial/cambiar-estado-obra-social/cambiar-estado-obra-social.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    ConfigDialogComponent,
    PacienteComponent,
    MedicoComponent,
    TipodocumentoComponent,
    VerTipoDocumentoComponent,
    ModificarTipoDocumentoComponent,
    CambiarEstadoTipoDocumentoComponent,
    AltaTipoDocumentoComponent,
    ObrasocialComponent,
    AltaObraSocialComponent,
    ModificarObraSocialComponent,
    VerObraSocialComponent,
    CambiarEstadoObraSocialComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatCardModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class HomeModule { }
