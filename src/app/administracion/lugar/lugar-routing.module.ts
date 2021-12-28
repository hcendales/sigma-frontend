import { ListarComponent } from './components/listar/listar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { InsertarComponent } from './components/insertar/insertar.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { VerComponent } from './components/ver/ver.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'actualizar', component: ActualizarComponent },
      { path: 'eliminar', component: EliminarComponent},
      { path: 'insertar', component: InsertarComponent },
      { path: 'listar', component: ListarComponent},
      { path: 'ver', component: VerComponent},
      { path: '**', redirectTo: 'listar'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LugarRoutingModule { }
