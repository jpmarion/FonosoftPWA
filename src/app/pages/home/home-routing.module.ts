import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { HomeComponent } from './home.component';
import { MedicoComponent } from './medico/medico.component';
import { PacienteComponent } from './paciente/paciente.component';
import { TipodocumentoComponent } from './tipodocumento/tipodocumento.component';
import { ObrasocialComponent } from './obrasocial/obrasocial.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'paciente', component: PacienteComponent, outlet: 'homecomponent' },
      { path: 'medico', component: MedicoComponent, outlet: 'homecomponent' },
      { path: 'tipodocumento', component: TipodocumentoComponent, outlet: 'homecomponent' },
      { path: 'obrasocial', component: ObrasocialComponent, outlet: 'homecomponent' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
