import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecursoRoutingModule } from './recurso-routing.module';
import { ListarComponent } from './components/listar/listar.component';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { InsertarComponent } from './components/insertar/insertar.component';
import { VerComponent } from './components/ver/ver.component';

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
import { VerPersonaComponent } from './components/ver-persona/ver-persona.component';
import {MatTabsModule} from '@angular/material/tabs';
import { VerEquipoComponent } from './components/ver-equipo/ver-equipo.component';
import { VerLugarComponent } from './components/ver-lugar/ver-lugar.component';
import { ListarFranjaComponent } from './components/listar-franja/listar-franja.component';
import { ListarNovedadComponent } from './components/listar-novedad/listar-novedad.component';
import { InsertarNovedadComponent } from './components/insertar-novedad/insertar-novedad.component';
import { ActualizarNovedadComponent } from './components/actualizar-novedad/actualizar-novedad.component';
import { InsertarFranjaComponent } from './components/insertar-franja/insertar-franja.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatSortModule} from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [ListarComponent, ActualizarComponent, EliminarComponent, InsertarComponent, VerComponent, VerPersonaComponent, VerEquipoComponent, VerLugarComponent, ListarFranjaComponent, ListarNovedadComponent, InsertarNovedadComponent, ActualizarNovedadComponent, InsertarFranjaComponent],
  imports: [
    CommonModule,
    RecursoRoutingModule,
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
    MatTabsModule,
    MatAutocompleteModule,
    MatSortModule,
    MatNativeDateModule,
    MomentDateModule,
    MatMomentDateModule

  ],
})
export class RecursoModule { }
