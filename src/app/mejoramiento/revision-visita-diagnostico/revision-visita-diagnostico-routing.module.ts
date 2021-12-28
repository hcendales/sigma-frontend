import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componente
import { RevisionVisitaDiagnosticoComponent } from './components/revision-visita-diagnostico/revision-visita-diagnostico.component';
import { RevisarVisitaDiagnosticoComponent } from './components/revisar-visita-diagnostico/revisar-visita-diagnostico.component';
import { AuthGuard } from '../../core/security/services/auth-guard';

const routes: Routes = [
  { path: '', component: RevisionVisitaDiagnosticoComponent },
  { path: 'revisar-visita', component: RevisionVisitaDiagnosticoComponent },
  { path: 'revisar-visita/:idMantenimientoEvento', component: RevisarVisitaDiagnosticoComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevisionVisitaDiagnosticoRoutingModule { }
