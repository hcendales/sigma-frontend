import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../core/security/services/auth-guard';
import { ValidacionVisitaDiagnosticoComponent } from './validacion-visita-diagnostico.component';
import { ValidarVisitaDiagnosticoComponent } from './components/validar-visita-diagnostico/validar-visita-diagnostico.component';

const routes: Routes = [{ path: '', component: ValidacionVisitaDiagnosticoComponent },
                        { path: 'validar', component: ValidarVisitaDiagnosticoComponent, canActivate: [AuthGuard], data:{idActividad:5}},
                        { path: 'validar-diseno', component: ValidarVisitaDiagnosticoComponent, canActivate: [AuthGuard], data:{idActividad:5}},
                      {}];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidacionVisitaDiagnosticoRoutingModule { }
