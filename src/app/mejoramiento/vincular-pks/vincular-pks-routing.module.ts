import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VincularPeticionarioComponent } from './components/vincular-peticionario/vincular-peticionario.component';
import { GestionarPeticionarioComponent } from './components/gestionar-peticionario/gestionar-peticionario.component';
import { AuthGuard } from '../../core/security/services/auth-guard';
import { AsignarMisionalidadComponent } from './components/asignar-misionalidad/asignar-misionalidad.component';
import { AsignarSeguimientoComponent } from './components/asignar-seguimiento/asignar-seguimiento.component';
const routes: Routes = [
                        { path: '', component: VincularPeticionarioComponent },
                        { path: 'gestionar-peticionario', component: GestionarPeticionarioComponent },
                        { path: 'asignar-misionalidad', component: AsignarMisionalidadComponent },
                        { path: 'asignar-seguimiento', component: AsignarSeguimientoComponent },                        
                       ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VincularPksRoutingModule { }
