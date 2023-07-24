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
import { AbmTipodocumentoComponent } from './tipodocumento/abm-tipodocumento/abm-tipodocumento.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    ConfigDialogComponent,
    PacienteComponent,
    MedicoComponent,
    TipodocumentoComponent,
    AbmTipodocumentoComponent
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
    MatTableModule,
    MatPaginatorModule
  ]
})
export class HomeModule { }
