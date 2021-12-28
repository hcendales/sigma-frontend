import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../core/security/services/auth-guard';
import { RegistrarServicioComponent } from './components/registrar-servicio/registrar-servicio.component';
import { SolicitudEnsayoLaboratorioComponent } from './components/solicitud-ensayo-laboratorio/solicitud-ensayo-laboratorio.component';

const routes: Routes = [{ path: '', component: SolicitudEnsayoLaboratorioComponent },
                        { path: 'nuevo', component: RegistrarServicioComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudEnsayoLaboratorioRoutingModule { }
