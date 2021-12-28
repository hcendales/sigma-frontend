import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RevisarDisenoComponent } from './components/revisar-diseno/revisar-diseno.component';
import { AuthGuard } from '../../core/security/services/auth-guard';

const routes: Routes = [
  { path: '', component: RevisarDisenoComponent },
  { path: 'revisar-visita', component: RevisarDisenoComponent },
  { path: 'revisar-visita/:idMantenimientoEvento', component: RevisarDisenoComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevisarDisenoRoutingModule { }
