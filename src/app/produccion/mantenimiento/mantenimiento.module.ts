import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { ProgramarComponent } from './components/programar/programar.component';
import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {​​​​​ FormsModule }​​​​​ from'@angular/forms';
import { ReactiveFormsModule }​​ from'@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditarProgramacionComponent } from './components/editar-programacion/editar-programacion.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DialogoMotivoCancelacionComponent } from './components/dialogo-motivo-cancelacion/dialogo-motivo-cancelacion.component';
import { ReportarFalloComponent } from './components/reportar-fallo/reportar-fallo.component';
import { EditarReporteFalloComponent } from './components/editar-reporte-fallo/editar-reporte-fallo.component';
import { AsignarConductorOperarioComponent } from './components/asignar-conductor-operario/asignar-conductor-operario.component';
import { EditarAsignacionComponent } from './components/editar-asignacion/editar-asignacion.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CalendarioAsignacionCoComponent } from './components/calendario-asignacion-co/calendario-asignacion-co.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    ProgramarComponent, 
    EditarProgramacionComponent, 
    DialogoMotivoCancelacionComponent, 
    ReportarFalloComponent,
    EditarReporteFalloComponent,
    AsignarConductorOperarioComponent,
    EditarAsignacionComponent,
    CalendarioAsignacionCoComponent,
  ],
  providers: [
    DatePipe,
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    SharedModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatMomentDateModule,
  ]
})
export class MantenimientoModule { }
