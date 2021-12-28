import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultasMejoramientoComponent } from './consultas-mejoramiento.component';
import { AuthGuard } from '../../core/security/services/auth-guard';
import { ConsultaGeneralGestionComponent } from './components/consulta-general-gestion/consulta-general-gestion.component';
import { ConsultaHistorialComponent } from './components/consulta-historial/consulta-historial.component';
import { VerDetalleMantenimientoComponent } from './components/ver-detalle-mantenimiento/ver-detalle-mantenimiento.component';

const routes: Routes = [{ path: '', component: ConsultasMejoramientoComponent },
                        { path: 'consulta-general/:tipoConsulta', component: ConsultaGeneralGestionComponent, canActivate:[AuthGuard]},
                        { path: 'consulta-historial', component: ConsultaHistorialComponent, canActivate:[AuthGuard]},
                        { path: 'ver-detalle/:idMantenimiento', component: VerDetalleMantenimientoComponent},
                      ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasMejoramientoRoutingModule { }
