import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntervencionRoutingModule } from './intervencion-routing.module';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ProgramacionPeriodicaIntervencionComponent } from './components/programacion-periodica-intervencion/programacion-periodica-intervencion.component';
import { EditarProgramacionPeriodicaComponent } from './components/editar-programacion-periodica/editar-programacion-periodica.component';
import { EditarAsociarSolicitudComponent } from './components/editar-asociar-solicitud/editar-asociar-solicitud.component';
import { ControlSolicitudesPmtComponent } from './components/control-solicitudes-pmt/control-solicitudes-pmt.component';
import { EditarAsociarCoiComponent } from './components/editar-asociar-coi/editar-asociar-coi.component';


@NgModule({
  declarations: [
    ProgramacionPeriodicaIntervencionComponent,
    EditarProgramacionPeriodicaComponent,
    EditarAsociarSolicitudComponent,
    ControlSolicitudesPmtComponent,
    EditarAsociarCoiComponent,
  ],
  imports: [
    CommonModule,
    IntervencionRoutingModule,
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
export class IntervencionModule { }
