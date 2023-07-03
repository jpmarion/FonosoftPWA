import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ConfirmarRegistroComponent } from './confirmar-registro/confirmar-registro.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'confirmarregistro/:nombreusuario', component: ConfirmarRegistroComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
