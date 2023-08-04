import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SiNoDialogComponent } from '../../dialog/si-no-dialog/si-no-dialog.component';
import { ConfigDialogComponent } from '../config-dialog/config-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dialogoSalir: MatDialog
  ) { }

  irPacientes(): void {
    this.router.navigate(['home', { outlets: { homecomponent: ['paciente'] } }]);
  }

  irMedicos(): void {
    this.router.navigate(['home', { outlets: { homecomponent: ['medico'] } }]);
  }

  irTipoDocumento(): void {
    this.router.navigate(['home', { outlets: { homecomponent: ['tipodocumento'] } }]);
  }

  irObraSocial():void{
    this.router.navigate(['home', { outlets: { homecomponent: ['obrasocial'] } }]);
  }

  abrirConfigDialog(): void {
    const dialogRef = this.dialog.open(ConfigDialogComponent);
  }

  logOut(): void {
    this.dialogoSalir.open(SiNoDialogComponent, {
      data: { titulo: "NAV.tituloSalirDialog", mensaje: "NAV.msjSalirDialog" }
    })
      .afterClosed()
      .subscribe((si: boolean) => {
        if (si) {
          localStorage.removeItem('idUsuario');
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }
      })
  }
}