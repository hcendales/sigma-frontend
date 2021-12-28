import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarVisitaRoutingModule } from './asignar-visita-routing.module';
import { AsignarVisitasComponent, DialogVerVisitaDiseno } from './components/asignar-visitas/asignar-visitas.component';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { AgendaVisitasComponent } from './components/agenda-visitas/agenda-visitas.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatListModule} from '@angular/material/list';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsignarRecursoComponent } from './components/asignar-recurso/asignar-recurso.component';
import { VerGrupoComponent } from './components/ver-grupo/ver-grupo.component';

@NgModule({
  declarations: [AsignarVisitasComponent, AgendaVisitasComponent, AsignarRecursoComponent, DialogVerVisitaDiseno, VerGrupoComponent],
  imports: [
    CommonModule,
    AsignarVisitaRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule
  ]
})
export class AsignarVisitaModule { }
