import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroVisitaDiagnosticoComponent } from './registro-visita-diagnostico.component';
import { AutoprogramarVisitaComponent } from './components/autoprogramar-visita/autoprogramar-visita.component';
import { RegistroVisitaComponent } from './components/registro-visita/registro-visita.component';

import { AuthGuard } from '../../core/security/services/auth-guard';

const routes: Routes = [
                        { path: '', component: RegistroVisitaDiagnosticoComponent },
                        { path: 'autoprogramar', component: AutoprogramarVisitaComponent, canActivate:[AuthGuard] },
                        { path: 'registro', component: RegistroVisitaComponent, canActivate:[AuthGuard] },
                        { path: 'registro/:idEvento', component: RegistroVisitaComponent, canActivate:[AuthGuard] },
                        { path: 'registro-predisenio/:idEvento', component: RegistroVisitaComponent, canActivate:[AuthGuard] },
                       ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroVisitaDiagnosticoRoutingModule { }
