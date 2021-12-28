import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionMisionalidadComponent } from './gestion-misionalidad.component';
import { GestionarMisionalidadComponent } from './components/gestionar-misionalidad/gestionar-misionalidad.component';
import { GestionarSeguimientoComponent } from './components/gestionar-seguimiento/gestionar-seguimiento.component';
import { AuthGuard } from '../../core/security/services/auth-guard';

const routes: Routes = [{ path: 'gestionar-filtros/:idActividad', component: GestionarMisionalidadComponent },
                        { path: 'gestionar/:idActividad', component: GestionarSeguimientoComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionMisionalidadRoutingModule { }
