import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AforosComponent } from './aforos.component';
import { RegistroAforosComponent } from './components/registro-aforos/registro-aforos.component';

const routes: Routes = [{ path: '', component: AforosComponent },
                        { path: 'registro', component: RegistroAforosComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AforosRoutingModule { }
