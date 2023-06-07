import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISiNoDialogData } from './ISiNoDialogData';

@Component({
  selector: 'app-si-no-dialog',
  templateUrl: './si-no-dialog.component.html',
  styleUrls: ['./si-no-dialog.component.scss']
})
export class SiNoDialogComponent {
  constructor(
    public dialegRef: MatDialogRef<SiNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISiNoDialogData
  ) { }

  Si(): void {
    this.dialegRef.close(true);
  }

  No(): void {
    this.dialegRef.close(false);
  }
}
