import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultadoEnsayoComponent } from './components/resultado-ensayo/resultado-ensayo.component';
import { TabsDistribuidorComponent } from './components/tabs-distribuidor/tabs-distribuidor.component';

const routes: Routes = [
  {path: '',component: ResultadoEnsayoComponent},
  {path: 'detalle/:id', component: TabsDistribuidorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargueResultadoEnsayoRoutingModule { }
