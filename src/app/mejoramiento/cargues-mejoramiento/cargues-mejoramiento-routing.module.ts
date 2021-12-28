import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarguesMejoramientoComponent } from './cargues-mejoramiento.component';
import { ProgramacionVisitaTecnicaComponent } from './programacion-visita-tecnica/programacion-visita-tecnica.component';
import { SincroniacionSPIComponent } from './sincroniacion-spi/sincroniacion-spi.component';
import { AuthGuard } from '../../core/security/services/auth-guard';

const routes: Routes = [{ path: '', component: CarguesMejoramientoComponent },
                        { path: 'programacion-visita-tecnica', component: ProgramacionVisitaTecnicaComponent, canActivate:[AuthGuard]},
                        { path: 'spi-a-smvl', component: SincroniacionSPIComponent, canActivate:[AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarguesMejoramientoRoutingModule { }
