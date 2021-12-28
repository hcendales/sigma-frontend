import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarReservaComponent } from './components/gestionar-reserva/gestionar-reserva.component';
import { AuthGuard } from '../../core/security/services/auth-guard';

const routes: Routes = [{ path: '', component: GestionarReservaComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionReservaRoutingModule { }
