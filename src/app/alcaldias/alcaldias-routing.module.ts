import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlcaldiasComponent } from './alcaldias.component';
import { CambioContraseniaComponent } from './components/cambio-contrasenia/cambio-contrasenia.component';

const routes: Routes = [{ path: '', component: AlcaldiasComponent },
                        { path: 'cambio-contrasena', component: CambioContraseniaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlcaldiasRoutingModule { }
