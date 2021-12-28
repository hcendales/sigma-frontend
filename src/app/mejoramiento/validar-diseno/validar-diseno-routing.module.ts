import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidarDisenoComponent } from './components/validar-diseno/validar-diseno.component';
import { AuthGuard } from '../../core/security/services/auth-guard';

const routes: Routes = [
  { path: '', component: ValidarDisenoComponent },
  { path: 'validar-disenio/:idEvento', component: ValidarDisenoComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidarDisenoRoutingModule { }
