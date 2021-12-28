import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlSolicitudesPmtComponent } from './components/control-solicitudes-pmt/control-solicitudes-pmt.component';
import { ProgramacionPeriodicaIntervencionComponent } from './components/programacion-periodica-intervencion/programacion-periodica-intervencion.component';

const routes: Routes = [
  { path: 'programacion-periodica', component: ProgramacionPeriodicaIntervencionComponent },
  { path: 'solicitudes-pmt/:idActividad', component: ControlSolicitudesPmtComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntervencionRoutingModule { }
