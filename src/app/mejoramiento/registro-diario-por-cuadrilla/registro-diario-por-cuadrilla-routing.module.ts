import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/security/services/auth-guard';
import { RegistroDiarioComponent } from './components/registro-diario/registro-diario.component';
import { TabSeccionesComponent } from './components/tab-secciones/tab-secciones.component';

const routes: Routes = [
    { path: '', component: RegistroDiarioComponent, canActivate: [AuthGuard] },
    { path: 'nuevo', component: TabSeccionesComponent, canActivate: [AuthGuard] },
    { path: 'detalle/:id/:pk', component: TabSeccionesComponent, canActivate: [AuthGuard] },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegistroDiarioPorCuadrillaRoutingModule { }
