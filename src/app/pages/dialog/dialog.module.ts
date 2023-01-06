import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogRoutingModule } from './dialog-routing.module';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ErrorDialogComponent
  ],
  imports: [
    CommonModule,
    DialogRoutingModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule 
  ]
})
export class DialogModule { }
