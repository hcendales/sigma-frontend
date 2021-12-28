import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistroDisenoComponent } from './components/registro-diseno/registro-diseno.component';
import { AuthGuard } from '../../core/security/services/auth-guard';
const routes: Routes = [
  { path: '', component: RegistroDisenoComponent },
  { path: 'registro-disenio/:idEvento', component: RegistroDisenoComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrarDisenoRoutingModule { }
