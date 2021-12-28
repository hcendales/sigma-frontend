import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisorFotosComponent } from './visor-fotos.component';

const routes: Routes = [{ path: '', component: VisorFotosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorFotosRoutingModule { }
