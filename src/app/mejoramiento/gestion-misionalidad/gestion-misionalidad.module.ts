import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { GestionMisionalidadRoutingModule } from './gestion-misionalidad-routing.module';
import { GestionMisionalidadComponent } from './gestion-misionalidad.component';
import { GestionarMisionalidadComponent } from './components/gestionar-misionalidad/gestionar-misionalidad.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GestionarSeguimientoComponent } from './components/gestionar-seguimiento/gestionar-seguimiento.component';
import { DialogVerVisitaDiagnostico } from './components/gestionar-seguimiento/gestionar-seguimiento.component';
import { DialogVerVisitaDisenioComponent } from './components/gestionar-seguimiento/dialog-ver-visita-disenio/dialog-ver-visita-disenio.component';



@NgModule({
  declarations: [GestionMisionalidadComponent, GestionarMisionalidadComponent, GestionarSeguimientoComponent, DialogVerVisitaDiagnostico, DialogVerVisitaDisenioComponent],
  imports: [
    CommonModule,
    GestionMisionalidadRoutingModule,
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
  ]
})
export class GestionMisionalidadModule { }
