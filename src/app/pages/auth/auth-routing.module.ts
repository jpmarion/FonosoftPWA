import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmarRegistroComponent } from './confirmar-registro/confirmar-registro.component';

const routes: Routes = [
  { path: 'confirmarregistro/:id', component: ConfirmarRegistroComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
