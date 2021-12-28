import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../core/security/services/auth-guard';

import { RegistroVisitaVerificacionComponent } from './registro-visita-verificacion.component';
import { ListaVerificacionComponent } from '../components/lista-verificacion/lista-verificacion.component';
const routes: Routes = [
                        { path: 'captura-verificacion/:idMantenimientoVial', component: RegistroVisitaVerificacionComponent },
                        { path: 'lista-verificacion/:idActividad', component: ListaVerificacionComponent }
                       ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroVisitaVerificacionRoutingModule { }
