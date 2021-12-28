import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiquesAforosRoutingModule } from './apiques-aforos-routing.module';
import { ApiquesAforosComponent } from './apiques-aforos.component';
import { SolicitudesApiquesAforosComponent } from './components/solicitudes-apiques-aforos/solicitudes-apiques-aforos.component';
import { SolicitudDialogComponent } from './components/solicitud-dialog/solicitud-dialog.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatInputModule } from '@angular/material/input';
import {​​​​​ FormsModule, ReactiveFormsModule }​​​​​ from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider'; 
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AsociarAforosComponent } from './components/asociar-aforos/asociar-aforos.component';
import { RealizarSolicitudesComponent } from './components/realizar-solicitudes/realizar-solicitudes.component';
import { TablaPendientesApiquesComponent } from './components/tabla-pendientes-apiques/tabla-pendientes-apiques.component'; 


@NgModule({
  declarations: [ApiquesAforosComponent, SolicitudesApiquesAforosComponent, SolicitudDialogComponent, AsociarAforosComponent, RealizarSolicitudesComponent, TablaPendientesApiquesComponent],
  imports: [
    CommonModule,
    ApiquesAforosRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSliderModule,
    MatSortModule,
    SharedModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule
  ]
})
export class ApiquesAforosModule { }
