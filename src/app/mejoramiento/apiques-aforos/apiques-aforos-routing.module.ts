import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiquesAforosComponent } from './apiques-aforos.component';
import { SolicitudesApiquesAforosComponent } from './components/solicitudes-apiques-aforos/solicitudes-apiques-aforos.component';

const routes: Routes = [{ path: '', component: ApiquesAforosComponent },
                        { path: ':idActividad', component: SolicitudesApiquesAforosComponent },
                        ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiquesAforosRoutingModule { }
