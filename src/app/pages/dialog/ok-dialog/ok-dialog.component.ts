import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOkDialog } from './IOkDialog';

@Component({
  selector: 'app-ok-dialog',
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.scss']
})
export class OkDialogComponent implements OnInit {
  constructor(
    public dialogRefOkComponent: MatDialogRef<OkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IOkDialog
  ) {
    dialogRefOkComponent.disableClose = true;
  }

  ngOnInit(): void { }
  
}
