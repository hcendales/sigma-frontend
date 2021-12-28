import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidarDisenoRoutingModule } from './validar-diseno-routing.module';
import { ValidarDisenoComponent } from './components/validar-diseno/validar-diseno.component';


@NgModule({
  declarations: [ValidarDisenoComponent],
  imports: [
    CommonModule,
    ValidarDisenoRoutingModule
  ]
})
export class ValidarDisenoModule { }
