import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

import { ValidacionVisitaDiagnosticoRoutingModule } from './validacion-visita-diagnostico-routing.module';
import { ValidacionVisitaDiagnosticoComponent } from './validacion-visita-diagnostico.component';
import { ValidarVisitaDiagnosticoComponent } from './components/validar-visita-diagnostico/validar-visita-diagnostico.component';


@NgModule({
  declarations: [ValidacionVisitaDiagnosticoComponent, ValidarVisitaDiagnosticoComponent],
  imports: [
    CommonModule,
    ValidacionVisitaDiagnosticoRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ValidacionVisitaDiagnosticoModule { }
