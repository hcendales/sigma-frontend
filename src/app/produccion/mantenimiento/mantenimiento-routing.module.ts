import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignarConductorOperarioComponent } from './components/asignar-conductor-operario/asignar-conductor-operario.component';
import { ProgramarComponent } from './components/programar/programar.component';
import { ReportarFalloComponent } from './components/reportar-fallo/reportar-fallo.component';

const routes: Routes = [
  { path: 'gestionar', component: ProgramarComponent },
  { path: 'reportar-fallo', component: ReportarFalloComponent },
  { path: 'asignar-conductor-operario', component: AsignarConductorOperarioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
