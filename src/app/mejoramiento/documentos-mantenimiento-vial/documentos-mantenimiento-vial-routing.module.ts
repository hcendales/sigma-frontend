import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/security/services/auth-guard';

import { CargueDocumentosComponent } from './components/cargue-documentos/cargue-documentos.component';
import { DetalleDocumentosComponent } from './components/detalle-documentos/detalle-documentos.component';

const routes: Routes = [
  { path: '', component: CargueDocumentosComponent, canActivate: [AuthGuard] },
  { path: 'detalle/:id', component: DetalleDocumentosComponent, canActivate: [AuthGuard] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosMantenimientoVialRoutingModule { }
