import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';


// Modulo
import { RevisionVisitaDiagnosticoRoutingModule } from './revision-visita-diagnostico-routing.module';
// Componente
import { RevisionVisitaDiagnosticoComponent } from './components/revision-visita-diagnostico/revision-visita-diagnostico.component';
import { RevisarVisitaDiagnosticoComponent } from './components/revisar-visita-diagnostico/revisar-visita-diagnostico.component';


@NgModule({
  declarations: [RevisarVisitaDiagnosticoComponent],
  imports: [
    CommonModule,
    RevisionVisitaDiagnosticoRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class RevisionVisitaDiagnosticoModule { }
