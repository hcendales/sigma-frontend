import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursoSemanaRoutingModule } from './recurso-semana-routing.module';
import { ListarComponent } from './components/listar/listar.component';
import { InsertarComponent } from './components/insertar/insertar.component';
import { ActualizarComponent } from './components/actualizar/actualizar.component';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {​​​​​ FormsModule, ReactiveFormsModule }​​​​​ from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTabsModule} from '@angular/material/tabs';
import { VerComponent } from './components/ver/ver.component';

import { VerEquipoComponent } from '../recurso/components/ver-equipo/ver-equipo.component';
import { ListarFranjaComponent } from '../recurso/components/listar-franja/listar-franja.component';


@NgModule({
  declarations: [ListarComponent, InsertarComponent, ActualizarComponent, VerComponent],
  imports: [
    CommonModule,
    RecursoSemanaRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatListModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTabsModule
  ]
})
export class RecursoSemanaModule { }
