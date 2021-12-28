import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

import { CarguesMejoramientoRoutingModule } from './cargues-mejoramiento-routing.module';
import { CarguesMejoramientoComponent } from './cargues-mejoramiento.component';
import { ProgramacionVisitaTecnicaComponent } from './programacion-visita-tecnica/programacion-visita-tecnica.component';
import { SincroniacionSPIComponent } from './sincroniacion-spi/sincroniacion-spi.component';


@NgModule({
  declarations: [CarguesMejoramientoComponent, ProgramacionVisitaTecnicaComponent, SincroniacionSPIComponent],
  imports: [
    CommonModule,
    CarguesMejoramientoRoutingModule,
    SharedModule,
    MatCardModule,
  ]
})
export class CarguesMejoramientoModule { }
