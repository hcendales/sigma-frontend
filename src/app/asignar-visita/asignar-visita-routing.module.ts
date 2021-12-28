import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarVisitasComponent } from './components/asignar-visitas/asignar-visitas.component';
import { AgendaVisitasComponent } from './components/agenda-visitas/agenda-visitas.component';
import { AuthGuard } from '../core/security/services/auth-guard';

const routes: Routes = [
  { path: 'responsable', component: AgendaVisitasComponent},
  { path: ':idActividad', component: AsignarVisitasComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignarVisitaRoutingModule { }
